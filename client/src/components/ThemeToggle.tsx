'use client';

import { useState, useEffect, useRef } from 'react';
import { Moon, Sun, Monitor, Check } from 'lucide-react';
import { useTheme } from 'next-themes';
import { motion, AnimatePresence } from 'framer-motion';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTheme = theme === 'system' ? systemTheme : theme;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!mounted) {
    return (
      <div className="w-9 h-9 rounded-lg bg-accent animate-pulse" />
    );
  }

  const themes = [
    {
      value: 'light',
      label: 'Light',
      icon: Sun,
      description: 'Bright and clear',
    },
    {
      value: 'dark',
      label: 'Dark',
      icon: Moon,
      description: 'Easy on the eyes',
    },
    {
      value: 'system',
      label: 'System',
      icon: Monitor,
      description: 'Match your device',
    },
  ];

  const getCurrentIcon = () => {
    if (theme === 'system') return Monitor;
    if (currentTheme === 'dark') return Moon;
    return Sun;
  };

  const CurrentIcon = getCurrentIcon();

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-accent hover:bg-accent/80 transition-colors group"
        aria-label="Toggle theme"
      >
        <CurrentIcon className="w-5 h-5 text-foreground transition-transform group-hover:rotate-12" />

        {/* Active indicator */}
        <span className="absolute bottom-1 right-1 w-1.5 h-1.5 bg-primary rounded-full" />
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 w-56 bg-card/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-2xl overflow-hidden z-50"
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-border/50">
              <h3 className="text-sm font-semibold text-foreground">Theme</h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Choose your appearance
              </p>
            </div>

            {/* Theme Options */}
            <div className="p-2">
              {themes.map((themeOption) => {
                const Icon = themeOption.icon;
                const isActive = theme === themeOption.value;

                return (
                  <button
                    key={themeOption.value}
                    onClick={() => {
                      setTheme(themeOption.value);
                      setIsOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-accent text-foreground'
                    }`}
                  >
                    <div
                      className={`p-2 rounded-lg transition-colors ${
                        isActive
                          ? 'bg-primary/20'
                          : 'bg-accent'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 text-left">
                      <p className="text-sm font-medium">{themeOption.label}</p>
                      <p className="text-xs text-muted-foreground">
                        {themeOption.description}
                      </p>
                    </div>
                    {isActive && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                      >
                        <Check className="w-4 h-4" />
                      </motion.div>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Footer Info */}
            <div className="px-4 py-2 border-t border-border/50 bg-accent/30">
              <p className="text-xs text-muted-foreground">
                {theme === 'system' ? (
                  <>
                    Currently using <span className="font-medium text-foreground">{currentTheme}</span> mode
                  </>
                ) : (
                  <>
                    Theme set to <span className="font-medium text-foreground">{theme}</span>
                  </>
                )}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
