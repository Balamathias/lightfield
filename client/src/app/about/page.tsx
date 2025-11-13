'use client';

import { motion } from 'framer-motion';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
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
} from 'lucide-react';
import Link from 'next/link';

const stats = [
  { label: 'Years of Excellence', value: '10+', icon: Award },
  { label: 'Happy Clients', value: '500+', icon: Users },
  { label: 'Success Rate', value: '98%', icon: TrendingUp },
  { label: 'Global Reach', value: '25+', icon: Globe },
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
    year: '2014',
    title: 'Foundation',
    description: 'LightField Legal Practitioners was founded with a vision to bridge the gap between law and emerging technology.',
  },
  {
    year: '2017',
    title: 'Blockchain Focus',
    description: 'Expanded our practice to become specialists in blockchain law and cryptocurrency regulations.',
  },
  {
    year: '2020',
    title: 'AI & ML Expertise',
    description: 'Pioneered AI regulation practice area, helping clients navigate the evolving AI compliance landscape.',
  },
  {
    year: '2024',
    title: 'Global Recognition',
    description: 'Recognized as a leading technology law firm, serving innovative companies across 25+ countries.',
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
              Pioneering Legal Excellence in <span className="text-brand-primary">Emerging Technology</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              LightField Legal Practitioners is a modern law firm specializing in the intersection
              of law and cutting-edge technology. We provide innovative legal solutions for businesses
              navigating the complexities of AI, blockchain, and digital transformation.
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
                  {stat.value}
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
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
            {/* Mission */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-brand-primary/5 via-background to-transparent border border-brand-primary/20"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-6">
                <Target className="w-6 h-6 text-brand-primary" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                To empower innovative businesses with expert legal guidance that enables them to push
                technological boundaries while maintaining full regulatory compliance and ethical standards.
              </p>
              <ul className="space-y-3">
                {[
                  'Provide cutting-edge legal solutions for emerging technologies',
                  'Bridge the gap between complex regulations and business innovation',
                  'Build lasting partnerships based on trust and results',
                  'Champion ethical practices in technology development',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-brand-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Vision */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="relative p-8 lg:p-10 rounded-2xl bg-gradient-to-br from-brand-secondary/5 via-background to-transparent border border-brand-secondary/20"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-secondary/10 flex items-center justify-center mb-6">
                <Eye className="w-6 h-6 text-brand-secondary" />
              </div>
              <h2 className="text-3xl font-serif font-bold mb-4">Our Vision</h2>
              <p className="text-muted-foreground leading-relaxed mb-6">
                To be the world's most trusted legal partner for companies at the forefront of technological
                innovation, shaping the future of technology law through expertise, advocacy, and thought leadership.
              </p>
              <ul className="space-y-3">
                {[
                  'Lead the evolution of technology law globally',
                  'Set industry standards for AI and blockchain compliance',
                  'Foster innovation through progressive legal frameworks',
                  'Expand our impact across emerging tech sectors',
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <CheckCircle2 className="w-4 h-4 text-brand-secondary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">{item}</span>
                  </li>
                ))}
              </ul>
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
              A decade of innovation, growth, and excellence in technology law.
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
                    {milestone.year}
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
                Why <span className="text-brand-primary">LightField</span>?
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                We're not just lawyers—we're strategic partners who understand technology.
                Our unique combination of legal expertise and technical knowledge sets us apart.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  'Deep understanding of blockchain, AI, and emerging technologies',
                  'Proactive approach to regulatory compliance and risk management',
                  'Global perspective with local expertise',
                  'Proven track record with innovative tech companies',
                  'Committed to your long-term success and growth',
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
                Let's discuss how LightField can help your business navigate the complex
                landscape of emerging technology law.
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
