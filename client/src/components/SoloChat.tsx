'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Sparkles, Loader2, MessageCircle, Bot, User, BookOpen, Users as UsersIcon, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useRouter } from 'next/navigation';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

const SUGGESTED_QUESTIONS = [
  {
    icon: Scale,
    question: "What services do you offer?",
    category: "Services"
  },
  {
    icon: BookOpen,
    question: "Tell me about blockchain law",
    category: "Practice Areas"
  },
  {
    icon: UsersIcon,
    question: "Who are your team members?",
    category: "Team"
  },
  {
    icon: Sparkles,
    question: "How can AI help with legal compliance?",
    category: "AI Law"
  },
];

export default function SoloChat() {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: "Hello! I'm Solo, your AI legal assistant. I can help answer questions about **LightField Legal Practitioners**, our team, services, and insights from our blog. How can I assist you today?",
    },
  ]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [sessionId, setSessionId] = useState<string>('');
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll to bottom
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  // Generate session ID on mount
  useEffect(() => {
    setSessionId(Date.now().toString() + Math.random().toString(36).substring(2));
  }, []);

  const handleSendMessage = async (messageText?: string) => {
    const userMessage = (messageText || input).trim();
    if (!userMessage || isStreaming) return;

    setInput('');
    setShowSuggestions(false); // Hide suggestions after first message

    // Add user message
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);

    // Add empty assistant message for streaming
    setMessages((prev) => [...prev, { role: 'assistant', content: '' }]);
    setIsStreaming(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/solo/chat/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          session_id: sessionId || undefined,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Capture session ID from response headers
      const newSessionId = response.headers.get('X-Session-Id');
      if (newSessionId && !sessionId) {
        setSessionId(newSessionId);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) {
        throw new Error('No reader available');
      }

      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        accumulatedText += chunk;

        // Update the last message with accumulated text
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[newMessages.length - 1] = {
            role: 'assistant',
            content: accumulatedText,
          };
          return newMessages;
        });
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setMessages((prev) => {
        const newMessages = [...prev];
        newMessages[newMessages.length - 1] = {
          role: 'assistant',
          content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment.",
        };
        return newMessages;
      });
    } finally {
      setIsStreaming(false);
    }
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
    handleSendMessage(question);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Floating Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 w-12 h-12 sm:w-14 sm:h-14 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white rounded-full shadow-2xl shadow-[var(--brand-primary)]/30 flex items-center justify-center group"
          >
            <MessageCircle className="w-5 h-5 sm:w-6 sm:h-6 group-hover:scale-110 transition-transform duration-300" />

            {/* Pulse Animation */}
            <span className="absolute inset-0 rounded-full bg-[var(--brand-primary)] animate-ping opacity-20" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat Widget */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-3 right-3 left-3 sm:left-auto sm:bottom-6 sm:right-6 z-50 sm:w-[400px] h-[calc(100vh-100px)] sm:h-[550px] max-h-[600px] bg-background/95 backdrop-blur-xl border border-border/60 rounded-2xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header - Minimal on mobile */}
            <div className="relative bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] p-3 sm:p-4">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
                    <img src='/logo.png' className='w-5 h-5 sm:w-6 sm:h-6 rounded-full' />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm sm:text-base">Solo AI</h3>
                    <div className="hidden sm:flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                      <p className="text-white/80 text-xs">Online</p>
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 rounded-full w-8 h-8 sm:w-9 sm:h-9"
                >
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3 sm:space-y-4">
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-[var(--brand-primary)]/10 text-[var(--brand-primary)]'
                        : 'bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] text-white'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[75%] rounded-2xl p-3 ${
                      message.role === 'user'
                        ? 'bg-[var(--brand-primary)] text-white'
                        : 'bg-muted/60 text-foreground'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <p className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.content}
                      </p>
                    ) : (
                      <div className={`text-sm leading-relaxed prose prose-sm max-w-none ${message.role === 'assistant' ? 'dark:prose-invert' : ''}`}>
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            a: ({ node, href, children, ...props }) => (
                              <a
                                href={href}
                                onClick={(e) => {
                                  e.preventDefault();
                                  if (href?.startsWith('/')) {
                                    router.push(href);
                                    setIsOpen(false);
                                  } else if (href) {
                                    window.open(href, '_blank', 'noopener,noreferrer');
                                  }
                                }}
                                className="text-[var(--brand-primary)] hover:underline cursor-pointer font-medium"
                                {...props}
                              >
                                {children}
                              </a>
                            ),
                            p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                            ul: ({ children }) => <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>,
                            ol: ({ children }) => <ol className="list-decimal pl-4 mb-2 space-y-1">{children}</ol>,
                            strong: ({ children }) => <strong className="font-bold text-foreground">{children}</strong>,
                          }}
                        >
                          {message.content}
                        </ReactMarkdown>
                        {isStreaming && index === messages.length - 1 && (
                          <motion.span
                            animate={{ opacity: [1, 0, 1] }}
                            transition={{ duration: 0.8, repeat: Infinity }}
                            className="inline-block ml-1"
                          >
                            ▊
                          </motion.span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Suggested Questions */}
              {showSuggestions && messages.length === 1 && !isStreaming && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-2"
                >
                  <p className="text-[10px] sm:text-xs text-muted-foreground px-1">Suggested questions:</p>
                  <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
                    {SUGGESTED_QUESTIONS.map((item, index) => {
                      const Icon = item.icon;
                      return (
                        <motion.button
                          key={index}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => handleSuggestedQuestion(item.question)}
                          className="flex items-start gap-1.5 sm:gap-2 p-2 sm:p-3 bg-card hover:bg-[var(--brand-primary)]/5 border border-border/50 hover:border-[var(--brand-primary)]/30 rounded-lg sm:rounded-xl transition-all duration-200 text-left group"
                        >
                          <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[var(--brand-primary)] flex-shrink-0 mt-0.5" />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] sm:text-xs font-medium text-foreground group-hover:text-[var(--brand-primary)] transition-colors line-clamp-2">
                              {item.question}
                            </p>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-2.5 sm:p-4 border-t border-border/50 bg-muted/30">
              <div className="flex items-end gap-2">
                <textarea
                  ref={inputRef}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask about LightField..."
                  disabled={isStreaming}
                  rows={1}
                  className="flex-1 min-h-[40px] max-h-[120px] resize-none bg-background border border-border/50 rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ height: 'auto' }}
                />
                <Button
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || isStreaming}
                  size="icon"
                  className="flex-shrink-0 w-10 h-10 sm:w-11 sm:h-11 bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-secondary)] hover:opacity-90 text-white rounded-xl shadow-lg shadow-[var(--brand-primary)]/25 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStreaming ? (
                    <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </Button>
              </div>
              <p className="text-[10px] sm:text-xs text-muted-foreground mt-1.5 sm:mt-2 text-center">
                Press Enter to send
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
