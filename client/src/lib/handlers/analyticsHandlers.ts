import apiClient from '../api/client';
import type { SoloAnalytics, SoloAnalyticsTrends } from '@/types';

/**
 * Get Solo AI analytics overview
 */
export const getSoloAnalytics = async (): Promise<SoloAnalytics> => {
  const response = await apiClient.get<SoloAnalytics>('/solo/analytics/');
  return response.data;
};

/**
 * Get Solo AI usage trends over time
 */
export const getSoloAnalyticsTrends = async (days: number = 30): Promise<SoloAnalyticsTrends> => {
  const response = await apiClient.get<SoloAnalyticsTrends>('/solo/analytics/trends/', {
    params: { days },
  });
  return response.data;
};
