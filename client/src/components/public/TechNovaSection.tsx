'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Calendar, Clock, MapPin, ArrowRight, Zap } from 'lucide-react';

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

const quickFacts = [
  { icon: Calendar, text: 'March 14, 2026' },
  { icon: Clock, text: 'Full-day event' },
  { icon: MapPin, text: 'Abakaliki, Ebonyi State' },
];

export default function TechNovaSection() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      {/* Circuit-board SVG background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-background via-muted/30 to-background" />
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.015]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="technova-circuit"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M10 50 H40 M60 50 H90 M50 10 V40 M50 60 V90"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                opacity="0.4"
              />
              <circle cx="50" cy="50" r="3" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3" />
              <circle cx="10" cy="50" r="1.5" fill="currentColor" opacity="0.3" />
              <circle cx="90" cy="50" r="1.5" fill="currentColor" opacity="0.3" />
              <circle cx="50" cy="10" r="1.5" fill="currentColor" opacity="0.3" />
              <circle cx="50" cy="90" r="1.5" fill="currentColor" opacity="0.3" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#technova-circuit)" />
        </svg>

        {/* Gradient Accents */}
        <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-gradient-to-bl from-brand-primary/8 to-transparent blur-3xl rounded-full" />
        <div className="absolute bottom-1/3 left-0 w-[400px] h-[400px] bg-gradient-to-tr from-brand-secondary/5 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="relative"
        >
          <div className="relative bg-card/80 backdrop-blur-sm border border-border/60 rounded-3xl p-8 sm:p-12 lg:p-16 overflow-hidden">
            {/* Inner gradient accents */}
            <div className="absolute top-0 right-0 w-80 h-80 bg-gradient-to-bl from-brand-primary/10 to-transparent rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 w-60 h-60 bg-gradient-to-tr from-[#1a1a2e]/10 to-transparent rounded-full blur-3xl" />

            <div className="relative grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
              {/* Left - Text Content */}
              <div>
                <motion.div
                  variants={itemVariants}
                  className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-8"
                >
                  <Zap className="w-4 h-4 text-brand-primary" />
                  <span className="text-sm font-medium text-brand-primary tracking-wide">
                    TechNova Summit 2026
                  </span>
                </motion.div>

                <motion.h2
                  variants={itemVariants}
                  className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight"
                >
                  Tech. Innovation.{' '}
                  <span className="text-brand-primary">Opportunity.</span>
                </motion.h2>

                <motion.p
                  variants={itemVariants}
                  className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-8"
                >
                  TechNova Summit 2026 is a free, one-day tech conference
                  bringing together innovators, legal minds, and tech enthusiasts in
                  Abakaliki, Ebonyi State. Our Managing Partner, Balogun Sofiyullahi,
                  will be speaking at the event.
                </motion.p>

                {/* Quick Facts */}
                <motion.div variants={itemVariants} className="flex flex-wrap gap-4 mb-8">
                  {quickFacts.map((fact) => {
                    const Icon = fact.icon;
                    return (
                      <div
                        key={fact.text}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <Icon className="w-4 h-4 text-brand-primary" />
                        <span>{fact.text}</span>
                      </div>
                    );
                  })}
                </motion.div>

                {/* CTA Buttons */}
                <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4">
                  <Button
                    asChild
                    size="lg"
                    className="bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold px-8 py-6 rounded-xl shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 transition-all duration-300 group"
                  >
                    <a href="https://technovasummit.com" target="_blank" rel="noopener noreferrer">
                      <Zap className="mr-2 w-5 h-5" />
                      <span>Register Free</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </a>
                  </Button>
                  <Button
                    asChild
                    size="lg"
                    variant="outline"
                    className="font-semibold px-8 py-6 rounded-xl hover:bg-brand-primary/5 hover:border-brand-primary/40 transition-all duration-300"
                  >
                    <Link href="/technova">Learn More</Link>
                  </Button>
                </motion.div>
              </div>

              {/* Right - Video */}
              <motion.div variants={itemVariants} className="relative">
                {/* Glow behind video */}
                <div className="absolute -inset-4 bg-brand-primary/10 blur-3xl rounded-3xl" />
                <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-brand-primary/10 border border-border/40">
                  <video
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster="/videos/technova-poster.jpg"
                    className="w-full aspect-[4/5] object-cover"
                  >
                    <source src="/videos/technova.mp4" type="video/mp4" />
                  </video>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
