import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getGrants,
  getGrant,
  getFeaturedGrants,
  getOpenGrants,
  createGrant,
  updateGrant,
  deleteGrant,
  reorderGrants,
} from '@/lib/handlers/grantsHandlers';
import type { GrantFormData, GrantFilters, ReorderRequest } from '@/types';

// Query keys
export const grantsKeys = {
  all: ['grants'] as const,
  lists: () => [...grantsKeys.all, 'list'] as const,
  list: (filters?: GrantFilters) => [...grantsKeys.lists(), filters] as const,
  featured: () => [...grantsKeys.all, 'featured'] as const,
  open: () => [...grantsKeys.all, 'open'] as const,
  details: () => [...grantsKeys.all, 'detail'] as const,
  detail: (slug: string) => [...grantsKeys.details(), slug] as const,
};

/**
 * Hook to fetch all grants with optional filters
 */
export function useGrants(filters?: GrantFilters) {
  return useQuery({
    queryKey: grantsKeys.list(filters),
    queryFn: () => getGrants(filters),
  });
}

/**
 * Hook to fetch featured grants for homepage
 */
export function useFeaturedGrants() {
  return useQuery({
    queryKey: grantsKeys.featured(),
    queryFn: getFeaturedGrants,
  });
}

/**
 * Hook to fetch currently open grants
 */
export function useOpenGrants() {
  return useQuery({
    queryKey: grantsKeys.open(),
    queryFn: getOpenGrants,
  });
}

/**
 * Hook to fetch single grant by slug
 */
export function useGrant(slug: string) {
  return useQuery({
    queryKey: grantsKeys.detail(slug),
    queryFn: () => getGrant(slug),
    enabled: !!slug,
  });
}

/**
 * Hook to create new grant
 */
export function useCreateGrant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GrantFormData) => createGrant(data),
    onSuccess: () => {
      // Invalidate and refetch grants list
      queryClient.invalidateQueries({ queryKey: grantsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: grantsKeys.featured() });
      queryClient.invalidateQueries({ queryKey: grantsKeys.open() });
    },
  });
}

/**
 * Hook to update grant
 */
export function useUpdateGrant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<GrantFormData> }) =>
      updateGrant(slug, data),
    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: grantsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: grantsKeys.detail(data.slug) });
      queryClient.invalidateQueries({ queryKey: grantsKeys.featured() });
      queryClient.invalidateQueries({ queryKey: grantsKeys.open() });
    },
  });
}

/**
 * Hook to delete grant
 */
export function useDeleteGrant() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteGrant(slug),
    onSuccess: () => {
      // Invalidate grants list
      queryClient.invalidateQueries({ queryKey: grantsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: grantsKeys.featured() });
      queryClient.invalidateQueries({ queryKey: grantsKeys.open() });
    },
  });
}

/**
 * Hook to reorder grants
 */
export function useReorderGrants() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ReorderRequest) => reorderGrants(items),
    onSuccess: () => {
      // Invalidate grants list to show new order
      queryClient.invalidateQueries({ queryKey: grantsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: grantsKeys.featured() });
    },
  });
}
