'use client';

import { use } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { useBookingStatus } from '@/hooks/useConsultations';
import type { BookingStatus } from '@/types';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import {
  CheckCircle2,
  Clock,
  Calendar,
  Mail,
  User,
  FileText,
  Loader2,
  XCircle,
  Copy,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  Ban,
  RefreshCw,
} from 'lucide-react';
import { toast } from 'sonner';

const statusConfig: Record<
  BookingStatus,
  {
    icon: typeof CheckCircle2;
    label: string;
    color: string;
    bgColor: string;
    borderColor: string;
  }
> = {
  pending_payment: {
    icon: Clock,
    label: 'Pending Payment',
    color: 'text-yellow-600 dark:text-yellow-400',
    bgColor: 'bg-yellow-500/10',
    borderColor: 'border-yellow-500/20',
  },
  paid: {
    icon: CheckCircle2,
    label: 'Paid',
    color: 'text-green-600 dark:text-green-400',
    bgColor: 'bg-green-500/10',
    borderColor: 'border-green-500/20',
  },
  confirmed: {
    icon: ShieldCheck,
    label: 'Confirmed',
    color: 'text-blue-600 dark:text-blue-400',
    bgColor: 'bg-blue-500/10',
    borderColor: 'border-blue-500/20',
  },
  completed: {
    icon: CheckCircle2,
    label: 'Completed',
    color: 'text-brand-primary',
    bgColor: 'bg-brand-primary/10',
    borderColor: 'border-brand-primary/20',
  },
  cancelled: {
    icon: Ban,
    label: 'Cancelled',
    color: 'text-destructive',
    bgColor: 'bg-destructive/10',
    borderColor: 'border-destructive/20',
  },
  refunded: {
    icon: RefreshCw,
    label: 'Refunded',
    color: 'text-muted-foreground',
    bgColor: 'bg-muted',
    borderColor: 'border-border',
  },
};

