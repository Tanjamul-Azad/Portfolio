"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from "framer-motion";
import { experiences } from "@/data";
import type { Experience } from "@/types";

function ExperienceCard({
  exp,
  index,
  side,
}: {
  exp: Experience;
  index: number;
  side: "left" | "right";
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const mouseXProgress = useMotionValue(0);
  const mouseYProgress = useMotionValue(0);

  const springCfg = { stiffness: 220, damping: 28 };
  const rotateX = useSpring(useTransform(mouseY, [-80, 80], [7, -7]), springCfg);
  const rotateY = useSpring(useTransform(mouseX, [-120, 120], [-7, 7]), springCfg);

  function handleMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!cardRef.current) return;
    const { left, top, width, height } = cardRef.current.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;

    mouseX.set(x - width / 2);
    mouseY.set(y - height / 2);
    mouseXProgress.set(x);
    mouseYProgress.set(y);
  }

  function handleLeave() {
    mouseX.set(0);
    mouseY.set(0);
  }

  const background = useMotionTemplate`radial-gradient(400px circle at ${mouseXProgress}px ${mouseYProgress}px, rgba(245, 158, 11, 0.08), transparent 80%)`;

  return (
    <motion.div
      initial={{ opacity: 0, x: side === "left" ? -40 : 40, y: 20 }}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
      className={`flex-1 relative w-full ${side === "left" ? "md:pr-12 md:text-right" : "md:pl-12 text-left"}`}
    >
      {/* Desktop Connection line */}
      <div className={`hidden md:block absolute top-[4.5rem] w-12 h-px bg-gradient-to-r ${side === "left" ? "right-0 from-transparent to-amber-500/30" : "left-0 from-amber-500/30 to-transparent"}`} />

      {/* Mobile Connection line */}
      <div className="md:hidden absolute top-[4.5rem] -left-8 w-8 h-px bg-gradient-to-r from-amber-500/30 to-transparent" />

      <motion.div
        ref={cardRef}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        style={{ perspective: 1000 }}
        className="block w-full"
      >
        <motion.div
          style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
          className="relative w-full p-6 md:p-8 rounded-2xl bg-white/60 dark:bg-neutral-900/40 border border-neutral-200/60 dark:border-neutral-800/60 hover:border-amber-500/30 dark:hover:border-amber-400/30 transition-colors duration-300 shadow-sm hover:shadow-xl backdrop-blur-md overflow-hidden group"
        >
          {/* Spotlight Glow Effect on Hover */}
          <motion.div
            className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 hidden md:block"
            style={{ background }}
          />

          <div className="relative z-10" style={{ transform: "translateZ(30px)" }}>
            <div className={`flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2 ${side === "left" ? "md:flex-row-reverse" : ""}`}>
              <span className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 text-xs font-mono tracking-widest uppercase">
                {exp.period}
              </span>
              <div className={`w-8 h-px bg-amber-500/40 hidden md:block ${side === "left" ? "ml-auto" : "mr-auto"}`} />
            </div>

            <h3 className={`text-2xl font-bold font-heading text-neutral-900 dark:text-white mb-1 ${side === "left" ? "md:text-right" : "md:text-left"}`}>
              {exp.role}
            </h3>

            <div className={`text-sm font-medium text-amber-600 dark:text-amber-500 mb-6 ${side === "left" ? "md:text-right" : "md:text-left"}`}>
              {exp.company}
            </div>

            <ul className="space-y-3 mb-6">
              {exp.description.map((item, i) => (
                <motion.li
                  initial={{ opacity: 0, x: side === "left" ? 10 : -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  viewport={{ once: true }}
                  key={i}
                  className={`text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed flex items-start gap-3 ${side === "left" ? "md:flex-row-reverse md:text-right" : ""}`}
                >
                  <span className="text-amber-500/80 mt-1 shrink-0 text-xs">♦</span>
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>

            {exp.technologies && exp.technologies.length > 0 && (
              <div className={`flex flex-wrap gap-2 pt-5 border-t border-neutral-200 dark:border-neutral-800/80 ${side === "left" ? "md:justify-end" : "justify-start"}`}>
                {exp.technologies.map((tech) => (
                  <motion.span
                    key={tech}
                    whileHover={{ y: -2, scale: 1.05 }}
                    className="text-[11px] px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800/80 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700/80 backdrop-blur-sm cursor-default"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            )}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track scroll dynamically to draw the timeline
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathHeight = useSpring(scrollYProgress, {
    stiffness: 400,
    damping: 90,
  });

  const heightTransform = useTransform(pathHeight, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="py-24 md:py-32 bg-neutral-50 dark:bg-neutral-950 relative overflow-hidden">
      {/* Background aesthetic glow */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="mb-20 md:mb-28 text-center max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 text-xs font-mono tracking-widest uppercase mb-6"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            Career
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight"
          >
            My Experience
          </motion.h2>
        </div>

        <div className="max-w-5xl mx-auto relative" ref={containerRef}>
          {/* Main Timeline Line */}
          <div className="absolute left-6 md:left-1/2 top-4 bottom-4 w-[2px] -translate-x-1/2 bg-neutral-200 dark:bg-neutral-800">
            <motion.div
              className="absolute top-0 left-0 w-full bg-gradient-to-b from-amber-500 via-orange-500 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              style={{ height: heightTransform }}
            />
          </div>

          <div className="relative space-y-12 md:space-y-24">
            {experiences.map((exp, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={exp.id}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-0 md:gap-8 ${isEven ? "md:flex-row-reverse" : ""}`}
                >
                  {/* The Timeline Node */}
                  <div className="absolute left-6 md:left-1/2 -translate-x-1/2 z-20 flex items-center justify-center top-[4.5rem] md:top-auto">
                    <motion.div
                      style={{
                        scale: useTransform(scrollYProgress,
                          [Math.max(0, (index - 0.5) / experiences.length), Math.min(1, (index + 0.5) / experiences.length)],
                          [0.8, 1.2])
                      }}
                      className="w-5 h-5 rounded-full bg-neutral-50 dark:bg-black border-4 border-neutral-300 dark:border-neutral-700 flex items-center justify-center transition-colors duration-300"
                    >
                      <motion.div
                        style={{
                          opacity: useTransform(scrollYProgress, [Number(index) / experiences.length, (Number(index) + 0.2) / experiences.length], [0, 1])
                        }}
                        className="w-full h-full rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)] border border-amber-300"
                      />
                    </motion.div>
                  </div>

                  {/* Wrapper for side padding on mobile */}
                  <div className="w-full flex md:contents pl-16 md:pl-0">
                    <ExperienceCard exp={exp} index={index} side={isEven ? "left" : "right"} />
                    <div className="flex-1 hidden md:block" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
