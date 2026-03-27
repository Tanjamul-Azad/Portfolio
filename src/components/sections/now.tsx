"use client";

import { motion } from "framer-motion";
import { Rocket, Microscope, Search } from "lucide-react";
import { nowItems } from "@/data";

const categoryConfig = {
  building: {
    icon: Rocket,
    title: "Currently Building",
  },
  learning: {
    icon: Microscope,
    title: "Active Research",
  },
  looking: {
    icon: Search,
    title: "Looking For",
  },
};

export function Now() {
  return (
    <section id="now" className="scroll-section py-24 bg-white dark:bg-neutral-950 border-y border-neutral-200 dark:border-neutral-800">
      <div className="container max-w-5xl px-6 mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <span className="text-sm text-neutral-500 dark:text-neutral-400 tracking-[0.16em] uppercase font-medium">
            What I'm Focused On
          </span>
          <h2 className="mt-4 text-4xl md:text-5xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight">
            Current Priorities
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-4 text-lg text-neutral-600 dark:text-neutral-400"
          >
            A concise snapshot of what I am building, learning, and open to.
          </motion.p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {nowItems.map((item, categoryIndex) => {
            const config = categoryConfig[item.category];
            const Icon = config.icon;

            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                whileHover={{ y: -10, scale: 1.015 }}
                viewport={{ once: true }}
                transition={{ duration: 0.45, delay: categoryIndex * 0.08 }}
                className="group relative"
              >
                <div className="spotlight-surface h-full p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900 transition-all duration-300 hover:border-amber-400/45 dark:hover:border-amber-500/30 hover:shadow-2xl hover:shadow-amber-500/12 dark:hover:shadow-black/40">
                  <div className="absolute inset-x-6 top-0 h-px bg-linear-to-r from-transparent via-amber-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="spotlight-content">
                    <div className="w-12 h-12 mb-5 rounded-lg bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                      <Icon className="w-6 h-6 text-white dark:text-neutral-900" />
                    </div>

                    <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-white">
                      {config.title}
                    </h3>

                    <div className="space-y-3">
                      {item.items.map((text, idx) => (
                        <motion.div
                          key={idx}
                          initial={{ opacity: 0, y: 8 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: categoryIndex * 0.08 + idx * 0.04 }}
                          className="flex items-start gap-3 text-neutral-700 dark:text-neutral-300 transition-transform duration-300 group-hover:translate-x-0.5"
                        >
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-neutral-500 transition-colors duration-300 group-hover:bg-amber-500" />
                          <p className="text-sm leading-relaxed flex-1">{text}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
