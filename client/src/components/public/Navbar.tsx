'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../ThemeToggle';

const navItems = [
  { label: 'HOME', href: '/' },
  { label: 'WHAT WE DO', href: '/services' },
  { label: 'WHO WE ARE', href: '/about' },
  { label: 'OUR TEAM', href: '/team' },
  { label: 'BLOG', href: '/blog' },
  { label: 'GET IN TOUCH', href: '/contact' },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-24">
          {/* Logo - Left Aligned */}
          <Link href="/" className="flex items-center space-x-3 group">
            <img
              src="/logo.png"
              alt="LightField Logo"
              className="w-11 h-11 object-contain group-hover:scale-105 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <div className="text-xl font-bold tracking-tight leading-none">
                <span className="text-foreground">LIGHT</span>
                <span className="text-[var(--brand-primary)]">FIELD</span>
              </div>
              <div className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">
                Legal Practitioners
              </div>
            </div>
          </Link>

          {/* Desktop Navigation - Center */}
          <div className="hidden lg:flex items-center space-x-1 absolute left-1/2 -translate-x-1/2">
            {navItems.map((item, index) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative px-4 py-2 text-[11px] font-semibold tracking-widest text-muted-foreground hover:text-foreground transition-colors duration-300 group"
              >
                {item.label}
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-[var(--brand-primary)] group-hover:w-3/4 transition-all duration-300" />
              </Link>
            ))}
          </div>

          {/* Desktop Actions - Right Aligned */}
          <div className="hidden lg:flex items-center space-x-3">
            <button
              className="p-2.5 text-muted-foreground hover:text-foreground transition-colors duration-300 hover:bg-muted/50 rounded-lg"
              aria-label="Search"
            >
              <Search className="w-4 h-4" strokeWidth={2} />
            </button>
            <Button
              asChild
              className="bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 text-white font-bold text-xs tracking-widest px-6 py-5 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 uppercase"
            >
              <Link href="/contact">
                <span>Book a Call</span>
                <Plus className="w-4 h-4 ml-2" strokeWidth={3} />
              </Link>
            </Button>
            <ThemeToggle />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 text-foreground hover:bg-muted/50 rounded-lg transition-colors"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" strokeWidth={2} />
            ) : (
              <Menu className="w-6 h-6" strokeWidth={2} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="lg:hidden border-t border-border/40 bg-background/98 backdrop-blur-lg"
          >
            <div className="px-4 py-6 space-y-1 max-w-7xl mx-auto">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{
                    duration: 0.3,
                    delay: index * 0.05,
                    ease: [0.16, 1, 0.3, 1]
                  }}
                >
                  <Link
                    href={item.href}
                    className="block py-3 px-4 text-sm font-semibold tracking-wider text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.label}
                  </Link>
                </motion.div>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                transition={{ duration: 0.3, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="pt-4"
              >
                <Button
                  asChild
                  className="w-full bg-[var(--brand-primary)] hover:bg-[var(--brand-primary)]/90 text-white font-bold text-xs tracking-widest py-6 uppercase"
                >
                  <Link href="/contact" onClick={() => setMobileMenuOpen(false)}>
                    <span>Book a Call</span>
                    <Plus className="w-4 h-4 ml-2" strokeWidth={3} />
                  </Link>
                </Button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
