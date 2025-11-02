import axios, { AxiosError, AxiosRequestConfig, AxiosResponse } from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';
const API_URL = process.env.NEXT_PUBLIC_API_URL || `${API_BASE_URL}/api/v1`;

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

apiClient.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('refresh_token');

        if (refreshToken) {
          try {
            const response = await axios.post(`${API_URL}/auth/refresh/`, {
              refresh: refreshToken,
            });

            const { access } = response.data;

            localStorage.setItem('access_token', access);

            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${access}`;
            }

            return apiClient(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');

            if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
              window.location.href = '/admin/login';
            }

            return Promise.reject(refreshError);
          }
        } else {
          if (typeof window !== 'undefined' && window.location.pathname.startsWith('/admin')) {
            window.location.href = '/admin/login';
          }
        }
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;

export const handleApiError = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    if (error.response) {
      // Server responded with error status
      const data = error.response.data as any;

      if (typeof data === 'string') {
        return data;
      }

      if (data.error) {
        return data.error;
      }

      if (data.detail) {
        return data.detail;
      }

      if (data.message) {
        return data.message;
      }

      if (typeof data === 'object') {
        const firstKey = Object.keys(data)[0];
        if (firstKey && Array.isArray(data[firstKey])) {
          return data[firstKey][0];
        }
      }

      return 'An error occurred while processing your request';
    } else if (error.request) {
      return 'No response from server. Please check your connection.';
    } else {
      return error.message || 'An unexpected error occurred';
    }
  }

  return 'An unexpected error occurred';
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('access_token');
  return !!token;
};

export const getCurrentUser = () => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const isAdmin = (): boolean => {
  const user = getCurrentUser();
  return user && (user.is_staff || user.is_superuser);
};
