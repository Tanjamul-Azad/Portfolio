"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { siteConfig } from "@/config";

const ease = [0.22, 1, 0.36, 1] as const;
export const INTRO_VISIT_KEY = "portfolio_opening_intro_signature_v4";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [playPortrait, setPlayPortrait] = useState(false);
  const [portraitReady, setPortraitReady] = useState(false);
  const [signatureReady, setSignatureReady] = useState(false);
  const mediaReady = useRef({ portrait: false, signature: false });
  const signatureMask = useId().replace(/:/g, "");
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

    // Media gets a bounded load window; a failed/slow request skips the intro.
    // Repeat visits do not request the art.
    setPlayPortrait(true);
    const requestedAt = performance.now();
    let sequenceStartedAt: number | null = null;
    let frame: number;
    const tick = (now: number) => {
      // Give uncached art a bounded load window, then run the whole signature
      // sequence. Starting its exit clock before the SVG image loads cuts off
      // the last pen strokes on a visitor's first uncached request.
      if (sequenceStartedAt === null) {
        if (mediaReady.current.portrait && mediaReady.current.signature) sequenceStartedAt = now;
        else if (now - requestedAt >= 1500) { onCompleteRef.current(); return; }
        else { frame = requestAnimationFrame(tick); return; }
      }
      const elapsed = now - sequenceStartedAt;
      const progress = Math.min(elapsed / 2380, 1);
      setCount(Math.round((1 - Math.pow(1 - progress, 3)) * 100));
      if (elapsed >= 2700) setPhase("exit");
      else if (elapsed >= 2380) setPhase("hold");
      else if (elapsed >= 450) setPhase("reveal");
      if (elapsed >= 3350) onCompleteRef.current();
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

  const writing = phase !== "counting" && portraitReady && signatureReady;
  return (
    <motion.div
      role="status"
      aria-label="Loading portfolio"
      aria-live="off"
      data-phase={phase}
      onClick={() => onCompleteRef.current()}
      className="fixed inset-0 z-100 cursor-pointer overflow-hidden bg-[#09090b] text-white"
      animate={{ clipPath: phase === "exit" ? "inset(0 0 100% 0)" : "inset(0 0 0% 0)" }}
      transition={{ duration: 0.68, ease: [0.76, 0, 0.24, 1] }}
    >
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_45%,#17181d_0%,transparent_65%)]" />
      {playPortrait && <motion.div
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 aspect-[4/5] h-[min(94svh,125vw)] -translate-x-1/2 -translate-y-1/2"
        initial={{ opacity: 0, y: 14, scale: 1.015 }}
        animate={{ opacity: portraitReady ? 1 : 0, y: portraitReady ? 0 : 14, scale: 1 }}
        transition={{ duration: 0.8, ease }}
      >
        {/* Direct responsive WebP delivery avoids on-demand server encoding. */}
        <picture>
          <source srcSet="/images/intro/tanzamul-editorial-v2-480.webp 480w, /images/intro/tanzamul-editorial-v2-800.webp 800w, /images/intro/tanzamul-editorial-v2-1200.webp 1122w" sizes="(max-aspect-ratio: 4/5) 100vw, 76vh" />
          <Image
            src="/images/intro/tanzamul-editorial-v2-800.webp"
            alt=""
            fill
            unoptimized
            loading="eager"
            fetchPriority="high"
            className="object-contain [mask-image:linear-gradient(to_bottom,black_95%,transparent_100%)]"
            onLoad={() => { mediaReady.current.portrait = true; setPortraitReady(true); }}
          />
        </picture>
        <div className="absolute inset-x-0 bottom-0 h-[32%] bg-linear-to-t from-[#09090b]/65 to-transparent" />
        <motion.span
          className="absolute top-[74%] left-[44%] flex items-center gap-3 text-[clamp(8px,1.2svh,12px)] font-medium tracking-[0.38em] text-white/90"
          initial={{ opacity: 0 }} animate={{ opacity: writing ? 1 : 0 }}
          transition={{ duration: 0.35 }}
        >
          WELCOME <span className="h-px w-6 bg-white/60" />
        </motion.span>
        {/* The image retains the reference's brush texture. Animated SVG masks
            follow the pen strokes instead of revealing a block-letter label. */}
        <svg viewBox="0 0 2000 800" className="absolute top-[69%] left-[6%] w-[91%] overflow-visible" aria-hidden="true">
          <defs>
            <mask id={signatureMask} maskUnits="userSpaceOnUse" x="0" y="0" width="2000" height="800" style={{ maskType: "luminance" }}>
              <motion.path d="M65 405 Q355 260 705 210" fill="none" stroke="white" strokeWidth="100" strokeLinecap="butt"
                initial={{ pathLength: 0 }} animate={{ pathLength: writing ? 1 : 0 }} transition={{ duration: 0.28, ease: "easeOut" }} />
              <motion.path d="M510 235 Q355 430 180 715" fill="none" stroke="white" strokeWidth="100" strokeLinecap="butt"
                initial={{ pathLength: 0 }} animate={{ pathLength: writing ? 1 : 0 }} transition={{ duration: 0.28, delay: 0.2, ease: "easeOut" }} />
              <motion.path d="M415 605 Q425 540 520 495 Q565 475 530 560 Q510 625 590 550 L690 475 L650 575 L755 475 Q775 465 760 530 Q750 580 820 510 L925 425 Q1015 385 885 505 Q1020 465 925 555 L705 720" fill="none" stroke="white" strokeWidth="125" strokeLinecap="butt" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: writing ? 1 : 0 }} transition={{ duration: 0.58, delay: 0.38, ease: "linear" }} />
              <motion.path d="M1000 515 Q1020 455 1115 415 Q1160 395 1100 480 Q1060 540 1155 460 L1235 395 L1190 500 L1320 390 Q1375 350 1325 460 L1410 385 Q1440 365 1420 445 Q1410 490 1475 445 L1525 380 L1485 455 Q1475 500 1550 440 L1590 375 Q1620 335 1580 425 Q1560 490 1645 400" fill="none" stroke="white" strokeWidth="140" strokeLinecap="butt" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: writing ? 1 : 0 }} transition={{ duration: 0.52, delay: 0.85, ease: "linear" }} />
              <motion.path d="M1640 420 Q1740 220 1840 140 Q1860 120 1805 200 Q1670 345 1640 470 Q1615 545 1720 485 Q1870 390 1955 375" fill="none" stroke="white" strokeWidth="100" strokeLinecap="butt" strokeLinejoin="round"
                initial={{ pathLength: 0 }} animate={{ pathLength: writing ? 1 : 0 }} transition={{ duration: 0.32, delay: 1.25, ease: "easeOut" }} />
              <motion.path d="M495 725 Q1130 555 1875 550" fill="none" stroke="white" strokeWidth="68" strokeLinecap="butt"
                initial={{ pathLength: 0 }} animate={{ pathLength: writing ? 1 : 0 }} transition={{ duration: 0.32, delay: 1.52, ease: "easeOut" }} />
              <motion.rect width="2000" height="800" fill="white" initial={{ opacity: 0 }} animate={{ opacity: writing ? 1 : 0 }} transition={{ duration: 0.08, delay: 1.84 }} />
            </mask>
          </defs>
          <image href="/images/intro/tanzamul-signature-v2.webp" width="2000" height="800" mask={`url(#${signatureMask})`} onLoad={() => { mediaReady.current.signature = true; setSignatureReady(true); }} />
        </svg>
      </motion.div>}

      {!portraitReady && (
        <motion.div
          aria-hidden="true"
          initial={{ opacity: 0 }} animate={{ opacity: phase === "counting" ? 0 : 1 }}
          className="absolute inset-0 flex items-center justify-center font-heading text-[clamp(2.8rem,12vw,8.5rem)] font-bold tracking-[-0.045em]"
        >
          {siteConfig.name.toUpperCase()}
        </motion.div>
      )}

      <span aria-hidden="true" className="absolute top-7 right-7 font-mono text-[10px] tracking-widest text-white/50 tabular-nums sm:top-10 sm:right-10">
        {String(count).padStart(3, "0")}
      </span>
      <div aria-hidden="true" className="absolute inset-x-7 bottom-5 mx-auto max-w-[700px] bg-white/10 sm:bottom-4">
        <div className="h-px bg-[#ffbf00]" style={{ width: `${count}%` }} />
      </div>
      <button
        type="button"
        onClick={(event) => { event.stopPropagation(); onCompleteRef.current(); }}
        className="absolute bottom-6 right-4 px-4 py-3 text-[9px] uppercase tracking-[0.24em] text-white/50 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffbf00]"
      >
        Skip intro
      </button>
    </motion.div>
  );
}
