import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import {
  login as loginHandler,
  logout as logoutHandler,
  saveAuthData,
  clearAuthData,
} from '@/lib/handlers/authHandlers';
import { handleApiError } from '@/lib/api/client';
import type { LoginCredentials } from '@/types';

export function useLogin() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => loginHandler(credentials),
    onSuccess: (data) => {
      // Save auth data to localStorage
      saveAuthData(data);

      // Invalidate all queries to refetch with new auth
      queryClient.invalidateQueries();

      // Redirect to admin dashboard
      router.push('/admin');
    },
    onError: (error) => {
      console.error('Login error:', handleApiError(error));
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (!refreshToken) throw new Error('No refresh token found');
      return logoutHandler(refreshToken);
    },
    onSuccess: () => {
      // Clear auth data
      clearAuthData();

      // Clear all queries
      queryClient.clear();

      // Redirect to login page
      router.push('/admin/login');
    },
    onError: (error) => {
      // Clear auth data even if logout fails
      clearAuthData();
      queryClient.clear();
      router.push('/admin/login');
      console.error('Logout error:', handleApiError(error));
    },
  });
}
