'use client';

import { motion, AnimatePresence } from 'framer-motion';
import type { ConsultationServicePublic } from '@/types';
import ServiceCard from './ServiceCard';

interface ServiceSelectorProps {
  services: ConsultationServicePublic[];
  selectedServiceId: number | null;
  isOtherSelected: boolean;
  onSelectService: (id: number) => void;
  onSelectOther: () => void;
  customDescription: string;
  onCustomDescriptionChange: (value: string) => void;
}

const otherService: ConsultationServicePublic = {
  id: -1,
  name: 'Other / Custom',
  slug: 'other',
  description: 'Need something specific? Describe your legal needs and we will tailor a consultation for you.',
  short_description: 'Describe your legal needs and we will tailor a consultation for you.',
  category: 'other',
  price: 50000,
  currency: 'NGN',
  formatted_price: 'Starting from \u20A650,000',
  duration_minutes: 60,
  formatted_duration: '1 hour',
  icon_name: 'HelpCircle',
  image_url: null,
  is_featured: false,
};

export default function ServiceSelector({
  services,
  selectedServiceId,
  isOtherSelected,
  onSelectService,
  onSelectOther,
  customDescription,
  onCustomDescriptionChange,
}: ServiceSelectorProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-serif font-bold mb-2">Select a Service</h2>
        <p className="text-muted-foreground">
          Choose the type of legal consultation you need. Each service includes a dedicated session with our specialists.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {services.map((service) => (
          <ServiceCard
            key={service.id}
            service={service}
            selected={selectedServiceId === service.id && !isOtherSelected}
            onSelect={() => onSelectService(service.id)}
          />
        ))}

        {/* Other / Custom Card */}
        <ServiceCard
          service={otherService}
          selected={isOtherSelected}
          onSelect={onSelectOther}
          isOther
        />
      </div>

      {/* Custom Description Textarea */}
      <AnimatePresence>
        {isOtherSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden"
          >
            <div className="pt-2">
              <label className="block text-sm font-medium mb-2">
                Describe your legal needs <span className="text-brand-primary">*</span>
              </label>
              <textarea
                value={customDescription}
                onChange={(e) => onCustomDescriptionChange(e.target.value)}
                rows={4}
                className="w-full px-4 py-3 rounded-xl bg-background border-2 border-border/50 focus:border-brand-primary/40 focus:ring-4 focus:ring-brand-primary/10 outline-none transition-all duration-300 resize-none text-sm"
                placeholder="Tell us about your specific legal consultation needs..."
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
