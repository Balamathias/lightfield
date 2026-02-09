import apiClient from '../api/client';
import type {
  ConsultationService,
  ConsultationServiceListItem,
  ConsultationServicePublic,
  ConsultationServiceFormData,
  BookingFormData,
  BookingCreateResponse,
  BookingStatusResponse,
  BookingAdminListItem,
  BookingAdminDetail,
  BookingFilters,
  ConsultationStats,
  ReorderRequest,
} from '@/types';

// ==================== Services ====================

export const getConsultationServices = async (params?: Record<string, string>): Promise<ConsultationServiceListItem[]> => {
  const response = await apiClient.get<ConsultationServiceListItem[]>('/consultations/services/', { params });
  return response.data;
};

export const getFeaturedConsultationServices = async (): Promise<ConsultationServicePublic[]> => {
  const response = await apiClient.get<ConsultationServicePublic[]>('/consultations/services/featured/');
  return response.data;
};

export const getConsultationService = async (slug: string): Promise<ConsultationService> => {
  const response = await apiClient.get<ConsultationService>(`/consultations/services/${slug}/`);
  return response.data;
};

export const createConsultationService = async (data: ConsultationServiceFormData): Promise<ConsultationService> => {
  const response = await apiClient.post<ConsultationService>('/consultations/services/', data);
  return response.data;
};

export const updateConsultationService = async (slug: string, data: Partial<ConsultationServiceFormData>): Promise<ConsultationService> => {
  const response = await apiClient.patch<ConsultationService>(`/consultations/services/${slug}/`, data);
  return response.data;
};

export const deleteConsultationService = async (slug: string): Promise<void> => {
  await apiClient.delete(`/consultations/services/${slug}/`);
};

export const reorderConsultationServices = async (items: ReorderRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/consultations/services/reorder/', items);
  return response.data;
};

// ==================== Bookings (public) ====================

export const createBooking = async (data: BookingFormData): Promise<BookingCreateResponse> => {
  const response = await apiClient.post<BookingCreateResponse>('/consultations/book/', data);
  return response.data;
};

export const verifyPayment = async (reference: string): Promise<BookingStatusResponse> => {
  const response = await apiClient.post<BookingStatusResponse>('/consultations/verify-payment/', { reference });
  return response.data;
};

export const getBookingStatus = async (reference: string): Promise<BookingStatusResponse> => {
  const response = await apiClient.get<BookingStatusResponse>(`/consultations/booking/${reference}/`);
  return response.data;
};

// ==================== Bookings (admin) ====================

export const getAdminBookings = async (filters?: BookingFilters): Promise<BookingAdminListItem[]> => {
  const params = new URLSearchParams();
  if (filters?.search) params.append('search', filters.search);
  if (filters?.status) params.append('status', filters.status);
  if (filters?.date_from) params.append('date_from', filters.date_from);
  if (filters?.date_to) params.append('date_to', filters.date_to);
  if (filters?.service_id) params.append('service_id', String(filters.service_id));

  const response = await apiClient.get<BookingAdminListItem[]>('/consultations/bookings/', { params });
  return response.data;
};

export const getAdminBookingDetail = async (id: number): Promise<BookingAdminDetail> => {
  const response = await apiClient.get<BookingAdminDetail>(`/consultations/bookings/${id}/`);
  return response.data;
};

export const updateBookingAdmin = async (
  id: number,
  data: { status?: string; admin_notes?: string; assigned_associate?: number | null }
): Promise<BookingAdminDetail> => {
  const response = await apiClient.patch<BookingAdminDetail>(`/consultations/bookings/${id}/`, data);
  return response.data;
};

// ==================== Stats ====================

export const getConsultationStats = async (): Promise<ConsultationStats> => {
  const response = await apiClient.get<ConsultationStats>('/consultations/stats/');
  return response.data;
};
