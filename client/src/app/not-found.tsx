'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Home, ArrowLeft, Search } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Minimal Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.01]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="not-found-grid"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.4" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#not-found-grid)" />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-br from-brand-primary/5 to-transparent blur-3xl rounded-full" />
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="space-y-8"
        >
          {/* 404 Number */}
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <h1 className="text-9xl sm:text-[12rem] font-serif font-bold text-brand-primary/10 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 sm:w-20 sm:h-20 text-brand-primary/30" />
            </div>
          </motion.div>

          {/* Message */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="space-y-4"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold text-foreground">
              Page Not Found
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mx-auto">
              The page you're looking for doesn't exist or has been moved.
            </p>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-brand-primary/20 group"
            >
              <Home className="w-4 h-4" />
              <span>Go Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-background border-2 border-border text-foreground font-semibold hover:border-brand-primary/40 hover:bg-muted/50 transition-all duration-300"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go Back</span>
            </button>
          </motion.div>

          {/* Quick Links */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="pt-8 border-t border-border/50 mt-12"
          >
            <p className="text-sm text-muted-foreground mb-4">Quick Links</p>
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              <Link
                href="/about"
                className="text-muted-foreground hover:text-brand-primary transition-colors"
              >
                About Us
              </Link>
              <span className="text-muted-foreground/30">•</span>
              <Link
                href="/services"
                className="text-muted-foreground hover:text-brand-primary transition-colors"
              >
                Services
              </Link>
              <span className="text-muted-foreground/30">•</span>
              <Link
                href="/team"
                className="text-muted-foreground hover:text-brand-primary transition-colors"
              >
                Our Team
              </Link>
              <span className="text-muted-foreground/30">•</span>
              <Link
                href="/blog"
                className="text-muted-foreground hover:text-brand-primary transition-colors"
              >
                Blog
              </Link>
              <span className="text-muted-foreground/30">•</span>
              <Link
                href="/contact"
                className="text-muted-foreground hover:text-brand-primary transition-colors"
              >
                Contact
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
