"use client";

import { useId, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, BadgeCheck, ChevronDown, Code2, FileText, Target } from "lucide-react";
import { researchWorks } from "@/data";
import type { ResearchStatus, ResearchWork } from "@/types";
import { SectionHeading } from "@/components/common";
import { cn } from "@/lib/utils";

const STATUS: Record<ResearchStatus, { label: string; dot: string; text: string }> = {
  idea: { label: "Idea", dot: "bg-sky-400", text: "text-sky-700 dark:text-sky-300" },
  "in-progress": { label: "Research in progress", dot: "bg-amber-400", text: "text-amber-700 dark:text-amber-300" },
  "in-preparation": { label: "In preparation", dot: "bg-orange-400", text: "text-orange-700 dark:text-orange-300" },
  "under-review": { label: "Under review", dot: "bg-violet-400", text: "text-violet-700 dark:text-violet-300" },
  accepted: { label: "Accepted", dot: "bg-emerald-400", text: "text-emerald-700 dark:text-emerald-300" },
  published: { label: "Published", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300" },
};

/** The pipeline a paper moves through, for the stepper in the expanded row. */
const PIPELINE: { label: string; statuses: ResearchStatus[] }[] = [
  { label: "Idea", statuses: ["idea"] },
  { label: "Research", statuses: ["in-progress"] },
  { label: "Writing", statuses: ["in-preparation"] },
  { label: "Review", statuses: ["under-review"] },
  { label: "Published", statuses: ["accepted", "published"] },
];

const stageOf = (status: ResearchStatus) =>
  Math.max(0, PIPELINE.findIndex((step) => step.statuses.includes(status)));

/** Accepted and published work has a real venue; everything earlier is a target. */
const isPlaced = (status: ResearchStatus) => status === "accepted" || status === "published";

const has = (url?: string) => !!url && url !== "#";

function StatusPill({ status, className }: { status: ResearchStatus; className?: string }) {
  const s = STATUS[status] ?? STATUS.idea;
  return (
    <span className={cn("inline-flex items-center gap-1.5 text-[11px] font-semibold", s.text, className)}>
      <span className="relative flex h-1.5 w-1.5">
        {status === "in-progress" && (
          <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden", s.dot)} />
        )}
        <span className={cn("relative inline-flex h-1.5 w-1.5 rounded-full", s.dot)} />
      </span>
      {s.label}
    </span>
  );
}

function Stepper({ status }: { status: ResearchStatus }) {
  const current = stageOf(status);
  return (
    <ol className="grid grid-cols-5 gap-1.5" aria-label={`Stage: ${PIPELINE[current].label}`}>
      {PIPELINE.map((step, i) => (
        <li key={step.label} className="flex flex-col gap-1.5">
          <span
            className={cn(
              "h-1 rounded-full",
              i < current && "bg-foreground/60",
              i > current && "bg-line-strong"
            )}
            style={i === current ? { backgroundColor: "var(--accent-fg)" } : undefined}
          />
          <span
            className={cn(
              "truncate text-[11px] font-medium sm:text-[10px] sm:uppercase sm:tracking-[0.08em]",
              i === current ? "text-foreground" : "text-muted-foreground"
            )}
            aria-current={i === current ? "step" : undefined}
          >
            {step.label}
          </span>
        </li>
      ))}
    </ol>
  );
}

function ResearchRow({
  work,
  index,
  open,
  onToggle,
}: {
  work: ResearchWork;
  index: number;
  open: boolean;
  onToggle: () => void;
}) {
  const panelId = useId();
  const placed = isPlaced(work.status);
  const VenueIcon = placed ? BadgeCheck : Target;
  const venueLabel = placed ? (work.status === "published" ? "Published in" : "Accepted at") : "Target";

  return (
    <motion.li
      initial={{ opacity: 0, y: 12 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ duration: 0.45, delay: Math.min(index, 4) * 0.05, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group transition-colors", open && "bg-surface-2/40")}
    >
      <h3>
        {/* One row, two arrangements: on a phone the badge and chevron share
            the top line with the title and venue stacked under them; from md
            up it reads across like a table — badge, title, venue, toggle. */}
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={panelId}
          className="grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-x-4 gap-y-2.5 px-4 py-4 text-left outline-none transition-colors hover:bg-surface-2/50 focus-visible:bg-surface-2/50 sm:px-6 sm:py-5 md:grid-cols-[2.5rem_minmax(0,1fr)_minmax(0,17rem)_auto] md:gap-x-6"
        >
          <span className="col-start-1 row-start-1 flex min-w-0 items-center gap-3">
            <span className="inline-flex h-7 shrink-0 items-center rounded-lg border border-line-strong bg-background px-2.5 font-mono text-[11px] font-semibold tracking-[0.06em] text-foreground">
              {work.acronym || String(index + 1).padStart(2, "0")}
            </span>
            <StatusPill status={work.status} className="truncate md:hidden" />
          </span>

          <span className="col-span-2 row-start-2 min-w-0 md:col-span-1 md:col-start-2 md:row-start-1">
            <span className="block text-[15px] font-semibold leading-snug tracking-[-0.015em] text-foreground sm:text-base">
              {work.title}
            </span>
            {work.area && (
              <span className="mt-1 hidden truncate text-xs text-muted-foreground md:block">{work.area}</span>
            )}
          </span>

          <span className="col-span-2 row-start-3 flex min-w-0 items-start gap-2 md:col-span-1 md:col-start-3 md:row-start-1 md:flex-col md:gap-1">
            <StatusPill status={work.status} className="hidden md:inline-flex" />
            {/* The venue wraps rather than truncating — it is the line people
                scan this list for. */}
            <span className="flex min-w-0 items-start gap-1.5 text-[13px] leading-snug text-muted-foreground">
              <VenueIcon className={cn("mt-px h-3.5 w-3.5 shrink-0", placed ? "text-emerald-600 dark:text-emerald-400" : "text-accent")} />
              <span className="min-w-0">
                {venueLabel}: <span className="font-medium text-foreground">{work.venue || "To be decided"}</span>
              </span>
            </span>
          </span>

          <span
            aria-hidden="true"
            className="col-start-2 row-start-1 flex h-9 w-9 items-center justify-center justify-self-end rounded-full border border-line text-muted-foreground transition-all duration-300 group-hover:border-line-strong group-hover:text-foreground md:col-start-4"
          >
            <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", open && "rotate-180")} />
          </span>
        </button>
      </h3>

      {/* Height animates through grid rows, so the content keeps its natural
          height and nothing is measured in JS. Collapsed content is inert. */}
      <div
        id={panelId}
        role="region"
        aria-label={`${work.acronym ? `${work.acronym}: ` : ""}${work.title}`}
        inert={!open}
        className={cn(
          "grid transition-[grid-template-rows] duration-400 ease-[cubic-bezier(0.22,1,0.36,1)]",
          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="overflow-hidden">
          <div className="px-4 pb-5 sm:px-6 sm:pb-6 md:pl-[calc(2.5rem+3rem)] md:pr-20">
            {work.area && <p className="eyebrow mb-2 text-[10px] md:hidden">{work.area}</p>}

            <p className="max-w-2xl text-[15px] leading-relaxed text-muted-foreground">{work.summary}</p>

            {work.authors && (
              <p className="mt-2 text-xs italic text-muted-foreground">{work.authors}</p>
            )}

            <div className="mt-5 max-w-md">
              <Stepper status={work.status} />
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex flex-wrap gap-1.5">
                {work.tags.map((tag) => (
                  <span key={tag} className="chip">{tag}</span>
                ))}
              </div>

              {(has(work.paperUrl) || has(work.codeUrl)) && (
                <div className="flex items-center gap-2">
                  {has(work.paperUrl) && (
                    <a
                      href={work.paperUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex h-11 items-center gap-1.5 rounded-full bg-foreground px-4 text-[13px] font-semibold text-background sm:h-9"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      Paper
                      <ArrowUpRight className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {has(work.codeUrl) && (
                    <a
                      href={work.codeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Code for ${work.title}`}
                      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line bg-surface text-foreground transition-colors hover:bg-surface-2 sm:h-9 sm:w-9"
                    >
                      <Code2 className="h-4 w-4" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
}

export function Research() {
  // The first entry starts open so it is obvious the rows expand.
  const [openId, setOpenId] = useState<string | null>(researchWorks[0]?.id ?? null);

  // Nothing to show is better handled by hiding the section.
  if (researchWorks.length === 0) return null;

  const order: ResearchStatus[] = ["published", "accepted", "under-review", "in-preparation", "in-progress", "idea"];
  const counts = order
    .map((s) => ({ status: s, count: researchWorks.filter((w) => w.status === s).length }))
    .filter((c) => c.count > 0);

  return (
    <section id="research" className="scroll-section section-y relative">
      <div className="shell">
        <SectionHeading
          index="05"
          eyebrow="Research"
          title={
            <>
              Research &amp; <em className="accent-serif">papers</em>
            </>
          }
          description="Papers in progress and where each is headed. Open a project for the summary and its stage."
          action={
            <ul className="flex flex-wrap gap-1.5 md:justify-end">
              {counts.map(({ status, count }) => (
                <li key={status} className="chip">
                  <span className={cn("h-1.5 w-1.5 rounded-full", STATUS[status].dot)} />
                  {STATUS[status].label}
                  <span className="font-mono text-foreground">{count}</span>
                </li>
              ))}
            </ul>
          }
        />

        <ol className="surface divide-y divide-line overflow-hidden">
          {researchWorks.map((work, i) => (
            <ResearchRow
              key={work.id}
              work={work}
              index={i}
              open={openId === work.id}
              onToggle={() => setOpenId((cur) => (cur === work.id ? null : work.id))}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
