import type {
  LoginCredentials,
  LoginResponse,
  RegisterData,
  RegisterResponse,
  User,
} from '../types';
import { apiService } from './api';

export const authService = {
  async login(credentials: LoginCredentials): Promise<LoginResponse> {
    return apiService.post<LoginResponse>('/auth/login', credentials);
  },

  async register(data: RegisterData): Promise<RegisterResponse> {
    return apiService.post<RegisterResponse>('/auth/register', data);
  },

  async getCurrentUser(): Promise<User> {
    return apiService.get<User>('/user');
  },

  async updateUserProfile(userData: Partial<User>): Promise<User> {
    return apiService.put<User>('/user', userData);
  },

  async refreshToken(
    refreshToken: string
  ): Promise<{ token: string; refreshToken?: string }> {
    return apiService.post('/auth/refresh', { refreshToken });
  },

  async logout(): Promise<void> {
    return apiService.post('/auth/logout');
  },
};
