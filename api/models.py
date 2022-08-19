from django.db import models
from django.conf import settings
from django.contrib.auth.models import User
from collections import defaultdict
from django.db.models import Q
from django.utils.crypto import get_random_string
from django.core.exceptions import ValidationError
from django.db.models.signals import post_save
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
def update_stock(sender, instance, **kwargs):
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
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)
    group_expenses = models.ManyToManyField(GroupExpense, blank=True)
    group_name = models.TextField(default='Group chat', blank=True, max_length=40)
    created_at = models.DateTimeField(auto_now_add=True)
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


class FriendsInvitation(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sender")
    invited = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="invited")

    def __str__(self) -> str:
        return self.sender.username + ": " + self.invited.username
