from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from collections import defaultdict
from django.db.models import Q
from django.utils.crypto import get_random_string
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save, pre_save, m2m_changed
from django.dispatch import receiver
# Create your models here.


types = (("Other","Other"), ("Restaurant","Restaurant"), ("Transport","Transport"), ("Rent","Rent"), 
         ("Alcohol","Alcohol"), ("Groceries","Groceries"), ("Tickets","Tickets"))

TRUE_FALSE_CHOICES = (
    (True, 'Total'),
    (False, 'Each')
)


def upload_to(instance, filename):
    name = get_random_string(length=16)
    return f'avatars/{name}.png'.format(filename=filename)


def validate_image(fieldfile_obj):
    filesize = fieldfile_obj.file.size
    megabyte_limit = 0.3
    if filesize > megabyte_limit*1024*1024:
        raise ValidationError("Max file size is %sMB" % str(megabyte_limit))


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    friends = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="friends")
    avatar = models.ImageField(upload_to=upload_to, blank=True, null=True, validators=[validate_image])

    __previous_avatar_name = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.avatar.name:
            self.__previous_avatar_name = self.avatar.name

    def delete(self, using=None, keep_parents=False):
        if self.avatar.name:
            self.avatar.storage.delete(self.__previous_avatar_name)
        super().delete()

    def save(self, *args, **kwargs):
        if self.avatar.name != self.__previous_avatar_name and self.__previous_avatar_name:
            self.avatar.storage.delete(self.__previous_avatar_name)
            self.__previous_avatar_name = self.avatar.name
        super(Account, self).save(*args, **kwargs)

    def __str__(self) -> str:
        return self.user.username


@receiver(post_save, sender=User, dispatch_uid="create_account")
def create_account(sender, instance, **kwargs):
    account = Account(user=instance)
    account.save()


class Expense(models.Model):
    name = models.TextField(default='', blank=True, max_length=40)
    category = models.CharField(choices=types, default=types[0], max_length=15)
    amount = models.DecimalField(default=0, blank=True, max_digits=8, decimal_places=2)
    splitted = models.BooleanField(choices = TRUE_FALSE_CHOICES, blank=False, default=True)
    date = models.DateTimeField(auto_now_add=True)
    ower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ower")
    payer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payer")
    is_paid = models.BooleanField(default=False)
    settled = models.BooleanField(default=False)
    hash = models.TextField(default='', blank=True)

    def __str__(self) -> str:
        if self.name == '':
            return 'Some expense'
        return self.name

    def delete_group_expense(self):
        similar_expenses = Expense.objects.filter(hash=self.hash).exclude(id=self.id)
        if not similar_expenses:
            group_expense = GroupExpense.objects.get(expenses=self)
            if group_expense:
                group_expense.delete()

    def delete(self, parent=False):
        if not parent:
            self.delete_group_expense()
        super(Expense, self).delete()


class GroupExpense(models.Model):
    expenses = models.ManyToManyField(Expense, blank=True)
    total = models.DecimalField(default=0, blank=True, max_digits=8, decimal_places=2)

    def __str__(self) -> str:
        if len(self.expenses.all()) == 0:
            return "Group Expense"
        return self.expenses.all()[0].name

    def delete_expenses(self):
        for expense in self.expenses.all():
            expense.delete(True)

    def delete(self):
        self.delete_expenses()
        super(GroupExpense, self).delete()


