'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssociates } from '@/hooks/useAssociates';
import { Linkedin, Twitter, Mail, Phone, Sparkles, ArrowUpRight } from 'lucide-react';
import Link from 'next/link';

// Loading Skeleton Component
function TeamMemberSkeleton() {
  return (
    <div className="group relative">
      <div className="relative bg-card border border-border/60 rounded-2xl overflow-hidden animate-pulse">
        {/* Image Skeleton */}
        <div className="relative aspect-[3/3] bg-muted" />

        {/* Content Skeleton */}
        <div className="p-8 space-y-4">
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />

          {/* Expertise Pills Skeleton */}
          <div className="flex flex-wrap gap-2 pt-4">
            <div className="h-6 w-20 bg-muted rounded-full" />
            <div className="h-6 w-24 bg-muted rounded-full" />
            <div className="h-6 w-16 bg-muted rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component
export default function TeamSection() {
  const { data: associates, isLoading, error } = useAssociates({ is_active: true });
  const [hoveredId, setHoveredId] = useState<number | null>(null);

  if (isLoading) {
    return (
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-muted/20 via-background to-muted/20 overflow-hidden">
        <NetworkBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Skeleton */}
          <div className="text-center max-w-3xl mx-auto mb-20 space-y-6 animate-pulse">
            <div className="h-10 bg-muted rounded w-48 mx-auto" />
            <div className="h-12 bg-muted rounded w-96 mx-auto" />
            <div className="h-6 bg-muted rounded w-64 mx-auto" />
          </div>

          {/* Team Grid Skeleton */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {[...Array(6)].map((_, i) => (
              <TeamMemberSkeleton key={i} />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="relative py-24 lg:py-32 bg-gradient-to-b from-muted/20 via-background to-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-muted-foreground">Unable to load team members at this time.</p>
        </div>
      </section>
    );
  }

  if (!associates || associates.length === 0) {
    return null;
  }

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
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  // Show only first 6 associates on homepage
  const displayedAssociates = associates.slice(0, 6);
  const hasMoreAssociates = associates.length > 6;

  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-muted/20 via-background to-muted/20 overflow-hidden">
      {/* Animated Network Background */}
      <NetworkBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary tracking-wide">
              Our Team
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight"
          >
            Meet the{' '}
            <span className="text-brand-primary">Legal Minds</span>{' '}
            Behind LightField
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-lg lg:text-xl text-muted-foreground leading-relaxed"
          >
            A team of exceptional legal professionals with deep expertise in emerging technologies,
            blockchain, and artificial intelligence law
          </motion.p>
        </motion.div>

        {/* Team Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
        >
          {displayedAssociates.map((associate, index) => (
            <motion.div
              key={associate.id}
              variants={itemVariants}
              onHoverStart={() => setHoveredId(associate.id)}
              onHoverEnd={() => setHoveredId(null)}
              className="group relative"
            >
              <Link href={`/team/${associate.slug}`} className="block">
                <div className="relative bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-brand-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/10">
                  {/* Gradient Overlay on Hover */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-[var(--brand-secondary)]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10 pointer-events-none" />

                  {/* Profile Image */}
                  <div className="relative aspect-[3/3] overflow-hidden bg-muted">
                    {associate.image_url ? (
                      <motion.img
                        src={associate.image_url}
                        alt={associate.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        initial={{ opacity: 0, scale: 1.1 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/10 to-[var(--brand-secondary)]/10">
                        <div className="text-8xl font-serif font-bold text-brand-primary/20">
                          {associate.name.charAt(0)}
                        </div>
                      </div>
                    )}

                    {/* Gradient Overlay on Image */}
                    <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                    {/* Social Links Overlay */}
                    <AnimatePresence>
                      {hoveredId === associate.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 20 }}
                          transition={{ duration: 0.3 }}
                          className="absolute top-4 right-4 flex flex-col gap-2 z-20"
                        >
                          {associate.linkedin_url && (
                            <motion.a
                              href={associate.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 rounded-full bg-background/40 ring-border/25 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Linkedin className="w-4 h-4" />
                            </motion.a>
                          )}
                          {associate.twitter_url && (
                            <motion.a
                              href={associate.twitter_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 rounded-full bg-background/40 ring-border/25 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Twitter className="w-4 h-4" />
                            </motion.a>
                          )}
                          {associate.email && (
                            <motion.a
                              href={`mailto:${associate.email}`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 rounded-full bg-background/40 ring-border/25 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Mail className="w-4 h-4" />
                            </motion.a>
                          )}
                          {associate.phone && (
                            <motion.a
                              href={`tel:${associate.phone}`}
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              whileTap={{ scale: 0.95 }}
                              className="w-10 h-10 rounded-full bg-background/40 ring-border/25 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Phone className="w-4 h-4" />
                            </motion.a>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* View Profile Button */}
                    <AnimatePresence>
                      {hoveredId === associate.id && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          transition={{ duration: 0.3 }}
                          className="absolute bottom-4 left-4 right-4 z-20"
                        >
                          <div className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-brand-primary text-white text-sm font-semibold tracking-wide">
                            <span>View Profile</span>
                            <ArrowUpRight className="w-4 h-4" />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Content */}
                  <div className="relative p-8 space-y-4">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-serif font-bold text-foreground group-hover:text-brand-primary transition-colors duration-500">
                        {associate.name}
                      </h3>
                      <p className="text-sm font-medium text-brand-primary tracking-wide uppercase">
                        {associate.title}
                      </p>
                    </div>

                    <p className="text-muted-foreground leading-relaxed line-clamp-3">
                      {associate.bio}
                    </p>

                    {/* Expertise Pills */}
                    {associate.expertise && associate.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-2 pt-4">
                        {associate.expertise.slice(0, 3).map((skill, idx) => (
                          <span
                            key={idx}
                            className="px-3 py-1 text-xs font-medium rounded-full bg-brand-primary/10 text-brand-primary border border-brand-primary/20"
                          >
                            {skill}
                          </span>
                        ))}
                        {associate.expertise.length > 3 && (
                          <span className="px-3 py-1 text-xs font-medium rounded-full bg-muted text-muted-foreground">
                            +{associate.expertise.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Animated Border Accent */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-primary/20 via-transparent to-[var(--brand-secondary)]/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* View All Team Button (if there are more than 6 associates) */}
        {hasMoreAssociates && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="mt-16 text-center"
          >
            <Link
              href="/team"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-background border-2 border-brand-primary text-brand-primary font-semibold tracking-wide hover:bg-brand-primary hover:text-white transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand-primary/20 group"
            >
              <span>View All Team Members</span>
              <ArrowUpRight className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}

// Animated Network Background Component
function NetworkBackground() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Subtle Gradient Overlay */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-brand-primary/3 via-transparent to-[var(--brand-secondary)]/3 blur-3xl" />

      {/* Neural Network Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.04] dark:opacity-[0.02]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="network-pattern"
            x="0"
            y="0"
            width="150"
            height="150"
            patternUnits="userSpaceOnUse"
          >
            {/* Central Hub */}
            <circle cx="75" cy="75" r="2.5" fill="currentColor" opacity="0.5" />

            {/* Corner Nodes */}
            <circle cx="0" cy="0" r="1.5" fill="currentColor" opacity="0.3" />
            <circle cx="150" cy="0" r="1.5" fill="currentColor" opacity="0.3" />
            <circle cx="0" cy="150" r="1.5" fill="currentColor" opacity="0.3" />
            <circle cx="150" cy="150" r="1.5" fill="currentColor" opacity="0.3" />

            {/* Mid-edge Nodes */}
            <circle cx="75" cy="0" r="1.5" fill="currentColor" opacity="0.3" />
            <circle cx="0" cy="75" r="1.5" fill="currentColor" opacity="0.3" />
            <circle cx="150" cy="75" r="1.5" fill="currentColor" opacity="0.3" />
            <circle cx="75" cy="150" r="1.5" fill="currentColor" opacity="0.3" />

            {/* Connection Lines from Center */}
            <line x1="75" y1="75" x2="0" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="75" y1="75" x2="150" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="75" y1="75" x2="0" y2="150" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="75" y1="75" x2="150" y2="150" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="75" y1="75" x2="75" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="75" y1="75" x2="0" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="75" y1="75" x2="150" y2="75" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="75" y1="75" x2="75" y2="150" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#network-pattern)" />
      </svg>

      {/* Floating Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-brand-primary"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.2, 0.6, 0.2],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5 + Math.random() * 3,
            repeat: Infinity,
            delay: Math.random() * 2,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}
