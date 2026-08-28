"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, User, Loader2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

/** Carries the server's stable error `code` so the UI can pick the right copy. */
class ChatError extends Error {
  constructor(public code: string) {
    super(code);
    this.name = "ChatError";
  }
}

const ERROR_COPY: Record<string, string> = {
  rate_limited:
    "That's a lot of questions at once — give it a minute and try again.",
  upstream_unavailable: `The assistant is temporarily unavailable. Please try again in a moment, or email ${siteConfig.contact.email} directly.`,
  not_configured: `The assistant isn't connected right now. Please reach out at ${siteConfig.contact.email} and you'll get a real reply.`,
  unknown: `Sorry, I'm having trouble connecting. Please try again, or email ${siteConfig.contact.email}.`,
};

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
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const onAdmin = pathname?.startsWith("/admin") ?? false;

  // Scroll the list's own scrollTop rather than calling scrollIntoView on a
  // sentinel: scrollIntoView walks up to scrollable ancestors and was yanking
  // the whole page every time a message arrived.
  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: "smooth" });
  }, [messages, isLoading]);

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setShowHint(false);
    }
  }, [isOpen]);

  // Escape closes the panel and returns focus to the launcher.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setIsOpen(false);
      triggerRef.current?.focus();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  // Clicking outside dismisses it, the way every other floating panel behaves.
  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (panelRef.current?.contains(target)) return;
      if (triggerRef.current?.contains(target)) return;
      setIsOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [isOpen]);

  // The hint bubble is a one-time nudge, not a permanent fixture.
  useEffect(() => {
    const timer = setTimeout(() => setShowHint(false), 8000);
    return () => clearTimeout(timer);
  }, []);

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

      if (!response.ok || data.error) {
        // The server sends a stable `code`; the prose in `error` is for logs and
        // may change. Rate limiting and mis-configuration deserve distinct copy.
        const code = response.status === 429 ? "rate_limited" : data.code;
        throw new ChatError(typeof code === "string" ? code : "unknown");
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
      const code = err instanceof ChatError ? err.code : "unknown";
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: ERROR_COPY[code] ?? ERROR_COPY.unknown,
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
          ref={triggerRef}
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          layout
          transition={{ layout: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
          className="flex h-14 items-center gap-2.5 rounded-full border border-neutral-200/80 bg-white/90 pr-4 pl-1.5 text-accent shadow-lg shadow-neutral-900/10 backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl dark:border-neutral-800/80 dark:bg-neutral-900/90 dark:shadow-black/30"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          aria-label={isOpen ? "Close AI assistant" : "Open AI assistant — ask about the portfolio"}
        >
          <span className="relative h-11 w-11 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5 dark:ring-white/10">
            <Image
              src={siteConfig.author.avatar || "/images/profile.jpg"}
              alt=""
              fill
              sizes="44px"
              className="object-cover"
            />
            {/* Online indicator, matched to the header's status dot. */}
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white bg-green-400 dark:border-neutral-900" />
          </span>

          {/* Collapses away once the panel is open, leaving just the avatar as a
              close affordance — the text would be redundant next to an open panel. */}
          <AnimatePresence initial={false}>
            {!isOpen && (
              <motion.span
                key="label"
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "auto" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden whitespace-nowrap text-sm font-semibold text-neutral-800 dark:text-neutral-100"
              >
                AI Portfolio
              </motion.span>
            )}
          </AnimatePresence>

          {isOpen && (
            <motion.span
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              transition={{ duration: 0.2 }}
              className="shrink-0"
            >
              <X className="h-5 w-5" />
            </motion.span>
          )}
        </motion.button>
      </div>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="false"
            aria-label="AI assistant"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className="fixed z-50 bottom-[calc(max(1rem,env(safe-area-inset-bottom))+4.5rem)] left-[max(0.75rem,env(safe-area-inset-left))] right-[max(0.75rem,env(safe-area-inset-right))] sm:left-auto sm:right-[max(1rem,env(safe-area-inset-right))] sm:w-95 sm:max-w-[calc(100vw-32px)] h-[min(70vh,34rem)] sm:h-125 max-h-[calc(100vh-7rem)] sm:max-h-[calc(100vh-150px)] rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white/85 dark:bg-neutral-900/85 shadow-2xl shadow-neutral-900/15 dark:shadow-black/45 backdrop-blur-xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-neutral-200/80 dark:border-neutral-800/80 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-sm">
              <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-1 ring-black/5 dark:ring-white/10">
                <Image
                  src={siteConfig.author.avatar || "/images/profile.jpg"}
                  alt=""
                  fill
                  sizes="40px"
                  className="object-cover"
                />
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
            <div
              ref={listRef}
              role="log"
              aria-live="polite"
              aria-atomic="false"
              aria-label="Conversation"
              className="grow overflow-y-auto overscroll-contain p-4 space-y-4 bg-white/40 dark:bg-neutral-950/40 backdrop-blur-md"
            >
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
                  aria-label="Message"
                  autoComplete="off"
                  maxLength={2000}
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
