'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useSubmitContact } from '@/hooks/useContact';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle2,
  Loader2,
  MessageSquare,
  Building2,
  Clock,
} from 'lucide-react';
import { toast } from 'sonner';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const submitContactMutation = useSubmitContact();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      await submitContactMutation.mutateAsync(formData);
      setIsSubmitted(true);
      toast.success('Message sent successfully!');

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
          message: '',
        });
        setIsSubmitted(false);
      }, 3000);
    } catch (error: any) {
      toast.error(error?.response?.data?.message || 'Failed to send message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

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
                id="contact-grid"
                x="0"
                y="0"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="30" cy="30" r="1" fill="currentColor" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#contact-grid)" />
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-brand-primary/5 to-transparent blur-3xl" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="text-center max-w-3xl mx-auto"
          >
            <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-full bg-brand-primary/5 border border-brand-primary/20 mb-8">
              <MessageSquare className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-medium text-brand-primary tracking-wide">
                Get In Touch
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Let's Discuss Your <span className="text-brand-primary">Legal Needs</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Whether you need guidance on emerging tech law, AI regulation, or blockchain compliance,
              our expert team is here to help.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-16 lg:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Contact Info Cards */}
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="lg:col-span-1 space-y-6"
            >
              {/* Lagos Office */}
              <motion.div
                variants={itemVariants}
                className="group p-6 rounded-2xl bg-card border border-border/60 hover:border-brand-primary/40 hover:shadow-xl transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
                  <Building2 className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Lagos Office</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Road 5, J59, Ikota Shopping Complex,<br />
                  VGC, Lekki,<br />
                  Lagos State, Nigeria.
                </p>
              </motion.div>

              {/* Abuja Office */}
              <motion.div
                variants={itemVariants}
                className="group p-6 rounded-2xl bg-card border border-border/60 hover:border-brand-primary/40 hover:shadow-xl transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
                  <Building2 className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">Abuja Office</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Suite T7, 3rd Floor,<br />
                  Alibro Atrium Plaza,<br />
                  Utako District, FCT Abuja.
                </p>
              </motion.div>

              {/* Contact Details */}
              <motion.div
                variants={itemVariants}
                className="group p-6 rounded-2xl bg-card border border-border/60 hover:border-brand-primary/40 hover:shadow-xl transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
                  <Phone className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-4">Contact Details</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href="tel:+2348148767744" className="text-muted-foreground hover:text-brand-primary transition-colors">
                      +234 814 876 7744
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Phone className="w-4 h-4 text-muted-foreground" />
                    <a href="tel:+2347032676039" className="text-muted-foreground hover:text-brand-primary transition-colors">
                      +234 703 267 6039
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    <a href="mailto:lightfieldlegalpractitioners@gmail.com" className="text-muted-foreground hover:text-brand-primary transition-colors text-xs">
                      lightfieldlegalpractitioners@gmail.com
                    </a>
                  </div>
                </div>
              </motion.div>

              {/* Business Hours */}
              <motion.div
                variants={itemVariants}
                className="group p-6 rounded-2xl bg-card border border-border/60 hover:border-brand-primary/40 hover:shadow-xl transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-lg bg-brand-primary/10 flex items-center justify-center mb-4 group-hover:bg-brand-primary/20 transition-colors">
                  <Clock className="w-6 h-6 text-brand-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-4">Business Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Monday - Friday</span>
                    <span className="font-medium">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Saturday</span>
                    <span className="font-medium">10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sunday</span>
                    <span className="font-medium">Closed</span>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="lg:col-span-2"
            >
              <div className="p-8 lg:p-12 rounded-2xl bg-card border border-border/60 shadow-xl">
                <h2 className="text-3xl font-serif font-bold mb-2">Send Us a Message</h2>
                <p className="text-muted-foreground mb-8">
                  Fill out the form below and we'll get back to you within 24 hours.
                </p>

                {isSubmitted ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center justify-center py-12"
                  >
                    <div className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mb-6">
                      <CheckCircle2 className="w-10 h-10 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-semibold mb-2">Message Sent!</h3>
                    <p className="text-muted-foreground text-center max-w-md">
                      Thank you for contacting us. We'll review your message and get back to you shortly.
                    </p>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name & Email Row */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Full Name <span className="text-brand-primary">*</span>
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Email Address <span className="text-brand-primary">*</span>
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    {/* Phone & Subject Row */}
                    <div className="grid sm:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="phone" className="block text-sm font-medium mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          id="phone"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300"
                          placeholder="+1 (234) 567-890"
                        />
                      </div>
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium mb-2">
                          Subject <span className="text-brand-primary">*</span>
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300"
                          placeholder="Legal consultation request"
                        />
                      </div>
                    </div>

                    {/* Message */}
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message <span className="text-brand-primary">*</span>
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={6}
                        className="w-full px-4 py-3 rounded-lg bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 resize-none"
                        placeholder="Tell us about your legal needs..."
                      />
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={submitContactMutation.isPending}
                      className="w-full sm:w-auto px-8 py-4 rounded-lg bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 flex items-center justify-center gap-2"
                    >
                      {submitContactMutation.isPending ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Send className="w-5 h-5" />
                          <span>Send Message</span>
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="relative py-16 lg:py-24 bg-muted/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-serif font-bold mb-4">
              Visit Our Offices
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Schedule an in-person consultation at any of our conveniently located offices in Lagos, or Abuja.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Lagos Office Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Lagos Office</h3>
                  <p className="text-sm text-muted-foreground">Ikota Shopping Complex, VGC, Lekki</p>
                </div>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-muted border border-border/60">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.7294095827247!2d3.5446799!3d6.4315!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf70f5e2e7f65%3A0x8c52f2fa09c2f8d5!2sIkota%20Shopping%20Complex!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Lagos Office Location"
                  className="w-full h-full"
                />
              </div>
            </motion.div>

            {/* Abuja Office Map */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-brand-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg">Abuja Office</h3>
                  <p className="text-sm text-muted-foreground">Utako District, FCT Abuja</p>
                </div>
              </div>
              <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl bg-muted border border-border/60">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3940.1234567890123!2d7.4278!3d9.0765!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x104e0ba5c8901234%3A0xabcdef1234567890!2sUtako%2C%20Abuja!5e0!3m2!1sen!2sng!4v1700000000000!5m2!1sen!2sng"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Abuja Office Location"
                  className="w-full h-full"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
