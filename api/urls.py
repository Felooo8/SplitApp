from django.urls import path
from .views import (
    GetUserByID,
    GetGroupExpenses,
    GetUsersGroups,
    GetChartValues,
    GetUsersExpenses,
    AddExpense,
    FriendsInvitation,
    AcceptInvitation,
    DeclineInvitation,
    AddToGroup,
    LeaveGroup,
    SeeFriends
)

urlpatterns = [
    path("username", GetUserByID.as_view()),
    path("group", GetUsersGroups.as_view()),
    path("groupExpenses", GetGroupExpenses.as_view()),
    path("chartData", GetChartValues.as_view()),
    path("userExpenses", GetUsersExpenses.as_view()),
    path("addExpense", AddExpense.as_view()),
    path("seeFriends", SeeFriends.as_view()),
    path("friendsInvitation", FriendsInvitation.as_view()),
    path("declineInvitation", DeclineInvitation.as_view()),
    path("acceptInvitation", AcceptInvitation.as_view()),
    path("addToGroup", AddToGroup.as_view()),
    path("leaveGroup", LeaveGroup.as_view()),
]
