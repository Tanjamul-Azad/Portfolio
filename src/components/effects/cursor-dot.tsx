"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";

/**
 * A small accent dot that rides along with the pointer.
 *
 * Three deliberate choices, all aimed at it never feeling laggy:
 *
 *  - The native cursor stays visible. The previous version set `cursor: none`
 *    and replaced the pointer with a spring-driven dot and trailing ring, so
 *    the only position feedback on screen was the one running behind the real
 *    input. Keeping the system cursor means the accurate pointer is always
 *    there and this is purely decorative.
 *  - No spring, no easing, no rAF loop. The transform is written straight from
 *    the pointermove event, so the dot is on the pointer rather than chasing it.
 *  - No React state. Re-rendering a component on every pointer move is a lot of
 *    work to move one element 12 pixels; this writes to the node directly.
 *
 * `mix-blend-difference` keeps it legible over any background without needing
 * to know what is underneath.
 */
export function CursorDot() {
  const ref = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const onAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (onAdmin) return;
    const node = ref.current;
    if (!node) return;

    // Touch and stylus users have no persistent pointer to decorate, and a
    // moving accent is exactly what reduced-motion asks us not to add.
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const move = (event: PointerEvent) => {
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      if (node.style.opacity !== "1") node.style.opacity = "1";
    };

    const hide = () => {
      node.style.opacity = "0";
    };

    window.addEventListener("pointermove", move, { passive: true });
    document.addEventListener("pointerleave", hide);
    window.addEventListener("blur", hide);

    return () => {
      window.removeEventListener("pointermove", move);
      document.removeEventListener("pointerleave", hide);
      window.removeEventListener("blur", hide);
    };
  }, [onAdmin]);

  if (onAdmin) return null;

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-100 hidden opacity-0 md:block"
      style={{ transform: "translate3d(-100px, -100px, 0)", willChange: "transform" }}
    >
      <div className="h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-amber-400 mix-blend-difference" />
    </div>
  );
}
