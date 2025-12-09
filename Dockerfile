# Multi-stage Dockerfile to build both frontend and backend in a single container

# Build stage for frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY frontend/package*.json ./
RUN npm ci

# Copy frontend source code
COPY frontend/ ./

# Set build-time environment variables for frontend
ARG VITE_API_URL=https://ca-marsshot-prosono-mvp-prod.reddune-12867b40.westeurope.azurecontainerapps.io
ENV VITE_API_URL=$VITE_API_URL

# Build frontend for production (skip TypeScript check)
RUN npm run vite build || npx vite build

# Backend builder stage
FROM python:3.12-slim AS backend-builder

# Install uv for dependency management
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

WORKDIR /app/backend

# Copy backend dependency files
COPY backend/pyproject.toml backend/uv.lock ./

# Install dependencies into virtual environment
RUN uv sync --frozen --no-dev

# Runtime stage - final optimized image
FROM python:3.12-slim AS runtime

WORKDIR /app

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy virtual environment from backend builder
COPY --from=backend-builder --chown=appuser:appuser /app/backend/.venv /app/.venv

# Copy backend code
COPY --chown=appuser:appuser backend/ ./backend/

# Copy built frontend from frontend builder to expected location
COPY --from=frontend-builder /app/frontend/dist ./frontend/dist

# Create logs and data directories with proper permissions
RUN mkdir -p /app/backend/logs /app/backend/data && \
    chown -R appuser:appuser /app/backend/logs /app/backend/data

# Make startup script executable
RUN chmod +x /app/backend/startup.sh

# Set environment variables
ENV PYTHONPATH=/app/backend
ENV PYTHONUNBUFFERED=1
ENV PATH="/app/.venv/bin:$PATH"

# Backend environment variables (with defaults)
# DATABASE_URL will be set by Azure Container Apps environment variables
ENV JWT_ALGORITHM=HS256
ENV ENVIRONMENT=production
ENV REQUIRED_DAILY_SURVEYS=7

# Switch to non-root user
USER appuser

# Set working directory to backend
WORKDIR /app/backend

# Expose port
EXPOSE 8000

# Run the startup script
# CMD ["/app/backend/startup.sh"]
CMD ["python", "-m", "uvicorn", "main:app", "--host", "0.0.0.0", "--port" ,"8000"]
