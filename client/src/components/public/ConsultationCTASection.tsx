'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { CalendarCheck, ArrowRight, Clock, Shield, Scale } from 'lucide-react';

const highlights = [
  {
    icon: Clock,
    text: 'Flexible scheduling',
  },
  {
    icon: Shield,
    text: 'Secure & confidential',
  },
  {
    icon: Scale,
    text: 'Expert legal counsel',
  },
];

const containerVariants: any = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const itemVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.16, 1, 0.3, 1],
    },
  },
};

export default function ConsultationCTASection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-brand-primary/[0.03] via-background to-brand-secondary/[0.03]" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.025] dark:opacity-[0.012]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="cta-pattern"
              x="0"
              y="0"
              width="60"
              height="60"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M30 0 L60 30 L30 60 L0 30Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.3"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#cta-pattern)" />
        </svg>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/5 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="relative"
        >
          {/* Main Card */}
          <div className="relative bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Inner gradient accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-brand-secondary/10 to-transparent rounded-full blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left Content */}
              <div>
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-8"
                >
                  <CalendarCheck className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-medium text-brand-primary tracking-wide">
                    Book a Consultation
                  </span>
                </motion.div>

                <motion.h2
                  variants={itemVariants}
                  className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight"
                >
                  Get Expert{' '}
                  <span className="text-brand-primary">Legal Guidance</span>{' '}
                  Today
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8"
                >
                  Schedule a consultation with our specialized attorneys in AI law,
                  blockchain regulation, data privacy, and emerging technology.
                  We're here to protect your interests.
                </motion.p>

                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold px-8 py-6 rounded-xl shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all duration-300 group"
                  >
                    <Link href="/consultations">
                      <CalendarCheck className="mr-2 w-5 h-5" />
                      <span>Schedule Consultation</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="font-semibold px-8 py-6 rounded-xl hover:bg-brand-primary/5 hover:border-brand-primary/40 transition-all duration-300"
                  >
                    <Link href="/services">View Our Services</Link>
                  </Button>
                </motion.div>
              </div>

              {/* Right Content - Highlights */}
              <div className="space-y-6">
                {highlights.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.div
                      key={index}
                      variants={itemVariants}
                      className="group flex items-center gap-5 p-5 rounded-2xl bg-background/60 border border-border/40 hover:border-brand-primary/30 hover:shadow-lg hover:shadow-brand-primary/5 transition-all duration-500"
                    >
                      <div className="flex-shrink-0 w-14 h-14 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center group-hover:bg-brand-primary/15 group-hover:scale-110 transition-all duration-500">
                        <Icon className="w-7 h-7 text-brand-primary" strokeWidth={1.5} />
                      </div>
                      <span className="text-lg font-medium text-foreground">
                        {item.text}
                      </span>
                    </motion.div>
                  );
                })}

                {/* Trust badge */}
                <motion.div
                  variants={itemVariants}
                  className="flex items-center gap-3 pt-4 pl-5"
                >
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-brand-primary/20 to-brand-secondary/20 border-2 border-background flex items-center justify-center"
                      >
                        <span className="text-xs font-bold text-brand-primary">
                          {String.fromCharCode(64 + i)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Trusted by <span className="font-semibold text-foreground">100+</span> clients
                  </p>
                </motion.div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
