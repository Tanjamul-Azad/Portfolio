"use client";

import { motion, type Variants } from "framer-motion";
import { Brain } from "lucide-react";
import Markdown, { type Components } from "react-markdown";
import { aboutContent } from "@/data/site-content";

// Render bio Markdown inline: keep the paragraph wrapper as the motion element
// and map **bold** to the highlighted-word styling the design uses.
const markdownComponents: Components = {
  p: ({ children }) => <>{children}</>,
  strong: ({ children }) => (
    <span className="font-semibold text-neutral-900 dark:text-white">{children}</span>
  ),
};

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export function About() {
  return (
    <section
      id="about"
      className="scroll-section relative py-20 md:py-28 overflow-hidden"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="container max-w-3xl px-4 sm:px-6 mx-auto"
      >
        {/* Section header */}
        <div className="text-center mb-12 md:mb-16 space-y-3">
          <motion.span
            variants={item}
            className="block text-sm text-neutral-500 dark:text-neutral-400 tracking-[0.16em] uppercase font-medium"
          >
            {aboutContent.eyebrow}
          </motion.span>
          <motion.h2
            variants={item}
            className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight"
          >
            {aboutContent.heading}
          </motion.h2>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* INTP-A badge */}
          <motion.div variants={item} className="flex justify-start">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <Brain className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">
                {aboutContent.personality.type}
              </span>
              <span className="text-neutral-400 dark:text-neutral-600 text-xs">·</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {aboutContent.personality.label}
              </span>
            </div>
          </motion.div>

          {aboutContent.paragraphs.map((para, i) => (
            <motion.div
              key={i}
              variants={item}
              className="text-[clamp(1.05rem,1.5vw,1.2rem)] leading-relaxed text-neutral-700 dark:text-neutral-300"
            >
              <Markdown components={markdownComponents}>{para}</Markdown>
            </motion.div>
          ))}

          {/* Quote */}
          <motion.blockquote
            variants={item}
            className="pl-5 border-l-2 border-amber-400 dark:border-amber-500 mt-4"
          >
            <p className="text-base md:text-lg italic text-neutral-600 dark:text-neutral-400 leading-relaxed">
              &ldquo;{aboutContent.quote}&rdquo;
            </p>
          </motion.blockquote>
        </div>
      </motion.div>
    </section>
  );
}
