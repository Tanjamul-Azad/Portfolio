"use client";

import { motion } from "framer-motion";
import { techStack } from "@/data";
import { CodeFlowPattern } from "@/components/ui/code-flow-pattern";
import { Sparkles } from "lucide-react";

export function TechStackCinematic() {
  return (
    <section className="scroll-section relative min-h-screen flex items-center bg-linear-to-b from-neutral-50 via-white to-neutral-100 dark:from-black dark:via-neutral-950 dark:to-black border-y border-neutral-200 dark:border-neutral-800/50 overflow-hidden">
      {/* Wow Factor: Animated code flow background */}
      <CodeFlowPattern
        className="opacity-20 dark:opacity-15 text-blue-500 dark:text-purple-400"
        numElements={35}
        flowSpeed={12}
        maxOpacity={0.2}
      />

      {/* Wow Factor: Orbiting gradient spheres */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] pointer-events-none"
      >
        <div className="absolute top-0 left-1/2 w-32 h-32 bg-blue-500/20 dark:bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/2 w-40 h-40 bg-purple-500/20 dark:bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 right-0 w-36 h-36 bg-amber-500/20 dark:bg-amber-500/10 rounded-full blur-3xl" />
      </motion.div>

      <div className="container max-w-6xl px-6 mx-auto relative z-10">
        {/* Wow Factor: Typography explosion effect */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-20"
        >
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span className="text-sm font-mono text-amber-600 dark:text-amber-400 tracking-[0.3em] uppercase">
              Tech Stack
            </span>
          </motion.div>

          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold font-heading leading-[0.9] mb-8">
            <motion.span
              initial={{ opacity: 0, rotateX: 90 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="block text-neutral-900 dark:text-white"
            >
              Built with
            </motion.span>
            <motion.span
              initial={{ opacity: 0, rotateX: 90 }}
              whileInView={{ opacity: 1, rotateX: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 via-purple-600 to-amber-600 dark:from-blue-400 dark:via-purple-400 dark:to-amber-400"
            >
              precision
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-xl text-neutral-600 dark:text-neutral-400"
          >
            Tools that power exceptional experiences
          </motion.p>
        </motion.div>

        {/* Wow Factor: Floating tech badges with parallax */}
        <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6 max-w-4xl mx-auto">
          {techStack.map((tech, index) => {
            const delay = 0.8 + index * 0.05;

            return (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, scale: 0, rotateY: -180 }}
                whileInView={{ opacity: 1, scale: 1, rotateY: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay,
                  duration: 0.6,
                  type: "spring",
                  stiffness: 200,
                }}
                whileHover={{
                  scale: 1.15,
                  y: -10,
                  rotateY: 10,
                  rotateX: 5,
                }}
                className="group relative perspective-1000"
              >
                {/* Glow effect on hover */}
                <motion.div
                  className="absolute -inset-4 bg-linear-to-r from-blue-500/20 via-purple-500/20 to-amber-500/20 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  animate={{
                    rotate: [0, 360],
                  }}
                  transition={{
                    duration: 8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                {/* Glassmorphism badge */}
                <div className="relative flex items-center gap-3 px-5 py-4 bg-white/70 dark:bg-neutral-900/70 backdrop-blur-2xl rounded-2xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-xl hover:shadow-2xl transition-all duration-500 hover:border-amber-400/50 dark:hover:border-amber-500/30">
                  {/* Animated icon with float */}
                  <motion.span
                    animate={{
                      y: [0, -5, 0],
                      rotate: [0, 5, -5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                    className="text-3xl"
                  >
                    {tech.icon}
                  </motion.span>

                  {/* Text */}
                  <div className="flex flex-col">
                    <span className="font-semibold text-sm text-neutral-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r group-hover:from-blue-600 group-hover:to-purple-600 transition-all duration-300">
                      {tech.name}
                    </span>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400">
                      {tech.description}
                    </span>
                  </div>

                  {/* Shine effect */}
                  <motion.div
                    className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent rounded-2xl opacity-0 group-hover:opacity-100"
                    animate={{
                      x: ["-100%", "200%"],
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
                  />
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom tagline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 1.5 }}
          className="mt-20 text-center"
        >
          <p className="text-sm text-neutral-500 dark:text-neutral-400 italic">
            <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 font-semibold">
              Always learning
            </span>
            , always evolving
          </p>
        </motion.div>
      </div>

      {/* Section separator */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-linear-to-t from-black/5 to-transparent dark:from-black/30 pointer-events-none" />
    </section>
  );
}
