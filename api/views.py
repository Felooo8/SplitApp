from django.shortcuts import render
from rest_framework import generics, status
from .serializers import UserSerializer, ExpenseSerializer, GroupSerializer
from .models import Expense, Group, types
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth.models import User
import json
from rest_framework.permissions import IsAuthenticated

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
            expenses = group.expenses
            data = ExpenseSerializer(expenses, many=True).data
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
        expenses = Expense.objects.filter(users=user)
        if len(expenses) > 0:
            data = ExpenseSerializer(expenses, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        return Response(None, status=status.HTTP_204_NO_CONTENT)
