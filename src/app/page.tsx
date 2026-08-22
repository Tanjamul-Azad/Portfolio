"use client";

import { useState, useEffect, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Preloader } from "@/components/common";
import { Navbar, Footer } from "@/components/layout";
import {
  Hero,
  About,
  TechStack,
  Projects,
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

function SectionStage({ children }: { children: ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 36, scale: 0.992 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="relative"
    >
      {children}
    </motion.div>
  );
}

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
    <main className="scroll-container relative min-h-screen overflow-x-hidden">
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

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          duration: MOTION_TOKENS.duration.slow,
          ease: MOTION_TOKENS.easing.premium,
        }}
        className="relative z-10"
      >
        <Navbar />
        <Hero />
        <SectionStage>
          <About />
        </SectionStage>
        <SectionStage>
          <Now />
        </SectionStage>
        <SectionStage>
          <TechStack />
        </SectionStage>
        <SectionStage>
          <Projects />
        </SectionStage>
        <SectionStage>
          <Experience />
        </SectionStage>
        <SectionStage>
          <Achievements />
        </SectionStage>
        <SectionStage>
          <Testimonials />
        </SectionStage>
        <SectionStage>
          <Blog />
        </SectionStage>
        <SectionStage>
          <Contact />
        </SectionStage>
        <Footer />
      </motion.div>
    </main>
  );
}
