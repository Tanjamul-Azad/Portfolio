"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Preloader } from "@/components/common";
import { Navbar, Footer } from "@/components/layout";
import {
  Hero,
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

  return (
    <main className="scroll-container bg-neutral-50 dark:bg-black min-h-screen overflow-x-hidden">
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.div
            key="preloader"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
          >
            <Preloader onComplete={() => setIsLoading(false)} />
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
