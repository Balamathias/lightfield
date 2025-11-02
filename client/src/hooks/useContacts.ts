import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getContacts,
  getContact,
  updateContactStatus,
} from '@/lib/handlers/contactHandlers';
import type { ContactFilters } from '@/types';

// Query keys
export const contactsKeys = {
  all: ['contacts'] as const,
  lists: () => [...contactsKeys.all, 'list'] as const,
  list: (filters?: ContactFilters) => [...contactsKeys.lists(), filters] as const,
  details: () => [...contactsKeys.all, 'detail'] as const,
  detail: (id: number) => [...contactsKeys.details(), id] as const,
};

/**
 * Hook to fetch all contact submissions with optional filters
 */
export function useContacts(filters?: ContactFilters) {
  return useQuery({
    queryKey: contactsKeys.list(filters),
    queryFn: () => getContacts(filters),
  });
}

/**
 * Hook to fetch single contact submission by ID
 */
export function useContact(id: number) {
  return useQuery({
    queryKey: contactsKeys.detail(id),
    queryFn: () => getContact(id),
    enabled: !!id,
  });
}

/**
 * Hook to update contact submission status
 */
export function useUpdateContactStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: 'read' | 'responded' }) =>
      updateContactStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: contactsKeys.lists() });
    },
  });
}
