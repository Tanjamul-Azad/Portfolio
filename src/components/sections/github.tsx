"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Github, RefreshCw } from "lucide-react";
import { SectionHeading } from "@/components/common";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";
import type { ContributionDay, GitHubActivity } from "@/types/github";

const activityColors = [
  "bg-[#ebe8e2] ring-black/[0.035] dark:bg-[#211e19] dark:ring-white/[0.035]",
  "bg-[#d5ad71] ring-[#b18a52]/20 dark:bg-[#51391e] dark:ring-[#8d6535]/20",
  "bg-[#b77d36] ring-[#925d25]/20 dark:bg-[#805628] dark:ring-[#a7783d]/20",
  "bg-[#8e551c] ring-[#754316]/20 dark:bg-[#af762f] dark:ring-[#c88c42]/20",
  "bg-[#603711] ring-[#48280c]/20 dark:bg-[#d49a44] dark:ring-[#e2b060]/25",
];
const formatNumber = (number: number) => number.toLocaleString("en-US");
const dateLabel = (date: string) => new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
  month: "long", day: "numeric", year: "numeric", timeZone: "UTC",
});
const dayLabel = (day: ContributionDay) => `${formatNumber(day.count)} ${day.count === 1 ? "contribution" : "contributions"} on ${dateLabel(day.date)}`;

function ActivityLegend({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-1.5 text-[10px] text-muted-foreground", className)} aria-label="Contribution intensity: less to more">
      <span className="mr-1">Less</span>
      {activityColors.map((color, index) => <span key={index} aria-hidden="true" className={cn("h-2.5 w-2.5 rounded-[2px] ring-1 ring-inset", color)} />)}
      <span className="ml-1">More</span>
    </div>
  );
}

