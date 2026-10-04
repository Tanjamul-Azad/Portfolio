"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Where you are in the page, as a hairline across the top edge.
 *
 * Measured from a scroll listener rather than framer-motion's `useScroll`,
 * which reported a progress of 0 for the whole page here.
 */
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

  const rounded = Math.round(scrollProgress);

  return (
    // One hairline along the very top edge, at every size. It sits above the
    // navbar rather than under it, because the navbar changes shape as it
    // scrolls and anything anchored to its underside would drift. The old
    // desktop rail with a percentage readout was one more floating object
    // competing for the margins.
    <div
      className="fixed inset-x-0 top-0 z-60 h-0.5"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={rounded}
    >
      <div
        className="h-full origin-left bg-linear-to-r from-amber-500/60 via-amber-400 to-amber-300 transition-[width] duration-100 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />
    </div>
  );
}
