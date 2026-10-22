"use client";

import { useEffect, useId, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";

/** The approved intro artwork, now a permanent responsive Hero composition. */
export function SignaturePortrait() {
  const container = useRef<HTMLDivElement>(null);
  const portraitImage = useRef<HTMLImageElement>(null);
  const signatureImage = useRef<HTMLImageElement>(null);
  const played = useRef(false);
  const signatureMask = useId().replace(/:/g, "");
  const reducedMotion = useReducedMotion();
  const [portraitReady, setPortraitReady] = useState(false);
  const [signatureReady, setSignatureReady] = useState(false);
  const [playback, setPlayback] = useState<"waiting" | "writing" | "static">("waiting");
  const writing = playback === "writing";
  const staticSignature = playback === "static" || reducedMotion === true;

  useEffect(() => {
    // A cached resource can finish before React attaches its load handler.
    // decode() covers both the first request and that hydration race.
    let active = true;
    void portraitImage.current?.decode().then(() => {
      if (active) setPortraitReady(true);
    }).catch(() => {});
    void signatureImage.current?.decode().then(() => {
      if (active) setSignatureReady(true);
    }).catch(() => {});
    return () => { active = false; };
  }, []);

  useEffect(() => {
    if (!portraitReady || !signatureReady || played.current) return;
    const connection = (navigator as Navigator & {
      connection?: { saveData?: boolean; effectiveType?: string };
    }).connection;
    const staticOnly = reducedMotion || connection?.saveData || /2g/.test(connection?.effectiveType ?? "");
    let frame = 0;
    let inView = false;
    const start = () => {
      if (played.current || !inView || document.hidden || document.getElementById("portfolio-opening-intro")) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        played.current = true;
        introObserver.disconnect();
        observer.disconnect();
        setPlayback(staticOnly ? "static" : "writing");
      });
    };
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      start();
    }, { threshold: 0.35 });
    // Observe the actual removal, including first-visit / skipped intros.
    const introObserver = new MutationObserver(start);
    introObserver.observe(document.body, { childList: true, subtree: true });
    if (container.current) observer.observe(container.current);
    window.addEventListener("portfolio:intro-complete", start);
    document.addEventListener("visibilitychange", start);
    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      introObserver.disconnect();
      window.removeEventListener("portfolio:intro-complete", start);
      document.removeEventListener("visibilitychange", start);
    };
  }, [portraitReady, signatureReady, reducedMotion]);

  return (
    <div ref={container} className="hero-art relative mx-auto aspect-[4/5] -translate-y-2 hero-wide:translate-y-0" data-signature-state={playback} data-art-ready={portraitReady && signatureReady}>
      <noscript><style>{".hero-signature-nojs { opacity: 1 !important; }"}</style></noscript>
      <picture className="absolute inset-0">
        <source srcSet="/images/intro/tanzamul-refined-v4-480.webp 480w, /images/intro/tanzamul-refined-v4-800.webp 800w, /images/intro/tanzamul-refined-v4-1122.webp 1122w" sizes="(min-width: 1024px) min(42vw, 62.4svh, 576px), (min-width: 600px) and (max-height: 560px) 50svh, (max-height: 740px) min(76vw, 28svh), min(82vw, 32svh, 352px)" />
        <Image ref={portraitImage} src="/images/intro/tanzamul-refined-v4-800.webp" alt="Tanzamul Azad in a dark suit, looking upward against a golden backdrop"
          fill unoptimized loading="eager" fetchPriority="high" className="intro-portrait-blend object-contain"
          onLoad={() => setPortraitReady(true)} />
      </picture>
      {/* HTML image loading is also observed when the SVG resource was cached
          before hydration. The same URL is reused by the signature mask. */}
      <Image ref={signatureImage} src="/images/intro/tanzamul-signature-v2.webp" alt="" aria-hidden="true"
        width={2000} height={800} unoptimized loading="eager"
        className="pointer-events-none absolute h-px w-px opacity-0"
        onLoad={() => setSignatureReady(true)} />
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[30%] bg-linear-to-t from-[#09090b]/70 to-transparent" />
      <span aria-hidden="true" className="absolute left-[44%] top-[74%] flex items-center gap-2 text-[clamp(7px,1.1svh,11px)] font-medium tracking-[0.34em] text-white/80">
        WELCOME <span className="h-px w-5 bg-white/50" />
      </span>
        <svg viewBox="0 0 2000 800" className="absolute top-[69%] left-[6%] w-[91%] overflow-visible" data-hero-signature="true" aria-hidden="true">
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
              <rect className="hero-signature-nojs" width="2000" height="800" fill="white" opacity={staticSignature ? 1 : 0} />
              <motion.rect width="2000" height="800" fill="white" initial={{ opacity: 0 }} animate={{ opacity: writing ? 1 : 0 }} transition={{ duration: 0.08, delay: 1.84 }} />
            </mask>
          </defs>
          <image href="/images/intro/tanzamul-signature-v2.webp" width="2000" height="800" mask={`url(#${signatureMask})`} onLoad={() => setSignatureReady(true)} />
        </svg>
    </div>
  );
}
