"use client";

import { useMemo, useRef } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { BriefcaseBusiness, CalendarRange, CircleCheck } from "lucide-react";
import { experiences } from "@/data";
import type { Experience } from "@/types";
import { MOTION_TOKENS } from "@/lib";
import { useRouteTransitioning } from "@/components/providers/page-transition";

function getYearsFromPeriod(period: string) {
  const matches = period.match(/\d{4}/g);
  if (!matches || matches.length === 0) return 0;

  const start = Number(matches[0]);
  const end = /present/i.test(period) ? new Date().getFullYear() : Number(matches[matches.length - 1]);

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return 0;
  return end - start + 1;
}

function ExperienceCard({
  exp,
  index,
  isRouteTransitioning,
  prefersReducedMotion,
}: {
  exp: Experience;
  index: number;
  isRouteTransitioning: boolean;
  prefersReducedMotion: boolean;
}) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 22 }}
      whileInView={isRouteTransitioning ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: MOTION_TOKENS.duration.slow,
        delay: index * MOTION_TOKENS.stagger.regular,
        ease: MOTION_TOKENS.easing.premium,
      }}
      className="group relative pl-10 md:pl-12"
    >
      <motion.div
        className="absolute left-[0.4rem] top-9 h-3.5 w-3.5 rounded-full border-2 border-amber-500 bg-background shadow-[0_0_0_4px_rgba(245,158,11,0.16)]"
        animate={prefersReducedMotion ? undefined : { boxShadow: ["0 0 0 4px rgba(245,158,11,0.12)", "0 0 0 8px rgba(245,158,11,0.08)", "0 0 0 4px rgba(245,158,11,0.12)"] }}
        transition={prefersReducedMotion ? undefined : { duration: 2.8, repeat: Infinity, ease: "easeInOut", delay: index * 0.18 }}
      />

      <motion.div
        whileHover={prefersReducedMotion ? undefined : { y: -4 }}
        transition={{ type: "spring", stiffness: 280, damping: 24 }}
        className="rounded-2xl border border-neutral-200/80 dark:border-neutral-800/80 bg-white dark:bg-neutral-900 shadow-sm hover:shadow-md transition-shadow duration-300"
      >
        <div className="p-6 md:p-7">
          <div className="mb-5 h-px w-0 bg-linear-to-r from-transparent via-amber-500/65 to-transparent transition-all duration-500 group-hover:w-full" />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-neutral-600 dark:text-neutral-300">
              <CalendarRange className="h-3.5 w-3.5" />
              {exp.period}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-amber-700 dark:text-amber-300">
              <BriefcaseBusiness className="h-3.5 w-3.5" />
              {exp.company}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold font-heading text-neutral-900 dark:text-white">
            {exp.role}
          </h3>

          <ul className="mt-5 space-y-3">
            {exp.description.map((item, i) => (
              <motion.li
                key={`${exp.id}-${i}`}
                initial={{ opacity: 0, y: 8 }}
                whileInView={isRouteTransitioning ? undefined : { opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  delay: MOTION_TOKENS.duration.quick + i * MOTION_TOKENS.stagger.tight,
                  duration: MOTION_TOKENS.duration.medium,
                  ease: MOTION_TOKENS.easing.premium,
                }}
                className="flex items-start gap-3 text-sm leading-relaxed text-neutral-700 dark:text-neutral-300"
              >
                <motion.span
                  whileHover={prefersReducedMotion ? undefined : { scale: 1.08 }}
                  transition={{ duration: 0.2 }}
                  className="shrink-0 mt-0.5"
                >
                  <CircleCheck className="h-4 w-4 text-amber-500" />
                </motion.span>
                <span>{item}</span>
              </motion.li>
            ))}
          </ul>

          {!!exp.technologies?.length && (
            <div className="mt-6 pt-5 border-t border-neutral-200/80 dark:border-neutral-800/80">
              <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 mb-3">
                Technologies
              </p>
              <div className="flex flex-wrap gap-2">
                {exp.technologies.map((tech) => (
                  <motion.span
                    key={`${exp.id}-${tech}`}
                    whileHover={prefersReducedMotion ? undefined : { y: -1.5 }}
                    transition={{ duration: 0.18 }}
                    className="text-[11px] px-3 py-1 rounded-md bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </motion.article>
  );
}

export function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;
  const { isRouteTransitioning } = useRouteTransitioning();

  const snapshotStats = useMemo(() => {
    const roleCount = experiences.length;
    const uniqueTechnologies = new Set(experiences.flatMap((exp) => exp.technologies ?? [])).size;
    const totalYears = experiences.reduce((sum, exp) => sum + getYearsFromPeriod(exp.period), 0);

    return [
      { label: "Years", value: `${Math.max(1, totalYears)}+` },
      { label: "Roles", value: `${roleCount}` },
      { label: "Core Skills", value: `${uniqueTechnologies}+` },
    ];
  }, []);

  // Track scroll dynamically to draw the timeline
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const pathHeight = useSpring(scrollYProgress, {
    stiffness: 320,
    damping: 70,
    mass: 0.25,
  });

  const heightTransform = useTransform(pathHeight, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="scroll-section py-24 md:py-32 relative overflow-hidden">
      {/* Background aesthetic glow */}
      <div className="absolute top-1/2 left-1/2 w-150 h-150 bg-amber-500/5 blur-[120px] rounded-full pointer-events-none -translate-x-1/2 -translate-y-1/2" />

      <div className="container px-4 md:px-6 mx-auto relative z-10">
        <div className="mb-16 md:mb-20 text-center max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={isRouteTransitioning ? undefined : { opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-neutral-500 dark:text-neutral-400 tracking-[0.3em] uppercase mb-4 block"
          >
            Project Work
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={isRouteTransitioning ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: MOTION_TOKENS.duration.slow, ease: MOTION_TOKENS.easing.premium }}
            className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight"
          >
            Project Experience
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            whileInView={isRouteTransitioning ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: MOTION_TOKENS.duration.quick, duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
            className="mt-5 text-neutral-600 dark:text-neutral-400 leading-relaxed"
          >
            CV-aligned project timeline covering production full-stack delivery, NLP systems,
            and AI + IoT implementations.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={isRouteTransitioning ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: MOTION_TOKENS.duration.medium, delay: MOTION_TOKENS.duration.quick, ease: MOTION_TOKENS.easing.premium }}
            className="mt-8 grid grid-cols-3 gap-3"
          >
            {snapshotStats.map((stat) => (
              <motion.div
                key={stat.label}
                whileHover={prefersReducedMotion ? undefined : { y: -2 }}
                transition={{ duration: 0.18 }}
                className="rounded-xl border border-neutral-200/70 dark:border-neutral-800/80 bg-white/70 dark:bg-neutral-900/70 px-3 py-3 backdrop-blur-sm"
              >
                <div className="text-lg md:text-xl font-bold text-neutral-900 dark:text-white">{stat.value}</div>
                <div className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        <div className="max-w-4xl mx-auto relative" ref={containerRef}>
          {/* Main Timeline Line */}
          <div className="absolute left-[0.72rem] top-3 bottom-3 w-px bg-neutral-300/80 dark:bg-neutral-700/80">
            <motion.div
              className="absolute top-0 left-0 w-full bg-linear-to-b from-amber-500 via-orange-500 to-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]"
              style={{ height: heightTransform }}
            />
          </div>

          <div className="relative space-y-6 md:space-y-8">
            {experiences.map((exp, index) => (
              <ExperienceCard
                key={exp.id}
                exp={exp}
                index={index}
                isRouteTransitioning={isRouteTransitioning}
                prefersReducedMotion={prefersReducedMotion}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
