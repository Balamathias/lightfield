'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Shield, Scale, Blocks, Brain, FileCode, Users, ArrowRight, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: 'Artificial Intelligence Law',
    description:
      'Navigate the complexities of AI regulation, data governance, and algorithmic accountability. We provide strategic counsel on AI deployment, liability frameworks, and compliance with emerging AI legislation.',
  },
  {
    icon: Blocks,
    title: 'Blockchain & Cryptocurrency',
    description:
      'Specialized expertise in blockchain technology, smart contracts, tokenization, and digital asset regulation. From DeFi protocols to NFT marketplaces, we ensure legal clarity in decentralized ecosystems.',
  },
  {
    icon: Shield,
    title: 'Intellectual Property',
    description:
      'Comprehensive IP protection for technology innovations. Patent strategy, trademark registration, trade secret protection, and licensing agreements tailored for emerging tech enterprises.',
  },
  // {
  //   icon: FileCode,
  //   title: 'Smart Contract Auditing',
  //   description:
  //     'Legal review and risk assessment of smart contracts and decentralized protocols. We identify legal vulnerabilities, regulatory compliance gaps, and contractual ambiguities before deployment.',
  // },
  // {
  //   icon: Scale,
  //   title: 'Regulatory Compliance',
  //   description:
  //     'Stay ahead of evolving regulations in AI, blockchain, and digital assets. We provide proactive compliance strategies, regulatory filings, and ongoing counsel to navigate global tech regulatory landscapes.',
  // },
  // {
  //   icon: Users,
  //   title: 'Corporate Advisory',
  //   description:
  //     'Strategic legal counsel for tech startups and enterprises. Entity formation, fundraising documentation, M&A transactions, and corporate governance tailored to the unique needs of technology companies.',
  // },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function FeaturesSection() {
  return (
    <section className="relative py-24 lg:py-32 bg-gradient-to-b from-background via-muted/20 to-background overflow-hidden">
      {/* Refined Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.015]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="features-grid"
              x="0"
              y="0"
              width="80"
              height="80"
              patternUnits="userSpaceOnUse"
            >
              <circle cx="40" cy="40" r="1.5" fill="currentColor" opacity="0.4" />
              <circle cx="0" cy="0" r="1" fill="currentColor" opacity="0.2" />
              <circle cx="80" cy="0" r="1" fill="currentColor" opacity="0.2" />
              <circle cx="0" cy="80" r="1" fill="currentColor" opacity="0.2" />
              <circle cx="80" cy="80" r="1" fill="currentColor" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#features-grid)" />
        </svg>

        {/* Gradient Accents */}
        <div className="absolute top-1/4 left-1/4 w-full sm:w-[500px] h-[500px] bg-gradient-to-br from-brand-primary/5 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-1/4 right-1/4 w-full sm:w-[400px] h-[400px] bg-gradient-to-tl from-brand-secondary/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="text-center max-w-3xl mx-auto mb-20"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-8"
          >
            <Sparkles className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary tracking-wide">
              Practice Areas
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight"
          >
            Specialized{' '}
            <span className="text-brand-primary">Legal Services</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-sm md:text-lg lg:text-xl text-muted-foreground leading-relaxed"
          >
            Expert counsel at the intersection of law and emerging technology
          </motion.p>
        </motion.div>

        {/* Feature Cards */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={containerVariants}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16"
        >
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{
                  y: -8,
                  transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
                }}
                className="group relative"
              >
                <div className="relative h-full bg-card border border-border/60 rounded-2xl p-8 hover:border-brand-primary/40 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-primary/10">
                  {/* Gradient Background Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/5 via-transparent to-brand-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl" />

                  {/* Animated Border Accent */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-brand-primary/20 via-transparent to-brand-secondary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl -z-10" />

                  {/* Icon Container */}
                  <div className="relative mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-xl bg-brand-primary/10 border border-brand-primary/20 group-hover:bg-brand-primary/15 group-hover:scale-110 transition-all duration-500 shadow-lg shadow-brand-primary/10">
                      <Icon className="w-8 h-8 text-brand-primary" strokeWidth={1.5} />
                    </div>
                  </div>

                  {/* Content */}
                  <div className="relative">
                    <h3 className="text-xl font-serif font-bold mb-3 text-foreground group-hover:text-brand-primary transition-colors duration-500">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed sm:text-[15px]">
                      {feature.description}
                    </p>
                  </div>

                  {/* Hover Indicator */}
                  <motion.div
                    className="absolute bottom-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                    initial={{ x: -10 }}
                    whileHover={{ x: 0 }}
                  >
                    <div className="w-8 h-8 rounded-full bg-brand-primary/10 flex items-center justify-center">
                      <ArrowRight className="w-4 h-4 text-brand-primary" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
