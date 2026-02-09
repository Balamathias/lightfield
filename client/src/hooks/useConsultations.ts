import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getConsultationServices,
  getFeaturedConsultationServices,
  getConsultationService,
  createConsultationService,
  updateConsultationService,
  deleteConsultationService,
  reorderConsultationServices,
  createBooking,
  verifyPayment,
  getBookingStatus,
  getAdminBookings,
  getAdminBookingDetail,
  updateBookingAdmin,
  getConsultationStats,
} from '@/lib/handlers/consultationHandlers';
import type {
  ConsultationServiceFormData,
  BookingFormData,
  BookingFilters,
  ReorderRequest,
} from '@/types';

// Query keys
export const consultationKeys = {
  all: ['consultations'] as const,
  services: () => [...consultationKeys.all, 'services'] as const,
  servicesList: (params?: Record<string, string>) => [...consultationKeys.services(), 'list', params] as const,
  servicesFeatured: () => [...consultationKeys.services(), 'featured'] as const,
  serviceDetail: (slug: string) => [...consultationKeys.services(), 'detail', slug] as const,
  bookings: () => [...consultationKeys.all, 'bookings'] as const,
  bookingsList: (filters?: BookingFilters) => [...consultationKeys.bookings(), 'list', filters] as const,
  bookingDetail: (id: number) => [...consultationKeys.bookings(), 'detail', id] as const,
  bookingStatus: (ref: string) => [...consultationKeys.bookings(), 'status', ref] as const,
  stats: () => [...consultationKeys.all, 'stats'] as const,
};

// ==================== Service Hooks ====================

export function useConsultationServices(params?: Record<string, string>) {
  return useQuery({
    queryKey: consultationKeys.servicesList(params),
    queryFn: () => getConsultationServices(params),
  });
}

export function useFeaturedConsultationServices() {
  return useQuery({
    queryKey: consultationKeys.servicesFeatured(),
    queryFn: getFeaturedConsultationServices,
  });
}

export function useConsultationService(slug: string) {
  return useQuery({
    queryKey: consultationKeys.serviceDetail(slug),
    queryFn: () => getConsultationService(slug),
    enabled: !!slug,
  });
}

export function useCreateConsultationService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: ConsultationServiceFormData) => createConsultationService(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.services() });
    },
  });
}

export function useUpdateConsultationService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<ConsultationServiceFormData> }) =>
      updateConsultationService(slug, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.services() });
      queryClient.invalidateQueries({ queryKey: consultationKeys.serviceDetail(data.slug) });
    },
  });
}

export function useDeleteConsultationService() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (slug: string) => deleteConsultationService(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.services() });
    },
  });
}

export function useReorderConsultationServices() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (items: ReorderRequest) => reorderConsultationServices(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.services() });
    },
  });
}

// ==================== Booking Hooks ====================

export function useCreateBooking() {
  return useMutation({
    mutationFn: (data: BookingFormData) => createBooking(data),
  });
}

export function useVerifyPayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (reference: string) => verifyPayment(reference),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.bookings() });
    },
  });
}

export function useBookingStatus(reference: string, enabled = true) {
  return useQuery({
    queryKey: consultationKeys.bookingStatus(reference),
    queryFn: () => getBookingStatus(reference),
    enabled: !!reference && enabled,
    refetchInterval: (query) => {
      const data = query.state.data;
      // Poll every 3s while pending_payment
      if (data && data.status === 'pending_payment') return 3000;
      return false;
    },
  });
}

// ==================== Admin Booking Hooks ====================

export function useAdminBookings(filters?: BookingFilters) {
  return useQuery({
    queryKey: consultationKeys.bookingsList(filters),
    queryFn: () => getAdminBookings(filters),
  });
}

export function useAdminBookingDetail(id: number) {
  return useQuery({
    queryKey: consultationKeys.bookingDetail(id),
    queryFn: () => getAdminBookingDetail(id),
    enabled: !!id,
  });
}

export function useUpdateBookingAdmin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: { status?: string; admin_notes?: string; assigned_associate?: number | null } }) =>
      updateBookingAdmin(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: consultationKeys.bookings() });
      queryClient.invalidateQueries({ queryKey: consultationKeys.stats() });
    },
  });
}

// ==================== Stats Hooks ====================

export function useConsultationStats() {
  return useQuery({
    queryKey: consultationKeys.stats(),
    queryFn: getConsultationStats,
  });
}
