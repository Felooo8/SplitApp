import json
from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APITestCase
from django.contrib.auth.models import User
from rest_framework import status
from ..models import (Account, Expense, FriendsInvitation, Group, GroupExpense)
from ..serializers import (AccountSerializer, ExpenseSerializer,
                           FriendsInvitationSerializer, GroupExpenseSerializer,
                           GroupSerializer, UserSerializer)

client = Client()


class InvitationsViewTest(APITestCase):
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
        invited = User.objects.create_user('username2')
        self.client.force_authenticate(sender)
        body = json.dumps({'id': '4'})
        response = self.client.post(self.url, body, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(FriendsInvitation.objects.count(), 0)

