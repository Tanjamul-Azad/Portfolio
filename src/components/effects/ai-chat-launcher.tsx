"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { siteConfig } from "@/config";

const loadPanel = () => import("./ai-chat-panel");

// The conversation UI (markdown rendering, streaming, the lot) is only fetched
// when someone is about to use it. Before, the whole assistant was mounted a
// couple of seconds after load — a ~280ms render that landed in the middle of
// a phone's first scroll.
const Panel = dynamic(loadPanel, {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-full w-full animate-pulse bg-surface/40" />,
});

/** Lines the closed pill rotates through. One swap every few seconds, not a typewriter. */
const PROMPTS = ["Ask my AI anything", "Ask about my research", "Ask about my projects", "Ask in বাংলা too"];

const PILL = { width: 236, height: 52 };
const DOT = { width: 52, height: 52 };

/**
 * The open window's size, kept as numbers so the morph can spring between
 * them. Null until measured on the client: the launcher waits for it, so a
 * phone never sees the desktop pill flash and shrink on load.
 */
function useOpenSize() {
  const [size, setSize] = useState<{ width: number; height: number; phone: boolean } | null>(null);
  useEffect(() => {
    const measure = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const phone = vw < 640;
      setSize({
        width: phone ? vw - 24 : Math.min(400, vw - 32),
        height: phone ? vh - 88 : Math.min(620, vh - 112),
        phone,
      });
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);
  return size;
}

/**
 * The AI assistant. One glass surface in the bottom-right corner: closed, it
 * is a pill (just the avatar on phones) cycling through a few prompts; opened,
 * the same surface springs out from its corner into the chat window, so the
 * conversation visibly grows out of the button that summoned it.
 *
 * The pill is light enough to render on page load; the panel's code is
 * prefetched once the page is idle, or the moment a pointer or finger
 * approaches.
 */
export function AiChatLauncher() {
  const [open, setOpen] = useState(false);
  // The chat UI mounts only once the window has finished growing: its first
  // render (markdown, history) would otherwise land on the morph's opening
  // frames and stall them.
  const [grown, setGrown] = useState(false);
  const [prompt, setPrompt] = useState(0);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const onAdmin = pathname?.startsWith("/admin") ?? false;
  const reduceMotion = useReducedMotion() ?? false;
  const openSize = useOpenSize();

  useEffect(() => {
    if (onAdmin) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const id = window.setTimeout(() => {
      if (w.requestIdleCallback) w.requestIdleCallback(() => void loadPanel(), { timeout: 4000 });
      else void loadPanel();
    }, 6000);
    return () => window.clearTimeout(id);
  }, [onAdmin]);

  // Rotate the pill's prompt. Paused while open, on phones (no text shown)
  // and under reduced motion.
  const phone = openSize?.phone ?? true;
  useEffect(() => {
    if (open || phone || reduceMotion) return;
    const id = window.setInterval(() => setPrompt((p) => (p + 1) % PROMPTS.length), 3600);
    return () => window.clearInterval(id);
  }, [open, phone, reduceMotion]);

  // Backstop for `grown`, in case the morph's completion never reports (an
  // instant, reduced-motion transition, or a size that didn't change).
  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => setGrown(true), reduceMotion ? 0 : 360);
    return () => window.clearTimeout(id);
  }, [open, reduceMotion]);

  const close = useCallback(() => {
    setOpen(false);
    setGrown(false);
    // Wait for the surface to shrink back before handing focus to the button.
    window.setTimeout(() => buttonRef.current?.focus(), 300);
  }, []);

  if (onAdmin || !openSize) return null;

  const closedSize = openSize.phone ? DOT : PILL;
  const target = open ? openSize : closedSize;
  // A short ease-out rather than a spring: it settles in under a third of a
  // second, where the spring's long tail made opening feel sluggish.
  const morph = reduceMotion
    ? { duration: 0 }
    : { type: "tween" as const, ease: [0.32, 0.72, 0, 1] as const, duration: 0.28 };

  return (
    <>
      {/* Phone: dims the page under the open window. Tapping it closes. */}
      <AnimatePresence>
        {open && openSize.phone && (
          <motion.div
            aria-hidden="true"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-60 bg-black/50"
          />
        )}
      </AnimatePresence>

      <motion.div
        initial={false}
        animate={{ width: target.width, height: target.height, borderRadius: open ? 24 : 26 }}
        transition={morph}
        onAnimationComplete={() => {
          if (open) setGrown(true);
        }}
        className="fixed bottom-[max(0.75rem,env(safe-area-inset-bottom))] right-[max(0.75rem,env(safe-area-inset-right))] z-60 overflow-hidden border border-line bg-background/92 shadow-[0_24px_60px_-20px_rgb(0_0_0/0.5),inset_0_1px_0_0_rgb(255_255_255/0.06)] backdrop-blur-lg [will-change:width,height] animate-in fade-in slide-in-from-bottom-2 fill-mode-both duration-500 [animation-delay:800ms] sm:bottom-[max(1rem,env(safe-area-inset-bottom))] sm:right-[max(1rem,env(safe-area-inset-right))]"
      >
        {/* Warm sheen across the top edge, in the site's accent. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[radial-gradient(120%_70%_at_15%_0%,rgb(245_158_11/0.14),transparent_60%)]" />

        {/* Closed: the pill. */}
        <motion.button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(true)}
          onPointerEnter={() => void loadPanel()}
          onTouchStart={() => void loadPanel()}
          onFocus={() => void loadPanel()}
          aria-expanded={open}
          aria-haspopup="dialog"
          aria-label="Ask AI about my work"
          tabIndex={open ? -1 : 0}
          initial={false}
          animate={{ opacity: open ? 0 : 1 }}
          transition={{ duration: open ? 0.08 : 0.2, delay: open ? 0 : 0.12 }}
          className="group absolute bottom-0 right-0 flex items-center gap-3 p-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-amber-500"
          style={{ width: closedSize.width, height: closedSize.height, pointerEvents: open ? "none" : "auto" }}
        >
          <span className="relative h-11 w-11 shrink-0">
            <span className="block h-full w-full overflow-hidden rounded-full ring-1 ring-line">
              <Image
                src={siteConfig.author.avatar || "/images/profile.jpg"}
                alt=""
                fill
                sizes="44px"
                className="rounded-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
            </span>
            <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-black ring-2 ring-background">
              <Sparkles className="h-3 w-3" />
            </span>
          </span>
          {!openSize.phone && (
            <span className="flex min-w-0 flex-1 flex-col leading-tight">
              <span className="font-mono text-[9.5px] font-semibold uppercase tracking-[0.18em] text-accent">
                AI assistant
              </span>
              <span className="relative block h-[1.25rem] overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={prompt}
                    initial={{ y: "100%", opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    exit={{ y: "-100%", opacity: 0 }}
                    transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                    className="absolute inset-x-0 truncate text-[13.5px] font-semibold text-foreground"
                  >
                    {PROMPTS[prompt]}
                  </motion.span>
                </AnimatePresence>
              </span>
            </span>
          )}
        </motion.button>

        {/* Open: the chat window, laid out at its final size and anchored to
            the same corner, so the growing surface reveals it rather than
            squeezing it. */}
        <AnimatePresence>
          {open && grown && (
            <motion.div
              key="panel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: reduceMotion ? 0 : 0.16 } }}
              exit={{ opacity: 0, transition: { duration: 0.1 } }}
              className="absolute bottom-0 right-0"
              style={{ width: openSize.width, height: openSize.height }}
            >
              <Panel onClose={close} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}
