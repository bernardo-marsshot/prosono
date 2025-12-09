from datetime import date, datetime, time
from enum import Enum

from pydantic import BaseModel, EmailStr, Field, field_validator


class GenderEnum(str, Enum):
    M = "M"
    F = "F"
    O = "O"  # noqa: E741


class UserStatusEnum(str, Enum):
    PRE_EVALUATION = "pre_evaluation"
    SLEEP_TRACKING = "sleep_tracking"
    POST_EVALUATION = "post_evaluation"
    SLEEP_RELATIONSHIP = "sleep_relationship"


class UserCreate(BaseModel):
    email: EmailStr
    password: str
    first_name: str = Field(alias="firstName")
    last_name: str = Field(alias="lastName")
    birth_date: date = Field(alias="birthDate")
    gender: GenderEnum
    school: str
    school_year: int = Field(alias="schoolYear")

    @field_validator("school_year")
    @classmethod
    def validate_school_year(cls, v):
        if v not in [10, 11, 12]:
            raise ValueError("school_year must be 10, 11, or 12")
        return v

    class Config:
        populate_by_name = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class MeanMetrics(BaseModel):
    last_7_days: float | None = Field(serialization_alias="last7Days")
    last_15_days: float | None = Field(serialization_alias="last15Days")
    last_30_days: float | None = Field(serialization_alias="last30Days")


class DailySurveysInfo(BaseModel):
    target: int
    dates: list[date]
    mean_sleep_duration: MeanMetrics = Field(serialization_alias="meanSleepDuration")
    mean_wake_time: MeanMetrics = Field(
        serialization_alias="meanWakeTime"
    )  # in minutes from midnight
    mean_bedtime: MeanMetrics = Field(
        serialization_alias="meanBedtime"
    )  # in minutes from midnight
    mean_time_to_sleep: MeanMetrics = Field(
        serialization_alias="meanTimeToSleep"
    )  # in minutes
    mean_night_awakenings: MeanMetrics = Field(
        serialization_alias="meanNightAwakenings"
    )  # count
    mean_sleep_quality: MeanMetrics = Field(
        serialization_alias="meanSleepQuality"
    )  # 0-5 scale


class SurveyData(BaseModel):
    date: date
    score: int
    my_sleep_means: dict[str, float] | None = Field(
        default=None, serialization_alias="mySleepMeans"
    )
    cleveland_mean: float | None = Field(
        default=None, serialization_alias="clevelandMean"
    )


# Kind of an hack
class UserProfileResponse(BaseModel):
    email: EmailStr
    first_name: str = Field(serialization_alias="firstName")
    last_name: str = Field(serialization_alias="lastName")
    birth_date: date = Field(serialization_alias="birthDate")
    gender: GenderEnum
    school: str
    school_year: int = Field(serialization_alias="schoolYear")

    class Config:
        from_attributes = True


class UserResponse(BaseModel):
    email: EmailStr
    first_name: str = Field(serialization_alias="firstName")
    last_name: str = Field(serialization_alias="lastName")
    birth_date: date = Field(serialization_alias="birthDate")
    gender: GenderEnum
    school: str
    school_year: int = Field(serialization_alias="schoolYear")
    evaluation_surveys: list[SurveyData] = Field(
        serialization_alias="evaluationSurveys"
    )
    daily_surveys: DailySurveysInfo = Field(serialization_alias="dailySurveys")

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    first_name: str | None = Field(default=None, alias="firstName")
    last_name: str | None = Field(default=None, alias="lastName")
    birth_date: date | None = Field(default=None, alias="birthDate")
    gender: GenderEnum | None = None
    school: str | None = None
    school_year: int | None = Field(default=None, alias="schoolYear")

    @field_validator("school_year")
    @classmethod
    def validate_school_year(cls, v):
        if v is not None and v not in [10, 11, 12]:
            raise ValueError("school_year must be 10, 11, or 12")
        return v

    class Config:
        populate_by_name = True


