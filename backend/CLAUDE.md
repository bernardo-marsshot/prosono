# Prosono Backend

FastAPI backend for the Prosono application.

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login and get access token

### User Management
- `GET /user` - Get current user information (requires authentication)
- `PUT /user` - Update user information (requires authentication)

### Surveys
- `POST /surveys` - Create a sleep survey (requires authentication)
- `POST /daily-surveys` - Create a daily sleep survey (requires authentication)
- `GET /daily-surveys` - Get today's daily sleep survey (requires authentication, returns 404 if none exists)

### Health Check
- `GET /health` - Health check endpoint

## Authentication

All protected endpoints require an `Authorization` header with a Bearer token:
```
Authorization: Bearer <access_token>
```

Access tokens expire after 1 week.

## Development

### Local Development
Start the development server:
```bash
python -m fastapi dev main.py
```

### Docker
Build and run the application using Docker:
```bash
# Build the Docker image
docker build -t prosono-backend .

# Run the container
docker run -p 8000:8000 prosono-backend
```

The application will be available at `http://localhost:8000`.

## Database

Uses SQLAlchemy with Alembic for migrations.

### Database Commands
```bash
# Generate new migration
uv run alembic revision --autogenerate -m "migration description"

# Run migrations
uv run alembic upgrade head

# Downgrade migration
uv run alembic downgrade -1
```

## Logging

The application uses a structured logging system:
- Console output with timestamps and log levels
- Daily log files in the `logs/` directory
- Logs authentication attempts, user operations, and errors
- Log levels: DEBUG, INFO, WARNING, ERROR, CRITICAL

## Security

- Passwords are hashed using SHA-256 with salt
- JWT tokens are used for authentication
- CORS is configured for all origins (update for production)

## Git Commits

This project uses semantic commits following the [Conventional Commits](https://www.conventionalcommits.org/) specification.

### Format
```
<type>(scope): <description>

[optional body]

[optional footer(s)]
```

### Backend Scope
All commits in the backend folder should use the `(backend)` scope:
```
feat(backend): add new API endpoint
fix(backend): resolve authentication issue
docs(backend): update API documentation
```

### Common Types
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools