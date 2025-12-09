from sqlalchemy import Column, Date, DateTime, ForeignKey, Integer, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from .base import Base


class ClevelandSurvey(Base):
    __tablename__ = "cleveland_surveys"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Cleveland survey fields (0-5 scale)
    adormeco_durante_aulas_manha = Column(Integer, nullable=False)  # 1
    consigo_aguentar_dia_inteiro_escola_sem_cansaco = Column(
        Integer, nullable=False
    )  # 2
    adormeco_ultima_aula_dia = Column(Integer, nullable=False)  # 3
    fico_sonolento_carro_mais_5_minutos = Column(Integer, nullable=False)  # 4
    fico_bem_acordado_durante_todo_dia = Column(Integer, nullable=False)  # 5
    adormeco_escola_aulas_tarde = Column(Integer, nullable=False)  # 6
    sinto_me_desperto_durante_aulas = Column(Integer, nullable=False)  # 7
    sinto_me_sonolento_fim_dia_depois_aulas = Column(Integer, nullable=False)  # 8
    sinto_me_sonolento_autocarro_atividade_escola = Column(Integer, nullable=False)  # 9
    de_manha_quando_estou_escola_adormeco = Column(Integer, nullable=False)  # 10
    quando_estou_aulas_sinto_me_bem_desperto = Column(Integer, nullable=False)  # 11
    sinto_me_sonolento_trabalhos_casa_noite_escola = Column(
        Integer, nullable=False
    )  # 12
    estou_bem_desperto_ultima_aula_dia = Column(Integer, nullable=False)  # 13
    adormeco_quando_ando_carro_autocarro_comboio = Column(Integer, nullable=False)  # 14
    durante_dia_escola_momentos_acabei_adormecer = Column(Integer, nullable=False)  # 15
    adormeco_quando_faco_trabalhos_escola_noite_casa = Column(
        Integer, nullable=False
    )  # 16

    survey_date = Column(Date, nullable=False, server_default=func.current_date())
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationship with User
    user = relationship("User", back_populates="cleveland_surveys")

    # Table constraints
    __table_args__ = (
        UniqueConstraint(
            "user_id", "survey_date", name="uq_cleveland_survey_user_date"
        ),
    )

    def cleveland_score(self) -> int:
        consigo_aguentar_dia_inteiro_escola_sem_cansaco = (
            5 - self.consigo_aguentar_dia_inteiro_escola_sem_cansaco
        )
        fico_bem_acordado_durante_todo_dia = 5 - self.fico_bem_acordado_durante_todo_dia
        sinto_me_desperto_durante_aulas = 5 - self.sinto_me_desperto_durante_aulas
        quando_estou_aulas_sinto_me_bem_desperto = (
            5 - self.quando_estou_aulas_sinto_me_bem_desperto
        )
        estou_bem_desperto_ultima_aula_dia = 5 - self.estou_bem_desperto_ultima_aula_dia

        return (
            self.adormeco_durante_aulas_manha
            + consigo_aguentar_dia_inteiro_escola_sem_cansaco
            + self.adormeco_ultima_aula_dia
            + self.fico_sonolento_carro_mais_5_minutos
            + fico_bem_acordado_durante_todo_dia
            + self.adormeco_escola_aulas_tarde
            + sinto_me_desperto_durante_aulas
            + self.sinto_me_sonolento_fim_dia_depois_aulas
            + self.sinto_me_sonolento_autocarro_atividade_escola
            + self.de_manha_quando_estou_escola_adormeco
            + quando_estou_aulas_sinto_me_bem_desperto
            + self.sinto_me_sonolento_trabalhos_casa_noite_escola
            + estou_bem_desperto_ultima_aula_dia
            + self.adormeco_quando_ando_carro_autocarro_comboio
            + self.durante_dia_escola_momentos_acabei_adormecer
            + self.adormeco_quando_faco_trabalhos_escola_noite_casa
        )  # type: ignore