class SleepSurveyCreate(BaseModel):
    dormir_pouco_agressivo_irritadico: bool = Field(
        alias="dormirPoucoAgressivoIrritadico"
    )
    adormecer_aumenta_temperatura_corpo: bool = Field(
        alias="adormecerAumentaTemperaturaCorpo"
    )
    hora_dormir_nao_influencia_qualidade_sono: bool = Field(
        alias="horaDormirNaoInfluenciaQualidadeSono"
    )
    computador_noite_prejudica_sono: bool = Field(alias="computadorNoitePrejudicaSono")
    adolescentes_devem_dormir_8_horas: bool = Field(
        alias="adolescentesDevemDormir8Horas"
    )
    concentracao_independente_do_sono: bool = Field(
        alias="concentracaoIndependenteDoSono"
    )
    dormir_sem_atividade_cerebral: bool = Field(alias="dormirSemAtividadeCerebral")
    indiferente_dormir_dia_ou_noite: bool = Field(alias="indiferenteDormirDiaOuNoite")
    comer_muito_antes_prejudica_sono: bool = Field(alias="comerMuitoAntesPrejudicaSono")
    mensagens_noite_prejudica_sono: bool = Field(alias="mensagensNoitePrejudicaSono")
    dormir_pouco_aumenta_doencas: bool = Field(alias="dormirPoucoAumentaDoencas")
    estudar_tarde_igual_eficaz_dia: bool = Field(alias="estudarTardeIgualEficazDia")
    muita_luz_noite_altera_ritmo: bool = Field(alias="muitaLuzNoiteAlteraRitmo")
    esforco_fisico_ajuda_adormecer: bool = Field(alias="esforcoFisicoAjudaAdormecer")
    compensar_sono_perdido_noite_seguinte: bool = Field(
        alias="compensarSonoPerdidoNoiteSeguinte"
    )
    sono_insuficiente_engordar: bool = Field(alias="sonoInsuficienteEngordar")
    sesta_nao_afeta_sono_noite: bool = Field(alias="sestaNaoAfetaSonoNoite")
    luz_sol_ajuda_dormir_bem: bool = Field(alias="luzSolAjudaDormirBem")
    dormir_pouco_aumenta_acidentes: bool = Field(alias="dormirPoucoAumentaAcidentes")
    varios_tipos_sono_noite: bool = Field(alias="variosTiposSonoNoite")
    survey_date: date = Field(alias="surveyDate")

    class Config:
        populate_by_name = True


class SleepSurveyResponse(BaseModel):
    id: int
    dormir_pouco_agressivo_irritadico: bool = Field(
        serialization_alias="dormirPoucoAgressivoIrritadico"
    )
    adormecer_aumenta_temperatura_corpo: bool = Field(
        serialization_alias="adormecerAumentaTemperaturaCorpo"
    )
    hora_dormir_nao_influencia_qualidade_sono: bool = Field(
        serialization_alias="horaDormirNaoInfluenciaQualidadeSono"
    )
    computador_noite_prejudica_sono: bool = Field(
        serialization_alias="computadorNoitePrejudicaSono"
    )
    adolescentes_devem_dormir_8_horas: bool = Field(
        serialization_alias="adolescentesDevemDormir8Horas"
    )
    concentracao_independente_do_sono: bool = Field(
        serialization_alias="concentracaoIndependenteDoSono"
    )
    dormir_sem_atividade_cerebral: bool = Field(
        serialization_alias="dormirSemAtividadeCerebral"
    )
    indiferente_dormir_dia_ou_noite: bool = Field(
        serialization_alias="indiferenteDormirDiaOuNoite"
    )
    comer_muito_antes_prejudica_sono: bool = Field(
        serialization_alias="comerMuitoAntesPrejudicaSono"
    )
    mensagens_noite_prejudica_sono: bool = Field(
        serialization_alias="mensagensNoitePrejudicaSono"
    )
    dormir_pouco_aumenta_doencas: bool = Field(
        serialization_alias="dormirPoucoAumentaDoencas"
    )
    estudar_tarde_igual_eficaz_dia: bool = Field(
        serialization_alias="estudarTardeIgualEficazDia"
    )
    muita_luz_noite_altera_ritmo: bool = Field(
        serialization_alias="muitaLuzNoiteAlteraRitmo"
    )
    esforco_fisico_ajuda_adormecer: bool = Field(
        serialization_alias="esforcoFisicoAjudaAdormecer"
    )
    compensar_sono_perdido_noite_seguinte: bool = Field(
        serialization_alias="compensarSonoPerdidoNoiteSeguinte"
    )
    sono_insuficiente_engordar: bool = Field(
        serialization_alias="sonoInsuficienteEngordar"
    )
    sesta_nao_afeta_sono_noite: bool = Field(
        serialization_alias="sestaNaoAfetaSonoNoite"
    )
    luz_sol_ajuda_dormir_bem: bool = Field(serialization_alias="luzSolAjudaDormirBem")
    dormir_pouco_aumenta_acidentes: bool = Field(
        serialization_alias="dormirPoucoAumentaAcidentes"
    )
    varios_tipos_sono_noite: bool = Field(serialization_alias="variosTiposSonoNoite")
    survey_date: date = Field(serialization_alias="surveyDate")
    created_at: date = Field(serialization_alias="createdAt")

    class Config:
        from_attributes = True


