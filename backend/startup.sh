#!/bin/sh

echo "Starting ProSono backend..."

# Ensure we're in the right directory
cd /app/backend

# Run database migrations
echo "Running database migrations..."
python -m alembic upgrade head

# Start the application
echo "Starting uvicorn server..."
python -m uvicorn main:app --host 0.0.0.0 --port 8000