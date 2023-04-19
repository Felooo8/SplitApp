import json
from collections import defaultdict
from itertools import chain

from django.contrib.auth.models import User
from django.core.exceptions import ValidationError
from django.core.validators import validate_email
from django.db.models import Q
from django.utils.crypto import get_random_string
from rest_framework import status
from rest_framework.exceptions import ValidationError
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import (Account, Expense, FriendsInvitation, Group, GroupExpense,
                     types, validate_image)
from .serializers import (ExpenseSerializer, FriendsInvitationSerializer,
                          GroupExpenseSerializer, GroupSerializer,
                          SimpleGroupSerializer, UserSerializer)

# Create your views here.


class CreateNewUser(APIView):
    permission_classes = [AllowAny]
    def post(self, request, format=None):
        try:
            body = json.loads(request.body)
            username = body["userName"]
            first_name = body["firstName"]
            last_name = body["lastName"]
            email = body["email"]
            password = body["password"]
            if not (username or first_name or last_name or email or password):
                return Response({"missing_fields": "Fill all the fields"}, status=status.HTTP_400_BAD_REQUEST)
            try:
                validate_email(email)
            except ValidationError as e:
                return Response({"bad_email": e}, status=status.HTTP_422_UNPROCESSABLE_ENTITY)
            if User.objects.filter(email=email).exists():
                return Response({"email_exists": "Email already exists"}, status=status.HTTP_400_BAD_REQUEST)
            if User.objects.filter(username=username).exists():
                return Response({"username_exists": "Username already exists"}, status=status.HTTP_400_BAD_REQUEST)
            user = User.objects.create_user(username=username,
                                            email=email,
                                            password=password,
                                            first_name=first_name,
                                            last_name=last_name)
            return Response(None, status=status.HTTP_200_OK)
        except:
            return Response({"data": "Wrong data"}, status=status.HTTP_400_BAD_REQUEST)


class GetUserByID(APIView):
    lookup_url_kwarg = "id"

    def get(self, request, format=None):
        id = request.GET.get(self.lookup_url_kwarg)
        if id is not None:
            try:
                user = User.objects.get(id=id)
                data = UserSerializer(user).data
                return Response(data, status=status.HTTP_200_OK)
            except:
                return Response(
                    {"User Not Found": "Invalid User ID."}, status=status.HTTP_400_BAD_REQUEST
                )
        return Response(
            {"Bad Request": "User ID paramater not found in request"},
            status=status.HTTP_400_BAD_REQUEST,
        )


