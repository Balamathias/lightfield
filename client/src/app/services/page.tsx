'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import {
  Scale,
  Brain,
  Link2,
  Shield,
  FileText,
  Gavel,
  Users,
  Briefcase,
  ArrowRight,
  CheckCircle2,
  Sparkles,
} from 'lucide-react';
import Link from 'next/link';

const services = [
  {
    icon: Brain,
    title: 'AI & Machine Learning Law',
    description: 'Navigate the complex regulatory landscape of artificial intelligence and machine learning technologies.',
    features: [
      'AI ethics and compliance',
      'Algorithm auditing and bias testing',
      'Data privacy in AI systems',
      'Regulatory compliance (EU AI Act, etc.)',
      'Intellectual property in AI',
    ],
    color: 'from-blue-500/10 to-cyan-500/10',
    iconColor: 'text-blue-500',
  },
  {
    icon: Link2,
    title: 'Blockchain & Cryptocurrency',
    description: 'Expert guidance on blockchain technology, smart contracts, and digital asset regulations.',
    features: [
      'Token launches and ICO compliance',
      'Smart contract legal review',
      'DeFi protocol structuring',
      'NFT legal frameworks',
      'Crypto exchange licensing',
    ],
    color: 'from-purple-500/10 to-pink-500/10',
    iconColor: 'text-purple-500',
  },
  {
    icon: Shield,
    title: 'Data Protection & Privacy',
    description: 'Comprehensive data protection strategies and GDPR/CCPA compliance solutions.',
    features: [
      'GDPR & CCPA compliance',
      'Privacy policy drafting',
      'Data breach response',
      'Cross-border data transfers',
      'Privacy impact assessments',
    ],
    color: 'from-green-500/10 to-emerald-500/10',
    iconColor: 'text-green-500',
  },
  {
    icon: FileText,
    title: 'Technology Contracts',
    description: 'Drafting and negotiating complex technology agreements and SaaS contracts.',
    features: [
      'SaaS agreements',
      'API and integration contracts',
      'Software licensing',
      'Cloud service agreements',
      'Technology procurement',
    ],
    color: 'from-orange-500/10 to-red-500/10',
    iconColor: 'text-orange-500',
  },
  {
    icon: Gavel,
    title: 'Intellectual Property',
    description: 'Protect your innovations with comprehensive IP strategy and enforcement.',
    features: [
      'Patent prosecution',
      'Trademark registration',
      'Copyright protection',
      'Trade secret management',
      'IP litigation support',
    ],
    color: 'from-indigo-500/10 to-violet-500/10',
    iconColor: 'text-indigo-500',
  },
  {
    icon: Briefcase,
    title: 'Corporate & Commercial',
    description: 'Strategic legal counsel for tech startups and established enterprises.',
    features: [
      'Business formation and structuring',
      'Venture capital and fundraising',
      'Mergers and acquisitions',
      'Commercial transactions',
      'Corporate governance',
    ],
    color: 'from-amber-500/10 to-yellow-500/10',
    iconColor: 'text-amber-500',
  },
];

const whyChooseUs = [
  {
    title: 'Deep Technical Expertise',
    description: 'Our team combines legal expertise with technical knowledge in emerging technologies.',
  },
  {
    title: 'Proactive Compliance',
    description: 'Stay ahead of regulatory changes with our forward-thinking compliance strategies.',
  },
  {
    title: 'Global Perspective',
    description: 'Navigate international regulations with our cross-border legal experience.',
  },
  {
    title: 'Innovation-Focused',
    description: 'We understand the needs of innovative companies pushing technological boundaries.',
  },
];

export default function ServicesPage() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 lg:pt-40 lg:pb-20 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.01]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="services-grid"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#services-grid)" />
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-primary/5 to-transparent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-8">
              <Scale className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-medium text-brand-primary tracking-wide">
                Our Practice Areas
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Expert Legal Services for <span className="text-brand-primary">Emerging Tech</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-12">
              LightField Legal Practitioners specializes in providing comprehensive legal solutions
              for companies at the forefront of technological innovation.
            </p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="flex flex-wrap items-center justify-center gap-4"
            >
              <Link
                href="/contact"
                className="px-8 py-4 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 inline-flex items-center gap-2"
              >
                <span>Schedule Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/team"
                className="px-8 py-4 rounded-lg border-2 border-border/50 hover:border-brand-primary/40 font-semibold hover:bg-brand-primary/5 transition-all duration-300 inline-flex items-center gap-2"
              >
                <Users className="w-5 h-5" />
                <span>Meet Our Team</span>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {services.map((service, index) => (
              <motion.div
                key={service.title}
                variants={itemVariants as any}
                className="group relative"
              >
                <div className="h-full p-8 rounded-2xl bg-card border border-border/60 hover:border-brand-primary/40 hover:shadow-2xl hover:shadow-brand-primary/10 transition-all duration-500">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${service.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500`}>
                    <service.icon className={`w-7 h-7 ${service.iconColor}`} />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-xl font-serif font-bold mb-3 group-hover:text-brand-primary transition-colors duration-300">
                    {service.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                    {service.description}
                  </p>

                  {/* Features List */}
                  <ul className="space-y-2.5">
                    {service.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-2 text-sm">
                        <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                        <span className="text-muted-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Learn More Link */}
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-2 mt-6 text-sm font-semibold text-brand-primary hover:gap-3 transition-all duration-300"
                  >
                    <span>Learn More</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-16 lg:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-6">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-medium text-brand-primary tracking-wide">
                Why Choose Us
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
              Your Trusted Legal Partner in Innovation
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              We combine deep legal expertise with technical knowledge to provide
              unparalleled counsel for technology-driven businesses.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={item.title}
                variants={itemVariants as any}
                className="text-center p-6"
              >
                <div className="w-12 h-12 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 rounded-full bg-brand-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative rounded-3xl bg-gradient-to-br from-brand-primary/10 via-background to-brand-secondary/10 border border-brand-primary/20 p-12 lg:p-16 overflow-hidden"
          >
            <div className="absolute inset-0 -z-10 opacity-50">
              <svg
                className="absolute inset-0 w-full h-full"
                xmlns="http://www.w3.org/2000/svg"
              >
                <defs>
                  <pattern
                    id="cta-pattern"
                    x="0"
                    y="0"
                    width="40"
                    height="40"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="20" cy="20" r="1" fill="currentColor" opacity="0.2" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#cta-pattern)" />
              </svg>
            </div>

            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
                Ready to Get Started?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Schedule a consultation with our expert legal team to discuss how we can
                help your business navigate the complexities of emerging technology law.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30"
              >
                <span>Schedule Consultation</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
