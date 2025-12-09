import { apiService } from './api';

export interface SleepinessFrequencySurveyData {
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
  surveyDate: string;
}

export interface SleepinessFrequencySurveyResponse {
  id: number;
  message?: string;
}

class SleepinessFrequencySurveyService {
  async submitSleepinessFrequencySurvey(
    data: SleepinessFrequencySurveyData
  ): Promise<SleepinessFrequencySurveyResponse> {
    return apiService.post<SleepinessFrequencySurveyResponse>(
      '/cleveland-surveys',
      data
    );
  }
}

export const sleepinessFrequencySurveyService =
  new SleepinessFrequencySurveyService();
