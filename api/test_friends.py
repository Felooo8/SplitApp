import json
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from .models import (Account, Expense, FriendsInvitation, Group, GroupExpense)
from .serializers import (AccountSerializer, ExpenseSerializer,
                           FriendsInvitationSerializer, GroupExpenseSerializer,
                           GroupSerializer, UserSerializer)

client = Client()


class InviteFriendViewTest(APITestCase):
    url = reverse('api:inviteFriend')

    def test_correct_data(self):
        sender = User.objects.create_user('username')
        invited = User.objects.create_user('username2')
        self.client.force_authenticate(sender)
        body = json.dumps({'id': '2'})
        response = self.client.post(self.url, body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(FriendsInvitation.objects.count(), 1)
        self.assertEqual(FriendsInvitation.objects.get(id=1).sender, sender)
        self.assertEqual(FriendsInvitation.objects.get(id=1).invited, invited)

    def test_no_authentication(self):
        body = json.dumps({'id': '2'})
        response = self.client.post(self.url, body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(FriendsInvitation.objects.count(), 0)

    def test_invalid_data(self):
        sender = User.objects.create_user('username')
        self.client.force_authenticate(sender)
        invalid_body = json.dumps({'not_id': '2'})
        response = self.client.post(self.url, invalid_body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(FriendsInvitation.objects.count(), 0)

    def test_no_user_found(self):
        sender = User.objects.create_user('username')
        self.client.force_authenticate(sender)
        body = json.dumps({'id': '4'})
        response = self.client.post(self.url, body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(FriendsInvitation.objects.count(), 0)


class RemoveFriendViewTest(APITestCase):
    url = reverse('api:removeFriend')

    def test_correct_data(self):
        sender = User.objects.create_user('username')
        removed = User.objects.create_user('username2')
        sender_account = Account.objects.get(user=sender)
        removed_account = Account.objects.get(user=removed)
        sender_account.friends.add(removed)
        self.assertEqual(sender_account.friends.count(), 1)
        removed_account.friends.add(sender)
        self.assertEqual(removed_account.friends.count(), 1)
        self.client.force_authenticate(sender)
        body = json.dumps({'id': '2'})
        response = self.client.post(self.url, body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(sender_account.friends.count(), 0)
        self.assertEqual(removed_account.friends.count(), 0)


    def test_no_authentication(self):
        body = json.dumps({'id': '2'})
        response = self.client.post(self.url, body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_data(self):
        sender = User.objects.create_user('username')
        self.client.force_authenticate(sender)
        invalid_body = json.dumps({'not_id': '2'})
        response = self.client.post(self.url, invalid_body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_user_found(self):
        sender = User.objects.create_user('username')
        self.client.force_authenticate(sender)
        body = json.dumps({'id': '4'})
        response = self.client.post(self.url, body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class AcceptInvitationViewTest(APITestCase):
    url = reverse('api:acceptInvitation')

    def test_correct_data(self):
        sender = User.objects.create_user('username')
        invited = User.objects.create_user('username2')
        sender_account = Account.objects.get(user=sender)
        invited_account = Account.objects.get(user=invited)
        self.assertEqual(sender_account.friends.count(), 0)
        self.assertEqual(invited_account.friends.count(), 0)

        FriendsInvitation(sender=sender, invited=invited).save()
        self.assertEqual(FriendsInvitation.objects.count(), 1)

        self.client.force_authenticate(invited)
        body = json.dumps({'id': '1'})
        response = self.client.post(self.url, body, content_type="json")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(sender_account.friends.count(), 1)
        self.assertEqual(invited_account.friends.count(), 1)
        self.assertEqual(FriendsInvitation.objects.count(), 0)

    def test_no_authentication(self):
        body = json.dumps({'id': '1'})
        response = self.client.post(self.url, body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_data(self):
        invited = User.objects.create_user('username')
        self.client.force_authenticate(invited)
        invalid_body = json.dumps({'not_id': '2'})
        response = self.client.post(self.url, invalid_body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_invitation_found(self):
        invited = User.objects.create_user('username')
        self.client.force_authenticate(invited)
        body = json.dumps({'id': '4'})
        response = self.client.post(self.url, body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class DeclineInvitationViewTest(APITestCase):
    url = reverse('api:declineInvitation')

    def test_correct_data(self):
        sender = User.objects.create_user('username')
        invited = User.objects.create_user('username2')
        sender_account = Account.objects.get(user=sender)
        invited_account = Account.objects.get(user=invited)

        FriendsInvitation(sender=sender, invited=invited).save()
        self.assertEqual(FriendsInvitation.objects.count(), 1)

        self.client.force_authenticate(invited)
        body = json.dumps({'id': '1'})
        response = self.client.post(self.url, body, content_type="json")

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(sender_account.friends.count(), 0)
        self.assertEqual(invited_account.friends.count(), 0)
        self.assertEqual(FriendsInvitation.objects.count(), 0)

    def test_no_authentication(self):
        body = json.dumps({'id': '1'})
        response = self.client.post(self.url, body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_invalid_data(self):
        invited = User.objects.create_user('username')
        self.client.force_authenticate(invited)
        invalid_body = json.dumps({'not_id': '2'})
        response = self.client.post(self.url, invalid_body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)

    def test_no_invitation_found(self):
        invited = User.objects.create_user('username')
        self.client.force_authenticate(invited)
        body = json.dumps({'id': '4'})
        response = self.client.post(self.url, body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class SeeFriendsViewTest(APITestCase):
    url = reverse('api:seeFriends')

    def test_correct_data(self):
        user = User.objects.create_user('username')
        friend1 = User.objects.create_user('username2')
        friend2 = User.objects.create_user('username3')
        account = Account.objects.get(user=user)
        account.friends.add(friend1)
        account.friends.add(friend2)

        self.assertEqual(account.friends.count(), 2)

        self.client.force_authenticate(user)
        response = self.client.get(self.url)

        serializer = UserSerializer([friend1, friend2], many=True)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)


    def test_no_authentication(self):
        response = self.client.post(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_no_friends(self):
        user = User.objects.create_user('username')
        self.client.force_authenticate(user)
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, [])
