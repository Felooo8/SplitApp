from rest_framework import serializers
from .models import (Expense,GroupExpense, Group)
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ('id', 'username')


class GroupSerializer(serializers.ModelSerializer):
    usernames = serializers.SerializerMethodField()
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

    class Meta:
        model = Group
        fields = ('id', 'users', 'usernames', 'group_expenses', 'group_name',
                  'created_at', 'total_spent', 'spent_by_category')



class GroupExpenseSerializer(serializers.ModelSerializer):
    short_date = serializers.SerializerMethodField()
    payer_username = serializers.SerializerMethodField()
    name = serializers.SerializerMethodField()
    total = serializers.SerializerMethodField()
    category = serializers.SerializerMethodField()
    payer = serializers.SerializerMethodField()

    def get_payer(self, obj):
        return obj.expenses.all()[0].payer.id

    def get_payer_username(self, obj):
        return obj.expenses.all()[0].payer.username

    def get_name(self, obj):
        return obj.expenses.all()[0].name

    def get_total(self, obj):
        return obj.expenses.all()[0].total

    def get_category(self, obj):
        return obj.expenses.all()[0].category

    def get_short_date(self, obj):
        date = obj.expenses.all()[0].date.strftime("%d %b")
        return date


    class Meta:
        model = GroupExpense
        fields = ('id','payer', 'payer_username', 'short_date', 'name', 'category', 'total')

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
        fields = ('id', 'ower', 'ower_username', 'name', 'category', 'total', 'splitted', 'date', 'short_date', 'payer', 'payer_username', 'is_paid')
