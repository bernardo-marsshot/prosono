import hashlib
import secrets
from datetime import UTC, datetime, timedelta
from typing import Any

from config import JWT_ALGORITHM, JWT_SECRET_KEY
import jwt

ACCESS_TOKEN_EXPIRE_DURATION = timedelta(weeks=1)


def generate_salt() -> str:
    """Generate a random salt for password hashing."""
    return secrets.token_hex(32)


def hash_password(password: str, salt: str) -> str:
    """Hash a password with the given salt using SHA-256."""
    return hashlib.sha256((password + salt).encode()).hexdigest()


def verify_password(password: str, salt: str, hashed_password: str) -> bool:
    """Verify a password against its hash and salt."""
    return hash_password(password, salt) == hashed_password


def create_access_token(data: dict[str, Any], expires_delta: timedelta | None = None):
    """Create a JWT access token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(UTC) + expires_delta
    else:
        expire = datetime.now(UTC) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(
        to_encode,
        JWT_SECRET_KEY,
        algorithm=JWT_ALGORITHM,
    )
    return encoded_jwt


def verify_token(token: str) -> dict | None:
    """Verify and decode a JWT token."""
    try:
        payload = jwt.decode(token, JWT_SECRET_KEY, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None
