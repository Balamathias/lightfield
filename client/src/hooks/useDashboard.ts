import { useQuery } from '@tanstack/react-query';
import {
  getDashboardStats,
  getBlogViewsOverTime,
  getPostsOverTime,
  getPostsByCategory,
  getContactsByStatus,
} from '@/lib/handlers/dashboardHandlers';

// Query keys
export const dashboardKeys = {
  all: ['dashboard'] as const,
  stats: () => [...dashboardKeys.all, 'stats'] as const,
  blogViews: (days: number) => [...dashboardKeys.all, 'blog-views', days] as const,
  postsTimeline: (days: number) => [...dashboardKeys.all, 'posts-timeline', days] as const,
  postsByCategory: () => [...dashboardKeys.all, 'posts-by-category'] as const,
  contactsByStatus: () => [...dashboardKeys.all, 'contacts-by-status'] as const,
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

/**
 * Hook to fetch blog views over time chart data
 */
export function useBlogViewsChart(days: number = 30) {
  return useQuery({
    queryKey: dashboardKeys.blogViews(days),
    queryFn: () => getBlogViewsOverTime(days),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

/**
 * Hook to fetch posts over time chart data
 */
export function usePostsTimelineChart(days: number = 30) {
  return useQuery({
    queryKey: dashboardKeys.postsTimeline(days),
    queryFn: () => getPostsOverTime(days),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

/**
 * Hook to fetch posts by category chart data
 */
export function usePostsByCategoryChart() {
  return useQuery({
    queryKey: dashboardKeys.postsByCategory(),
    queryFn: () => getPostsByCategory(),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}

/**
 * Hook to fetch contacts by status chart data
 */
export function useContactsByStatusChart() {
  return useQuery({
    queryKey: dashboardKeys.contactsByStatus(),
    queryFn: () => getContactsByStatus(),
    refetchInterval: 300000, // Refetch every 5 minutes
  });
}
