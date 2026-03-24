"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function CinematicGridBackground() {
  const prefersReducedMotion = useReducedMotion() ?? false;
  const frameRef = useRef<number | null>(null);
  const [pointer, setPointer] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (prefersReducedMotion) return;

    const handlePointerMove = (event: PointerEvent) => {
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }

      frameRef.current = requestAnimationFrame(() => {
        const x = (event.clientX / window.innerWidth) * 100;
        const y = (event.clientY / window.innerHeight) * 100;
        setPointer({ x, y });
      });
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      if (frameRef.current !== null) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, [prefersReducedMotion]);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-2 overflow-hidden"
    >
      {/* Base cinematic tint */}
      <div className="absolute inset-0 bg-linear-to-br from-transparent via-neutral-200/10 to-transparent dark:via-neutral-900/20" />

      {/* Dense grid layer */}
      <motion.div
        className="absolute inset-0 opacity-[0.35] dark:opacity-[0.28]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(115,115,115,0.22) 1px, transparent 1px), linear-gradient(to bottom, rgba(115,115,115,0.22) 1px, transparent 1px)",
          backgroundSize: "36px 36px",
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                backgroundPosition: ["0px 0px", "36px 18px", "0px 0px"],
              }
        }
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
      />

      {/* Wide grid layer */}
      <motion.div
        className="absolute inset-0 opacity-[0.22] dark:opacity-[0.2]"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(163,163,163,0.2) 1px, transparent 1px), linear-gradient(to bottom, rgba(163,163,163,0.2) 1px, transparent 1px)",
          backgroundSize: "96px 96px",
        }}
        animate={
          prefersReducedMotion
            ? undefined
            : {
                backgroundPosition: ["0px 0px", "-96px -48px", "0px 0px"],
              }
        }
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
      />

      {/* Interactive spotlight */}
      <motion.div
        className="absolute inset-0"
        style={{
          background: `radial-gradient(420px circle at ${pointer.x}% ${pointer.y}%, rgba(245,158,11,0.2), rgba(245,158,11,0.08) 22%, transparent 62%)`,
        }}
        animate={prefersReducedMotion ? { opacity: 0.45 } : { opacity: [0.35, 0.65, 0.35] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Cinematic sweep lines */}
      <motion.div
        className="absolute inset-y-0 -left-1/3 w-1/3 bg-linear-to-r from-transparent via-neutral-400/12 to-transparent dark:via-neutral-200/12"
        animate={prefersReducedMotion ? undefined : { x: ["0%", "520%"] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", repeatDelay: 2 }}
      />
      <motion.div
        className="absolute inset-y-0 -right-1/3 w-1/3 bg-linear-to-l from-transparent via-neutral-400/10 to-transparent dark:via-neutral-200/10"
        animate={prefersReducedMotion ? undefined : { x: ["0%", "-520%"] }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear", repeatDelay: 1 }}
      />

      {/* Soft readability mask */}
      <div className="absolute inset-0 bg-linear-to-b from-background/25 via-transparent to-background/25 dark:from-background/35 dark:to-background/35" />
    </div>
  );
}
