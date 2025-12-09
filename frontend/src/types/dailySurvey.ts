export interface DailySurveyData {
  horaLevantasteHoje: string; // time format HH:MM
  horaDeitasteOntem: string; // time format HH:MM
  tempoAteAdormecer: number; // minutes, >= 0
  vezesAcordasteNoite: number; // count, >= 0
  horasQueDormiste: number; // total minutes of sleep, >= 0
  qualidadeSonoNoite: number; // 0-5 scale
  observacaoNoitePassada?: string; // optional observation
  surveyDate: string; // date format YYYY-MM-DD
}

export interface DailySurveyResponse {
  id: string;
  createdAt: string;
  updatedAt: string;
}

export interface DailySurvey extends DailySurveyData {
  id: number;
  surveyDate: string;
  createdAt?: string;
  updatedAt?: string;
}
