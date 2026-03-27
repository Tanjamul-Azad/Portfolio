"use client";

import { useState, useEffect } from "react";
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
    <main className="scroll-container bg-background min-h-screen overflow-x-hidden">
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
          >
            <Navbar />
            <Hero />
            <About />
            <Now />
            <TechStack />
            <Projects />
            <Experience />
            <Achievements />
            <Testimonials />
            <Blog />
            <Contact />
            <Footer />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
