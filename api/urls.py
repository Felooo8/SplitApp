from django.urls import path, include
from .views import GetUserByID, GetGroupExpenses, GetUsersGroups, GetChartValues, GetUsersExpenses,AddExpense

urlpatterns = [
    path('username', GetUserByID.as_view()),
    path('group', GetUsersGroups.as_view()),
    path('groupExpenses', GetGroupExpenses.as_view()),
    path('chartData', GetChartValues.as_view()),
    path('userExpenses', GetUsersExpenses.as_view()),
    path('addExpense', AddExpense.as_view()),
]
