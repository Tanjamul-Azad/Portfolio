"use client";

import { motion } from "framer-motion";
import { siteConfig } from "@/config";

export function StickyEmail() {
  return (
    <motion.div
      className="fixed hidden xl:block z-40 bottom-[max(8rem,env(safe-area-inset-bottom))] left-[max(2rem,env(safe-area-inset-left))]"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 2, duration: 0.5 }}
    >
      <div className="glass px-3 py-6 rounded-full flex flex-col items-center gap-4">
        <a
          href={`mailto:${siteConfig.contact.email}`}
          className="text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white text-xs tracking-[2px] transition-colors duration-300"
          style={{
            writingMode: "vertical-rl",
            textOrientation: "mixed",
          }}
        >
          {siteConfig.contact.email}
        </a>
        <div className="w-px h-12 bg-neutral-300 dark:bg-neutral-700" />
      </div>
    </motion.div>
  );
}
