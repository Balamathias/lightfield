'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Send, Loader2, Lightbulb, Copy, Check, ArrowRight } from 'lucide-react';
import { useBlogAIAssist } from '@/hooks/useAI';
import { toast } from 'sonner';

interface BlogAIAssistantProps {
  context?: {
    title?: string;
    content?: string;
    excerpt?: string;
  };
  onInsert?: (text: string, target?: string) => void;
  onInsertToField?: (fieldName: string, value: string) => void;
}

export default function BlogAIAssistant({ context, onInsert, onInsertToField }: BlogAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [copied, setCopied] = useState(false);
  const [insertTarget, setInsertTarget] = useState<string>('content');

  const assistMutation = useBlogAIAssist();
  const isGenerating = assistMutation.isPending;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    try {
      const result = await assistMutation.mutateAsync({
        prompt: prompt.trim(),
        context,
      });

      setSuggestion(result.suggestion);
      toast.success('AI suggestion generated!');
    } catch (error: any) {
      toast.error('Failed to generate suggestion', {
        description: error.response?.data?.error || error.message,
      });
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    if (suggestion) {
      if (onInsertToField) {
        onInsertToField(insertTarget, suggestion);
        toast.success(`Inserted into ${insertTarget}!`);
      } else if (onInsert) {
        onInsert(suggestion, insertTarget);
        toast.success('Text inserted!');
      }
      setSuggestion('');
      setPrompt('');
    }
  };

  const quickPrompts = [
    { label: 'Write an engaging introduction', target: 'content' },
    { label: 'Create a compelling excerpt', target: 'excerpt' },
    { label: 'Generate meta description', target: 'meta_description' },
    { label: 'Suggest SEO keywords', target: 'meta_keywords' },
    { label: 'Improve title for SEO', target: 'title' },
    { label: 'Suggest 5-7 key points to cover', target: 'content' },
    { label: 'Explain this concept simply', target: 'content' },
    { label: 'Expand on this topic with examples', target: 'content' },
  ];

  return (
    <>
      {/* Floating AI Button */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(true)}
          className="fixed bottom-8 right-8 z-50 p-4 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white rounded-full shadow-2xl transition-all"
          title="AI Writing Assistant"
        >
          <Sparkles className="w-6 h-6 animate-pulse" />
        </motion.button>
      )}

      {/* AI Assistant Side Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40"
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className={`fixed top-0 right-0 bottom-0 z-50 w-full max-w-md ${
                isGenerating ? 'shadow-[0_0_80px_rgba(168,85,247,0.4)]' : 'shadow-2xl'
              } transition-shadow duration-300`}
            >
              <div
                className={`h-full bg-gradient-to-br from-card via-card to-card/95 border-l-2 ${
                  isGenerating
                    ? 'border-l-purple-500 animate-pulse'
                    : 'border-l-purple-600/30'
                } flex flex-col backdrop-blur-xl`}
              >
                {/* Header */}
                <div className="relative p-6 border-b border-border/50 bg-gradient-to-br from-purple-600/10 via-blue-600/5 to-transparent">
                  {/* Glow effect */}
                  {isGenerating && (
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 animate-pulse" />
                  )}

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-11 h-11 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                        <Sparkles className="w-6 h-6 text-white" />
                        {isGenerating && (
                          <div className="absolute inset-0 bg-gradient-to-br from-purple-400 to-blue-400 rounded-xl animate-ping opacity-75" />
                        )}
                      </div>
                      <div>
                        <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                          AI Assistant
                          {isGenerating && (
                            <span className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                          )}
                        </h2>
                        <p className="text-xs text-muted-foreground">
                          Powered by Gemini 2.0
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setIsOpen(false)}
                      className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar">
                  {/* Quick Prompts */}
                  {!suggestion && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                        <Lightbulb className="w-4 h-4" />
                        Quick Actions
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {quickPrompts.map((quickPrompt) => (
                          <button
                            key={quickPrompt.label}
                            onClick={() => {
                              setPrompt(quickPrompt.label);
                              setInsertTarget(quickPrompt.target);
                            }}
                            className="px-3 py-2 text-sm text-left bg-accent hover:bg-accent/80 text-foreground rounded-lg transition-colors"
                          >
                            {quickPrompt.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Suggestion Display */}
                  {suggestion && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-secondary/50 rounded-xl p-6 space-y-4"
                    >
                      <div className="flex items-center justify-between flex-wrap gap-3">
                        <span className="text-sm font-medium text-muted-foreground">
                          AI Suggestion
                        </span>
                        <div className="flex items-center gap-2 flex-wrap">
                          {(onInsert || onInsertToField) && (
                            <select
                              value={insertTarget}
                              onChange={(e) => setInsertTarget(e.target.value)}
                              className="px-3 py-1.5 text-sm bg-background border border-input rounded-lg focus:ring-2 focus:ring-ring"
                            >
                              <option value="content">Content</option>
                              <option value="excerpt">Excerpt</option>
                              <option value="title">Title</option>
                              <option value="meta_description">Meta Description</option>
                              <option value="meta_keywords">Keywords</option>
                            </select>
                          )}
                          <button
                            onClick={handleCopy}
                            className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-card hover:bg-card/80 rounded-lg transition-colors"
                          >
                            {copied ? (
                              <>
                                <Check className="w-4 h-4 text-green-500" />
                                Copied
                              </>
                            ) : (
                              <>
                                <Copy className="w-4 h-4" />
                                Copy
                              </>
                            )}
                          </button>
                          {(onInsert || onInsertToField) && (
                            <button
                              onClick={handleInsert}
                              className="inline-flex items-center gap-2 px-3 py-1.5 text-sm bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg transition-colors"
                            >
                              Insert to {insertTarget}
                            </button>
                          )}
                        </div>
                      </div>
                      <div className="prose prose-sm dark:prose-invert max-w-none bg-background/50 rounded-lg p-4">
                        <p className="whitespace-pre-wrap text-foreground leading-relaxed">{suggestion}</p>
                      </div>
                      <button
                        onClick={() => {
                          setSuggestion('');
                          setPrompt('');
                        }}
                        className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                      >
                        ✨ Clear & ask another question
                      </button>
                    </motion.div>
                  )}

                  {/* Context Info */}
                  {context && (
                    <div className="text-xs text-muted-foreground bg-secondary/30 rounded-lg p-3">
                      <p className="font-medium mb-1">Current Context:</p>
                      {context.title && (
                        <p>
                          <span className="font-semibold">Title:</span> {context.title}
                        </p>
                      )}
                      {context.excerpt && (
                        <p>
                          <span className="font-semibold">Excerpt:</span>{' '}
                          {context.excerpt.substring(0, 100)}
                          {context.excerpt.length > 100 && '...'}
                        </p>
                      )}
                    </div>
                  )}
                </div>

                {/* Input Form */}
                <form onSubmit={handleSubmit} className="p-6 border-t border-border/50 bg-gradient-to-br from-purple-600/5 via-transparent to-blue-600/5">
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      placeholder="Ask AI anything..."
                      className="w-full px-4 py-3 rounded-xl border border-input bg-background/50 backdrop-blur-sm text-foreground placeholder:text-muted-foreground/50 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all"
                      disabled={isGenerating}
                    />
                    <button
                      type="submit"
                      disabled={isGenerating || !prompt.trim()}
                      className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 via-blue-600 to-cyan-600 hover:from-purple-700 hover:via-blue-700 hover:to-cyan-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg hover:shadow-xl disabled:shadow-none"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin" />
                          <span>Generating magic...</span>
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5" />
                          <span>Generate</span>
                          <ArrowRight className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
