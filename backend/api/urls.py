from django.urls import path
from .views import (
    GetUserByID,
    GetUsersGroups,
    GetUsersExpenses,
    AddExpense,
    SetAsPaid,
    Settle,
    GetUsersSummarize,
    SetAvatar,
    GetAvatar,
    CreateNewUser,
    SearchUsersToAdd,
    Profile,
    GetAllUsersGroups
)
from .groups.views import (
    GetGroupExpenses,
    GetChartValues,
    AddToGroup,
    LeaveGroup,
    GetGroupAvatar,
    SetGroupName,
    CreateNewGroup,
    AddUsertoGroup,
    DeleteGroup,
)

from .friends.views import (
    InviteFriend,
    AcceptInvitation,
    DeclineInvitation,
    SeeFriends,
    FindFriends,
    RemoveFriend,
    AcceptInvitationByUserID,
    DeclineInvitationByUserID,
    CancelInvitationByUserID,
    GetInvitations,
    GetNotifications,
)
app_name = "api" 

urlpatterns = [
    path("sign-up", CreateNewUser.as_view(), name="sign-up"),
    path("profile", Profile.as_view(), name="profile"),
    path("username", GetUserByID.as_view(), name="username"),
    path("setAvatar", SetAvatar.as_view(), name="setAvatar"),
    path("getAvatar/<int:id>", GetAvatar.as_view(), name="getAvatar"),
    
    path("groups", GetAllUsersGroups.as_view(), name="groups"),
    path("summarize", GetUsersSummarize.as_view(), name="summarize"),
    path("group", GetUsersGroups.as_view(), name="group"),
    path("groupExpenses/<int:id>", GetGroupExpenses.as_view(), name="groupExpenses"),

    path("chartData/<int:id>", GetChartValues.as_view(), name="chartData"),
    path("setGroupName", SetGroupName.as_view(), name="setGroupName"),
    path("getGroupAvatar/<int:id>", GetGroupAvatar.as_view(), name="getGroupAvatar"),

    path("userExpenses", GetUsersExpenses.as_view(), name="userExpenses"),
    path("addExpense", AddExpense.as_view(), name="addExpense"),

    path("seeFriends", SeeFriends.as_view(), name="seeFriends"),
    path("inviteFriend", InviteFriend.as_view(), name="inviteFriend"),
    path("removeFriend", RemoveFriend.as_view(), name="removeFriend"),
    path("declineInvitation", DeclineInvitation.as_view(), name="declineInvitation"),
    path("declineInvitation/byUser", DeclineInvitationByUserID.as_view(), name="declineInvitationByUser"),
    path("cancelInvitation/byUser", CancelInvitationByUserID.as_view(), name="cancelInvitationByUser"),
    path("acceptInvitation", AcceptInvitation.as_view(), name="acceptInvitation"),
    path("acceptInvitation/byUser", AcceptInvitationByUserID.as_view(), name="acceptInvitationByUser"),
    
    path("addToGroup", AddToGroup.as_view(), name="addToGroup"),
    path("leaveGroup", LeaveGroup.as_view(), name="leaveGroup"),
    path("deleteGroup", DeleteGroup.as_view(), name="deleteGroup"),
    path("createGroup", CreateNewGroup.as_view(), name="createGroup"),
    path("addUserToGroup", AddUsertoGroup.as_view(), name="addUserToGroup"),

    path("setAsPaid", SetAsPaid.as_view(), name="setAsPaid"),
    path("settle", Settle.as_view(), name="settle"),
    
    path("findFriends/<str:username>", FindFriends.as_view(), name="findFriends"),
    path("searchUsersToAdd/<str:username>/<int:id>", SearchUsersToAdd.as_view(), name="searchUsers"),
    
    path("getInvitations", GetInvitations.as_view(), name="getInvitations"),
    path("getNotifications", GetNotifications.as_view(), name="getNotifications"),
]
