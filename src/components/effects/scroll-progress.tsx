"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const pathname = usePathname();
  const onAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (onAdmin) return;

    let frame = 0;

    const measure = () => {
      const { scrollHeight, clientHeight } = document.documentElement;
      const scrollableHeight = scrollHeight - clientHeight;

      // A page shorter than the viewport has nothing to scroll: guard the divide
      // so it reports 0 instead of NaN (which rendered as "NaN%" and height:NaN%).
      if (scrollableHeight <= 0) {
        setScrollProgress(0);
        return;
      }

      // Clamp so rubber-band overscroll can't report <0% or >100%.
      const progress = (window.scrollY / scrollableHeight) * 100;
      setScrollProgress(Math.min(100, Math.max(0, progress)));
    };

    // Coalesce scroll events to one measurement per frame.
    const handleScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        measure();
      });
    };

    measure();
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [onAdmin]);

  if (onAdmin) return null;

  return (
    <div
      className="fixed top-1/2 right-4 -translate-y-1/2 z-50 hidden lg:block"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={Math.round(scrollProgress)}
    >
      {/* Track */}
      <div className="w-1 h-24 rounded-full bg-neutral-200/80 dark:bg-neutral-800/50 overflow-hidden backdrop-blur-sm">
        {/* Progress */}
        <motion.div
          className="w-full bg-neutral-700 dark:bg-neutral-300 rounded-full origin-top"
          style={{ height: `${scrollProgress}%` }}
          initial={{ height: 0 }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* Percentage indicator */}
      <motion.div
        aria-hidden="true"
        className="absolute -left-10 top-1/2 -translate-y-1/2 text-[10px] text-neutral-600 dark:text-neutral-400 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress > 5 ? 1 : 0 }}
      >
        {Math.round(scrollProgress)}%
      </motion.div>
    </div>
  );
}
