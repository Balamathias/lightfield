'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { useGrants } from '@/hooks/useGrants';
import { GrantStatus, GrantType } from '@/types';
import {
  Award,
  Search,
  Calendar,
  Clock,
  Target,
  ArrowRight,
  Sparkles,
  Filter,
  X,
  ChevronDown,
  GraduationCap,
  Trophy,
  Gift,
  Users,
} from 'lucide-react';

const GRANT_TYPES: { value: GrantType | 'all'; label: string; icon: typeof Award }[] = [
  { value: 'all', label: 'All Types', icon: Sparkles },
  { value: 'scholarship', label: 'Scholarships', icon: GraduationCap },
  { value: 'grant', label: 'Grants', icon: Gift },
  { value: 'award', label: 'Awards', icon: Trophy },
  { value: 'fellowship', label: 'Fellowships', icon: Users },
];

const GRANT_STATUSES: { value: GrantStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All Status' },
  { value: 'open', label: 'Open for Applications' },
  { value: 'upcoming', label: 'Upcoming' },
  { value: 'closed', label: 'Closed' },
  { value: 'awarded', label: 'Awarded' },
];

export default function GrantsPageContent() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState<GrantType | 'all'>('all');
  const [selectedStatus, setSelectedStatus] = useState<GrantStatus | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);

  const { data: grants, isLoading } = useGrants({
    search: searchQuery || undefined,
    type: selectedType !== 'all' ? selectedType : undefined,
    status: selectedStatus !== 'all' ? selectedStatus : undefined,
  });

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
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        {/* Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-brand-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-brand-secondary/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-primary/10 border border-brand-primary/20 rounded-full text-brand-primary text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              <span>Supporting Future Legal Minds</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground mb-6">
              Grants &{' '}
              <span className="text-brand-primary">Scholarships</span>
            </h1>

            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
              LightField LP is committed to nurturing the next generation of legal professionals
              through our grants, scholarships, and awards programs.
            </p>

            {/* Search Bar */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search grants and scholarships..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-14 pr-14 py-4 bg-card border border-border/60 rounded-2xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50 focus:border-brand-primary/50 transition-all shadow-lg"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-5 top-1/2 -translate-y-1/2 p-1.5 hover:bg-accent rounded-lg transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters Section */}
      <section className="py-8 border-b border-border/50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            {/* Type Filters */}
            <div className="flex flex-wrap gap-2">
              {GRANT_TYPES.map((type) => {
                const Icon = type.icon;
                return (
                  <button
                    key={type.value}
                    onClick={() => setSelectedType(type.value)}
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedType === type.value
                        ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                        : 'bg-card border border-border/60 text-foreground hover:border-brand-primary/50 hover:bg-brand-primary/5'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {type.label}
                  </button>
                );
              })}
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-3">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as GrantStatus | 'all')}
                className="px-4 py-2.5 bg-card border border-border/60 rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-brand-primary/50"
              >
                {GRANT_STATUSES.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedType !== 'all' || selectedStatus !== 'all') && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="flex flex-wrap items-center gap-2 mt-4 pt-4 border-t border-border/50"
            >
              <span className="text-sm text-muted-foreground">Active filters:</span>
              {searchQuery && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-medium">
                  Search: {searchQuery}
                  <button onClick={() => setSearchQuery('')} className="hover:opacity-80">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-medium capitalize">
                  {selectedType}
                  <button onClick={() => setSelectedType('all')} className="hover:opacity-80">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              {selectedStatus !== 'all' && (
                <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-medium capitalize">
                  {selectedStatus}
                  <button onClick={() => setSelectedStatus('all')} className="hover:opacity-80">
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              )}
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedType('all');
                  setSelectedStatus('all');
                }}
                className="text-sm text-muted-foreground hover:text-brand-primary transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </div>
      </section>

      {/* Grants Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <div className="relative">
                <div className="w-16 h-16 border-4 border-brand-primary/20 border-t-brand-primary rounded-full animate-spin" />
                <Sparkles className="w-6 h-6 text-brand-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
              <p className="mt-4 text-muted-foreground font-medium">Loading grants...</p>
            </div>
          ) : grants && grants.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {grants.map((grant) => {
                const TypeIcon = getTypeIcon(grant.grant_type);
                return (
                  <motion.div key={grant.id} variants={itemVariants}>
                    <Link href={`/grants/${grant.slug}`}>
                      <div className="group h-full bg-card border border-border/60 rounded-3xl overflow-hidden hover:border-brand-primary/40 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500">
                        {/* Image */}
                        <div className="relative h-48 overflow-hidden bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10">
                          {grant.image_url ? (
                            <img
                              src={grant.image_url}
                              alt={grant.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Award className="w-16 h-16 text-brand-primary/30" />
                            </div>
                          )}
                          {/* Status Badge */}
                          <div className="absolute top-4 right-4">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusColor(grant.status)}`}>
                              {grant.status === 'open' && <Clock className="w-3 h-3" />}
                              <span className="capitalize">{grant.status}</span>
                            </span>
                          </div>
                          {/* Type Badge */}
                          <div className="absolute top-4 left-4">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-background/90 backdrop-blur-sm rounded-full text-xs font-semibold text-foreground capitalize">
                              <TypeIcon className="w-3 h-3" />
                              {grant.grant_type}
                            </span>
                          </div>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h3 className="text-xl font-bold text-foreground mb-2 line-clamp-2 group-hover:text-brand-primary transition-colors">
                            {grant.title}
                          </h3>

                          <p className="text-3xl font-bold text-brand-primary mb-4">
                            {grant.formatted_amount}
                          </p>

                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
                            {grant.short_description}
                          </p>

                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Target className="w-4 h-4 text-brand-primary" />
                              <span>{grant.target_audience}</span>
                            </div>
                            {grant.application_deadline && (
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="w-4 h-4 text-brand-primary" />
                                <span>
                                  Deadline: {new Date(grant.application_deadline).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  })}
                                </span>
                              </div>
                            )}
                            {grant.days_until_deadline !== null && grant.days_until_deadline > 0 && grant.status === 'open' && (
                              <div className="flex items-center gap-2 text-green-600 dark:text-green-400 font-medium">
                                <Clock className="w-4 h-4" />
                                <span>{grant.days_until_deadline} days left to apply</span>
                              </div>
                            )}
                          </div>

                          {/* CTA */}
                          <div className="mt-6 pt-4 border-t border-border/50">
                            <span className="inline-flex items-center gap-2 text-brand-primary font-medium group-hover:gap-3 transition-all">
                              Learn More
                              <ArrowRight className="w-4 h-4" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20"
            >
              <div className="p-6 bg-brand-primary/5 rounded-3xl mb-6 mx-auto w-fit ring-1 ring-brand-primary/10">
                <Award className="w-20 h-20 text-brand-primary/40" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-3">No Grants Found</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                {searchQuery || selectedType !== 'all' || selectedStatus !== 'all'
                  ? 'No grants match your current filters. Try adjusting your search criteria.'
                  : 'There are no grants available at the moment. Please check back later.'}
              </p>
              {(searchQuery || selectedType !== 'all' || selectedStatus !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSelectedType('all');
                    setSelectedStatus('all');
                  }}
                  className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-medium transition-all"
                >
                  Clear Filters
                </button>
              )}
            </motion.div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-brand-primary/5 via-background to-brand-secondary/5">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground mb-6">
              Have Questions About Our Programs?
            </h2>
            <p className="text-muted-foreground text-lg mb-8">
              Our team is here to help you understand our grants and scholarships.
              Reach out to learn more about eligibility and application processes.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-2xl font-medium shadow-lg shadow-brand-primary/25 hover:shadow-xl hover:shadow-brand-primary/30 transition-all hover:scale-105"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
