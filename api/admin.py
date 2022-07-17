from django.contrib import admin
from .models import (Expense, Group)

# Register your models here.


class GroupAdmin(admin.ModelAdmin):
    pass


class ExpenseAdmin(admin.ModelAdmin):
    pass


admin.site.register(Group, GroupAdmin)
admin.site.register(Expense, ExpenseAdmin)
