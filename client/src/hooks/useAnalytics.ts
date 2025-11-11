import { useQuery } from '@tanstack/react-query';
import { getSoloAnalytics, getSoloAnalyticsTrends } from '@/lib/handlers/analyticsHandlers';

// Query keys
export const analyticsKeys = {
  all: ['analytics'] as const,
  solo: () => [...analyticsKeys.all, 'solo'] as const,
  soloOverview: () => [...analyticsKeys.solo(), 'overview'] as const,
  soloTrends: (days: number) => [...analyticsKeys.solo(), 'trends', days] as const,
};

/**
 * Hook to fetch Solo AI analytics overview
 */
export function useSoloAnalytics() {
  return useQuery({
    queryKey: analyticsKeys.soloOverview(),
    queryFn: () => getSoloAnalytics(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch Solo AI trends data
 */
export function useSoloAnalyticsTrends(days: number = 30) {
  return useQuery({
    queryKey: analyticsKeys.soloTrends(days),
    queryFn: () => getSoloAnalyticsTrends(days),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
