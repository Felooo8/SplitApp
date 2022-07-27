from django.forms import BooleanField
from django.shortcuts import render
from rest_framework import generics, status
from .serializers import (
    UserSerializer,
    ExpenseSerializer,
    GroupSerializer,
    GroupExpenseSerializer,
)
from .models import (Expense, Group, types, GroupExpense,Account,FriendsInvitation)
from rest_framework.views import APIView
from rest_framework.response import Response
from django.http import JsonResponse
from django.contrib.auth.models import User
import json
from rest_framework.permissions import IsAuthenticated
from django.db.models import Q
from django.utils.crypto import get_random_string

from collections import defaultdict
from itertools import chain 
from django.db.models import Value


# Create your views here.


class GetUserByID(APIView):
    lookup_url_kwarg = "id"

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id is not None:
            users = User.objects.get(id=id)
            if len(users) > 0:
                data = UserSerializer(users[0]).data
                return Response(data, status=status.HTTP_200_OK)
            return Response(
                {"User Not Found": "Invalid User ID."}, status=status.HTTP_404_NOT_FOUND
            )

        return Response(
            {"Bad Request": "User ID paramater not found in request"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class GetUsersGroups(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        sorted_groups = Group.objects.filter(users=user)
        if len(sorted_groups) > 0:
            data = GroupSerializer(sorted_groups, many=True, context={'user': user}).data
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

    def get(self, request, format=None):
        user = request.user
        expenses = Expense.objects.filter(Q(ower=user) | Q(payer=user)).order_by(
            "-date"
        )
        if len(expenses) > 0:
            data = ExpenseSerializer(expenses, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        return Response(None, status=status.HTTP_204_NO_CONTENT)


class AddExpense(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        body = json.loads(request.body)["values"]
        print(body)
        payer_id = body["payer"]
        payer = User.objects.get(id=payer_id)
        owers_ids = body["owers"]
        groups_ids = body["owers_groups"]
        name = body["name"]
        category = "Other"
        category_name = body["category"]
        for type in types:
            if type[0] == category_name:
                category = category_name
                break
        amount = float(body["amount"])
        splitted = body["splitted"]
        is_paid = body["is_paid"]
        settled = body["settled"]
        try:
            if not owers_ids == [None]:
                for ower_id in owers_ids:
                    print(ower_id)
                    ower = User.objects.get(id=ower_id)
                    new_expense = Expense(
                        payer=payer,
                        ower=ower,
                        category=category,
                        name=name,
                        amount=amount,
                        splitted=splitted,
                        is_paid=is_paid,
                        settled=settled,
                    )
                    new_expense.save()
            if not groups_ids == [None]:
                for group_id in groups_ids:
                    unique_id = get_random_string(length=16)
                    new_group_expense = GroupExpense()
                    new_group_expense.save()
                    group = Group.objects.get(id=group_id)
                    for ower in group.users.all():
                        if(ower != payer):
                            new_expense = Expense(
                                payer=payer,
                                ower=ower,
                                category=category,
                                name=name,
                                amount=amount,
                                splitted=splitted,
                                is_paid=is_paid,
                                settled=settled,
                                hash=unique_id,
                            )
                            new_expense.save()
                            new_group_expense.expenses.add(new_expense)
                    new_group_expense.save()
                    group.group_expenses.add(new_group_expense)
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(None, status=status.HTTP_422_UNPROCESSABLE_ENTITY)


class SeeFriends(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        account = Account.objects.get(user=user)
        friends = [friend for friend in account.friends.all()]
        data = UserSerializer(friends, many=True).data
        return Response(data, status=status.HTTP_200_OK)


class InviteFriend(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        body = json.loads(request.body)
        friend_id = body["id"]
        try:
            friend = User.objects.get(id=friend_id)
            invitation = FriendsInvitation(sender=user, invited=friend)
            invitation.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class RemoveFriend(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        body = json.loads(request.body)
        friend_id = body["id"]
        try:
            friend = User.objects.get(id=friend_id)
            account = Account.objects.get(user=user)
            account.friends.remove(friend)
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except User.DoesNotExist:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class AcceptInvitation(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        body = json.loads(request.body)
        invitation_id = body["id"]
        try:
            invitation = FriendsInvitation.objects.get(id=invitation_id, invited=user)
            invitation.accepted = True
            invitation.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except FriendsInvitation.DoesNotExist:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class DeclineInvitation(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        body = json.loads(request.body)
        invitation_id = body["id"]
        try:
            invitation = FriendsInvitation.objects.get(id=invitation_id, invited=user)
            invitation.delete()
            invitation.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except FriendsInvitation.DoesNotExist:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class AddToGroup(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        body = json.loads(request.body)
        group_id = body["group_id"]
        invited_id = body["invited_id"]
        try:
            group = Group.objects.get(id=group_id, users=user)
            group.users.add(invited_id)
            group.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except Group.DoesNotExist:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class LeaveGroup(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        body = json.loads(request.body)
        group_id = body["group_id"]
        leaver_id = body["leaver_id"]
        try:
            group = Group.objects.get(id=group_id, users=[user, leaver_id],)
            group.users.remove(leaver_id)
            group.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except Group.DoesNotExist:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class SetAsPaid(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        body = json.loads(request.body)
        expense_id = body["id"]
        is_paid = body["paid"]
        try:
            expense = Expense.objects.get(id=expense_id, ower=user)
            expense.is_paid = is_paid
            expense.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except Expense.DoesNotExist:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class Settle(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        body = json.loads(request.body)
        expense_id = body["id"]
        settled = body["settled"]
        try:
            expense = Expense.objects.get(id=expense_id, payer=user)
            expense.settled = settled
            expense.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except Expense.DoesNotExist:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class GetUsersSummarize(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user

        def def_value():
            return 0

        all_debts = Expense.objects.filter(ower=user, settled=False).exclude(payer=user)
        debts = defaultdict(def_value)

        all_lents = Expense.objects.filter(payer=user, settled=False).exclude(ower=user)
        if len(all_debts) > 0:
            for expense in all_debts:
                debts[expense.payer.username] += expense.amount
        if len(all_lents) > 0:
            for expense in all_lents:
                debts[expense.ower.username] -= expense.amount
        return Response(debts, status=status.HTTP_200_OK)


class FindFriends(APIView):
    permission_classes = [IsAuthenticated]

    def is_friend(self, request, user):
        account = Account.objects.get(user=request.user)
        return user in account.friends.all()

    def get(self, request, username, format=None):

        try:
            username = self.kwargs['username']
            users_starts = User.objects.filter(username__startswith=username).exclude(id=request.user.id)
            users_contains = User.objects.filter(username__icontains=username).exclude(username__startswith=username).exclude(id=request.user.id)
            users = list(chain(users_starts, users_contains))
            account = Account.objects.get(user=request.user)
            friends = [friend.id for friend in account.friends.all()]
            # for user in users:
            #     value = self.is_friend(request, user)
            #     user.is_friend = value
            #     print(user.is_friend)
            # print(users)
            users = UserSerializer(users, many=True).data
            return Response([users, friends], status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)
