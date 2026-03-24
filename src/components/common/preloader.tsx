"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { siteConfig } from "@/config";

interface PreloaderProps {
  onComplete: () => void;
}

export function Preloader({ onComplete }: PreloaderProps) {
  const [count, setCount] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [phase, setPhase] = useState<"counting" | "reveal" | "exit">("counting");

  useEffect(() => {
    let frame = 0;
    const total = 60;
    const timeouts: NodeJS.Timeout[] = [];

    const timer = setInterval(() => {
      frame++;
      const progress = frame / total;
      const eased = progress < 0.5
        ? 2 * progress * progress
        : -1 + (4 - 2 * progress) * progress;
      setCount(Math.round(eased * 100));

      if (frame >= total) {
        clearInterval(timer);
        setCount(100);
        setPhase("reveal");

        timeouts.push(setTimeout(() => {
          setPhase("exit");
          timeouts.push(setTimeout(() => {
            setIsVisible(false);
            timeouts.push(setTimeout(onComplete, 900));
          }, 750));
        }, 650));
      }
    }, 30);

    return () => {
      clearInterval(timer);
      timeouts.forEach(clearTimeout);
    };
  }, [onComplete]);

  const name = siteConfig.name.toUpperCase();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-100 bg-black flex flex-col items-center justify-center overflow-hidden"
          exit={{ clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.85, ease: [0.76, 0, 0.24, 1] }}
        >
          <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/20 to-transparent" />

          <div
            className="absolute top-0 left-0 h-px bg-white transition-all duration-30 linear"
            style={{ width: `${count}%` }}
          />

          <motion.div
            className="absolute top-8 right-8 font-mono text-xs text-neutral-500 tabular-nums tracking-widest"
            animate={{ opacity: phase === "reveal" ? 0 : 1 }}
            transition={{ duration: 0.25 }}
          >
            {String(count).padStart(3, "0")}
          </motion.div>

          <AnimatePresence>
            {phase === "counting" && (
              <motion.div
                key="sweep"
                className="absolute w-full h-px bg-linear-to-r from-transparent via-neutral-700/50 to-transparent"
                initial={{ y: "100vh" }}
                animate={{ y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.6, ease: [0.76, 0, 0.24, 1] }}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase !== "counting" && (
              <motion.div
                key="name"
                initial={{ clipPath: "inset(0 100% 0 0)" }}
                animate={{ clipPath: "inset(0 0% 0 0)" }}
                exit={{ clipPath: "inset(0 0 0 100%)" }}
                transition={{ duration: 0.7, ease: [0.76, 0, 0.24, 1] }}
                className="relative z-10 select-none"
              >
                <h1 className="text-[clamp(3rem,12vw,10rem)] font-bold font-heading text-white tracking-[-0.02em] leading-none">
                  {name}
                </h1>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {phase === "reveal" && (
              <motion.p
                key="role"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, delay: 0.35 }}
                className="absolute bottom-12 font-mono text-xs text-neutral-500 tracking-[0.3em] uppercase text-center w-full px-4"
              >
                {siteConfig.author.role}
              </motion.p>
            )}
          </AnimatePresence>

          <div className="absolute bottom-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-white/10 to-transparent" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
