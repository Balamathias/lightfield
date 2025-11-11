'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  GripVertical,
  Star,
  Check,
  X,
  MessageSquare
} from 'lucide-react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useTestimonials, useCreateTestimonial, useUpdateTestimonial, useDeleteTestimonial, useReorderTestimonials } from '@/hooks/useTestimonials';
import { testimonialSchema, type TestimonialFormValues } from '@/schemas';
import type { TestimonialListItem } from '@/types';
import { toast } from 'sonner';
import ImageUpload from '@/components/ImageUpload';

// Sortable Item Component
function SortableTestimonialItem({ testimonial, onEdit, onDelete }: {
  testimonial: TestimonialListItem;
  onEdit: (testimonial: TestimonialListItem) => void;
  onDelete: (testimonial: TestimonialListItem) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: testimonial.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-5"
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-2 hover:bg-accent/50 rounded-lg transition-colors"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Client Image */}
        <div className="flex-shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-gradient-to-br from-brand-primary/10 to-brand-primary/5 ring-1 ring-border/50">
          {testimonial.client_image_url ? (
            <img
              src={testimonial.client_image_url}
              alt={testimonial.client_name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <MessageSquare className="w-7 h-7 text-brand-primary/30" />
            </div>
          )}
        </div>

        {/* Testimonial Content */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1 group-hover:text-brand-primary transition-colors">
            {testimonial.client_name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">
            {testimonial.client_title}
            {testimonial.client_company && ` • ${testimonial.client_company}`}
          </p>

          {/* Rating */}
          <div className="flex items-center gap-1 mb-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${
                  i < testimonial.rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            ))}
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">
            {testimonial.testimonial_text}
          </p>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {testimonial.case_type && (
            <span className="inline-flex items-center px-3 py-1.5 bg-accent rounded-xl text-xs font-semibold">
              {testimonial.case_type}
            </span>
          )}
          {testimonial.is_featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-semibold ring-1 ring-amber-500/20">
              <Star className="w-3 h-3 fill-current" />
              Featured
            </span>
          )}
          {testimonial.is_active ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl text-xs font-semibold ring-1 ring-green-500/20">
              <Check className="w-3 h-3" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-xl text-xs font-semibold">
              <X className="w-3 h-3" />
              Inactive
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={() => onEdit(testimonial)}
            className="px-3 py-2 bg-accent hover:bg-accent/80 text-foreground font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            <Pencil className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={() => onDelete(testimonial)}
            className="p-2 bg-red-500/10 text-red-600 font-semibold rounded-xl hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Modal Component for Create/Edit
function TestimonialModal({
  isOpen,
  onClose,
  testimonial,
}: {
  isOpen: boolean;
  onClose: () => void;
  testimonial?: TestimonialListItem | null;
}) {
  const isEdit = !!testimonial;
  const createMutation = useCreateTestimonial();
  const updateMutation = useUpdateTestimonial();

  type SchemaFormValues = Omit<TestimonialFormValues, 'rating'> & { rating?: number };

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<SchemaFormValues>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: testimonial ? {
      client_name: testimonial.client_name,
      client_title: testimonial.client_title,
      client_company: testimonial.client_company || '',
      testimonial_text: testimonial.testimonial_text,
      client_image_url: testimonial.client_image_url || '',
      rating: testimonial.rating,
      case_type: testimonial.case_type || '',
      is_featured: testimonial.is_featured,
      is_active: testimonial.is_active,
      order_priority: testimonial.order_priority,
    } : {
      client_name: '',
      client_title: '',
      client_company: '',
      testimonial_text: '',
      client_image_url: '',
      rating: 5,
      case_type: '',
      is_featured: false,
      is_active: true,
      order_priority: 0,
    },
  });

  const rating = watch('rating') || 5;
  const clientImageUrl = watch('client_image_url');

  // Reset form when testimonial changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (testimonial) {
        // Reset with testimonial data for edit mode
        reset({
          client_name: testimonial.client_name,
          client_title: testimonial.client_title,
          client_company: testimonial.client_company || '',
          testimonial_text: testimonial.testimonial_text,
          client_image_url: testimonial.client_image_url || '',
          rating: testimonial.rating,
          case_type: testimonial.case_type || '',
          is_featured: testimonial.is_featured,
          is_active: testimonial.is_active,
          order_priority: testimonial.order_priority,
        });
      } else {
        // Reset with empty data for create mode
        reset({
          client_name: '',
          client_title: '',
          client_company: '',
          testimonial_text: '',
          client_image_url: '',
          rating: 5,
          case_type: '',
          is_featured: false,
          is_active: true,
          order_priority: 0,
        });
      }
    }
  }, [isOpen, testimonial, reset]);

  const onSubmit = async (data: SchemaFormValues) => {
    try {
      if (isEdit && testimonial) {
        await updateMutation.mutateAsync({
          id: testimonial.id,
          data: {
            ...data,
            client_company: data.client_company || null,
            client_image_url: data.client_image_url || null,
            case_type: data.case_type || null,
          },
        });
        toast.success('Testimonial updated successfully');
      } else {
        await createMutation.mutateAsync({
          ...data,
          client_company: data.client_company || null,
          client_image_url: data.client_image_url || null,
          case_type: data.case_type || null,
        });
        toast.success('Testimonial created successfully');
      }
      reset();
      onClose();
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'An error occurred');
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-card border border-border rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        >
          <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold">
              {isEdit ? 'Edit Testimonial' : 'Create Testimonial'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-accent rounded-md transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
            {/* Client Name */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Client Name <span className="text-destructive">*</span>
              </label>
              <input
                {...register('client_name')}
                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="John Doe"
              />
              {errors.client_name && (
                <p className="text-sm text-destructive mt-1">{errors.client_name.message}</p>
              )}
            </div>

            {/* Client Title */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Client Title <span className="text-destructive">*</span>
              </label>
              <input
                {...register('client_title')}
                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="CEO of Tech Corp"
              />
              {errors.client_title && (
                <p className="text-sm text-destructive mt-1">{errors.client_title.message}</p>
              )}
            </div>

            {/* Client Company */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Company (Optional)
              </label>
              <input
                {...register('client_company')}
                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="Tech Corp"
              />
              {errors.client_company && (
                <p className="text-sm text-destructive mt-1">{errors.client_company.message}</p>
              )}
            </div>

            {/* Testimonial Text */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Testimonial <span className="text-destructive">*</span>
              </label>
              <textarea
                {...register('testimonial_text')}
                rows={6}
                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                placeholder="Share your experience working with our team..."
              />
              {errors.testimonial_text && (
                <p className="text-sm text-destructive mt-1">{errors.testimonial_text.message}</p>
              )}
            </div>

            {/* Rating */}
            <div>
              <label className="block text-sm font-medium mb-2">Rating</label>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((value) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setValue('rating', value)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-8 h-8 ${
                        value <= rating
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
                <span className="ml-2 text-sm text-muted-foreground">
                  {rating} {rating === 1 ? 'star' : 'stars'}
                </span>
              </div>
              {errors.rating && (
                <p className="text-sm text-destructive mt-1">{errors.rating.message}</p>
              )}
            </div>

            {/* Case Type */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Case Type (Optional)
              </label>
              <input
                {...register('case_type')}
                className="w-full px-4 py-2 bg-background border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                placeholder="e.g., Blockchain Law, AI Regulation"
              />
              {errors.case_type && (
                <p className="text-sm text-destructive mt-1">{errors.case_type.message}</p>
              )}
            </div>

            {/* Client Image */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Client Photo (Optional)
              </label>
              <ImageUpload
                value={clientImageUrl || ''}
                onChange={(url) => setValue('client_image_url', url)}
                folder="testimonials"
              />
              {errors.client_image_url && (
                <p className="text-sm text-destructive mt-1">{errors.client_image_url.message}</p>
              )}
            </div>

            {/* Toggles */}
            <div className="flex gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_featured')}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Featured</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  {...register('is_active')}
                  className="w-4 h-4 rounded border-border"
                />
                <span className="text-sm">Active</span>
              </label>
            </div>

            {/* Form Actions */}
            <div className="flex gap-3 pt-4 border-t border-border">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-border rounded-md hover:bg-accent transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 px-4 py-2 bg-brand-primary text-white rounded-md hover:bg-brand-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Saving...' : isEdit ? 'Update Testimonial' : 'Create Testimonial'}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// Delete Confirmation Modal
function DeleteModal({
  isOpen,
  onClose,
  onConfirm,
  testimonial,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  testimonial: TestimonialListItem | null;
}) {
  if (!isOpen || !testimonial) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={onClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', duration: 0.5 }}
          className="relative bg-gradient-to-br from-card to-card/95 backdrop-blur-xl rounded-3xl border border-border/50 p-8 max-w-md w-full shadow-2xl"
        >
          <div className="flex items-start gap-5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-destructive/20 to-destructive/10 flex items-center justify-center flex-shrink-0 ring-1 ring-destructive/20">
              <Trash2 className="w-7 h-7 text-destructive" />
            </div>
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-foreground mb-2">Delete Testimonial</h3>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Are you sure you want to delete the testimonial from{' '}
                <span className="font-semibold text-foreground">{testimonial.client_name}</span>?
                This action cannot be undone.
              </p>
              <div className="flex items-center gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 px-5 py-3 bg-accent hover:bg-accent/80 text-foreground rounded-xl transition-all font-medium hover:scale-105"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  className="flex-1 px-5 py-3 bg-gradient-to-r from-destructive to-destructive/90 hover:from-destructive/90 hover:to-destructive text-destructive-foreground rounded-xl transition-all font-medium flex items-center justify-center gap-2 shadow-lg shadow-destructive/25 hover:scale-105"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// Main Page Component
export default function TestimonialsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialListItem | null>(null);
  const [deletingTestimonial, setDeletingTestimonial] = useState<TestimonialListItem | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');

  const { data: testimonials = [], isLoading } = useTestimonials({
    is_active: statusFilter === 'all' ? undefined : statusFilter === 'active',
  });

  const deleteMutation = useDeleteTestimonial();
  const reorderMutation = useReorderTestimonials();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = testimonials.findIndex((t) => t.id === active.id);
      const newIndex = testimonials.findIndex((t) => t.id === over.id);

      const reorderedItems = arrayMove(testimonials, oldIndex, newIndex);
      const reorderData = {
        items: reorderedItems.map((item, index) => ({
          id: item.id,
          order_priority: index,
        })),
      };

      try {
        await reorderMutation.mutateAsync(reorderData);
        toast.success('Testimonials reordered successfully');
      } catch (error) {
        toast.error('Failed to reorder testimonials');
      }
    }
  };

  const handleDelete = async () => {
    if (!deletingTestimonial) return;

    try {
      await deleteMutation.mutateAsync(deletingTestimonial.id);
      toast.success('Testimonial deleted successfully');
      setDeletingTestimonial(null);
    } catch (error) {
      toast.error('Failed to delete testimonial');
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl p-6 border border-primary/10">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold">
                Testimonials
              </h1>
            </div>
            <p className="text-muted-foreground text-base">
              Manage client testimonials and showcase success stories
            </p>
          </div>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-brand-primary to-brand-primary/90 hover:from-brand-primary/90 hover:to-brand-primary text-white rounded-2xl transition-all font-medium shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 hover:scale-105"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Add Testimonial</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-card rounded-2xl border border-primary/10 p-6">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setStatusFilter('all')}
            className={`group relative inline-flex items-center gap-3 px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 ${
              statusFilter === 'all'
                ? 'bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20'
                : 'hover:shadow-md'
            }`}
          >
            <MessageSquare className="w-5 h-5" />
            <span className="font-medium">All</span>
          </button>
          <button
            onClick={() => setStatusFilter('active')}
            className={`group relative inline-flex items-center gap-3 px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 ${
              statusFilter === 'active'
                ? 'bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20'
                : 'hover:shadow-md'
            }`}
          >
            <Check className="w-5 h-5" />
            <span className="font-medium">Active</span>
          </button>
          <button
            onClick={() => setStatusFilter('inactive')}
            className={`group relative inline-flex items-center gap-3 px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 ${
              statusFilter === 'inactive'
                ? 'bg-brand-primary/10 text-brand-primary ring-2 ring-brand-primary/20'
                : 'hover:shadow-md'
            }`}
          >
            <X className="w-5 h-5" />
            <span className="font-medium">Inactive</span>
          </button>
        </div>
      </div>

      {/* Drag Info Banner */}
      {!isLoading && testimonials && testimonials.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 bg-secondary/10 border rounded-2xl border-primary/10"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Drag to Reorder</p>
            <p className="text-xs text-muted-foreground dark:text-secondary mt-0.5">
              Drag testimonials to change their display priority. Changes are saved automatically.
            </p>
          </div>
        </motion.div>
      )}

      {/* Testimonials List */}
      <div className="relative overflow-hidden bg-card border border-border/10 rounded-3xl shadow-xl">
        <div className="relative z-10">
          {/* Table Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-brand-primary/10 rounded-xl">
                <MessageSquare className="w-6 h-6 text-brand-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">All Testimonials</h3>
                <p className="text-sm text-muted-foreground">
                  {testimonials?.length || 0} testimonial{testimonials?.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                <Star className="w-6 h-6 text-brand-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-4 text-muted-foreground font-medium">Loading testimonials...</p>
            </div>
          ) : testimonials.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-brand-primary/5 rounded-3xl mb-6 ring-1 ring-brand-primary/10">
                <MessageSquare className="w-20 h-20 text-brand-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No testimonials yet</h3>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                Get started by creating your first testimonial to showcase client success stories
              </p>
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-brand-primary to-brand-primary/90 hover:from-brand-primary/90 hover:to-brand-primary text-white rounded-2xl transition-all font-semibold shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 hover:scale-105"
              >
                <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                <span>Create Your First Testimonial</span>
              </button>
            </div>
          ) : (
            <div className="p-6">
              <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
              >
                <SortableContext
                  items={testimonials.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-2">
                    {testimonials.map((testimonial) => (
                      <SortableTestimonialItem
                        key={testimonial.id}
                        testimonial={testimonial}
                        onEdit={setEditingTestimonial}
                        onDelete={setDeletingTestimonial}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <TestimonialModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        testimonial={null}
      />

      <TestimonialModal
        isOpen={!!editingTestimonial}
        onClose={() => setEditingTestimonial(null)}
        testimonial={editingTestimonial}
      />

      <DeleteModal
        isOpen={!!deletingTestimonial}
        onClose={() => setDeletingTestimonial(null)}
        onConfirm={handleDelete}
        testimonial={deletingTestimonial}
      />
    </div>
  );
}
