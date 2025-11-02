import apiClient from '../api/client';
import type { ContactSubmission, ContactFormData, ContactFilters } from '@/types';

/**
 * Submit contact form (public)
 */
export const submitContact = async (data: ContactFormData): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/contact/submit/', data);
  return response.data;
};

/**
 * Get all contact submissions with filters (admin only)
 */
export const getContacts = async (filters?: ContactFilters): Promise<ContactSubmission[]> => {
  const params = new URLSearchParams();

  if (filters?.status) params.append('status', filters.status);
  if (filters?.search) params.append('search', filters.search);

  const response = await apiClient.get<ContactSubmission[]>('/contact/list/', { params });
  return response.data;
};

/**
 * Get single contact submission (admin only)
 */
export const getContact = async (id: number): Promise<ContactSubmission> => {
  const response = await apiClient.get<ContactSubmission>(`/contact/${id}/`);
  return response.data;
};

/**
 * Update contact submission status (admin only)
 */
export const updateContactStatus = async (
  id: number,
  status: 'read' | 'responded'
): Promise<{ message: string }> => {
  const response = await apiClient.patch<{ message: string }>(`/contact/${id}/`, { status });
  return response.data;
};
