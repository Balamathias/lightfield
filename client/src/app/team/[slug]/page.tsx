'use client';

import { motion } from 'framer-motion';
import { useAssociate } from '@/hooks/useAssociates';
import {
  Linkedin,
  Twitter,
  Mail,
  Phone,
  ArrowLeft,
  Award,
  Briefcase,
  GraduationCap,
  MapPin,
  Calendar,
  ExternalLink,
} from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';

export default function TeamMemberPage() {
  const params = useParams();
  const slug = params.slug as string;
  const { data: associate, isLoading, error } = useAssociate(slug);

  if (isLoading) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-32" />
            <div className="grid lg:grid-cols-3 gap-12">
              <div className="lg:col-span-1">
                <div className="aspect-[3/4] bg-muted rounded-2xl" />
              </div>
              <div className="lg:col-span-2 space-y-6">
                <div className="h-12 bg-muted rounded w-3/4" />
                <div className="h-6 bg-muted rounded w-1/2" />
                <div className="h-4 bg-muted rounded w-full" />
                <div className="h-4 bg-muted rounded w-5/6" />
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    );
  }

  if (error || !associate) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <h1 className="text-4xl font-serif font-bold mb-4">Team Member Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The team member you're looking for doesn't exist or has been removed.
          </p>
          <Link
            href="/team"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Team</span>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section with Background Pattern */}
      <section className="relative pt-32 pb-16 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.01]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="member-grid"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#member-grid)" />
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] bg-gradient-to-b from-brand-primary/5 to-transparent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Link
              href="/team"
              className="inline-flex items-center gap-2 text-muted-foreground hover:text-brand-primary transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium">Back to Team</span>
            </Link>
          </motion.div>

          {/* Main Content */}
          <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
            {/* Left Column - Image */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-1"
            >
              <div className="sticky top-20">
                <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-muted shadow-2xl">
                  {associate.image_url ? (
                    <img
                      src={associate.image_url}
                      alt={associate.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-brand-primary/10 to-[var(--brand-secondary)]/10">
                      <div className="text-9xl font-serif font-bold text-brand-primary/20">
                        {associate.name.charAt(0)}
                      </div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-background/20 via-transparent to-transparent" />
                </div>

                {/* Social Links */}
                <div className="mt-6 flex flex-wrap gap-3">
                  {associate.linkedin_url && (
                    <a
                      href={associate.linkedin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[calc(50%-0.375rem)] flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-foreground hover:text-brand-primary hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-300"
                    >
                      <Linkedin className="w-4 h-4" />
                      <span className="text-sm font-medium">LinkedIn</span>
                    </a>
                  )}
                  {associate.twitter_url && (
                    <a
                      href={associate.twitter_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 min-w-[calc(50%-0.375rem)] flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-foreground hover:text-brand-primary hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-300"
                    >
                      <Twitter className="w-4 h-4" />
                      <span className="text-sm font-medium">Twitter</span>
                    </a>
                  )}
                  {associate.email && (
                    <a
                      href={`mailto:${associate.email}`}
                      className="flex-1 min-w-[calc(50%-0.375rem)] flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-foreground hover:text-brand-primary hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-300"
                    >
                      <Mail className="w-4 h-4" />
                      <span className="text-sm font-medium">Email</span>
                    </a>
                  )}
                  {associate.phone && (
                    <a
                      href={`tel:${associate.phone}`}
                      className="flex-1 min-w-[calc(50%-0.375rem)] flex items-center justify-center gap-2 px-4 py-3 rounded-lg bg-muted/50 border border-border/50 text-foreground hover:text-brand-primary hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-300"
                    >
                      <Phone className="w-4 h-4" />
                      <span className="text-sm font-medium">Call</span>
                    </a>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Right Column - Details */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-2 space-y-10"
            >
              {/* Header */}
              <div className="space-y-4">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-foreground">
                  {associate.name}
                </h1>
                <p className="text-xl sm:text-2xl text-brand-primary font-medium tracking-wide uppercase">
                  {associate.title}
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-4">
                <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                  <Award className="w-6 h-6 text-brand-primary" />
                  <span>About</span>
                </h2>
                <div className="text-lg text-muted-foreground leading-relaxed">
                  {associate.bio.split('\n').map((paragraph, idx) => (
                    <p key={idx} className="mb-5 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>

              {/* Expertise */}
              {associate.expertise && associate.expertise.length > 0 && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                    <Briefcase className="w-6 h-6 text-brand-primary" />
                    <span>Areas of Expertise</span>
                  </h2>
                  <div className="flex flex-wrap gap-3">
                    {associate.expertise.map((skill, idx) => (
                      <motion.span
                        key={idx}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: 0.3 + idx * 0.05 }}
                        className="px-4 py-2 text-sm font-medium rounded-lg bg-brand-primary/10 text-brand-primary border border-brand-primary/20 hover:bg-brand-primary/15 transition-colors"
                      >
                        {skill}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}

              {/* CTA Section */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-8 border-t border-border/50"
              >
                <div className="bg-gradient-to-br from-brand-primary/5 via-background to-[var(--brand-secondary)]/5 border border-border/50 rounded-2xl p-8 lg:p-10">
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    <div>
                      <h3 className="text-xl font-serif font-bold mb-2">
                        Need Legal Assistance?
                      </h3>
                      <p className="text-muted-foreground">
                        Schedule a consultation with {associate.name.split(' ')[0]} to discuss your case
                      </p>
                    </div>
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand-primary/20 whitespace-nowrap"
                    >
                      <span>Book a Consultation</span>
                      <ExternalLink className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Additional Info Section */}
      <section className="relative py-16 lg:py-24 bg-muted/20 hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Professional Credentials
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Extensive experience and qualifications in emerging technology law
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="bg-card border border-border/60 rounded-2xl p-8 text-center hover:border-brand-primary/40 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                <GraduationCap className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Education</h3>
              <p className="text-muted-foreground text-sm">
                Advanced legal education with focus on technology law
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="bg-card border border-border/60 rounded-2xl p-8 text-center hover:border-brand-primary/40 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                <Award className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Certifications</h3>
              <p className="text-muted-foreground text-sm">
                Specialized certifications in AI and blockchain law
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="bg-card border border-border/60 rounded-2xl p-8 text-center hover:border-brand-primary/40 transition-all duration-500"
            >
              <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                <Briefcase className="w-6 h-6 text-brand-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Experience</h3>
              <p className="text-muted-foreground text-sm">
                Years of practice in emerging technology legal matters
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