function ContributionCalendar({ days }: { days: ContributionDay[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(days.length - 1);
  const [inspectedDay, setInspectedDay] = useState<ContributionDay | null>(null);
  const offset = new Date(`${days[0].date}T00:00:00Z`).getUTCDay();
  const weekCount = Math.ceil((offset + days.length) / 7);
  const monthLabels = new Map<number, string>();
  days.forEach((day, index) => {
    if (index === 0 || day.date.endsWith("-01")) {
      monthLabels.set(Math.floor((index + offset) / 7), new Date(`${day.date}T00:00:00Z`).toLocaleDateString("en-US", { month: "short", timeZone: "UTC" }));
    }
  });

  useEffect(() => {
    // Start with recent activity visible on small screens.
    const element = scrollRef.current;
    if (element) element.scrollLeft = element.scrollWidth;
  }, []);

  function navigate(event: KeyboardEvent<HTMLDivElement>) {
    const steps: Record<string, number> = { ArrowRight: 7, ArrowLeft: -7, ArrowDown: 1, ArrowUp: -1 };
    let next = activeIndex;
    if (event.key in steps) next += steps[event.key];
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = days.length - 1;
    else return;
    event.preventDefault();
    next = Math.max(0, Math.min(days.length - 1, next));
    setActiveIndex(next);
    event.currentTarget.querySelector<HTMLButtonElement>(`[data-day-index="${next}"]`)?.focus();
  }

  return (
    <>
      <div className="mb-4 flex min-h-4 items-center justify-between gap-3">
        <p className="text-[11px] text-muted-foreground">{inspectedDay ? dayLabel(inspectedDay) : "Contributions over the past year"}</p>
        <ActivityLegend className="hidden shrink-0 sm:flex" />
      </div>

      <div ref={scrollRef} className="overflow-x-auto pb-3 [scrollbar-color:var(--line-strong)_transparent] [scrollbar-width:thin]" aria-label="GitHub contribution calendar. Use arrow keys to explore days, Home for the first day, and End for the latest day.">
        <div className="min-w-[760px] pr-1">
          <div className="mb-2 ml-9 grid h-4 gap-1 text-[10px] text-muted-foreground" style={{ gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))` }} aria-hidden="true">
            {Array.from(monthLabels, ([column, month]) => <span key={column} className="overflow-visible" style={{ gridColumn: column + 1 }}>{month}</span>)}
          </div>
          <div className="flex gap-3">
            <div aria-hidden="true" className="grid w-6 shrink-0 grid-rows-[repeat(7,12px)] gap-1 text-[10px] leading-3 text-muted-foreground">
              <span className="row-start-2">Mon</span><span className="row-start-4">Wed</span><span className="row-start-6">Fri</span>
            </div>
            <div className="grid flex-1 grid-flow-col grid-rows-[repeat(7,12px)] gap-1" style={{ gridTemplateColumns: `repeat(${weekCount}, minmax(0, 1fr))` }} onKeyDown={navigate} onMouseLeave={() => setInspectedDay(null)}>
              {Array.from({ length: offset }, (_, index) => <span key={`padding-${index}`} aria-hidden="true" />)}
              {days.map((day, index) => (
                <button
                  key={day.date}
                  type="button"
                  data-day-index={index}
                  tabIndex={index === activeIndex ? 0 : -1}
                  aria-label={dayLabel(day)}
                  title={dayLabel(day)}
                  onMouseEnter={() => setInspectedDay(day)}
                  onFocus={() => { setActiveIndex(index); setInspectedDay(day); }}
                  onBlur={() => setInspectedDay(null)}
                  onClick={() => { setActiveIndex(index); setInspectedDay(day); }}
                  className={cn("h-3 w-full rounded-[3px] ring-1 ring-inset transition-[filter] hover:brightness-125 focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:ring-offset-2 focus-visible:ring-offset-surface", activityColors[day.level])}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-1 flex flex-wrap items-center justify-between gap-2 sm:hidden">
        <p className="text-[10px] text-muted-foreground">Swipe to explore</p>
        <ActivityLegend />
      </div>
    </>
  );
}

export function GitHub() {
  const [data, setData] = useState<GitHubActivity | null>(null);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    let lastRequested = 0;
    async function load() {
      lastRequested = Date.now();
      try {
        const response = await fetch("/api/github", { signal: controller.signal, cache: "no-store" });
        if (!response.ok) throw new Error("GitHub activity unavailable");
        const activity: GitHubActivity = await response.json();
        if (!controller.signal.aborted) { setData(activity); setError(false); }
      } catch {
        if (!controller.signal.aborted) setError(true);
      }
    }
    function refresh() {
      if (document.visibilityState === "visible" && Date.now() - lastRequested >= 900_000) void load();
    }
    setError(false);
    void load();
    const interval = window.setInterval(refresh, 900_000);
    document.addEventListener("visibilitychange", refresh);
    return () => { controller.abort(); window.clearInterval(interval); document.removeEventListener("visibilitychange", refresh); };
  }, [attempt]);

  const stats = [
    { label: "contributions", value: data?.calendar?.total },
    { label: "public repos", value: data?.repositories },
  ];

  return (
    <section id="github" aria-labelledby="github-heading" className="scroll-section relative py-10 sm:py-14 lg:py-16">
      <div className="shell">
        <SectionHeading index="09" eyebrow="Open Source" id="github-heading" title="GitHub activity" description="Code, contributions, and work in progress." className="mb-5 sm:mb-6" />

        <div className="surface overflow-hidden border-[#9a713d]/20 bg-[linear-gradient(135deg,#fffdf9,#f7f3eb)] dark:border-[#b2874b]/15 dark:bg-[linear-gradient(135deg,#191610,#11110f)]" aria-busy={!data && !error}>
          <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-[#9a713d]/15 px-4 py-3 sm:px-6 dark:border-[#b2874b]/10">
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-8 items-center gap-2.5 text-sm font-semibold text-foreground transition-colors hover:text-accent">
              <Github className="h-4 w-4" aria-hidden="true" />
              @{data?.username ?? new URL(siteConfig.links.github).pathname.split("/")[1]}
              <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" />
            </a>
            <dl className="flex flex-wrap items-center gap-x-5 gap-y-1">
              {stats.map(({ label, value }) => (
                <div key={label} className="flex items-baseline gap-1.5">
                  <dt className="order-2 text-[11px] text-muted-foreground">{label}</dt>
                  <dd className="text-base font-semibold tracking-[-0.025em] text-foreground tabular-nums">{data ? (value == null ? "—" : formatNumber(value)) : <span className="inline-block h-4 w-7 animate-pulse rounded bg-surface-2 align-middle" aria-label="Loading" />}</dd>
                </div>
              ))}
            </dl>
          </div>

          {!data && error ? (
            <div className="flex min-h-40 flex-col items-center justify-center gap-3 p-5 text-center" role="status">
              <Github className="h-7 w-7 text-muted-foreground" aria-hidden="true" />
              <p className="text-sm text-muted-foreground">GitHub activity is temporarily unavailable.</p>
              <button type="button" onClick={() => setAttempt((value) => value + 1)} className="inline-flex min-h-11 items-center gap-2 rounded-full border border-line-strong px-4 text-sm font-medium transition-colors hover:bg-surface-2"><RefreshCw className="h-3.5 w-3.5" aria-hidden="true" />Try again</button>
            </div>
          ) : (
            <div className="px-4 pb-3 pt-4 sm:px-6 sm:pb-4 sm:pt-5">
              {data?.calendar ? <ContributionCalendar days={data.calendar.days} /> : data ? <p className="py-8 text-center text-sm text-muted-foreground">The contribution calendar is temporarily unavailable. <a href={data.profileUrl} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-4">View activity on GitHub</a></p> : <div role="status" className="space-y-4"><span className="sr-only">Loading GitHub contributions</span><div className="h-3 w-44 animate-pulse rounded bg-surface-2" /><div className="h-28 animate-pulse rounded-lg bg-surface-2" /></div>}
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-[#9a713d]/15 px-4 py-1.5 sm:px-6 dark:border-[#b2874b]/10">
            <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><span className={cn("h-1 w-1 rounded-full", data && !error ? "bg-[#ad7939] dark:bg-[#c28f48]" : "bg-muted-foreground/50")} aria-hidden="true" />{data ? (error ? "Refresh delayed" : <>Synced <time dateTime={data.updatedAt}>{new Date(data.updatedAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}</time> · auto-updates</>) : "Activity from GitHub"}</p>
            <a href={siteConfig.links.github} target="_blank" rel="noopener noreferrer" className="group inline-flex min-h-8 items-center gap-1 text-[11px] font-medium text-accent">View profile<ArrowUpRight className="h-3 w-3 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" aria-hidden="true" /></a>
          </div>
        </div>
      </div>
    </section>
  );
}
