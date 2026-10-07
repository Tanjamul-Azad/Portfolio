"use client";

import { useId, useMemo, useState } from "react";
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

function ExperienceRow({
  exp,
  index,
  open,
  onToggle,
  isRouteTransitioning,
}: {
  exp: Experience;
  index: number;
  open: boolean;
  onToggle: () => void;
  isRouteTransitioning: boolean;
}) {
  const panelId = useId();
  const tech = exp.technologies ?? [];

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
      className={cn("group transition-colors", open && "bg-surface-2/40")}
    >
      <h3>
        {/* Collapsed, a role is one compact row: when and where, the title,
            and its stack on a single line. On a phone those stack under a
            top line that carries the toggle; from md up the dates sit in a
            left column like a résumé. */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-1.5 px-4 py-4 text-left outline-none transition-colors hover:bg-surface-2/50 focus-visible:bg-surface-2/50 sm:px-6 sm:py-5 md:grid-cols-[11rem_minmax(0,1fr)_auto] md:gap-x-8"
        >
          <span className="col-start-1 row-start-1 flex min-w-0 flex-wrap items-center gap-x-2.5 gap-y-1 md:flex-col md:items-start md:gap-1">
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground">
              {exp.period}
            </span>
            <span aria-hidden="true" className="h-1 w-1 rounded-full bg-line-strong md:hidden" />
            <span className="truncate text-[13px] font-medium text-accent md:max-w-full">{exp.company}</span>
          </span>

          <span className="col-span-2 row-start-2 min-w-0 md:col-span-1 md:col-start-2 md:row-start-1">
            <span className="block text-base font-semibold leading-snug tracking-[-0.02em] text-foreground sm:text-lg">
              {exp.role}
            </span>
            {tech.length > 0 && (
              <span
                // The full stack shows as chips once open, so the one-line
                // preview steps out of the way rather than leaving a gap.
                className={cn("mt-1 truncate font-mono text-[11px] text-muted-foreground", open ? "hidden" : "block")}
              >
                {tech.join(" / ")}
              </span>
            )}
          </span>

          <span
            aria-hidden="true"
            className="col-start-2 row-start-1 flex h-9 w-9 items-center justify-center justify-self-end rounded-full border border-line text-muted-foreground transition-all duration-300 group-hover:border-line-strong group-hover:text-foreground md:col-start-3"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
          </span>
        </button>
      </h3>

      {/* Height animates through grid rows, so nothing is measured in JS.
          Collapsed content is inert, so it is skipped by keyboard and
          screen readers. */}
      <div
        id={panelId}
        role="region"
        aria-label={`${exp.role}, ${exp.company}`}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-5 sm:px-6 sm:pb-6 md:pl-[calc(11rem+3.5rem)] md:pr-20">
            <ul className="space-y-2.5">
              {exp.description.map((item, i) => (
                <li
                  key={`${exp.id}-${i}`}
                  className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground sm:text-[15px]"
                >
                  <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-amber-500" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            {tech.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-1.5">
                {tech.map((t) => (
                  <span key={t} className="chip">{t}</span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function Experience() {
  const { isRouteTransitioning } = useRouteTransitioning();
  // The most recent role starts open, so it is obvious the rows expand.
  const [openId, setOpenId] = useState<string | null>(experiences[0]?.id ?? null);

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

        <ol className="surface divide-y divide-line overflow-hidden">
          {experiences.map((exp, index) => (
            <ExperienceRow
              key={exp.id}
              exp={exp}
              index={index}
              open={openId === exp.id}
              onToggle={() => setOpenId((cur) => (cur === exp.id ? null : exp.id))}
              isRouteTransitioning={isRouteTransitioning}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
