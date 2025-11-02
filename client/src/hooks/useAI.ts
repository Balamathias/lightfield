import { useMutation } from '@tanstack/react-query';
import {
  getBlogAIAssistance,
  generateAIOverview,
  soloChatMessage,
  type BlogAIAssistRequest,
  type GenerateOverviewRequest,
  type SoloChatRequest,
} from '@/lib/handlers/aiHandlers';

/**
 * Hook for blog AI assistant
 */
export const useBlogAIAssist = () => {
  return useMutation({
    mutationFn: (data: BlogAIAssistRequest) => getBlogAIAssistance(data),
  });
};

/**
 * Hook for generating AI overview
 */
export const useGenerateOverview = () => {
  return useMutation({
    mutationFn: (data: GenerateOverviewRequest) => generateAIOverview(data),
  });
};

/**
 * Hook for Solo chat
 */
export const useSoloChat = () => {
  return useMutation({
    mutationFn: (data: SoloChatRequest) => soloChatMessage(data),
  });
};
