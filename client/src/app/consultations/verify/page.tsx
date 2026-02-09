'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useVerifyPayment } from '@/hooks/useConsultations';
import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import {
  Loader2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

function VerifyContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const reference = searchParams.get('reference') || searchParams.get('trxref') || '';
  const [hasAttempted, setHasAttempted] = useState(false);

  const verifyMutation = useVerifyPayment();

  useEffect(() => {
    if (reference && !hasAttempted) {
      setHasAttempted(true);
      verifyMutation.mutate(reference, {
        onSuccess: (data) => {
          setTimeout(() => {
            router.push(`/consultations/booking/${reference}`);
          }, 2000);
        },
      });
    }
  }, [reference, hasAttempted]);

  const handleRetry = () => {
    if (reference) {
      verifyMutation.mutate(reference, {
        onSuccess: () => {
          setTimeout(() => {
            router.push(`/consultations/booking/${reference}`);
          }, 2000);
        },
      });
    }
  };

  if (!reference) {
    return (
      <main className="min-h-screen bg-background">
        <Navbar />
        <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
          <div className="max-w-lg mx-auto px-4 sm:px-6 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="p-8 rounded-2xl bg-card border border-border/60"
            >
              <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
                <XCircle className="w-8 h-8 text-destructive" />
              </div>
              <h1 className="text-2xl font-serif font-bold mb-3">Invalid Request</h1>
              <p className="text-muted-foreground mb-6">
                No payment reference was provided. Please try booking again.
              </p>
              <button
                onClick={() => router.push('/consultations')}
                className="px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300"
              >
                Book a Consultation
              </button>
            </motion.div>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-32 pb-20 lg:pt-40 lg:pb-32">
        {/* Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-gradient-to-b from-brand-primary/5 to-transparent blur-3xl" />
        </div>

        <div className="max-w-lg mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="p-8 sm:p-10 rounded-2xl bg-card border border-border/60 shadow-xl text-center"
          >
            {/* Loading State */}
            {verifyMutation.isPending && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto">
                  <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold mb-2">Verifying Payment</h1>
                  <p className="text-muted-foreground">
                    Please wait while we verify your payment with Paystack...
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Secure verification in progress</span>
                </div>
              </motion.div>
            )}

            {/* Success State */}
            {verifyMutation.isSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="space-y-6"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                  className="w-20 h-20 rounded-full bg-green-500/10 flex items-center justify-center mx-auto"
                >
                  <CheckCircle2 className="w-10 h-10 text-green-500" />
                </motion.div>
                <div>
                  <h1 className="text-2xl font-serif font-bold mb-2">Payment Verified</h1>
                  <p className="text-muted-foreground">
                    Your payment has been confirmed. Redirecting to your booking details...
                  </p>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 text-brand-primary animate-spin" />
                  <span className="text-sm text-muted-foreground">Redirecting...</span>
                </div>
              </motion.div>
            )}

            {/* Error State */}
            {verifyMutation.isError && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-destructive/10 flex items-center justify-center mx-auto">
                  <XCircle className="w-10 h-10 text-destructive" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold mb-2">Verification Failed</h1>
                  <p className="text-muted-foreground">
                    We could not verify your payment. This may be a temporary issue.
                  </p>
                </div>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    onClick={handleRetry}
                    className="px-6 py-3 rounded-xl bg-brand-primary text-white font-semibold hover:bg-brand-primary/90 transition-all duration-300 flex items-center gap-2"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Retry Verification
                  </button>
                  <button
                    onClick={() => router.push('/consultations')}
                    className="px-6 py-3 rounded-xl border-2 border-border/50 text-muted-foreground font-medium hover:border-brand-primary/40 hover:text-foreground transition-all duration-300"
                  >
                    Book Again
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Reference: <span className="font-mono text-foreground">{reference}</span>
                </p>
              </motion.div>
            )}

            {/* Idle state (before attempting) */}
            {!verifyMutation.isPending && !verifyMutation.isSuccess && !verifyMutation.isError && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="space-y-6"
              >
                <div className="w-20 h-20 rounded-full bg-brand-primary/10 flex items-center justify-center mx-auto">
                  <Loader2 className="w-10 h-10 text-brand-primary animate-spin" />
                </div>
                <div>
                  <h1 className="text-2xl font-serif font-bold mb-2">Preparing Verification</h1>
                  <p className="text-muted-foreground">
                    Initializing payment verification...
                  </p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

export default function VerifyPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-background flex items-center justify-center">
          <Loader2 className="w-8 h-8 text-brand-primary animate-spin" />
        </main>
      }
    >
      <VerifyContent />
    </Suspense>
  );
}
