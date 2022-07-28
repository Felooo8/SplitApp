from django.contrib import admin
from .models import (Expense,GroupExpense, Group,Account,FriendsInvitation)
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

# Register your models here.


class GroupAdmin(admin.ModelAdmin):
    pass


class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['name', 'ower', 'payer', 'amount', 'category'
                    ]
    list_filter = ['ower', 'payer', 'category', 'settled', 'is_paid']
    search_fields = [
        'name',
    ]


class GroupExpenseAdmin(admin.ModelAdmin):
    pass


class FriendsInvitationAdmin(admin.ModelAdmin):
    pass


class AccountInline(admin.StackedInline):
    model = Account
    can_delete = False
    verbose_name_plural = 'account'


class UserAdmin(BaseUserAdmin):
    inlines = (AccountInline,)


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Expense, ExpenseAdmin)
admin.site.register(GroupExpense, GroupExpenseAdmin)
admin.site.register(FriendsInvitation, FriendsInvitationAdmin)
