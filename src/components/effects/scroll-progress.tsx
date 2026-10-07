"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * Where you are in the page, as a hairline across the top edge.
 *
 * Written straight to the DOM on each animation frame — a `scaleX` transform
 * and the progressbar's aria value — with no React state. The previous version
 * re-rendered on every frame and animated `width`, a layout property, which
 * added main-thread work to every scroll frame on phones.
 */
export function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const onAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (onAdmin) return;
    const bar = barRef.current;
    const track = trackRef.current;
    if (!bar || !track) return;

    let frame = 0;
    let scrollable = 1;

    // Page height only changes on resize or as content loads, so it is read
    // then rather than on every scroll frame.
    const measure = () => {
      scrollable = Math.max(1, document.documentElement.scrollHeight - window.innerHeight);
    };

    const paint = () => {
      frame = 0;
      // Clamp so rubber-band overscroll can't report <0% or >100%.
      const progress = Math.min(1, Math.max(0, window.scrollY / scrollable));
      bar.style.transform = `scaleX(${progress})`;
      track.setAttribute("aria-valuenow", String(Math.round(progress * 100)));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(paint);
    };
    const onResize = () => {
      measure();
      onScroll();
    };

    measure();
    paint();
    const resizeObserver = new ResizeObserver(onResize);
    resizeObserver.observe(document.body);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      resizeObserver.disconnect();
      window.removeEventListener("scroll", onScroll);
    };
  }, [onAdmin]);

  if (onAdmin) return null;

  return (
    // It sits above the navbar rather than under it, so nothing anchored to
    // the bar's changing shape can make it drift.
    <div
      ref={trackRef}
      className="pointer-events-none fixed inset-x-0 top-0 z-60 h-0.5"
      role="progressbar"
      aria-label="Page scroll progress"
      aria-valuemin={0}
      aria-valuemax={100}
      aria-valuenow={0}
    >
      <div
        ref={barRef}
        className="h-full w-full origin-left bg-linear-to-r from-amber-500/60 via-amber-400 to-amber-300 will-change-transform"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}
