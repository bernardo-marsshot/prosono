# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ProSono is a sleep education web application with a React frontend and FastAPI backend, targeting students aged 15-18. The application focuses on evidence-based sleep education to improve academic performance and well-being.

## Architecture

This is a fullstack application with separate frontend and backend codebases:

- **Frontend**: React 19 + TypeScript + Vite + Tailwind CSS (port 3000)
- **Backend**: FastAPI + SQLAlchemy + Alembic + Python 3.12 (port 8000)
- **Authentication**: JWT-based with automatic token refresh
- **Database**: SQLAlchemy with Alembic migrations

## Development Commands

### Frontend (`/frontend/`)
```bash
npm run dev              # Start development server (port 3000)
npm run build           # TypeScript compile + Vite build
npm run type-check      # TypeScript validation without emitting
npm run lint            # Check code with Biome
npm run lint:fix        # Auto-fix Biome issues
npm run format          # Format code with Biome
```

### Backend (`/backend/`)
```bash
python -m fastapi dev main.py           # Start development server (port 8000)
uv run ruff check                        # Lint Python code
uv run ruff format                       # Format Python code

# Database migrations
uv run alembic revision --autogenerate -m "description"  # Generate migration
uv run alembic upgrade head                              # Apply migrations
uv run alembic downgrade -1                              # Downgrade migration

# Docker
docker build -t prosono-backend .       # Build Docker image
docker run -p 8000:8000 prosono-backend # Run container
```

## Key Architecture Patterns

### Frontend Authentication System
- **Core**: `useAuth` hook provides global authentication state via React Context
- **Token Management**: Automatic JWT refresh in `services/api.ts` with localStorage persistence
- **Route Protection**: `ProtectedRoute` component wraps authenticated pages
- **API Integration**: Centralized `ApiService` class handles all HTTP requests with automatic token injection

### Backend API Structure
- **Authentication**: Register/login endpoints with JWT tokens (1 week expiry)
- **User Management**: Profile CRUD with protected endpoints
- **Survey System**: Sleep assessments and daily tracking
- **Database**: SQLAlchemy models with Alembic migrations

### Sleep Tracking Flow
- **User Status**: `pre_evaluation` → `sleep_tracking` → `post_evaluation`
- **Assessment**: 20-question true/false survey triggers status progression
- **Daily Tracking**: Sleep data collection with edit capabilities
- **Dashboard**: Real-time metrics (streak, mean sleep duration, scores)

### Frontend State Management
- React Context for global auth state (`hooks/useAuth.tsx`)
- Local component state with hooks for UI state
- No external state management library - uses React 19 patterns

### API Services Architecture
- **Base Service**: `frontend/src/services/api.ts` - Generic HTTP client with automatic auth
- **Domain Services**: 
  - `authService.ts` - Authentication endpoints
  - `surveyService.ts` - Sleep assessment endpoints
  - `dailySurveyService.ts` - Daily tracking endpoints
  - `relationshipSurveyService.ts` - Relationship survey endpoints

## Git Commit Convention

Uses semantic commits following Conventional Commits specification:
```
<type>(scope): <description>

Examples:
feat(frontend): add sleep tracking dashboard
feat(backend): implement relationship survey API
fix(backend): resolve JWT token expiration issue
```

Backend commits use `(backend)` scope, frontend commits use `(frontend)` scope.

## Deployment

### Production Deployment Options

#### Azure Container Apps (Recommended)
- **Platform**: Azure Container Apps with Azure Database for PostgreSQL
- **Database**: Managed PostgreSQL with automatic backups
- **Container Registry**: Azure Container Registry (ACR)
- **Auto-scaling**: 1-10 replicas based on HTTP requests
- **Health Checks**: Liveness and readiness probes on `/health`

#### Fly.io (Alternative)
- **Platform**: Fly.io with CDG region
- **URL**: https://prosono.fly.dev
- **Docker**: Multi-stage build combining frontend and backend
- **Resources**: 1GB memory, 1 shared CPU
- **Auto-scaling**: Machines stop when idle, auto-start on demand

### Docker Configuration
- **Multi-stage build**: Frontend (Node.js) + Backend (Python) in single container
- **Base Images**: node:20-alpine for build, python:3.12-slim for runtime
- **Security**: Non-root user, proper file permissions
- **Database**: PostgreSQL connection via environment variables
- **Environment**: Production environment variables configured via secrets

### Azure Container Apps Setup

#### Prerequisites
1. Azure CLI installed and logged in
2. Docker installed
3. Azure Container Registry created
4. Azure Database for PostgreSQL created

#### Required Environment Variables
```bash
# Database connection (stored as secret in Azure)
DATABASE_URL=postgresql://username:password@server:5432/database

# JWT configuration (stored as secret in Azure)
JWT_SECRET_KEY=your-secure-secret-key
JWT_ALGORITHM=HS256

# Application configuration
ENVIRONMENT=production
REQUIRED_DAILY_SURVEYS=7
```

#### Deployment Configuration
The `containerapp.yaml` file contains the Azure Container Apps configuration:
- **Ingress**: External access on port 8000 with CORS enabled
- **Scaling**: 1-10 replicas based on 50 concurrent requests
- **Health Checks**: Liveness and readiness probes
- **Resources**: 1 CPU, 2GB memory per container

#### Deployment Commands
```bash
# Build and tag Docker image
docker build -t {your-registry}.azurecr.io/prosono-app:latest .

# Push to Azure Container Registry
docker push {your-registry}.azurecr.io/prosono-app:latest

# Deploy using Azure CLI
az containerapp create --yaml containerapp.yaml

# Monitor deployment
az containerapp logs show --name prosono-app --resource-group {resource-group}

# Scale manually if needed
az containerapp scale --name prosono-app --resource-group {resource-group} --min-replicas 2
```

### Local Development with PostgreSQL

#### For Production-like Development
```bash
# Start PostgreSQL with persistent data (recommended for production development)
docker run -it -d -e POSTGRES_PASSWORD=password --name postgres-prosono -e PGDATA=/var/lib/postgresql/data/pgdata -v "$PWD/.postgresql/data":/var/lib/postgresql/data -p 5432:5432 postgres:latest

# Set environment variable
export DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres

# Run migrations
uv run alembic upgrade head

# Start development server
python -m fastapi dev main.py
```

#### For Quick Development
```bash
# Start local PostgreSQL (using Docker) - simpler setup
docker run -d --name postgres-local -e POSTGRES_PASSWORD=password -p 5432:5432 postgres:15

# Set environment variable
export DATABASE_URL=postgresql://postgres:password@localhost:5432/postgres

# Run migrations
uv run alembic upgrade head

# Start development server
python -m fastapi dev main.py
```

## Important Development Notes

- Both frontend and backend have their own CLAUDE.md files with detailed component-specific guidance
- Frontend uses Biome for linting/formatting, backend uses Ruff
- Database changes require Alembic migrations
- Environment variables: Frontend uses `VITE_` prefix, backend uses standard env vars
- CORS configured for all origins (update for production)
- Password hashing uses SHA-256 with salt
- Comprehensive TypeScript interfaces in `frontend/src/types/`