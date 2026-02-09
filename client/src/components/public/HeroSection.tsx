'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowRight, Award } from 'lucide-react';

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background pt-16 sm:pt-20">
      {/* Advanced Animated Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Gradient Glow Orbs */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.12, scale: 1 }}
          transition={{ duration: 2, ease: 'easeOut' }}
          className="absolute -top-20 -right-20 w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] lg:w-[900px] lg:h-[900px] rounded-full bg-gradient-to-br from-primary to-brand-secondary blur-3xl"
        />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 0.08, scale: 1 }}
          transition={{ duration: 2.5, delay: 0.3, ease: 'easeOut' }}
          className="absolute -bottom-20 -left-20 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] lg:w-[700px] lg:h-[700px] rounded-full bg-gradient-to-tr from-brand-secondary to-primary blur-3xl"
        />

        {/* Hexagonal Grid Pattern (Blockchain Vibes) */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.15] dark:opacity-[0.08]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="hexagon-pattern"
              x="0"
              y="0"
              width="100"
              height="86.6"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M50 0 L93.3 25 L93.3 75 L50 100 L6.7 75 L6.7 25 Z"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                opacity="0.4"
              />
              <path
                d="M0 43.3 L43.3 68.3 L43.3 118.3"
                stroke="currentColor"
                strokeWidth="0.5"
                fill="none"
                opacity="0.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#hexagon-pattern)" />
        </svg>

        {/* Floating Particles - Reduced on mobile */}
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-primary hidden sm:block"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -40, 0],
              x: [0, Math.random() * 30 - 15, 0],
              opacity: [0.4, 0.8, 0.4],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 4 + Math.random() * 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: 'easeInOut',
            }}
          />
        ))}

        {/* Molecular Structure Pattern */}
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.12] dark:opacity-[0.06]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="molecular-grid"
              x="0"
              y="0"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="60" cy="60" r="2" fill="currentColor" opacity="0.4" />
              <circle cx="0" cy="0" r="2" fill="currentColor" opacity="0.4" />
              <circle cx="120" cy="0" r="2" fill="currentColor" opacity="0.4" />
              <circle cx="0" cy="120" r="2" fill="currentColor" opacity="0.4" />
              <circle cx="120" cy="120" r="2" fill="currentColor" opacity="0.4" />
              <line
                x1="60"
                y1="60"
                x2="0"
                y2="0"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <line
                x1="60"
                y1="60"
                x2="120"
                y2="0"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <line
                x1="60"
                y1="60"
                x2="0"
                y2="120"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.2"
              />
              <line
                x1="60"
                y1="60"
                x2="120"
                y2="120"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.2"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#molecular-grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-10 sm:gap-16 lg:gap-20 items-center">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-10">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 sm:gap-2.5 px-3 sm:px-5 py-2 sm:py-2.5 rounded-full bg-primary/5 border border-primary/20"
            >
              <Award className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
              <span className="text-xs sm:text-sm font-medium text-primary tracking-wide">
                Premier Legal Counsel
              </span>
            </motion.div>

            {/* Main Heading - Using Serif Font */}
            <div className="space-y-4 sm:space-y-6">
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                className="text-3xl sm:text-5xl lg:text-6xl xl:text-7xl font-serif font-bold leading-[1.15] sm:leading-[1.1] tracking-tight"
              >
                <span className="block text-foreground">Your Trusted Legal</span>
                <span className="block text-foreground">Partner in a</span>
                <span className="block text-primary">
                  Fast-Changing Digital World
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-sm sm:text-lg lg:text-xl text-muted-foreground max-w-xl leading-relaxed"
              >
                <span className="hidden sm:inline">Here at Lightfield LP, we provide innovative, research-grounded advisory and litigation services across blockchain, digital assets, technology law, corporate law, and data protection. Empowering businesses and emerging industries with clarity, compliance, and sustainable growth.</span>
                <span className="sm:hidden">Innovative legal solutions across blockchain, digital assets, technology law, and data protection. Empowering businesses with clarity and compliance.</span>
              </motion.p>
            </div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-3 sm:gap-4"
            >
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 cursor-pointer text-white font-semibold text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300 group z-10 rounded-xl"
              >
                <Link href="/services">
                  <span>Our Services</span>
                  <ArrowRight className="ml-2 w-4 h-4 sm:w-5 sm:h-5 group-hover:translate-x-1 transition-transform duration-300" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="hover:border-primary/50 cursor-pointer font-semibold text-sm sm:text-base px-6 sm:px-8 py-5 sm:py-6 hover:bg-primary/5 transition-all duration-300 z-10 rounded-xl"
              >
                <Link href="/consultations">Schedule Consultation</Link>
              </Button>
            </motion.div>

            {/* Credentials - Hidden on mobile, visible on larger screens */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="hidden sm:block pt-8 border-t border-border/50"
            >
              <div className="flex flex-wrap gap-6 sm:gap-8 items-center">
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Practice Areas
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-foreground">
                    AI & Blockchain
                  </div>
                </div>
                <div className="w-px h-10 sm:h-12 bg-border/50" />
                <div>
                  <div className="text-xs sm:text-sm text-muted-foreground mb-1">
                    Jurisdictions
                  </div>
                  <div className="text-base sm:text-lg font-semibold text-foreground">
                    Multi-National
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Mobile-only compact credentials */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="sm:hidden flex gap-4 pt-4"
            >
              <div className="flex-1 text-center p-3 rounded-lg bg-muted/30 border border-border/40">
                <div className="text-xs text-muted-foreground mb-0.5">Practice</div>
                <div className="text-sm font-semibold text-foreground">AI & Blockchain</div>
              </div>
              <div className="flex-1 text-center p-3 rounded-lg bg-muted/30 border border-border/40">
                <div className="text-xs text-muted-foreground mb-0.5">Reach</div>
                <div className="text-sm font-semibold text-foreground">Multi-National</div>
              </div>
            </motion.div>
          </div>

          {/* Right Visual - Professional Image Composition */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative flex lg:block"
          >
            <div className="relative w-full h-[500px] lg:h-[600px] max-w-[500px] lg:max-w-[600px] mx-auto">
              {/* Animated Background Rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-primary/10"
                style={{ transform: 'scale(0.9)' }}
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 80, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 rounded-full border border-dashed border-primary/5"
                style={{ transform: 'scale(1.1)' }}
              />

              {/* Main Image - Nigerian Justice (Background) */}
              <motion.img
                src="/people/eth.jpg"
                alt="Ethereum Pyramidal"
                initial={{ opacity: 0, scale: 1.1, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute top-0 right-0 w-[380px] lg:w-[450px] h-[280px] lg:h-[350px] object-cover rounded-2xl shadow-2xl border-4 border-background"
              />

              {/* Accent Glow Behind Main Image */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.4 }}
                transition={{ duration: 1.5, delay: 0.6 }}
                className="absolute top-0 right-0 w-[380px] lg:w-[450px] h-[280px] lg:h-[350px] bg-gradient-to-br from-primary to-brand-secondary rounded-2xl blur-2xl -z-10"
              />

              {/* Overlapping Image - Two Lawyers (Foreground) */}
              <motion.img
                src="/people/two-lawyers.png"
                alt="Professional Legal Team"
                initial={{ opacity: 0.1, scale: 0.9, x: -30, y: 30 }}
                animate={{ opacity: 1, scale: 1, x: 0, y: 0 }}
                transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-0 left-0 w-[320px] lg:w-[380px] h-[350px] lg:h-[420px] object-cover rounded-2xl shadow-2xl border-4 border-background"
              />

              {/* Accent Glow Behind Foreground Image */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.3 }}
                transition={{ duration: 1.5, delay: 0.9 }}
                className="absolute bottom-0 left-0 w-[320px] lg:w-[380px] h-[350px] lg:h-[420px] bg-gradient-to-tl from-primary to-brand-secondary rounded-2xl blur-2xl -z-10"
              />

              {/* Floating Stat Badges */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1.2, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, y: -5 }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-background/95 backdrop-blur-md border border-border/50 rounded-xl px-4 lg:px-6 py-3 lg:py-4 shadow-xl cursor-default"
              >
                <div className="text-center">
                  <div className="text-[10px] lg:text-xs text-muted-foreground tracking-wide">
                    Get Started
                  </div>
                </div>
              </motion.div>

              {/* Top Right Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, rotate: 5 }}
                className="absolute top-4 right-8 lg:right-12 bg-primary text-white rounded-lg px-3 lg:px-4 py-1.5 lg:py-2 shadow-lg cursor-default"
              >
                <div className="text-[10px] lg:text-xs font-bold tracking-widest uppercase">
                  AI & Blockchain Experts
                </div>
              </motion.div>

              {/* Bottom Left Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ scale: 1.05, rotate: -5 }}
                className="absolute bottom-12 lg:bottom-16 left-8 lg:left-12 bg-background/95 backdrop-blur-md border border-primary/30 rounded-lg px-3 lg:px-4 py-1.5 lg:py-2 shadow-lg cursor-default"
              >
                <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 rounded-full bg-green-500 animate-pulse" />
                  <div className="text-[10px] lg:text-xs font-semibold text-foreground">
                    Available Now
                  </div>
                </div>
              </motion.div>

              {/* Animated Connecting Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none">
                <motion.path
                  d="M 50 50 Q 300 250 550 450"
                  stroke="var(--brand-primary)"
                  strokeWidth="1"
                  fill="none"
                  strokeDasharray="5,5"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 0.2 }}
                  transition={{ duration: 2, delay: 1.8, ease: 'easeInOut' }}
                />
              </svg>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Refined Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2, delay: 1 }}
        className="absolute bottom-6 sm:bottom-12 left-1/2 -translate-x-1/2 hidden sm:block"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          className="w-5 h-8 sm:w-6 sm:h-10 rounded-full border-2 border-primary/30 flex justify-center p-1.5 sm:p-2"
        >
          <motion.div className="w-1 h-1.5 sm:h-2 rounded-full bg-primary/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
