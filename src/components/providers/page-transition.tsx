"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { MOTION_TOKENS } from "@/lib";

type RouteTransitionContextValue = {
  isRouteTransitioning: boolean;
  setRouteTransitioning: (value: boolean) => void;
};

const RouteTransitionContext = createContext<RouteTransitionContextValue>({
  isRouteTransitioning: false,
  setRouteTransitioning: () => {},
});

export function useRouteTransitioning() {
  return useContext(RouteTransitionContext);
}

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  const [isRouteTransitioning, setRouteTransitioning] = useState(false);

  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;

    if (isRouteTransitioning) {
      html.setAttribute("data-route-transitioning", "true");
      body.style.overflow = "hidden";
      body.style.touchAction = "none";
    } else {
      html.removeAttribute("data-route-transitioning");
      body.style.overflow = "";
      body.style.touchAction = "";
    }

    return () => {
      html.removeAttribute("data-route-transitioning");
      body.style.overflow = "";
      body.style.touchAction = "";
    };
  }, [isRouteTransitioning]);

  const value = useMemo(
    () => ({ isRouteTransitioning, setRouteTransitioning }),
    [isRouteTransitioning]
  );

  return (
    <RouteTransitionContext.Provider value={value}>
      {children}
    </RouteTransitionContext.Provider>
  );
}

export function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { setRouteTransitioning } = useRouteTransitioning();

  // The admin editor renders without per-route transition animations.
  if (pathname?.startsWith("/admin")) {
    return <>{children}</>;
  }

  return (
    <AnimatePresence
      initial={false}
      onExitComplete={() => setRouteTransitioning(false)}
    >
      <motion.div
        key={pathname}
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={prefersReducedMotion ? { opacity: 1 } : { opacity: 0 }}
        onAnimationStart={(definition) => {
          if (definition === "exit") {
            setRouteTransitioning(true);
          }
        }}
        transition={{
          duration: MOTION_TOKENS.duration.quick,
          ease: MOTION_TOKENS.easing.premium,
        }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
