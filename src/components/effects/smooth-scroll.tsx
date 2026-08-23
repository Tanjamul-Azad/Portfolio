"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const pathname = usePathname();
  const onAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    // The admin editor uses native scrolling — Lenis would hijack form scrolling.
    if (onAdmin) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // lerp-based smoothing is frame-rate independent and feels more continuous /
    // fluent than a fixed-duration tween, which can stutter on fast flicks.
    const lenis = new Lenis({
      lerp: prefersReducedMotion ? 1 : 0.085,
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: !prefersReducedMotion,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      // Touch scrolling stays native. syncTouch routes finger scrolling through
      // Lenis's rAF loop, which costs the platform's momentum and rubber-band
      // physics and reads as laggy on phones — the exact devices least able to
      // spare the frames. Smoothing is a pointer-wheel nicety, not a touch one.
      syncTouch: false,
    });
    lenisRef.current = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenisRef.current = null;
      lenis.destroy();
    };
  }, [onAdmin]);

  return null;
}
