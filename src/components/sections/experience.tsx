"use client";

import { motion } from "framer-motion";
import { experiences } from "@/data";

export function Experience() {
  return (
    <section
      id="experience"
      className="py-28 bg-neutral-50 dark:bg-black relative overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-400/5 dark:bg-amber-500/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-6 mx-auto relative">
        <div className="mb-20 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-amber-600 dark:text-amber-400/80 tracking-[0.3em] uppercase mb-4 block"
          >
            Career
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight"
          >
            Experience
          </motion.h2>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative">
          {/* Vertical Line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-neutral-300 dark:via-neutral-800 to-transparent -translate-x-1/2 hidden md:block" />

          {experiences.map((exp, index) => (
            <motion.div
              key={exp.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative flex flex-col md:flex-row gap-8 ${index % 2 === 0 ? "md:flex-row-reverse" : ""
                }`}
            >
              {/* Timeline Dot */}
              <div className="absolute left-0 md:left-1/2 w-3 h-3 bg-amber-500 dark:bg-amber-400 rounded-full -translate-x-1/2 mt-2 hidden md:block ring-4 ring-neutral-50 dark:ring-black shadow-lg shadow-amber-500/20" />

              {/* Content */}
              <div className="flex-1">
                <div
                  className={`p-6 rounded-2xl glass hover:border-amber-400/30 dark:hover:border-amber-500/20 glass-hover transition-all duration-500 shadow-sm ${index % 2 === 0 ? "md:text-left" : "md:text-right"
                    }`}
                >
                  <div className="flex flex-col gap-1 mb-4">
                    <span className="text-xs text-amber-600 dark:text-amber-400/70 font-mono">{exp.period}</span>
                    <h3 className="text-xl font-semibold text-neutral-900 dark:text-white">{exp.role}</h3>
                    <div className="text-neutral-500 dark:text-neutral-400 font-medium">{exp.company}</div>
                  </div>
                  <ul
                    className={`space-y-2 text-neutral-600 dark:text-neutral-500 text-sm ${index % 2 === 0
                      ? "md:pl-0"
                      : "md:pl-0"
                      }`}
                  >
                    {exp.description.map((item, i) => (
                      <li key={i} className="leading-relaxed flex items-start gap-2">
                        <span className="text-amber-500/70 dark:text-amber-500/50 mt-1.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Empty space for alternate side */}
              <div className="flex-1 hidden md:block" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
