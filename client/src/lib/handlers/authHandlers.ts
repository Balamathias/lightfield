import apiClient from '../api/client';
import type { LoginCredentials, LoginResponse, User } from '@/types';

/**
 * Login user and get JWT tokens
 */
export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/auth/login/', credentials);
  return response.data;
};

/**
 * Logout user and blacklist refresh token
 */
export const logout = async (refreshToken: string): Promise<void> => {
  await apiClient.post('/auth/logout/', { refresh: refreshToken });
};

/**
 * Refresh access token
 */
export const refreshToken = async (refresh: string): Promise<{ access: string }> => {
  const response = await apiClient.post<{ access: string }>('/auth/refresh/', { refresh });
  return response.data;
};

/**
 * Get current user from localStorage
 */
export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

/**
 * Save auth data to localStorage
 */
export const saveAuthData = (data: LoginResponse): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  localStorage.setItem('user', JSON.stringify(data.user));
};

/**
 * Clear auth data from localStorage
 */
export const clearAuthData = (): void => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};
