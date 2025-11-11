import apiClient from '../api/client';
import type {
  BlogPost,
  BlogPostListItem,
  BlogPostFormData,
  BlogFilters,
  ReorderRequest
} from '@/types';

export interface PaginatedBlogResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: BlogPostListItem[];
}

/**
 * Get all blog posts with optional filters (paginated)
 */
export const getBlogs = async (filters?: BlogFilters & { page?: number; page_size?: number }): Promise<PaginatedBlogResponse> => {
  const params = new URLSearchParams();

  if (filters?.search) params.append('search', filters.search);
  if (filters?.category) params.append('category', filters.category);
  if (filters?.is_featured !== undefined) params.append('is_featured', filters.is_featured.toString());
  if (filters?.ordering) params.append('ordering', filters.ordering);
  if (filters?.page) params.append('page', filters.page.toString());
  if (filters?.page_size) params.append('page_size', filters.page_size.toString());

  const response = await apiClient.get<PaginatedBlogResponse>('/blogs/', { params });
  return response.data;
};

/**
 * Get single blog post by slug
 */
export const getBlog = async (slug: string): Promise<BlogPost> => {
  const response = await apiClient.get<BlogPost>(`/blogs/${slug}/`);
  return response.data;
};

/**
 * Create new blog post (admin only)
 */
export const createBlog = async (data: BlogPostFormData): Promise<BlogPost> => {
  const response = await apiClient.post<BlogPost>('/blogs/', data);
  return response.data;
};

/**
 * Update blog post (admin only)
 */
export const updateBlog = async (slug: string, data: Partial<BlogPostFormData>): Promise<BlogPost> => {
  const response = await apiClient.patch<BlogPost>(`/blogs/${slug}/`, data);
  return response.data;
};

/**
 * Delete blog post (admin only)
 */
export const deleteBlog = async (slug: string): Promise<void> => {
  await apiClient.delete(`/blogs/${slug}/`);
};

/**
 * Reorder blog posts (admin only)
 */
export const reorderBlogs = async (items: ReorderRequest): Promise<{ message: string }> => {
  const response = await apiClient.post<{ message: string }>('/blogs/reorder/', items);
  return response.data;
};

/**
 * Generate AI overview for blog post (public)
 */
export const generateAIOverview = async (blogId: number): Promise<{ overview: string }> => {
  const response = await apiClient.post<{ overview: string }>('/blogs/ai-overview/', { blog_id: blogId });
  return response.data;
};

/**
 * Get AI assistance for blog writing (admin only)
 */
export const getBlogAIAssistance = async (data: {
  action: string;
  content: string;
  context?: string;
}): Promise<{ result: string }> => {
  const response = await apiClient.post<{ result: string }>('/blogs/ai-assist/', data);
  return response.data;
};
