'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const faqs = [
  {
    question: "What areas of law does Lightfield LP specialize in?",
    answer: "Lightfield LP focuses on technology-driven and high-impact practice areas including blockchain and Web3 law, digital assets, technology and innovation law, data privacy and protection, constitutional law, property law, corporate and commercial advisory, and litigation. Our multidisciplinary approach ensures clients receive holistic legal support in today's digital economy."
  },
  {
    question: "How does Lightfield LP support clients operating in emerging technologies such as blockchain, Web3, and digital assets?",
    answer: "We offer regulatory guidance, compliance structuring, tokenization advisory, smart contract review, digital asset transaction support, and representation before regulators. We help innovators navigate evolving frameworks while protecting their products, users, and intellectual property."
  },
  {
    question: "Does your firm advise startups, founders, and early-stage companies?",
    answer: "Yes. Lightfield LP provides strategic legal support to founders and startups at every stage—incorporation, fundraising, product development, compliance, IP protection, employment matters, and organizational governance. We help founders scale legally and sustainably."
  },
  {
    question: "How does Lightfield LP stay updated on fast-evolving global and Nigerian technology regulations?",
    answer: "Our team conducts continuous legal research, monitors developments from global tech regulators, engages with policy and industry bodies, and leverages advanced legal research tools. This ensures our clients receive informed and forward-thinking legal advice."
  },
  {
    question: "Can your firm assist with compliance in data privacy, cybersecurity, and digital ecosystem protection?",
    answer: "Absolutely. We help clients comply with the Nigeria Data Protection Act (NDPA), GDPR-aligned frameworks, cybersecurity standards, and risk mitigation rules. We structure internal policies, conduct compliance audits, manage data breach responses, and protect digital infrastructure."
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

          <p className="text-sm sm:text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
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
                      text-base sm:text-lg font-semibold pr-4 transition-colors duration-300
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
                        <p className="text-sm sm:text-base mt-4 text-muted-foreground leading-relaxed">
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

        {/* CTA to Full FAQs Page */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <Link
            href="/faqs"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 group"
          >
            <span>View All FAQs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Have more questions? Browse our complete FAQ collection or{' '}
            <Link href="/contact" className="text-brand-primary hover:underline">
              get in touch
            </Link>
          </p>
        </motion.div>
      </div>
    </section>
  );
}