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

// Grant & Scholarship types
export type GrantType = 'scholarship' | 'grant' | 'award' | 'fellowship';
export type GrantStatus = 'upcoming' | 'open' | 'closed' | 'awarded';

export interface Grant {
  id: number;
  title: string;
  slug: string;
  grant_type: GrantType;
  amount: number | null;
  currency: string;
  formatted_amount: string | null;
  short_description: string;
  full_description: string;
  eligibility_criteria: string[];
  how_to_apply: string;
  requirements: string[];
  application_email: string | null;
  application_url: string | null;
  guidelines: string[];
  image_url: string | null;
  banner_image_url: string | null;
  target_audience: string;
  target_institutions: string[];
  application_deadline: string | null;
  announcement_date: string | null;
  status: GrantStatus;
  is_featured: boolean;
  is_active: boolean;
  order_priority: number;
  social_links: Record<string, string>;
  is_application_open: boolean;
  days_until_deadline: number | null;
  created_at: string;
  updated_at: string;
}

export interface GrantListItem {
  id: number;
  title: string;
  slug: string;
  grant_type: GrantType;
  amount: number | null;
  currency: string;
  formatted_amount: string | null;
  short_description: string;
  image_url: string | null;
  target_audience: string;
  application_deadline: string | null;
  status: GrantStatus;
  is_featured: boolean;
  is_active: boolean;
  order_priority: number;
  is_application_open: boolean;
  days_until_deadline: number | null;
  created_at: string;
}

export interface GrantPublicItem {
  id: number;
  title: string;
  slug: string;
  grant_type: GrantType;
  formatted_amount: string;
  short_description: string;
  image_url: string | null;
  target_audience: string;
  application_deadline: string | null;
  status: GrantStatus;
  is_application_open: boolean;
  days_until_deadline: number | null;
}

export interface GrantFormData {
  title: string;
  grant_type: GrantType;
  amount?: number | null;
  currency?: string;
  short_description?: string;
  full_description?: string;
  eligibility_criteria?: string[];
  how_to_apply?: string;
  requirements?: string[];
  application_email?: string | null;
  application_url?: string | null;
  guidelines?: string[];
  image_url?: string | null;
  banner_image_url?: string | null;
  target_audience?: string;
  target_institutions?: string[];
  application_deadline?: string | null;
  announcement_date?: string | null;
  status?: GrantStatus;
  is_featured?: boolean;
  is_active?: boolean;
  order_priority?: number;
  social_links?: Record<string, string>;
}

export interface GrantFilters {
  search?: string;
  type?: GrantType;
  status?: GrantStatus;
  is_featured?: boolean;
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
  total_grants: number;
  active_grants: number;
  total_bookings: number;
  paid_bookings: number;
  consultation_revenue: string;
  pending_confirmations: number;
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
  page?: number;
  page_size?: number;
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

// Consultation types
export type ConsultationCategory = 'ai_law' | 'blockchain' | 'data_privacy' | 'tech_contracts' | 'ip' | 'corporate' | 'other';
export type BookingStatus = 'pending_payment' | 'paid' | 'confirmed' | 'completed' | 'cancelled' | 'refunded';

export interface ConsultationService {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: ConsultationCategory;
  price: number;
  currency: string;
  formatted_price: string;
  duration_minutes: number;
  formatted_duration: string;
  icon_name: string;
  image_url: string | null;
  order_priority: number;
  is_active: boolean;
  is_featured: boolean;
  booking_count?: number;
  created_at: string;
  updated_at: string;
}

export interface ConsultationServiceListItem {
  id: number;
  name: string;
  slug: string;
  short_description: string;
  category: ConsultationCategory;
  price: number;
  currency: string;
  formatted_price: string;
  duration_minutes: number;
  formatted_duration: string;
  icon_name: string;
  image_url: string | null;
  order_priority: number;
  is_active: boolean;
  is_featured: boolean;
  created_at: string;
}

export interface ConsultationServicePublic {
  id: number;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  category: ConsultationCategory;
  price: number;
  currency: string;
  formatted_price: string;
  duration_minutes: number;
  formatted_duration: string;
  icon_name: string;
  image_url: string | null;
  is_featured: boolean;
}

export interface ConsultationServiceFormData {
  name: string;
  description: string;
  short_description: string;
  category: ConsultationCategory;
  price: number;
  currency?: string;
  duration_minutes: number;
  icon_name?: string;
  image_url?: string | null;
  order_priority?: number;
  is_active?: boolean;
  is_featured?: boolean;
}

export interface BookingFormData {
  service_id?: number | null;
  custom_service_description?: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_company?: string;
  preferred_date: string;
  preferred_time: string;
  notes?: string;
}

export interface BookingCreateResponse {
  reference: string;
  access_code: string;
  authorization_url: string;
  amount: number;
  currency: string;
}

export interface BookingStatusResponse {
  reference: string;
  service_name: string;
  amount: number;
  currency: string;
  formatted_amount: string;
  status: BookingStatus;
  payment_verified: boolean;
  preferred_date: string;
  preferred_time: string;
  client_name: string;
  client_email: string;
}

export interface BookingAdminListItem {
  id: number;
  reference: string;
  service_name: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  formatted_amount: string;
  status: BookingStatus;
  payment_verified: boolean;
  preferred_date: string;
  preferred_time: string;
  assigned_associate_name: string | null;
  created_at: string;
}

export interface BookingAdminDetail {
  id: number;
  reference: string;
  service: number | null;
  service_name: string;
  service_detail: ConsultationServiceListItem | null;
  custom_service_description: string;
  client_name: string;
  client_email: string;
  client_phone: string;
  client_company: string;
  preferred_date: string;
  preferred_time: string;
  notes: string;
  amount: number;
  currency: string;
  formatted_amount: string;
  paystack_reference: string;
  paystack_access_code: string;
  payment_verified: boolean;
  payment_verified_at: string | null;
  payment_channel: string;
  status: BookingStatus;
  admin_notes: string;
  assigned_associate: number | null;
  assigned_associate_name: string | null;
  created_at: string;
  updated_at: string;
}

export interface BookingFilters {
  search?: string;
  status?: BookingStatus;
  date_from?: string;
  date_to?: string;
  service_id?: number;
}

export interface ConsultationStats {
  total_bookings: number;
  paid_bookings: number;
  revenue: number;
  formatted_revenue: string;
  pending_confirmations: number;
  status_breakdown: Array<{ status: string; count: number }>;
  popular_services: Array<{ service__name: string; count: number }>;
}