class DailySleepSurveyCreate(BaseModel):
    hora_levantaste_hoje: time = Field(alias="horaLevantasteHoje")
    hora_deitaste_ontem: time = Field(alias="horaDeitasteOntem")
    tempo_ate_adormecer: int = Field(
        alias="tempoAteAdormecer", ge=0
    )  # minutes, must be >= 0
    vezes_acordaste_noite: int = Field(
        alias="vezesAcordasteNoite", ge=0
    )  # must be >= 0
    horas_que_dormiste: int = Field(
        alias="horasQueDormiste", ge=0
    )  # total minutes of sleep
    qualidade_sono_noite: int = Field(
        alias="qualidadeSonoNoite", ge=0, le=5
    )  # 0-5 scale
    observacao_noite_passada: str | None = Field(
        default=None, alias="observacaoNoitePassada"
    )
    survey_date: date = Field(alias="surveyDate")

    class Config:
        populate_by_name = True


class DailySleepSurveyResponse(BaseModel):
    id: int
    hora_levantaste_hoje: time = Field(serialization_alias="horaLevantasteHoje")
    hora_deitaste_ontem: time = Field(serialization_alias="horaDeitasteOntem")
    tempo_ate_adormecer: int = Field(serialization_alias="tempoAteAdormecer")
    vezes_acordaste_noite: int = Field(serialization_alias="vezesAcordasteNoite")
    horas_que_dormiste: int = Field(serialization_alias="horasQueDormiste")
    qualidade_sono_noite: int = Field(serialization_alias="qualidadeSonoNoite")
    observacao_noite_passada: str | None = Field(
        serialization_alias="observacaoNoitePassada"
    )
    survey_date: date = Field(serialization_alias="surveyDate")

    class Config:
        from_attributes = True


class ClevelandSurveyCreate(BaseModel):
    adormeco_durante_aulas_manha: int = Field(
        alias="adormecoduranteAulasManha", ge=0, le=5
    )
    consigo_aguentar_dia_inteiro_escola_sem_cansaco: int = Field(
        alias="consigoAguentarDiaInteiroEscolaSemCansaco", ge=0, le=5
    )
    adormeco_ultima_aula_dia: int = Field(alias="adormecoUltimaAulaDia", ge=0, le=5)
    fico_sonolento_carro_mais_5_minutos: int = Field(
        alias="ficoSonolentoCarroMais5Minutos", ge=0, le=5
    )
    fico_bem_acordado_durante_todo_dia: int = Field(
        alias="ficoBemAcordadoDuranteTodoDia", ge=0, le=5
    )
    adormeco_escola_aulas_tarde: int = Field(
        alias="adormecoEscolaAulasTarde", ge=0, le=5
    )
    sinto_me_desperto_durante_aulas: int = Field(
        alias="sintoMeDespertoDuranteAulas", ge=0, le=5
    )
    sinto_me_sonolento_fim_dia_depois_aulas: int = Field(
        alias="sintoMeSonolentoFimDiaDepoisAulas", ge=0, le=5
    )
    sinto_me_sonolento_autocarro_atividade_escola: int = Field(
        alias="sintoMeSonolentoAutocarroAtividadeEscola", ge=0, le=5
    )
    de_manha_quando_estou_escola_adormeco: int = Field(
        alias="deManhaQuandoEstouEscolaAdormeco", ge=0, le=5
    )
    quando_estou_aulas_sinto_me_bem_desperto: int = Field(
        alias="quandoEstouAulasSintoMeBemDesperto", ge=0, le=5
    )
    sinto_me_sonolento_trabalhos_casa_noite_escola: int = Field(
        alias="sintoMeSonolentoTrabalhosCasaNoiteEscola", ge=0, le=5
    )
    estou_bem_desperto_ultima_aula_dia: int = Field(
        alias="estouBemDespertoUltimaAulaDia", ge=0, le=5
    )
    adormeco_quando_ando_carro_autocarro_comboio: int = Field(
        alias="adormecoQuandoAndoCarroAutocarroComboio", ge=0, le=5
    )
    durante_dia_escola_momentos_acabei_adormecer: int = Field(
        alias="duranteDiaEscolaMomentosAcabeiAdormecer", ge=0, le=5
    )
    adormeco_quando_faco_trabalhos_escola_noite_casa: int = Field(
        alias="adormecoQuandoFacoTrabalhosEscolaNoiteCasa", ge=0, le=5
    )
    survey_date: date = Field(alias="surveyDate")

    class Config:
        populate_by_name = True


