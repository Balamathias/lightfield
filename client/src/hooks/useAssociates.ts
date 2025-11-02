import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getAssociates,
  getAssociate,
  createAssociate,
  updateAssociate,
  deleteAssociate,
  reorderAssociates,
} from '@/lib/handlers/associatesHandlers';
import type { AssociateFormData, AssociateFilters, ReorderRequest } from '@/types';

// Query keys
export const associatesKeys = {
  all: ['associates'] as const,
  lists: () => [...associatesKeys.all, 'list'] as const,
  list: (filters?: AssociateFilters) => [...associatesKeys.lists(), filters] as const,
  details: () => [...associatesKeys.all, 'detail'] as const,
  detail: (slug: string) => [...associatesKeys.details(), slug] as const,
};

/**
 * Hook to fetch all associates with optional filters
 */
export function useAssociates(filters?: AssociateFilters) {
  return useQuery({
    queryKey: associatesKeys.list(filters),
    queryFn: () => getAssociates(filters),
  });
}

/**
 * Hook to fetch single associate by slug
 */
export function useAssociate(slug: string) {
  return useQuery({
    queryKey: associatesKeys.detail(slug),
    queryFn: () => getAssociate(slug),
    enabled: !!slug,
  });
}

/**
 * Hook to create new associate
 */
export function useCreateAssociate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: AssociateFormData) => createAssociate(data),
    onSuccess: () => {
      // Invalidate and refetch associates list
      queryClient.invalidateQueries({ queryKey: associatesKeys.lists() });
    },
  });
}

/**
 * Hook to update associate
 */
export function useUpdateAssociate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<AssociateFormData> }) =>
      updateAssociate(slug, data),
    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: associatesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: associatesKeys.detail(data.slug) });
    },
  });
}

/**
 * Hook to delete associate
 */
export function useDeleteAssociate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteAssociate(slug),
    onSuccess: () => {
      // Invalidate associates list
      queryClient.invalidateQueries({ queryKey: associatesKeys.lists() });
    },
  });
}

/**
 * Hook to reorder associates
 */
export function useReorderAssociates() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ReorderRequest) => reorderAssociates(items),
    onSuccess: () => {
      // Invalidate associates list to show new order
      queryClient.invalidateQueries({ queryKey: associatesKeys.lists() });
    },
  });
}
