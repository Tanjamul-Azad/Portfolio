"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { experiences } from "@/data";
import type { Experience } from "@/types";
import { MOTION_TOKENS } from "@/lib";
import { SectionHeading } from "@/components/common";
import { useRouteTransitioning } from "@/components/providers/page-transition";
import { cn } from "@/lib/utils";

function getPeriodRange(period: string): { start: number; end: number } | null {
  const matches = period.match(/\d{4}/g);
  if (!matches || matches.length === 0) return null;

  const start = Number(matches[0]);
  const end = /present|now|ongoing/i.test(period)
    ? new Date().getFullYear()
    : Number(matches[matches.length - 1]);

  if (Number.isNaN(start) || Number.isNaN(end) || end < start) return null;
  return { start, end };
}

/** Bullets shown on a phone before "show more"; desktop always shows all. */
const MOBILE_BULLETS = 2;

function ExperienceRow({
  exp,
  index,
  isRouteTransitioning,
}: {
  exp: Experience;
  index: number;
  isRouteTransitioning: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const hiddenOnMobile = Math.max(0, exp.description.length - MOBILE_BULLETS);

  return (
    <motion.li
      initial={{ opacity: 0, y: 16 }}
      whileInView={isRouteTransitioning ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: MOTION_TOKENS.duration.slow,
        delay: Math.min(index, 3) * MOTION_TOKENS.stagger.tight,
        ease: MOTION_TOKENS.easing.premium,
      }}
      className="group grid gap-3 border-t border-line py-6 first:border-t-0 first:pt-0 sm:py-8 md:grid-cols-[13rem_minmax(0,1fr)] md:gap-10"
    >
      {/* When + where. One mono line on a phone, a left column on desktop. */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 md:flex-col md:items-start md:gap-2">
        <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
          {exp.period}
        </span>
        <span aria-hidden="true" className="h-1 w-1 rounded-full bg-line-strong md:hidden" />
        <span className="text-[13px] font-medium text-accent">{exp.company}</span>
      </div>

      <div className="min-w-0">
        <h3 className="text-lg font-semibold leading-snug tracking-[-0.02em] text-foreground sm:text-xl">
          {exp.role}
        </h3>

        <ul className="mt-3 space-y-2">
          {exp.description.map((item, i) => (
            <li
              key={`${exp.id}-${i}`}
              className={cn(
                "flex items-start gap-3 text-sm leading-relaxed text-muted-foreground",
                i >= MOBILE_BULLETS && !expanded && "max-sm:hidden"
              )}
            >
              <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-line-strong transition-colors duration-300 group-hover:bg-amber-500" />
              <span>{item}</span>
            </li>
          ))}
        </ul>

        {hiddenOnMobile > 0 && (
          <button
            type="button"
            onClick={() => setExpanded((v) => !v)}
            aria-expanded={expanded}
            className="mt-2 inline-flex min-h-11 items-center gap-1 text-[13px] font-medium text-foreground sm:hidden"
          >
            {expanded ? "Show less" : `Show ${hiddenOnMobile} more`}
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", expanded && "rotate-180")} />
          </button>
        )}

        {!!exp.technologies?.length && (
          <p className="mt-4 font-mono text-[11px] leading-relaxed text-muted-foreground">
            {exp.technologies.join("  /  ")}
          </p>
        )}
      </div>
    </motion.li>
  );
}

export function Experience() {
  const { isRouteTransitioning } = useRouteTransitioning();

  const snapshotStats = useMemo(() => {
    const roleCount = experiences.length;
    const uniqueTechnologies = new Set(experiences.flatMap((exp) => exp.technologies ?? [])).size;

    // Count the calendar span actually worked (earliest start → latest end),
    // so overlapping concurrent projects are not double-counted.
    const ranges = experiences
      .map((exp) => getPeriodRange(exp.period))
      .filter((range): range is { start: number; end: number } => range !== null);

    const totalYears = ranges.length
      ? Math.max(...ranges.map((r) => r.end)) - Math.min(...ranges.map((r) => r.start)) + 1
      : 0;

    return [
      { label: "Years", value: `${Math.max(1, totalYears)}` },
      { label: "Roles", value: `${roleCount}` },
      { label: "Skills", value: `${uniqueTechnologies}+` },
    ];
  }, []);

  return (
    <section id="experience" className="scroll-section section-y relative">
      <div className="shell">
        <SectionHeading
          index="06"
          eyebrow="Experience"
          title={
            <>
              Where I&apos;ve <em className="accent-serif">shipped</em>
            </>
          }
          action={
            <dl className="grid grid-cols-3 divide-x divide-line rounded-2xl border border-line bg-surface/60 md:w-80">
              {snapshotStats.map((stat) => (
                <div key={stat.label} className="flex flex-col gap-0.5 px-4 py-3 text-left">
                  <dt className="order-2 text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
                    {stat.label}
                  </dt>
                  <dd className="display order-1 text-2xl text-foreground">{stat.value}</dd>
                </div>
              ))}
            </dl>
          }
        />

        <ol className="surface px-5 py-6 sm:px-8 sm:py-8">
          {experiences.map((exp, index) => (
            <ExperienceRow
              key={exp.id}
              exp={exp}
              index={index}
              isRouteTransitioning={isRouteTransitioning}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
