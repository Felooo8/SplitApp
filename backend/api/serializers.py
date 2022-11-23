from rest_framework import serializers
from .models import (Expense, GroupExpense, Group, FriendsInvitation, Account)
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name')


class AccountSerializer(serializers.ModelSerializer):
    class Meta:
        model = Account
        fields = ('id', 'user', 'friends', 'avatar')


class GroupSerializer(serializers.ModelSerializer):
    usernames = serializers.SerializerMethodField()
    balance = serializers.SerializerMethodField()
    created_at = serializers.DateTimeField(format="%d-%m-%Y %H:%M:%S")
    total_spent = serializers.SerializerMethodField('get_total_spent')
    spent_by_category = serializers.SerializerMethodField('get_spent_by_category')

    def get_total_spent(self, obj):
        return obj.total_spent()

    def get_spent_by_category(self, obj):
        return obj.spent_by_category()

    def get_usernames(self, obj):
        usernames = []
        users = obj.users.all()
        for user in users:
            usernames.append(user.username)
        return usernames

    def get_balance(self, obj):
        user = self.context.get("user")
        return obj.balance(user)

    class Meta:
        model = Group
        fields = ('id', 'users', 'usernames', 'group_expenses', 'group_name',
                  'created_at', 'total_spent', 'spent_by_category', 'balance')



class GroupExpenseSerializer(serializers.ModelSerializer):
    short_date = serializers.SerializerMethodField()
    payer_username = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    amount = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    payer = serializers.SerializerMethodField()
    settled = serializers.SerializerMethodField()
    is_paid = serializers.SerializerMethodField()

    def get_payer(self, obj):
        return obj.expenses.all()[0].payer.id

    def get_payer_username(self, obj):
        return obj.expenses.all()[0].payer.username

    def get_settled(self, obj):
        return obj.expenses.all()[0].settled

    def get_is_paid(self, obj):
        return obj.expenses.all()[0].is_paid

    def get_name(self, obj):
        return obj.expenses.all()[0].name

    def get_amount(self, obj):
        return obj.expenses.all()[0].amount

    def get_category(self, obj):
        return obj.expenses.all()[0].category

    def get_short_date(self, obj):
        date = obj.expenses.all()[0].date.strftime("%d %b")
        return date


    class Meta:
        model = GroupExpense
        fields = ('id','payer', 'payer_username', 'short_date', 'name', 'category', 'amount', 'settled', 'is_paid')


class ExpenseSerializer(serializers.ModelSerializer):
    ower_username = serializers.SerializerMethodField()
    short_date = serializers.SerializerMethodField()
    payer_username = serializers.SerializerMethodField()

    def get_payer_username(self, obj):
        return obj.payer.username

    def get_short_date(self, obj):
        date = obj.date.strftime("%d %b")
        return date

    def get_ower_username(self, obj):
        return obj.ower.username

    class Meta:
        model = Expense
        fields = ('id', 'ower', 'ower_username', 'name', 'category', 'amount', 'splitted', 'date', 'short_date', 'payer', 'payer_username', 'is_paid', 'settled')


class FriendsInvitationSerializer(serializers.ModelSerializer):
    sender_username = serializers.SerializerMethodField()

    def get_sender_username(self, obj):
        return obj.sender.username

    class Meta:
        model = FriendsInvitation
        fields = ('id', 'sender', 'sender_username', 'invited')
