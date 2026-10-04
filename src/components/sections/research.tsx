"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Code2, FileText, Target, BadgeCheck } from "lucide-react";
import { researchWorks } from "@/data";
import type { ResearchStatus, ResearchWork } from "@/types";
import { SectionHeading } from "@/components/common";
import { cn } from "@/lib/utils";

const STATUS: Record<ResearchStatus, { label: string; dot: string; text: string }> = {
  idea: { label: "Idea", dot: "bg-sky-400", text: "text-sky-700 dark:text-sky-300" },
  "in-progress": { label: "In progress", dot: "bg-amber-400", text: "text-amber-700 dark:text-amber-300" },
  "under-review": { label: "Under review", dot: "bg-violet-400", text: "text-violet-700 dark:text-violet-300" },
  accepted: { label: "Accepted", dot: "bg-emerald-400", text: "text-emerald-700 dark:text-emerald-300" },
  published: { label: "Published", dot: "bg-emerald-500", text: "text-emerald-700 dark:text-emerald-300" },
};

/** Accepted and published work has a real venue; everything earlier is a target. */
const isPlaced = (status: ResearchStatus) => status === "accepted" || status === "published";

const has = (url?: string) => !!url && url !== "#";

function ResearchCard({ work, index }: { work: ResearchWork; index: number }) {
  const status = STATUS[work.status] ?? STATUS.idea;
  const placed = isPlaced(work.status);
  const VenueIcon = placed ? BadgeCheck : Target;

  return (
    <motion.article
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.5, delay: Math.min(index, 4) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="surface group flex h-full flex-col p-5 transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong sm:p-6"
    >
      <div className="flex items-center justify-between gap-3">
        <span className={cn("inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.12em]", status.text)}>
          <span className="relative flex h-2 w-2">
            {work.status === "in-progress" && (
              <span className={cn("absolute inline-flex h-full w-full animate-ping rounded-full opacity-60 motion-reduce:hidden", status.dot)} />
            )}
            <span className={cn("relative inline-flex h-2 w-2 rounded-full", status.dot)} />
          </span>
          {status.label}
        </span>
        <span className="font-mono text-[11px] text-muted-foreground">
          {work.year || String(index + 1).padStart(2, "0")}
        </span>
      </div>

      {work.area && <p className="eyebrow mt-4 text-[10px]">{work.area}</p>}

      <h3 className="mt-1.5 text-lg font-semibold leading-snug tracking-[-0.02em] text-foreground">
        {work.title}
      </h3>

      {work.summary && (
        <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{work.summary}</p>
      )}

      {work.authors && (
        <p className="mt-3 text-xs italic text-muted-foreground">{work.authors}</p>
      )}

      {/* Venue: the line a reviewer or recruiter looks for first. */}
      <div className="mt-5 flex items-center gap-3 rounded-xl border border-line bg-surface-2/50 px-3.5 py-2.5">
        <VenueIcon className={cn("h-4 w-4 shrink-0", placed ? "text-emerald-600 dark:text-emerald-400" : "text-accent")} />
        <div className="min-w-0">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            {placed ? (work.status === "published" ? "Published in" : "Accepted at") : "Target venue"}
          </p>
          <p className="truncate text-[13px] font-medium text-foreground">{work.venue || "To be decided"}</p>
        </div>
      </div>

      <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-5">
        <div className="flex flex-wrap gap-1.5">
          {work.tags.slice(0, 3).map((tag) => (
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
    </motion.article>
  );
}

export function Research() {
  // Nothing to show is better handled by hiding the section.
  if (researchWorks.length === 0) return null;

  const order: ResearchStatus[] = ["published", "accepted", "under-review", "in-progress", "idea"];
  const works = [...researchWorks].sort((a, b) => order.indexOf(a.status) - order.indexOf(b.status));

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
          description="Published work, papers under review, and the questions I'm currently chasing — with where each is headed."
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

        <div className="grid gap-3 sm:gap-4 md:grid-cols-2">
          {works.map((work, i) => (
            <ResearchCard key={work.id} work={work} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
