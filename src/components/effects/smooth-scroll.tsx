"use client";

import { useEffect, useRef } from "react";
import Lenis from "lenis";
import { useRouteTransitioning } from "@/components/providers/page-transition";

export function SmoothScroll() {
  const lenisRef = useRef<Lenis | null>(null);
  const { isRouteTransitioning } = useRouteTransitioning();

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.45,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 0.9,
      touchMultiplier: 1.4,
      syncTouch: true,
      syncTouchLerp: 0.12,
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenisRef.current = null;
      lenis.destroy();
    };
  }, []);

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
