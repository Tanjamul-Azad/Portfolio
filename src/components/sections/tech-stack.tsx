"use client";

import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { techStack } from "@/data";
import { TechOrbit } from "@/components/effects";

export function TechStack() {
  return (
    <section className="py-24 relative border-y border-neutral-200 dark:border-neutral-800/50 bg-neutral-100/50 dark:bg-neutral-950/50 overflow-hidden">
      <TechOrbit />
      <div className="container px-6 mx-auto relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:max-w-sm text-center lg:text-left"
          >
            <span className="text-xs text-amber-600 dark:text-amber-400/70 tracking-[0.2em] uppercase mb-2 block">
              Tech Stack
            </span>
            <h3 className="text-2xl font-semibold font-heading mb-3 text-neutral-900 dark:text-white">
              Tools I Work With
            </h3>
            <p className="text-neutral-500 text-sm leading-relaxed">
              Modern technologies for building fast, scalable applications.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center lg:justify-end gap-2"
          >
            <TooltipProvider delayDuration={100}>
              {techStack.map((tech, index) => (
                <Tooltip key={tech.name}>
                  <TooltipTrigger asChild>
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-2 px-4 py-2.5 bg-white/50 dark:bg-neutral-900/50 backdrop-blur-md rounded-full border border-neutral-200 dark:border-neutral-800/50 hover:border-amber-400/50 dark:hover:border-amber-500/30 hover:bg-neutral-100 dark:hover:bg-neutral-800/50 transition-all duration-300 cursor-default group"
                    >
                      <span className="text-lg group-hover:scale-110 transition-transform duration-300">{tech.icon}</span>
                      <span className="font-medium text-sm text-neutral-600 dark:text-neutral-400 group-hover:text-neutral-900 dark:group-hover:text-neutral-200 transition-colors">
                        {tech.name}
                      </span>
                    </motion.div>
                  </TooltipTrigger>
                  <TooltipContent
                    side="bottom"
                    className="text-xs bg-white dark:bg-neutral-900 text-neutral-600 dark:text-neutral-300 border-neutral-200 dark:border-neutral-800"
                  >
                    <p>{tech.description}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </TooltipProvider>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
