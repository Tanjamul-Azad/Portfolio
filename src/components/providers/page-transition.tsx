"use client";

import { createContext, useContext } from "react";
import type { ReactNode } from "react";

type RouteTransitionContextValue = {
  isRouteTransitioning: boolean;
};

/**
 * Always false. Kept because several sections read it to decide whether to run
 * their scroll-reveal animations, and "not transitioning" is the correct answer
 * now that route changes are not animated.
 */
const RouteTransitionContext = createContext<RouteTransitionContextValue>({
  isRouteTransitioning: false,
});

export function useRouteTransitioning() {
  return useContext(RouteTransitionContext);
}

export function RouteTransitionProvider({ children }: { children: ReactNode }) {
  return (
    <RouteTransitionContext.Provider value={{ isRouteTransitioning: false }}>
      {children}
    </RouteTransitionContext.Provider>
  );
}

/**
 * Passthrough. There is deliberately no cross-route animation here.
 *
 * Two separate bugs came out of animating this boundary, because in the App
 * Router the page arrives as a `children` prop rather than as a differently
 * keyed element:
 *
 *  - Wrapping it in AnimatePresence meant the "exiting" copy re-rendered with
 *    the *incoming* page's content and then never unmounted. Every case study
 *    ended up rendered twice, stacked, the second at opacity 0 — so the page was
 *    double height with a dead invisible half below the real content. Scrolling
 *    into that region is what felt like the page being stuck.
 *
 *  - Keying a motion.div on the pathname fixed the ghost but forced a full
 *    remount on every navigation, which re-suspended the route and left it
 *    parked on the loading fallback instead of resolving.
 *
 * The fade was cosmetic and each section already animates itself on scroll, so
 * the honest fix is not to animate this boundary at all.
 */
export function PageTransition({ children }: { children: ReactNode }) {
  return <>{children}</>;
}
