'use client';

import { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import {
  useFeaturedConsultationServices,
  useCreateBooking,
} from '@/hooks/useConsultations';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import ServiceSelector from './ServiceSelector';
import BookingSummary from './BookingSummary';
import StepIndicator from './StepIndicator';
import {
  Calendar,
  ArrowLeft,
  ArrowRight,
  Loader2,
  Scale,
} from 'lucide-react';

interface WizardFormData {
  serviceId: number | null;
  isOther: boolean;
  customDescription: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  date: string;
  time: string;
  notes: string;
}

const TIME_SLOTS = [
  '9:00 AM',
  '9:30 AM',
  '10:00 AM',
  '10:30 AM',
  '11:00 AM',
  '11:30 AM',
  '12:00 PM',
  '12:30 PM',
  '1:00 PM',
  '1:30 PM',
  '2:00 PM',
  '2:30 PM',
  '3:00 PM',
  '3:30 PM',
  '4:00 PM',
  '4:30 PM',
  '5:00 PM',
];

function convertTo24Hour(time12: string): string {
  const [time, modifier] = time12.split(' ');
  let [hours, minutes] = time.split(':').map(Number);
  if (modifier === 'AM' && hours === 12) hours = 0;
  if (modifier === 'PM' && hours !== 12) hours += 12;
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:00`;
}

const initialFormData: WizardFormData = {
  serviceId: null,
  isOther: false,
  customDescription: '',
  name: '',
  email: '',
  phone: '',
  company: '',
  date: '',
  time: '',
  notes: '',
};

export default function ConsultationPageContent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<WizardFormData>(initialFormData);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [direction, setDirection] = useState(1);
  const [paymentError, setPaymentError] = useState<string | null>(null);

  const { data: services = [], isLoading: servicesLoading } = useFeaturedConsultationServices();
  const createBookingMutation = useCreateBooking();

  const selectedService = useMemo(() => {
    if (formData.isOther || !formData.serviceId) return null;
    return services.find((s) => s.id === formData.serviceId) || null;
  }, [services, formData.serviceId, formData.isOther]);

  const tomorrowDate = useMemo(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }, []);

  const updateFormData = useCallback((updates: Partial<WizardFormData>) => {
    setFormData((prev) => ({ ...prev, ...updates }));
  }, []);

  const goToStep = useCallback(
    (step: number) => {
      setDirection(step > currentStep ? 1 : -1);
      setCurrentStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentStep]
  );

  const canProceedStep1 = formData.serviceId !== null || (formData.isOther && formData.customDescription.trim().length > 10);
  const canProceedStep2 = formData.name.trim() !== '' && formData.email.trim() !== '' && formData.phone.trim() !== '';
  const canProceedStep3 = formData.date !== '' && formData.time !== '';

  const handleSelectService = useCallback(
    (id: number) => {
      updateFormData({ serviceId: id, isOther: false, customDescription: '' });
    },
    [updateFormData]
  );

  const handleSelectOther = useCallback(() => {
    updateFormData({ serviceId: null, isOther: true });
  }, [updateFormData]);

  const handleBookAndPay = useCallback(async () => {
    setPaymentError(null);

    try {
      const bookingData = {
        service_id: formData.isOther ? null : formData.serviceId,
        custom_service_description: formData.isOther ? formData.customDescription : undefined,
        client_name: formData.name,
        client_email: formData.email,
        client_phone: formData.phone,
        client_company: formData.company || undefined,
        preferred_date: formData.date,
        preferred_time: convertTo24Hour(formData.time),
        notes: formData.notes || undefined,
      };

      const response = await createBookingMutation.mutateAsync(bookingData);

      // Redirect to Paystack authorization URL
      if (response.authorization_url) {
        window.location.href = response.authorization_url;
      }
    } catch (error: any) {
      const message = error?.response?.data?.error || 'Failed to create booking. Please try again.';
      setPaymentError(message);
      toast.error(message);
    }
  }, [formData, createBookingMutation]);

  const stepVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 80 : -80,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -80 : 80,
      opacity: 0,
    }),
  };

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="relative pt-32 pb-12 lg:pt-40 lg:pb-16 bg-gradient-to-b from-muted/30 to-background overflow-hidden">
        {/* SVG Background Pattern */}
        <div className="absolute inset-0 -z-10">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.03] dark:opacity-[0.015]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="consultation-diag"
                x="0"
                y="0"
                width="40"
                height="40"
                patternUnits="userSpaceOnUse"
                patternTransform="rotate(45)"
              >
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="40"
                  stroke="currentColor"
                  strokeWidth="0.5"
                  opacity="0.5"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#consultation-diag)" />
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
              <Scale className="w-4 h-4 text-brand-primary" />
              <span className="text-sm font-medium text-brand-primary tracking-wide">
                Expert Legal Guidance
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold mb-6 leading-tight">
              Book a <span className="text-brand-primary">Consultation</span>
            </h1>

            <p className="text-lg lg:text-xl text-muted-foreground leading-relaxed">
              Get expert legal guidance from our team of specialists in AI Law,
              Blockchain, Data Privacy, and more.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Wizard Section */}
      <section className="relative py-8 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Step Progress Indicator */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-10"
          >
            <StepIndicator currentStep={currentStep} />
          </motion.div>

          {/* Form Container */}
          <div className="relative min-h-[500px]">
            <AnimatePresence mode="wait" custom={direction}>
              {/* Step 1: Select Service */}
              {currentStep === 1 && (
                <motion.div
                  key="step-1"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {servicesLoading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                      <Loader2 className="w-8 h-8 text-brand-primary animate-spin mb-4" />
                      <p className="text-muted-foreground">Loading services...</p>
                    </div>
                  ) : (
                    <ServiceSelector
                      services={services}
                      selectedServiceId={formData.serviceId}
                      isOtherSelected={formData.isOther}
                      onSelectService={handleSelectService}
                      onSelectOther={handleSelectOther}
                      customDescription={formData.customDescription}
                      onCustomDescriptionChange={(value) =>
                        updateFormData({ customDescription: value })
                      }
                    />
                  )}

                  {/* Navigation */}
                  <div className="flex justify-end mt-8">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      disabled={!canProceedStep1}
                      className="px-8 py-3.5 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 flex items-center gap-2"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Your Details */}
              {currentStep === 2 && (
                <motion.div
                  key="step-2"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-serif font-bold mb-2">Your Details</h2>
                      <p className="text-muted-foreground">
                        Tell us about yourself so we can prepare for your consultation.
                      </p>
                    </div>

                    <div className="space-y-5">
                      {/* Name & Email Row */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="client-name" className="block text-sm font-medium mb-2">
                            Full Name <span className="text-brand-primary">*</span>
                          </label>
                          <input
                            type="text"
                            id="client-name"
                            value={formData.name}
                            onChange={(e) => updateFormData({ name: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 text-sm"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="client-email" className="block text-sm font-medium mb-2">
                            Email Address <span className="text-brand-primary">*</span>
                          </label>
                          <input
                            type="email"
                            id="client-email"
                            value={formData.email}
                            onChange={(e) => updateFormData({ email: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 text-sm"
                            placeholder="john@example.com"
                            required
                          />
                        </div>
                      </div>

                      {/* Phone & Company Row */}
                      <div className="grid sm:grid-cols-2 gap-5">
                        <div>
                          <label htmlFor="client-phone" className="block text-sm font-medium mb-2">
                            Phone Number <span className="text-brand-primary">*</span>
                          </label>
                          <input
                            type="tel"
                            id="client-phone"
                            value={formData.phone}
                            onChange={(e) => updateFormData({ phone: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 text-sm"
                            placeholder="+234 800 000 0000"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="client-company" className="block text-sm font-medium mb-2">
                            Company <span className="text-muted-foreground text-xs">(Optional)</span>
                          </label>
                          <input
                            type="text"
                            id="client-company"
                            value={formData.company}
                            onChange={(e) => updateFormData({ company: e.target.value })}
                            className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 text-sm"
                            placeholder="Acme Inc."
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8">
                    <button
                      type="button"
                      onClick={() => goToStep(1)}
                      className="px-6 py-3.5 rounded-xl border-2 border-border/50 text-muted-foreground font-medium hover:border-brand-primary/40 hover:text-foreground hover:bg-brand-primary/5 transition-all duration-300 flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      disabled={!canProceedStep2}
                      className="px-8 py-3.5 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 flex items-center gap-2"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Schedule */}
              {currentStep === 3 && (
                <motion.div
                  key="step-3"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-2xl font-serif font-bold mb-2">Schedule</h2>
                      <p className="text-muted-foreground">
                        Choose your preferred date and time for the consultation.
                      </p>
                    </div>

                    {/* Date Picker */}
                    <div>
                      <label htmlFor="consultation-date" className="block text-sm font-medium mb-2">
                        <Calendar className="w-4 h-4 inline-block mr-1.5 text-brand-primary" />
                        Preferred Date <span className="text-brand-primary">*</span>
                      </label>
                      <input
                        type="date"
                        id="consultation-date"
                        value={formData.date}
                        onChange={(e) => updateFormData({ date: e.target.value })}
                        min={tomorrowDate}
                        className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 text-sm cursor-pointer"
                      />
                    </div>

                    {/* Time Selector */}
                    <div>
                      <label className="block text-sm font-medium mb-3">
                        Preferred Time <span className="text-brand-primary">*</span>
                      </label>
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-2">
                        {TIME_SLOTS.map((slot) => (
                          <button
                            key={slot}
                            type="button"
                            onClick={() => updateFormData({ time: slot })}
                            className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                              formData.time === slot
                                ? 'bg-brand-primary text-white shadow-md shadow-brand-primary/20'
                                : 'bg-muted/50 text-muted-foreground hover:bg-brand-primary/10 hover:text-brand-primary border border-border/40'
                            }`}
                          >
                            {slot}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Notes */}
                    <div>
                      <label htmlFor="consultation-notes" className="block text-sm font-medium mb-2">
                        Additional Notes <span className="text-muted-foreground text-xs">(Optional)</span>
                      </label>
                      <textarea
                        id="consultation-notes"
                        value={formData.notes}
                        onChange={(e) => updateFormData({ notes: e.target.value })}
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 resize-none text-sm"
                        placeholder="Any specific topics or questions you'd like to discuss..."
                      />
                    </div>
                  </div>

                  {/* Navigation */}
                  <div className="flex items-center justify-between mt-8">
                    <button
                      type="button"
                      onClick={() => goToStep(2)}
                      className="px-6 py-3.5 rounded-xl border-2 border-border/50 text-muted-foreground font-medium hover:border-brand-primary/40 hover:text-foreground hover:bg-brand-primary/5 transition-all duration-300 flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                    <button
                      type="button"
                      onClick={() => goToStep(4)}
                      disabled={!canProceedStep3}
                      className="px-8 py-3.5 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 flex items-center gap-2"
                    >
                      Continue
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review & Pay */}
              {currentStep === 4 && (
                <motion.div
                  key="step-4"
                  custom={direction}
                  variants={stepVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  <BookingSummary
                    formData={formData}
                    selectedService={selectedService}
                    isOther={formData.isOther}
                    onEditStep={goToStep}
                    onSubmit={handleBookAndPay}
                    isSubmitting={createBookingMutation.isPending}
                    termsAccepted={termsAccepted}
                    onTermsChange={setTermsAccepted}
                  />

                  {paymentError && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm"
                    >
                      {paymentError}
                    </motion.div>
                  )}

                  {/* Back Button */}
                  <div className="flex items-center justify-start mt-6">
                    <button
                      type="button"
                      onClick={() => goToStep(3)}
                      className="px-6 py-3.5 rounded-xl border-2 border-border/50 text-muted-foreground font-medium hover:border-brand-primary/40 hover:text-foreground hover:bg-brand-primary/5 transition-all duration-300 flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      Back
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
