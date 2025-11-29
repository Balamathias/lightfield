'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowRight, Calendar, Clock, Eye, Scale, Sparkles } from 'lucide-react';
import { useBlogs } from '@/hooks/useBlogs';
import { format } from 'date-fns';
import { Skeleton } from '@/components/ui/skeleton';

export default function BlogsSection() {
  const { data: blogsData, isLoading } = useBlogs({
    page_size: 3,
    ordering: '-publish_date',
  });

  const blogs = blogsData?.results || [];

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative py-20 lg:py-28 bg-gradient-to-b from-background to-muted/20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.015] dark:opacity-[0.01]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="blog-grid"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="40" cy="40" r="1" fill="currentColor" opacity="0.5" />
              <circle cx="40" cy="40" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#blog-grid)" />
        </svg>
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full sm:w-[500px] h-[500px] bg-gradient-to-r from-brand-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 -translate-y-1/2 w-full sm:w-[500px] h-[500px] bg-gradient-to-l from-brand-secondary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-6">
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary tracking-wide">
              Latest Insights
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Stay Informed with Our Latest <span className="text-brand-primary">Legal Updates</span>
          </h2>

          <p className="text-sm sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Expert analysis and insights on emerging technology law, AI regulation,
            blockchain compliance, and more.
          </p>
        </motion.div>

        {/* Blog Cards */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-48 rounded-xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
              </div>
            ))}
          </div>
        ) : blogs.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {blogs.map((blog, index) => (
              <motion.article
                key={blog.id}
                variants={itemVariants}
                className="group"
              >
                <Link href={`/blog/${blog.slug}`} className="block h-full">
                  <div className="h-full bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-brand-primary/40 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 flex flex-col gap-2 justify-between">
                    {/* Featured Image */}
                    {blog.featured_image_url ? (
                      <div className="aspect-video overflow-hidden bg-muted">
                        <img
                          src={blog.featured_image_url}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                      </div>
                    ) : (
                      <div className="aspect-video bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10 flex items-center justify-center">
                        <div className="w-20 h-20 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                          <Scale className="w-10 h-10 text-brand-primary" />
                        </div>
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6 space-y-4">
                      {/* Categories */}
                      {blog.categories.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {blog.categories.slice(0, 2).map((category) => (
                            <span
                              key={category.id}
                              className="px-3 py-1 text-xs font-medium bg-brand-primary/10 text-brand-primary rounded-full"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      )}

                      {/* Title */}
                      <h3 className="text-xl font-serif font-bold group-hover:text-brand-primary transition-colors duration-300 line-clamp-2">
                        {blog.title}
                      </h3>

                      {/* Excerpt */}
                      <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                        {blog.excerpt}
                      </p>

                      {/* Meta */}
                      <div className="flex items-center justify-between pt-4 border-t border-border/50">
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5" />
                            <span>{format(new Date(blog.publish_date || blog.created_at), 'MMM d, yyyy')}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            <span>{blog.read_time || 5} min</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5" />
                            <span>{blog.view_count}</span>
                          </div>
                        </div>

                        <ArrowRight className="w-4 h-4 text-brand-primary opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.article>
            ))}
          </motion.div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No blog posts available yet.</p>
          </div>
        )}

        {/* View All Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-12"
        >
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 group"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
}