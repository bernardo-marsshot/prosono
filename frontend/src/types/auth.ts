export type UserStatus =
  | 'pre_evaluation'
  | 'sleep_tracking'
  | 'post_evaluation';

export interface MeanMetrics {
  last7Days: number | null;
  last15Days: number | null;
  last30Days: number | null;
}

export interface DailySurveys {
  target: number;
  dates: string[];
  streak: number;
  meanSleepDuration: MeanMetrics; // in minutes
  meanWakeTime: MeanMetrics; // in minutes from midnight
  meanBedtime: MeanMetrics; // in minutes from midnight
  meanTimeToSleep: MeanMetrics; // in minutes
  meanNightAwakenings: MeanMetrics; // count
  meanSleepQuality: MeanMetrics; // 0-5 scale
}

export interface EvaluationSurvey {
  date: string;
  score: number;
  mySleepMeans: {
    durmoMalOuBem: number;
    gostoDeDormir: number; 
    achoSonoImportanteParaMim: number;
    oQueSeiSobreSono: number;
  } | null;
  clevelandMean: number | null;
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  birthDate?: string;
  gender?: string;
  school?: string;
  schoolYear?: number;
  status: UserStatus;
  evaluationSurveys?: EvaluationSurvey[];
  dailySurveys?: DailySurveys;
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  gender?: string;
  school?: string;
  schoolYear?: number;
}

export interface AuthResponse {
  user: User;
  token: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export type RegisterResponse = Record<string, never>;

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUserProfile: (userData: Partial<User>) => Promise<void>;
  refreshUser: () => Promise<void>;
}
