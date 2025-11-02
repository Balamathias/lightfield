import { useQuery } from '@tanstack/react-query';
import { getDashboardStats } from '@/lib/handlers/dashboardHandlers';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
};

/**
 * Hook to fetch dashboard statistics (admin only)
 */
export function useDashboardStats() {
  return useQuery({
    queryKey: dashboardKeys.stats(),
    queryFn: () => getDashboardStats(),
    refetchInterval: 60000, // Refetch every minute
  });
}
