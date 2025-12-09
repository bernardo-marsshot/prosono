"""Configuration settings for the Prosono backend application."""

import logging
import os

LOGGER = logging.getLogger("prosono")


def _get_jwt_secret_key() -> str:
    jwt_secret_key = os.getenv("JWT_SECRET_KEY")
    if jwt_secret_key is None:
        LOGGER.warning("No JWT_SECRET_KEY was set, using default value")
        jwt_secret_key = "your-secret-key-change-this-in-production"

    return jwt_secret_key


# Sleep survey configuration
REQUIRED_DAILY_SURVEYS: int = int(os.getenv("REQUIRED_DAILY_SURVEYS", "7"))

# Database configuration
DATABASE_URL: str = os.getenv(
    "DATABASE_URL", "postgresql://postgres:password@192.168.1.154:5432"
)

# JWT configuration
JWT_SECRET_KEY: str = _get_jwt_secret_key()

JWT_ALGORITHM: str = os.getenv("JWT_ALGORITHM", "HS256")

# Environment
ENVIRONMENT: str = os.getenv("ENVIRONMENT", "development")
