from django.forms import BooleanField
from django.shortcuts import render
from rest_framework import generics, status
from .serializers import (
    UserSerializer,
    ExpenseSerializer,
    GroupSerializer,
    GroupExpenseSerializer,
    FriendsInvitationSerializer,
    AccountSerializer
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
        try:
            body = json.loads(request.body)
            group_id = body["id"]
            group = Group.objects.get(id=group_id)
            expenses = group.group_expenses
            data = GroupExpenseSerializer(expenses, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class GetChartValues(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            body = json.loads(request.body)
            group_id = body["id"]
            group = Group.objects.get(id=group_id)
            serializer = GroupSerializer(group).data
            valid_types = [type[0] for type in types]
            values = [serializer["spent_by_category"][type] for type in valid_types]
            data = {"keys": valid_types, "values": values}
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


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

    def total_users(self, owers_ids, groups_ids):
        total = owers_ids[:]
        for group_id in groups_ids:
            group = Group.objects.get(id=group_id)
            for user in group.users.all():
                total.append(user.id)
        return max(len(list(set(total))), 2)

    def post(self, request, format=None):
        try:
            body = json.loads(request.body)["values"]
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
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)
        if not splitted:
            amount = amount / self.total_users(owers_ids, groups_ids)
        try:
            if not owers_ids == []:
                for ower_id in owers_ids:
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
            if not groups_ids == []:
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
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


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
            account_friend = Account.objects.get(user=friend)
            account_friend.friends.remove(user)
            account.save()
            account_friend.save()
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
            account = Account.objects.get(user=user)
            account.friends.add(invitation.sender)
            friend_account = Account.objects.get(user=invitation.sender)
            friend_account.friends.add(user)
            invitation.delete()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except FriendsInvitation.DoesNotExist:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class AcceptInvitationByUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        body = json.loads(request.body)
        user_id = body["id"]
        try:
            friend = User.objects.get(id=user_id)
            invitation = FriendsInvitation.objects.get(invited=user, sender=friend)
            account = Account.objects.get(user=user)
            account.friends.add(invitation.sender)
            friend_account = Account.objects.get(user=invitation.sender)
            friend_account.friends.add(user)
            invitation.delete()
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
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except FriendsInvitation.DoesNotExist:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class DeclineInvitationByUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        body = json.loads(request.body)
        friend_id = body["id"]
        try:
            friend = User.objects.get(id=friend_id)
            invitation = FriendsInvitation.objects.get(invited=user, sender=friend)
            invitation.delete()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except FriendsInvitation.DoesNotExist:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class CancelInvitationByUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        body = json.loads(request.body)
        friend_id = body["id"]
        try:
            friend = User.objects.get(id=friend_id)
            invitation = FriendsInvitation.objects.get(sender=user, invited=friend)
            invitation.delete()
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
            sent_inv = FriendsInvitation.objects.filter(sender=request.user)
            sent = [invitation.invited.id for invitation in sent_inv]
            pending_inv = FriendsInvitation.objects.filter(invited=request.user)
            pending = [invitation.sender.id for invitation in pending_inv]
            users = UserSerializer(users, many=True).data
            return Response({"users": users, "friends": friends, "sent": sent, "pending": pending}, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class GetInvitations(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            user = request.user
            inv = FriendsInvitation.objects.filter(invited=user)
            invitations = FriendsInvitationSerializer(inv, many=True).data
            return Response(invitations, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class GetNotifications(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        try:
            user = request.user
            number_of_notifictaions = FriendsInvitation.objects.filter(invited=user).count()
            return Response(number_of_notifictaions, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class SetAvatar(APIView):
    pass


class GetAvatar(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        try:
            user = User.objects.get(id=id)
            account = Account.objects.get(user=user)
            avatar = account.avatar
            return Response(avatar.url, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)
