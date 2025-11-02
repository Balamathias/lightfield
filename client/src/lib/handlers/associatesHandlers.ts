import apiClient from '../api/client';
import type {
  Associate,
  AssociateListItem,
  AssociateFormData,
  AssociateFilters,
  ReorderRequest
} from '@/types';

/**
 * Get all associates with optional filters
 */
export const getAssociates = async (filters?: AssociateFilters): Promise<AssociateListItem[]> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());

  const response = await apiClient.get<AssociateListItem[]>('/associates/', { params });
  return response.data;
};

/**
 * Get single associate by slug
 */
export const getAssociate = async (slug: string): Promise<Associate> => {
  const response = await apiClient.get<Associate>(`/associates/${slug}/`);
  return response.data;
};

/**
 * Create new associate (admin only)
 */
export const createAssociate = async (data: AssociateFormData): Promise<Associate> => {
  const response = await apiClient.post<Associate>('/associates/', data);
  return response.data;
};

/**
 * Update associate (admin only)
 */
export const updateAssociate = async (slug: string, data: Partial<AssociateFormData>): Promise<Associate> => {
  const response = await apiClient.patch<Associate>(`/associates/${slug}/`, data);
  return response.data;
};

/**
 * Delete associate (admin only)
 */
export const deleteAssociate = async (slug: string): Promise<void> => {
  await apiClient.delete(`/associates/${slug}/`);
};

/**
 * Reorder associates (admin only)
 */
export const reorderAssociates = async (items: ReorderRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/associates/reorder/', items);
  return response.data;
};