class GetAllUsersGroups(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        try:
            sorted_groups = Group.objects.filter(users=user)
            data = SimpleGroupSerializer(sorted_groups, many=True, context={'user': user}).data
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class GetUsersGroups(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        try:
            sorted_groups = Group.objects.filter(users=user)
            data = GroupSerializer(sorted_groups, many=True, context={'user': user}).data
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)



class GetUsersExpenses(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user
        try:
            expenses = Expense.objects.filter(Q(ower=user) | Q(payer=user)).order_by("-date")
            data = ExpenseSerializer(expenses, many=True).data
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


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
            if not splitted:
                amount = amount / self.total_users(owers_ids, groups_ids)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)
        try:
            if owers_ids != []:
                # Creates Expenses for individual users
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
            if groups_ids != []:
                # Creates Expenses for groups
                for group_id in groups_ids:
                    unique_id = get_random_string(length=16)
                    group = Group.objects.get(id=group_id)
                    total = amount*group.users.all().count()
                    new_group_expense = GroupExpense(total=total)
                    new_group_expense.save()
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



class SetAsPaid(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            expense_id = body["id"]
            is_paid = body["paid"]
            isGroupExpense = body["isGroupExpense"]
            try:
                if isGroupExpense:
                    group_expense = GroupExpense.objects.get(id=expense_id)
                    for expense in group_expense.expenses.all():
                        expense.is_paid = is_paid
                        expense.save()
                else:
                    expense = Expense.objects.get(id=expense_id, ower=user)
                    expense.is_paid = is_paid
                    expense.save()
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            except Expense.DoesNotExist:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class Settle(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        user = request.user
        try:
            body = json.loads(request.body)
            expense_id = body["id"]
            settled = body["settled"]
            isGroupExpense = body["isGroupExpense"]
            try:
                if isGroupExpense:
                    group_expense = GroupExpense.objects.get(id=expense_id)
                    for expense in group_expense.expenses.all():
                        expense.settled = settled
                        expense.save()
                else:
                    expense = Expense.objects.get(id=expense_id, payer=user)
                    expense.settled = settled
                    expense.save()
                return Response(None, status=status.HTTP_204_NO_CONTENT)
            except Expense.DoesNotExist:
                return Response(None, status=status.HTTP_404_NOT_FOUND)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class GetUsersSummarize(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, format=None):
        user = request.user

        def def_value():
            return [0, 0]

        try:
            all_debts = Expense.objects.filter(ower=user, settled=False).exclude(payer=user)
            debts = defaultdict(def_value)

            all_lents = Expense.objects.filter(payer=user, settled=False).exclude(ower=user)
            if len(all_debts) > 0:
                for expense in all_debts:
                    debts[expense.payer.username][1] = expense.payer.id
                    debts[expense.payer.username][0] += expense.amount
            if len(all_lents) > 0:
                for expense in all_lents:
                    debts[expense.ower.username][1] = expense.ower.id
                    debts[expense.ower.username][0] -= expense.amount
            return Response(debts, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class SetAvatar(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, format=None):
        try:
            image_data = request.FILES.get('image')
            validate_image(image_data)  # Manually call the validator
            user = request.user
            account = Account.objects.get(user=user)
            account.avatar = image_data
            account.save()

            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except ValidationError as e:
            return Response({"Error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"Error": "No file attached"}, status=status.HTTP_400_BAD_REQUEST)


class GetAvatar(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, id, format=None):
        try:
            user = User.objects.get(id=id)
            account = Account.objects.get(user=user)
            avatar = account.avatar
            try:
                url = avatar.url
                return Response(url, status=status.HTTP_200_OK)
            except BaseException:
                return Response({"Avatar not found": "This user has no avatar"}, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class SearchUsersToAdd(APIView):
    "When adding to group"
    permission_classes = [IsAuthenticated]

    def is_friend(self, request, user):
        account = Account.objects.get(user=request.user)
        return user in account.friends.all()

    def get(self, request, username, id, format=None):
        try:
            username = self.kwargs['username']
            group_id = self.kwargs['id']
            group = Group.objects.get(id=group_id)
            members = [member.id for member in group.users.all()]
            account = Account.objects.get(user=request.user)
            friends = [friend.id for friend in account.friends.all()]
            users = User.objects.filter(username__startswith=username).exclude(id=request.user.id).exclude(id__in=friends).exclude(id__in=members)
            users = UserSerializer(users, many=True).data
            return Response(users, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)


class Profile(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        try:
            user = request.user
            data = UserSerializer(user).data
            try:
                avatar_url = Account.objects.get(user=user).avatar.url
                data["avatar"] = avatar_url
            except BaseException:
                pass
            return Response(data, status=status.HTTP_200_OK)
        except:
            return Response(None, status=status.HTTP_400_BAD_REQUEST)

    def post(self, request):
        try:
            user = request.user
            body = json.loads(request.body)
            first_name = body["firstName"]
            last_name = body["lastName"]
            user_name = body["userName"]
            user.username = user_name
            user.first_name = first_name
            user.last_name = last_name
            user.save()
            return Response(None, status=status.HTTP_204_NO_CONTENT)
        except:
            return Response({"Error": "Something went wrong."}, status=status.HTTP_400_BAD_REQUEST)
