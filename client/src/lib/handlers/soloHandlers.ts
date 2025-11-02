import apiClient from '../api/client';
import type { SoloChatRequest, SoloChatResponse } from '@/types';

/**
 * Send message to Solo AI assistant (public)
 */
export const sendSoloMessage = async (data: SoloChatRequest): Promise<SoloChatResponse> => {
  const response = await apiClient.post<SoloChatResponse>('/solo/chat/', data);
  return response.data;
};
