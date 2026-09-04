"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

/**
 * Where you are in the page.
 *
 * Two presentations, because the same control does not suit both sizes: a
 * hairline across the top edge on phones, and the vertical track with a
 * percentage on desktop where there is margin to spare. The mobile bar matters
 * more than the desktop one — this page runs to roughly twenty screens on a
 * handset, and there was previously no position cue there at all.
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
    <>
      {/* Phones and tablets: a hairline along the very top edge. It sits above
          the navbar rather than under it, because the navbar changes height as
          it scrolls and anything anchored to its underside would drift. */}
      <div
        className="fixed inset-x-0 top-0 z-60 h-0.5 bg-neutral-200/70 lg:hidden dark:bg-neutral-800/60"
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
      >
        <div
          className="h-full origin-left bg-neutral-900 transition-[width] duration-100 ease-out dark:bg-white"
          style={{ width: `${scrollProgress}%` }}
        />
      </div>

      {/* Desktop: the vertical track, with room for a readout beside it. */}
      <div
        className="fixed top-1/2 right-4 -translate-y-1/2 z-50 hidden lg:block"
        role="progressbar"
        aria-label="Page scroll progress"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={rounded}
      >
        <div className="w-1 h-24 rounded-full bg-neutral-200/80 dark:bg-neutral-800/50 overflow-hidden backdrop-blur-sm">
          <div
            className="w-full rounded-full bg-neutral-700 transition-[height] duration-100 ease-out dark:bg-neutral-300"
            style={{ height: `${scrollProgress}%` }}
          />
        </div>

        <div
          aria-hidden="true"
          className="absolute -left-10 top-1/2 -translate-y-1/2 text-[10px] text-neutral-600 dark:text-neutral-400 font-medium transition-opacity duration-300"
          style={{ opacity: scrollProgress > 5 ? 1 : 0 }}
        >
          {rounded}%
        </div>
      </div>
    </>
  );
}
