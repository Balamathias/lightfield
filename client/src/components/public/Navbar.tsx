'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Search, Plus, Loader2, ArrowRight, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '../ThemeToggle';
import { useBlogs } from '@/hooks/useBlogs';
import { useAssociates } from '@/hooks/useAssociates';

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
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  // Debounce search query
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch search results
  const { data: blogsData, isLoading: blogsLoading } = useBlogs({
    search: debouncedQuery || undefined,
  });

  const { data: associates, isLoading: associatesLoading } = useAssociates({
    search: debouncedQuery || undefined,
  });

  const blogs = blogsData?.results || [];
  const teamMembers = associates?.slice(0, 5) || [];

  const hasResults = blogs.length > 0 || teamMembers.length > 0;
  const isLoading = blogsLoading || associatesLoading;

  // Close search on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSearchOpen(false);
      }
    };

    if (searchOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [searchOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-lg border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-24">
            {/* Logo - Left Aligned */}
            <Link href="/" className="flex items-center space-x-3 group">
              <img
                src="/logo.png"
                alt="LightField Logo"
                className="w-10 h-10 sm:w-11 sm:h-11 object-contain group-hover:scale-105 transition-transform duration-300"
              />
              <div className="flex flex-col">
                <div className="text-xl font-bold tracking-tight leading-none">
                  <span className="text-foreground">LIGHT</span>
                  <span className="text-brand-primary">FIELD</span>
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
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-0 h-0.5 bg-brand-primary group-hover:w-3/4 transition-all duration-300" />
                </Link>
              ))}
            </div>

            {/* Desktop Actions - Right Aligned */}
            <div className="hidden lg:flex items-center space-x-3">
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2.5 text-muted-foreground hover:text-foreground transition-colors duration-300 hover:bg-muted/50 rounded-lg"
                aria-label="Search"
              >
                <Search className="w-4 h-4" strokeWidth={2} />
              </button>
              <Button
                asChild
                className="bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs tracking-widest px-6 py-5 rounded-sm shadow-lg hover:shadow-xl transition-all duration-300 uppercase"
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
                    className="w-full bg-brand-primary hover:bg-brand-primary/90 text-white font-bold text-xs tracking-widest py-6 uppercase"
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

      {/* Search Modal */}
      <AnimatePresence>
        {searchOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
              onClick={() => setSearchOpen(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-24 left-1/2 -translate-x-1/2 w-full max-w-2xl z-[70] px-4"
            >
              <div className="bg-card border border-border/60 rounded-2xl shadow-2xl overflow-hidden">
                {/* Search Input */}
                <div className="p-6 border-b border-border/50">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search blogs, team members..."
                      className="w-full pl-12 pr-4 py-4 bg-background rounded-lg border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 text-sm"
                      autoFocus
                    />
                  </div>
                </div>

                {/* Results */}
                <div className="max-h-[60vh] overflow-y-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="w-6 h-6 text-brand-primary animate-spin" />
                    </div>
                  ) : searchQuery && !hasResults ? (
                    <div className="py-12 text-center">
                      <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">No results found for "{searchQuery}"</p>
                    </div>
                  ) : searchQuery ? (
                    <div className="p-4 space-y-6">
                      {/* Blog Results */}
                      {blogs.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                            Articles ({blogs.length})
                          </h3>
                          <div className="space-y-1">
                            {blogs.map((blog) => (
                              <Link
                                key={blog.id}
                                href={`/blog/${blog.slug}`}
                                onClick={() => setSearchOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                              >
                                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <FileText className="w-4 h-4 text-brand-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm group-hover:text-brand-primary transition-colors line-clamp-1">
                                    {blog.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1 mt-0.5">
                                    {blog.excerpt}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-primary opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-1" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Team Results */}
                      {teamMembers.length > 0 && (
                        <div>
                          <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-2">
                            Team Members ({teamMembers.length})
                          </h3>
                          <div className="space-y-1">
                            {teamMembers.map((member) => (
                              <Link
                                key={member.id}
                                href={`/team/${member.slug}`}
                                onClick={() => setSearchOpen(false)}
                                className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors group"
                              >
                                {member.image_url ? (
                                  <img
                                    src={member.image_url}
                                    alt={member.name}
                                    className="w-8 h-8 rounded-full object-cover flex-shrink-0"
                                  />
                                ) : (
                                  <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0">
                                    <User className="w-4 h-4 text-brand-primary" />
                                  </div>
                                )}
                                <div className="flex-1 min-w-0">
                                  <h4 className="font-medium text-sm group-hover:text-brand-primary transition-colors">
                                    {member.name}
                                  </h4>
                                  <p className="text-xs text-muted-foreground line-clamp-1">
                                    {member.title}
                                  </p>
                                </div>
                                <ArrowRight className="w-4 h-4 text-muted-foreground group-hover:text-brand-primary opacity-0 group-hover:opacity-100 transition-all flex-shrink-0 mt-1" />
                              </Link>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="py-12 text-center">
                      <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
                      <p className="text-muted-foreground text-sm">Type to search blogs and team members</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
