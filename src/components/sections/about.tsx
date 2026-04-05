"use client";

import { motion } from "framer-motion";
import { Brain } from "lucide-react";

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.22, 1, 0.36, 1] as any,
    },
  },
};

export function About() {
  return (
    <section
      id="about"
      className="scroll-section relative py-28 overflow-hidden"
    >
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.2 }}
        className="container max-w-3xl px-6 mx-auto"
      >
        {/* Section header */}
        <div className="text-center mb-16 space-y-3">
          <motion.span
            variants={item}
            className="block text-sm text-neutral-500 dark:text-neutral-400 tracking-[0.16em] uppercase font-medium"
          >
            Who I Am
          </motion.span>
          <motion.h2
            variants={item}
            className="text-4xl md:text-5xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight"
          >
            About Me
          </motion.h2>
        </div>

        {/* Content */}
        <div className="space-y-8">
          {/* INTP-A badge */}
          <motion.div variants={item} className="flex justify-start">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900">
              <Brain className="w-4 h-4 text-amber-500 dark:text-amber-400" />
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">INTP-A</span>
              <span className="text-neutral-400 dark:text-neutral-600 text-xs">·</span>
              <span className="text-xs text-neutral-500 dark:text-neutral-400">The Logician</span>
            </div>
          </motion.div>

          {/* Para 1 */}
          <motion.p
            variants={item}
            className="text-[clamp(1.05rem,1.5vw,1.2rem)] leading-relaxed text-neutral-700 dark:text-neutral-300"
          >
            I&apos;m a{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">Full-Stack Developer</span>{" "}
            and{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">ML Researcher</span>{" "}
            in my final year at{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">United International University</span>
            , specialising in Data Science.
          </motion.p>

          {/* Para 2 — SaaS / tools */}
          <motion.p
            variants={item}
            className="text-[clamp(1.05rem,1.5vw,1.2rem)] leading-relaxed text-neutral-700 dark:text-neutral-300"
          >
            I love building{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">SaaS products</span>{" "}
            and small, opinionated{" "}
            <span className="font-semibold text-neutral-900 dark:text-white">tools that make daily life easier</span>{" "}
            — the kind where you ship something over a weekend and it quietly solves a real annoyance. There&apos;s something deeply satisfying about compressing friction out of a workflow.
          </motion.p>

          {/* Para 3 — ML / research */}
          <motion.p
            variants={item}
            className="text-[clamp(1.05rem,1.5vw,1.2rem)] leading-relaxed text-neutral-700 dark:text-neutral-300"
          >
            Beyond that, I genuinely enjoy the overlap between building things people use and training systems that learn. I dive deep into ML research, experiment with new models, and figure out how AI can actually solve real problems — not just in theory, but in practice.
          </motion.p>

          {/* Quote */}
          <motion.blockquote
            variants={item}
            className="pl-5 border-l-2 border-amber-400 dark:border-amber-500 mt-4"
          >
            <p className="text-base md:text-lg italic text-neutral-600 dark:text-neutral-400 leading-relaxed">
              &ldquo;Same curiosity that got me through a national Math &amp; Physics
              Olympiad — just pointed at neural networks now.&rdquo;
            </p>
          </motion.blockquote>
        </div>
      </motion.div>
    </section>
  );
}
