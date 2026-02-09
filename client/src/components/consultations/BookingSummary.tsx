'use client';

import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Mail,
  Phone,
  Building2,
  User,
  FileText,
  Pencil,
  Loader2,
  ShieldCheck,
} from 'lucide-react';
import type { ConsultationServicePublic } from '@/types';

interface BookingFormData {
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

interface BookingSummaryProps {
  formData: BookingFormData;
  selectedService: ConsultationServicePublic | null;
  isOther: boolean;
  onEditStep: (step: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
  termsAccepted: boolean;
  onTermsChange: (accepted: boolean) => void;
}

export default function BookingSummary({
  formData,
  selectedService,
  isOther,
  onEditStep,
  onSubmit,
  isSubmitting,
  termsAccepted,
  onTermsChange,
}: BookingSummaryProps) {
  const serviceName = isOther ? 'Custom Consultation' : selectedService?.name || 'N/A';
  const servicePrice = isOther ? '\u20A650,000' : selectedService?.formatted_price || 'N/A';
  const serviceDuration = isOther ? '1 hour' : selectedService?.formatted_duration || 'N/A';

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'Not selected';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-2">Review Your Booking</h2>
        <p className="text-muted-foreground">
          Please review all the details below before proceeding to payment.
        </p>
      </div>

      <div className="space-y-4">
        {/* Service Details */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 rounded-2xl bg-card border border-border/60"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Service Details
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(1)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
              <div>
                <p className="text-sm font-medium">{serviceName}</p>
                {isOther && formData.customDescription && (
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {formData.customDescription}
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm">{serviceDuration}</p>
            </div>
          </div>
        </motion.div>

        {/* Client Information */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 rounded-2xl bg-card border border-border/60"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Client Information
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(2)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <User className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm">{formData.name}</p>
            </div>
            <div className="flex items-center gap-3">
              <Mail className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm">{formData.email}</p>
            </div>
            <div className="flex items-center gap-3">
              <Phone className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm">{formData.phone}</p>
            </div>
            {formData.company && (
              <div className="flex items-center gap-3">
                <Building2 className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm">{formData.company}</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Schedule */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 rounded-2xl bg-card border border-border/60"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
              Schedule
            </h3>
            <button
              type="button"
              onClick={() => onEditStep(3)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-brand-primary hover:text-brand-primary/80 transition-colors"
            >
              <Pencil className="w-3 h-3" />
              Edit
            </button>
          </div>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm">{formatDate(formData.date)}</p>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="w-4 h-4 text-muted-foreground" />
              <p className="text-sm">{formData.time}</p>
            </div>
            {formData.notes && (
              <div className="flex items-start gap-3 pt-2 border-t border-border/40">
                <FileText className="w-4 h-4 text-muted-foreground mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-muted-foreground mb-1">Additional Notes</p>
                  <p className="text-sm">{formData.notes}</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Total Amount */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-2xl bg-gradient-to-br from-brand-primary/5 to-brand-secondary/5 border border-brand-primary/20"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="text-3xl font-bold text-brand-primary mt-1">{servicePrice}</p>
            </div>
            <div className="w-14 h-14 rounded-2xl bg-brand-primary/10 flex items-center justify-center">
              <ShieldCheck className="w-7 h-7 text-brand-primary" />
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Payment is securely processed via Paystack. You will be redirected to complete payment.
          </p>
        </motion.div>

        {/* Terms Acceptance */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="flex items-start gap-3 p-4 rounded-xl bg-muted/30"
        >
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => onTermsChange(e.target.checked)}
            className="mt-1 w-4 h-4 rounded border-border text-brand-primary focus:ring-brand-primary/30 cursor-pointer accent-[var(--brand-primary)]"
          />
          <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer leading-relaxed">
            I agree to the{' '}
            <span className="text-brand-primary font-medium">Terms of Service</span>{' '}
            and{' '}
            <span className="text-brand-primary font-medium">Privacy Policy</span>.
            I understand that the consultation fee is non-refundable once the session is confirmed.
          </label>
        </motion.div>

        {/* Submit Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            type="button"
            onClick={onSubmit}
            disabled={!termsAccepted || isSubmitting}
            className="w-full py-4 px-8 rounded-xl bg-gradient-to-r from-brand-primary to-brand-primary/90 text-white font-semibold text-base shadow-lg shadow-brand-primary/20 hover:shadow-xl hover:shadow-brand-primary/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                Book & Pay {servicePrice}
              </>
            )}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
