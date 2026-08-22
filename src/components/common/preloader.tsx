"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"counting" | "reveal" | "exit">("counting");
  const measureNameRef = useRef<HTMLDivElement>(null);
  const [nameWidth, setNameWidth] = useState<number | null>(null);

  useEffect(() => {
    if (!measureNameRef.current) return;

    const updateWidth = () => {
      if (!measureNameRef.current) return;
      const rect = measureNameRef.current.getBoundingClientRect();
      setNameWidth(Math.ceil(rect.width));
    };

    updateWidth();

    const observer = new ResizeObserver(() => updateWidth());
    observer.observe(measureNameRef.current);

    window.addEventListener("resize", updateWidth);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", updateWidth);
    };
  }, []);

  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  }, [onComplete]);

  useEffect(() => {
    const timeouts: NodeJS.Timeout[] = [];

    // Anyone who asks for reduced motion (or who is on a slow connection, where
    // an intro animation is the last thing they need) skips straight through.
    const connection = (
      navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } }
    ).connection;
    const skip =
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connection?.saveData === true ||
      (connection?.effectiveType ? /2g/.test(connection.effectiveType) : false) ||
      // Opened into a background tab: timers there are throttled to ~1s, which
      // would stretch the intro to nearly a minute. Nobody is watching it anyway.
      document.hidden;

    if (skip) {
      setCount(100);
      setIsVisible(false);
      timeouts.push(setTimeout(() => onCompleteRef.current(), 0));
      return () => timeouts.forEach(clearTimeout);
    }

    let frame = 0;
    const total = 40;

    // ~1.9s end to end (40 * 24ms count + 380 + 420 + 320) rather than the ~4.1s
    // the original timings added up to. A portfolio's first impression should not
    // cost four seconds of staring at a progress line.
    const timer = setInterval(() => {
      frame++;
      const progress = frame / total;
      const eased = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
      setCount(Math.round(eased * 100));

      if (frame >= total) {
        clearInterval(timer);
        setCount(100);
        setPhase("reveal");

        timeouts.push(setTimeout(() => {
          setPhase("exit");
          timeouts.push(setTimeout(() => {
            setIsVisible(false);
            timeouts.push(setTimeout(() => onCompleteRef.current(), 320));
          }, 420));
        }, 380));
      }
    }, 24);

    return () => {
      clearInterval(timer);
      timeouts.forEach(clearTimeout);
    };
  }, []);

  // Let people bail out immediately — Escape, Enter, click, or tap — and never
  // leave the overlay up for a tab the visitor has navigated away from.
  useEffect(() => {
    const dismiss = () => {
      setIsVisible(false);
      onCompleteRef.current();
    };
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") dismiss();
    };
    const onVisibility = () => {
      if (document.hidden) dismiss();
    };
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const name = siteConfig.name.toUpperCase();
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          role="status"
          aria-label="Loading portfolio"
          title="Click to skip"
          onClick={() => {
            setIsVisible(false);
            onCompleteRef.current();
          }}
          // `[cursor:pointer]`, not `cursor-pointer`: CustomCursor treats the
          // literal `.cursor-pointer` class as an interactive-element marker, so
          // putting it on a full-screen overlay pinned the cursor to its enlarged
          // hover ring across the whole viewport. Same CSS, no class-name match.
          className="fixed inset-0 z-100 flex [cursor:pointer] flex-col items-center justify-center overflow-hidden bg-black dark:bg-neutral-950"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute inset-0 bg-linear-to-b from-white/3 via-transparent to-black/10" />

          {/* Measurement only — a <div>, not an <h1>: the page's single real
              heading belongs to the hero. */}
          <div
            ref={measureNameRef}
            aria-hidden="true"
            className="invisible absolute select-none text-[clamp(3rem,12vw,10rem)] font-bold font-heading tracking-[-0.02em] leading-none"
          >
            {name}
          </div>

          <div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 translate-y-16 md:translate-y-20"
            style={{ width: nameWidth ? `${nameWidth}px` : "min(86vw, 1100px)" }}
          >
            <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent" />
            <div
              className="absolute top-0 left-0 h-px bg-white transition-all duration-30 linear"
              style={{ width: `${count}%` }}
            />
          </div>

          <motion.div
            className="absolute top-8 right-8 font-mono text-xs text-neutral-500 tabular-nums tracking-widest"
            animate={{ opacity: phase === "reveal" ? 0 : 1 }}
            transition={{ duration: 0.25 }}
          >
            {String(count).padStart(3, "0")}
          </motion.div>

          <AnimatePresence>
            {phase === "counting" && (
              <motion.div
                key="sweep"
                className="absolute w-full h-px bg-linear-to-r from-transparent via-neutral-700/50 to-transparent"
                initial={{ y: "100vh" }}
                animate={{ y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase !== "counting" && (
              <motion.div
                key="name"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                exit={{ clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                className="relative z-10 select-none"
              >
                <div
                  aria-hidden="true"
                  className="text-[clamp(3rem,12vw,10rem)] font-bold font-heading text-white tracking-[-0.02em] leading-none"
                >
                  {name}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <motion.span
            className="absolute bottom-8 left-1/2 -translate-x-1/2 text-[10px] font-medium uppercase tracking-[0.22em] text-neutral-600"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "counting" ? 1 : 0 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            Click to skip
          </motion.span>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
