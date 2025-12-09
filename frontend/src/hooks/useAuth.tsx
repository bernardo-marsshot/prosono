import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useState,
} from 'react';
import { authService } from '../services/authService';
import type {
  AuthContextType,
  LoginCredentials,
  RegisterData,
  User,
} from '../types';
import { tokenStorage } from '../utils/auth';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAuthenticated = !!user || !!tokenStorage.getToken();

  useEffect(() => {
    const initializeAuth = async () => {
      const token = tokenStorage.getToken();

      if (token) {
        try {
          const userData = await authService.getCurrentUser();
          setUser(userData);
        } catch (error) {
          tokenStorage.clearTokens();
        }
      }

      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials): Promise<void> => {
    setIsLoading(true);
    try {
      const response = await authService.login(credentials);
      tokenStorage.setToken(response.accessToken);

      // Fetch user data after successful login
      try {
        const userData = await authService.getCurrentUser();
        setUser(userData);
      } catch (userError) {
        // If we can't get user data, still consider login successful
        // but create a minimal user object from token or set a placeholder
        console.warn('Could not fetch user data after login:', userError);

        // Set a minimal user object so UI doesn't break
        setUser({
          id: 'unknown',
          email: credentials.email,
          firstName: '',
          lastName: '',
          status: 'pre_evaluation',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        });
      }
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData): Promise<void> => {
    setIsLoading(true);
    try {
      // Register the user
      await authService.register(data)
      // Registration successful - no auto-login, let user manually login
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await authService.logout();
    } catch (error) {
      // Continue with logout even if API call fails
    } finally {
      tokenStorage.clearTokens();
      setUser(null);
    }
  };

  const refreshToken = async (): Promise<void> => {
    const refreshTokenValue = tokenStorage.getRefreshToken();
    if (!refreshTokenValue) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authService.refreshToken(refreshTokenValue);
      tokenStorage.setToken(response.token);
      if (response.refreshToken) {
        tokenStorage.setRefreshToken(response.refreshToken);
      }
    } catch (error) {
      tokenStorage.clearTokens();
      setUser(null);
      throw error;
    }
  };

  const updateUserProfile = async (userData: Partial<User>): Promise<void> => {
    try {
      const updatedUser = await authService.updateUserProfile(userData);
      setUser(updatedUser);
    } catch (error) {
      throw error;
    }
  };

  const refreshUser = async (): Promise<void> => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
    } catch (error) {
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated,
    isLoading,
    login,
    register,
    logout,
    refreshToken,
    updateUserProfile,
    refreshUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
