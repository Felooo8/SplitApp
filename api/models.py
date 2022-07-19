from tkinter import CASCADE
from django.db import models
from django.conf import settings

# Create your models here.


types = (("Other","Other"), ("Restaurant","Restaurant"), ("Transport","Transport"), ("Rent","Rent"), 
         ("Alcohol","Alcohol"), ("Groceries","Groceries"), ("Tickets","Tickets"))

TRUE_FALSE_CHOICES = (
    (True, 'Total'),
    (False, 'Each')
)

class ExpenseBase(models.Model):
    name = models.TextField(default='', blank=True)
    category = models.CharField(choices=types, default=types[0], max_length=15)
    total = models.DecimalField(default=0, blank=True, max_digits=8, decimal_places=2)
    splitted = models.BooleanField(choices = TRUE_FALSE_CHOICES, blank=False, default=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        if self.name == '':
            return 'Some expense'
        return self.name

    class Meta:
        abstract = True

class Expense(ExpenseBase):
    payer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="payer")
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)

class ExpenseGroup(ExpenseBase):
    payer = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="group_payer")


class Group(models.Model):
    users = models.ManyToManyField(settings.AUTH_USER_MODEL)
    group_expenses = models.ManyToManyField(ExpenseGroup, blank=True, null=True)
    group_name = models.TextField(default='Group chat', blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self) -> str:
        if self.group_name == '':
            return 'Group chat'
        return self.group_name

    def total_spent(self):
        return sum(expense.total for expense in self.group_expenses.all())

    def spent_by_category(self):
        spent = {}
        for type in types:
            spent[type[0]] = sum(expense.total for expense in self.group_expenses.all() if expense.category == type[0])
        return spent
