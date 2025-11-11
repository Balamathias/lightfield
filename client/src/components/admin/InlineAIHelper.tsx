'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Loader2, ArrowRight, X } from 'lucide-react';
import { useBlogAIAssist } from '@/hooks/useAI';
import { toast } from 'sonner';

interface InlineAIHelperProps {
  fieldName: string;
  currentValue?: string;
  context?: {
    title?: string;
    content?: string;
    excerpt?: string;
  };
  onInsert: (value: string) => void;
  suggestions?: string[];
  placeholder?: string;
}

export default function InlineAIHelper({
  fieldName,
  currentValue,
  context,
  onInsert,
  suggestions = [],
  placeholder,
}: InlineAIHelperProps) {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [generatedSuggestion, setGeneratedSuggestion] = useState('');
  const assistMutation = useBlogAIAssist();

  const handleGenerate = async (prompt: string) => {
    setGeneratedSuggestion('');
    setShowSuggestions(true);

    try {
      const result = await assistMutation.mutateAsync({
        prompt,
        context,
      });

      setGeneratedSuggestion(result.suggestion);
    } catch (error: any) {
      toast.error('AI generation failed', {
        description: error.response?.data?.error || error.message,
      });
    }
  };

  const handleQuickSuggestion = (suggestion: string) => {
    handleGenerate(suggestion);
  };

  const handleInsertGenerated = () => {
    if (generatedSuggestion) {
      onInsert(generatedSuggestion);
      setGeneratedSuggestion('');
      setShowSuggestions(false);
      toast.success('Content inserted!');
    }
  };

  return (
    <div className="relative" onClick={(e) => e.stopPropagation()}>
      {/* AI Helper Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowSuggestions(!showSuggestions);
        }}
        type="button"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-xs font-medium shadow-md hover:shadow-lg transition-all"
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>AI Help</span>
      </motion.button>

      {/* Suggestions Dropdown */}
      <AnimatePresence>
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ type: 'spring', damping: 20 }}
            className="absolute top-full mt-2 right-0 w-80 bg-card border border-border rounded-xl shadow-2xl z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-600/10 to-blue-600/10 border-b border-border/50">
              <span className="text-xs font-semibold text-foreground">
                AI Suggestions for {fieldName}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowSuggestions(false);
                }}
                className="p-1 hover:bg-accent rounded transition-colors"
              >
                <X className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
            </div>

            {/* Quick Suggestions */}
            {suggestions.length > 0 && (
              <div className="p-3 space-y-2 border-b border-border/50">
                <p className="text-xs text-muted-foreground mb-2">Quick Actions:</p>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      handleQuickSuggestion(suggestion);
                    }}
                    disabled={assistMutation.isPending}
                    className="w-full text-left px-3 py-2 bg-accent hover:bg-accent/70 text-foreground rounded-lg text-xs transition-colors disabled:opacity-50"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            )}

            {/* Generated Suggestion */}
            {generatedSuggestion && (
              <div className="p-3 bg-muted/30">
                <div className="bg-background rounded-lg p-3 mb-2 max-h-48 overflow-y-auto">
                  <p className="text-xs text-foreground leading-relaxed whitespace-pre-wrap">
                    {generatedSuggestion}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleInsertGenerated();
                  }}
                  className="w-full inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg text-xs font-medium transition-all"
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                  Insert
                </button>
              </div>
            )}

            {/* Loading State */}
            {assistMutation.isPending && (
              <div className="p-4 flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-xs">Generating...</span>
              </div>
            )}

            {/* Placeholder */}
            {!generatedSuggestion && !assistMutation.isPending && suggestions.length === 0 && (
              <div className="p-4 text-center">
                <p className="text-xs text-muted-foreground">
                  {placeholder || 'Click a quick action above to get AI suggestions'}
                </p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
