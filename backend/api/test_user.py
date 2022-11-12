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


class ProfileTest(APITestCase):
    url = reverse('api:profile')

    def test_correct_data(self):
        sender = User.objects.create_user('username', 'example@gmail.com', 'password', first_name="Andrew", last_name="Tate")
        self.client.force_authenticate(sender)
        serializer = UserSerializer(sender).data

        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer)

    def test_no_authentication(self):
        response = self.client.get(self.url)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
