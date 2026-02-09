'use client';

import { motion } from 'framer-motion';
import { Check, HelpCircle } from 'lucide-react';
import type { ConsultationServicePublic } from '@/types';
import { iconMap } from './iconMap';

interface ServiceCardProps {
  service: ConsultationServicePublic;
  selected: boolean;
  onSelect: () => void;
  isOther?: boolean;
}

export default function ServiceCard({ service, selected, onSelect, isOther = false }: ServiceCardProps) {
  const IconComponent = isOther
    ? HelpCircle
    : iconMap[service.icon_name as keyof typeof iconMap] || HelpCircle;

  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      className={`relative w-full text-left p-6 rounded-2xl border-2 transition-all duration-300 cursor-pointer group ${
        selected
          ? 'border-brand-primary bg-brand-primary/5 shadow-lg shadow-brand-primary/10 ring-2 ring-brand-primary'
          : 'border-border/60 bg-card hover:border-brand-primary/40 hover:shadow-md'
      }`}
    >
      {/* Selected Checkmark */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-4 right-4 w-7 h-7 rounded-full bg-brand-primary flex items-center justify-center"
        >
          <Check className="w-4 h-4 text-white" />
        </motion.div>
      )}

      {/* Icon */}
      <div
        className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors duration-300 ${
          selected
            ? 'bg-brand-primary/15'
            : 'bg-muted group-hover:bg-brand-primary/10'
        }`}
      >
        <IconComponent
          className={`w-6 h-6 transition-colors duration-300 ${
            selected ? 'text-brand-primary' : 'text-muted-foreground group-hover:text-brand-primary'
          }`}
        />
      </div>

      {/* Name */}
      <h3
        className={`font-semibold text-lg mb-2 transition-colors duration-300 ${
          selected ? 'text-brand-primary' : 'text-foreground'
        }`}
      >
        {service.name}
      </h3>

      {/* Short Description */}
      <p className="text-sm text-muted-foreground leading-relaxed mb-4 line-clamp-2">
        {service.short_description}
      </p>

      {/* Price & Duration */}
      <div className="flex items-center justify-between pt-4 border-t border-border/50">
        <span className="text-sm font-bold text-foreground">
          {isOther ? 'Starting from \u20A650,000' : service.formatted_price}
        </span>
        {!isOther && (
          <span className="text-xs text-muted-foreground bg-muted px-2.5 py-1 rounded-full">
            {service.formatted_duration}
          </span>
        )}
      </div>
    </motion.button>
  );
}
