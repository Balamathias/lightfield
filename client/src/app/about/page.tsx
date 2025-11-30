'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import { CountUp } from '@/hooks/useCountUp';
import {
  Target,
  Eye,
  Award,
  Users,
  TrendingUp,
  Globe,
  Shield,
  Sparkles,
  CheckCircle2,
  ArrowRight,
  Scale,
  Lightbulb,
  Heart,
  BadgeCheck,
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Practice Areas', value: 10, suffix: '+', icon: Award },
  { label: 'Client Satisfaction', value: 100, suffix: '%', icon: Users },
  { label: 'Success Rate', value: 98, suffix: '%', icon: TrendingUp },
  { label: 'Office Locations', value: 2, suffix: '', icon: Globe },
];

const values = [
  {
    icon: Shield,
    title: 'Integrity',
    description: 'We uphold the highest ethical standards in every engagement, ensuring transparency and trust in all our client relationships.',
  },
  {
    icon: Lightbulb,
    title: 'Innovation',
    description: 'We embrace cutting-edge legal solutions and stay ahead of emerging technology regulations to serve our clients better.',
  },
  {
    icon: Scale,
    title: 'Excellence',
    description: 'Our commitment to excellence drives us to deliver exceptional legal counsel and achieve the best outcomes for our clients.',
  },
  {
    icon: Heart,
    title: 'Client-Centric',
    description: 'Your success is our priority. We tailor our approach to meet your unique needs and business objectives.',
  },
];

const timeline = [
  {
    year: '2020',
    title: 'Foundation',
    description: 'Lightfield Legal Practitioners was established with a vision to provide tech-driven, innovative legal solutions for Africa\'s digital economy.',
  },
  {
    year: '2021',
    title: 'Blockchain & Web3 Focus',
    description: 'Expanded our practice to become specialists in blockchain law, Web3, digital assets, and cryptocurrency regulations.',
  },
  {
    year: '2023',
    title: 'Multi-Office Expansion',
    description: 'Opened our second office in Abuja, extending our reach to serve clients across multiple regions in Nigeria.',
  },
  {
    year: '2024',
    title: 'Tech Law Leadership',
    description: 'Established as a leading technology-focused law firm, pioneering digital transformation legal advisory in Nigeria.',
  },
];

