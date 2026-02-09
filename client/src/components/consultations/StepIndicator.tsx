'use client';

import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

const steps = [
  { number: 1, label: 'Select Service', shortLabel: 'Service' },
  { number: 2, label: 'Your Details', shortLabel: 'Details' },
  { number: 3, label: 'Schedule', shortLabel: 'Schedule' },
  { number: 4, label: 'Review & Pay', shortLabel: 'Review' },
];

interface StepIndicatorProps {
  currentStep: number;
}

export default function StepIndicator({ currentStep }: StepIndicatorProps) {
  return (
    <div className="relative">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;
          const isFuture = currentStep < step.number;

          return (
            <div key={step.number} className="flex items-center flex-1 last:flex-none">
              {/* Step Circle + Label */}
              <div className="flex flex-col items-center relative z-10">
                <motion.div
                  animate={{
                    scale: isActive ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.3 }}
                  className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-sm sm:text-base font-semibold transition-all duration-500 border-2 ${
                    isCompleted
                      ? 'bg-brand-primary border-brand-primary text-white'
                      : isActive
                        ? 'bg-brand-primary border-brand-primary text-white shadow-lg shadow-brand-primary/30'
                        : 'bg-muted border-border text-muted-foreground'
                  }`}
                >
                  {isCompleted ? (
                    <motion.div
                      initial={{ scale: 0, rotate: -180 }}
                      animate={{ scale: 1, rotate: 0 }}
                      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Check className="w-5 h-5" />
                    </motion.div>
                  ) : (
                    step.number
                  )}
                </motion.div>

                {/* Label */}
                <span
                  className={`mt-2 text-[10px] sm:text-xs font-medium transition-colors duration-300 text-center whitespace-nowrap ${
                    isActive
                      ? 'text-brand-primary'
                      : isCompleted
                        ? 'text-brand-primary/70'
                        : 'text-muted-foreground'
                  }`}
                >
                  <span className="hidden sm:inline">{step.label}</span>
                  <span className="sm:hidden">{step.shortLabel}</span>
                </span>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 h-0.5 mx-2 sm:mx-4 bg-border rounded-full overflow-hidden relative -mt-5 sm:-mt-6">
                  <motion.div
                    initial={{ width: '0%' }}
                    animate={{
                      width: isCompleted ? '100%' : isActive ? '50%' : '0%',
                    }}
                    transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-y-0 left-0 bg-brand-primary rounded-full"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
