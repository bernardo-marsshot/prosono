import { apiService } from './api';
import type { SurveyAnswers } from './surveyService';

// Frontend data structures (what we collect from the forms)
export interface AttitudeSurveyFormData {
  durmo_mal_ou_bem: number;
  gosto_de_dormir: number;
  acho_sono_importante: number;
  o_que_sei_sobre_sono: number;
}

export interface FrequencySurveyFormData {
  adormeço_aulas_manha: number;
  aguento_dia_escola_sem_cansaco: number;
  adormeço_ultima_aula: number;
  sonolento_carro_5min: number;
  bem_acordado_todo_dia: number;
  adormeço_aulas_tarde: number;
  desperto_durante_aulas: number;
  sonolento_fim_dia_aulas: number;
  sonolento_autocarro_atividade: number;
  manha_escola_adormeço: number;
  bem_desperto_aulas: number;
  sonolento_trabalhos_casa_noite: number;
  desperto_ultima_aula: number;
  adormeço_transportes: number;
  momentos_adormeço_escola: number;
  adormeço_trabalhos_casa_noite: number;
}

export interface MultiStepSurveyData {
  attitudeSurvey: AttitudeSurveyFormData;
  frequencySurvey: FrequencySurveyFormData;
  knowledgeSurvey: SurveyAnswers;
  surveyDate: string;
}

export interface MultiStepSurveyResponse {
  attitudeId: number;
  frequencyId: number;
  knowledgeId: number;
  message: string;
}

class MultiStepSurveyService {
  // Map frontend field names to backend field names for Cleveland survey
  private mapFrequencyDataToApi(
    data: FrequencySurveyFormData,
    surveyDate: string
  ) {
    return {
      adormecoduranteAulasManha: data.adormeço_aulas_manha,
      consigoAguentarDiaInteiroEscolaSemCansaco:
        data.aguento_dia_escola_sem_cansaco,
      adormecoUltimaAulaDia: data.adormeço_ultima_aula,
      ficoSonolentoCarroMais5Minutos: data.sonolento_carro_5min,
      ficoBemAcordadoDuranteTodoDia: data.bem_acordado_todo_dia,
      adormecoEscolaAulasTarde: data.adormeço_aulas_tarde,
      sintoMeDespertoDuranteAulas: data.desperto_durante_aulas,
      sintoMeSonolentoFimDiaDepoisAulas: data.sonolento_fim_dia_aulas,
      sintoMeSonolentoAutocarroAtividadeEscola:
        data.sonolento_autocarro_atividade,
      deManhaQuandoEstouEscolaAdormeco: data.manha_escola_adormeço,
      quandoEstouAulasSintoMeBemDesperto: data.bem_desperto_aulas,
      sintoMeSonolentoTrabalhosCasaNoiteEscola:
        data.sonolento_trabalhos_casa_noite,
      estouBemDespertoUltimaAulaDia: data.desperto_ultima_aula,
      adormecoQuandoAndoCarroAutocarroComboio: data.adormeço_transportes,
      duranteDiaEscolaMomentosAcabeiAdormecer: data.momentos_adormeço_escola,
      adormecoQuandoFacoTrabalhosEscolaNoiteCasa:
        data.adormeço_trabalhos_casa_noite,
      surveyDate,
    };
  }

  // Map frontend field names to backend field names for MySleep survey
  private mapAttitudeDataToApi(
    data: AttitudeSurveyFormData,
    surveyDate: string
  ) {
    return {
      durmoMalOuBem: data.durmo_mal_ou_bem,
      gostoDeDormir: data.gosto_de_dormir,
      achoSonoImportanteParaMim: data.acho_sono_importante,
      oQueSeiSobreSono: data.o_que_sei_sobre_sono,
      surveyDate,
    };
  }

  async submitAllSurveys(
    data: MultiStepSurveyData
  ): Promise<MultiStepSurveyResponse> {
    // Map data to API format
    const attitudeApiData = this.mapAttitudeDataToApi(
      data.attitudeSurvey,
      data.surveyDate
    );
    const frequencyApiData = this.mapFrequencyDataToApi(
      data.frequencySurvey,
      data.surveyDate
    );
    const knowledgeApiData = {
      ...data.knowledgeSurvey,
      surveyDate: data.surveyDate,
    };

    // Submit surveys individually to allow partial success
    const results = {
      attitudeId: null as number | null,
      frequencyId: null as number | null,
      knowledgeId: null as number | null,
      errors: [] as string[],
    };

    // Submit attitude survey
    try {
      const attitudeResponse = await apiService.post<{ id: number }>(
        '/my-sleep-surveys',
        attitudeApiData
      );
      results.attitudeId = attitudeResponse.id;
    } catch (error) {
      console.error('Error submitting attitude survey:', error);
      results.errors.push('Failed to submit attitude survey');
    }

    // Submit frequency survey
    try {
      const frequencyResponse = await apiService.post<{ id: number }>(
        '/cleveland-surveys',
        frequencyApiData
      );
      results.frequencyId = frequencyResponse.id;
    } catch (error) {
      console.error('Error submitting frequency survey:', error);
      results.errors.push('Failed to submit frequency survey');
    }

    // Submit knowledge survey
    try {
      const knowledgeResponse = await apiService.post<{ id: number }>(
        '/surveys',
        knowledgeApiData
      );
      results.knowledgeId = knowledgeResponse.id;
    } catch (error) {
      console.error('Error submitting knowledge survey:', error);
      results.errors.push('Failed to submit knowledge survey');
    }

    // Check if at least one survey was successful
    const successCount = [
      results.attitudeId,
      results.frequencyId,
      results.knowledgeId,
    ].filter((id) => id !== null).length;

    if (successCount === 0) {
      throw new Error(
        'Failed to submit all surveys: ' + results.errors.join(', ')
      );
    }

    return {
      attitudeId: results.attitudeId || -1,
      frequencyId: results.frequencyId || -1,
      knowledgeId: results.knowledgeId || -1,
      message:
        successCount === 3
          ? 'All surveys submitted successfully'
          : `${successCount} of 3 surveys submitted successfully. Errors: ${results.errors.join(', ')}`,
    };
  }
}

export const multiStepSurveyService = new MultiStepSurveyService();
