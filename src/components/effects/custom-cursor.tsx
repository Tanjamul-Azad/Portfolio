"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

type CursorVariant = "default" | "hover" | "text" | "click";

export function CustomCursor() {
  const [visible, setVisible] = useState(false);
  const [variant, setVariant] = useState<CursorVariant>("default");

  const cursorX = useMotionValue(-200);
  const cursorY = useMotionValue(-200);

  const dotX = useSpring(cursorX, { stiffness: 600, damping: 40, mass: 0.2 });
  const dotY = useSpring(cursorY, { stiffness: 600, damping: 40, mass: 0.2 });

  const ringX = useSpring(cursorX, { stiffness: 120, damping: 18, mass: 0.6 });
  const ringY = useSpring(cursorY, { stiffness: 120, damping: 18, mass: 0.6 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.innerWidth < 768) return;

    const move = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      setVisible(true);
    };
    const leave = () => setVisible(false);
    const down = () => setVariant("click");
    const up = () => setVariant((v) => (v === "click" ? "default" : v));

    function attachHoverListeners() {
      // Safely attach and remove listeners to avoid memory leaks
      const hoverElements = document.querySelectorAll("a, button, [role='button'], input, textarea, select");
      const textElements = document.querySelectorAll("p, h1, h2, h3, h4, h5, h6, span, blockquote, li");

      const handleHoverEnter = () => setVariant("hover");
      const handleTextEnter = () => setVariant("text");
      const handleLeave = () => setVariant("default");

      hoverElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleHoverEnter);
        el.removeEventListener("mouseleave", handleLeave);
        el.addEventListener("mouseenter", handleHoverEnter);
        el.addEventListener("mouseleave", handleLeave);
      });

      textElements.forEach((el) => {
        el.removeEventListener("mouseenter", handleTextEnter);
        el.removeEventListener("mouseleave", handleLeave);
        el.addEventListener("mouseenter", handleTextEnter);
        el.addEventListener("mouseleave", handleLeave);
      });
    }

    // Delay attachment slightly to ensure DOM is ready
    const timeoutId = setTimeout(() => {
      attachHoverListeners();
    }, 100);

    const observer = new MutationObserver((mutations) => {
        // Debounce or selectively trigger based on meaningful DOM changes
        let shouldReattach = false;
        for (const mutation of mutations) {
            if (mutation.addedNodes.length > 0 || mutation.removedNodes.length > 0) {
                shouldReattach = true;
                break;
            }
        }
        if (shouldReattach) {
             attachHoverListeners();
        }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseleave", leave);
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    
    // Modern way to hide cursor cleanly on desktop without affecting mobile
    document.body.classList.add('cursor-none', 'md:cursor-none');

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseleave", leave);
      window.removeEventListener("mousedown", down);
      window.removeEventListener("mouseup", up);
      observer.disconnect();
      document.body.classList.remove('cursor-none', 'md:cursor-none');
    };
  }, [cursorX, cursorY]);

  const dotStyles: Record<CursorVariant, {
    width: number;
    height: number;
    borderRadius: string | number;
    background: string;
    border: string;
    opacity: number;
  }> = {
    default: { width: 10,  height: 10, borderRadius: "50%", background: "#f59e0b", border: "none", opacity: 0.8 },
    hover:   { width: 36,  height: 36, borderRadius: "50%", background: "transparent", border: "1.5px solid #f59e0b", opacity: 1 },
    text:    { width: 2,   height: 24, borderRadius: 2, background: "#f59e0b", border: "none", opacity: 1 },
    click:   { width: 6,   height: 6,  borderRadius: "50%", background: "#f97316", border: "none", opacity: 1 },
  };

  const ringStyles: Record<CursorVariant, {
    width: number;
    height: number;
    opacity: number;
  }> = {
    default: { width: 26, height: 26, opacity: 0.35 },
    hover:   { width: 56, height: 56, opacity: 0.2 },
    text:    { width: 26, height: 26, opacity: 0 },
    click:   { width: 18, height: 18, opacity: 0.5 },
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{__html: `
        /* Hide default cursor only when our custom cursor is active and on right devices */
        @media (pointer: fine) and (min-width: 768px) {
          body.cursor-none * {
            cursor: none !important;
          }
        }
      `}} />
      <motion.div
        className="hidden md:block fixed top-0 left-0 z-[9999] pointer-events-none"
        style={{ x: dotX, y: dotY, translateX: "-50%", translateY: "-50%" }}
        animate={{ ...dotStyles[variant], opacity: visible ? dotStyles[variant].opacity : 0 }}
        transition={{ duration: 0.15, ease: "easeOut" }}
      />
      <motion.div
        className="hidden md:block fixed top-0 left-0 z-[9998] pointer-events-none rounded-full border border-amber-500/50"
        style={{ x: ringX, y: ringY, translateX: "-50%", translateY: "-50%" }}
        animate={{ ...ringStyles[variant], opacity: visible ? ringStyles[variant].opacity : 0 }}
        transition={{ duration: 0.2, ease: "easeOut" }}
      />
    </>
  );
}
