from django.contrib import admin
from .models import (Expense,GroupExpense, Group)

# Register your models here.


class GroupAdmin(admin.ModelAdmin):
    pass


class ExpenseAdmin(admin.ModelAdmin):
    pass

class GroupExpenseSerializer(admin.ModelAdmin):
    pass


admin.site.register(Group, GroupAdmin)
admin.site.register(Expense, ExpenseAdmin)
admin.site.register(GroupExpense, GroupExpenseSerializer)
