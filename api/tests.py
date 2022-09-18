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


class InvitationsViewTest(APITestCase):
    url = reverse('api:inviteFriend')
    data = json.dumps({'id': '2'})

    def test_check_user(self):
        sender = User.objects.create_user('username', 'Pas$w0rd')
        invited = User.objects.create_user('username2', 'Pas$w0rd')
        self.client.force_authenticate(sender)
        response = self.client.post(self.url, self.data, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(FriendsInvitation.objects.count(), 1)
        self.assertEqual(FriendsInvitation.objects.get(id=1).sender, sender)
        self.assertEqual(FriendsInvitation.objects.get(id=1).invited, invited)


    def test_no_authentication(self):
        response = self.client.post(self.url, self.data, content_type="json")
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        self.assertEqual(FriendsInvitation.objects.count(), 0)

