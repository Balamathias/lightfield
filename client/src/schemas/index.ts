import { z } from 'zod';

// Authentication schemas
export const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

// Associate schemas
export const associateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  title: z.string().min(2, 'Title must be at least 2 characters').max(255),
  bio: z.string().min(50, 'Bio must be at least 50 characters'),
  expertise: z.array(z.string()).min(1, 'At least one expertise area is required'),
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  email: z.string().email('Invalid email').optional().or(z.literal('')),
  phone: z.string().optional(),
  linkedin_url: z.string().url('Invalid LinkedIn URL').optional().or(z.literal('')),
  twitter_url: z.string().url('Invalid Twitter URL').optional().or(z.literal('')),
  order_priority: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
});

export type AssociateFormValues = z.infer<typeof associateSchema>;

// Blog Category schemas
export const blogCategorySchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters').max(100),
  description: z.string().optional(),
  order_priority: z.number().int().min(0).optional(),
});

export type BlogCategoryFormValues = z.infer<typeof blogCategorySchema>;

// Blog Post schemas
export const blogPostSchema = z.object({
  title: z.string().min(10, 'Title must be at least 10 characters').max(255),
  excerpt: z.string().min(50, 'Excerpt must be at least 50 characters').max(500),
  content: z.string().min(100, 'Content must be at least 100 characters'),
  category_ids: z.array(z.number()).optional(),
  featured_image_url: z.string().url('Invalid image URL').optional().or(z.literal('')),
  meta_description: z.string().max(160, 'Meta description must be 160 characters or less').optional(),
  meta_keywords: z.string().max(255, 'Meta keywords must be 255 characters or less').optional(),
  ai_overview: z.string().optional(),
  is_published: z.boolean().optional(),
  is_featured: z.boolean().optional(),
  order_priority: z.number().int().min(0).optional(),
  publish_date: z.union([
    z.string().datetime(),
    z.string().regex(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?Z?$/),
    z.literal(''),
    z.null()
  ]).optional().transform(val => val === null ? '' : val),
});

export type BlogPostFormValues = z.infer<typeof blogPostSchema>;

// Contact Form schema
export const contactFormSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  email: z.string().email('Invalid email address'),
  phone: z.string().optional(),
  subject: z.string().min(5, 'Subject must be at least 5 characters').max(255),
  message: z.string().min(20, 'Message must be at least 20 characters'),
});

export type ContactFormValues = z.infer<typeof contactFormSchema>;

// Testimonial schema
export const testimonialSchema = z.object({
  client_name: z.string().min(2, 'Client name must be at least 2 characters').max(255),
  client_title: z.string().min(2, 'Client title must be at least 2 characters').max(255),
  client_company: z.string().max(255).optional().or(z.literal('')),
  testimonial_text: z.string().min(20, 'Testimonial must be at least 20 characters'),
  client_image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating must be at most 5').default(5),
  case_type: z.string().max(100).optional().or(z.literal('')),
  order_priority: z.number().int().min(0).optional(),
  is_featured: z.boolean().optional(),
  is_active: z.boolean().optional(),
});

export type TestimonialFormValues = z.infer<typeof testimonialSchema>;

// Solo Chat schema
export const soloChatSchema = z.object({
  message: z.string().min(1, 'Message cannot be empty').max(1000, 'Message is too long'),
  session_id: z.string().optional(),
});

export type SoloChatFormValues = z.infer<typeof soloChatSchema>;

// Reorder schema
export const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.number().int(),
      order_priority: z.number().int().min(0),
    })
  ).min(1, 'At least one item is required'),
});

export type ReorderFormValues = z.infer<typeof reorderSchema>;

// Blog AI Assistant schema
export const blogAIAssistantSchema = z.object({
  action: z.enum(['generate_title', 'improve_content', 'generate_summary', 'suggest_keywords']),
  content: z.string().min(1, 'Content is required'),
  context: z.string().optional(),
});

export type BlogAIAssistantFormValues = z.infer<typeof blogAIAssistantSchema>;

// Consultation Service schema (admin)
export const consultationServiceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  short_description: z.string().min(10, 'Short description must be at least 10 characters').max(300),
  category: z.enum(['ai_law', 'blockchain', 'data_privacy', 'tech_contracts', 'ip', 'corporate', 'other']),
  price: z.number().positive('Price must be greater than 0'),
  currency: z.string().default('NGN'),
  duration_minutes: z.number().int().min(15, 'Minimum 15 minutes').max(480, 'Maximum 8 hours'),
  icon_name: z.string().optional().or(z.literal('')),
  image_url: z.string().url('Invalid URL').optional().or(z.literal('')),
  order_priority: z.number().int().min(0).optional(),
  is_active: z.boolean().optional(),
  is_featured: z.boolean().optional(),
});

export type ConsultationServiceFormValues = z.infer<typeof consultationServiceSchema>;

// Booking form schema (public)
export const bookingFormSchema = z.object({
  service_id: z.number().nullable().optional(),
  custom_service_description: z.string().optional().default(''),
  client_name: z.string().min(2, 'Name must be at least 2 characters').max(255),
  client_email: z.string().email('Invalid email address'),
  client_phone: z.string().min(7, 'Phone number must be at least 7 digits').max(50),
  client_company: z.string().max(255).optional().default(''),
  preferred_date: z.string().min(1, 'Date is required'),
  preferred_time: z.string().min(1, 'Time is required'),
  notes: z.string().optional().default(''),
}).refine(
  (data) => data.service_id || (data.custom_service_description && data.custom_service_description.length > 0),
  {
    message: 'Please select a service or describe your consultation needs',
    path: ['service_id'],
  }
);

export type BookingFormValues = z.infer<typeof bookingFormSchema>;
