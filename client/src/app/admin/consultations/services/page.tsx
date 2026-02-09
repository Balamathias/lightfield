'use client';

import { useState, useRef, useEffect } from 'react';
import {
  useConsultationServices,
  useCreateConsultationService,
  useUpdateConsultationService,
  useDeleteConsultationService,
  useReorderConsultationServices,
} from '@/hooks/useConsultations';
import { getConsultationService } from '@/lib/handlers/consultationHandlers';
import type {
  ConsultationServiceListItem,
  ConsultationServiceFormData,
  ConsultationCategory,
} from '@/types';
import {
  Briefcase,
  Plus,
  Search,
  X,
  GripVertical,
  Edit,
  Trash2,
  Check,
  ChevronDown,
  Sparkles,
  Scale,
  Shield,
  Brain,
  FileCode,
  Fingerprint,
  Building2,
  HelpCircle,
  Gavel,
  Lock,
  Globe,
  Cpu,
  Landmark,
  Clock,
  DollarSign,
  Star,
  ToggleLeft,
  ToggleRight,
  Loader2,
  Save,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
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

const CATEGORY_OPTIONS: { value: ConsultationCategory; label: string }[] = [
  { value: 'ai_law', label: 'AI Law & Regulation' },
  { value: 'blockchain', label: 'Blockchain & Crypto' },
  { value: 'data_privacy', label: 'Data Privacy' },
  { value: 'tech_contracts', label: 'Tech Contracts' },
  { value: 'ip', label: 'Intellectual Property' },
  { value: 'corporate', label: 'Corporate Law' },
  { value: 'other', label: 'Other' },
];

const CATEGORY_LABELS: Record<ConsultationCategory, string> = {
  ai_law: 'AI Law & Regulation',
  blockchain: 'Blockchain & Crypto',
  data_privacy: 'Data Privacy',
  tech_contracts: 'Tech Contracts',
  ip: 'Intellectual Property',
  corporate: 'Corporate Law',
  other: 'Other',
};

const CATEGORY_COLORS: Record<ConsultationCategory, string> = {
  ai_law: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 ring-blue-500/20',
  blockchain: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 ring-purple-500/20',
  data_privacy: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 ring-emerald-500/20',
  tech_contracts: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 ring-amber-500/20',
  ip: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 ring-pink-500/20',
  corporate: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 ring-slate-500/20',
  other: 'bg-gray-500/10 text-gray-600 dark:text-gray-400 ring-gray-500/20',
};

const ICON_OPTIONS: { value: string; label: string; icon: React.ElementType }[] = [
  { value: 'Scale', label: 'Scale', icon: Scale },
  { value: 'Shield', label: 'Shield', icon: Shield },
  { value: 'Brain', label: 'Brain', icon: Brain },
  { value: 'FileCode', label: 'FileCode', icon: FileCode },
  { value: 'Fingerprint', label: 'Fingerprint', icon: Fingerprint },
  { value: 'Building2', label: 'Building2', icon: Building2 },
  { value: 'HelpCircle', label: 'HelpCircle', icon: HelpCircle },
  { value: 'Gavel', label: 'Gavel', icon: Gavel },
  { value: 'Lock', label: 'Lock', icon: Lock },
  { value: 'Globe', label: 'Globe', icon: Globe },
  { value: 'Cpu', label: 'Cpu', icon: Cpu },
  { value: 'Landmark', label: 'Landmark', icon: Landmark },
];

const ICON_MAP: Record<string, React.ElementType> = {
  Scale,
  Shield,
  Brain,
  FileCode,
  Fingerprint,
  Building2,
  HelpCircle,
  Gavel,
  Lock,
  Globe,
  Cpu,
  Landmark,
};

const CURRENCY_OPTIONS = [
  { value: 'NGN', label: 'NGN (₦)' },
  { value: 'USD', label: 'USD ($)' },
];

export default function AdminConsultationServicesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showCategoryFilter, setShowCategoryFilter] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<'all' | ConsultationCategory>('all');
  const [activeFilter, setActiveFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [localServices, setLocalServices] = useState<ConsultationServiceListItem[]>([]);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);

  // Form Modal State
  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [editingService, setEditingService] = useState<ConsultationServiceListItem | null>(null);

  // Delete Modal State
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<ConsultationServiceListItem | null>(null);

  const { data: services, isLoading } = useConsultationServices({
    ...(searchQuery ? { search: searchQuery } : {}),
  });

  const createMutation = useCreateConsultationService();
  const updateMutation = useUpdateConsultationService();
  const deleteMutation = useDeleteConsultationService();
  const reorderMutation = useReorderConsultationServices();

  // Sync local services with server data
  useEffect(() => {
    if (services) {
      setLocalServices(services);
    }
  }, [services]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Form State
  const [formData, setFormData] = useState<Partial<ConsultationServiceFormData>>({
    name: '',
    description: '',
    short_description: '',
    category: 'other',
    price: 0,
    currency: 'NGN',
    duration_minutes: 60,
    icon_name: '',
    image_url: '',
    order_priority: 0,
    is_active: true,
    is_featured: false,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof ConsultationServiceFormData, string>>>({});

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalServices((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        reorderMutation.mutate({
          items: newOrder.map((service, index) => ({
            id: service.id,
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
      description: '',
      short_description: '',
      category: 'other',
      price: 0,
      currency: 'NGN',
      duration_minutes: 60,
      icon_name: '',
      image_url: '',
      order_priority: 0,
      is_active: true,
      is_featured: false,
    });
    setErrors({});
    setModalMode('create');
  };

  const openEditModal = async (service: ConsultationServiceListItem) => {
    setEditingService(service);
    setErrors({});
    setModalMode('edit');

    try {
      const fullService = await getConsultationService(service.slug);
      setFormData({
        name: fullService.name,
        description: fullService.description || '',
        short_description: fullService.short_description || '',
        category: fullService.category,
        price: fullService.price,
        currency: fullService.currency,
        duration_minutes: fullService.duration_minutes,
        icon_name: fullService.icon_name || '',
        image_url: fullService.image_url || '',
        order_priority: fullService.order_priority,
        is_active: fullService.is_active,
        is_featured: fullService.is_featured,
      });
    } catch (error) {
      console.error('Error fetching service details:', error);
      setFormData({
        name: service.name,
        description: '',
        short_description: service.short_description || '',
        category: service.category,
        price: service.price,
        currency: service.currency,
        duration_minutes: service.duration_minutes,
        icon_name: service.icon_name || '',
        image_url: service.image_url || '',
        order_priority: service.order_priority,
        is_active: service.is_active,
        is_featured: service.is_featured,
      });
    }
  };

  const closeModal = () => {
    setModalMode(null);
    setEditingService(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const newErrors: Partial<Record<keyof ConsultationServiceFormData, string>> = {};
    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.description?.trim() || (formData.description?.trim().length ?? 0) < 20) {
      newErrors.description = 'Description must be at least 20 characters';
    }
    if (!formData.short_description?.trim() || (formData.short_description?.trim().length ?? 0) < 10) {
      newErrors.short_description = 'Short description must be at least 10 characters';
    }
    if (!formData.price || formData.price <= 0) newErrors.price = 'Price must be greater than 0';
    if (!formData.duration_minutes || formData.duration_minutes < 15) {
      newErrors.duration_minutes = 'Duration must be at least 15 minutes';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      if (modalMode === 'create') {
        await createMutation.mutateAsync(formData as ConsultationServiceFormData);
      } else if (modalMode === 'edit' && editingService) {
        await updateMutation.mutateAsync({
          slug: editingService.slug,
          data: formData as ConsultationServiceFormData,
        });
      }
      closeModal();
    } catch (error: any) {
      setErrors({ name: error.message || 'Failed to save service' });
    }
  };

  const handleDelete = async () => {
    if (!serviceToDelete) return;
    await deleteMutation.mutateAsync(serviceToDelete.slug);
    setShowDeleteModal(false);
    setServiceToDelete(null);
  };

  // Filter services
  const filteredServices = (searchQuery || categoryFilter !== 'all' || activeFilter !== 'all'
    ? services
    : localServices
  )?.filter((service) => {
    if (categoryFilter !== 'all' && service.category !== categoryFilter) return false;
    if (activeFilter === 'active' && !service.is_active) return false;
    if (activeFilter === 'inactive' && service.is_active) return false;
    return true;
  });

  const isDraggable = !searchQuery && categoryFilter === 'all' && activeFilter === 'all';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="relative overflow-hidden rounded-3xl p-6 border border-primary/10">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold">Consultation Services</h1>
            </div>
            <p className="text-muted-foreground text-base">
              Manage consultation service offerings, pricing, and availability
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-2xl transition-all font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Add Service</span>
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
                placeholder="Search by name, description..."
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

          {/* Category Filter */}
          <div className="relative" ref={categoryDropdownRef}>
            <button
              onClick={() => setShowCategoryFilter(!showCategoryFilter)}
              className="group relative inline-flex items-center gap-3 px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 hover:shadow-md"
            >
              <Briefcase className="w-5 h-5 text-primary" />
              <span className="text-foreground font-medium">
                {categoryFilter === 'all' ? 'All Categories' : CATEGORY_LABELS[categoryFilter]}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  showCategoryFilter ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {showCategoryFilter && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="absolute right-0 mt-2 w-64 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-20"
                >
                  <div className="p-2 max-h-80 overflow-y-auto">
                    <button
                      onClick={() => {
                        setCategoryFilter('all');
                        setShowCategoryFilter(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                        categoryFilter === 'all'
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Sparkles className="w-4 h-4" />
                        <span className="font-medium">All Categories</span>
                      </div>
                      {categoryFilter === 'all' && <Check className="w-4 h-4" />}
                    </button>
                    {CATEGORY_OPTIONS.map((cat) => (
                      <button
                        key={cat.value}
                        onClick={() => {
                          setCategoryFilter(cat.value);
                          setShowCategoryFilter(false);
                        }}
                        className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                          categoryFilter === cat.value
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-accent text-foreground'
                        }`}
                      >
                        <span className="font-medium">{cat.label}</span>
                        {categoryFilter === cat.value && <Check className="w-4 h-4" />}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Active/Inactive Toggle */}
          <div className="flex items-center gap-1 p-1 bg-accent/30 rounded-2xl border border-primary/10">
            {(['all', 'active', 'inactive'] as const).map((option) => (
              <button
                key={option}
                onClick={() => setActiveFilter(option)}
                className={`px-4 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  activeFilter === option
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                }`}
              >
                {option === 'all' ? 'All' : option === 'active' ? 'Active' : 'Inactive'}
              </button>
            ))}
          </div>
        </div>

        {/* Active Filters */}
        {(searchQuery || categoryFilter !== 'all' || activeFilter !== 'all') && (
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
            {categoryFilter !== 'all' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-medium">
                Category: {CATEGORY_LABELS[categoryFilter]}
                <button onClick={() => setCategoryFilter('all')} className="hover:text-primary/80">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
            {activeFilter !== 'all' && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-medium">
                Status: {activeFilter}
                <button onClick={() => setActiveFilter('all')} className="hover:text-primary/80">
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            )}
          </motion.div>
        )}
      </div>

      {/* Drag Info Banner */}
      {isDraggable && !isLoading && filteredServices && filteredServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 bg-secondary/10 border border-primary/10 rounded-2xl"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Drag to Reorder</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Drag services to change their display priority. Changes are saved automatically.
            </p>
          </div>
        </motion.div>
      )}

      {/* Services List */}
      <div className="relative overflow-hidden bg-card border border-border/10 rounded-3xl shadow-xl">
        <div className="relative z-10">
          {/* Table Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <Briefcase className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">All Services</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredServices?.length || 0} service{filteredServices?.length !== 1 ? 's' : ''}
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
              <p className="mt-4 text-muted-foreground font-medium">Loading services...</p>
            </div>
          ) : filteredServices && filteredServices.length > 0 ? (
            <div className="p-6">
              <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                <SortableContext
                  items={filteredServices.map((s) => s.id)}
                  strategy={verticalListSortingStrategy}
                >
                  <div className="space-y-3">
                    {filteredServices.map((service) => (
                      <ServiceCard
                        key={service.id}
                        service={service}
                        isDraggable={isDraggable}
                        onEdit={() => openEditModal(service)}
                        onDelete={() => {
                          setServiceToDelete(service);
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
                <Briefcase className="w-20 h-20 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {searchQuery || categoryFilter !== 'all' || activeFilter !== 'all'
                  ? 'No services match your filters'
                  : 'No services yet'}
              </h3>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                {searchQuery || categoryFilter !== 'all' || activeFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Get started by creating your first consultation service'}
              </p>
              {!searchQuery && categoryFilter === 'all' && activeFilter === 'all' && (
                <button
                  onClick={openCreateModal}
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-2xl transition-all font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                >
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  <span>Create Your First Service</span>
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
                    {modalMode === 'create' ? 'Create New Service' : 'Edit Service'}
                  </h2>
                  <p className="text-muted-foreground text-sm mt-1">
                    {modalMode === 'create'
                      ? 'Add a new consultation service offering'
                      : 'Update service information and settings'}
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
                  {/* Name & Category */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                        Service Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        id="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className={`w-full px-4 py-3 rounded-lg border ${
                          errors.name ? 'border-destructive' : 'border-input'
                        } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                        placeholder="e.g., AI Compliance Consultation"
                      />
                      {errors.name && <p className="text-destructive text-sm mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-foreground mb-2">
                        Category <span className="text-destructive">*</span>
                      </label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) =>
                          setFormData({ ...formData, category: e.target.value as ConsultationCategory })
                        }
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                      >
                        {CATEGORY_OPTIONS.map((cat) => (
                          <option key={cat.value} value={cat.value}>
                            {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* Price, Currency & Duration */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label htmlFor="price" className="block text-sm font-medium text-foreground mb-2">
                        Price <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="price"
                          type="number"
                          value={formData.price ?? ''}
                          onChange={(e) =>
                            setFormData({ ...formData, price: e.target.value ? parseFloat(e.target.value) : 0 })
                          }
                          className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                            errors.price ? 'border-destructive' : 'border-input'
                          } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                          placeholder="50000"
                        />
                      </div>
                      {errors.price && <p className="text-destructive text-sm mt-1">{errors.price}</p>}
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
                        {CURRENCY_OPTIONS.map((cur) => (
                          <option key={cur.value} value={cur.value}>
                            {cur.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label htmlFor="duration_minutes" className="block text-sm font-medium text-foreground mb-2">
                        Duration (minutes) <span className="text-destructive">*</span>
                      </label>
                      <div className="relative">
                        <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          id="duration_minutes"
                          type="number"
                          value={formData.duration_minutes ?? ''}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              duration_minutes: e.target.value ? parseInt(e.target.value) : 0,
                            })
                          }
                          className={`w-full pl-12 pr-4 py-3 rounded-lg border ${
                            errors.duration_minutes ? 'border-destructive' : 'border-input'
                          } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition`}
                          placeholder="60"
                          min={15}
                          max={480}
                        />
                      </div>
                      {errors.duration_minutes && (
                        <p className="text-destructive text-sm mt-1">{errors.duration_minutes}</p>
                      )}
                    </div>
                  </div>

                  {/* Short Description */}
                  <div>
                    <label htmlFor="short_description" className="block text-sm font-medium text-foreground mb-2">
                      Short Description <span className="text-destructive">*</span>
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
                    <label htmlFor="description" className="block text-sm font-medium text-foreground mb-2">
                      Full Description <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      rows={5}
                      className={`w-full px-4 py-3 rounded-lg border ${
                        errors.description ? 'border-destructive' : 'border-input'
                      } bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition resize-none`}
                      placeholder="Detailed description of the consultation service, what it covers, and what clients can expect..."
                    />
                    {errors.description && (
                      <p className="text-destructive text-sm mt-1">{errors.description}</p>
                    )}
                  </div>

                  {/* Icon & Image */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label htmlFor="icon_name" className="block text-sm font-medium text-foreground mb-2">
                        Icon
                      </label>
                      <div className="space-y-3">
                        <select
                          id="icon_name"
                          value={formData.icon_name || ''}
                          onChange={(e) => setFormData({ ...formData, icon_name: e.target.value })}
                          className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                        >
                          <option value="">No icon</option>
                          {ICON_OPTIONS.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </select>
                        {/* Icon Preview */}
                        {formData.icon_name && ICON_MAP[formData.icon_name] && (
                          <div className="flex items-center gap-3 p-3 bg-accent/30 rounded-xl border border-border/50">
                            <div className="p-2 bg-primary/10 rounded-lg">
                              {(() => {
                                const IconComponent = ICON_MAP[formData.icon_name!];
                                return <IconComponent className="w-5 h-5 text-primary" />;
                              })()}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              Preview: {formData.icon_name}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div>
                      <label htmlFor="image_url" className="block text-sm font-medium text-foreground mb-2">
                        Image URL <span className="text-muted-foreground text-xs">(optional)</span>
                      </label>
                      <input
                        id="image_url"
                        type="url"
                        value={formData.image_url || ''}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        className="w-full px-4 py-3 rounded-lg border border-input bg-background text-foreground focus:ring-2 focus:ring-ring focus:border-transparent transition"
                        placeholder="https://res.cloudinary.com/..."
                      />
                      {formData.image_url && (
                        <div className="mt-3 rounded-xl overflow-hidden border border-border/50 max-w-[200px]">
                          <img
                            src={formData.image_url}
                            alt="Preview"
                            className="w-full h-32 object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).style.display = 'none';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Toggles */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Active Toggle */}
                    <div className="p-4 rounded-lg border border-border">
                      <label className="flex items-center justify-between gap-3 cursor-pointer">
                        <div className="flex items-center gap-3">
                          {formData.is_active ? (
                            <ToggleRight className="w-5 h-5 text-primary" />
                          ) : (
                            <ToggleLeft className="w-5 h-5 text-muted-foreground" />
                          )}
                          <div>
                            <span className="text-sm font-medium text-foreground block">Active</span>
                            <span className="text-xs text-muted-foreground">
                              Show this service on the website
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.is_active}
                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                            className="peer sr-only"
                          />
                          <div className="w-11 h-6 bg-input rounded-full peer-checked:bg-primary transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
                        </div>
                      </label>
                    </div>

                    {/* Featured Toggle */}
                    <div className="p-4 rounded-lg border border-border">
                      <label className="flex items-center justify-between gap-3 cursor-pointer">
                        <div className="flex items-center gap-3">
                          <Star
                            className={`w-5 h-5 ${formData.is_featured ? 'text-amber-500' : 'text-muted-foreground'}`}
                          />
                          <div>
                            <span className="text-sm font-medium text-foreground block">Featured</span>
                            <span className="text-xs text-muted-foreground">
                              Highlight this service on the homepage
                            </span>
                          </div>
                        </div>
                        <div className="relative">
                          <input
                            type="checkbox"
                            checked={formData.is_featured}
                            onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                            className="peer sr-only"
                          />
                          <div className="w-11 h-6 bg-input rounded-full peer-checked:bg-amber-500 transition-colors" />
                          <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-5 shadow-sm" />
                        </div>
                      </label>
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
                    {createMutation.isPending || updateMutation.isPending ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        {modalMode === 'create' ? 'Creating...' : 'Updating...'}
                      </>
                    ) : (
                      <>
                        <Save className="w-5 h-5" />
                        {modalMode === 'create' ? 'Create Service' : 'Update Service'}
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
                  <h3 className="text-2xl font-bold text-foreground mb-2">Delete Service</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-foreground">{serviceToDelete?.name}</span>?
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

// Service Card Component
interface ServiceCardProps {
  service: ConsultationServiceListItem;
  isDraggable: boolean;
  onEdit: () => void;
  onDelete: () => void;
}

function ServiceCard({ service, isDraggable, onEdit, onDelete }: ServiceCardProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: service.id,
    disabled: !isDraggable,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const IconComponent = service.icon_name && ICON_MAP[service.icon_name] ? ICON_MAP[service.icon_name] : Briefcase;

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

        {/* Icon / Image */}
        <div className="flex-shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-border/50 flex items-center justify-center">
          {service.image_url ? (
            <img
              src={service.image_url}
              alt={service.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <IconComponent className="w-7 h-7 text-primary/60" />
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <h3 className="text-lg font-bold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
              {service.name}
            </h3>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-xs font-semibold ring-1 ${
                CATEGORY_COLORS[service.category]
              }`}
            >
              {CATEGORY_LABELS[service.category]}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-sm">
            {/* Price */}
            <span className="flex items-center gap-1.5 font-bold text-primary">
              <DollarSign className="w-4 h-4" />
              {service.formatted_price}
            </span>

            {/* Duration */}
            <span className="flex items-center gap-1.5 text-muted-foreground">
              <Clock className="w-3.5 h-3.5" />
              {service.formatted_duration}
            </span>

            {/* Created */}
            <span className="text-xs text-muted-foreground hidden sm:inline-flex items-center gap-1">
              Created {format(new Date(service.created_at), 'MMM dd, yyyy')}
            </span>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">
          {service.is_featured && (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-semibold ring-1 ring-amber-500/20">
              <Star className="w-3 h-3" />
              Featured
            </span>
          )}
          {service.is_active ? (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl text-xs font-semibold ring-1 ring-green-500/20">
              <Check className="w-3 h-3" />
              Active
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-muted text-muted-foreground rounded-xl text-xs font-semibold ring-1 ring-border">
              <ToggleLeft className="w-3 h-3" />
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
