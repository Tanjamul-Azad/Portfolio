"use client";

import { Suspense, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Preloader } from "@/components/common";
import { Navbar, Footer } from "@/components/layout";
import {
  Hero,
  About,
  TechStack,
  Projects,
  Research,
  Experience,
  Achievements,
  Now,
  Testimonials,
  Blog,
  Contact,
} from "@/components/sections";
import { MOTION_TOKENS } from "@/lib";

// Persists across in-app (client-side) navigations but resets on a real page
// load, so the preloader plays once per visit — not every time you return to
// the homepage from /blog or /projects. Kept at module scope and read lazily
// so server and first client render agree (no hydration mismatch).
const preloaderState = { shown: false };

export default function Home() {
  const [isLoading, setIsLoading] = useState(() => !preloaderState.shown);

  // Skip the preloader if it already played this visit (sessionStorage covers
  // hard refreshes; the module flag covers in-app navigation back here).
  useEffect(() => {
    if (preloaderState.shown || sessionStorage.getItem("portfolio_loaded")) {
      preloaderState.shown = true;
      setIsLoading(false);
    }
  }, []);

  const handleComplete = () => {
    preloaderState.shown = true;
    setIsLoading(false);
    sessionStorage.setItem("portfolio_loaded", "true");
  };

  return (
    <main className="scroll-container relative min-h-svh overflow-x-hidden">
      {/* The preloader is an overlay, not a gate.
          It used to be the other branch of an `AnimatePresence mode="wait"`, which
          meant the server-rendered HTML contained the loading screen and nothing
          else — bad for crawlers and link-preview bots that don't run JS, and a
          dead page for anyone whose exit animation never completed (a background
          tab starves requestAnimationFrame, so it could hang indefinitely). The
          content now always renders; the overlay just fades away on top of it. */}
      <AnimatePresence initial={false}>
        {isLoading && (
          <motion.div
            key="preloader"
            className="fixed inset-0 z-100"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            // pointerEvents flips the instant the exit starts, so a stalled fade
            // (hidden tab, starved rAF) can never leave a full-screen overlay
            // swallowing clicks on the content underneath.
            exit={{ opacity: 0, pointerEvents: "none" }}
            transition={{ duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
          >
            <Preloader onComplete={handleComplete} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Plain wrapper: it used to fade the whole page in from opacity 0, which
          kept everything — the hero included — unpainted until hydration. */}
      <div className="relative z-10">
        <Navbar />
        {/* One Suspense boundary per section, so React hydrates the page as
            separate small units and yields between them, rather than in a
            few long blocks. Those blocks were landing exactly as a visitor
            started to scroll and froze the first swipe on phones. */}
        <Hero />
        <Suspense>
          <About />
        </Suspense>
        <Suspense>
          <Now />
        </Suspense>
        <Suspense>
          <TechStack />
        </Suspense>
        <Suspense>
          <Projects />
        </Suspense>
        <Suspense>
          <Research />
        </Suspense>
        <Suspense>
          <Experience />
        </Suspense>
        <Suspense>
          <Achievements />
        </Suspense>
        <Suspense>
          <Testimonials />
        </Suspense>
        <Suspense>
          <Blog />
        </Suspense>
        <Suspense>
          <Contact />
        </Suspense>
        <Footer />
      </div>
    </main>
  );
}
