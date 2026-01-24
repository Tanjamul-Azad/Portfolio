"use client";

import { useEffect, useRef } from "react";

export function CustomCursor() {
  const cursorRef = useRef<SVGSVGElement>(null);
  const cursorDotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Only enable on desktop
    if (typeof window === "undefined" || window.innerWidth < 768) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        cursorRef.current.style.opacity = "1";
      }
      if (cursorDotRef.current) {
        cursorDotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
        cursorDotRef.current.style.opacity = "1";
      }
    };

    const handleMouseLeave = () => {
      if (cursorRef.current) cursorRef.current.style.opacity = "0";
      if (cursorDotRef.current) cursorDotRef.current.style.opacity = "0";
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <>
      {/* Main cursor */}
      <svg
        ref={cursorRef}
        width="24"
        height="28"
        viewBox="0 0 24 28"
        className="hidden md:block fixed top-0 left-0 opacity-0 z-[100] pointer-events-none transition-opacity duration-150"
        style={{ transform: "translate(-100%, -100%)" }}
      >
        <defs>
          <linearGradient id="cursor-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#f97316" />
          </linearGradient>
        </defs>
        <path
          d="M5.5 1L1 26.5L8.5 19.5L14 27L18.5 24.5L13 17.5L23 16L5.5 1Z"
          fill="url(#cursor-gradient)"
          stroke="#000"
          strokeWidth="1.5"
        />
      </svg>

      {/* Cursor trail dot */}
      <div
        ref={cursorDotRef}
        className="hidden md:block fixed w-2 h-2 rounded-full bg-amber-400/50 z-[99] pointer-events-none opacity-0 transition-all duration-300 ease-out"
        style={{ transform: "translate(-100%, -100%)" }}
      />
    </>
  );
}
