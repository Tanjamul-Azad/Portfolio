"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { useRouteTransitioning } from "@/components/providers/page-transition";

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const { isRouteTransitioning } = useRouteTransitioning();
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
      syncTouch: !prefersReducedMotion,
      syncTouchLerp: 0.075,
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

  useEffect(() => {
    if (!lenisRef.current) return;
    if (isRouteTransitioning) {
      lenisRef.current.stop();
      return;
    }
    lenisRef.current.start();
  }, [isRouteTransitioning]);

  return null;
}
