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


class InviteFriend(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            friend_id = body["id"]
            try:
                friend = User.objects.get(id=friend_id)
                invitation = FriendsInvitation(sender=user, invited=friend)
                invitation.save()
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            except User.DoesNotExist:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class RemoveFriend(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
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
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class AcceptInvitation(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
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
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class AcceptInvitationByUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
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
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class DeclineInvitation(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            invitation_id = body["id"]
            try:
                invitation = FriendsInvitation.objects.get(id=invitation_id, invited=user)
                invitation.delete()
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            except FriendsInvitation.DoesNotExist:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class DeclineInvitationByUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            friend_id = body["id"]
            try:
                friend = User.objects.get(id=friend_id)
                invitation = FriendsInvitation.objects.get(invited=user, sender=friend)
                invitation.delete()
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            except FriendsInvitation.DoesNotExist:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class SeeFriends(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        try:
            account = Account.objects.get(user=user)
            friends = [friend for friend in account.friends.all()]
            data = UserSerializer(friends, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class CancelInvitationByUser(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            friend_id = body["id"]
            try:
                friend = User.objects.get(id=friend_id)
                invitation = FriendsInvitation.objects.get(sender=user, invited=friend)
                invitation.delete()
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            except FriendsInvitation.DoesNotExist:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


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
