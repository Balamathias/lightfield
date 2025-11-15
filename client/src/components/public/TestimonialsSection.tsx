'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Star, Award } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useTestimonials } from '@/hooks/useTestimonials';
import Link from 'next/link';

// Loading Skeleton Component
function TestimonialSkeleton() {
  return (
    <div className="w-full max-w-4xl mx-auto px-8">
      <div className="bg-background/80 backdrop-blur-sm border border-border/50 rounded-2xl p-10 lg:p-12 animate-pulse">
        <div className="flex flex-col items-center text-center space-y-6">
          {/* Stars skeleton */}
          <div className="flex gap-1">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="w-5 h-5 bg-muted rounded" />
            ))}
          </div>

          {/* Quote skeleton */}
          <div className="space-y-3 w-full">
            <div className="h-6 bg-muted rounded w-full" />
            <div className="h-6 bg-muted rounded w-5/6 mx-auto" />
            <div className="h-6 bg-muted rounded w-4/6 mx-auto" />
          </div>

          {/* Author skeleton */}
          <div className="flex items-center gap-4 pt-4">
            <div className="w-16 h-16 rounded-full bg-muted" />
            <div className="space-y-2">
              <div className="h-5 bg-muted rounded w-32" />
              <div className="h-4 bg-muted rounded w-40" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsSection() {
  const { data: testimonials, isLoading, error } = useTestimonials({
    is_active: true,
  });

  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  if (isLoading) {
    return (
      <section className="relative py-24 lg:py-32 bg-muted/30 overflow-hidden">
        {/* Background Pattern */}
        <CobwebBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-8 animate-pulse">
              <div className="w-4 h-4 bg-muted rounded" />
              <div className="w-32 h-4 bg-muted rounded" />
            </div>
            <div className="h-12 bg-muted rounded w-2/3 mx-auto mb-6 animate-pulse" />
            <div className="h-6 bg-muted rounded w-full mx-auto animate-pulse" />
          </div>

          <TestimonialSkeleton />
        </div>
      </section>
    );
  }

  if (!testimonials || testimonials.length === 0) {
    return null;
  }

  const handlePrevious = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  const currentTestimonial = testimonials[currentIndex];

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
    }),
  };

  return (
    <section className="relative py-24 lg:py-32 bg-muted/30 overflow-hidden">
      {/* Advanced Cobweb SVG Background */}
      <CobwebBackground />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-8">
            <Award className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary tracking-wide">
              Client Testimonials
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
            What Our{' '}
            <span className="text-brand-primary">Clients Think</span>
          </h2>

          <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
            Trusted by leading technology companies and innovators worldwide
          </p>
        </motion.div>

        {/* Testimonial Carousel */}
        <div className="relative">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{
                x: { type: 'spring', stiffness: 300, damping: 30 },
                opacity: { duration: 0.4 },
              }}
              className="w-full max-w-4xl mx-auto px-8"
            >
              <div className="relative bg-background/80 backdrop-blur-sm border border-border/10 rounded-3xl p-10 lg:p-12 shadow-xl hover:shadow-2xl transition-shadow duration-500">

                <div className="flex flex-col items-center text-center space-y-8">
                  {/* Star Rating */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="flex gap-1"
                  >
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-5 h-5 ${
                          i < currentTestimonial.rating
                            ? 'fill-brand-primary text-brand-primary'
                            : 'fill-muted text-muted'
                        }`}
                      />
                    ))}
                  </motion.div>

                  {/* Testimonial Text */}
                  <motion.blockquote
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="text-xl lg:text-2xl font-serif text-foreground leading-relaxed max-w-3xl"
                  >
                    "{currentTestimonial.testimonial_text}"
                  </motion.blockquote>

                  {/* Client Info */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.5 }}
                    className="flex items-center gap-4 pt-4 border-t border-border/50"
                  >
                    {currentTestimonial.client_image_url ? (
                      <img
                        src={currentTestimonial.client_image_url}
                        alt={currentTestimonial.client_name}
                        className="w-16 h-16 rounded-full object-cover border-2 border-brand-primary/20"
                      />
                    ) : (
                      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-primary to-[var(--brand-secondary)] flex items-center justify-center text-white text-xl font-bold">
                        {currentTestimonial.client_name.charAt(0)}
                      </div>
                    )}
                    <div className="text-left">
                      <div className="font-semibold text-foreground text-lg">
                        {currentTestimonial.client_name}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {currentTestimonial.client_title}
                        {currentTestimonial.client_company && (
                          <span className="text-brand-primary font-medium">
                            {' '}
                            - {currentTestimonial.client_company}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>

                  {/* Case Type Badge */}
                  {currentTestimonial.case_type && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.6, delay: 0.6 }}
                      className="px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20"
                    >
                      <span className="text-xs font-semibold text-brand-primary tracking-wider uppercase">
                        {currentTestimonial.case_type}
                      </span>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Arrows */}
          {testimonials.length > 1 && (
            <>
              <motion.button
                whileHover={{ scale: 1.1, x: -5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handlePrevious}
                className="absolute left-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300 shadow-lg z-10"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1, x: 5 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleNext}
                className="absolute right-0 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 flex items-center justify-center text-foreground hover:bg-brand-primary hover:text-white hover:border-brand-primary transition-all duration-300 shadow-lg z-10"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </motion.button>
            </>
          )}
        </div>

        {/* Pagination Dots */}
        {testimonials.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex justify-center gap-2 mt-12"
          >
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setDirection(index > currentIndex ? 1 : -1);
                  setCurrentIndex(index);
                }}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? 'w-8 bg-brand-primary'
                    : 'w-2 bg-border hover:bg-brand-primary/50'
                }`}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </motion.div>
        )}

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="text-center mt-16"
        >
          <Button
            asChild
            className="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold text-base px-10 py-6 rounded-lg shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all duration-300"
          >
            <Link href="/contact">Share Your Experience</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}

