from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .base import Base


class MySleepSurvey(Base):
    __tablename__ = "my_sleep_surveys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # My sleep survey fields (1-10 scale)
    durmo_mal_ou_bem = Column(Integer, nullable=False)  # 1
    gosto_de_dormir = Column(Integer, nullable=False)  # 2
    acho_sono_importante_para_mim = Column(Integer, nullable=False)  # 3
    o_que_sei_sobre_sono = Column(Integer, nullable=False)  # 4

    survey_date = Column(Date, nullable=False, server_default=func.current_date())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship with User
    user = relationship("User", back_populates="my_sleep_surveys")

    # Table constraints
    __table_args__ = (
        UniqueConstraint("user_id", "survey_date", name="uq_my_sleep_survey_user_date"),
    )
