# SplitApp

SplitApp is a full-stack bill-splitting application built with a React frontend and a Django REST backend. The project focuses on the core workflows behind shared expenses: user accounts, friend connections, group expense tracking, settlement status, and per-group summaries.

The codebase demonstrates end-to-end application structure, API-backed state management, relational data modeling, and a non-trivial UI flow around shared expenses. It is a strong showcase of practical full-stack development with a clear product domain and complete user workflows.

## Stack

- **Frontend:** React 18, TypeScript, Material UI, Bootstrap, Chart.js
- **Backend:** Django, Django REST Framework, Djoser auth, SQLite
- **Local orchestration:** Docker Compose

## What the application does

SplitApp supports the main workflows you would expect in a shared-expense tracker:

- account creation and sign-in,
- friend invitations and friend management,
- creation of one-to-one and group expenses,
- paid / settled status tracking,
- per-user summary balances,
- group pages with category charts and expense history,
- avatar uploads for users and groups.

The repository also includes a `SplitApp.pdf` file with screenshots of the UI flows.

## Repository layout

```text
.
├── backend/                 # Django project, REST API, tests, Dockerfile
│   ├── SplitApp/            # Django settings and project configuration
│   └── api/                 # Models, serializers, views, and tests
├── frontend/                # React client, tests, Dockerfile
│   ├── src/apis/            # API helpers and client-side constants
│   ├── src/components/      # Shared UI components
│   └── src/screens/         # Page-level screens
├── docker-compose.yaml      # Local development entrypoint
└── SplitApp.pdf             # UI screenshots
```

## Quick start

### Option 1: Docker Compose

From the repository root:

```bash
docker compose up --build
```

Services:

- frontend: `http://localhost:3000`
- backend: `http://127.0.0.1:8000`

### Option 2: Run locally without Docker

#### Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env  # optional; settings also have sensible local defaults
python manage.py migrate
python manage.py runserver
```

#### Frontend

```bash
cd frontend
npm install
cp .env.example .env
npm start
```

## Configuration

The project now supports small but useful environment-based configuration for local development.

### Backend environment variables

Defined in `backend/.env.example`:

- `DJANGO_SECRET_KEY`
- `DJANGO_DEBUG`
- `DJANGO_ALLOWED_HOSTS`
- `DJANGO_CORS_ALLOWED_ORIGINS`

If these are not set, the app uses local-development defaults.

### Frontend environment variables

Defined in `frontend/.env.example`:

- `REACT_APP_API_BASE_URL` — base URL for the Django API.

Default: `http://127.0.0.1:8000`

## Tests

### Backend

```bash
cd backend
python -m pip install -r requirements.txt
python manage.py test
```

### Frontend

```bash
cd frontend
npm test -- --watchAll=false
```

## Engineering notes

- The backend uses Django's built-in `User` model plus related domain models for accounts, friends, expenses, and groups.
- The frontend mixes TypeScript and JavaScript, which is reasonable for an incremental project but is a natural future cleanup target.
- API authentication uses token-based flows and authenticated REST endpoints for most application data.
- Local SQLite keeps setup simple and makes the repository easy to evaluate.

## Implementation notes

A few practical notes for reviewers and contributors:

- configuration is suitable for local development, not production deployment,
- dependency management is still lightweight rather than fully locked and reproducible,
- some backend views still use broad exception handling and would benefit from more explicit validation paths,
- the frontend uses direct `fetch` calls instead of a more centralized API client abstraction.

## Highlights

The strongest engineering aspects of the repository are:

- a clear full-stack boundary between UI and API,
- a domain with real relational complexity,
- end-to-end user workflows rather than isolated components,
- included automated tests on both frontend and backend,
- enough scope to show practical engineering decisions without becoming overengineered.
