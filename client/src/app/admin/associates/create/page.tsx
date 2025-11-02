'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCreateAssociate } from '@/hooks/useAssociates';
import { associateSchema, type AssociateFormValues } from '@/schemas';
import { ArrowLeft, Save, Loader2, Plus, X, Upload } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CreateAssociatePage() {
  const router = useRouter();
  const createMutation = useCreateAssociate();

  const [formData, setFormData] = useState<Partial<AssociateFormValues>>({
    name: '',
    title: '',
    bio: '',
    expertise: [],
    image_url: '',
    email: '',
    phone: '',
    linkedin_url: '',
    twitter_url: '',
    order_priority: 0,
    is_active: true,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof AssociateFormValues, string>>>({});
  const [expertiseInput, setExpertiseInput] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validate with Zod
    const validation = associateSchema.safeParse(formData);

    if (!validation.success) {
      const fieldErrors: Partial<Record<keyof AssociateFormValues, string>> = {};
      validation.error.issues.forEach((err) => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as keyof AssociateFormValues] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    try {
      await createMutation.mutateAsync(formData as any);
      router.push('/admin/associates');
    } catch (error: any) {
      setErrors({ name: error.message || 'Failed to create associate' });
    }
  };

  const addExpertise = () => {
    if (expertiseInput.trim()) {
      setFormData({
        ...formData,
        expertise: [...(formData.expertise || []), expertiseInput.trim()],
      });
      setExpertiseInput('');
    }
  };

  const removeExpertise = (index: number) => {
    setFormData({
      ...formData,
      expertise: formData.expertise?.filter((_, i) => i !== index) || [],
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-muted-foreground" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Add Associate</h1>
          <p className="text-muted-foreground mt-1">Add a new team member to your firm</p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card rounded-xl border border-border p-6 space-y-6"
        >
          <h2 className="text-xl font-semibold text-foreground">Basic Information</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.name ? 'border-destructive' : 'border-input'
                } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                placeholder="John Doe"
              />
              {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
            </div>

            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                Title/Position <span className="text-destructive">*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.title ? 'border-destructive' : 'border-input'
                } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                placeholder="Senior Partner"
              />
              {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
            </div>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-foreground mb-2">
              Biography <span className="text-destructive">*</span>
            </label>
            <textarea
              id="bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={6}
              className={`w-full px-4 py-3 rounded-lg border ${
                errors.bio ? 'border-destructive' : 'border-input'
              } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition resize-none`}
              placeholder="Write a detailed biography (minimum 50 characters)..."
            />
            {errors.bio && <p className="text-destructive text-sm mt-1">{errors.bio}</p>}
            <p className="text-xs text-muted-foreground mt-1">
              {formData.bio?.length || 0} characters
            </p>
          </div>

          {/* Expertise */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              Areas of Expertise <span className="text-destructive">*</span>
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={expertiseInput}
                onChange={(e) => setExpertiseInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addExpertise();
                  }
                }}
                className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                placeholder="e.g., Blockchain Law, AI Regulation"
              />
              <button
                type="button"
                onClick={addExpertise}
                className="px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
              >
                <Plus className="w-5 h-5" />
              </button>
            </div>
            {errors.expertise && (
              <p className="text-destructive text-sm mt-1">{errors.expertise}</p>
            )}
            {formData.expertise && formData.expertise.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {formData.expertise.map((exp, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                  >
                    {exp}
                    <button
                      type="button"
                      onClick={() => removeExpertise(index)}
                      className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Contact & Media */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card rounded-xl border border-border p-6 space-y-6"
          >
            <h2 className="text-xl font-semibold text-foreground">Contact Information</h2>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.email ? 'border-destructive' : 'border-input'
                } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                placeholder="john@lightfield.com"
              />
              {errors.email && <p className="text-destructive text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-foreground mb-2">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                placeholder="+1 (555) 123-4567"
              />
            </div>

            {/* LinkedIn */}
            <div>
              <label htmlFor="linkedin_url" className="block text-sm font-medium text-foreground mb-2">
                LinkedIn URL
              </label>
              <input
                id="linkedin_url"
                type="url"
                value={formData.linkedin_url}
                onChange={(e) => setFormData({ ...formData, linkedin_url: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.linkedin_url ? 'border-destructive' : 'border-input'
                } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                placeholder="https://linkedin.com/in/johndoe"
              />
              {errors.linkedin_url && (
                <p className="text-destructive text-sm mt-1">{errors.linkedin_url}</p>
              )}
            </div>

            {/* Twitter */}
            <div>
              <label htmlFor="twitter_url" className="block text-sm font-medium text-foreground mb-2">
                Twitter/X URL
              </label>
              <input
                id="twitter_url"
                type="url"
                value={formData.twitter_url}
                onChange={(e) => setFormData({ ...formData, twitter_url: e.target.value })}
                className={`w-full px-4 py-3 rounded-lg border ${
                  errors.twitter_url ? 'border-destructive' : 'border-input'
                } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                placeholder="https://twitter.com/johndoe"
              />
              {errors.twitter_url && (
                <p className="text-destructive text-sm mt-1">{errors.twitter_url}</p>
              )}
            </div>
          </motion.div>

          {/* Image & Settings */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Profile Image */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Profile Image</h2>
              <div>
                <input
                  type="text"
                  value={formData.image_url}
                  onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                  placeholder="Enter Cloudinary image URL..."
                />
                {formData.image_url && (
                  <div className="mt-4 relative rounded-lg overflow-hidden bg-secondary aspect-square">
                    <img
                      src={formData.image_url}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Settings */}
            <div className="bg-card rounded-xl border border-border p-6 space-y-4">
              <h2 className="text-xl font-semibold text-foreground">Settings</h2>

              {/* Active Status */}
              <label className="flex items-center justify-between gap-3 p-3 rounded-lg hover:bg-accent cursor-pointer transition-colors">
                <span className="text-sm font-medium text-foreground">Active (Show on website)</span>
                <input
                  type="checkbox"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="w-4 h-4 rounded border-input text-primary focus:ring-2 focus:ring-ring"
                />
              </label>

              {/* Order Priority */}
              <div>
                <label htmlFor="order_priority" className="block text-sm font-medium text-foreground mb-2">
                  Display Order Priority
                </label>
                <input
                  id="order_priority"
                  type="number"
                  min="0"
                  value={formData.order_priority}
                  onChange={(e) =>
                    setFormData({ ...formData, order_priority: parseInt(e.target.value) || 0 })
                  }
                  className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Higher numbers appear first
                </p>
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
            disabled={createMutation.isPending}
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-5 h-5" />
                Create Associate
              </>
            )}
          </button>
        </motion.div>
      </form>
    </div>
  );
}