class ClevelandSurveyResponse(BaseModel):
    id: int
    adormeco_durante_aulas_manha: int = Field(
        serialization_alias="adormecoduranteAulasManha"
    )
    consigo_aguentar_dia_inteiro_escola_sem_cansaco: int = Field(
        serialization_alias="consigoAguentarDiaInteiroEscolaSemCansaco"
    )
    adormeco_ultima_aula_dia: int = Field(serialization_alias="adormecoUltimaAulaDia")
    fico_sonolento_carro_mais_5_minutos: int = Field(
        serialization_alias="ficoSonolentoCarroMais5Minutos"
    )
    fico_bem_acordado_durante_todo_dia: int = Field(
        serialization_alias="ficoBemAcordadoDuranteTodoDia"
    )
    adormeco_escola_aulas_tarde: int = Field(
        serialization_alias="adormecoEscolaAulasTarde"
    )
    sinto_me_desperto_durante_aulas: int = Field(
        serialization_alias="sintoMeDespertoDuranteAulas"
    )
    sinto_me_sonolento_fim_dia_depois_aulas: int = Field(
        serialization_alias="sintoMeSonolentoFimDiaDepoisAulas"
    )
    sinto_me_sonolento_autocarro_atividade_escola: int = Field(
        serialization_alias="sintoMeSonolentoAutocarroAtividadeEscola"
    )
    de_manha_quando_estou_escola_adormeco: int = Field(
        serialization_alias="deManhaQuandoEstouEscolaAdormeco"
    )
    quando_estou_aulas_sinto_me_bem_desperto: int = Field(
        serialization_alias="quandoEstouAulasSintoMeBemDesperto"
    )
    sinto_me_sonolento_trabalhos_casa_noite_escola: int = Field(
        serialization_alias="sintoMeSonolentoTrabalhosCasaNoiteEscola"
    )
    estou_bem_desperto_ultima_aula_dia: int = Field(
        serialization_alias="estouBemDespertoUltimaAulaDia"
    )
    adormeco_quando_ando_carro_autocarro_comboio: int = Field(
        serialization_alias="adormecoQuandoAndoCarroAutocarroComboio"
    )
    durante_dia_escola_momentos_acabei_adormecer: int = Field(
        serialization_alias="duranteDiaEscolaMomentosAcabeiAdormecer"
    )
    adormeco_quando_faco_trabalhos_escola_noite_casa: int = Field(
        serialization_alias="adormecoQuandoFacoTrabalhosEscolaNoiteCasa"
    )
    survey_date: date = Field(serialization_alias="surveyDate")
    created_at: datetime = Field(serialization_alias="createdAt")

    class Config:
        from_attributes = True


class MySleepSurveyCreate(BaseModel):
    durmo_mal_ou_bem: int = Field(alias="durmoMalOuBem", ge=1, le=10)
    gosto_de_dormir: int = Field(alias="gostoDeDormir", ge=1, le=10)
    acho_sono_importante_para_mim: int = Field(
        alias="achoSonoImportanteParaMim", ge=1, le=10
    )
    o_que_sei_sobre_sono: int = Field(alias="oQueSeiSobreSono", ge=1, le=10)
    survey_date: date = Field(alias="surveyDate")

    class Config:
        populate_by_name = True


class MySleepSurveyResponse(BaseModel):
    id: int
    durmo_mal_ou_bem: int = Field(serialization_alias="durmoMalOuBem")
    gosto_de_dormir: int = Field(serialization_alias="gostoDeDormir")
    acho_sono_importante_para_mim: int = Field(
        serialization_alias="achoSonoImportanteParaMim"
    )
    o_que_sei_sobre_sono: int = Field(serialization_alias="oQueSeiSobreSono")
    survey_date: date = Field(serialization_alias="surveyDate")
    created_at: datetime = Field(serialization_alias="createdAt")

    class Config:
        from_attributes = True


class Token(BaseModel):
    access_token: str = Field(serialization_alias="accessToken")
    token_type: str = Field(serialization_alias="tokenType")
