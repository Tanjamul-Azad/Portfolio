"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { cn } from "@/lib/utils";

type ChatMessage = {
  sender: "ai" | "user";
  text: string;
};

export default function AIChatCard({ className }: { className?: string }) {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "ai", text: "Hello! I am your AI assistant." },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed) return;

    setMessages((prev) => [...prev, { sender: "user", text: trimmed }]);
    setInput("");
    setIsTyping(true);

    // Simulated assistant response for local UI demo.
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { sender: "ai", text: "This is a sample AI response." },
      ]);
      setIsTyping(false);
    }, 1200);
  };

  return (
    <div
      className={cn(
        "relative w-90 h-115 rounded-2xl overflow-hidden p-px",
        className
      )}
    >
      <motion.div
        className="absolute inset-0 rounded-2xl border border-amber-500/30"
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      <div className="relative flex flex-col w-full h-full rounded-[15px] border border-border/70 overflow-hidden bg-background/95 backdrop-blur-xl">
        <motion.div
          className="absolute inset-0 bg-linear-to-br from-neutral-100 via-white to-neutral-200 dark:from-neutral-900 dark:via-neutral-950 dark:to-black"
          animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
          transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
          style={{ backgroundSize: "200% 200%" }}
        />

        {Array.from({ length: 16 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-amber-500/20"
            animate={{
              y: ["0%", "-140%"],
              x: [Math.random() * 140 - 70, Math.random() * 140 - 70],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 4.8 + Math.random() * 2.2,
              repeat: Infinity,
              delay: i * 0.45,
              ease: "easeInOut",
            }}
            style={{ left: `${Math.random() * 100}%`, bottom: "-10%" }}
          />
        ))}

        <div className="px-4 py-3 border-b border-border/70 relative z-10">
          <h2 className="text-lg font-semibold font-heading text-foreground">AI Assistant</h2>
        </div>

        <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 text-sm flex flex-col relative z-10">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.35 }}
              className={cn(
                "px-3 py-2 rounded-xl max-w-[80%] shadow-sm backdrop-blur-sm border",
                msg.sender === "ai"
                  ? "bg-neutral-200/70 dark:bg-neutral-800/70 text-foreground border-border/70 self-start"
                  : "bg-amber-500/85 text-black border-amber-400/60 font-medium self-end"
              )}
            >
              {msg.text}
            </motion.div>
          ))}

          {isTyping && (
            <motion.div
              className="flex items-center gap-1 px-3 py-2 rounded-xl max-w-[30%] bg-neutral-200/70 dark:bg-neutral-800/70 border border-border/70 self-start"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 0.6, 1] }}
              transition={{ repeat: Infinity, duration: 1.2 }}
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-200" />
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse delay-400" />
            </motion.div>
          )}
        </div>

        <div className="flex items-center gap-2 p-3 border-t border-border/70 relative z-10">
          <input
            className="grow px-3 py-2 text-sm bg-background/80 rounded-lg border border-border/80 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-amber-500/60"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="p-2 rounded-lg bg-amber-500/90 hover:bg-amber-500 transition-colors"
            aria-label="Send message"
          >
            <Send className="w-4 h-4 text-black" />
          </button>
        </div>
      </div>
    </div>
  );
}
