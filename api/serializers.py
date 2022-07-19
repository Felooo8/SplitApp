from rest_framework import serializers
from .models import (Expense,ExpenseGroup, Group)
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


class ExpenseBaseSerializer(serializers.ModelSerializer):
    short_date = serializers.SerializerMethodField()
    payer_username = serializers.SerializerMethodField()

    def get_payer_username(self, obj):
        return obj.payer.username

    def get_short_date(self, obj):
        date = obj.date.strftime("%d %b")
        return date

class ExpenseGroupSerializer(ExpenseBaseSerializer):
    class Meta:
        model = ExpenseGroup
        fields = ('id', 'name', 'category', 'total', 'splitted', 'date', 'short_date', 'payer', 'payer_username')

class ExpenseSerializer(ExpenseBaseSerializer):
    usernames = serializers.SerializerMethodField()

    def get_usernames(self, obj):
        usernames = []
        users = obj.users.all()
        for user in users:
            usernames.append(user.username)
        return usernames

    class Meta:
        model = Expense
        fields = ('id', 'users', 'usernames', 'name', 'category', 'total', 'splitted', 'date', 'short_date', 'payer', 'payer_username')