// Advanced Cobweb SVG Background Component
function CobwebBackground() {
  return (
    <div className="absolute inset-0">
      {/* Subtle Gradient Overlay */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full md:w-[800px] h-[400px] bg-gradient-to-b from-brand-primary/3 to-transparent blur-3xl" />

      {/* Network/Cobweb Pattern */}
      <svg
        className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.02]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern
            id="cobweb-pattern"
            x="0"
            y="0"
            width="200"
            height="200"
            patternUnits="userSpaceOnUse"
          >
            {/* Central node */}
            <circle cx="100" cy="100" r="3" fill="currentColor" opacity="0.6" />

            {/* Corner nodes */}
            <circle cx="0" cy="0" r="2" fill="currentColor" opacity="0.4" />
            <circle cx="200" cy="0" r="2" fill="currentColor" opacity="0.4" />
            <circle cx="0" cy="200" r="2" fill="currentColor" opacity="0.4" />
            <circle cx="200" cy="200" r="2" fill="currentColor" opacity="0.4" />

            {/* Mid-edge nodes */}
            <circle cx="100" cy="0" r="2" fill="currentColor" opacity="0.4" />
            <circle cx="200" cy="100" r="2" fill="currentColor" opacity="0.4" />
            <circle cx="100" cy="200" r="2" fill="currentColor" opacity="0.4" />
            <circle cx="0" cy="100" r="2" fill="currentColor" opacity="0.4" />

            {/* Web lines from center to all nodes */}
            <line x1="100" y1="100" x2="0" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="100" y1="100" x2="100" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="100" y1="100" x2="200" y2="0" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="100" y1="100" x2="200" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="100" y1="100" x2="200" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="100" y1="100" x2="100" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="100" y1="100" x2="0" y2="200" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
            <line x1="100" y1="100" x2="0" y2="100" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />

            {/* Outer web connections */}
            <line x1="0" y1="0" x2="100" y2="0" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
            <line x1="100" y1="0" x2="200" y2="0" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
            <line x1="200" y1="0" x2="200" y2="100" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
            <line x1="200" y1="100" x2="200" y2="200" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
            <line x1="200" y1="200" x2="100" y2="200" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
            <line x1="100" y1="200" x2="0" y2="200" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
            <line x1="0" y1="200" x2="0" y2="100" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
            <line x1="0" y1="100" x2="0" y2="0" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#cobweb-pattern)" />
      </svg>

      {/* Animated Particles */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1.5 h-1.5 rounded-full bg-brand-primary"
          style={{
            left: `${20 + Math.random() * 60}%`,
            top: `${20 + Math.random() * 60}%`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [0.3, 0.6, 0.3],
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