export default function AboutPage() {
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
                id="about-grid"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#about-grid)" />
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
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-medium text-brand-primary tracking-wide">
                About Us
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Pioneering Legal Excellence in <span className="text-brand-primary">Africa's Digital Economy</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Lightfield LP is a forward-thinking law firm delivering innovative, research-grounded advisory and litigation services across blockchain, digital assets, technology law, corporate law, and data protection. We empower businesses and emerging industries with clarity, compliance, and sustainable growth.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative py-16 lg:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                variants={itemVariants}
                className="text-center p-6 rounded-2xl bg-card border border-border/60 hover:border-brand-primary/40 hover:shadow-xl transition-all duration-500 group"
              >
                <div className="w-14 h-14 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-brand-primary/20 transition-colors">
                  <stat.icon className="w-7 h-7 text-brand-primary" />
                </div>
                <div className="text-4xl font-serif font-bold text-brand-primary mb-2">
                  <CountUp
                    end={stat.value}
                    suffix={stat.suffix}
                    duration={2000}
                    delay={index * 150}
                  />
                </div>
                <div className="text-sm text-muted-foreground font-medium">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
              Our Purpose & <span className="text-brand-primary">Direction</span>
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Guided by a clear mission and ambitious vision, we're shaping the future of legal practice in Africa's digital economy.
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-brand-primary/5 via-background to-transparent border border-brand-primary/20"
            >
              <div className="w-14 h-14 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6">
                <Target className="w-7 h-7 text-brand-primary" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-6">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                At Lightfield LP, our mission is to deliver forward-thinking, research-driven, and technology-aligned legal solutions that empower individuals, founders, corporations, and emerging industries in the digital era.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We are committed to excellence in blockchain, Web3, digital assets, technology law, data privacy, constitutional law, property law, corporate legal advisory and litigation.
              </p>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  Through innovative strategy and deep legal insight, we simplify complex regulatory landscapes, protect rights, secure digital ecosystems, structure sound business transactions, and provide accessible, reliable, and client-centric legal services that drive sustainable growth and compliance.
                </p>
              </div>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-brand-secondary/5 via-background to-transparent border border-brand-secondary/20"
            >
              <div className="w-14 h-14 rounded-xl bg-brand-secondary/10 flex items-center justify-center mb-6">
                <Eye className="w-7 h-7 text-brand-secondary" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-6">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                Our vision is to become Africa's leading tech-driven and innovation-focused law firm; setting the benchmark for excellence in corporate legal advisory and shaping the future of digital regulation.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-6">
                We aspire to be recognized as a powerhouse of young, ambitious legal minds who redefine legal practice, influence global legal frameworks in emerging technologies, and strengthen constitutional governance.
              </p>
              <div className="pt-4 border-t border-border/50">
                <p className="text-sm text-muted-foreground leading-relaxed italic">
                  We are committed to delivering transformative legal solutions that accelerate digital transformation, business sustainability, and economic progress across Africa and beyond.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="relative py-16 lg:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
              Our Core Values
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              These principles guide everything we do and shape how we serve our clients.
            </p>
          </motion.div>

          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid md:grid-cols-2 gap-8"
          >
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                variants={itemVariants}
                className="group p-8 rounded-2xl bg-card border border-border/60 hover:border-brand-primary/40 hover:shadow-2xl transition-all duration-500"
              >
                <div className="w-14 h-14 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-6 group-hover:bg-brand-primary/20 group-hover:scale-110 transition-all duration-500">
                  <value.icon className="w-7 h-7 text-brand-primary" />
                </div>
                <h3 className="text-2xl font-serif font-bold mb-3 group-hover:text-brand-primary transition-colors">
                  {value.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Timeline */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto mb-16"
          >
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
              Our Journey
            </h2>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Building excellence in technology law and shaping Africa's digital legal landscape.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-brand-primary via-brand-primary/50 to-transparent hidden md:block" />

            <div className="space-y-12">
              {timeline.map((milestone, index) => (
                <motion.div
                  key={milestone.year}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  className="relative flex gap-8 items-start"
                >
                  {/* Year Badge */}
                  <div className="hidden md:flex w-16 h-16 rounded-full bg-brand-primary flex-shrink-0 items-center justify-center text-white font-bold text-sm shadow-lg shadow-brand-primary/20">
                    <BadgeCheck />
                  </div>

                  {/* Mobile Year Badge */}
                  <div className="md:hidden w-12 h-12 rounded-full bg-brand-primary/10 border-2 border-brand-primary flex-shrink-0 flex items-center justify-center">
                    <div className="text-xs font-bold text-brand-primary">{milestone.year}</div>
                  </div>

                  {/* Content */}
                  <div className="flex-1 p-6 rounded-2xl bg-card border border-border/60 hover:border-brand-primary/40 hover:shadow-xl transition-all duration-500">
                    <h3 className="text-xl font-serif font-bold mb-2">
                      {milestone.title}
                    </h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {milestone.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="relative py-16 lg:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left: Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold mb-6">
                Why <span className="text-brand-primary">Lightfield LP</span>?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We're not just lawyers—we're strategic partners who understand technology.
                Our fusion of deep legal research, technological insight, and innovative strategy sets us apart.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Deep understanding of blockchain, Web3, and emerging technologies',
                  'Research-driven approach to regulatory compliance and risk management',
                  'Young, ambitious legal minds redefining legal practice',
                  'Client-centric solutions that drive sustainable growth',
                  'Committed to excellence in corporate legal advisory and litigation',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-brand-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <CheckCircle2 className="w-4 h-4 text-brand-primary" />
                    </div>
                    <span className="text-muted-foreground leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/team"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30"
              >
                <Users className="w-5 h-5" />
                <span>Meet Our Team</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>

            {/* Right: Image/Visual */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-brand-primary/20 via-brand-secondary/10 to-transparent border border-border/60 overflow-hidden shadow-2xl">
                <div className="absolute inset-0 flex items-center justify-center">
                  <svg
                    className="w-full h-full opacity-10"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 400 400"
                  >
                    <defs>
                      <pattern
                        id="why-pattern"
                        x="0"
                        y="0"
                        width="40"
                        height="40"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="20" cy="20" r="2" fill="currentColor" />
                      </pattern>
                    </defs>
                    <rect width="400" height="400" fill="url(#why-pattern)" />
                  </svg>
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Scale className="w-32 h-32 text-brand-primary/30" />
                </div>
              </div>
            </motion.div>
          </div>
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
                Ready to Work Together?
              </h2>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Let's discuss how Lightfield LP can help your business navigate the complex
                landscape of emerging technology law and digital regulation.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30"
                >
                  <span>Get in Touch</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-8 py-4 rounded-lg border-2 border-border/50 hover:border-brand-primary/40 font-semibold hover:bg-brand-primary/5 transition-all duration-300"
                >
                  <span>Explore Services</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
