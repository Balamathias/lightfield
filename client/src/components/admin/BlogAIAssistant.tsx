'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Sparkles,
  X,
  Wand2,
  FileText,
  Search,
  Lightbulb,
  Copy,
  Check,
  RefreshCw,
  ArrowRight,
  Loader2,
  Zap,
  TrendingUp,
  FileEdit,
  List,
} from 'lucide-react';
import { useBlogAIAssist } from '@/hooks/useAI';
import { toast } from 'sonner';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface BlogAIAssistantProps {
  context?: {
    title?: string;
    content?: string;
    excerpt?: string;
  };
  onInsertToField?: (fieldName: string, value: string) => void;
}

type TabType = 'quick' | 'enhance' | 'generate' | 'seo';

interface QuickAction {
  icon: any;
  label: string;
  prompt: string;
  targetField: string;
  color: string;
}

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: FileText,
    label: 'Write Introduction',
    prompt: 'Write an engaging, professional introduction paragraph for this legal blog post about the topic.',
    targetField: 'content',
    color: 'from-blue-600 to-cyan-600',
  },
  {
    icon: Sparkles,
    label: 'Generate Excerpt',
    prompt: 'Create a compelling 50-100 word excerpt that summarizes this blog post and entices readers.',
    targetField: 'excerpt',
    color: 'from-purple-600 to-pink-600',
  },
  {
    icon: TrendingUp,
    label: 'SEO Title',
    prompt: 'Improve this title for better SEO while keeping it professional and engaging. Make it clear, specific, and include relevant keywords.',
    targetField: 'title',
    color: 'from-green-600 to-emerald-600',
  },
  {
    icon: Search,
    label: 'Meta Description',
    prompt: 'Write a compelling meta description (max 155 characters) for SEO that includes relevant keywords.',
    targetField: 'meta_description',
    color: 'from-orange-600 to-red-600',
  },
  {
    icon: List,
    label: 'Key Points',
    prompt: 'Generate 5-7 key points or bullet points that should be covered in this blog post about this legal topic.',
    targetField: 'content',
    color: 'from-indigo-600 to-blue-600',
  },
  {
    icon: Lightbulb,
    label: 'SEO Keywords',
    prompt: 'Suggest 8-10 relevant SEO keywords and phrases for this blog post, comma-separated.',
    targetField: 'meta_keywords',
    color: 'from-yellow-600 to-orange-600',
  },
];

