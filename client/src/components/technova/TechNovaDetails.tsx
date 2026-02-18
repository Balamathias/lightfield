'use client';

import { motion } from 'framer-motion';
import { Mic2, Lightbulb, Users, Landmark, Wrench, MessageSquare } from 'lucide-react';

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

const topics = [
  {
    icon: Mic2,
    title: 'Keynote Speakers',
    description:
      'Hear from industry leaders, legal experts, and tech pioneers shaping the future of technology and regulation.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation Showcases',
    description:
      'Discover cutting-edge projects and startups at the intersection of technology, law, and governance.',
  },
  {
    icon: Users,
    title: 'Networking Opportunities',
    description:
      'Connect with developers, founders, legal professionals, and government officials in one place.',
  },
  {
    icon: Landmark,
    title: 'Government Partnerships',
    description:
      'Explore how government policy and tech innovation can work together for economic growth and regulation.',
  },
  {
    icon: Wrench,
    title: 'Tech Workshops',
    description:
      'Hands-on sessions covering AI, blockchain smart contracts, cybersecurity, and emerging tech tools.',
  },
  {
    icon: MessageSquare,
    title: 'Panel Discussions',
    description:
      'Engage in thought-provoking conversations about the legal and ethical dimensions of emerging technologies.',
  },
];

export default function TechNovaDetails() {
  return (
    <section className="relative py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="text-center mb-16"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-8"
          >
            <span className="text-sm font-medium text-white/70 tracking-wide">
              What to Expect
            </span>
          </motion.div>

          <motion.h2
            variants={itemVariants}
            className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6 leading-tight text-white"
          >
            A Day of{' '}
            <span className="text-brand-primary">Possibilities</span>
          </motion.h2>

          <motion.p
            variants={itemVariants}
            className="text-white/60 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed"
          >
            From keynote presentations to hands-on workshops, TechNova Summit
            is packed with experiences designed to inspire and equip.
          </motion.p>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
          variants={containerVariants}
          className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {topics.map((topic) => {
            const Icon = topic.icon;
            return (
              <motion.div
                key={topic.title}
                variants={itemVariants}
                whileHover={{
                  y: -4,
                  transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                }}
                className="group relative bg-white/[0.03] border border-white/[0.06] rounded-2xl p-7 hover:border-white/15 transition-all duration-500"
              >
                <div className="mb-5">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-brand-primary/10 border border-brand-primary/20 group-hover:bg-brand-primary/15 transition-colors duration-500">
                    <Icon className="w-6 h-6 text-brand-primary" strokeWidth={1.5} />
                  </div>
                </div>

                <h3 className="text-lg font-serif font-bold text-white mb-2 group-hover:text-brand-primary transition-colors duration-500">
                  {topic.title}
                </h3>
                <p className="text-sm text-white/50 leading-relaxed">
                  {topic.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
