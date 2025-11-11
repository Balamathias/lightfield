// User types
export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_superuser: boolean;
  date_joined: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: User;
}

// Associate types
export interface Associate {
  id: number;
  name: string;
  slug: string;
  title: string;
  bio: string;
  expertise: string[];
  image_url: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  order_priority: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface AssociateListItem {
  id: number;
  name: string;
  slug: string;
  title: string;
  bio: string;
  expertise: string[];
  image_url: string | null;
  email: string | null;
  phone: string | null;
  linkedin_url: string | null;
  twitter_url: string | null;
  is_active: boolean;
  order_priority: number;
}

export interface AssociateFormData {
  name: string;
  title: string;
  bio: string;
  expertise: string[];
  image_url?: string | null;
  email?: string | null;
  phone?: string | null;
  linkedin_url?: string | null;
  twitter_url?: string | null;
  order_priority?: number;
  is_active?: boolean;
}

// Blog Category types
export interface BlogCategory {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  order_priority: number;
  blog_count: number;
}

export interface BlogCategoryFormData {
  name: string;
  description?: string | null;
  order_priority?: number;
}

// Blog Post types
export interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author: number;
  author_name: string;
  author_username: string;
  categories: BlogCategory[];
  featured_image_url: string | null;
  meta_description: string | null;
  meta_keywords: string | null;
  ai_overview: string | null;
  is_published: boolean;
  is_featured: boolean;
  order_priority: number;
  view_count: number;
  publish_date: string | null;
  created_at: string;
  updated_at: string;
  read_time: number;
  related_posts?: BlogPostListItem[];
}

export interface BlogPostListItem {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  featured_image_url: string | null;
  author_name: string;
  author_username: string;
  categories: BlogCategory[];
  is_published: boolean;
  is_featured: boolean;
  view_count: number;
  publish_date: string | null;
  created_at: string;
  read_time: number;
}

export interface BlogPostFormData {
  title: string;
  excerpt: string;
  content: string;
  category_ids?: number[];
  featured_image_url?: string | null;
  meta_description?: string | null;
  meta_keywords?: string | null;
  ai_overview?: string | null;
  is_published?: boolean;
  is_featured?: boolean;
  order_priority?: number;
  publish_date?: string | null;
}

// Contact types
export interface ContactSubmission {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'responded';
  created_at: string;
  updated_at: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

// Testimonial types
export interface Testimonial {
  id: number;
  client_name: string;
  client_title: string;
  client_company: string | null;
  testimonial_text: string;
  client_image_url: string | null;
  rating: number;
  case_type: string | null;
  order_priority: number;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface TestimonialListItem {
  id: number;
  client_name: string;
  client_title: string;
  client_company: string | null;
  testimonial_text: string;
  client_image_url: string | null;
  rating: number;
  case_type: string | null;
  is_featured: boolean;
  is_active: boolean;
  order_priority: number;
  created_at: string;
}

export interface TestimonialFormData {
  client_name: string;
  client_title: string;
  client_company?: string | null;
  testimonial_text: string;
  client_image_url?: string | null;
  rating?: number;
  case_type?: string | null;
  order_priority?: number;
  is_featured?: boolean;
  is_active?: boolean;
}

// AI Conversation types
export interface AIMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface AIConversation {
  id: number;
  session_id: string;
  messages: AIMessage[];
  created_at: string;
  updated_at: string;
}

export interface SoloChatRequest {
  session_id: string;
  message: string;
}

export interface SoloChatResponse {
  message: string;
  session_id: string;
}

// Dashboard Stats types
export interface DashboardStats {
  total_blogs: number;
  published_blogs: number;
  draft_blogs: number;
  total_associates: number;
  active_associates: number;
  total_contacts: number;
  unread_contacts: number;
  total_views: number;
  total_testimonials: number;
  active_testimonials: number;
}

// Reorder types
export interface ReorderItem {
  id: number;
  order_priority: number;
}

export interface ReorderRequest {
  items: ReorderItem[];
}

// API Response types
export interface ApiError {
  error: string;
  details?: any;
}

export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Query/Filter types
export interface BlogFilters {
  search?: string;
  category?: string;
  is_featured?: boolean;
  ordering?: string;
}

export interface AssociateFilters {
  search?: string;
  is_active?: boolean;
}

export interface ContactFilters {
  status?: 'unread' | 'read' | 'responded';
  search?: string;
}

export interface TestimonialFilters {
  is_featured?: boolean;
  is_active?: boolean;
}

// Solo AI Analytics types
export interface SoloAnalyticsOverview {
  total_chats: number;
  total_sessions: number;
  avg_response_time_ms: number;
  recent_chats_30d: number;
  engagement_rate: number;
}

export interface PopularQuestion {
  user_message: string;
  count: number;
}

export interface ContextUsage {
  blog_posts_used: number;
  associates_used: number;
  services_used: number;
}

export interface SoloAnalytics {
  overview: SoloAnalyticsOverview;
  popular_questions: PopularQuestion[];
  context_usage: ContextUsage;
}

export interface TrendDataPoint {
  date: string;
  chats: number;
  avg_response_time: number;
}

export interface SoloAnalyticsTrends {
  trends: TrendDataPoint[];
  period_days: number;
}
