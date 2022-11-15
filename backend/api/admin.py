from django.contrib import admin
from .models import (Expense,GroupExpense, Group,Account,FriendsInvitation)
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.contrib.auth.models import User

# Register your models here.


class GroupAdmin(admin.ModelAdmin):
    def delete_queryset(self, request, queryset):
        for obj in queryset:
            super().delete_model(request, obj)


class ExpenseAdmin(admin.ModelAdmin):
    list_display = ['name', 'ower', 'payer', 'amount', 'category'
                    ]
    list_filter = ['ower', 'payer', 'category', 'settled', 'is_paid']
    search_fields = [
        'name',
    ]


class GroupExpenseAdmin(admin.ModelAdmin):
    def delete_queryset(self, request, queryset):
        for obj in queryset:
            super().delete_model(request, obj)


class FriendsInvitationAdmin(admin.ModelAdmin):
    pass


class AccountInline(admin.StackedInline):
    model = Account
    can_delete = False
    verbose_name_plural = 'account'


class UserAdmin(BaseUserAdmin):
    inlines = (AccountInline,)

    list_display = ('username', 'email', 'first_name', 'last_name', 'is_staff', 'avatar')
    # list_filter = ['ower', 'payer', 'category', 'settled', 'is_paid']

    def delete_queryset(self, request, queryset):
        for obj in queryset:
            super().delete_model(request, obj)

    def avatar(self, obj):
        return Account.objects.get(user=obj).avatar.name != ""


admin.site.unregister(User)
admin.site.register(User, UserAdmin)
admin.site.register(Group, GroupAdmin)
admin.site.register(Expense, ExpenseAdmin)
admin.site.register(GroupExpense, GroupExpenseAdmin)
admin.site.register(FriendsInvitation, FriendsInvitationAdmin)
