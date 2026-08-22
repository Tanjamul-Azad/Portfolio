"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorVariant = "default" | "hover" | "text" | "click";

const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], select, label, summary, .cursor-pointer, [data-cursor='hover']";
const TEXT_INPUT_SELECTOR = "input:not([type='checkbox']):not([type='radio']), textarea, [contenteditable='true']";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  // Refs let the high-frequency pointermove handler avoid triggering React
  // re-renders unless the variant/visibility actually changes.
  const variantRef = useRef<CursorVariant>("default");
  const visibleRef = useRef(false);
  const pressedRef = useRef(false);

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  // Inner dot: fast + precise. Outer ring: smooth, slightly elastic trail.
  const dotX = useSpring(cursorX, { stiffness: 1500, damping: 60, mass: 0.2 });
  const dotY = useSpring(cursorY, { stiffness: 1500, damping: 60, mass: 0.2 });
  const ringX = useSpring(cursorX, { stiffness: 250, damping: 26, mass: 0.55 });
  const ringY = useSpring(cursorY, { stiffness: 250, damping: 26, mass: 0.55 });

  const pathname = usePathname();
  const onAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (onAdmin) return;
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.innerWidth < 768) return;
    // A spring-trailing cursor is exactly the kind of motion this setting is for,
    // and replacing the system cursor is worse than useless if it lags.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const applyVariant = (next: CursorVariant) => {
      if (variantRef.current !== next) {
        variantRef.current = next;
        setVariant(next);
      }
    };

    const resolveVariant = (target: EventTarget | null): CursorVariant => {
      if (pressedRef.current) return "click";
      const el = target instanceof Element ? target : null;
      if (!el) return "default";
      if (el.closest(TEXT_INPUT_SELECTOR)) return "text";
      if (el.closest(INTERACTIVE_SELECTOR)) return "hover";
      return "default";
    };

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      if (!visibleRef.current) {
        visibleRef.current = true;
        setVisible(true);
      }
      applyVariant(resolveVariant(e.target));
    };

    const leave = () => {
      visibleRef.current = false;
      setVisible(false);
    };

    const down = () => {
      pressedRef.current = true;
      applyVariant("click");
    };

    const up = (e: MouseEvent) => {
      pressedRef.current = false;
      applyVariant(resolveVariant(e.target));
    };

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseleave", leave);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);

    // Hide the native cursor only while ours is active, only on fine-pointer desktops.
    document.body.classList.add("cursor-none");

    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      document.body.classList.remove("cursor-none");
    };
  }, [cursorX, cursorY, onAdmin]);

  const dot: Record<CursorVariant, {
    width: number;
    height: number;
    borderRadius: number | string;
    background: string;
    opacity: number;
  }> = {
    default: { width: 8, height: 8, borderRadius: "50%", background: "#f59e0b", opacity: 1 },
    hover: { width: 6, height: 6, borderRadius: "50%", background: "#f59e0b", opacity: 0.6 },
    text: { width: 2, height: 22, borderRadius: 2, background: "#f59e0b", opacity: 1 },
    click: { width: 14, height: 14, borderRadius: "50%", background: "#f97316", opacity: 1 },
  };

  const ring: Record<CursorVariant, {
    width: number;
    height: number;
    opacity: number;
    borderColor: string;
    background: string;
  }> = {
    default: { width: 30, height: 30, opacity: 0.4, borderColor: "rgba(245,158,11,0.5)", background: "rgba(0,0,0,0)" },
    hover: { width: 52, height: 52, opacity: 1, borderColor: "rgba(245,158,11,0.9)", background: "rgba(245,158,11,0.08)" },
    text: { width: 30, height: 30, opacity: 0, borderColor: "rgba(245,158,11,0.5)", background: "rgba(0,0,0,0)" },
    click: { width: 24, height: 24, opacity: 0.7, borderColor: "rgba(249,115,22,0.9)", background: "rgba(249,115,22,0.1)" },
  };

  if (onAdmin) return null;

  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html: `
        @media (pointer: fine) and (min-width: 768px) {
          body.cursor-none, body.cursor-none * { cursor: none !important; }
        }
      `,
        }}
      />
      {/* Trailing ring */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 z-9998 pointer-events-none rounded-full border"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%", willChange: "transform" }}
        animate={{
          width: ring[variant].width,
          height: ring[variant].height,
          borderColor: ring[variant].borderColor,
          background: ring[variant].background,
          opacity: visible ? ring[variant].opacity : 0,
        }}
        transition={{ type: "spring", stiffness: 420, damping: 32, mass: 0.6 }}
      />
      {/* Precise inner dot */}
      <motion.div
        className="hidden md:block fixed top-0 left-0 z-9999 pointer-events-none"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%", willChange: "transform" }}
        animate={{
          width: dot[variant].width,
          height: dot[variant].height,
          borderRadius: dot[variant].borderRadius,
          background: dot[variant].background,
          opacity: visible ? dot[variant].opacity : 0,
        }}
        transition={{ type: "spring", stiffness: 500, damping: 30, mass: 0.5 }}
      />
    </>
  );
}
