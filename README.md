# MockMe — AI Mock Interview Platform

A multi-agent system for CS/LeetCode mock interviews with real-time voice, live coding, and AI-powered feedback.

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + Vite + Monaco Editor |
| Backend | Django 6 + Django REST Framework |
| Realtime | Django Channels + Redis |
| Database | PostgreSQL 15 |
| AI | OpenAI GPT-4o |
| Infrastructure | Docker + Docker Compose |

## Prerequisites

Before you start, make sure you have installed:
- [Docker Desktop](https://www.docker.com/products/docker-desktop/) — required to run the database and services
- [Git](https://git-scm.com/) — to clone the repo

That's it. Docker handles everything else.

## Quick Start

### 1. Clone the repository
```bash
git clone git@github.com:Daominh09/mock-me.git
cd mock-me
```

### 2. Create your `.env` file
```bash
touch .env
```

Open `.env` and fill in the values:
```
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1

DB_NAME=mockme_db
DB_USER=mockme_user
DB_PASSWORD=mockme_pass
DB_HOST=db
DB_PORT=5432

REDIS_URL=redis://redis:6379/0

OPENAI_API_KEY=sk-your-openai-key-here

CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:3000
```

Generate a secret key by running:
```bash
python3 -c "import secrets; print(secrets.token_urlsafe(50))"
```

> ⚠️ Important: If your SECRET_KEY contains `$` signs, replace each `$` with `$$` in the `.env` file.

### 3. Start the project
```bash
docker compose up --build
```

First run takes 3-5 minutes to download and build everything.

### 4. Verify everything is running

Open these in your browser:

| URL | What you should see |
|-----|-------------------|
| http://localhost:5173 | React frontend |
| http://localhost:8000 | Django backend |
| http://localhost:8000/admin | Django admin panel |

## Daily Workflow
```bash
# Start everything
docker compose up

# Stop everything (data is preserved)
docker compose down

# Wipe database and start fresh
docker compose down -v
docker compose up --build
```

## Project Structure
```
mock-me/
├── backend/                  # Django project
│   ├── apps/
│   │   ├── questions/        # Question bank + filtering
│   │   ├── sessions/         # Interview session management
│   │   └── users/            # Auth + user profiles
│   ├── config/               # Django settings, urls, asgi
│   ├── manage.py
│   └── requirements.txt
├── frontend/                 # React + Vite app
│   ├── src/
│   ├── index.html
│   └── package.json
├── docker/
│   ├── Dockerfile.backend
│   └── Dockerfile.frontend
├── docker-compose.yml
└── sample.env                # Copy this to .env
```

## Running Django Commands

While Docker is running, open a new terminal:
```bash
# Run migrations
docker compose exec backend python manage.py migrate

# Create a superuser for Django admin
docker compose exec backend python manage.py createsuperuser

# Make new migrations after changing models
docker compose exec backend python manage.py makemigrations
```

## Verify Database and Redis
```bash
# Check PostgreSQL tables
docker compose exec db psql -U mockme_user -d mockme_db -c "\dt"

# Check Redis
docker compose exec redis redis-cli ping
# Should return: PONG
```

## Team Branching Strategy
```
main    ← stable releases only
dev     ← team integration branch
feat/   ← individual feature branches
```
```bash
# Start working on a new feature
git checkout dev
git pull origin dev
git checkout -b feat/your-name-feature

# Push your work
git add .
git commit -m "feat: description of what you did"
git push origin feat/your-name-feature

# Then open a Pull Request into dev on GitHub
```

## Troubleshooting

**Port already in use:**
```bash
docker compose down
docker compose up
```

**Database connection error:**
```bash
docker compose down -v
docker compose up --build
```

**See logs for a specific service:**
```bash
docker compose logs backend
docker compose logs db
docker compose logs frontend
docker compose logs redis
```

**Migrations not applying:**
```bash
docker compose exec backend python manage.py migrate
```