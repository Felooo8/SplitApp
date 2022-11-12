import json
from collections import defaultdict
from itertools import chain

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db.models import Q
from django.forms import BooleanField
from django.http import JsonResponse
from django.shortcuts import render
from django.utils.crypto import get_random_string
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..models import (Account, Expense, FriendsInvitation, Group, GroupExpense,
                      types)
from ..serializers import (AccountSerializer, ExpenseSerializer,
                           FriendsInvitationSerializer, GroupExpenseSerializer,
                           GroupSerializer, UserSerializer)

# Create your views here.


class GetGroupExpenses(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        try:
            user = request.user
            group = Group.objects.get(id=id, users=user)
            expenses = group.group_expenses
            data = GroupExpenseSerializer(expenses, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class GetChartValues(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        try:
            user = request.user
            group = Group.objects.get(id=id, users=user)
            serializer = GroupSerializer(group).data
            valid_types = [type[0] for type in types]
            values = [serializer["spent_by_category"][type] for type in valid_types]
            data = {"keys": valid_types, "values": values}
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class AddToGroup(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            group_id = body["group_id"]
            invited_id = body["invited_id"]
            try:
                group = Group.objects.get(id=group_id, users=user)
                group.users.add(invited_id)
                group.save()
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            except Group.DoesNotExist:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class LeaveGroup(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            group_id = body["group_id"]
            try:
                group = Group.objects.get(id=group_id, users=user)
                group.users.remove(user)
                group.admins.remove(user)
                group.save()
                if group.id is not None:
                    if not group.admins.all().exists():
                        if group.users.all().count() > 0:
                            group.admins.add(group.users.all()[0])
                return Response(None, status=status.HTTP_200_OK)
            except Group.DoesNotExist:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class DeleteGroup(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            group_id = body["group_id"]
            try:
                group = Group.objects.get(id=group_id, users=user, admins=user)
                group.delete()
                return Response(None, status=status.HTTP_200_OK)
            except Group.DoesNotExist:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)






class SetGroupName(APIView):
    def post(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            group_id = body["id"]
            new_name = body["name"]
            try:
                group = Group.objects.get(id=group_id, users=user)
                group.group_name = new_name
                group.save()
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            except Group.DoesNotExist:
                return Response(None, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class GetGroupAvatar(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        try:
            group = Group.objects.get(id=id)
            avatar = group.avatar
            return Response(avatar.url, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class CreateNewGroup(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            group_name = body["group_name"]
            try:
                group = Group(group_name=group_name)
                group.save()
                group.users.add(user)
                group.admins.add(user)
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            except Group.DoesNotExist:
                return Response(None, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class AddUsertoGroup(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            id = body["id"]
            user_id = body["user_id"]
            user_name = body["userName"]
            try:
                group = Group.objects.get(id=id)
                user = User.objects.get(id=user_id, username=user_name)
                group.users.add(user)
                group.save()
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            except Group.DoesNotExist:
                return Response(None, status=status.HTTP_400_BAD_REQUEST)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)
