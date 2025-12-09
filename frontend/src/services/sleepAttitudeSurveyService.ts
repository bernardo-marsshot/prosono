import { apiService } from './api';

export interface SleepAttitudeSurveyData {
  durmo_mal_ou_bem: number;
  gosto_de_dormir: number;
  acho_sono_importante: number;
  o_que_sei_sobre_sono: number;
  surveyDate: string;
}

export interface SleepAttitudeSurveyResponse {
  id: number;
  message?: string;
}

class SleepAttitudeSurveyService {
  async submitSleepAttitudeSurvey(
    data: SleepAttitudeSurveyData
  ): Promise<SleepAttitudeSurveyResponse> {
    return apiService.post<SleepAttitudeSurveyResponse>(
      '/my-sleep-surveys',
      data
    );
  }
}

export const sleepAttitudeSurveyService = new SleepAttitudeSurveyService();
