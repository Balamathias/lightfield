'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useBlog, useUpdateBlog } from '@/hooks/useBlogs';
import { useCategories } from '@/hooks/useCategories';
import { blogPostSchema, type BlogPostFormValues } from '@/schemas';
import RichTextEditor from '@/components/RichTextEditor';
import ImageUpload from '@/components/ImageUpload';
import BlogAIAssistant from '@/components/admin/BlogAIAssistant';
import InlineAIHelper from '@/components/admin/InlineAIHelper';
import DateTimePicker from '@/components/DateTimePicker';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function EditBlogPage() {
  const router = useRouter();
  const params = useParams();
  const slug = params.slug as string;

  const { data: blog, isLoading: blogLoading } = useBlog(slug);
  const updateMutation = useUpdateBlog();
  const { data: categories } = useCategories();

  const [formData, setFormData] = useState<Partial<BlogPostFormValues>>({
    title: '',
    excerpt: '',
    content: '',
    category_ids: [],
    featured_image_url: '',
    meta_description: '',
    meta_keywords: '',
    is_published: false,
    is_featured: false,
    order_priority: 0,
    publish_date: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BlogPostFormValues, string>>>({});
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);

  // Populate form when blog data loads
  useEffect(() => {
    if (blog) {
      setFormData({
        title: blog.title,
        excerpt: blog.excerpt,
        content: blog.content,
        featured_image_url: blog.featured_image_url || '',
        meta_description: blog.meta_description || '',
        meta_keywords: blog.meta_keywords || '',
        is_published: blog.is_published,
        is_featured: blog.is_featured,
        order_priority: blog.order_priority,
        publish_date: blog.publish_date || '',
      });
      setSelectedCategories(blog.categories?.map((c) => c.id) || []);
    }
  }, [blog]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Prepare data - handle publish_date format
    const submitData = {
      ...formData,
      category_ids: selectedCategories,
      publish_date: formData.publish_date || null,
    };

    // Validate with Zod
    const validation = blogPostSchema.safeParse(submitData);

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof BlogPostFormValues, string>> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          const field = err.path[0] as keyof BlogPostFormValues;
          fieldErrors[field] = err.message;
        }
      });
      setErrors(fieldErrors);

      // Show toast for validation errors with more detail
      const firstError = validation.error.issues[0];
      console.error('Validation errors:', validation.error.issues);
      toast.error('Validation Error', {
        description: firstError ? `${firstError.path.join('.')}: ${firstError.message}` : 'Please check the form for errors',
      });
      return;
    }

    try {
      await updateMutation.mutateAsync({
        slug,
        data: submitData as any,
      });
      toast.success('Blog Post Updated!', {
        description: 'Your blog post has been successfully updated.',
      });
      router.push('/admin/blogs');
    } catch (error: any) {
      // Handle backend validation errors
      if (error.response?.data) {
        const backendErrors = error.response.data;
        const formattedErrors: Partial<Record<keyof BlogPostFormValues, string>> = {};

        // Map backend errors to form fields
        Object.keys(backendErrors).forEach((key) => {
          const field = key as keyof BlogPostFormValues;
          formattedErrors[field] = backendErrors[key];
        });

        setErrors(formattedErrors);

        // Show specific error message
        const firstError = Object.entries(backendErrors)[0];
        if (firstError) {
          const [fieldName, errorMsg] = firstError;
          const friendlyFieldName = fieldName.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
          toast.error(`${friendlyFieldName} Error`, {
            description: errorMsg as any,
          });
        } else {
          toast.error('Failed to Update Blog Post', {
            description: 'Please check the form and try again.',
          });
        }
      } else {
        toast.error('Failed to Update Blog Post', {
          description: error.message || 'An unexpected error occurred.',
        });
      }
    }
  };

  const toggleCategory = (categoryId: number) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((id) => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  if (blogLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-accent rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">Edit Blog Post</h1>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6 space-y-6"
        >
          {/* Title */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="title" className="block text-sm font-medium text-foreground">
                Title <span className="text-destructive">*</span>
              </label>
              <InlineAIHelper
                fieldName="title"
                currentValue={formData.title}
                context={formData}
                onInsert={(value) => setFormData({ ...formData, title: value })}
                suggestions={[
                  'Generate SEO-optimized title',
                  'Make title more engaging',
                  'Improve title clarity',
                ]}
              />
            </div>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.title ? 'border-destructive' : 'border-input'
              } bg-background text-foreground text-lg font-semibold focus:ring-2 focus:ring-ring focus:border-transparent transition`}
              placeholder="Enter an engaging title..."
            />
            {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Excerpt */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="excerpt" className="block text-sm font-medium text-foreground">
                Excerpt <span className="text-destructive">*</span>
              </label>
              <InlineAIHelper
                fieldName="excerpt"
                currentValue={formData.excerpt}
                context={formData}
                onInsert={(value) => setFormData({ ...formData, excerpt: value })}
                suggestions={[
                  'Generate compelling excerpt',
                  'Create summary from content',
                  'Make excerpt more engaging',
                ]}
              />
            </div>
            <textarea
              id="excerpt"
              value={formData.excerpt}
              onChange={(e) => setFormData((prev) => ({ ...prev, excerpt: e.target.value }))}
              rows={3}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.excerpt ? 'border-destructive' : 'border-input'
              } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition resize-none`}
              placeholder="Write a brief summary (50-500 characters)..."
            />
            {errors.excerpt && <p className="text-destructive text-sm mt-1">{errors.excerpt}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              {formData.excerpt?.length || 0}/500 characters
            </p>
          </div>

          {/* Content Editor */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Content <span className="text-destructive">*</span>
            </label>
            <RichTextEditor
              content={formData.content || ''}
              onChange={(content) => setFormData((prev) => ({ ...prev, content }))}
              placeholder="Write your blog post content here..."
            />
            {errors.content && <p className="text-destructive text-sm mt-1">{errors.content}</p>}
          </div>
        </motion.div>

        {/* Sidebar Settings */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Categories & Settings */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-6"
          >
            {/* Categories */}
            <div className="bg-card rounded-xl border border-border p-6">
              <h3 className="text-sm font-semibold text-foreground mb-3">Categories</h3>
              <div className="space-y-1">
                {categories && categories.length > 0 ? (
                  categories.map((category) => (
                    <label
                      key={category.id}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-accent cursor-pointer transition-colors group"
                    >
                      <div className="relative">
                        <input
                          type="checkbox"
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => toggleCategory(category.id)}
                          className="peer w-4 h-4 rounded border-2 border-input appearance-none checked:bg-primary checked:border-primary cursor-pointer transition-all"
                        />
                        <svg
                          className="absolute top-0 left-0 w-4 h-4 text-primary-foreground pointer-events-none opacity-0 peer-checked:opacity-100 transition-opacity"
                          viewBox="0 0 16 16"
                          fill="none"
                        >
                          <path
                            d="M12 5L6.5 10.5L4 8"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <span className="text-sm text-foreground">{category.name}</span>
                    </label>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No categories available</p>
                )}
              </div>
            </div>

            {/* Publishing Options */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-3">
              <h3 className="text-sm font-semibold text-foreground mb-3">Publishing</h3>

              {/* Published Toggle */}
              <label className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-accent cursor-pointer transition-colors group">
                <span className="text-sm font-medium text-foreground">Published</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="w-9 h-5 bg-input rounded-full peer-checked:bg-primary transition-colors"></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
                </div>
              </label>

              {/* Featured Toggle */}
              <label className="flex items-center justify-between gap-3 p-2.5 rounded-lg hover:bg-accent cursor-pointer transition-colors group">
                <span className="text-sm font-medium text-foreground">Featured</span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="peer sr-only"
                  />
                  <div className="w-9 h-5 bg-input rounded-full peer-checked:bg-primary transition-colors"></div>
                  <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full transition-transform peer-checked:translate-x-4 shadow-sm"></div>
                </div>
              </label>

              {/* Publish Date */}
              <DateTimePicker
                label="Publish Date"
                value={formData.publish_date || ''}
                onChange={(value) => setFormData({ ...formData, publish_date: value })}
                placeholder="Select publish date and time"
              />

              {/* Order Priority */}
              <div>
                <label htmlFor="order_priority" className="block text-sm font-medium text-foreground mb-2">
                  Order Priority
                </label>
                <input
                  id="order_priority"
                  type="number"
                  min="0"
                  value={formData.order_priority}
                  onChange={(e) =>
                    setFormData({ ...formData, order_priority: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:ring-2 focus:ring-ring focus:border-transparent transition"
                />
              </div>
            </div>
          </motion.div>

          {/* Media & SEO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Featured Image */}
            <div className="bg-card rounded-xl border border-border p-6">
              <ImageUpload
                value={formData.featured_image_url || ''}
                onChange={(url) => setFormData({ ...formData, featured_image_url: url })}
                folder="blog-featured"
                label="Featured Image"
                aspectRatio="video"
              />
            </div>

            {/* SEO Settings */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h3 className="text-sm font-semibold text-foreground mb-3">SEO Settings</h3>

              {/* Meta Description */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="meta_description" className="block text-sm font-medium text-foreground">
                    Meta Description
                  </label>
                  <InlineAIHelper
                    fieldName="meta_description"
                    currentValue={formData.meta_description}
                    context={formData}
                    onInsert={(value) => setFormData({ ...formData, meta_description: value })}
                    suggestions={[
                      'Generate SEO meta description',
                      'Optimize for click-through',
                    ]}
                  />
                </div>
                <textarea
                  id="meta_description"
                  value={formData.meta_description}
                  onChange={(e) =>
                    setFormData({ ...formData, meta_description: e.target.value })
                  }
                  rows={3}
                  maxLength={160}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition resize-none text-sm"
                  placeholder="Brief description for search engines..."
                />
                <p className="text-xs text-muted-foreground mt-1.5">
                  {formData.meta_description?.length || 0}/160 characters
                </p>
              </div>

              {/* Meta Keywords */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="meta_keywords" className="block text-sm font-medium text-foreground">
                    Meta Keywords
                  </label>
                  <InlineAIHelper
                    fieldName="meta_keywords"
                    currentValue={formData.meta_keywords}
                    context={formData}
                    onInsert={(value) => setFormData({ ...formData, meta_keywords: value })}
                    suggestions={[
                      'Suggest relevant SEO keywords',
                      'Generate keyword variations',
                    ]}
                  />
                </div>
                <input
                  id="meta_keywords"
                  type="text"
                  value={formData.meta_keywords}
                  onChange={(e) => setFormData({ ...formData, meta_keywords: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition text-sm"
                  placeholder="keyword1, keyword2, keyword3"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex items-center justify-end gap-4 bg-card rounded-xl border border-border p-6"
        >
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-3 border border-border hover:bg-accent text-foreground rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={updateMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {updateMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Updating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Update Post
              </>
            )}
          </button>
        </motion.div>
      </form>

      {/* AI Assistant */}
      <BlogAIAssistant
        context={{
          title: formData.title,
          excerpt: formData.excerpt,
          content: formData.content,
        }}
        onInsertToField={(fieldName, value) => {
          console.log('onInsertToField called:', { fieldName, value: value?.substring(0, 100) });

          // Use functional setState to avoid stale state issues
          setFormData((prev) => {
            let newData;

            if (fieldName === 'content') {
              // Convert plain text to HTML paragraphs for TipTap
              const textToHtml = (text: string) => {
                return text
                  .split('\n\n')
                  .map(para => para.trim())
                  .filter(para => para.length > 0)
                  .map(para => `<p>${para.replace(/\n/g, '<br>')}</p>`)
                  .join('');
              };

              const htmlValue = textToHtml(value);
              const currentContent = prev.content || '';

              // Append HTML content
              newData = {
                ...prev,
                content: currentContent + htmlValue,
              };
            } else {
              // For other fields, replace the value
              newData = { ...prev, [fieldName]: value };
            }

            console.log('New formData:', { ...newData, content: newData.content?.substring(0, 100) });
            return newData;
          });

          toast.success(`Content inserted into ${fieldName}!`);
        }}
      />
    </div>
  );
}
