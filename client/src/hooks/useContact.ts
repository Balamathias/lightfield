import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  submitContact,
  getContacts,
  getContact,
  updateContactStatus,
} from '@/lib/handlers/contactHandlers';
import type { ContactFormData, ContactFilters } from '@/types';

// Query keys
export const contactKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactKeys.all, 'list'] as const,
  list: (filters?: ContactFilters) => [...contactKeys.lists(), filters] as const,
  details: () => [...contactKeys.all, 'detail'] as const,
  detail: (id: number) => [...contactKeys.details(), id] as const,
};

/**
 * Hook to submit contact form (public)
 */
export function useSubmitContact() {
  return useMutation({
    mutationFn: (data: ContactFormData) => submitContact(data),
  });
}

/**
 * Hook to fetch all contact submissions (admin only)
 */
export function useContacts(filters?: ContactFilters) {
  return useQuery({
    queryKey: contactKeys.list(filters),
    queryFn: () => getContacts(filters),
  });
}

/**
 * Hook to fetch single contact submission (admin only)
 */
export function useContact(id: number) {
  return useQuery({
    queryKey: contactKeys.detail(id),
    queryFn: () => getContact(id),
    enabled: !!id,
  });
}

/**
 * Hook to update contact submission status (admin only)
 */
export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'read' | 'responded' }) =>
      updateContactStatus(id, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: contactKeys.lists() });
      queryClient.invalidateQueries({ queryKey: contactKeys.detail(variables.id) });
    },
  });
}
