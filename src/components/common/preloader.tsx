"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [isVisible, setIsVisible] = useState(true);
  const name = siteConfig.name.toUpperCase();

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 1000);
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  const letterVariants = {
    hidden: { y: 120, opacity: 0 },
    visible: (i: number) => ({
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        delay: i * 0.05,
        ease: [0.215, 0.61, 0.355, 1] as const,
      },
    }),
    exit: (i: number) => ({
      y: -120,
      opacity: 0,
      transition: {
        duration: 0.4,
        delay: i * 0.02,
        ease: [0.55, 0.055, 0.675, 0.19] as const,
      },
    }),
  };

  const containerVariants = {
    hidden: { opacity: 1 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 },
    },
    exit: {
      opacity: 1,
      transition: { staggerChildren: 0.02 },
    },
  };

  const overlayVariants = {
    visible: { clipPath: "inset(0 0 0 0)" },
    exit: {
      clipPath: "inset(0 0 100% 0)",
      transition: {
        duration: 0.8,
        delay: 0.4,
        ease: [0.76, 0, 0.24, 1] as const,
      },
    },
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden"
          variants={overlayVariants}
          initial="visible"
          exit="exit"
        >
          <div className="absolute inset-0 bg-black" />

          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500/20 to-transparent" />

          <div className="relative z-10 flex flex-col items-center">
            <motion.div
              className="flex overflow-hidden"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              exit="exit"
            >
              {name.split("").map((letter, i) => (
                <motion.span
                  key={i}
                  custom={i}
                  variants={letterVariants}
                  className="text-6xl sm:text-8xl md:text-[10rem] lg:text-[12rem] font-bold font-heading tracking-[-0.02em] text-white"
                  style={{ fontWeight: 800 }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
