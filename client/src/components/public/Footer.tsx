'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Mail,
  Phone,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
  Instagram,
  ArrowUpRight,
  Scale,
  Send,
} from 'lucide-react';
import { useState } from 'react';

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'About Us', href: '/about' },
  { label: 'Our Services', href: '/services' },
  { label: 'Our Team', href: '/team' },
  { label: 'Blog', href: '/blog' },
  { label: 'FAQs', href: '/faqs' },
  { label: 'Contact', href: '/contact' },
];

const practiceAreas = [
  { label: 'Artificial Intelligence Law', href: '/services#ai' },
  { label: 'Blockchain & Cryptocurrency', href: '/services#blockchain' },
  { label: 'Intellectual Property', href: '/services#ip' },
  { label: 'Smart Contract Auditing', href: '/services#smart-contracts' },
  { label: 'Regulatory Compliance', href: '/services#compliance' },
  { label: 'Corporate Advisory', href: '/services#corporate' },
];

const socialLinks = [
  { icon: Linkedin, href: '#', label: 'LinkedIn' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Instagram, href: '#', label: 'Instagram' },
];

export default function Footer() {
  const [email, setEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // TODO: Implement newsletter subscription
    await new Promise(resolve => setTimeout(resolve, 1000));

    setEmail('');
    setIsSubmitting(false);
  };

  return (
    <footer className="relative bg-background border-t border-border/50 overflow-hidden">
      {/* Decorative Background */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.01]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="footer-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="50" cy="50" r="1.5" fill="currentColor" opacity="0.5" />
              <circle cx="0" cy="0" r="1" fill="currentColor" opacity="0.3" />
              <circle cx="100" cy="0" r="1" fill="currentColor" opacity="0.3" />
              <circle cx="0" cy="100" r="1" fill="currentColor" opacity="0.3" />
              <circle cx="100" cy="100" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#footer-pattern)" />
        </svg>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full sm:w-[600px] h-[300px] bg-gradient-to-b from-brand-primary/5 to-transparent blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-16 lg:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
            {/* Brand Column */}
            <div className="lg:col-span-2 space-y-6">
              <Link href="/" className="inline-flex items-center space-x-3 group">
                <img
                  src="/logo.png"
                  alt="LightField Logo"
                  className="w-12 h-12 object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <div className="flex flex-col">
                  <div className="text-2xl font-bold tracking-tight leading-none">
                    <span className="text-foreground">LIGHT</span>
                    <span className="text-brand-primary">FIELD</span>
                  </div>
                  <div className="text-[10px] text-muted-foreground tracking-widest uppercase mt-0.5">
                    Legal Practitioners
                  </div>
                </div>
              </Link>

              <p className="text-muted-foreground leading-relaxed max-w-sm">
                Delivering forward-thinking, research-driven legal solutions that empower individuals, founders, and corporations in the digital era. Excellence in blockchain, Web3, technology law, and corporate advisory.
              </p>

              {/* Social Links */}
              <div className="flex items-center gap-3">
                {socialLinks.map((social, index) => {
                  const Icon = social.icon;
                  return (
                    <motion.a
                      key={index}
                      href={social.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      whileHover={{ scale: 1.1, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                      className="w-10 h-10 rounded-lg bg-muted/50 border border-border/50 flex items-center justify-center text-muted-foreground hover:text-brand-primary hover:border-brand-primary/40 hover:bg-brand-primary/5 transition-all duration-300"
                      aria-label={social.label}
                    >
                      <Icon className="w-4 h-4" />
                    </motion.a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold tracking-widest uppercase text-foreground">
                Quick Links
              </h3>
              <ul className="space-y-3">
                {quickLinks.map((link, index) => (
                  <li key={index}>
                    <Link
                      href={link.href}
                      className="text-muted-foreground hover:text-brand-primary transition-colors duration-300 text-sm inline-flex items-center gap-1 group"
                    >
                      <span>{link.label}</span>
                      <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 -translate-y-1 group-hover:translate-y-0 group-hover:translate-x-0.5 transition-all duration-300" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Practice Areas */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold tracking-widest uppercase text-foreground">
                Practice Areas
              </h3>
              <ul className="space-y-3">
                {practiceAreas.map((area, index) => (
                  <li key={index}>
                    <Link
                      href={area.href}
                      className="text-muted-foreground hover:text-brand-primary transition-colors duration-300 text-sm inline-flex items-start gap-1 group"
                    >
                      <span className="line-clamp-2">{area.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact & Newsletter */}
            <div className="space-y-6">
              <h3 className="text-sm font-bold tracking-widest uppercase text-foreground">
                Get in Touch
              </h3>

              {/* Contact Info */}
              <div className="space-y-4 text-sm">
                <a
                  href="mailto:lightfieldlegalpractitioners@gmail.com"
                  className="flex items-start gap-3 text-muted-foreground hover:text-brand-primary transition-colors duration-300 text-xs group"
                >
                  <Mail className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>lightfieldlegalpractitioners@gmail.com</span>
                </a>
                <a
                  href="tel:+2348148767744"
                  className="flex items-start gap-3 text-muted-foreground hover:text-brand-primary transition-colors duration-300 text-sm group"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+234 814 876 7744</span>
                </a>
                <a
                  href="tel:+2347032676039"
                  className="flex items-start gap-3 text-muted-foreground hover:text-brand-primary transition-colors duration-300 text-sm group"
                >
                  <Phone className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>+234 703 267 6039</span>
                </a>
                <div className="flex items-start gap-3 text-muted-foreground text-sm">
                  <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                  <span>Suite T7, 3rd Floor, Alibro Atrium Plaza, Utako District, FCT Abuja</span>
                </div>
              </div>

              {/* Newsletter Signup */}
              <div className="pt-4">
                <p className="text-xs text-muted-foreground mb-3">
                  Subscribe to our newsletter for legal insights
                </p>
                <form onSubmit={handleNewsletterSubmit} className="relative">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Your email"
                    required
                    className="w-full px-4 py-2.5 pr-12 text-sm rounded-lg bg-muted/50 border border-border/50 focus:border-brand-primary/40 focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all duration-300"
                  />
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="absolute right-1.5 top-1/2 -translate-y-1/2 w-8 h-8 rounded-md bg-brand-primary text-white flex items-center justify-center hover:bg-brand-primary/90 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/50" />

        {/* Bottom Bar */}
        <div className="py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
              <Scale className="w-4 h-4 text-brand-primary" />
              <span>
                © {new Date().getFullYear()} LightField Legal Practitioners. All rights reserved.
              </span>
            </div>

            <div className="flex items-center gap-6 text-xs sm:text-sm">
              <Link
                href="/privacy"
                className="text-muted-foreground hover:text-brand-primary transition-colors duration-300"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-muted-foreground hover:text-brand-primary transition-colors duration-300"
              >
                Terms of Service
              </Link>
              <Link
                href="/disclaimer"
                className="text-muted-foreground hover:text-brand-primary transition-colors duration-300"
              >
                Legal Disclaimer
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Bottom Accent */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent" />
    </footer>
  );
}
