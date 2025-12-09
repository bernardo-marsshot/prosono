from sqlalchemy import (
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    String,
    Time,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .base import Base


class DailySleepSurvey(Base):
    __tablename__ = "daily_sleep_surveys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Daily sleep tracking fields
    hora_levantaste_hoje = Column(Time, nullable=False)  # Time user woke up today
    hora_deitaste_ontem = Column(
        Time, nullable=False
    )  # Time user went to bed yesterday
    tempo_ate_adormecer = Column(Integer, nullable=False)  # Minutes to fall asleep
    vezes_acordaste_noite = Column(
        Integer, nullable=False
    )  # Times woke up during night
    horas_que_dormiste = Column(
        Integer, nullable=False
    )  # Hours of sleep (in minutes for precision)
    qualidade_sono_noite = Column(
        Integer, nullable=False
    )  # Sleep quality rating (1-10)
    observacao_noite_passada = Column(
        String, nullable=True
    )  # Optional observation about last night

    survey_date = Column(Date, nullable=False, server_default=func.current_date())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Ensure only one survey per user per day
    __table_args__ = (UniqueConstraint("user_id", "survey_date", name="uq_user_date"),)

    # Relationship with User
    user = relationship("User", back_populates="daily_sleep_surveys")
