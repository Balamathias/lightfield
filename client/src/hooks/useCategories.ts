import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getCategories,
  getCategory,
  createCategory,
  updateCategory,
  deleteCategory,
  reorderCategories,
} from '@/lib/handlers/categoriesHandlers';
import type { BlogCategoryFormData, ReorderRequest } from '@/types';

// Query keys
export const categoriesKeys = {
  all: ['categories'] as const,
  lists: () => [...categoriesKeys.all, 'list'] as const,
  list: () => [...categoriesKeys.lists()] as const,
  details: () => [...categoriesKeys.all, 'detail'] as const,
  detail: (id: number) => [...categoriesKeys.details(), id] as const,
};

/**
 * Hook to fetch all categories
 */
export function useCategories() {
  return useQuery({
    queryKey: categoriesKeys.list(),
    queryFn: () => getCategories(),
  });
}

/**
 * Hook to fetch single category by ID
 */
export function useCategory(id: number) {
  return useQuery({
    queryKey: categoriesKeys.detail(id),
    queryFn: () => getCategory(id),
    enabled: !!id,
  });
}

/**
 * Hook to create new category
 */
export function useCreateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: BlogCategoryFormData) => createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
    },
  });
}

/**
 * Hook to update category
 */
export function useUpdateCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<BlogCategoryFormData> }) =>
      updateCategory(id, data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
      queryClient.invalidateQueries({ queryKey: categoriesKeys.detail(data.id) });
    },
  });
}

/**
 * Hook to delete category
 */
export function useDeleteCategory() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteCategory(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
    },
  });
}

/**
 * Hook to reorder categories
 */
export function useReorderCategories() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (items: ReorderRequest) => reorderCategories(items),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoriesKeys.lists() });
    },
  });
}
