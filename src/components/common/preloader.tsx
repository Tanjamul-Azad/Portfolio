"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/config";

const ease = [0.22, 1, 0.36, 1] as const;
export const INTRO_VISIT_KEY = "portfolio_opening_intro_portrait_v2";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [playPortrait, setPlayPortrait] = useState(false);
  const [portraitReady, setPortraitReady] = useState(false);
  const [phase, setPhase] = useState<"counting" | "reveal" | "hold" | "exit">("counting");
  const onCompleteRef = useRef(onComplete);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  useEffect(() => {
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    let alreadyShown = false;
    try { alreadyShown = sessionStorage.getItem(INTRO_VISIT_KEY) === "true"; } catch { /* Optional storage. */ }
    const skip = alreadyShown || document.hidden ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      connection?.saveData === true || /2g/.test(connection?.effectiveType ?? "");

    if (skip) {
      const dismiss = setTimeout(() => onCompleteRef.current(), 0);
      return () => clearTimeout(dismiss);
    }

    // The portrait never delays completion. Slow/failed media leaves the
    // original name reveal intact; repeat visits do not request the image.
    setPlayPortrait(true);
    const start = performance.now();
    let frame: number;
    const tick = (now: number) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / 960, 1);
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * 100));
      if (elapsed >= 1910) setPhase("exit");
      else if (elapsed >= 1760) setPhase("hold");
      else if (elapsed >= 960) setPhase("reveal");
      if (elapsed >= 2590) onCompleteRef.current();
      else frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, []);

  useEffect(() => {
    const dismiss = () => onCompleteRef.current();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape" || event.key === "Enter") dismiss();
    };
    const onVisibility = () => { if (document.hidden) dismiss(); };
    window.addEventListener("keydown", onKey);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  return (
    <motion.div
      role="status"
      aria-label="Loading portfolio"
      aria-live="off"
      data-phase={phase}
      onClick={() => onCompleteRef.current()}
      className="fixed inset-0 z-100 cursor-pointer overflow-hidden bg-[#08090b] text-white"
      animate={{ clipPath: phase === "exit" ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)" }}
      transition={{ duration: 0.68, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_42%,#1b1c21_0%,transparent_65%)]" />

      <motion.div
        aria-hidden="true"
        className="absolute inset-x-0 top-[13%] mx-auto h-[56%] w-[min(56vw,370px)] origin-bottom bg-[#ffbf00]"
        initial={{ scaleY: 0, opacity: 0 }}
        animate={{ scaleY: playPortrait ? 1 : 0, opacity: portraitReady ? 1 : 0 }}
        transition={{ duration: 0.85, ease }}
      />

      {playPortrait && <motion.div
        aria-hidden="true"
        className="absolute left-1/2 bottom-[7%] h-[80%] w-[min(165vw,760px)] -translate-x-1/2 [mask-image:linear-gradient(to_bottom,black_72%,transparent_100%)]"
        initial={{ opacity: 0, y: 28, scale: 1.025 }}
        animate={{ opacity: portraitReady ? 1 : 0, y: portraitReady ? 0 : 28, scale: 1 }}
        transition={{ duration: 1.1, ease }}
      >
        {/* Direct responsive WebP delivery avoids on-demand server encoding. */}
        <picture>
          <source srcSet="/images/intro/tanzamul-portrait-v1-480.webp 480w, /images/intro/tanzamul-portrait-v1-800.webp 800w, /images/intro/tanzamul-portrait-v1-1200.webp 1200w" sizes="(max-width: 460px) 165vw, 760px" />
          <Image
            src="/images/intro/tanzamul-portrait-v1-800.webp"
            alt=""
            fill
            unoptimized
            loading="eager"
            fetchPriority="high"
            className="object-contain object-bottom"
            onLoad={() => setPortraitReady(true)}
          />
        </picture>
      </motion.div>}

      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[42%] bg-linear-to-t from-[#08090b] via-[#08090b]/75 to-transparent" />

      <motion.div
        className="absolute inset-x-0 bottom-[19%] flex flex-col items-center gap-5 px-4 sm:gap-6"
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: phase === "counting" ? 0 : 1, y: phase === "counting" ? 18 : 0 }}
        transition={{ duration: 0.65, ease }}
      >
        <span aria-hidden="true" className="flex items-center gap-4 text-[9px] font-medium tracking-[0.5em] text-white/75 sm:text-[11px]">
          <span className="h-px w-8 bg-[#ffbf00]/70" /> WELCOME <span className="h-px w-8 bg-[#ffbf00]/70" />
        </span>
        <motion.div
          aria-hidden="true"
          initial={{ clipPath: "inset(0 100% 0 0)" }}
          animate={{ clipPath: phase === "counting" ? "inset(0 100% 0 0)" : "inset(0 0% 0 0)" }}
          transition={{ duration: 0.8, ease }}
          className="select-none font-heading text-[clamp(2.8rem,12vw,8.5rem)] leading-none font-bold tracking-[-0.045em]"
        >
          {siteConfig.name.toUpperCase()}
        </motion.div>
      </motion.div>

      <span aria-hidden="true" className="absolute top-7 right-7 font-mono text-[10px] tracking-widest text-white/50 tabular-nums sm:top-10 sm:right-10">
        {String(count).padStart(3, "0")}
      </span>
      <div aria-hidden="true" className="absolute inset-x-7 bottom-[12%] mx-auto max-w-[700px] bg-white/10">
        <div className="h-px bg-[#ffbf00]" style={{ width: `${count}%` }} />
      </div>
      <button
        type="button"
        onClick={(event) => { event.stopPropagation(); onCompleteRef.current(); }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 px-4 py-3 text-[9px] uppercase tracking-[0.24em] text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffbf00]"
      >
        Skip intro
      </button>
    </motion.div>
  );
}
