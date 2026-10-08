"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import Markdown, { type Components } from "react-markdown";
import {
  ArrowUp,
  Briefcase,
  Check,
  Copy,
  FlaskConical,
  FolderKanban,
  Mail,
  RotateCcw,
  Square,
  X,
} from "lucide-react";
import { siteConfig } from "@/config";
import { splitFollowUps } from "@/lib/chat/constants";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  /** Set on assistant turns that are an error notice rather than an answer. */
  error?: boolean;
}

const STORAGE_KEY = "portfolio_chat_v1";
const firstName = siteConfig.author.name.split(" ").slice(-2, -1)[0] || siteConfig.name;

const STARTERS: { icon: typeof Mail; label: string }[] = [
  { icon: FlaskConical, label: "What research is he working on?" },
  { icon: FolderKanban, label: "Which project should I look at first?" },
  { icon: Briefcase, label: "What has he built professionally?" },
  { icon: Mail, label: "How can I hire or contact him?" },
];

const ERROR_COPY: Record<string, string> = {
  rate_limited: "That's a lot of questions at once — give it a minute and try again.",
  upstream_unavailable: `The assistant is busy right now. Try again in a moment, or email ${siteConfig.contact.email}.`,
  not_configured: `The assistant isn't connected right now — reach out at ${siteConfig.contact.email} for a real reply.`,
  network: "Couldn't reach the assistant. Check your connection and try again.",
  unknown: `Something went wrong. Try again, or email ${siteConfig.contact.email}.`,
};

class ChatError extends Error {
  constructor(public code: string) {
    super(code);
  }
}

/** Only web and mail links are rendered as links; anything else is plain text. */
function safeHref(href?: string): string | null {
  if (!href) return null;
  if (href.startsWith("/") || href.startsWith("#")) return href;
  try {
    const url = new URL(href);
    return ["http:", "https:", "mailto:"].includes(url.protocol) ? href : null;
  } catch {
    return null;
  }
}

const markdown: Components = {
  p: ({ children }) => <p className="[&:not(:first-child)]:mt-2.5">{children}</p>,
  strong: ({ children }) => <strong className="font-semibold text-foreground">{children}</strong>,
  ul: ({ children }) => <ul className="mt-2 space-y-1.5 first:mt-0">{children}</ul>,
  ol: ({ children }) => <ol className="mt-2 list-decimal space-y-1.5 pl-5 first:mt-0">{children}</ol>,
  li: ({ children }) => (
    <li className="relative pl-4 before:absolute before:left-0 before:top-[0.6em] before:h-1 before:w-1 before:rounded-full before:bg-amber-500 [ol>&]:pl-0 [ol>&]:before:hidden">
      {children}
    </li>
  ),
  a: ({ href, children }) => {
    const safe = safeHref(href);
    if (!safe) return <>{children}</>;
    const cls =
      "font-medium text-foreground underline decoration-amber-500/60 decoration-[1.5px] underline-offset-[3px] transition-colors hover:text-accent";
    // Pages on this site navigate in place, so the conversation stays open.
    return safe.startsWith("/") || safe.startsWith("#") ? (
      <Link href={safe} className={cls}>
        {children}
      </Link>
    ) : (
      <a href={safe} target="_blank" rel="noopener noreferrer" className={cls}>
        {children}
      </a>
    );
  },
  // Anything heavier than the formatting the prompt asks for degrades to text.
  h1: ({ children }) => <p className="font-semibold">{children}</p>,
  h2: ({ children }) => <p className="font-semibold">{children}</p>,
  h3: ({ children }) => <p className="font-semibold">{children}</p>,
  code: ({ children }) => <span className="font-mono text-[0.92em]">{children}</span>,
  pre: ({ children }) => <>{children}</>,
  img: () => null,
  table: () => null,
};

function Avatar({ size = 28, ring = true }: { size?: number; ring?: boolean }) {
  return (
    <span
      className={cn("relative block shrink-0 overflow-hidden rounded-full bg-surface-2", ring && "ring-1 ring-line")}
      style={{ width: size, height: size }}
    >
      <Image
        src={siteConfig.author.avatar || "/images/profile.jpg"}
        alt=""
        fill
        sizes={`${size}px`}
        className="object-cover"
      />
    </span>
  );
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        void navigator.clipboard?.writeText(text).then(() => {
          setCopied(true);
          window.setTimeout(() => setCopied(false), 1500);
        });
      }}
      aria-label={copied ? "Copied" : "Copy answer"}
      className="inline-flex h-8 items-center gap-1 rounded-full px-2.5 text-[11px] font-medium text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
    >
      {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
      {copied ? "Copied" : "Copy"}
    </button>
  );
}

