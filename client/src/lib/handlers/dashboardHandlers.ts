import apiClient from '../api/client';
import type { DashboardStats } from '@/types';

/**
 * Get dashboard statistics (admin only)
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/admin/stats/');
  return response.data;
};
