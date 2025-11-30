import apiClient from '../api/client';
import type {
  Grant,
  GrantListItem,
  GrantPublicItem,
  GrantFormData,
  GrantFilters,
  ReorderRequest
} from '@/types';

/**
 * Get all grants with optional filters (admin gets full list, public gets active only)
 */
export const getGrants = async (filters?: GrantFilters): Promise<GrantListItem[]> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.is_featured) params.append('is_featured', 'true');

  const response = await apiClient.get<GrantListItem[]>('/grants/', { params });
  return response.data;
};

/**
 * Get featured grants for homepage (public)
 */
export const getFeaturedGrants = async (): Promise<GrantPublicItem[]> => {
  const response = await apiClient.get<GrantPublicItem[]>('/grants/featured/');
  return response.data;
};

/**
 * Get currently open grants (public)
 */
export const getOpenGrants = async (): Promise<GrantPublicItem[]> => {
  const response = await apiClient.get<GrantPublicItem[]>('/grants/open/');
  return response.data;
};

/**
 * Get single grant by slug
 */
export const getGrant = async (slug: string): Promise<Grant> => {
  const response = await apiClient.get<Grant>(`/grants/${slug}/`);
  return response.data;
};

/**
 * Create new grant (admin only)
 */
export const createGrant = async (data: GrantFormData): Promise<Grant> => {
  const response = await apiClient.post<Grant>('/grants/', data);
  return response.data;
};

/**
 * Update grant (admin only)
 */
export const updateGrant = async (slug: string, data: Partial<GrantFormData>): Promise<Grant> => {
  const response = await apiClient.patch<Grant>(`/grants/${slug}/`, data);
  return response.data;
};

/**
 * Delete grant (admin only)
 */
export const deleteGrant = async (slug: string): Promise<void> => {
  await apiClient.delete(`/grants/${slug}/`);
};

/**
 * Reorder grants (admin only)
 */
export const reorderGrants = async (items: ReorderRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/grants/reorder/', items);
  return response.data;
};
