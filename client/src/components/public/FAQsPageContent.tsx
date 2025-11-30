'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, Search, MessageCircle } from 'lucide-react';
import Link from 'next/link';

const allFaqs = [
  {
    question: "What areas of law does Lightfield LP specialize in?",
    answer: "Lightfield LP focuses on technology-driven and high-impact practice areas including blockchain and Web3 law, digital assets, technology and innovation law, data privacy and protection, constitutional law, property law, corporate and commercial advisory, and litigation. Our multidisciplinary approach ensures clients receive holistic legal support in today's digital economy.",
    category: "General"
  },
  {
    question: "How does Lightfield LP support clients operating in emerging technologies such as blockchain, Web3, and digital assets?",
    answer: "We offer regulatory guidance, compliance structuring, tokenization advisory, smart contract review, digital asset transaction support, and representation before regulators. We help innovators navigate evolving frameworks while protecting their products, users, and intellectual property.",
    category: "Blockchain & Web3"
  },
  {
    question: "Does your firm advise startups, founders, and early-stage companies?",
    answer: "Yes. Lightfield LP provides strategic legal support to founders and startups at every stage—incorporation, fundraising, product development, compliance, IP protection, employment matters, and organizational governance. We help founders scale legally and sustainably.",
    category: "Startups"
  },
  {
    question: "How does Lightfield LP stay updated on fast-evolving global and Nigerian technology regulations?",
    answer: "Our team conducts continuous legal research, monitors developments from global tech regulators, engages with policy and industry bodies, and leverages advanced legal research tools. This ensures our clients receive informed and forward-thinking legal advice.",
    category: "General"
  },
  {
    question: "Can your firm assist with compliance in data privacy, cybersecurity, and digital ecosystem protection?",
    answer: "Absolutely. We help clients comply with the Nigeria Data Protection Act (NDPA), GDPR-aligned frameworks, cybersecurity standards, and risk mitigation rules. We structure internal policies, conduct compliance audits, manage data breach responses, and protect digital infrastructure.",
    category: "Data Privacy"
  },
  {
    question: "What is your approach to handling complex regulatory issues in the digital economy?",
    answer: "We simplify complexity through deep research, strategic analysis, technology awareness, and practical interpretation of the law. We break down regulatory requirements, map out risk areas, and offer clear, actionable, and business-friendly solutions.",
    category: "General"
  },
  {
    question: "Does Lightfield LP provide litigation services in addition to advisory work?",
    answer: "Yes. Our litigation team represents clients in technology disputes, commercial litigation, constitutional matters, property disputes, contract enforcement, and regulatory challenges. We combine strong advocacy with strategic negotiation where necessary.",
    category: "Litigation"
  },
  {
    question: "How do you structure your fees for technology-related or corporate advisory matters?",
    answer: "Our fees are transparent and tailored to the nature of each matter. Depending on the services required, we offer hourly billing, fixed-fee arrangements, project-based pricing, and retainer agreements for ongoing advisory needs. All fees are discussed upfront.",
    category: "Fees & Billing"
  },
  {
    question: "What is the process for engaging the firm for legal services?",
    answer: "Clients may contact us through our website, email, or office. After an initial consultation, we assess the matter, define the scope of work, provide a formal engagement letter, and begin work immediately upon acceptance.",
    category: "Engagement"
  },
  {
    question: "Can Lightfield LP represent international clients or companies expanding into Nigeria's digital market?",
    answer: "Yes. We frequently advise international entities looking to operate, launch digital products, or invest in Nigeria. Our cross-border insight ensures seamless navigation of local regulations and business requirements.",
    category: "International"
  },
  {
    question: "What documentation or information is required for onboarding new clients?",
    answer: "Depending on the matter, clients may be required to provide identification documents, incorporation documents, regulatory filings, transaction details, product descriptions, or relevant correspondence. This helps us understand and structure the matter accurately.",
    category: "Engagement"
  },
  {
    question: "How does the firm ensure confidentiality, data security, and protection of sensitive digital information?",
    answer: "We employ strict confidentiality protocols, secure data management systems, encrypted communication channels, and full compliance with data protection laws. Your information is protected at every stage of engagement.",
    category: "Data Privacy"
  },
  {
    question: "Do you offer consultations for founders, innovators, and technology businesses?",
    answer: "Yes. We provide both one-time consultations and ongoing advisory sessions tailored to the needs of founders, tech teams, and emerging businesses. These sessions help clients address regulatory, corporate, and operational concerns.",
    category: "Startups"
  },
  {
    question: "How does Lightfield LP assist clients navigating blockchain, tokenization, or digital asset regulations?",
    answer: "We provide clarity on the legal status of tokens, compliance with capital markets rules, taxation implications, anti-money laundering requirements, and digital asset exchange regulations. We also review whitepapers and assist in structuring compliant token models.",
    category: "Blockchain & Web3"
  },
  {
    question: "Can your firm help with drafting and reviewing smart contracts or technology-driven agreements?",
    answer: "Yes. We draft, review, and interpret smart contracts, SaaS agreements, software licensing contracts, IP assignments, platform terms of use, and related digital agreements to ensure legal soundness and enforceability.",
    category: "Blockchain & Web3"
  },
  {
    question: "What industries does Lightfield LP work with beyond the tech space?",
    answer: "We serve clients in real estate, financial services, education, media, creative industries, e-commerce, logistics, agriculture technology, and general commercial sectors.",
    category: "General"
  },
  {
    question: "How do you keep clients updated on progress, regulatory developments, and evolving risks?",
    answer: "We maintain clear communication through email updates, scheduled reports, review meetings, and alerts on critical legal or regulatory changes that may affect your business or matter.",
    category: "Engagement"
  },
  {
    question: "Does Lightfield LP assist with business structuring, incorporation, and corporate governance?",
    answer: "Yes. We help clients incorporate companies, prepare governance documents, structure shareholder agreements, comply with CAC and regulatory filings, and establish legally grounded operational frameworks.",
    category: "Corporate"
  },
  {
    question: "How quickly can the firm respond to urgent or time-sensitive compliance or litigation matters?",
    answer: "We prioritize urgent matters immediately. Our team is equipped to respond swiftly to regulatory deadlines, litigation emergencies, product launches, and high-risk compliance issues.",
    category: "Engagement"
  },
  {
    question: "What sets Lightfield LP apart from other technology-focused law firms in Nigeria?",
    answer: "Our strength lies in our fusion of deep legal research, technological insight, innovative strategy, and commitment to client-centered solutions. We blend modern expertise with traditional legal excellence, ensuring that clients receive forward-thinking, reliable, and future-proof legal services.",
    category: "General"
  }
];

