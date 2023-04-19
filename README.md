# SplitApp by Felo

WebApp made in React + RESTful API + Django to allow people to split bills.

## Installing

### Docker:

1.  Install docker <https://docs.docker.com/get-docker/>
2.  Clone the repository and inside main folder run the following command:

```
sudo docker compose up
```

### Without Docker

1.  Install Python3 and the following libraries:

- Django

```
pip install Django
```

- Rest framework

```
pip install djangorestframework
```

- Corsheaders

```
pip install django-cors-headers
```

- Djoser

```
pip install djoser
```

- Rest framework authtoken

```
pip install django-rest-authtoken
```

1.  Install NodeJS and npm
2.  In folder _backend type:_

```
python manage.py makemigrations
python manage.py migrate
python manage.py run
```

1.  In folder _frontend type:_

```
npm install
npm start
```

## Features

Every data is stored in the database (handled by Django backend).
You may also check out images of each screen in SplitApp.pdf file.

### SingUp and SignIn

Allows users to create new account or login into an existing account -\> data is saved in database through Django. Username and email must be unique + email must be in proper format (checked in backend). No input can be empty (checked in frontend).

### Manage account

Allows user to change his name, username and avatar.

### Create expense

Allows to create new expense (set category, name, amount, status), choose group or person with whom expense was incurred and the person who paid it.

### Create group

Create group – set its name and add users to this group. Quick search for friends and search bar to look for other users by their username.

### Summary

Shows list of users whom user owes/lent money.

### See expenses

See and manage all expenses + filter them by their type.

### See your groups

Shows list of users group and they balance within this group.

### Summary of group spendings

Shows list of group expenses and chart of categories of incurred expenses.

### Manage friends

Users may search for other users using the search bar in the Top Bar (In the screenshots searches for “e”). Users see all the matching users and their relationship status. He may send friend initiation, accept or decline invitation, decline sent invitation or remove a friend.

### Notifications

Users may see and manage pending friends' invitations. There is also a notification about pending invitations in the App Bar.

### Skeletons and Errors

Skeletons are displayed while loading data (sending API).

Error screens are displayed when there is a problem with connecting to the server. Users may try to reconnect to API by clicking on the “Refresh” button.

### Empty States

Empty states are moments in a user’s experience with a product where there is nothing to display. User can also refresh data (last screen)
