'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBlogs } from '@/hooks/useBlogs';
import { useCategories } from '@/hooks/useCategories';
import {
  Search,
  Calendar,
  Clock,
  ArrowRight,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { format } from 'date-fns';

const POSTS_PER_PAGE = 20;

// Blog Card Skeleton
function BlogCardSkeleton() {
  return (
    <div className="group relative bg-card border border-border/60 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-[16/9] bg-muted" />
      <div className="p-8 space-y-4">
        <div className="flex gap-2">
          <div className="h-6 w-20 bg-muted rounded-full" />
          <div className="h-6 w-24 bg-muted rounded-full" />
        </div>
        <div className="h-8 bg-muted rounded w-3/4" />
        <div className="h-4 bg-muted rounded w-full" />
        <div className="h-4 bg-muted rounded w-5/6" />
      </div>
    </div>
  );
}

export default function BlogPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const { data: categories, isLoading: categoriesLoading } = useCategories();

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery);
      setCurrentPage(1); // Reset to page 1 on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Server-side filtered and paginated query
  const { data: blogsData, isLoading: blogsLoading, error } = useBlogs({
    search: debouncedSearch || undefined,
    category: selectedCategory || undefined,
    ordering: '-publish_date',
    page: currentPage,
    page_size: POSTS_PER_PAGE,
  });

  const blogs = blogsData?.results || [];
  const totalCount = blogsData?.count || 0;
  const totalPages = Math.ceil(totalCount / POSTS_PER_PAGE);

  // Reset to page 1 when category changes
  const handleCategoryChange = (slug: string) => {
    setSelectedCategory(slug);
    setCurrentPage(1);
  };

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.01]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="blog-grid"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#blog-grid)" />
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-primary/5 to-transparent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-8">
              <BookOpen className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-medium text-brand-primary tracking-wide">
                Legal Insights
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Our <span className="text-brand-primary">Blog</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-12">
              Expert insights on emerging technology law, AI regulation, blockchain compliance, and more
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-xl mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title or content..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 text-sm"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Category Filters */}
      {!categoriesLoading && categories && categories.length > 0 && (
        <section className="sticky top-24 z-40 bg-background/95 backdrop-blur-lg border-y border-border/40 py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
              <button
                onClick={() => handleCategoryChange('')}
                className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                  selectedCategory === ''
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                    : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                }`}
              >
                All Articles
              </button>
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => handleCategoryChange(category.slug)}
                  className={`flex-shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold tracking-wide transition-all duration-300 ${
                    selectedCategory === category.slug
                      ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/20'
                      : 'bg-muted/50 text-muted-foreground hover:bg-muted hover:text-foreground'
                  }`}
                >
                  {category.name}
                  <span className="ml-2 text-xs opacity-70">({category.blog_count})</span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Blog Grid Section */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {blogsLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <BlogCardSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Unable to load blog posts at this time.</p>
            </div>
          ) : blogs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">No articles found</p>
              <p className="text-sm text-muted-foreground/70">
                {debouncedSearch || selectedCategory
                  ? 'Try adjusting your filters or search query'
                  : 'Check back soon for new content'}
              </p>
              {(debouncedSearch || selectedCategory) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedCategory('');
                  }}
                  className="mt-4 text-brand-primary hover:underline text-sm"
                >
                  Clear all filters
                </button>
              )}
            </motion.div>
          ) : (
            <>
              {/* Results Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 flex items-center justify-between"
              >
                <p className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * POSTS_PER_PAGE + 1}-
                  {Math.min(currentPage * POSTS_PER_PAGE, totalCount)} of {totalCount} articles
                </p>
              </motion.div>

              {/* Blog Grid */}
              <motion.div
                key={currentPage}
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
              >
                <AnimatePresence mode="popLayout">
                  {blogs.map((blog) => (
                    <motion.article
                      key={blog.id}
                      variants={itemVariants}
                      layout
                      className="group relative"
                    >
                      <Link href={`/blog/${blog.slug}`} className="block">
                        <div className="relative bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-brand-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/10 h-full flex flex-col">
                          {/* Featured Image */}
                          {blog.featured_image_url && (
                            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                              <img
                                src={blog.featured_image_url}
                                alt={blog.title}
                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                              />
                              <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent" />
                            </div>
                          )}

                          {/* Content */}
                          <div className="p-8 flex-1 flex flex-col space-y-4">
                            {/* Categories */}
                            {blog.categories.length > 0 && (
                              <div className="flex flex-wrap gap-2">
                                {blog.categories.slice(0, 2).map((category) => (
                                  <span
                                    key={category.id}
                                    className="px-3 py-1 text-xs font-medium rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                                  >
                                    {category.name}
                                  </span>
                                ))}
                              </div>
                            )}

                            {/* Title */}
                            <h3 className="text-xl font-serif font-bold text-foreground group-hover:text-brand-primary transition-colors duration-500 line-clamp-2">
                              {blog.title}
                            </h3>

                            {/* Excerpt */}
                            <p className="text-muted-foreground leading-relaxed line-clamp-3 flex-1">
                              {blog.excerpt}
                            </p>

                            {/* Meta */}
                            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t border-border/50">
                              <div className="flex items-center gap-1.5">
                                <Calendar className="w-4 h-4" />
                                <span>
                                  {blog.publish_date
                                    ? format(new Date(blog.publish_date), 'MMM d, yyyy')
                                    : format(new Date(blog.created_at), 'MMM d, yyyy')}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Clock className="w-4 h-4" />
                                <span>{blog.read_time} min read</span>
                              </div>
                            </div>

                            {/* Read More */}
                            <div className="flex items-center gap-2 text-brand-primary font-semibold group-hover:gap-3 transition-all duration-300">
                              <span className="text-sm">Read Article</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </div>
                        </div>
                      </Link>
                    </motion.article>
                  ))}
                </AnimatePresence>
              </motion.div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="mt-16 flex items-center justify-center gap-2"
                >
                  <button
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border border-border/50 hover:border-brand-primary/40 hover:bg-brand-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {[...Array(totalPages)].map((_, i) => {
                    const page = i + 1;
                    // Show first, last, current, and adjacent pages
                    if (
                      page === 1 ||
                      page === totalPages ||
                      (page >= currentPage - 1 && page <= currentPage + 1)
                    ) {
                      return (
                        <button
                          key={page}
                          onClick={() => setCurrentPage(page)}
                          className={`px-4 py-2 rounded-lg font-semibold transition-all duration-300 ${
                            currentPage === page
                              ? 'bg-brand-primary text-white shadow-lg'
                              : 'border border-border/50 hover:border-brand-primary/40 hover:bg-brand-primary/5'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="px-2 text-muted-foreground">
                          ...
                        </span>
                      );
                    }
                    return null;
                  })}

                  <button
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border border-border/50 hover:border-brand-primary/40 hover:bg-brand-primary/5 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </motion.div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
