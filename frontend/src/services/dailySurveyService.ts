import type {
  DailySurvey,
  DailySurveyData,
  DailySurveyResponse,
} from '../types/dailySurvey';
import { apiService } from './api';

class DailySurveyService {
  async getDailySurveys(): Promise<DailySurvey | null> {
    try {
      return await apiService.get<DailySurvey>('/daily-surveys');
    } catch (error: any) {
      // If no survey exists, API might return 404 or empty response
      if (error.status === 404) {
        return null;
      }
      throw error;
    }
  }

  async submitDailySurvey(data: DailySurveyData): Promise<DailySurveyResponse> {
    return apiService.post<DailySurveyResponse>('/daily-surveys', data);
  }
}

export const dailySurveyService = new DailySurveyService();
export type { DailySurveyData, DailySurvey };
