import apiClient from '../api/client';
import type {
  Testimonial,
  TestimonialListItem,
  TestimonialFormData,
  TestimonialFilters,
  ReorderRequest
} from '@/types';

/**
 * Get all testimonials with optional filters
 */
export const getTestimonials = async (filters?: TestimonialFilters): Promise<TestimonialListItem[]> => {
  const params = new URLSearchParams();

  if (filters?.is_featured !== undefined) params.append('is_featured', filters.is_featured.toString());
  if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());

  const response = await apiClient.get<TestimonialListItem[]>('/testimonials/', { params });
  return response.data;
};

/**
 * Get single testimonial by ID
 */
export const getTestimonial = async (id: number): Promise<Testimonial> => {
  const response = await apiClient.get<Testimonial>(`/testimonials/${id}/`);
  return response.data;
};

/**
 * Create new testimonial (admin only)
 */
export const createTestimonial = async (data: TestimonialFormData): Promise<Testimonial> => {
  const response = await apiClient.post<Testimonial>('/testimonials/', data);
  return response.data;
};

/**
 * Update testimonial (admin only)
 */
export const updateTestimonial = async (id: number, data: Partial<TestimonialFormData>): Promise<Testimonial> => {
  const response = await apiClient.patch<Testimonial>(`/testimonials/${id}/`, data);
  return response.data;
};

/**
 * Delete testimonial (admin only)
 */
export const deleteTestimonial = async (id: number): Promise<void> => {
  await apiClient.delete(`/testimonials/${id}/`);
};

/**
 * Reorder testimonials (admin only)
 */
export const reorderTestimonials = async (items: ReorderRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/testimonials/reorder/', items);
  return response.data;
};
