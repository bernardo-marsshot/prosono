# NOTE: the vulns in the python images are not relevant for our case as we're not using the expat library

# Build stage - Install dependencies and prepare environment
FROM python:3.12-slim AS builder

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /usr/local/bin/

# Set working directory
WORKDIR /app

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies into virtual environment
RUN uv sync --frozen --no-dev

# Runtime stage - Final optimized image
FROM python:3.12-slim AS runtime

# Set working directory
WORKDIR /app

# Create non-root user for security
RUN groupadd -r appuser && useradd -r -g appuser appuser

# Copy virtual environment from builder stage
COPY --from=builder --chown=appuser:appuser /app/.venv /app/.venv

# Copy application code
COPY --chown=appuser:appuser . .

# Create logs and data directories with proper permissions
RUN mkdir -p logs data && chown -R appuser:appuser logs data

# Set environment variables
ENV PYTHONPATH=/app
ENV PYTHONUNBUFFERED=1
ENV PATH="/app/.venv/bin:$PATH"

# Backend environment variables (with defaults)
# DATABASE_URL will be set by Azure Container Apps environment variables
ENV JWT_ALGORITHM=HS256
ENV ENVIRONMENT=production
ENV REQUIRED_DAILY_SURVEYS=7

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 9090

# Run database migrations and start the application
CMD ["sh", "-c", "alembic upgrade head && uvicorn main:app --host 0.0.0.0 --port 9090"]
