import type { ApiError } from '../types';
import { isTokenExpired, tokenStorage } from '../utils/auth';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

class ApiService {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async refreshTokenIfNeeded(): Promise<void> {
    const token = tokenStorage.getToken();
    const refreshToken = tokenStorage.getRefreshToken();

    if (token && isTokenExpired(token) && refreshToken) {
      try {
        const response = await fetch(`${this.baseURL}/auth/refresh`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ refreshToken }),
        });

        if (response.ok) {
          const data = await response.json();
          tokenStorage.setToken(data.token);
          if (data.refreshToken) {
            tokenStorage.setRefreshToken(data.refreshToken);
          }
        } else {
          tokenStorage.clearTokens();
          window.location.href = '/login';
        }
      } catch (error) {
        tokenStorage.clearTokens();
        window.location.href = '/login';
      }
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    await this.refreshTokenIfNeeded();

    const token = tokenStorage.getToken();
    const url = `${this.baseURL}${endpoint}`;

    console.log('API Request - Token:', token);
    console.log('API Request - URL:', url);

    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    console.log('API Request - Headers:', config.headers);

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const apiError: ApiError = {
        message: errorData.message || 'An error occurred',
        status: response.status,
      };
      throw apiError;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const config: RequestInit = {
      method: 'POST',
    };
    if (data) {
      config.body = JSON.stringify(data);
    }
    return this.request<T>(endpoint, config);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const config: RequestInit = {
      method: 'PUT',
    };
    if (data) {
      config.body = JSON.stringify(data);
    }
    return this.request<T>(endpoint, config);
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiService = new ApiService(API_BASE_URL);