export default function BookingStatusPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = use(params);
  const router = useRouter();

  const {
    data: booking,
    isLoading,
    isError,
    error,
  } = useBookingStatus(reference);

  const isPending = booking?.status === 'pending_payment';

  const handleCopyReference = () => {
    navigator.clipboard.writeText(reference);
    toast.success('Reference copied to clipboard');
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return 'N/A';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-NG', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const config = booking ? statusConfig[booking.status] : null;
  const StatusIcon = config?.icon || AlertCircle;

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.02] dark:opacity-[0.01]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="booking-dots"
                x="0"
                y="0"
                width="32"
                height="32"
                patternUnits="userSpaceOnUse"
              >
                <circle cx="16" cy="16" r="1" fill="currentColor" opacity="0.4" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#booking-dots)" />
          </svg>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-brand-primary/5 to-transparent blur-3xl" />
        </div>

        <div className="max-w-2xl mx-auto px-4 sm:px-6">
          {/* Loading State */}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10 rounded-2xl bg-card border border-border/60 shadow-xl text-center"
            >
              <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto mb-6">
                <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
              </div>
              <h1 className="text-2xl font-serif font-bold mb-2">Verifying Payment...</h1>
              <p className="text-muted-foreground">
                Please wait while we confirm your booking details.
              </p>
            </motion.div>
          )}

          {/* Error State */}
          {isError && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-10 rounded-2xl bg-card border border-border/60 shadow-xl text-center"
            >
              <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-10 h-10 text-destructive" />
              </div>
              <h1 className="text-2xl font-serif font-bold mb-2">Booking Not Found</h1>
              <p className="text-muted-foreground mb-6">
                We could not find a booking with the provided reference. Please check the reference number and try again.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                <button
                  onClick={() => router.push('/consultations')}
                  className="px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300"
                >
                  Book a Consultation
                </button>
              </div>
            </motion.div>
          )}

          {/* Success / Booking Details */}
          {booking && config && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-6"
            >
              {/* Status Header Card */}
              <div className="p-8 sm:p-10 rounded-2xl bg-card border border-border/60 shadow-xl text-center">
                {/* Animated Checkmark for paid/confirmed/completed */}
                {(booking.status === 'paid' || booking.status === 'confirmed' || booking.status === 'completed') && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
                    className={`w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-6`}
                  >
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ delay: 0.4, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <StatusIcon className={`w-10 h-10 ${config.color}`} />
                    </motion.div>
                  </motion.div>
                )}

                {/* Pending payment spinner */}
                {booking.status === 'pending_payment' && (
                  <div className={`w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-6`}>
                    <Loader2 className={`w-10 h-10 ${config.color} animate-spin`} />
                  </div>
                )}

                {/* Cancelled/Refunded */}
                {(booking.status === 'cancelled' || booking.status === 'refunded') && (
                  <div className={`w-20 h-20 rounded-full ${config.bgColor} flex items-center justify-center mx-auto mb-6`}>
                    <StatusIcon className={`w-10 h-10 ${config.color}`} />
                  </div>
                )}

                <h1 className="text-2xl sm:text-3xl font-serif font-bold mb-2">
                  {booking.status === 'pending_payment'
                    ? 'Verifying Payment...'
                    : booking.status === 'paid'
                      ? 'Booking Confirmed!'
                      : booking.status === 'confirmed'
                        ? 'Consultation Scheduled'
                        : booking.status === 'completed'
                          ? 'Consultation Completed'
                          : booking.status === 'cancelled'
                            ? 'Booking Cancelled'
                            : 'Booking Refunded'}
                </h1>

                <p className="text-muted-foreground max-w-md mx-auto">
                  {booking.status === 'pending_payment'
                    ? 'We are waiting for payment confirmation. This usually takes a few moments.'
                    : booking.status === 'paid' || booking.status === 'confirmed'
                      ? 'Your consultation has been booked successfully. We will reach out to confirm the details.'
                      : 'Thank you for using LightField Legal Practitioners.'}
                </p>

                {/* Status Badge */}
                <div className="mt-6">
                  <span
                    className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border ${config.bgColor} ${config.color} ${config.borderColor}`}
                  >
                    <StatusIcon className="w-4 h-4" />
                    {config.label}
                  </span>
                </div>
              </div>

              {/* Reference Number */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="p-6 rounded-2xl bg-card border-2 border-dashed border-brand-primary/30 text-center"
              >
                <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2 font-medium">
                  Booking Reference
                </p>
                <div className="flex items-center justify-center gap-3">
                  <code className="text-xl sm:text-2xl font-mono font-bold text-brand-primary tracking-wider">
                    {reference}
                  </code>
                  <button
                    onClick={handleCopyReference}
                    className="p-2 rounded-lg hover:bg-muted transition-colors"
                    title="Copy reference"
                  >
                    <Copy className="w-4 h-4 text-muted-foreground" />
                  </button>
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  Save this reference number for your records
                </p>
              </motion.div>

              {/* Booking Details */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="p-6 rounded-2xl bg-card border border-border/60 space-y-5"
              >
                <h3 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">
                  Booking Details
                </h3>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                      <FileText className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Service</p>
                      <p className="text-sm font-medium">{booking.service_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                      <User className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Client</p>
                      <p className="text-sm font-medium">{booking.client_name}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                      <Mail className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Email</p>
                      <p className="text-sm font-medium">{booking.client_email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                      <Calendar className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Date</p>
                      <p className="text-sm font-medium">{formatDate(booking.preferred_date)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                      <Clock className="w-4 h-4 text-brand-primary" />
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Time</p>
                      <p className="text-sm font-medium">{booking.preferred_time}</p>
                    </div>
                  </div>
                </div>

                {/* Amount */}
                <div className="pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Amount Paid</span>
                    <span className="text-xl font-bold text-brand-primary">
                      {booking.formatted_amount}
                    </span>
                  </div>
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="flex flex-col sm:flex-row items-center justify-center gap-3"
              >
                <button
                  onClick={() => router.push('/')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl border-2 border-border/50 text-muted-foreground font-medium hover:border-brand-primary/40 hover:text-foreground hover:bg-brand-primary/5 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  Return Home
                </button>
                <button
                  onClick={() => router.push('/consultations')}
                  className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300 shadow-lg shadow-brand-primary/20 flex items-center justify-center gap-2"
                >
                  Book Another
                  <ArrowRight className="w-4 h-4" />
                </button>
              </motion.div>
            </motion.div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
