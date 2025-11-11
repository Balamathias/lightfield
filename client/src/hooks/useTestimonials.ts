import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getTestimonials,
  getTestimonial,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  reorderTestimonials,
} from '@/lib/handlers/testimonialsHandlers';
import type { TestimonialFormData, TestimonialFilters, ReorderRequest } from '@/types';

// Query keys
export const testimonialsKeys = {
  all: ['testimonials'] as const,
  lists: () => [...testimonialsKeys.all, 'list'] as const,
  list: (filters?: TestimonialFilters) => [...testimonialsKeys.lists(), filters] as const,
  details: () => [...testimonialsKeys.all, 'detail'] as const,
  detail: (id: number) => [...testimonialsKeys.details(), id] as const,
};

/**
 * Hook to fetch all testimonials with optional filters
 */
export function useTestimonials(filters?: TestimonialFilters) {
  return useQuery({
    queryKey: testimonialsKeys.list(filters),
    queryFn: () => getTestimonials(filters),
  });
}

/**
 * Hook to fetch single testimonial by ID
 */
export function useTestimonial(id: number) {
  return useQuery({
    queryKey: testimonialsKeys.detail(id),
    queryFn: () => getTestimonial(id),
    enabled: !!id,
  });
}

/**
 * Hook to create new testimonial
 */
export function useCreateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: TestimonialFormData) => createTestimonial(data),
    onSuccess: () => {
      // Invalidate and refetch testimonials list
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.lists() });
    },
  });
}

/**
 * Hook to update testimonial
 */
export function useUpdateTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<TestimonialFormData> }) =>
      updateTestimonial(id, data),
    onSuccess: (data) => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.detail(data.id) });
    },
  });
}

/**
 * Hook to delete testimonial
 */
export function useDeleteTestimonial() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteTestimonial(id),
    onSuccess: () => {
      // Invalidate testimonials list
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.lists() });
    },
  });
}

/**
 * Hook to reorder testimonials
 */
export function useReorderTestimonials() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ReorderRequest) => reorderTestimonials(items),
    onSuccess: () => {
      // Invalidate testimonials list to show new order
      queryClient.invalidateQueries({ queryKey: testimonialsKeys.lists() });
    },
  });
}