export default function BlogAIAssistant({ context, onInsertToField }: BlogAIAssistantProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('quick');
  const [customPrompt, setCustomPrompt] = useState('');
  const [suggestion, setSuggestion] = useState('');
  const [copied, setCopied] = useState(false);
  const [targetField, setTargetField] = useState('content');
  const [isStreaming, setIsStreaming] = useState(false);

  const assistMutation = useBlogAIAssist();

  // Debug logging
  useEffect(() => {
    console.log('BlogAIAssistant mounted/updated:', {
      hasCallback: !!onInsertToField,
      context: context ? Object.keys(context) : 'none',
      suggestion: suggestion?.substring(0, 50),
      targetField,
    });
  }, [onInsertToField, context, suggestion, targetField]);

  const handleQuickAction = async (action: QuickAction) => {
    console.log('Quick action clicked:', action.label, 'Target field:', action.targetField);
    setTargetField(action.targetField);
    await generateSuggestion(action.prompt);
  };

  const generateSuggestion = async (prompt: string) => {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }

    console.log('=== GENERATING SUGGESTION ===');
    console.log('Prompt:', prompt);
    console.log('Context:', context);
    console.log('Target field before:', targetField);

    setSuggestion('');
    setIsStreaming(true);

    try {
      const result = await assistMutation.mutateAsync({
        prompt: prompt.trim(),
        context,
      });

      console.log('=== AI RESPONSE RECEIVED ===');
      console.log('Result:', result);
      console.log('Suggestion:', result.suggestion);

      setSuggestion(result.suggestion);
      setIsStreaming(false);

      console.log('=== SUGGESTION SET IN STATE ===');
      console.log('New suggestion value:', result.suggestion);

      toast.success('AI suggestion generated!');
    } catch (error: any) {
      console.error('=== AI GENERATION FAILED ===', error);
      setIsStreaming(false);
      toast.error('Failed to generate suggestion', {
        description: error.response?.data?.error || error.message,
      });
    }
  };

  const handleCustomSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await generateSuggestion(customPrompt);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(suggestion);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleInsert = () => {
    console.log('=== HANDLE INSERT CALLED ===');
    console.log('Suggestion state:', suggestion);
    console.log('Target field:', targetField);
    console.log('Has callback:', !!onInsertToField);

    if (!suggestion) {
      console.error('No suggestion available!');
      toast.error('No suggestion to insert');
      return;
    }

    if (!onInsertToField) {
      console.error('No callback function!');
      toast.error('Insert callback not provided');
      return;
    }

    console.log('=== CALLING onInsertToField ===');
    console.log('Field:', targetField);
    console.log('Value (first 100 chars):', suggestion.substring(0, 100));

    try {
      onInsertToField(targetField, suggestion);
      console.log('=== CALLBACK EXECUTED SUCCESSFULLY ===');
      toast.success(`Inserted into ${targetField.replace(/_/g, ' ')}!`);
      setSuggestion('');
      setCustomPrompt('');
    } catch (error) {
      console.error('=== CALLBACK EXECUTION FAILED ===', error);
      toast.error('Failed to insert content');
    }
  };

  const handleRefine = () => {
    if (suggestion) {
      setCustomPrompt(`Make this better: ${suggestion}`);
      setSuggestion('');
    }
  };

  const tabs = [
    { id: 'quick' as TabType, label: 'Quick Actions', icon: Zap },
    { id: 'enhance' as TabType, label: 'Enhance', icon: Wand2 },
    { id: 'generate' as TabType, label: 'Generate', icon: FileEdit },
    { id: 'seo' as TabType, label: 'SEO', icon: TrendingUp },
  ];

  return (
    <>
      {/* Floating AI Button - Premium Design */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            type="button"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            exit={{ scale: 0, rotate: 180 }}
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              setIsOpen(true);
            }}
            className="fixed bottom-8 right-8 z-40 p-5 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white rounded-2xl shadow-2xl shadow-purple-500/30 hover:shadow-purple-500/50 transition-all group"
            title="AI Writing Assistant"
          >
            <Sparkles className="w-7 h-7" />

            {/* Pulse Effect */}
            <span className="absolute inset-0 rounded-2xl bg-gradient-to-br from-purple-400 via-blue-400 to-cyan-400 animate-ping opacity-20" />

            {/* Badge */}
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -top-2 -right-2 w-7 h-7 bg-green-500 rounded-full border-2 border-white flex items-center justify-center"
            >
              <Wand2 className="w-4 h-4 text-white" />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>

      {/* AI Assistant Panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
            />

            {/* Side Panel */}
            <motion.div
              initial={{ x: '100%', opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: '100%', opacity: 0 }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 z-50 w-full max-w-2xl shadow-2xl"
            >
              <div className="h-full bg-background border-l border-border flex flex-col">
                {/* Header */}
                <div className="relative p-6 border-b border-border/50 bg-gradient-to-br from-purple-600/5 via-blue-600/5 to-cyan-600/5">
                  {/* Animated Background */}
                  <div className="absolute inset-0 opacity-[0.02]">
                    <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                      <defs>
                        <pattern id="ai-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                          <circle cx="10" cy="10" r="1" fill="currentColor" />
                        </pattern>
                      </defs>
                      <rect width="100%" height="100%" fill="url(#ai-pattern)" />
                    </svg>
                  </div>

                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <motion.div
                        animate={{ rotate: isStreaming ? 360 : 0 }}
                        transition={{ duration: 2, repeat: isStreaming ? Infinity : 0, ease: 'linear' }}
                        className="w-14 h-14 bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30"
                      >
                        <Sparkles className="w-7 h-7 text-white" />
                      </motion.div>
                      <div>
                        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
                          AI Writing Assistant
                          {isStreaming && (
                            <span className="flex gap-1">
                              <span className="w-1.5 h-1.5 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                          )}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Powered by advanced AI • {context?.title ? 'Context loaded' : 'No context'}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setIsOpen(false);
                      }}
                      className="p-2 hover:bg-accent rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5 text-muted-foreground" />
                    </button>
                  </div>

                  {/* Tabs */}
                  <div className="relative mt-6 flex gap-2">
                    {tabs.map((tab) => {
                      const Icon = tab.icon;
                      return (
                        <button
                          key={tab.id}
                          type="button"
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            setActiveTab(tab.id);
                          }}
                          className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl transition-all ${
                            activeTab === tab.id
                              ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white shadow-lg'
                              : 'bg-card hover:bg-accent text-muted-foreground hover:text-foreground'
                          }`}
                        >
                          <Icon className="w-4 h-4" />
                          <span className="text-sm font-medium hidden sm:inline">{tab.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Quick Actions Tab */}
                  {activeTab === 'quick' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Zap className="w-4 h-4 text-purple-600" />
                          One-Click AI Actions
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          Click any action to generate content instantly
                        </p>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        {QUICK_ACTIONS.map((action, index) => {
                          const Icon = action.icon;
                          return (
                            <motion.button
                              key={index}
                              type="button"
                              whileHover={{ scale: 1.02, y: -2 }}
                              whileTap={{ scale: 0.98 }}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleQuickAction(action);
                              }}
                              disabled={isStreaming}
                              className={`group relative flex items-start gap-3 p-4 bg-gradient-to-br ${action.color} text-white rounded-xl shadow-lg hover:shadow-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden`}
                            >
                              {/* Shimmer Effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />

                              <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
                              <div className="flex-1 text-left">
                                <p className="text-sm font-semibold">{action.label}</p>
                              </div>
                            </motion.button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* Enhance Tab */}
                  {activeTab === 'enhance' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <Wand2 className="w-4 h-4 text-purple-600" />
                          Enhance Existing Content
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {[
                          { label: 'Make more professional', prompt: 'Rewrite this in a more professional, authoritative legal tone suitable for a law firm blog.' },
                          { label: 'Add legal examples', prompt: 'Add 2-3 relevant legal examples or case studies to illustrate the points.' },
                          { label: 'Simplify language', prompt: 'Simplify the language to make it more accessible while maintaining legal accuracy.' },
                          { label: 'Add statistics/data', prompt: 'Suggest relevant statistics, data points, or research findings that would strengthen this content.' },
                          { label: 'Expand with details', prompt: 'Expand this content with more detailed explanations and practical implications.' },
                          { label: 'Add call-to-action', prompt: 'Add a compelling call-to-action at the end that encourages readers to contact the firm.' },
                        ].map((item, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCustomPrompt(item.prompt);
                              setTargetField('content');
                            }}
                            className="w-full text-left px-4 py-3 bg-card hover:bg-accent border border-border hover:border-purple-500/30 rounded-xl transition-all group"
                          >
                            <p className="text-sm font-medium text-foreground group-hover:text-purple-600 transition-colors">
                              {item.label}
                            </p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Generate Tab */}
                  {activeTab === 'generate' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <FileEdit className="w-4 h-4 text-purple-600" />
                          Generate New Content
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {[
                          { label: 'Generate full blog outline', prompt: 'Create a comprehensive outline for this blog post with main sections, subsections, and key points to cover.' },
                          { label: 'Write conclusion paragraph', prompt: 'Write a strong conclusion paragraph that summarizes the key takeaways and includes a call-to-action.' },
                          { label: 'Create FAQ section', prompt: 'Generate 4-5 frequently asked questions and answers related to this topic.' },
                          { label: 'Draft executive summary', prompt: 'Write a concise executive summary (2-3 paragraphs) of the main points.' },
                          { label: 'Generate case study', prompt: 'Create a hypothetical case study or example scenario that illustrates the legal concepts discussed.' },
                        ].map((item, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCustomPrompt(item.prompt);
                              setTargetField('content');
                            }}
                            className="w-full text-left px-4 py-3 bg-card hover:bg-accent border border-border hover:border-blue-500/30 rounded-xl transition-all group"
                          >
                            <p className="text-sm font-medium text-foreground group-hover:text-blue-600 transition-colors">
                              {item.label}
                            </p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* SEO Tab */}
                  {activeTab === 'seo' && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-4"
                    >
                      <div>
                        <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                          <TrendingUp className="w-4 h-4 text-purple-600" />
                          SEO Optimization
                        </h3>
                      </div>

                      <div className="space-y-3">
                        {[
                          { label: 'Optimize for Google', prompt: 'Analyze this blog post for SEO and suggest improvements for better Google rankings. Include keyword density recommendations.', field: 'content' },
                          { label: 'Generate meta tags', prompt: 'Generate optimized meta title, meta description, and meta keywords for maximum SEO impact.', field: 'meta_description' },
                          { label: 'Suggest internal links', prompt: 'Suggest 3-5 relevant internal link opportunities where we could link to other practice areas or blog posts.', field: 'content' },
                          { label: 'Add schema markup', prompt: 'Suggest appropriate schema.org markup (JSON-LD) for this blog post to enhance search results.', field: 'content' },
                          { label: 'Improve readability', prompt: 'Analyze readability and suggest improvements for better user engagement and SEO.', field: 'content' },
                        ].map((item, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setCustomPrompt(item.prompt);
                              setTargetField(item.field);
                            }}
                            className="w-full text-left px-4 py-3 bg-card hover:bg-accent border border-border hover:border-green-500/30 rounded-xl transition-all group"
                          >
                            <p className="text-sm font-medium text-foreground group-hover:text-green-600 transition-colors">
                              {item.label}
                            </p>
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}

                  {/* Custom Prompt Section */}
                  <div className="bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/20 dark:to-blue-950/20 rounded-xl p-5 border border-purple-200/50 dark:border-purple-800/30">
                    <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
                      <Lightbulb className="w-4 h-4 text-purple-600" />
                      Custom Request
                    </h3>
                    <form onSubmit={handleCustomSubmit} className="space-y-3">
                      <textarea
                        value={customPrompt}
                        onChange={(e) => setCustomPrompt(e.target.value)}
                        placeholder="Ask AI anything about your blog... (e.g., 'Explain smart contracts in simple terms', 'Add a section about regulatory compliance')"
                        rows={3}
                        className="w-full px-4 py-3 rounded-xl border border-input bg-background/80 backdrop-blur-sm text-foreground placeholder:text-muted-foreground/60 focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition resize-none text-sm"
                        disabled={isStreaming}
                      />
                      <div className="flex gap-2">
                        <select
                          value={targetField}
                          onChange={(e) => setTargetField(e.target.value)}
                          className="px-3 py-2 text-sm bg-background border border-input rounded-lg focus:ring-2 focus:ring-purple-500/50"
                        >
                          <option value="content">Content</option>
                          <option value="title">Title</option>
                          <option value="excerpt">Excerpt</option>
                          <option value="meta_description">Meta Description</option>
                          <option value="meta_keywords">Keywords</option>
                        </select>
                        <button
                          type="submit"
                          disabled={isStreaming || !customPrompt.trim()}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-lg"
                        >
                          {isStreaming ? (
                            <>
                              <Loader2 className="w-4 h-4 animate-spin" />
                              <span>Generating...</span>
                            </>
                          ) : (
                            <>
                              <Sparkles className="w-4 h-4" />
                              <span>Generate</span>
                            </>
                          )}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* AI Suggestion Display */}
                  <AnimatePresence mode="wait">
                    {suggestion && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: -20 }}
                        transition={{ type: 'spring', damping: 20 }}
                        className="bg-gradient-to-br from-card to-muted/30 rounded-2xl p-6 border border-border/60 shadow-xl"
                      >
                        {/* Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                              <Sparkles className="w-4 h-4 text-white" />
                            </div>
                            <span className="text-sm font-semibold text-foreground">AI Suggestion</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleCopy();
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-background hover:bg-accent rounded-lg transition-colors border border-border"
                            >
                              {copied ? (
                                <>
                                  <Check className="w-3 h-3 text-green-500" />
                                  <span>Copied</span>
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" />
                                  <span>Copy</span>
                                </>
                              )}
                            </button>
                          </div>
                        </div>

                        {/* Suggestion Content */}
                        <div className="bg-background/60 backdrop-blur-sm rounded-xl p-4 mb-4 border border-border/50 max-h-96 overflow-y-auto">
                          <div className="prose prose-sm dark:prose-invert max-w-none">
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                p: ({ children }) => <p className="mb-2 last:mb-0 text-foreground">{children}</p>,
                                ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                                ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                                strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                                li: ({ children }) => <li className="text-foreground">{children}</li>,
                              }}
                            >
                              {suggestion}
                            </ReactMarkdown>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-2">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleInsert();
                            }}
                            className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-xl transition-all font-medium text-sm shadow-lg hover:shadow-xl"
                          >
                            <ArrowRight className="w-4 h-4" />
                            Insert to {targetField.replace('_', ' ')}
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              handleRefine();
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-background hover:bg-accent border border-border rounded-xl transition-all text-sm font-medium"
                          >
                            <RefreshCw className="w-4 h-4" />
                            Refine
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setSuggestion('');
                              setCustomPrompt('');
                            }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-background hover:bg-accent border border-border rounded-xl transition-all text-sm font-medium"
                          >
                            <X className="w-4 h-4" />
                            Clear
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Context Info */}
                  {context && (
                    <div className="bg-muted/30 rounded-xl p-4 border border-border/50">
                      <p className="text-xs font-semibold text-muted-foreground mb-2">Current Context:</p>
                      <div className="space-y-1.5 text-xs text-muted-foreground">
                        {context.title && (
                          <div>
                            <span className="font-semibold text-foreground">Title:</span>{' '}
                            <span className="line-clamp-1">{context.title}</span>
                          </div>
                        )}
                        {context.excerpt && (
                          <div>
                            <span className="font-semibold text-foreground">Excerpt:</span>{' '}
                            <span className="line-clamp-2">{context.excerpt}</span>
                          </div>
                        )}
                        {context.content && (
                          <div>
                            <span className="font-semibold text-foreground">Content:</span>{' '}
                            <span>{context.content.length} characters</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Tips */}
                  <div className="bg-gradient-to-br from-blue-50/50 to-cyan-50/50 dark:from-blue-950/20 dark:to-cyan-950/20 rounded-xl p-4 border border-blue-200/50 dark:border-blue-800/30">
                    <p className="text-xs font-semibold text-blue-700 dark:text-blue-400 mb-2">💡 Pro Tips:</p>
                    <ul className="text-xs text-blue-600 dark:text-blue-300 space-y-1">
                      <li>• Fill in the title first for better context-aware suggestions</li>
                      <li>• Use "Enhance" to improve existing content</li>
                      <li>• Try "SEO" tab for search optimization tips</li>
                      <li>• Click "Refine" to improve any suggestion</li>
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
