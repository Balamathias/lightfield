import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getBlogs,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
  reorderBlogs,
  generateAIOverview,
  getBlogAIAssistance,
} from '@/lib/handlers/blogsHandlers';
import type { BlogPostFormData, BlogFilters, ReorderRequest } from '@/types';

// Query keys
export const blogsKeys = {
  all: ['blogs'] as const,
  lists: () => [...blogsKeys.all, 'list'] as const,
  list: (filters?: BlogFilters) => [...blogsKeys.lists(), filters] as const,
  details: () => [...blogsKeys.all, 'detail'] as const,
  detail: (slug: string) => [...blogsKeys.details(), slug] as const,
};

/**
 * Hook to fetch all blog posts with optional filters
 */
export function useBlogs(filters?: BlogFilters) {
  return useQuery({
    queryKey: blogsKeys.list(filters),
    queryFn: () => getBlogs(filters),
  });
}

/**
 * Hook to fetch single blog post by slug
 */
export function useBlog(slug: string) {
  return useQuery({
    queryKey: blogsKeys.detail(slug),
    queryFn: () => getBlog(slug),
    enabled: !!slug,
  });
}

/**
 * Hook to create new blog post
 */
export function useCreateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BlogPostFormData) => createBlog(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogsKeys.lists() });
    },
  });
}

/**
 * Hook to update blog post
 */
export function useUpdateBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ slug, data }: { slug: string; data: Partial<BlogPostFormData> }) =>
      updateBlog(slug, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: blogsKeys.lists() });
      queryClient.invalidateQueries({ queryKey: blogsKeys.detail(data.slug) });
    },
  });
}

/**
 * Hook to delete blog post
 */
export function useDeleteBlog() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slug: string) => deleteBlog(slug),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogsKeys.lists() });
    },
  });
}

/**
 * Hook to reorder blog posts
 */
export function useReorderBlogs() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ReorderRequest) => reorderBlogs(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: blogsKeys.lists() });
    },
  });
}

/**
 * Hook to generate AI overview for blog
 */
export function useGenerateAIOverview() {
  return useMutation({
    mutationFn: (blogId: number) => generateAIOverview(blogId),
  });
}

/**
 * Hook to get AI assistance for blog writing
 */
export function useBlogAIAssistance() {
  return useMutation({
    mutationFn: (data: { action: string; content: string; context?: string }) =>
      getBlogAIAssistance(data),
  });
}