const categories = ['All', ...Array.from(new Set(allFaqs.map(faq => faq.category)))];

export default function FAQsPageContent() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredFaqs = allFaqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  const containerVariants: any = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const itemVariants: any = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section className="relative pt-32 pb-20 lg:pb-28 min-h-screen">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-b from-brand-primary/5 to-transparent" />
        <div className="absolute top-1/4 right-0 w-full md:w-[600px] h-[600px] bg-gradient-radial from-brand-primary/5 to-transparent rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 left-0 w-full md:w-[400px] h-[400px] bg-gradient-radial from-brand-secondary/5 to-transparent rounded-full blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-6">
            <HelpCircle className="w-4 h-4 text-brand-primary" />
            <span className="text-sm font-medium text-brand-primary tracking-wide">
              Frequently Asked Questions
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6">
            How Can We <span className="text-brand-primary">Help You?</span>
          </h1>

          <p className="text-lg text-muted-foreground leading-relaxed max-w-2xl mx-auto">
            Find comprehensive answers to common questions about our legal services, expertise, and how we can support your business in the digital economy.
          </p>
        </motion.div>

        {/* Search Bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-8"
        >
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search questions..."
              className="w-full pl-12 pr-4 py-4 bg-card rounded-xl border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 text-sm"
            />
          </div>
        </motion.div>

        {/* Category Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                  activeCategory === category
                    ? 'bg-brand-primary text-white shadow-lg shadow-brand-primary/25'
                    : 'bg-card border border-border/60 text-muted-foreground hover:border-brand-primary/30 hover:text-foreground'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        {searchQuery && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-sm text-muted-foreground mb-8"
          >
            Found {filteredFaqs.length} result{filteredFaqs.length !== 1 ? 's' : ''} for "{searchQuery}"
          </motion.p>
        )}

        {/* FAQ Items */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={`${activeCategory}-${searchQuery}`}
          className="space-y-4"
        >
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq, index) => (
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
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-brand-primary/10 text-brand-primary">
                            {faq.category}
                          </span>
                        </div>
                        <h3 className={`
                          text-lg font-semibold transition-colors duration-300
                          ${openIndex === index ? 'text-brand-primary' : 'text-foreground group-hover:text-brand-primary'}
                        `}>
                          {faq.question}
                        </h3>
                      </div>
                      <div className={`
                        flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 mt-1
                        ${openIndex === index
                          ? 'bg-brand-primary text-white'
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
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-12"
            >
              <Search className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">No results found</h3>
              <p className="text-muted-foreground">
                Try adjusting your search or filter to find what you're looking for.
              </p>
            </motion.div>
          )}
        </motion.div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-16 text-center"
        >
          <div className="bg-gradient-to-br from-card to-muted/30 rounded-2xl border border-border/60 p-8 sm:p-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-brand-primary/10 mb-6">
              <MessageCircle className="w-8 h-8 text-brand-primary" />
            </div>
            <h3 className="text-2xl sm:text-3xl font-serif font-bold mb-4">
              Still Have Questions?
            </h3>
            <p className="text-muted-foreground mb-8 max-w-lg mx-auto">
              Can't find the answer you're looking for? Our team is here to help. Get in touch with us for personalized assistance.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-brand-primary hover:bg-brand-primary/90 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              Contact Us
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
