'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle } from 'lucide-react';

const faqs = [
  {
    question: "What areas of technology law does LightField specialize in?",
    answer: "We specialize in emerging technology law including artificial intelligence, blockchain and cryptocurrency, data privacy (GDPR/CCPA), software licensing, intellectual property, and venture capital for tech startups. Our team stays at the forefront of technological and regulatory developments."
  },
  {
    question: "How do you handle blockchain and cryptocurrency legal matters?",
    answer: "Our blockchain practice covers token launches, ICO/ITO compliance, smart contract auditing, DeFi protocol structuring, NFT frameworks, and cryptocurrency exchange licensing. We provide comprehensive guidance through the evolving regulatory landscape while ensuring full compliance."
  },
  {
    question: "What makes LightField different from other law firms?",
    answer: "We combine deep technical expertise with legal excellence. Our team includes lawyers with backgrounds in computer science and engineering, allowing us to truly understand the technology we're advising on. We offer proactive compliance strategies and innovative solutions tailored to tech companies."
  },
  {
    question: "Do you work with international clients?",
    answer: "Yes, we serve clients across 25+ countries. Our global perspective allows us to navigate cross-border regulations, international data transfers, and multi-jurisdictional compliance requirements. We have experience with EU, US, and Asian regulatory frameworks."
  },
  {
    question: "How do you stay current with rapidly changing tech regulations?",
    answer: "Our team actively participates in technology law conferences, maintains relationships with regulatory bodies, and invests in continuous education. We use AI-powered legal research tools to track regulatory changes and provide timely updates to our clients."
  },
  {
    question: "What is your approach to AI and machine learning compliance?",
    answer: "We help organizations navigate AI ethics, algorithm auditing, bias testing, and compliance with regulations like the EU AI Act. Our approach includes risk assessments, governance frameworks, and practical implementation strategies that balance innovation with regulatory requirements."
  }
];

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

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
    <section className="relative py-20 lg:py-28 bg-gradient-to-b from-muted/20 to-background">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full md:w-[800px] h-[800px] bg-gradient-radial from-brand-primary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-6">
            <HelpCircle className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary tracking-wide">
              Frequently Asked Questions
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
            Have Questions? We Have <span className="text-brand-primary">Answers</span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Find answers to common questions about our services, expertise, and approach to technology law.
          </p>
        </motion.div>

        {/* FAQ Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="space-y-4"
        >
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              className="group"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full text-left"
              >
                <div className={`
                  px-6 py-5 rounded-xl border transition-all duration-300
                  ${openIndex === index
                    ? 'bg-card border-brand-primary/40 shadow-lg shadow-brand-primary/10'
                    : 'bg-card/50 border-border/60 hover:border-brand-primary/20 hover:bg-card'
                  }
                `}>
                  <div className="flex items-center justify-between">
                    <h3 className={`
                      text-lg font-semibold pr-4 transition-colors duration-300
                      ${openIndex === index ? 'text-brand-primary' : 'text-foreground group-hover:text-brand-primary'}
                    `}>
                      {faq.question}
                    </h3>
                    <div className={`
                      flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                      ${openIndex === index
                        ? 'bg-brand-primary text-white rotate-180'
                        : 'bg-muted text-muted-foreground group-hover:bg-brand-primary/10 group-hover:text-brand-primary'
                      }
                    `}>
                      {openIndex === index ? (
                        <Minus className="w-4 h-4" />
                      ) : (
                        <Plus className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  <AnimatePresence>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="mt-4 text-muted-foreground leading-relaxed">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </button>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}