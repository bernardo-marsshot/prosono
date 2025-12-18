# ProSono

ProSono is a sleep education web application designed for students aged 15-18. The platform focuses on evidence-based sleep education to improve academic performance and well-being. It includes sleep assessments, daily sleep tracking, and educational surveys.

## Project Overview

ProSono is a fullstack web application that helps students track and improve their sleep habits through:

- **Sleep Assessments**: Knowledge-based surveys to evaluate sleep understanding
- **Daily Sleep Tracking**: Track sleep duration, quality, and patterns over time
- **Sleep Surveys**: Various questionnaires including Cleveland surveys and attitude assessments
- **Dashboard**: Visualize sleep metrics and progress over time

## Technology Stack

### Frontend

- **React 19** with TypeScript
- **Vite** for build tooling
- **Tailwind CSS** for styling
- **React Router v6** for routing
- **Biome** for linting and formatting

### Backend

- **FastAPI** (Python 3.12+)
- **SQLAlchemy** for ORM
- **Alembic** for database migrations
- **PostgreSQL** for database
- **JWT** for authentication
- **uv** for dependency management
- **Ruff** for linting and formatting

## Project Structure

```
prosono/
├── backend/                 # FastAPI backend application
│   ├── alembic/            # Database migrations
│   ├── models/             # SQLAlchemy database models
│   ├── main.py             # FastAPI application entry point
│   ├── database.py         # Database connection setup
│   ├── config.py           # Configuration and environment variables
│   ├── auth.py             # Authentication utilities
│   ├── schemas.py          # Pydantic schemas for API
│   └── pyproject.toml       # Python dependencies
│
├── frontend/               # React frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/          # Page components
│   │   ├── services/       # API service layer
│   │   ├── hooks/          # Custom React hooks
│   │   ├── types/          # TypeScript type definitions
│   │   └── styles/         # Global styles
│   ├── public/             # Static assets
│   └── package.json        # Node.js dependencies
│
├── infra/                  # Infrastructure and deployment scripts
└── Dockerfile              # Multi-stage Docker build
```

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v20 or higher) and npm
- **Python** 3.12 or higher
- **PostgreSQL** 15 or higher (or Docker to run PostgreSQL in a container)
- **uv** (Python package manager) - [Installation guide](https://github.com/astral-sh/uv)
- **Git**

## Local Development Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd prosono
```

### 2. Database Setup

#### Option A: Using Docker (Recommended for Quick Setup)

```bash
# Start PostgreSQL container
docker run -d --name postgres-prosono \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=prosono \
  -p 5432:5432 \
  postgres:15

# The database will be available at:
# Host: localhost
# Port: 5432
# Database: prosono
# User: postgres
# Password: password
```

#### Option B: Using Local PostgreSQL

Ensure PostgreSQL is installed and running, then create a database:

createdb prosono

### 3. Backend Setup

```bash
cd backend

# Install dependencies using uv
uv sync

# Set up environment variables
set DATABASE_URL="postgresql://postgres:password@localhost:5432/prosono"
set JWT_SECRET_KEY="your-secret-key-change-this-in-development"
set JWT_ALGORITHM="HS256"
set ENVIRONMENT="development"
set REQUIRED_DAILY_SURVEYS="7"

# Run database migrations
uv run alembic upgrade head

# Start the development server
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend API will be available at `http://localhost:8000`

**API Documentation**: Once the server is running, visit:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

### 4. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Set up environment variables (optional, defaults to localhost:3001)
# Create a .env file or export:
export VITE_API_URL="http://localhost:8000"

# Start the development server
npm run dev
```

The frontend will be available at `http://localhost:3000`

**Note**: The frontend expects the backend API at `http://localhost:8000` by default. If your backend runs on a different port, update the `VITE_API_URL` environment variable.

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `backend/` directory or export these variables:

```bash
# Database connection
DATABASE_URL=postgresql://postgres:password@localhost:5432/prosono

# JWT configuration
JWT_SECRET_KEY=your-secret-key-change-this-in-production
JWT_ALGORITHM=HS256

# Application settings
ENVIRONMENT=development
REQUIRED_DAILY_SURVEYS=7
```

### Frontend Environment Variables

Create a `.env` file in the `frontend/` directory:

```bash
# Backend API URL
VITE_API_URL=http://localhost:8000
```

## Running the Application

### Development Mode

1. **Start the database** (if using Docker):

   ```bash
   docker start postgres-prosono
   ```
2. **Start the backend** (in one terminal):

   ```bash
   cd backend
   export DATABASE_URL="postgresql://postgres:password@localhost:5432/prosono"
   export JWT_SECRET_KEY="dev-secret-key"
   uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```
3. **Start the frontend** (in another terminal):

   ```bash
   cd frontend
   npm run dev
   ```
4. **Open your browser** and navigate to `http://localhost:3000`

## Development Commands

### Backend Commands

```bash
cd backend

# Start development server
uv run uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Run database migrations
uv run alembic upgrade head

# Create a new migration
uv run alembic revision --autogenerate -m "description"

# Rollback last migration
uv run alembic downgrade -1

# Lint code
uv run ruff check

# Format code
uv run ruff format
```

### Frontend Commands

```bash
cd frontend

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type check
npm run type-check

# Lint code
npm run lint

# Auto-fix linting issues
npm run lint:fix

# Format code
npm run format
```

## Database Migrations

The project uses Alembic for database migrations. All migrations are stored in `backend/alembic/versions/`.

### Creating a Migration

After modifying models in `backend/models/`:

```bash
cd backend
uv run alembic revision --autogenerate -m "description of changes"
```

### Applying Migrations

```bash
cd backend
uv run alembic upgrade head
```

### Rolling Back

```bash
cd backend
uv run alembic downgrade -1  # Rollback one migration
```

## Testing the Setup

1. **Backend Health Check**: Visit `http://localhost:8000/health` - should return `{"status": "healthy"}`
2. **API Documentation**: Visit `http://localhost:8000/docs` to see the interactive API documentation
3. **Frontend**: Visit `http://localhost:3000` - you should see the landing page
4. **Register a User**: Use the registration form to create a test account

## Common Issues

### Database Connection Issues

- Ensure PostgreSQL is running: `docker ps` (if using Docker) or `pg_isready`
- Verify `DATABASE_URL` is correctly set
- Check that the database exists: `psql -U postgres -l`

### Port Already in Use

- Backend (port 8000): Change the port in the uvicorn command or kill the process using that port
- Frontend (port 3000): Vite will automatically try the next available port, or specify a different port in `vite.config.ts`

### Migration Errors

- Ensure you're running migrations from the `backend/` directory
- Check that `DATABASE_URL` is set correctly
- Verify the database exists and is accessible

### Frontend Can't Connect to Backend

- Verify `VITE_API_URL` is set to `http://localhost:8000`
- Check that the backend server is running
- Check browser console for CORS errors (backend should allow all origins in development)

## Project Architecture

### Authentication Flow

1. User registers/logs in via `/auth/register` or `/auth/login`
2. Backend returns a JWT token
3. Frontend stores token in localStorage
4. All subsequent API requests include the token in the `Authorization` header
5. Backend validates the token on protected routes

### API Structure

- **Authentication**: `/auth/register`, `/auth/login`
- **User Management**: `/user` (GET, PUT)
- **Surveys**: `/surveys`, `/daily-surveys`, `/cleveland-surveys`, `/my-sleep-surveys`
- **Health Check**: `/health`

### Frontend Routing

- Public routes: `/`, `/about`, `/login`, `/register`
- Protected routes: `/dashboard`, `/profile`, `/sleep-tracking`, etc.
- Protected routes require authentication via `ProtectedRoute` component

## Contributing

1. Create a feature branch from `master`
2. Make your changes
3. Run linting and formatting: `npm run lint:fix` (frontend) or `uv run ruff format` (backend)
4. Test your changes locally
5. Commit using semantic commit messages (see `CLAUDE.md` for format)
6. Push and create a pull request

## Additional Resources

- **Backend Documentation**: See `backend/CLAUDE.md` for detailed backend architecture
- **Frontend Documentation**: See `frontend/CLAUDE.md` for detailed frontend architecture
- **Project Overview**: See `CLAUDE.md` for high-level project documentation

## License

[Add license information here]

## Support

For questions or issues, please [create an issue](link-to-issues) or contact the development team.
