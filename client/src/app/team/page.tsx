'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAssociates } from '@/hooks/useAssociates';
import { Linkedin, Twitter, Mail, Phone, Sparkles, ArrowUpRight, Users, Search } from 'lucide-react';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

// Loading Skeleton Component
function TeamMemberSkeleton() {
  return (
    <div className="group relative">
      <div className="relative bg-card border border-border/60 rounded-2xl overflow-hidden animate-pulse">
        <div className="relative aspect-[3/3] bg-muted" />
        <div className="p-8 space-y-4">
          <div className="space-y-2">
            <div className="h-6 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
          </div>
          <div className="h-3 bg-muted rounded w-full" />
          <div className="h-3 bg-muted rounded w-5/6" />
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

export default function TeamPage() {
  const { data: associates, isLoading, error } = useAssociates({ is_active: true });
  const [hoveredId, setHoveredId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Filter associates based on search query
  const filteredAssociates = associates?.filter(associate =>
    associate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    associate.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    associate.expertise.some(skill => skill.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.12,
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
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.01]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="team-grid"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="40" cy="40" r="1.5" fill="currentColor" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#team-grid)" />
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
              <Users className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-medium text-brand-primary tracking-wide">
                Our Team
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Meet Our{' '}
              <span className="text-brand-primary">Legal Experts</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-12">
              Exceptional professionals pioneering legal solutions in emerging technologies, AI, and blockchain law
            </p>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="max-w-md mx-auto"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name, title, or expertise..."
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 text-sm"
                />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Team Grid Section */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
              {[...Array(6)].map((_, i) => (
                <TeamMemberSkeleton key={i} />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Unable to load team members at this time.</p>
            </div>
          ) : !filteredAssociates || filteredAssociates.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20"
            >
              <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-lg">
                {searchQuery ? 'No team members found matching your search.' : 'No team members available.'}
              </p>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="mt-4 text-brand-primary hover:underline text-sm"
                >
                  Clear search
                </button>
              )}
            </motion.div>
          ) : (
            <>
              {/* Results Count */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mb-8 text-center"
              >
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAssociates.length} {filteredAssociates.length === 1 ? 'team member' : 'team members'}
                </p>
              </motion.div>

              {/* Team Grid */}
              <motion.div
                initial="hidden"
                animate="visible"
                variants={containerVariants}
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-10"
              >
                <AnimatePresence mode="popLayout">
                  {filteredAssociates.map((associate) => (
                    <motion.div
                      key={associate.id}
                      variants={itemVariants}
                      layout
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
                                      className="w-10 h-10 rounded-full bg-background/40 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
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
                                      className="w-10 h-10 rounded-full bg-background/40 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
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
                                      className="w-10 h-10 rounded-full bg-background/40 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
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
                                      className="w-10 h-10 rounded-full bg-background/40 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:text-brand-primary hover:border-brand-primary/40 transition-colors"
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
                </AnimatePresence>
              </motion.div>
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
