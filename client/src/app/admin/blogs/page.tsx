'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useBlogs, useDeleteBlog, useReorderBlogs } from '@/hooks/useBlogs';
import { useCategories } from '@/hooks/useCategories';
import { BlogPostListItem } from '@/types';
import {
  FileText,
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Loader2,
  Calendar,
  User,
  TrendingUp,
  ChevronDown,
  Check,
  Filter,
  X,
  Sparkles,
  GripVertical,
  MoreVertical,
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

export default function AdminBlogsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState<BlogPostListItem | null>(null);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [localBlogs, setLocalBlogs] = useState<BlogPostListItem[]>([]);

  const categoryDropdownRef = useRef<HTMLDivElement>(null);
  const statusDropdownRef = useRef<HTMLDivElement>(null);

  const { data: blogs, isLoading } = useBlogs({
    search: searchQuery || undefined,
    category: selectedCategory || undefined,
  });

  const { data: categories } = useCategories();
  const deleteMutation = useDeleteBlog();
  const reorderMutation = useReorderBlogs();

  // Sync local blogs with server data
  useEffect(() => {
    if (blogs) {
      setLocalBlogs(blogs.results);
    }
  }, [blogs]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(event.target as Node)) {
        setShowCategoryDropdown(false);
      }
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
        setShowStatusFilter(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDelete = async () => {
    if (!blogToDelete) return;
    await deleteMutation.mutateAsync(blogToDelete.slug);
    setShowDeleteModal(false);
    setBlogToDelete(null);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setLocalBlogs((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        const newOrder = arrayMove(items, oldIndex, newIndex);

        // Save to backend
        reorderMutation.mutate({
          items: newOrder.map((blog, index) => ({
            id: blog.id,
            order_priority: index,
          })),
        });

        return newOrder;
      });
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  // Filter blogs by status
  const filteredBlogs = (searchQuery || selectedCategory || statusFilter !== 'all' ? blogs?.results : localBlogs)?.filter((blog) => {
    if (statusFilter === 'published') return blog.is_published;
    if (statusFilter === 'draft') return !blog.is_published;
    return true;
  });

  const selectedCategoryName = categories?.find((c) => c.slug === selectedCategory)?.name;
  const isDraggable = !searchQuery && !selectedCategory && statusFilter === 'all';

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header with Gradient */}
      <div className="relative overflow-hidden rounded-3xl p-6 border border-primary/10">
        <div className="relative flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-xl font-bold">
                Blog Posts
              </h1>
            </div>
            <p className="text-muted-foreground text-base">
              Create and manage your blog content with ease
            </p>
          </div>
          <button
            onClick={() => router.push('/admin/blogs/create')}
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-2xl transition-all font-medium shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
          >
            <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
            <span>Create Post</span>
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
                placeholder="Search by title, author, content..."
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
              onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
              className="group relative inline-flex items-center gap-3 px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 hover:shadow-none"
            >
              <Filter className="w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors" />
              <span className="text-foreground font-medium">
                {selectedCategoryName || 'All Categories'}
              </span>
              <ChevronDown
                className={`w-4 h-4 text-muted-foreground transition-transform ${
                  showCategoryDropdown ? 'rotate-180' : ''
                }`}
              />
            </button>

            <AnimatePresence>
              {showCategoryDropdown && (
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
                        setSelectedCategory('');
                        setShowCategoryDropdown(false);
                      }}
                      className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                        !selectedCategory
                          ? 'bg-primary/10 text-primary'
                          : 'hover:bg-accent text-foreground'
                      }`}
                    >
                      <span className="font-medium">All Categories</span>
                      {!selectedCategory && <Check className="w-4 h-4" />}
                    </button>

                    {categories && categories.length > 0 && (
                      categories.map((category) => (
                        <button
                          key={category.id}
                          onClick={() => {
                            setSelectedCategory(category.slug);
                            setShowCategoryDropdown(false);
                          }}
                          className={`w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl transition-all ${
                            selectedCategory === category.slug
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-accent text-foreground'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="font-medium">{category.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({category.blog_count})
                            </span>
                          </div>
                          {selectedCategory === category.slug && <Check className="w-4 h-4" />}
                        </button>
                      ))
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Status Filter */}
          <div className="relative" ref={statusDropdownRef}>
            <button
              onClick={() => setShowStatusFilter(!showStatusFilter)}
              className="group relative inline-flex items-center gap-3 px-5 py-3.5 backdrop-blur-sm hover:bg-background rounded-2xl transition-all border border-primary/10 hover:shadow-md"
            >
              {statusFilter === 'published' ? (
                <Eye className="w-5 h-5 text-green-500" />
              ) : statusFilter === 'draft' ? (
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
                    {(['all', 'published', 'draft'] as const).map((status) => (
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
                          {status === 'published' && <Eye className="w-4 h-4" />}
                          {status === 'draft' && <EyeOff className="w-4 h-4" />}
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
        {(selectedCategory || searchQuery || statusFilter !== 'all') && (
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
            {selectedCategory && (
              <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 text-primary rounded-xl text-sm font-medium">
                {selectedCategoryName}
                <button onClick={() => setSelectedCategory('')} className="hover:text-primary/80">
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
      {isDraggable && !isLoading && filteredBlogs && filteredBlogs.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-3 p-4 bg-secondary/10 border rounded-2xl border-primary/10"
        >
          <GripVertical className="w-5 h-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-semibold text-foreground">Drag to Reorder</p>
            <p className="text-xs text-muted-foreground dark:text-secondary mt-0.5">
              Drag blog posts to change their display priority. Changes are saved automatically.
            </p>
          </div>
        </motion.div>
      )}

      {/* Blog Posts Table */}
      <div className="relative overflow-hidden bg-card border border-border/10 rounded-3xl shadow-xl">

        <div className="relative z-10">
          {/* Table Header */}
          <div className="p-6 border-b border-border/50">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-primary/10 rounded-xl">
                <FileText className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground">All Blog Posts</h3>
                <p className="text-sm text-muted-foreground">
                  {filteredBlogs?.length || 0} post{filteredBlogs?.length !== 1 ? 's' : ''}
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
              <p className="mt-4 text-muted-foreground font-medium">Loading posts...</p>
            </div>
          ) : filteredBlogs && filteredBlogs.length > 0 ? (
            <>
              {/* Desktop View */}
              <div className="hidden lg:block p-6">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={filteredBlogs.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                    <div className="space-y-2">
                      {filteredBlogs.map((blog) => (
                        <BlogTableRow
                          key={blog.id}
                          blog={blog}
                          isDraggable={isDraggable}
                          onEdit={() => router.push(`/admin/blogs/edit/${blog.slug}`)}
                          onView={() => router.push(`/blog/${blog.slug}`)}
                          onDelete={() => {
                            setBlogToDelete(blog);
                            setShowDeleteModal(true);
                          }}
                          formatDate={formatDate}
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
                      <TableHead className="text-foreground font-semibold">Blog Post</TableHead>
                      <TableHead className="text-foreground font-semibold text-center">Status</TableHead>
                      <TableHead className="text-foreground font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={filteredBlogs.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                        {filteredBlogs.map((blog) => (
                          <BlogMobileRow
                            key={blog.id}
                            blog={blog}
                            isDraggable={isDraggable}
                            onEdit={() => router.push(`/admin/blogs/edit/${blog.slug}`)}
                            onView={() => router.push(`/blog/${blog.slug}`)}
                            onDelete={() => {
                              setBlogToDelete(blog);
                              setShowDeleteModal(true);
                            }}
                            formatDate={formatDate}
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
                <FileText className="w-20 h-20 text-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">
                {searchQuery || selectedCategory || statusFilter !== 'all'
                  ? 'No posts match your filters'
                  : 'No blog posts yet'}
              </h3>
              <p className="text-muted-foreground text-center mb-8 max-w-md">
                {searchQuery || selectedCategory || statusFilter !== 'all'
                  ? 'Try adjusting your filters or search query'
                  : 'Get started by creating your first blog post'}
              </p>
              {!searchQuery && !selectedCategory && statusFilter === 'all' && (
                <button
                  onClick={() => router.push('/admin/blogs/create')}
                  className="group inline-flex items-center gap-2.5 px-8 py-4 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-2xl transition-all font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:scale-105"
                >
                  <Plus className="w-5 h-5 transition-transform group-hover:rotate-90" />
                  <span>Create Your First Post</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>

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
                  <h3 className="text-2xl font-bold text-foreground mb-2">Delete Blog Post</h3>
                  <p className="text-muted-foreground mb-6 leading-relaxed">
                    Are you sure you want to delete{' '}
                    <span className="font-semibold text-foreground">"{blogToDelete?.title}"</span>?
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

// Mobile Table Row Component
interface BlogMobileRowProps {
  blog: BlogPostListItem;
  isDraggable: boolean;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
}

function BlogMobileRow({ blog, isDraggable, onEdit, onView, onDelete, formatDate }: BlogMobileRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: blog.id,
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
            {blog.featured_image_url && (
              <img
                src={blog.featured_image_url}
                alt={blog.title}
                className="w-10 h-10 rounded-lg object-cover"
              />
            )}
            <div className="min-w-0">
              <h3 className="font-semibold text-foreground truncate">{blog.title}</h3>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{blog.author_name}</span>
                <span>•</span>
                <span>{formatDate(blog.created_at)}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground line-clamp-2">{blog.excerpt}</p>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="w-3 h-3" />
            <span>{blog.view_count} views</span>
          </div>
        </div>
      </TableCell>

      <TableCell className="text-center">
        <div className="flex flex-col items-center gap-1">
          {blog.is_published ? (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/10 text-green-600 dark:text-green-400 rounded-lg text-xs font-semibold">
              <Eye className="w-3 h-3" />
              <span className="hidden sm:inline">Published</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-1 bg-muted text-muted-foreground rounded-lg text-xs font-semibold">
              <EyeOff className="w-3 h-3" />
              <span className="hidden sm:inline">Draft</span>
            </span>
          )}
          {blog.is_featured && (
            <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
          )}
        </div>
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

// Desktop Blog Table Row Component
interface BlogTableRowProps {
  blog: BlogPostListItem;
  isDraggable: boolean;
  onEdit: () => void;
  onView: () => void;
  onDelete: () => void;
  formatDate: (date: string) => string;
}

function BlogTableRow({ blog, isDraggable, onEdit, onView, onDelete, formatDate }: BlogTableRowProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: blog.id,
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

        {/* Featured Image */}
        <div className="flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-gradient-to-br from-primary/10 to-primary/5 ring-1 ring-border/50">
          {blog.featured_image_url ? (
            <img
              src={blog.featured_image_url}
              alt={blog.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <FileText className="w-8 h-8 text-primary/30" />
            </div>
          )}
        </div>

        {/* Blog Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold text-foreground mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {blog.title}
          </h3>
          <p className="text-sm text-muted-foreground line-clamp-1 mb-2">{blog.excerpt}</p>

          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{blog.author_name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(blog.created_at)}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>{blog.view_count.toLocaleString()} views</span>
            </div>
          </div>
        </div>

        {/* Status Badges */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {blog.is_published ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-600 dark:text-green-400 rounded-xl text-xs font-semibold ring-1 ring-green-500/20">
              <Eye className="w-3 h-3" />
              Published
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-muted text-muted-foreground rounded-xl text-xs font-semibold">
              <EyeOff className="w-3 h-3" />
              Draft
            </span>
          )}
          {blog.is_featured && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl text-xs font-semibold ring-1 ring-amber-500/20">
              <Star className="w-3 h-3 fill-current" />
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
