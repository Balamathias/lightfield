import apiClient from '../api/client';

/**
 * Blog AI Assistant - Help with blog writing
 */
export interface BlogAIAssistRequest {
  prompt: string;
  context?: {
    title?: string;
    content?: string;
    excerpt?: string;
  };
}

export interface BlogAIAssistResponse {
  suggestion: string;
  prompt: string;
}

export const getBlogAIAssistance = async (data: BlogAIAssistRequest): Promise<BlogAIAssistResponse> => {
  const response = await apiClient.post<BlogAIAssistResponse>('/blogs/ai-assist/', data);
  return response.data;
};

/**
 * Generate AI Overview for blog post
 */
export interface GenerateOverviewRequest {
  slug?: string;
  title?: string;
  content?: string;
}

export interface GenerateOverviewResponse {
  overview: string;
  title: string;
}

export const generateAIOverview = async (data: GenerateOverviewRequest): Promise<GenerateOverviewResponse> => {
  const response = await apiClient.post<GenerateOverviewResponse>('/blogs/ai-overview/', data);
  return response.data;
};

/**
 * Solo AI Chat
 */
export interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export interface SoloChatRequest {
  message: string;
  conversation_history?: Message[];
}

export interface SoloChatResponse {
  response: string;
  message: string;
}

export const soloChatMessage = async (data: SoloChatRequest): Promise<SoloChatResponse> => {
  const response = await apiClient.post<SoloChatResponse>('/solo/chat/', data);
  return response.data;
};
