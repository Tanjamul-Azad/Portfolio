"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export function ScrollProgress() {
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollHeight, clientHeight } = document.documentElement;
      const scrollableHeight = scrollHeight - clientHeight;
      const scrollY = window.scrollY;
      const progress = (scrollY / scrollableHeight) * 100;
      setScrollProgress(progress);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="fixed top-1/2 right-4 -translate-y-1/2 z-50 hidden lg:block">
      {/* Track */}
      <div className="w-1 h-24 rounded-full bg-neutral-200/80 dark:bg-neutral-800/50 overflow-hidden backdrop-blur-sm">
        {/* Progress */}
        <motion.div
          className="w-full bg-gradient-to-b from-amber-400 to-orange-500 rounded-full origin-top"
          style={{ height: `${scrollProgress}%` }}
          initial={{ height: 0 }}
          transition={{ duration: 0.1 }}
        />
      </div>
      
      {/* Percentage indicator */}
      <motion.div
        className="absolute -left-10 top-1/2 -translate-y-1/2 text-[10px] text-amber-600/80 dark:text-amber-400/70 font-medium"
        initial={{ opacity: 0 }}
        animate={{ opacity: scrollProgress > 5 ? 1 : 0 }}
      >
        {Math.round(scrollProgress)}%
      </motion.div>
    </div>
  );
}
