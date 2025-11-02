import { useMutation } from '@tanstack/react-query';
import { sendSoloMessage } from '@/lib/handlers/soloHandlers';
import type { SoloChatRequest } from '@/types';

/**
 * Hook to send message to Solo AI assistant
 */
export function useSoloChat() {
  return useMutation({
    mutationFn: (data: SoloChatRequest) => sendSoloMessage(data),
  });
}
