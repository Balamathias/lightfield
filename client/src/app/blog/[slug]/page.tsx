'use client';

import { motion } from 'framer-motion';
import { useBlog, useBlogs } from '@/hooks/useBlogs';
import {
  Calendar,
  Clock,
  Tag,
  ArrowLeft,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
  Link as LinkIcon,
  Eye,
  User,
  Sparkles,
  ChevronDown,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { format } from 'date-fns';
import { useState } from 'react';
import { toast } from 'sonner';

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: blog, isLoading, error } = useBlog(slug);

  const [showShareMenu, setShowShareMenu] = useState(false);
  const [isAIOverviewExpanded, setIsAIOverviewExpanded] = useState(false);

  // Get related posts (same category, limit 3) - server-side filtering
  const firstCategorySlug = blog?.categories?.[0]?.slug;
  const { data: relatedPostsData } = useBlogs({
    category: firstCategorySlug,
    ordering: '-publish_date',
  });

  const relatedPosts = relatedPostsData?.results
    ?.filter((post) => post.slug !== slug)
    .slice(0, 3);

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = blog?.title || '';

    const shareUrls: Record<string, string> = {
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
    };

    if (platform === 'copy') {
      navigator.clipboard.writeText(url);
      toast.success('Link copied to clipboard!');
      setShowShareMenu(false);
      return;
    }

    if (shareUrls[platform]) {
      window.open(shareUrls[platform], '_blank', 'width=600,height=400');
    }
    setShowShareMenu(false);
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="h-12 bg-muted rounded w-3/4" />
            <div className="h-6 bg-muted rounded w-1/2" />
            <div className="aspect-video bg-muted rounded-2xl" />
            <div className="space-y-4">
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-full" />
              <div className="h-4 bg-muted rounded w-3/4" />
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Article Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The article you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Blog</span>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Article Header */}
      <article className="relative pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/blog"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Blog</span>
            </Link>
          </motion.div>

          {/* Categories */}
          {blog.categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="flex flex-wrap gap-2 mb-6"
            >
              {blog.categories.map((category) => (
                <span
                  key={category.id}
                  className="px-3 py-1 text-xs font-medium rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                >
                  {category.name}
                </span>
              ))}
            </motion.div>
          )}

          {/* Title */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight"
          >
            {blog.title}
          </motion.h1>

          {/* Excerpt */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl text-muted-foreground leading-relaxed mb-8"
          >
            {blog.excerpt}
          </motion.p>

          {/* Meta Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-wrap items-center gap-6 pb-8 mb-8 border-b border-border/50"
          >
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <User className="w-4 h-4" />
              <span className="font-medium text-foreground">{blog.author_name}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>
                {blog.publish_date
                  ? format(new Date(blog.publish_date), 'MMMM d, yyyy')
                  : format(new Date(blog.created_at), 'MMMM d, yyyy')}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{blog.read_time} min read</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Eye className="w-4 h-4" />
              <span>{blog.view_count} views</span>
            </div>

            {/* Share Button */}
            <div className="ml-auto relative">
              <button
                onClick={() => setShowShareMenu(!showShareMenu)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border/50 hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-300 text-sm font-medium"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>

              {/* Share Menu */}
              {showShareMenu && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  className="absolute right-0 top-full mt-2 bg-card border border-border/50 rounded-lg shadow-2xl p-2 min-w-[200px] z-50"
                >
                  <button
                    onClick={() => handleShare('linkedin')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <Linkedin className="w-4 h-4 text-[#0077B5]" />
                    <span className="text-sm font-medium">LinkedIn</span>
                  </button>
                  <button
                    onClick={() => handleShare('twitter')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <Twitter className="w-4 h-4 text-[#1DA1F2]" />
                    <span className="text-sm font-medium">Twitter</span>
                  </button>
                  <button
                    onClick={() => handleShare('facebook')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <Facebook className="w-4 h-4 text-[#1877F2]" />
                    <span className="text-sm font-medium">Facebook</span>
                  </button>
                  <button
                    onClick={() => handleShare('copy')}
                    className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                  >
                    <LinkIcon className="w-4 h-4" />
                    <span className="text-sm font-medium">Copy Link</span>
                  </button>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Featured Image */}
          {blog.featured_image_url && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative aspect-video rounded-2xl overflow-hidden mb-12 shadow-2xl"
            >
              <img
                src={blog.featured_image_url}
                alt={blog.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* AI Overview Accordion (if available) */}
          {blog.ai_overview && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="mb-12 rounded-2xl bg-gradient-to-br from-brand-primary/5 via-background to-[var(--brand-secondary)]/5 border border-brand-primary/20 overflow-hidden"
            >
              {/* Accordion Header */}
              <button
                onClick={() => setIsAIOverviewExpanded(!isAIOverviewExpanded)}
                className="w-full p-6 flex items-center justify-between gap-4 hover:bg-brand-primary/5 transition-colors duration-300 group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0 group-hover:bg-brand-primary/20 transition-colors duration-300">
                    <Sparkles className="w-5 h-5 text-brand-primary" />
                  </div>
                  <div className="text-left">
                    <h3 className="font-semibold text-foreground text-lg">AI-Generated Overview</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Quick summary powered by AI
                    </p>
                  </div>
                </div>
                <motion.div
                  animate={{ rotate: isAIOverviewExpanded ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                >
                  <ChevronDown className="w-5 h-5 text-muted-foreground group-hover:text-brand-primary transition-colors" />
                </motion.div>
              </button>

              {/* Accordion Content */}
              <motion.div
                initial={false}
                animate={{
                  height: isAIOverviewExpanded ? 'auto' : 0,
                  opacity: isAIOverviewExpanded ? 1 : 0,
                }}
                transition={{
                  height: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  opacity: { duration: 0.2, ease: 'easeInOut' },
                }}
                className="overflow-hidden"
              >
                <div className="px-6 pb-6 pt-2">
                  <div className="pl-[52px]">
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {blog.ai_overview}
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Article Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.7 }}
            className="blog-content"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </article>

      {/* Related Posts */}
      {relatedPosts && relatedPosts.length > 0 && (
        <section className="relative py-16 lg:py-24 bg-muted/20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-center mb-12"
            >
              <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
                More Articles Like This
              </h2>
              <p className="text-muted-foreground">
                Continue exploring insights on similar topics
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {relatedPosts.map((post, index) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="group"
                >
                  <Link href={`/blog/${post.slug}`} className="block">
                    <div className="relative bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-brand-primary/40 transition-all duration-500 hover:shadow-xl h-full flex flex-col">
                      {post.featured_image_url && (
                        <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                          <img
                            src={post.featured_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                          />
                        </div>
                      )}
                      <div className="p-6 flex-1 flex flex-col">
                        <h3 className="text-lg font-serif font-bold text-foreground group-hover:text-brand-primary transition-colors mb-3 line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-sm text-muted-foreground line-clamp-2 flex-1 mb-4">
                          {post.excerpt}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Clock className="w-3 h-3" />
                          <span>{post.read_time} min read</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
