from django.contrib import admin
from .models import (Expense,ExpenseGroup, Group)

# Register your models here.


class GroupAdmin(admin.ModelAdmin):
    pass


class ExpenseAdmin(admin.ModelAdmin):
    pass

class ExpenseGroupAdmin(admin.ModelAdmin):
    pass


admin.site.register(Group, GroupAdmin)
admin.site.register(Expense, ExpenseAdmin)
admin.site.register(ExpenseGroup, ExpenseGroupAdmin)