class Group(models.Model):
    users = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="members")
    admins = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="admins", blank=True)
    group_expenses = models.ManyToManyField(GroupExpense, blank=True)
    group_name = models.TextField(default='New group', blank=True, max_length=40)
    created_at = models.DateTimeField(auto_now_add=True)
    avatar = models.ImageField(upload_to=upload_to, blank=True, null=True, validators=[validate_image])

    __previous_avatar_name = None
    __previous_users_ids = None

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        if self.avatar.name:
            self.__previous_avatar_name = self.avatar.name


    def delete(self, using=None, keep_parents=False):
        if self.avatar.name:
            self.avatar.storage.delete(self.__previous_avatar_name)
        super().delete()

    def save(self, *args, **kwargs):
        if self.avatar.name != self.__previous_avatar_name and self.__previous_avatar_name:
            self.avatar.storage.delete(self.__previous_avatar_name)
            self.__previous_avatar_name = self.avatar.name
        # if group already exists
        if self.id is not None:
            # if group users is empty
            if not self.users.exists():
                super().delete()
                return
        super(Group, self).save(*args, **kwargs)

    def __str__(self) -> str:
        if self.group_name == '':
            return 'Group chat'
        return self.group_name


    def total_spent(self):
        return sum(expense.expenses.all()[0].amount for expense in self.group_expenses.all())

    def spent_by_category(self):
        spent = {}
        for type in types:
            spent[type[0]] = sum(expense.expenses.all()[0].amount for expense in self.group_expenses.all() if expense.expenses.all()[0].category == type[0])
        return spent

    def balance(self, user):

        def def_value():
            return 0

        # debts = defaultdict(def_value)
        # owes = defaultdict(def_value)
        balance = 0

        for group_expense in self.group_expenses.all():
            expenses = group_expense.expenses.filter(Q(ower=user) | Q(payer=user) | Q(settled=False))
            for expense in expenses.filter(Q(ower=user)):
                balance -= expense.amount
            for expense in expenses.filter(Q(payer=user)):
                balance += expense.amount
        # if merge:
        return balance


    def balance_all_usesrs(self, merge=True):

        def def_value():
            return 0

        # debts = defaultdict(def_value)
        # owes = defaultdict(def_value)
        balance = defaultdict(def_value)

        for group_expense in self.group_expenses.all():
            for expense in group_expense.expenses.all():
                balance[expense.ower.username] -= expense.amount
                balance[expense.payer.username] += expense.amount
        # if merge:
        return balance
        # return dict(Counter(debts)+Counter(owes))
        # return {"debts": debts, "owes": owes}

### TO DO:
# what if add multiple users where one is payer and other is ower
# same with removing
# should expenses with a removed payer be deleted?

# @receiver(m2m_changed, sender=Group.users.through, dispatch_uid="update_amounts")
# def update_amounts(sender, instance, **kwargs):
#     # if adding (or removing) new member to group -> change prices of all expenses (include him in every expense)
#     # and add new expenses with him as an ower
#     # when removing do not remove expenses as a payer, but delete expenses as an ower

#     if kwargs["action"] in ["pre_add", "pre_remove"]:
#         instance.__previous_users_ids = list(instance.users.all().values_list('id', flat=True))
#     else:
#         new_members_number = instance.users.all().count()
#         for group_expense in instance.group_expenses.all():
#             new_amount = group_expense.total / new_members_number
#             # if added users
#             if kwargs["action"] == "post_add":
#                 added_users = instance.users.exclude(id__in=instance.__previous_users_ids)
#                 # if added person is payer do not create new expense nor update price
#                 if group_expense.expenses.filter(payer__in=added_users).exists():
#                     continue
#                 for user in added_users:
#                     new_expense = group_expense.expenses.all()[0]
#                     new_expense.id = None
#                     new_expense.ower = user
#                     new_expense.settled = False
#                     new_expense.is_paid = False
#                     new_expense.amount = new_amount
#                     new_expense.save()
#                     group_expense.expenses.add(new_expense)
#             # if removed users
#             elif kwargs["action"] == "post_remove":
#                 left_users_ids = list(instance.users.all().values_list('id', flat=True))
#                 removed_users_ids = list(id for id in instance.__previous_users_ids if id not in left_users_ids)
#                 removed_users = User.objec%}ts.filter(id__in=removed_users_ids)
#                 if group_expense.expenses.filter(payer__in=removed_users).exists():
#                     continue
#                 if removed_users.exists():
#                     for user in removed_users:
#                         expense_to_remove = group_expense.objects.get(ower=user)
#             for expense in group_expense.expenses.all():
#                 expense.amount = new_amount
#                 expense.save()


class FriendsInvitation(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sender")
    invited = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="invited")

    def __str__(self) -> str:
        return self.sender.username + ": " + self.invited.username
