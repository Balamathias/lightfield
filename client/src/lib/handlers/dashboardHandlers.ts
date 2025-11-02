import apiClient from '../api/client';
import type { DashboardStats } from '@/types';

/**
 * Get dashboard statistics (admin only)
 */
export const getDashboardStats = async (): Promise<DashboardStats> => {
  const response = await apiClient.get<DashboardStats>('/admin/stats/');
  return response.data;
};

/**
 * Blog Views Over Time Chart Data
 */
export interface BlogViewsDataPoint {
  date: string;
  views: number;
}

export const getBlogViewsOverTime = async (days: number = 30): Promise<BlogViewsDataPoint[]> => {
  const response = await apiClient.get<BlogViewsDataPoint[]>(`/admin/charts/blog-views/?days=${days}`);
  return response.data;
};

/**
 * Posts Over Time Chart Data
 */
export interface PostsTimelineDataPoint {
  date: string;
  posts: number;
}

export const getPostsOverTime = async (days: number = 30): Promise<PostsTimelineDataPoint[]> => {
  const response = await apiClient.get<PostsTimelineDataPoint[]>(`/admin/charts/posts-timeline/?days=${days}`);
  return response.data;
};

/**
 * Posts by Category Chart Data
 */
export interface PostsByCategoryDataPoint {
  category: string;
  posts: number;
}

export const getPostsByCategory = async (): Promise<PostsByCategoryDataPoint[]> => {
  const response = await apiClient.get<PostsByCategoryDataPoint[]>('/admin/charts/posts-by-category/');
  return response.data;
};

/**
 * Contacts by Status Chart Data
 */
export interface ContactsByStatusDataPoint {
  status: string;
  value: number;
  rawStatus: string;
}

export const getContactsByStatus = async (): Promise<ContactsByStatusDataPoint[]> => {
  const response = await apiClient.get<ContactsByStatusDataPoint[]>('/admin/charts/contacts-by-status/');
  return response.data;
};
