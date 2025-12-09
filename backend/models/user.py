import enum

from sqlalchemy import Column, Date, DateTime, Enum, Integer, String
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .base import Base


class Gender(str, enum.Enum):
    M = "M"
    F = "F"
    O = "O"  # noqa: E741


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    password_hash = Column(String, nullable=False)
    salt = Column(String, nullable=False)
    first_name = Column(String, nullable=False)
    last_name = Column(String, nullable=False)
    birth_date = Column(Date, nullable=False)
    gender = Column(Enum(Gender), nullable=False)
    school = Column(String, nullable=False)
    school_year = Column(Integer, nullable=False)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    sleep_surveys = relationship("SleepSurvey", back_populates="user")
    daily_sleep_surveys = relationship("DailySleepSurvey", back_populates="user")
    cleveland_surveys = relationship("ClevelandSurvey", back_populates="user")
    my_sleep_surveys = relationship("MySleepSurvey", back_populates="user")
