'use client';

import { motion } from 'framer-motion';
import { Building2, Handshake } from 'lucide-react';

// Placeholder partner data - replace with actual logos later
const partners = [
  {
    name: 'TechCorp Global',
    logo: 'https://via.placeholder.com/200x80/1a1a1a/ffffff?text=TechCorp',
    description: 'Leading Technology Solutions',
  },
  {
    name: 'Blockchain Ventures',
    logo: 'https://via.placeholder.com/200x80/2563eb/ffffff?text=BlockVentures',
    description: 'Blockchain Innovation',
  },
  {
    name: 'AI Systems Inc',
    logo: 'https://via.placeholder.com/200x80/7c3aed/ffffff?text=AI+Systems',
    description: 'Artificial Intelligence',
  },
  {
    name: 'Data Shield',
    logo: 'https://via.placeholder.com/200x80/059669/ffffff?text=DataShield',
    description: 'Cybersecurity Solutions',
  },
  {
    name: 'Innovation Labs',
    logo: 'https://via.placeholder.com/200x80/dc2626/ffffff?text=InnoLabs',
    description: 'Research & Development',
  },
  {
    name: 'Cloud Dynamics',
    logo: 'https://via.placeholder.com/200x80/ea580c/ffffff?text=CloudDyn',
    description: 'Cloud Infrastructure',
  },
  {
    name: 'FinTech Solutions',
    logo: 'https://via.placeholder.com/200x80/0891b2/ffffff?text=FinTech',
    description: 'Financial Technology',
  },
  {
    name: 'Quantum Computing Co',
    logo: 'https://via.placeholder.com/200x80/6366f1/ffffff?text=Quantum',
    description: 'Quantum Research',
  },
];

export default function PartnersSection() {
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
    hidden: { opacity: 0, scale: 0.9 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative py-20 lg:py-28 bg-background overflow-hidden">
      {/* Subtle Background */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.01]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="partner-pattern"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <rect x="0" y="0" width="100" height="100" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
              <circle cx="50" cy="50" r="1" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#partner-pattern)" />
        </svg>
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
            <Handshake className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary tracking-wide uppercase">
              Trusted Partners
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Who We <span className="text-brand-primary">Work With</span>
          </h2>

          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed">
            We're proud to partner with leading technology companies and innovative organizations
            across various industries.
          </p>
        </motion.div>

        {/* Partners Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 lg:gap-8"
        >
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              variants={itemVariants}
              className="group"
            >
              <div className="h-32 px-6 py-8 rounded-xl bg-card/50 border border-border/40 hover:border-brand-primary/30 hover:bg-card hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-500 flex items-center justify-center">
                <div className="text-center">
                  {/* Logo Placeholder */}
                  <div className="w-full h-12 mb-2 flex items-center justify-center opacity-60 group-hover:opacity-100 transition-opacity duration-300">
                    <Building2 className="w-10 h-10 text-muted-foreground group-hover:text-brand-primary transition-colors duration-300" />
                  </div>
                  {/* Partner Name */}
                  <h3 className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {partner.name}
                  </h3>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Trust Indicators */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 py-8 border-t border-border/50"
        >
          {[
            { number: '500+', label: 'Clients Served' },
            { number: '25+', label: 'Countries' },
            { number: '98%', label: 'Client Satisfaction' },
            { number: '10+', label: 'Years Experience' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-brand-primary mb-1">{stat.number}</div>
              <div className="text-sm text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}