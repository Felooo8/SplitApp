from django.test import TestCase
from .serializers import UserSerializer, ExpenseSerializer, GroupSerializer
from .models import Expense, Group
from rest_framework.test import APIRequestFactory

# Create your tests here.
class ProductAPITests:

    def test_can_get_product_details(self, django_app, product_factory):
        product = product_factory()
        response = django_app.post('/groupExpenses', {'id': '1'})
        assert response.status_code == 200
        assert response.data == ExpenseSerializer(instance=product).data
