'use client';

import { motion } from 'framer-motion';
import { Calendar, Clock, MapPin, Ticket } from 'lucide-react';

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

const eventDetails = [
  { icon: Calendar, label: 'Date', value: 'March 14, 2026' },
  { icon: Clock, label: 'Time', value: 'Full-day event' },
  { icon: MapPin, label: 'Venue', value: 'Abakaliki, Ebonyi State' },
  { icon: Ticket, label: 'Registration', value: 'Free — Open to all' },
];

export default function TechNovaAbout() {
  return (
    <section id="about" className="relative py-24 lg:py-32 overflow-hidden">
      {/* Circuit-board SVG background */}
      <div className="absolute inset-0 -z-10">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.02]"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="tn-about-circuit"
              x="0"
              y="0"
              width="120"
              height="120"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M20 60 H50 M70 60 H100 M60 20 V50 M60 70 V100"
                fill="none"
                stroke="white"
                strokeWidth="0.5"
                opacity="0.3"
              />
              <circle cx="60" cy="60" r="3" fill="none" stroke="white" strokeWidth="0.5" opacity="0.25" />
              <circle cx="20" cy="60" r="1.5" fill="white" opacity="0.2" />
              <circle cx="100" cy="60" r="1.5" fill="white" opacity="0.2" />
              <circle cx="60" cy="20" r="1.5" fill="white" opacity="0.2" />
              <circle cx="60" cy="100" r="1.5" fill="white" opacity="0.2" />
              <rect x="55" y="55" width="10" height="10" fill="none" stroke="white" strokeWidth="0.3" opacity="0.15" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#tn-about-circuit)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center"
        >
          {/* Left - Text Content */}
          <div>
            <motion.div
              variants={itemVariants}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8"
            >
              <span className="text-sm font-medium text-white/70 tracking-wide">
                About the Summit
              </span>
            </motion.div>

            <motion.h2
              variants={itemVariants}
              className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight text-white"
            >
              Where Law Meets{' '}
              <span className="text-brand-primary">Technology</span>
            </motion.h2>

            <motion.div variants={itemVariants} className="space-y-5 text-white/70 text-base sm:text-lg leading-relaxed">
              <p>
                TechNova Summit 2026 is a groundbreaking one-day conference that
                bridges the gap between legal innovation and emerging technology.
                Backed by the Ebonyi State Government, this summit brings
                together industry leaders, legal professionals, government
                officials, and tech enthusiasts.
              </p>
              <p>
                Our Managing Partner, Balogun Sofiyullahi, will be speaking at the
                summit — sharing insights on how AI, blockchain, and emerging
                technologies are reshaping industries and the legal frameworks
                needed to govern them responsibly.
              </p>
              <p>
                Whether you&apos;re a founder, developer, legal professional, or
                simply curious about the future of tech and law — TechNova Summit
                is your gateway to understanding what&apos;s next.
              </p>
            </motion.div>
          </div>

          {/* Right - Event Details Card */}
          <motion.div variants={itemVariants} className="relative">
            {/* Glow behind card */}
            <div className="absolute -inset-4 bg-brand-primary/8 blur-3xl rounded-3xl" />

            <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-8 sm:p-10">
              <h3 className="text-xl font-serif font-bold text-white mb-8">
                Event Details
              </h3>

              <div className="space-y-6">
                {eventDetails.map((detail) => {
                  const Icon = detail.icon;
                  return (
                    <div key={detail.label} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 flex items-center justify-center">
                        <Icon className="w-5 h-5 text-brand-primary" strokeWidth={1.5} />
                      </div>
                      <div>
                        <p className="text-sm text-white/50 mb-0.5">{detail.label}</p>
                        <p className="text-white font-medium">{detail.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Divider */}
              <div className="h-px bg-white/10 my-8" />

              <a
                href="https://technovasummit.com"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center w-full py-3.5 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-xl transition-colors duration-300 text-sm"
              >
                Register for Free
              </a>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
