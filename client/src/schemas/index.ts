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
  publish_date: z.string().datetime().optional().or(z.literal('')),
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
