'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { useGrant, useGrants } from '@/hooks/useGrants';
import { GrantStatus, GrantType } from '@/types';
import {
  Award,
  ArrowLeft,
  Calendar,
  Clock,
  Target,
  Users,
  GraduationCap,
  Trophy,
  Gift,
  CheckCircle,
  FileText,
  Mail,
  ExternalLink,
  Share2,
  Linkedin,
  Twitter,
  Facebook,
  Link as LinkIcon,
  ArrowRight,
  Sparkles,
  AlertCircle,
  School,
  BookOpen,
} from 'lucide-react';
import { toast } from 'sonner';
import { format } from 'date-fns';

export default function GrantDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: grant, isLoading, error } = useGrant(slug);
  const [showShareMenu, setShowShareMenu] = useState(false);

  // Get related grants (same type, different slug)
  const { data: relatedGrantsData } = useGrants({
    type: grant?.grant_type,
  });

  const relatedGrants = relatedGrantsData
    ?.filter((g) => g.slug !== slug)
    .slice(0, 3);

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

  const getStatusLabel = (status: GrantStatus) => {
    switch (status) {
      case 'open':
        return 'Open for Applications';
      case 'upcoming':
        return 'Coming Soon';
      case 'closed':
        return 'Applications Closed';
      case 'awarded':
        return 'Awarded';
      default:
        return status;
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

  const handleShare = (platform: string) => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = grant?.title || '';

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

  // Loading state
  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
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

  // Error state
  if (error || !grant) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <div className="p-6 bg-brand-primary/5 rounded-3xl mb-6 mx-auto w-fit">
            <Award className="w-20 h-20 text-brand-primary/40" />
          </div>
          <h1 className="text-4xl font-serif font-bold mb-4">Grant Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The grant or scholarship you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/grants"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Grants</span>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const TypeIcon = getTypeIcon(grant.grant_type);

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-0 right-0 h-[600px] bg-gradient-to-b from-brand-primary/5 via-background to-background" />
          {grant.banner_image_url && (
            <div className="absolute top-0 left-0 right-0 h-[400px] overflow-hidden opacity-20">
              <img
                src={grant.banner_image_url}
                alt=""
                className="w-full h-full object-cover blur-md"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background" />
            </div>
          )}
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/grants"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Grants & Scholarships</span>
            </Link>
          </motion.div>

          {/* Header */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="flex flex-wrap items-center gap-3"
              >
                <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-brand-primary/10 text-brand-primary rounded-xl text-sm font-semibold capitalize">
                  <TypeIcon className="w-4 h-4" />
                  {grant.grant_type}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold border ${getStatusColor(grant.status)}`}
                >
                  {grant.status === 'open' && <Clock className="w-4 h-4" />}
                  {getStatusLabel(grant.status)}
                </span>
                {grant.is_featured && (
                  <span className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 rounded-xl text-sm font-semibold">
                    <Sparkles className="w-4 h-4" />
                    Featured
                  </span>
                )}
              </motion.div>

              {/* Title */}
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold leading-tight"
              >
                {grant.title}
              </motion.h1>

              {/* Short Description */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-lg text-muted-foreground leading-relaxed"
              >
                {grant.short_description}
              </motion.p>

              {/* Meta Info */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground"
              >
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-brand-primary" />
                  <span>{grant.target_audience}</span>
                </div>
                {grant.application_deadline && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-brand-primary" />
                    <span>
                      Deadline: {format(new Date(grant.application_deadline), 'MMMM d, yyyy')}
                    </span>
                  </div>
                )}
              </motion.div>
            </div>

            {/* Amount Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="lg:row-span-2"
            >
              <div className="sticky top-28 bg-card border border-border/60 rounded-3xl p-6 shadow-xl">
                {/* Amount */}
                <div className="text-center mb-6 pb-6 border-b border-border/50">
                  <p className="text-sm text-muted-foreground mb-1">Award Amount</p>
                  <p className="text-4xl font-bold text-brand-primary">
                    {grant.formatted_amount}
                  </p>
                </div>

                {/* Deadline Info */}
                {grant.application_deadline && (
                  <div className="mb-6">
                    <div className="flex items-center justify-between text-sm mb-2">
                      <span className="text-muted-foreground">Application Deadline</span>
                      <span className="font-semibold">
                        {format(new Date(grant.application_deadline), 'MMM d, yyyy')}
                      </span>
                    </div>
                    {grant.days_until_deadline !== null && grant.days_until_deadline > 0 && grant.status === 'open' && (
                      <div className="flex items-center gap-2 text-sm text-green-600 dark:text-green-400 font-medium">
                        <Clock className="w-4 h-4" />
                        <span>{grant.days_until_deadline} days left to apply</span>
                      </div>
                    )}
                    {grant.status === 'closed' && (
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <AlertCircle className="w-4 h-4" />
                        <span>Applications are closed</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Apply Buttons */}
                <div className="space-y-3">
                  {grant.status === 'open' && grant.application_url && (
                    <a
                      href={grant.application_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-semibold transition-all hover:scale-[1.02] hover:shadow-lg shadow-brand-primary/25"
                    >
                      Apply Now
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                  {grant.status === 'open' && grant.application_email && (
                    <a
                      href={`mailto:${grant.application_email}?subject=Application for ${grant.title}`}
                      className="flex items-center justify-center gap-2 w-full px-6 py-4 bg-muted hover:bg-muted/80 text-foreground rounded-xl font-semibold transition-all"
                    >
                      <Mail className="w-4 h-4" />
                      Email Application
                    </a>
                  )}
                  {grant.status !== 'open' && (
                    <div className="text-center py-4 text-muted-foreground text-sm">
                      {grant.status === 'upcoming' && 'Applications opening soon'}
                      {grant.status === 'closed' && 'Applications are closed'}
                      {grant.status === 'awarded' && 'This grant has been awarded'}
                    </div>
                  )}
                </div>

                {/* Share Button */}
                <div className="mt-6 pt-6 border-t border-border/50">
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="flex items-center justify-center gap-2 w-full px-4 py-3 border border-border/60 hover:border-brand-primary/40 hover:bg-brand-primary/5 rounded-xl transition-all text-sm font-medium"
                    >
                      <Share2 className="w-4 h-4" />
                      Share This Opportunity
                    </button>

                    {/* Share Menu */}
                    {showShareMenu && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: -10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        className="absolute left-0 right-0 bottom-full mb-2 bg-card border border-border/50 rounded-xl shadow-2xl p-2 z-50"
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
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Featured Image */}
      {grant.image_url && (
        <section className="pb-16">
          <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl"
            >
              <img
                src={grant.image_url}
                alt={grant.title}
                className="w-full h-full object-cover"
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Left Column - Details */}
            <div className="lg:col-span-2 space-y-12">
              {/* Full Description */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                    <BookOpen className="w-5 h-5 text-brand-primary" />
                  </div>
                  About This {grant.grant_type.charAt(0).toUpperCase() + grant.grant_type.slice(1)}
                </h2>
                <div className="prose prose-lg dark:prose-invert max-w-none">
                  <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                    {grant.full_description}
                  </p>
                </div>
              </motion.div>

              {/* Eligibility Criteria */}
              {grant.eligibility_criteria && grant.eligibility_criteria.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                      <CheckCircle className="w-5 h-5 text-brand-primary" />
                    </div>
                    Eligibility Criteria
                  </h2>
                  <ul className="space-y-3">
                    {grant.eligibility_criteria.map((criteria, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-card border border-border/50 rounded-xl"
                      >
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{criteria}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Requirements */}
              {grant.requirements && grant.requirements.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                      <FileText className="w-5 h-5 text-brand-primary" />
                    </div>
                    Application Requirements
                  </h2>
                  <ul className="space-y-3">
                    {grant.requirements.map((requirement, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-card border border-border/50 rounded-xl"
                      >
                        <span className="w-6 h-6 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold flex items-center justify-center flex-shrink-0">
                          {index + 1}
                        </span>
                        <span className="text-foreground">{requirement}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* How to Apply */}
              {
                grant.how_to_apply && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                        <Mail className="w-5 h-5 text-brand-primary" />
                      </div>
                      How to Apply
                    </h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 p-6 rounded-2xl border border-brand-primary/10">
                      <p className="text-foreground leading-relaxed whitespace-pre-line">
                        {grant.how_to_apply}
                      </p>
                    </div>
                  </motion.div>
              )
              }

              {/* Guidelines */}
              {grant.guidelines && grant.guidelines.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                >
                  <h2 className="text-2xl font-serif font-bold mb-6 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center">
                      <AlertCircle className="w-5 h-5 text-brand-primary" />
                    </div>
                    Important Guidelines
                  </h2>
                  <ul className="space-y-3">
                    {grant.guidelines.map((guideline, index) => (
                      <motion.li
                        key={index}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="flex items-start gap-3 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl"
                      >
                        <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <span className="text-foreground">{guideline}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </div>

            {/* Right Column - Additional Info */}
            <div className="space-y-6">
              {/* Target Institutions */}
              {grant.target_institutions && grant.target_institutions.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-card border border-border/60 rounded-2xl p-6"
                >
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <School className="w-5 h-5 text-brand-primary" />
                    Target Institutions
                  </h3>
                  <ul className="space-y-2">
                    {grant.target_institutions.map((institution, index) => (
                      <li
                        key={index}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-primary" />
                        {institution}
                      </li>
                    ))}
                  </ul>
                </motion.div>
              )}

              {/* Important Dates */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="bg-card border border-border/60 rounded-2xl p-6"
              >
                <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                  <Calendar className="w-5 h-5 text-brand-primary" />
                  Important Dates
                </h3>
                <div className="space-y-4">
                  {grant.application_deadline && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Application Deadline
                      </p>
                      <p className="font-semibold">
                        {format(new Date(grant.application_deadline), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}
                  {grant.announcement_date && (
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                        Results Announcement
                      </p>
                      <p className="font-semibold">
                        {format(new Date(grant.announcement_date), 'MMMM d, yyyy')}
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Contact */}
              {(grant.application_email || grant.application_url) && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-card border border-border/60 rounded-2xl p-6"
                >
                  <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                    <Mail className="w-5 h-5 text-brand-primary" />
                    Contact
                  </h3>
                  <div className="space-y-3">
                    {grant.application_email && (
                      <a
                        href={`mailto:${grant.application_email}`}
                        className="flex items-center gap-2 text-sm text-brand-primary hover:underline"
                      >
                        <Mail className="w-4 h-4" />
                        {grant.application_email}
                      </a>
                    )}
                    {grant.application_url && (
                      <a
                        href={grant.application_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-sm text-brand-primary hover:underline"
                      >
                        <ExternalLink className="w-4 h-4" />
                        Application Portal
                      </a>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Social Links */}
              {grant.social_links && Object.keys(grant.social_links).length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="bg-card border border-border/60 rounded-2xl p-6"
                >
                  <h3 className="font-bold text-lg mb-4">Follow Updates</h3>
                  <div className="flex gap-3">
                    {grant.social_links.linkedin && (
                      <a
                        href={grant.social_links.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-muted hover:bg-brand-primary/10 rounded-xl transition-colors"
                      >
                        <Linkedin className="w-5 h-5" />
                      </a>
                    )}
                    {grant.social_links.twitter && (
                      <a
                        href={grant.social_links.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-muted hover:bg-brand-primary/10 rounded-xl transition-colors"
                      >
                        <Twitter className="w-5 h-5" />
                      </a>
                    )}
                    {grant.social_links.facebook && (
                      <a
                        href={grant.social_links.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-3 bg-muted hover:bg-brand-primary/10 rounded-xl transition-colors"
                      >
                        <Facebook className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Related Grants */}
      {relatedGrants && relatedGrants.length > 0 && (
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
                Similar Grants & Scholarships
              </h2>
              <p className="text-muted-foreground">
                Explore more {grant.grant_type}s that might interest you
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8 h-full">
              {relatedGrants.map((relatedGrant, index) => {
                const RelatedTypeIcon = getTypeIcon(relatedGrant.grant_type);
                return (
                  <motion.article
                    key={relatedGrant.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/grants/${relatedGrant.slug}`} className="block">
                      <div className="relative bg-card border border-border/60 rounded-2xl overflow-hidden hover:border-brand-primary/40 transition-all duration-500 hover:shadow-xl h-full flex flex-col justify-between">
                        <div className="relative h-40 overflow-hidden bg-gradient-to-br from-brand-primary/10 to-brand-secondary/10">
                          {relatedGrant.image_url ? (
                            <img
                              src={relatedGrant.image_url}
                              alt={relatedGrant.title}
                              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Award className="w-12 h-12 text-brand-primary/30" />
                            </div>
                          )}
                          {/* Status Badge */}
                          <div className="absolute top-3 right-3">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold border ${getStatusColor(relatedGrant.status)}`}
                            >
                              <span className="capitalize">{relatedGrant.status}</span>
                            </span>
                          </div>
                        </div>
                        <div className="p-5 flex-1 flex flex-col">
                          <div className="flex items-center gap-2 mb-2">
                            <RelatedTypeIcon className="w-4 h-4 text-brand-primary" />
                            <span className="text-xs font-medium text-muted-foreground capitalize">
                              {relatedGrant.grant_type}
                            </span>
                          </div>
                          <h3 className="text-lg font-bold text-foreground group-hover:text-brand-primary transition-colors mb-2 line-clamp-2 flex-1">
                            {relatedGrant.title}
                          </h3>
                          {relatedGrant.formatted_amount && (
                            <p className="text-xl font-bold text-brand-primary mb-3">
                              {relatedGrant.formatted_amount}
                            </p>
                          )}
                          {
                            relatedGrant?.target_audience && (
                              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                <Target className="w-3 h-3" />
                                <span className="line-clamp-1">{relatedGrant.target_audience}</span>
                              </div>
                            )
                          }
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                );
              })}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="text-center mt-12"
            >
              <Link
                href="/grants"
                className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white rounded-xl font-medium transition-all hover:scale-105"
              >
                View All Grants & Scholarships
                <ArrowRight className="w-5 h-5" />
              </Link>
            </motion.div>
          </div>
        </section>
      )}

      <Footer />
    </main>
  );
}
