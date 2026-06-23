"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { MessageCircle, X, Send, Bot, User, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

// Suggested questions removed for clean professional UI

export function AiChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: `Assalamu Alaikum. I'm ${siteConfig.author.name}'s AI assistant — happy to walk you through his projects, skills, or research. What would you like to know?`,
    },
  ]);
  const [showHint, setShowHint] = useState(true);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const onAdmin = pathname?.startsWith("/admin") ?? false;

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isOpen) {
      if (inputRef.current) inputRef.current.focus();
      setShowHint(false);
    }
  }, [isOpen]);

  if (onAdmin) return null;

  const sendMessage = async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: messageText.trim(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const history = messages
        .filter((m) => m.id !== "welcome")
        .map((m) => ({
          role: m.role,
          content: m.content,
        }));

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: messageText,
          history,
        }),
      });

      const data = await response.json();

      if (data.error) {
        if (data.error === "quota_exceeded") {
          throw new Error("__quota__");
        }
        throw new Error(data.error);
      }

      // Client-side safety: strip any leaked markdown artifacts
      const cleanResponse = (data.response as string)
        .replace(/^(Assistant:|AI:|Bot:)\s*/i, "")
        .replace(/\*\*(.*?)\*\*/g, "$1")  // **bold** → bold
        .replace(/\*(.*?)\*/g, "$1")       // *italic* → italic
        .replace(/`([^`]+)`/g, "$1")       // `code` → code
        .replace(/^#{1,6}\s+/gm, "")       // ## headings
        .replace(/^[-*+]\s+/gm, "• ")      // - list items → • list items
        .trim();

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: cleanResponse,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (err) {
      const isQuota = err instanceof Error && err.message === "__quota__";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: isQuota
          ? `The AI API has hit its daily free-tier limit. It resets every 24 hours. In the meantime, feel free to reach out directly at ${siteConfig.contact.email}!`
          : "Sorry, I'm having trouble connecting right now. Please try again or reach out via email!",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Toggle Button with Hint Bubble */}
      <div className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50">
        <AnimatePresence>
          {showHint && !isOpen && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8, y: 10 }}
              className="absolute bottom-16 right-0 mb-2 hidden sm:block whitespace-nowrap px-4 py-2 rounded-xl bg-neutral-900 dark:bg-neutral-800 text-white text-xs font-medium shadow-xl border border-neutral-800 dark:border-neutral-700 pointer-events-none"
            >
              Ask here to know more
              <div className="absolute -bottom-1 right-6 w-2 h-2 bg-neutral-900 dark:bg-neutral-800 rotate-45 border-r border-b border-neutral-800 dark:border-neutral-700" />
            </motion.div>
          )}
        </AnimatePresence>

        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/90 dark:bg-neutral-900/90 text-amber-600 dark:text-amber-400 shadow-lg shadow-neutral-900/10 dark:shadow-black/30 backdrop-blur-xl flex items-center justify-center transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          aria-label="Toggle AI Chat"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: 90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="chat"
                initial={{ rotate: 90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                exit={{ rotate: -90, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <MessageCircle className="w-6 h-6" />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.5rem)] left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] sm:left-auto sm:right-[max(1rem,env(safe-area-inset-right))] sm:w-95 sm:max-w-[calc(100vw-32px)] h-[min(70vh,34rem)] sm:h-125 max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-150px)] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/85 dark:bg-neutral-900/85 shadow-2xl shadow-neutral-900/15 dark:shadow-black/45 backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="grow">
                <h3 className="font-semibold text-sm text-neutral-900 dark:text-white">AI Assistant</h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">Ask me about {siteConfig.author.name}</p>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div data-lenis-prevent className="grow overflow-y-auto p-4 space-y-4 bg-white/40 dark:bg-neutral-950/40 backdrop-blur-md">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-2 ${
                    message.role === "user" ? "flex-row-reverse" : ""
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === "user"
                        ? "bg-amber-500 text-white"
                        : "bg-neutral-200 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300"
                    }`}
                  >
                    {message.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                      message.role === "user"
                        ? "bg-amber-500/90 text-white rounded-br-md"
                        : "bg-white dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 rounded-bl-md shadow-sm border border-neutral-100 dark:border-neutral-700"
                    }`}
                  >
                    {message.content}
                  </div>
                </motion.div>
              ))}
              
              {isLoading && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2"
                >
                  <div className="w-8 h-8 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center">
                    <Bot className="w-4 h-4 text-neutral-600 dark:text-neutral-300" />
                  </div>
                  <div className="px-4 py-3 rounded-2xl rounded-bl-md bg-white dark:bg-neutral-800 shadow-sm border border-neutral-100 dark:border-neutral-700">
                    <div className="flex items-center gap-1">
                      <motion.span
                        className="w-2 h-2 rounded-full bg-amber-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                      />
                      <motion.span
                        className="w-2 h-2 rounded-full bg-amber-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                      />
                      <motion.span
                        className="w-2 h-2 rounded-full bg-amber-500"
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                      />
                    </div>
                  </div>
                </motion.div>
              )}
              
              <div ref={messagesEndRef} />
            </div>

            {/* Suggested Questions Area Removed */}

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-3 border-t border-neutral-200/50 dark:border-neutral-800/50 bg-white/60 dark:bg-neutral-900/60 backdrop-blur-md"
            >
              <div className="flex items-center gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="grow px-4 py-2.5 rounded-full bg-white/50 dark:bg-neutral-800/50 text-neutral-900 dark:text-white placeholder:text-neutral-500 dark:placeholder:text-neutral-400 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50 border border-neutral-200/50 dark:border-neutral-700/50 focus:border-amber-500/30 transition-all"
                  disabled={isLoading}
                />
                <Button
                  type="submit"
                  size="icon"
                  disabled={!input.trim() || isLoading}
                  className="w-10 h-10 rounded-full bg-amber-500 text-white hover:bg-amber-400 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Send className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
