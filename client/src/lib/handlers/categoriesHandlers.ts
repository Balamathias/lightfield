import apiClient from '../api/client';
import type { BlogCategory, BlogCategoryFormData } from '@/types';

/**
 * Get all blog categories
 */
export const getCategories = async (): Promise<BlogCategory[]> => {
  const response = await apiClient.get<BlogCategory[]>('/categories/');
  return response.data;
};

/**
 * Get single category by ID
 */
export const getCategory = async (id: number): Promise<BlogCategory> => {
  const response = await apiClient.get<BlogCategory>(`/categories/${id}/`);
  return response.data;
};

/**
 * Create new category (admin only)
 */
export const createCategory = async (data: BlogCategoryFormData): Promise<BlogCategory> => {
  const response = await apiClient.post<BlogCategory>('/categories/', data);
  return response.data;
};

/**
 * Update category (admin only)
 */
export const updateCategory = async (id: number, data: Partial<BlogCategoryFormData>): Promise<BlogCategory> => {
  const response = await apiClient.patch<BlogCategory>(`/categories/${id}/`, data);
  return response.data;
};

/**
 * Delete category (admin only)
 */
export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}/`);
};
