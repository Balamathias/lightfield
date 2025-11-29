'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  useAssociates,
  useDeleteAssociate,
  useCreateAssociate,
  useUpdateAssociate,
  useReorderAssociates,
} from '@/hooks/useAssociates';
import { AssociateListItem } from '@/types';
import { associateSchema, type AssociateFormValues } from '@/schemas';
import CroppableImageUpload from '@/components/CroppableImageUpload';
import {
  Users,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Loader2,
  Mail,
  Phone,
  Linkedin,
  Twitter,
  Briefcase,
  Save,
  X,
  Sparkles,
  GripVertical,
  Check,
  Filter,
  ChevronDown,
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type ModalMode = 'create' | 'edit' | null;

export default function AdminAssociatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [associateToDelete, setAssociateToDelete] = useState<AssociateListItem | null>(null);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [localAssociates, setLocalAssociates] = useState<AssociateListItem[]>([]);

  const statusDropdownRef = useRef<HTMLDivElement>(null);

  // Form Modal State
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingAssociate, setEditingAssociate] = useState<AssociateListItem | null>(null);

  const { data: associates, isLoading } = useAssociates({
    search: searchQuery || undefined,
  });

  const deleteMutation = useDeleteAssociate();
  const createMutation = useCreateAssociate();
  const updateMutation = useUpdateAssociate();
  const reorderMutation = useReorderAssociates();

  // Sync local associates with server data
  useEffect(() => {
    if (associates) {
      setLocalAssociates(associates);
    }
  }, [associates]);

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

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalAssociates((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Save to backend
        reorderMutation.mutate({
          items: newOrder.map((associate, index) => ({
            id: associate.id,
            order_priority: index,
          })),
        });

        return newOrder;
      });
    }
  };

  const openCreateModal = () => {
    setFormData({
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
    setErrors({});
    setModalMode('create');
  };

  const openEditModal = (associate: AssociateListItem) => {
    setEditingAssociate(associate);
    setFormData({
      name: associate.name,
      title: associate.title,
      bio: associate.bio,
      expertise: associate.expertise || [],
      image_url: associate.image_url || '',
      email: associate.email || '',
      phone: associate.phone || '',
      linkedin_url: associate.linkedin_url || '',
      twitter_url: associate.twitter_url || '',
      order_priority: associate.order_priority,
      is_active: associate.is_active,
    });
    setErrors({});
    setModalMode('edit');
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingAssociate(null);
  };

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
      if (modalMode === 'create') {
        await createMutation.mutateAsync(formData as any);
      } else if (modalMode === 'edit' && editingAssociate) {
        await updateMutation.mutateAsync({
          slug: editingAssociate.slug,
          data: formData as any,
        });
      }
      closeModal();
    } catch (error: any) {
      setErrors({ name: error.message || 'Failed to save associate' });
    }
  };

  const handleDelete = async () => {
    if (!associateToDelete) return;
    await deleteMutation.mutateAsync(associateToDelete.slug);
    setShowDeleteModal(false);
    setAssociateToDelete(null);
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

  // Filter associates by status
  const filteredAssociates = (searchQuery || statusFilter !== 'all' ? associates : localAssociates)?.filter(
    (associate) => {
      if (statusFilter === 'active') return associate.is_active;
      if (statusFilter === 'inactive') return !associate.is_active;
      return true;
    }
  );

  const isDraggable = !searchQuery && statusFilter === 'all';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 border border-primary/10">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold">Associates</h1>
            </div>
            <p className="text-muted-foreground text-base">
              Manage your law firm team members
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-2xl transition-all font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Add Associate</span>
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
                placeholder="Search by name, title, expertise..."
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
              {statusFilter === 'active' ? (
                <Eye className="w-5 h-5 text-green-500" />
              ) : statusFilter === 'inactive' ? (
                <EyeOff className="w-5 h-5 text-muted-foreground" />
              ) : (
                <Sparkles className="w-5 h-5 text-primary" />
              )}
              <span className="text-foreground font-medium capitalize">{statusFilter}</span>
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
                  className="absolute right-0 mt-2 w-48 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-20"
                >
                  <div className="p-2">
                    {(['all', 'active', 'inactive'] as const).map((status) => (
                      <button
                        key={status}
                        onClick={() => {
                          setStatusFilter(status);
                          setShowStatusFilter(false);
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                          statusFilter === status
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-accent text-foreground'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          {status === 'active' && <Eye className="w-4 h-4" />}
                          {status === 'inactive' && <EyeOff className="w-4 h-4" />}
                          {status === 'all' && <Sparkles className="w-4 h-4" />}
                          <span className="font-medium capitalize">{status}</span>
                        </div>
                        {statusFilter === status && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || statusFilter !== 'all') && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50"
          >
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {searchQuery && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-medium">
                Search: {searchQuery}
                <button onClick={() => setSearchQuery('')} className="hover:text-primary/80">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {statusFilter !== 'all' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-medium">
                {statusFilter}
                <button onClick={() => setStatusFilter('all')} className="hover:text-primary/80">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* Drag Info Banner */}
      {isDraggable && !isLoading && filteredAssociates && filteredAssociates.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 bg-secondary/10 border border-primary/10 rounded-2xl"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Drag to Reorder</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drag associates to change their display priority. Changes are saved automatically.
            </p>
          </div>
        </motion.div>
      )}

      {/* Associates Table */}
      <div className="relative overflow-hidden bg-card border border-border/10 rounded-3xl shadow-xl">
        <div className="relative z-10">
          {/* Table Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">All Associates</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredAssociates?.length || 0} associate{filteredAssociates?.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
          </div>

          {/* Table Content */}
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-4 text-muted-foreground font-medium">Loading associates...</p>
            </div>
          ) : filteredAssociates && filteredAssociates.length > 0 ? (
            <>
              {/* Desktop View */}
              <div className="hidden lg:block p-6">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext
                    items={filteredAssociates.map((a) => a.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    <div className="space-y-2">
                      {filteredAssociates.map((associate) => (
                        <AssociateTableRow
                          key={associate.id}
                          associate={associate}
                          isDraggable={isDraggable}
                          onEdit={() => openEditModal(associate)}
                          onView={() => router.push(`/team/${associate.slug}`)}
                          onDelete={() => {
                            setAssociateToDelete(associate);
                            setShowDeleteModal(true);
                          }}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </DndContext>
              </div>

              {/* Mobile View with Table */}
              <div className="lg:hidden">
                <Table>
                  <TableHeader>
                    <TableRow className="hover:bg-transparent border-border/50">
                      {isDraggable && (
                        <TableHead className="w-12 text-foreground font-semibold">
                          <GripVertical className="w-4 h-4 text-muted-foreground" />
                        </TableHead>
                      )}
                      <TableHead className="text-foreground font-semibold">Associate</TableHead>
                      <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
                      <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext
                        items={filteredAssociates.map((a) => a.id)}
                        strategy={verticalListSortingStrategy}
                      >
                        {filteredAssociates.map((associate) => (
                          <AssociateMobileRow
                            key={associate.id}
                            associate={associate}
                            isDraggable={isDraggable}
                            onEdit={() => openEditModal(associate)}
                            onView={() => router.push(`/team/${associate.slug}`)}
                            onDelete={() => {
                              setAssociateToDelete(associate);
                              setShowDeleteModal(true);
                            }}
                          />
                        ))}
                      </SortableContext>
                    </DndContext>
                  </TableBody>
                </Table>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="p-6 bg-primary/5 rounded-3xl mb-6 ring-1 ring-primary/10">
                <Users className="w-20 h-20 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {searchQuery || statusFilter !== 'all'
                  ? 'No associates match your filters'
                  : 'No associates yet'}
              </h3>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                {searchQuery || statusFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Get started by adding your first team member'}
              </p>
              {!searchQuery && statusFilter === 'all' && (
                <button
                  onClick={openCreateModal}
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-2xl transition-all font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                >
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  <span>Add Your First Associate</span>
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
                    {modalMode === 'create' ? 'Add New Associate' : 'Edit Associate'}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {modalMode === 'create'
                      ? 'Add a new team member to your firm'
                      : 'Update team member information'}
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
                  {/* Name & Title */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      rows={5}
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

                  {/* Contact Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                  </div>

                  {/* Image & Settings */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <CroppableImageUpload
                        value={formData.image_url || ''}
                        onChange={(url) => setFormData({ ...formData, image_url: url })}
                        folder="associates"
                        label="Profile Image"
                        aspectRatio={1}
                      />
                    </div>

                    <div className="space-y-4">
                      {/* Active Toggle */}
                      <div className="p-4 rounded-lg border border-border">
                        <label className="flex items-center justify-between gap-3 cursor-pointer">
                          <div>
                            <span className="text-sm font-medium text-foreground block">
                              Active Status
                            </span>
                            <span className="text-xs text-muted-foreground">
                              Show on public website
                            </span>
                          </div>
                          <div className="relative">
                            <input
                              type="checkbox"
                              checked={formData.is_active}
                              onChange={(e) =>
                                setFormData({ ...formData, is_active: e.target.checked })
                              }
                              className="peer sr-only"
                            />
                            <div className="w-11 h-6 bg-input rounded-full peer-checked:bg-primary transition-colors"></div>
                            <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm"></div>
                          </div>
                        </label>
                      </div>

                      {/* Order Priority */}
                      <div>
                        <label
                          htmlFor="order_priority"
                          className="block text-sm font-medium text-foreground mb-2"
                        >
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
                        {modalMode === 'create' ? 'Create Associate' : 'Update Associate'}
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
                  <h3 className="text-2xl font-bold text-foreground mb-2">Delete Associate</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-foreground">{associateToDelete?.name}</span>?
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

// Mobile Associate Row Component
interface AssociateMobileRowProps {
  associate: AssociateListItem;
  isDraggable: boolean;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

function AssociateMobileRow({ associate, isDraggable, onEdit, onView, onDelete }: AssociateMobileRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: associate.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <TableRow
      ref={setNodeRef}
      style={style}
      className="hover:bg-muted/50 border-border/50"
    >
      {isDraggable && (
        <TableCell className="w-12">
          <button
            {...attributes}
            {...listeners}
            className="cursor-grab active:cursor-grabbing p-1"
          >
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </button>
        </TableCell>
      )}

      <TableCell>
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            {associate.image_url ? (
              <img
                src={associate.image_url}
                alt={associate.name}
                className="w-10 h-10 rounded-lg object-cover"
              />
            ) : (
              <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center">
                <Users className="w-5 h-5 text-primary/30" />
              </div>
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{associate.name}</h3>
              <p className="text-xs text-muted-foreground truncate flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {associate.title}
              </p>
            </div>
          </div>
          {associate.expertise && associate.expertise.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {associate.expertise.slice(0, 2).map((exp, idx) => (
                <span
                  key={idx}
                  className="text-xs px-1.5 py-0.5 bg-secondary/50 text-secondary-foreground rounded"
                >
                  {exp}
                </span>
              ))}
              {associate.expertise.length > 2 && (
                <span className="text-xs text-muted-foreground">
                  +{associate.expertise.length - 2}
                </span>
              )}
            </div>
          )}
        </div>
      </TableCell>

      <TableCell className="text-center">
        {associate.is_active ? (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-xs font-semibold">
            <Eye className="w-3 h-3" />
            <span className="hidden sm:inline">Active</span>
          </span>
        ) : (
          <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-lg text-xs font-semibold">
            <EyeOff className="w-3 h-3" />
            <span className="hidden sm:inline">Inactive</span>
          </span>
        )}
      </TableCell>

      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={onEdit}
            className="p-1.5 hover:bg-accent rounded-lg transition-colors"
            aria-label="Edit"
          >
            <Edit className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onView}
            className="p-1.5 hover:bg-accent rounded-lg transition-colors"
            aria-label="View"
          >
            <Eye className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 hover:bg-destructive/10 text-destructive rounded-lg transition-colors"
            aria-label="Delete"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

// Desktop Associate Table Row Component
interface AssociateTableRowProps {
  associate: AssociateListItem;
  isDraggable: boolean;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
}

function AssociateTableRow({ associate, isDraggable, onEdit, onView, onDelete }: AssociateTableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: associate.id,
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

        {/* Profile Image */}
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-border/50">
          {associate.image_url ? (
            <img
              src={associate.image_url}
              alt={associate.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Users className="w-8 h-8 text-primary/30" />
            </div>
          )}
        </div>

        {/* Associate Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {associate.name}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2 flex items-center gap-2">
            <Briefcase className="w-3.5 h-3.5" />
            {associate.title}
          </p>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            {associate.expertise && associate.expertise.length > 0 && (
              <>
                {associate.expertise.slice(0, 2).map((exp, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-1 bg-secondary/50 text-secondary-foreground rounded-lg"
                  >
                    {exp}
                  </span>
                ))}
                {associate.expertise.length > 2 && (
                  <span className="px-2 py-1 bg-accent text-accent-foreground rounded-lg">
                    +{associate.expertise.length - 2}
                  </span>
                )}
              </>
            )}
          </div>
        </div>

        {/* Contact Info */}
        <div className="hidden lg:flex flex-col gap-1.5 text-xs text-muted-foreground min-w-[200px]">
          {associate.email && (
            <div className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5" />
              <span className="truncate">{associate.email}</span>
            </div>
          )}
          {associate.phone && (
            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5" />
              <span>{associate.phone}</span>
            </div>
          )}
          {(associate.linkedin_url || associate.twitter_url) && (
            <div className="flex items-center gap-2">
              {associate.linkedin_url && <Linkedin className="w-3.5 h-3.5" />}
              {associate.twitter_url && <Twitter className="w-3.5 h-3.5" />}
              <span>Social profiles</span>
            </div>
          )}
        </div>

        {/* Status Badge */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {associate.is_active ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl text-xs font-semibold ring-1 ring-green-500/20">
              <Eye className="w-3 h-3" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-xl text-xs font-semibold">
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