function Bubble({ children, role }: { children: ReactNode; role: Message["role"] }) {
  if (role === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-br-md bg-foreground px-3.5 py-2 text-[14px] leading-relaxed text-background">
          {children}
        </div>
      </div>
    );
  }
  return (
    <div className="flex gap-2.5">
      <span className="mt-0.5">
        <Avatar size={26} />
      </span>
      <div className="min-w-0 flex-1 break-words text-[14px] leading-relaxed text-foreground/90">{children}</div>
    </div>
  );
}

export default function AiChatPanel({ onClose }: { onClose: () => void }) {
  const [messages, setMessages] = useState<Message[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const saved = sessionStorage.getItem(STORAGE_KEY);
      return saved ? (JSON.parse(saved) as Message[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const stickToBottom = useRef(true);

  // Persist between page navigations and panel closes, for this visit only.
  useEffect(() => {
    if (streaming) return;
    try {
      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(messages.slice(-30)));
    } catch {
      // Storage full or blocked: the conversation just won't survive a reload.
    }
  }, [messages, streaming]);

  useEffect(() => {
    // Desktop gets the cursor straight away; on a phone that would pop the
    // keyboard over the starter questions before they have been seen.
    if (window.matchMedia("(min-width: 640px)").matches) inputRef.current?.focus();
    return () => abortRef.current?.abort();
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  // Follow the answer as it streams, unless the visitor has scrolled up to read.
  useEffect(() => {
    const list = listRef.current;
    if (list && stickToBottom.current) list.scrollTop = list.scrollHeight;
  }, [messages]);

  const send = useCallback(
    async (text: string) => {
      const question = text.trim();
      if (!question || streaming) return;

      const history = messages
        .filter((m) => !m.error)
        .map((m) => ({ role: m.role, content: splitFollowUps(m.content).text }));
      const userMsg: Message = { id: `u${Date.now()}`, role: "user", content: question };
      const answerId = `a${Date.now()}`;

      setMessages((prev) => [...prev, userMsg, { id: answerId, role: "assistant", content: "" }]);
      setInput("");
      setStreaming(true);
      stickToBottom.current = true;

      const controller = new AbortController();
      abortRef.current = controller;
      const update = (content: string, error = false) =>
        setMessages((prev) => prev.map((m) => (m.id === answerId ? { ...m, content, error } : m)));

      try {
        const res = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: question, history }),
          signal: controller.signal,
        });

        if (!res.ok || !res.body) {
          const data = await res.json().catch(() => ({}));
          throw new ChatError(res.status === 429 ? "rate_limited" : (data.code as string) || "unknown");
        }

        // Tokens are batched into one state update per frame, so a fast
        // stream doesn't re-render the panel hundreds of times a second.
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let answer = "";
        let frame = 0;
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          answer += decoder.decode(value, { stream: true });
          if (!frame) {
            frame = requestAnimationFrame(() => {
              frame = 0;
              update(answer);
            });
          }
        }
        if (frame) cancelAnimationFrame(frame);
        update(answer.trim() || ERROR_COPY.unknown, !answer.trim());
      } catch (err) {
        if (controller.signal.aborted) {
          // Stopped by the visitor: keep whatever had arrived.
          setMessages((prev) =>
            prev.filter((m) => !(m.id === answerId && !m.content.trim()))
          );
        } else {
          const code = err instanceof ChatError ? err.code : "network";
          update(ERROR_COPY[code] ?? ERROR_COPY.unknown, true);
        }
      } finally {
        abortRef.current = null;
        setStreaming(false);
      }
    },
    [messages, streaming]
  );

  const reset = () => {
    abortRef.current?.abort();
    setMessages([]);
    try {
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {}
    inputRef.current?.focus();
  };

  const last = messages[messages.length - 1];
  const lastFollowUps =
    !streaming && last?.role === "assistant" && !last.error ? splitFollowUps(last.content).followUps : [];

  // Positioning, size and the glass surface belong to the launcher, which
  // morphs into this window; the panel only fills it.
  return (
    <div role="dialog" aria-label={`Chat with ${firstName}'s AI assistant`} className="flex h-full flex-col">
      {/* Header */}
      <div className="relative shrink-0 border-b border-line px-4 py-3">
        <div className="flex items-center gap-3">
          <span className="relative">
            <Avatar size={38} />
            <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-background bg-emerald-400" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[15px] font-semibold tracking-[-0.01em] text-foreground">
              {firstName}&apos;s AI
            </p>
            <p className="truncate font-mono text-[10.5px] uppercase tracking-[0.12em] text-muted-foreground">
              <span className="text-emerald-600 dark:text-emerald-400">Online</span> · English / বাংলা
            </p>
          </div>
          {messages.length > 0 && (
            <button
              type="button"
              onClick={reset}
              aria-label="Start a new chat"
              title="New chat"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
            >
              <RotateCcw className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            aria-label="Close assistant"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-surface-2 hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Conversation */}
      <div
        ref={listRef}
        onScroll={(e) => {
          const el = e.currentTarget;
          stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 40;
        }}
        role="log"
        aria-live="polite"
        aria-busy={streaming}
        className="flex-1 space-y-5 overflow-y-auto overscroll-contain px-4 py-5"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col justify-end">
            <div className="mb-5">
              <Avatar size={44} />
              <p className="mt-3 text-lg font-semibold tracking-[-0.02em] text-foreground">
                Hi — I&apos;m {firstName}&apos;s AI assistant.
              </p>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Ask about his research, projects, experience, or how to work with him. English or বাংলা.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-2 min-[400px]:grid-cols-2">
              {STARTERS.map(({ icon: Icon, label }) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => send(label)}
                  className="flex items-start gap-2.5 rounded-2xl border border-line bg-surface p-3 text-left text-[13px] leading-snug text-foreground transition-colors hover:border-line-strong hover:bg-surface-2"
                >
                  <Icon className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {label}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((m) => {
            if (m.role === "user") return <Bubble key={m.id} role="user">{m.content}</Bubble>;
            const isLive = streaming && m.id === last?.id;
            const { text } = splitFollowUps(m.content);
            return (
              <div key={m.id}>
                <Bubble role="assistant">
                  {m.error ? (
                    <p className="text-muted-foreground">{text}</p>
                  ) : text ? (
                    <>
                      <Markdown components={markdown}>{text}</Markdown>
                      {isLive && (
                        <span aria-hidden="true" className="ml-0.5 inline-block h-[1em] w-[0.45ch] translate-y-[0.15em] animate-pulse bg-foreground/70" />
                      )}
                    </>
                  ) : (
                    <span className="inline-flex items-center gap-1 py-1.5" aria-label="Thinking">
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.3s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500 [animation-delay:-0.15s]" />
                      <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber-500" />
                    </span>
                  )}
                </Bubble>
                {!isLive && !m.error && text && (
                  <div className="ml-[2.1rem] mt-1">
                    <CopyButton text={text} />
                  </div>
                )}
              </div>
            );
          })
        )}

        {lastFollowUps.length > 0 && (
          <div className="ml-[2.1rem] flex flex-wrap gap-1.5">
            {lastFollowUps.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => send(q)}
                className="rounded-full border border-line bg-surface px-3 py-1.5 text-left text-[12.5px] leading-snug text-foreground transition-colors hover:border-amber-500/50 hover:bg-surface-2"
              >
                {q}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Composer */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void send(input);
        }}
        className="shrink-0 border-t border-line px-3 pb-3 pt-3"
      >
        <div className="flex items-end gap-2 rounded-[1.4rem] border border-line bg-surface/80 px-3 py-1.5 transition-colors focus-within:border-amber-500/50">
          <label htmlFor="ai-chat-input" className="sr-only">
            Message
          </label>
          <textarea
            id="ai-chat-input"
            ref={inputRef}
            rows={1}
            value={input}
            maxLength={2000}
            onChange={(e) => {
              setInput(e.target.value);
              const el = e.target;
              el.style.height = "auto";
              el.style.height = `${Math.min(el.scrollHeight, 120)}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                e.preventDefault();
                void send(input);
              }
            }}
            placeholder={`Ask anything about ${firstName}…`}
            className="max-h-[120px] flex-1 resize-none bg-transparent py-2 text-[15px] leading-snug text-foreground outline-none placeholder:text-muted-foreground focus-visible:ring-0 focus-visible:ring-offset-0 sm:text-sm"
          />
          {streaming ? (
            <button
              type="button"
              onClick={() => abortRef.current?.abort()}
              aria-label="Stop answering"
              className="mb-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background"
            >
              <Square className="h-3 w-3 fill-current" />
            </button>
          ) : (
            <button
              type="submit"
              disabled={!input.trim()}
              aria-label="Send message"
              className="mb-0.5 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground text-background transition-opacity disabled:opacity-30"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-[10.5px] text-muted-foreground">
          AI answers can be imperfect — the{" "}
          <a href={siteConfig.links.resume} className="underline underline-offset-2 hover:text-foreground">
            resume
          </a>{" "}
          is the source of truth.
        </p>
      </form>
    </div>
  );
}
