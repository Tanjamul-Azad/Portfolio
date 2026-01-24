"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config";

export function StickyEmail() {
  return (
    <motion.div
      className="fixed bottom-32 left-4 hidden xl:block z-40"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <a
        href={`mailto:${siteConfig.contact.email}`}
        className="text-neutral-400 dark:text-neutral-500 hover:text-amber-600 dark:hover:text-amber-400 text-xs tracking-[2px] transition-colors duration-300 group"
        style={{
          writingMode: "vertical-rl",
          textOrientation: "mixed",
        }}
      >
        <span className="relative">
          {siteConfig.contact.email}
          <span className="absolute -bottom-8 left-1/2 w-px h-6 bg-gradient-to-b from-amber-500/50 dark:from-amber-400/50 to-transparent" />
        </span>
      </a>
    </motion.div>
  );
}
