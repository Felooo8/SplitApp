from django.db import models
from django.conf import settings
from django.contrib.auth.models import User

# Create your models here.


types = (("Other","Other"), ("Restaurant","Restaurant"), ("Transport","Transport"), ("Rent","Rent"), 
         ("Alcohol","Alcohol"), ("Groceries","Groceries"), ("Tickets","Tickets"))

TRUE_FALSE_CHOICES = (
    (True, 'Total'),
    (False, 'Each')
)


class Account(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    friends = models.ManyToManyField(settings.AUTH_USER_MODEL, related_name="friends")



class Expense(models.Model):
    name = models.TextField(default='', blank=True)
    category = models.CharField(choices=types, default=types[0], max_length=15)
    total = models.DecimalField(default=0, blank=True, max_digits=8, decimal_places=2)
    splitted = models.BooleanField(choices = TRUE_FALSE_CHOICES, blank=False, default=True)
    date = models.DateTimeField(auto_now_add=True)
    ower = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="ower")
    payer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payer")
    is_paid = models.BooleanField(default=False)
    settled = models.BooleanField(default=False)

    def __str__(self) -> str:
        if self.name == '':
            return 'Some expense'
        return self.name


class GroupExpense(models.Model):
    expenses = models.ManyToManyField(Expense, blank=True)

    def __str__(self) -> str:
        if len(self.expenses.all()) == 0:
            return "Group Expense"
        return self.expenses.all()[0].name



class Group(models.Model):
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)
    group_expenses = models.ManyToManyField(GroupExpense, blank=True)
    group_name = models.TextField(default='Group chat', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        if self.group_name == '':
            return 'Group chat'
        return self.group_name

    def total_spent(self):
        return sum(expense.expenses.all()[0].total for expense in self.group_expenses.all())

    def spent_by_category(self):
        spent = {}
        for type in types:
            spent[type[0]] = sum(expense.expenses.all()[0].total for expense in self.group_expenses.all() if expense.expenses.all()[0].category == type[0])
        return spent


class FriendsInvitation(models.Model):
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="sender")
    invited = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="invited")
    accepted = models.BooleanField(default=False)
