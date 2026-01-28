"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config";

export function StickyEmail() {
  return (
    <motion.div
      className="fixed bottom-32 left-8 hidden xl:block z-40"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <div className="glass px-3 py-6 rounded-full flex flex-col items-center gap-4">
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="text-neutral-500 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 text-xs tracking-[2px] transition-colors duration-300"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          {siteConfig.contact.email}
        </a>
        <div className="w-px h-12 bg-gradient-to-b from-amber-500/50 dark:from-amber-400/50 to-transparent" />
      </div>
    </motion.div>
  );
}
