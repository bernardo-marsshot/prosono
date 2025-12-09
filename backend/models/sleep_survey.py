from sqlalchemy import (
    Boolean,
    Column,
    Date,
    DateTime,
    ForeignKey,
    Integer,
    UniqueConstraint,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .base import Base


class SleepSurvey(Base):
    __tablename__ = "sleep_surveys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Sleep survey boolean fields
    dormir_pouco_agressivo_irritadico = Column(Boolean, nullable=False)
    adormecer_aumenta_temperatura_corpo = Column(Boolean, nullable=False)
    hora_dormir_nao_influencia_qualidade_sono = Column(Boolean, nullable=False)
    computador_noite_prejudica_sono = Column(Boolean, nullable=False)
    adolescentes_devem_dormir_8_horas = Column(Boolean, nullable=False)
    concentracao_independente_do_sono = Column(Boolean, nullable=False)
    dormir_sem_atividade_cerebral = Column(Boolean, nullable=False)
    indiferente_dormir_dia_ou_noite = Column(Boolean, nullable=False)
    comer_muito_antes_prejudica_sono = Column(Boolean, nullable=False)
    mensagens_noite_prejudica_sono = Column(Boolean, nullable=False)
    dormir_pouco_aumenta_doencas = Column(Boolean, nullable=False)
    estudar_tarde_igual_eficaz_dia = Column(Boolean, nullable=False)
    muita_luz_noite_altera_ritmo = Column(Boolean, nullable=False)
    esforco_fisico_ajuda_adormecer = Column(Boolean, nullable=False)
    compensar_sono_perdido_noite_seguinte = Column(Boolean, nullable=False)
    sono_insuficiente_engordar = Column(Boolean, nullable=False)
    sesta_nao_afeta_sono_noite = Column(Boolean, nullable=False)
    luz_sol_ajuda_dormir_bem = Column(Boolean, nullable=False)
    dormir_pouco_aumenta_acidentes = Column(Boolean, nullable=False)
    varios_tipos_sono_noite = Column(Boolean, nullable=False)

    survey_date = Column(Date, nullable=False, server_default=func.current_date())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship with User
    user = relationship("User", back_populates="sleep_surveys")

    # Table constraints
    __table_args__ = (
        UniqueConstraint("user_id", "survey_date", name="uq_sleep_survey_user_date"),
    )
