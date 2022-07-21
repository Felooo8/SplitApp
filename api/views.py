from django.shortcuts import render
from rest_framework import generics, status
from .serializers import UserSerializer, ExpenseSerializer, GroupSerializer,GroupExpenseSerializer
from .models import Expense, Group, types, GroupExpense
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth.models import User
import json
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q

# Create your views here.

class GetUserByID(APIView):
    lookup_url_kwarg = 'id'

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id is not None:
            users = User.objects.filter(id=id)
            if len(users) > 0:
                data = UserSerializer(users[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response({'User Not Found': 'Invalid User ID.'}, status=status.HTTP_404_NOT_FOUND)

        return Response({'Bad Request': 'User ID paramater not found in request'}, status=status.HTTP_400_BAD_REQUEST)


class GetUsersGroups(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        user = request.user
        sorted_groups = Group.objects.filter(users=user)
        if len(sorted_groups) > 0:
            data = GroupSerializer(sorted_groups, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        return Response(None, status=status.HTTP_204_NO_CONTENT)
            

class GetGroupExpenses(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        body = json.loads(request.body)
        group_id = body["id"]
        groups = Group.objects.filter(id=group_id)
        if len(groups) > 0:
            group = groups[0]
            expenses = group.group_expenses
            data = GroupExpenseSerializer(expenses, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class GetChartValues(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        body = json.loads(request.body)
        group_id = body["id"]
        groups = Group.objects.filter(id=group_id)
        if len(groups) > 0:
            group = groups[0]
            serializer = GroupSerializer(group).data
            valid_types = [type[0] for type in types]
            values = [serializer["spent_by_category"][type] for type in valid_types]
            data = {"keys": valid_types, "values": values}
            return Response(data, status=status.HTTP_200_OK)
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class GetUsersExpenses(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        user = request.user
        expenses = Expense.objects.filter(Q(ower=user) | Q(payer=user)).order_by('-date')
        if len(expenses) > 0:
            data = ExpenseSerializer(expenses, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class AddExpense(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, format=None):
        body = json.loads(request.body)["values"]
        payer_id = body["payer"]
        payer = User.objects.get(id=payer_id)
        owers_ids = body["owers"]
        name = body["name"]
        category=""
        category_name = body["category"]
        for type in types:
            if type[0] == category_name:
                category=category_name
        total = float(body["amount"])
        splitted = body["splitted"]
        is_paid = body["is_paid"]
        settled = body["settled"]
        try:
            new_group_expense = GroupExpense()
            new_group_expense.save()
            for ower_id in owers_ids:
                ower = User.objects.get(id=ower_id)
                new_expense = Expense(payer=payer,ower=ower,category=category,name=name,total=total,splitted=splitted,is_paid=is_paid,settled=settled)
                new_expense.save()
                new_group_expense.expenses.add(new_expense)
            new_group_expense.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(None, status=status.HTTP_422_UNPROCESSABLE_ENTITY)