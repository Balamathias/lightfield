'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  ArrowRight,
  Award,
  Calendar,
  Clock,
  Target,
  GraduationCap,
  Trophy,
  Gift,
  Users,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import { useFeaturedGrants } from '@/hooks/useGrants';
import { GrantStatus, GrantType } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';

export default function GrantsSection() {
  const { data: grants, isLoading } = useFeaturedGrants();

  // Take top 3 featured grants
  const featuredGrants = grants?.slice(0, 3) || [];

  const getStatusColor = (status: GrantStatus) => {
    switch (status) {
      case 'open':
        return 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20';
      case 'upcoming':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      case 'closed':
        return 'bg-gray-500/10 text-gray-600 dark:text-gray-400 border-gray-500/20';
      case 'awarded':
        return 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getTypeIcon = (type: GrantType) => {
    switch (type) {
      case 'scholarship':
        return GraduationCap;
      case 'grant':
        return Gift;
      case 'award':
        return Trophy;
      case 'fellowship':
        return Users;
      default:
        return Award;
    }
  };

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

  // Count for stats animation
  const totalAwarded = grants?.reduce((sum, g) => {
    if (g.status === 'awarded') return sum + 1;
    return sum;
  }, 0) || 0;

  const totalValue = grants?.reduce((sum, g) => {
    // Extract numeric value from formatted amount for estimation
    return sum + (parseFloat(String(g.formatted_amount).replace(/[^0-9.]/g, '')) || 0);
  }, 0) || 0;

  return (
    <section className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/[0.02] via-background to-brand-secondary/[0.03]" />

        {/* Decorative SVG Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.01]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="grants-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M50 0L100 50L50 100L0 50Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <circle cx="50" cy="50" r="3" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grants-pattern)" />
        </svg>

        {/* Floating Orbs */}
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-gradient-to-l from-brand-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-[600px] h-[600px] bg-gradient-to-r from-brand-secondary/5 to-transparent rounded-full blur-3xl" />
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
            <Award className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary tracking-wide">
              Supporting Future Legal Minds
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Grants & <span className="text-brand-primary">Scholarships</span>
          </h2>

          <p className="text-sm sm:text-lg lg:text-xl text-muted-foreground leading-relaxed">
            LightField LP is committed to nurturing the next generation of legal professionals
            through our grants, scholarships, awards, and fellowship programs.
          </p>
        </motion.div>

        {/* Stats Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12"
        >
          <div className="relative bg-card border border-border/60 rounded-2xl p-5 text-center group hover:border-brand-primary/40 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                <Award className="w-6 h-6 text-brand-primary" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{grants?.length || 0}</p>
              <p className="text-sm text-muted-foreground">Active Programs</p>
            </div>
          </div>

          <div className="relative bg-card border border-border/60 rounded-2xl p-5 text-center group hover:border-brand-primary/40 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-green-500/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-green-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">
                {grants?.filter((g) => g.status === 'open').length || 0}
              </p>
              <p className="text-sm text-muted-foreground">Open Now</p>
            </div>
          </div>

          <div className="relative bg-card border border-border/60 rounded-2xl p-5 text-center group hover:border-brand-primary/40 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-amber-500/10 flex items-center justify-center">
                <Trophy className="w-6 h-6 text-amber-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">{totalAwarded}+</p>
              <p className="text-sm text-muted-foreground">Recipients</p>
            </div>
          </div>

          <div className="relative bg-card border border-border/60 rounded-2xl p-5 text-center group hover:border-brand-primary/40 transition-colors">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-transparent rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative">
              <div className="w-12 h-12 mx-auto mb-3 rounded-xl bg-purple-500/10 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-500" />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-foreground">100%</p>
              <p className="text-sm text-muted-foreground">Commitment</p>
            </div>
          </div>
        </motion.div>

        {/* Featured Grants */}
        {isLoading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-52 rounded-2xl" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-8 w-1/2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ))}
          </div>
        ) : featuredGrants.length > 0 ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredGrants.map((grant, index) => {
              const TypeIcon = getTypeIcon(grant.grant_type);
              return (
                <motion.article key={grant.id} variants={itemVariants} className="group">
                  <Link href={`/grants/${grant.slug}`} className="block h-full">
                    <div className="h-full bg-card border border-border/60 rounded-3xl overflow-hidden hover:border-brand-primary/40 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500 flex flex-col">
                      {/* Image Section */}
                      <div className="relative h-52 overflow-hidden bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10">
                        {grant.image_url ? (
                          <img
                            src={grant.image_url}
                            alt={grant.title}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-24 h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                              <Award className="w-12 h-12 text-brand-primary/40" />
                            </div>
                          </div>
                        )}

                        {/* Overlay Gradient */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

                        {/* Badges */}
                        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/90 dark:bg-black/70 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground capitalize">
                            <TypeIcon className="w-3.5 h-3.5 text-brand-primary" />
                            {grant.grant_type}
                          </span>
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border backdrop-blur-sm ${getStatusColor(grant.status)}`}
                          >
                            {grant.status === 'open' && <Clock className="w-3 h-3" />}
                            <span className="capitalize">{grant.status}</span>
                          </span>
                        </div>

                        {/* Amount Overlay */}
                        {grant.formatted_amount && (
                          <div className="absolute bottom-4 left-4">
                            <p className="text-3xl font-bold text-white drop-shadow-lg">
                              {grant.formatted_amount}
                            </p>
                          </div>
                        )}
                      </div>

                      {/* Content Section */}
                      <div className="p-6 flex-1 flex flex-col">
                        {/* Featured Badge */}
                        {/* {grant.is_featured && (
                          <div className="flex items-center gap-1.5 text-amber-500 text-xs font-medium mb-2">
                            <Sparkles className="w-3.5 h-3.5" />
                            Featured Opportunity
                          </div>
                        )} */}

                        {/* Title */}
                        <h3 className="text-xl font-bold text-foreground group-hover:text-brand-primary transition-colors duration-300 line-clamp-2 mb-3">
                          {grant.title}
                        </h3>

                        {/* Description */}
                        <p className="text-muted-foreground text-sm leading-relaxed line-clamp-2 flex-1 mb-4">
                          {grant.short_description}
                        </p>

                        {/* Meta Info */}
                        <div className="space-y-2 text-sm">
                          <div className="flex items-center gap-2 text-muted-foreground">
                            <Target className="w-4 h-4 text-brand-primary" />
                            <span className="line-clamp-1">{grant.target_audience}</span>
                          </div>
                          {grant.application_deadline && (
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="w-4 h-4 text-brand-primary" />
                              <span>
                                Deadline:{' '}
                                {new Date(grant.application_deadline).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            </div>
                          )}
                          {grant.days_until_deadline !== null &&
                            grant.days_until_deadline > 0 &&
                            grant.status === 'open' && (
                              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                                <Clock className="w-4 h-4" />
                                <span>{grant.days_until_deadline} days left to apply</span>
                              </div>
                            )}
                        </div>

                        {/* CTA */}
                        <div className="mt-6 pt-4 border-t border-border/50 flex items-center justify-between">
                          <span className="inline-flex items-center gap-2 text-brand-primary font-medium group-hover:gap-3 transition-all">
                            Learn More
                            <ArrowRight className="w-4 h-4" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.article>
              );
            })}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-16"
          >
            <div className="p-6 bg-brand-primary/5 rounded-3xl mb-6 mx-auto w-fit ring-1 ring-brand-primary/10">
              <Award className="w-16 h-16 text-brand-primary/40" />
            </div>
            <h3 className="text-xl font-bold text-foreground mb-2">Coming Soon</h3>
            <p className="text-muted-foreground max-w-md mx-auto">
              We're preparing exciting grant and scholarship opportunities. Check back soon!
            </p>
          </motion.div>
        )}

        {/* View All Button */}
        {featuredGrants.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-center mt-12"
          >
            <Link
              href="/grants"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 hover:scale-105 group"
            >
              <span>Explore All Opportunities</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        )}
      </div>
    </section>
  );
}
