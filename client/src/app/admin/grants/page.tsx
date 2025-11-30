'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useGrants,
  useGrant,
  useDeleteGrant,
  useCreateGrant,
  useUpdateGrant,
  useReorderGrants,
} from '@/hooks/useGrants';
import { getGrant } from '@/lib/handlers/grantsHandlers';
import { GrantListItem, Grant, GrantFormData, GrantType, GrantStatus } from '@/types';
import ImageUpload from '@/components/ImageUpload';
import {
  Award,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Calendar,
  DollarSign,
  Target,
  Save,
  X,
  Sparkles,
  GripVertical,
  Check,
  ChevronDown,
  Clock,
  Users,
  ExternalLink,
  Mail,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

type ModalMode = 'create' | 'edit' | null;

const GRANT_TYPES: { value: GrantType; label: string }[] = [
  { value: 'scholarship', label: 'Scholarship' },
  { value: 'grant', label: 'Grant' },
  { value: 'award', label: 'Award' },
  { value: 'fellowship', label: 'Fellowship' },
];

const GRANT_STATUSES: { value: GrantStatus; label: string }[] = [
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'open', label: 'Open for Applications' },
  { value: 'closed', label: 'Closed' },
  { value: 'awarded', label: 'Awarded' },
];

export default function AdminGrantsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [grantToDelete, setGrantToDelete] = useState<GrantListItem | null>(null);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | GrantStatus>('all');
  const [localGrants, setLocalGrants] = useState<GrantListItem[]>([]);

  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Form Modal State
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingGrant, setEditingGrant] = useState<GrantListItem | null>(null);

  const { data: grants, isLoading } = useGrants({
    search: searchQuery || undefined,
  });

  const deleteMutation = useDeleteGrant();
  const createMutation = useCreateGrant();
  const updateMutation = useUpdateGrant();
  const reorderMutation = useReorderGrants();

  // Sync local grants with server data
  useEffect(() => {
    if (grants) {
      setLocalGrants(grants);
    }
  }, [grants]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form State
  const [formData, setFormData] = useState<Partial<GrantFormData>>({
    title: '',
    grant_type: 'grant',
    amount: undefined,
    currency: 'NGN',
    short_description: '',
    full_description: '',
    eligibility_criteria: [],
    how_to_apply: '',
    requirements: [],
    application_email: '',
    application_url: '',
    guidelines: [],
    image_url: '',
    banner_image_url: '',
    target_audience: '',
    target_institutions: [],
    application_deadline: '',
    announcement_date: '',
    status: 'upcoming',
    is_featured: false,
    is_active: true,
    order_priority: 0,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof GrantFormData, string>>>({});
  const [criteriaInput, setCriteriaInput] = useState('');
  const [requirementInput, setRequirementInput] = useState('');
  const [guidelineInput, setGuidelineInput] = useState('');
  const [institutionInput, setInstitutionInput] = useState('');

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalGrants((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Save to backend
        reorderMutation.mutate({
          items: newOrder.map((grant, index) => ({
            id: grant.id,
            order_priority: index,
          })),
        });

        return newOrder;
      });
    }
  };

  const openCreateModal = () => {
    setFormData({
      title: '',
      grant_type: 'grant',
      amount: undefined,
      currency: 'NGN',
      short_description: '',
      full_description: '',
      eligibility_criteria: [],
      how_to_apply: '',
      requirements: [],
      application_email: '',
      application_url: '',
      guidelines: [],
      image_url: '',
      banner_image_url: '',
      target_audience: '',
      target_institutions: [],
      application_deadline: '',
      announcement_date: '',
      status: 'upcoming',
      is_featured: false,
      is_active: true,
      order_priority: 0,
    });
    setErrors({});
    setModalMode('create');
  };

  const openEditModal = async (grant: GrantListItem) => {
    setEditingGrant(grant);
    setErrors({});
    setModalMode('edit');

    // Fetch full grant details for editing
    try {
      const fullGrant = await getGrant(grant.slug);
      setFormData({
        title: fullGrant.title,
        grant_type: fullGrant.grant_type,
        amount: fullGrant.amount || undefined,
        currency: fullGrant.currency,
        short_description: fullGrant.short_description || '',
        full_description: fullGrant.full_description || '',
        eligibility_criteria: fullGrant.eligibility_criteria || [],
        how_to_apply: fullGrant.how_to_apply || '',
        requirements: fullGrant.requirements || [],
        application_email: fullGrant.application_email || '',
        application_url: fullGrant.application_url || '',
        guidelines: fullGrant.guidelines || [],
        image_url: fullGrant.image_url || '',
        banner_image_url: fullGrant.banner_image_url || '',
        target_audience: fullGrant.target_audience || '',
        target_institutions: fullGrant.target_institutions || [],
        application_deadline: fullGrant.application_deadline || '',
        announcement_date: fullGrant.announcement_date || '',
        status: fullGrant.status,
        is_featured: fullGrant.is_featured,
        is_active: fullGrant.is_active,
        order_priority: fullGrant.order_priority,
      });
    } catch (error) {
      console.error('Error fetching grant details:', error);
      // Fallback to basic data from list item
      setFormData({
        title: grant.title,
        grant_type: grant.grant_type,
        amount: grant.amount || undefined,
        currency: grant.currency,
        short_description: grant.short_description || '',
        full_description: '',
        eligibility_criteria: [],
        how_to_apply: '',
        requirements: [],
        application_email: '',
        application_url: '',
        guidelines: [],
        image_url: grant.image_url || '',
        banner_image_url: '',
        target_audience: grant.target_audience || '',
        target_institutions: [],
        application_deadline: grant.application_deadline || '',
        announcement_date: '',
        status: grant.status,
        is_featured: grant.is_featured,
        is_active: grant.is_active,
        order_priority: grant.order_priority,
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingGrant(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Basic validation - only title is required
    const newErrors: Partial<Record<keyof GrantFormData, string>> = {};
    if (!formData.title?.trim()) newErrors.title = 'Title is required';
    // Validate amount only if provided
    if (formData.amount !== undefined && formData.amount !== null && formData.amount <= 0) {
      newErrors.amount = 'Amount must be greater than 0 if provided';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (modalMode === 'create') {
        await createMutation.mutateAsync(formData as GrantFormData);
      } else if (modalMode === 'edit' && editingGrant) {
        await updateMutation.mutateAsync({
          slug: editingGrant.slug,
          data: formData as GrantFormData,
        });
      }
      closeModal();
    } catch (error: any) {
      setErrors({ title: error.message || 'Failed to save grant' });
    }
  };

  const handleDelete = async () => {
    if (!grantToDelete) return;
    await deleteMutation.mutateAsync(grantToDelete.slug);
    setShowDeleteModal(false);
    setGrantToDelete(null);
  };

  const addListItem = (
    input: string,
    setInput: (v: string) => void,
    field: 'eligibility_criteria' | 'requirements' | 'guidelines' | 'target_institutions'
  ) => {
    if (input.trim()) {
      setFormData({
        ...formData,
        [field]: [...(formData[field] || []), input.trim()],
      });
      setInput('');
    }
  };

  const removeListItem = (
    index: number,
    field: 'eligibility_criteria' | 'requirements' | 'guidelines' | 'target_institutions'
  ) => {
    setFormData({
      ...formData,
      [field]: formData[field]?.filter((_, i) => i !== index) || [],
    });
  };

  // Filter grants by status
  const filteredGrants = (searchQuery || statusFilter !== 'all' ? grants : localGrants)?.filter(
    (grant) => {
      if (statusFilter === 'all') return true;
      return grant.status === statusFilter;
    }
  );

  const isDraggable = !searchQuery && statusFilter === 'all';

  const getStatusColor = (status: GrantStatus) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 ring-green-500/20';
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20';
      case 'closed':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 ring-gray-500/20';
      case 'awarded':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20';
      default:
        return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 border border-primary/10">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold">Grants & Scholarships</h1>
            </div>
            <p className="text-muted-foreground text-base">
              Manage grants, scholarships, and awards programs
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-2xl transition-all font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Add Grant</span>
          </button>
        </div>
      </div>

      {/* Filters Section */}
      <div className="bg-card rounded-2xl border border-primary/10 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search Bar */}
          <div className="flex-1 relative group">
            <div className="relative flex items-center">
              <Search className="absolute left-4 w-5 h-5 text-muted-foreground transition-colors group-hover:text-primary" />
              <input
                type="text"
                placeholder="Search by title, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 border-0 rounded-2xl text-foreground placeholder:text-muted-foreground transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 p-1.5 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </div>

          {/* Status Filter */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="group relative inline-flex items-center gap-3 px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 hover:shadow-md"
            >
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium capitalize">
                {statusFilter === 'all' ? 'All Status' : statusFilter}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  showStatusFilter ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {showStatusFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-20"
                >
                  <div className="p-2">
                    <button
                      onClick={() => {
                        setStatusFilter('all');
                        setShowStatusFilter(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                        statusFilter === 'all'
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-medium">All Status</span>
                      </div>
                      {statusFilter === 'all' && <Check className="w-4 h-4" />}
                    </button>
                    {GRANT_STATUSES.map((status) => (
                      <button
                        key={status.value}
                        onClick={() => {
                          setStatusFilter(status.value);
                          setShowStatusFilter(false);
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                          statusFilter === status.value
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-accent text-foreground'
                        }`}
                      >
                        <span className="font-medium">{status.label}</span>
                        {statusFilter === status.value && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Drag Info Banner */}
      {isDraggable && !isLoading && filteredGrants && filteredGrants.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 bg-secondary/10 border border-primary/10 rounded-2xl"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Drag to Reorder</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drag grants to change their display priority. Changes are saved automatically.
            </p>
          </div>
        </motion.div>
      )}

      {/* Grants List */}
      <div className="relative overflow-hidden bg-card border border-border/10 rounded-3xl shadow-xl">
        <div className="relative z-10">
          {/* Table Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Award className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">All Grants</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredGrants?.length || 0} grant{filteredGrants?.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-4 text-muted-foreground font-medium">Loading grants...</p>
            </div>
          ) : filteredGrants && filteredGrants.length > 0 ? (
            <div className="p-6">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={filteredGrants.map((g) => g.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {filteredGrants.map((grant) => (
                      <GrantCard
                        key={grant.id}
                        grant={grant}
                        isDraggable={isDraggable}
                        getStatusColor={getStatusColor}
                        onEdit={() => openEditModal(grant)}
                        onView={() => router.push(`/grants/${grant.slug}`)}
                        onDelete={() => {
                          setGrantToDelete(grant);
                          setShowDeleteModal(true);
                        }}
                      />
                    ))}
                  </div>
                </SortableContext>
              </DndContext>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-primary/5 rounded-3xl mb-6 ring-1 ring-primary/10">
                <Award className="w-20 h-20 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {searchQuery || statusFilter !== 'all'
                  ? 'No grants match your filters'
                  : 'No grants yet'}
              </h3>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Get started by creating your first grant or scholarship'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <button
                  onClick={openCreateModal}
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-2xl transition-all font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                >
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  <span>Create Your First Grant</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {modalMode && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-md"
              onClick={closeModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', duration: 0.5 }}
              className="relative bg-gradient-to-br from-card to-card/95 backdrop-blur-xl rounded-3xl border border-border/50 shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden my-8"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between p-6 border-b border-border bg-card sticky top-0 z-10">
                <div>
                  <h2 className="text-2xl font-bold text-foreground">
                    {modalMode === 'create' ? 'Create New Grant' : 'Edit Grant'}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {modalMode === 'create'
                      ? 'Add a new grant, scholarship, or award program'
                      : 'Update grant information'}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Modal Body (Scrollable) */}
              <form onSubmit={handleSubmit} className="overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="p-6 space-y-6">
                  {/* Title & Type */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="title" className="block text-sm font-medium text-foreground mb-2">
                        Title <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="title"
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.title ? 'border-destructive' : 'border-input'
                        } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                        placeholder="e.g., Most Outstanding Student Judge Award"
                      />
                      {errors.title && <p className="text-destructive text-sm mt-1">{errors.title}</p>}
                    </div>

                    <div>
                      <label htmlFor="grant_type" className="block text-sm font-medium text-foreground mb-2">
                        Type <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="grant_type"
                        value={formData.grant_type}
                        onChange={(e) => setFormData({ ...formData, grant_type: e.target.value as GrantType })}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                      >
                        {GRANT_TYPES.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Amount & Currency */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                      <label htmlFor="amount" className="block text-sm font-medium text-foreground mb-2">
                        Amount <span className="text-muted-foreground text-xs">(optional)</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="amount"
                          type="number"
                          value={formData.amount ?? ''}
                          onChange={(e) => setFormData({ ...formData, amount: e.target.value ? parseFloat(e.target.value) : undefined })}
                          className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                            errors.amount ? 'border-destructive' : 'border-input'
                          } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                          placeholder="250000 (leave empty if not applicable)"
                        />
                      </div>
                      {errors.amount && <p className="text-destructive text-sm mt-1">{errors.amount}</p>}
                    </div>

                    <div>
                      <label htmlFor="currency" className="block text-sm font-medium text-foreground mb-2">
                        Currency
                      </label>
                      <select
                        id="currency"
                        value={formData.currency}
                        onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                      >
                        <option value="NGN">NGN (₦)</option>
                        <option value="USD">USD ($)</option>
                        <option value="GBP">GBP (£)</option>
                        <option value="EUR">EUR (€)</option>
                      </select>
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label htmlFor="short_description" className="block text-sm font-medium text-foreground mb-2">
                      Short Description
                    </label>
                    <textarea
                      id="short_description"
                      value={formData.short_description}
                      onChange={(e) => setFormData({ ...formData, short_description: e.target.value })}
                      rows={2}
                      maxLength={300}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.short_description ? 'border-destructive' : 'border-input'
                      } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition resize-none`}
                      placeholder="Brief description for listing cards (max 300 characters)"
                    />
                    {errors.short_description && (
                      <p className="text-destructive text-sm mt-1">{errors.short_description}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.short_description?.length || 0}/300 characters
                    </p>
                  </div>

                  {/* Full Description */}
                  <div>
                    <label htmlFor="full_description" className="block text-sm font-medium text-foreground mb-2">
                      Full Description
                    </label>
                    <textarea
                      id="full_description"
                      value={formData.full_description}
                      onChange={(e) => setFormData({ ...formData, full_description: e.target.value })}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.full_description ? 'border-destructive' : 'border-input'
                      } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition resize-none`}
                      placeholder="Detailed description of the grant, its purpose, and impact..."
                    />
                    {errors.full_description && (
                      <p className="text-destructive text-sm mt-1">{errors.full_description}</p>
                    )}
                  </div>

                  {/* Target Audience */}
                  <div>
                    <label htmlFor="target_audience" className="block text-sm font-medium text-foreground mb-2">
                      Target Audience
                    </label>
                    <input
                      id="target_audience"
                      type="text"
                      value={formData.target_audience}
                      onChange={(e) => setFormData({ ...formData, target_audience: e.target.value })}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.target_audience ? 'border-destructive' : 'border-input'
                      } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                      placeholder="e.g., Law Students, Student Judges"
                    />
                    {errors.target_audience && (
                      <p className="text-destructive text-sm mt-1">{errors.target_audience}</p>
                    )}
                  </div>

                  {/* Target Institutions */}
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">
                      Eligible Institutions
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={institutionInput}
                        onChange={(e) => setInstitutionInput(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            addListItem(institutionInput, setInstitutionInput, 'target_institutions');
                          }
                        }}
                        className="flex-1 px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                        placeholder="e.g., University of Lagos"
                      />
                      <button
                        type="button"
                        onClick={() => addListItem(institutionInput, setInstitutionInput, 'target_institutions')}
                        className="px-4 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    {formData.target_institutions && formData.target_institutions.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {formData.target_institutions.map((inst, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                          >
                            {inst}
                            <button
                              type="button"
                              onClick={() => removeListItem(index, 'target_institutions')}
                              className="hover:bg-primary/20 rounded-full p-0.5 transition-colors"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* How to Apply */}
                  <div>
                    <label htmlFor="how_to_apply" className="block text-sm font-medium text-foreground mb-2">
                      How to Apply
                    </label>
                    <textarea
                      id="how_to_apply"
                      value={formData.how_to_apply}
                      onChange={(e) => setFormData({ ...formData, how_to_apply: e.target.value })}
                      rows={4}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.how_to_apply ? 'border-destructive' : 'border-input'
                      } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition resize-none`}
                      placeholder="Step-by-step application instructions..."
                    />
                    {errors.how_to_apply && (
                      <p className="text-destructive text-sm mt-1">{errors.how_to_apply}</p>
                    )}
                  </div>

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="application_email" className="block text-sm font-medium text-foreground mb-2">
                        Application Email
                      </label>
                      <input
                        id="application_email"
                        type="email"
                        value={formData.application_email || ''}
                        onChange={(e) => setFormData({ ...formData, application_email: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                        placeholder="grants@lightfield.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="application_url" className="block text-sm font-medium text-foreground mb-2">
                        Application URL
                      </label>
                      <input
                        id="application_url"
                        type="url"
                        value={formData.application_url || ''}
                        onChange={(e) => setFormData({ ...formData, application_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                        placeholder="https://..."
                      />
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="application_deadline" className="block text-sm font-medium text-foreground mb-2">
                        Application Deadline
                      </label>
                      <input
                        id="application_deadline"
                        type="date"
                        value={formData.application_deadline || ''}
                        onChange={(e) => setFormData({ ...formData, application_deadline: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                      />
                    </div>

                    <div>
                      <label htmlFor="announcement_date" className="block text-sm font-medium text-foreground mb-2">
                        Announcement Date
                      </label>
                      <input
                        id="announcement_date"
                        type="date"
                        value={formData.announcement_date || ''}
                        onChange={(e) => setFormData({ ...formData, announcement_date: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                      />
                    </div>
                  </div>

                  {/* Images & Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <ImageUpload
                        value={formData.image_url || ''}
                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                        folder="grants"
                        label="Grant Image"
                        aspectRatio="square"
                      />
                    </div>

                    <div className="space-y-4">
                      {/* Status */}
                      <div>
                        <label htmlFor="status" className="block text-sm font-medium text-foreground mb-2">
                          Status
                        </label>
                        <select
                          id="status"
                          value={formData.status}
                          onChange={(e) => setFormData({ ...formData, status: e.target.value as GrantStatus })}
                          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                        >
                          {GRANT_STATUSES.map((status) => (
                            <option key={status.value} value={status.value}>
                              {status.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Featured Toggle */}
                      <div className="p-4 rounded-lg border border-border">
                        <label className="flex items-center justify-between gap-3 cursor-pointer">
                          <div>
                            <span className="text-sm font-medium text-foreground block">Featured</span>
                            <span className="text-xs text-muted-foreground">Show on homepage</span>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={formData.is_featured}
                              onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                              className="peer sr-only"
                            />
                            <div className="w-11 h-6 bg-input rounded-full peer-checked:bg-primary transition-colors"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                          </div>
                        </label>
                      </div>

                      {/* Active Toggle */}
                      <div className="p-4 rounded-lg border border-border">
                        <label className="flex items-center justify-between gap-3 cursor-pointer">
                          <div>
                            <span className="text-sm font-medium text-foreground block">Active</span>
                            <span className="text-xs text-muted-foreground">Show on website</span>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={formData.is_active}
                              onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                              className="peer sr-only"
                            />
                            <div className="w-11 h-6 bg-input rounded-full peer-checked:bg-primary transition-colors"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                          </div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Modal Footer */}
                <div className="flex items-center justify-end gap-4 p-6 border-t border-border bg-card sticky bottom-0">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="px-6 py-3 bg-accent hover:bg-accent/80 text-foreground rounded-xl transition-all font-medium hover:scale-105"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/25 hover:scale-105 hover:shadow-xl hover:shadow-primary/30"
                  >
                    {(createMutation.isPending || updateMutation.isPending) ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {modalMode === 'create' ? 'Create Grant' : 'Update Grant'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/60 backdrop-blur-md"
              onClick={() => setShowDeleteModal(false)}
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
                  <h3 className="text-2xl font-bold text-foreground mb-2">Delete Grant</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-foreground">{grantToDelete?.title}</span>?
                    This action cannot be undone.
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowDeleteModal(false)}
                      disabled={deleteMutation.isPending}
                      className="flex-1 px-5 py-3 bg-accent hover:bg-accent/80 text-foreground rounded-xl transition-all font-medium disabled:opacity-50 hover:scale-105"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={deleteMutation.isPending}
                      className="flex-1 px-5 py-3 bg-gradient-to-r from-destructive to-destructive/90 hover:from-destructive/90 hover:to-destructive text-destructive-foreground rounded-xl transition-all font-medium disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-destructive/25 hover:scale-105"
                    >
                      {deleteMutation.isPending ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Deleting...
                        </>
                      ) : (
                        <>
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Grant Card Component
interface GrantCardProps {
  grant: GrantListItem;
  isDraggable: boolean;
  getStatusColor: (status: GrantStatus) => string;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

function GrantCard({ grant, isDraggable, getStatusColor, onEdit, onView, onDelete }: GrantCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: grant.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="group relative overflow-hidden bg-card border border-border/50 rounded-2xl shadow-sm hover:shadow-lg transition-all duration-200 p-5"
    >
      <div className="flex items-center gap-4">
        {/* Drag Handle */}
        {isDraggable && (
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-2 hover:bg-accent/50 rounded-lg transition-colors"
          >
            <GripVertical className="w-5 h-5 text-muted-foreground" />
          </button>
        )}

        {/* Image */}
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-border/50">
          {grant.image_url ? (
            <img
              src={grant.image_url}
              alt={grant.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Award className="w-8 h-8 text-primary/30" />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {grant.title}
            </h3>
            <span className="text-xs px-2 py-0.5 bg-secondary/50 text-secondary-foreground rounded-lg capitalize">
              {grant.grant_type}
            </span>
          </div>
          {grant.formatted_amount && (
            <p className="text-2xl font-bold text-primary mb-1">{grant.formatted_amount}</p>
          )}
          <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            {grant.target_audience && (
              <span className="flex items-center gap-1">
                <Target className="w-3.5 h-3.5" />
                {grant.target_audience}
              </span>
            )}
            {grant.application_deadline && (
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                Deadline: {new Date(grant.application_deadline).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold ring-1 ${getStatusColor(grant.status)}`}>
            {grant.status === 'open' && <Clock className="w-3 h-3" />}
            <span className="capitalize">{grant.status}</span>
          </span>
          {grant.is_featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-semibold ring-1 ring-amber-500/20">
              <Sparkles className="w-3 h-3" />
              Featured
            </span>
          )}
          {!grant.is_active && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-muted text-muted-foreground rounded-xl text-xs font-semibold">
              <EyeOff className="w-3 h-3" />
              Inactive
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 flex-shrink-0">
          <button
            onClick={onEdit}
            className="px-3 py-2 bg-accent hover:bg-accent/80 text-foreground font-semibold rounded-xl text-sm transition-colors flex items-center gap-2"
          >
            <Edit className="w-3.5 h-3.5" />
            Edit
          </button>
          <button
            onClick={onView}
            className="p-2 bg-primary/10 text-primary font-semibold rounded-xl hover:bg-primary/20 transition-colors"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="p-2 bg-red-500/10 text-red-600 font-semibold rounded-xl hover:bg-red-500/20 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
