# Sleep Survey Answer Key
# Maps database field names to correct answers (True/False)
# Based on the provided answer sequence: v,f,f,v,f,f,f,f,v,v,v,f,v,f,f,v,f,v,v,v

SLEEP_SURVEY_ANSWER_KEY = {
    # Question 1: Quando se dorme pouco, fica-se mais agressivo e irritadiço
    "dormir_pouco_agressivo_irritadico": True,
    # Question 2: Quando se adormece, aumenta a temperatura do corpo
    "adormecer_aumenta_temperatura_corpo": False,
    # Question 3: A hora a que se dorme não influencia a qualidade do sono
    "hora_dormir_nao_influencia_qualidade_sono": False,
    # Question 4: Estar no computador à noite, antes de ir dormir, prejudica a qualidade do sono
    "computador_noite_prejudica_sono": True,
    # Question 5: Em média, os adolescentes devem dormir 8 horas por noite
    "adolescentes_devem_dormir_8_horas": False,
    # Question 6: A capacidade de concentração é independente do sono
    "concentracao_independente_do_sono": False,
    # Question 7: Quando se está a dormir, não há atividade cerebral
    "dormir_sem_atividade_cerebral": False,
    # Question 8: É indiferente dormir de dia ou à noite, desde que se durma muito
    "indiferente_dormir_dia_ou_noite": False,
    # Question 9: Comer muito antes de ir dormir reduz a qualidade do sono
    "comer_muito_antes_prejudica_sono": True,
    # Question 10: Mandar mensagens durante a noite prejudica o sono
    "mensagens_noite_prejudica_sono": True,
    # Question 11: Dormir pouco aumenta a probabilidade de ficar doente
    "dormir_pouco_aumenta_doencas": True,
    # Question 12: Estudar até tarde é tão eficaz como estudar durante o dia
    "estudar_tarde_igual_eficaz_dia": False,
    # Question 13: Estar num ambiente com muita luz à noite altera o ritmo sono-vigília
    "muita_luz_noite_altera_ritmo": True,
    # Question 14: Fazer um esforço físico antes de ir dormir faz adormecer mais facilmente
    "esforco_fisico_ajuda_adormecer": False,
    # Question 15: Pode-se compensar o sono perdido dormindo mais na noite seguinte
    "compensar_sono_perdido_noite_seguinte": False,
    # Question 16: Quando não se dorme o suficiente, há tendência para engordar
    "sono_insuficiente_engordar": True,
    # Question 17: Dormir uma sesta no final do dia não afeta o sono à noite
    "sesta_nao_afeta_sono_noite": False,
    # Question 18: Para dormir bem, é bom apanhar luz e sol
    "luz_sol_ajuda_dormir_bem": True,
    # Question 19: Dormir pouco aumenta o risco de acidentes
    "dormir_pouco_aumenta_acidentes": True,
    # Question 20: Ao longo de uma noite de sono, existem vários tipos de sono distintos
    "varios_tipos_sono_noite": True,
}


def calculate_score_from_survey(survey_result) -> int:
    """
    Calculate the score for a sleep survey directly from a DB result object.

    Args:
        survey_result: SleepSurvey database model instance

    Returns:
        Score out of 20 (number of correct answers)
    """
    score = 0

    for field_name, correct_answer in SLEEP_SURVEY_ANSWER_KEY.items():
        user_answer = getattr(survey_result, field_name, None)
        if user_answer == correct_answer:
            score += 1

    return score
