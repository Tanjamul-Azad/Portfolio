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
  const [isLoading, setIsLoading] = useState(true);

  // Skip preloader if already loaded in this session
  useEffect(() => {
    const hasLoaded = sessionStorage.getItem("portfolio_loaded");
    if (hasLoaded) {
      setIsLoading(false);
    }
  }, []);

  const handleComplete = () => {
    setIsLoading(false);
    sessionStorage.setItem("portfolio_loaded", "true");
  };

  return (
    <main className="scroll-container relative min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
          >
            <Preloader onComplete={handleComplete} />
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: MOTION_TOKENS.duration.slow, ease: MOTION_TOKENS.easing.premium }}
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
            <SectionStage>
              <Footer />
            </SectionStage>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
