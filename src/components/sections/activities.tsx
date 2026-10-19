"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowUpRight, Code2, Users } from "lucide-react";
import { SectionHeading } from "@/components/common";
import activityData from "@/content/activities.json";

export interface Activity {
  id: string;
  name: string;
  date: string;
  endDate?: string;
  dateLabel?: string;
  category: "Hackathon" | "Community" | "Leadership" | "Volunteering";
  role: string;
  outcome?: string;
  project?: string;
  projectUrl?: string;
  summary: string;
  learning?: string;
  tags?: string[];
  url?: string;
  image?: string;
  imageAlt?: string;
  secondaryImage?: string;
  secondaryImageAlt?: string;
}

function ActivityDate({ activity }: { activity: Activity }) {
  if (activity.dateLabel || /^\d{4}$/.test(activity.date)) return <span>{activity.dateLabel || activity.date}</span>;
  const format = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric", timeZone: "UTC" });
  return <span><time dateTime={activity.date}>{format(activity.date)}</time>{activity.endDate && <> – <time dateTime={activity.endDate}>{format(activity.endDate)}</time></>}</span>;
}

function ActivityVisual({ activity }: { activity: Activity }) {
  const Icon = activity.category === "Hackathon" ? Code2 : Users;
  if (activity.image) {
    return (
      <div className="relative aspect-video shrink-0 overflow-hidden bg-surface-2 [perspective:1200px]">
        {activity.secondaryImage ? <div className="relative size-full transition-transform duration-700 ease-out [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          <div className="absolute inset-0 [backface-visibility:hidden]"><Image src={activity.image} alt={activity.imageAlt || activity.name} fill sizes="(max-width: 639px) 84vw, (max-width: 1023px) 46vw, (max-width: 1279px) 33vw, 260px" className="object-cover" /></div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]"><Image src={activity.secondaryImage} alt={activity.secondaryImageAlt || "Team photograph"} fill sizes="(max-width: 639px) 84vw, (max-width: 1023px) 46vw, (max-width: 1279px) 33vw, 260px" className="object-cover" /></div>
        </div> : <Image src={activity.image} alt={activity.imageAlt || activity.name} fill sizes="(max-width: 639px) 84vw, (max-width: 1023px) 46vw, (max-width: 1279px) 33vw, 260px" className="object-cover transition-transform duration-500 group-hover:scale-[1.03]" />}
        {activity.secondaryImage && <span className="pointer-events-none absolute bottom-2.5 right-2.5 hidden rounded-full bg-black/60 px-2 py-1 text-[9px] font-medium text-white/90 backdrop-blur-sm sm:block">Hover for team photo</span>}
      </div>
    );
  }
  return <div className="relative flex aspect-video shrink-0 overflow-hidden bg-[radial-gradient(120%_130%_at_15%_10%,rgba(245,158,11,0.18),transparent_48%),linear-gradient(135deg,#121212,#080808)] p-4">
    <div className="flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-accent"><Icon className="size-4" /></div>
    <div className="absolute bottom-4 left-4 right-4"><span className="eyebrow text-[9px] text-white/45">{activity.category}</span><p className="mt-1 line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-white/90">{activity.name}</p></div>
    <span className="absolute right-4 top-4 font-mono text-[10px] text-white/45">{activity.date.slice(0, 4)}</span>
  </div>;
}

function ActivityCard({ activity }: { activity: Activity }) {
  return <article className="group surface flex h-full flex-col overflow-hidden transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong">
    <ActivityVisual activity={activity} />
    <div className="flex flex-1 flex-col p-4">
      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-muted-foreground"><span>{activity.category}</span><span aria-hidden="true">·</span><ActivityDate activity={activity} /></div>
      {activity.outcome && <span className="mb-2 inline-flex self-start rounded-full border border-line-strong bg-foreground/5 px-2 py-0.5 text-[10px] font-medium text-muted-foreground">{activity.outcome}</span>}
      <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-foreground">{activity.name}</h3>
      <p className="mt-1.5 line-clamp-2 text-xs font-medium leading-relaxed text-muted-foreground">{activity.role}{activity.project ? ` · ${activity.project}` : ""}</p>
      <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted-foreground">{activity.summary}</p>
      {activity.tags?.length ? <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Topics">{activity.tags.slice(0, 2).map(tag => <li key={tag} className="rounded-md bg-foreground/5 px-1.5 py-0.5 text-[10px] text-muted-foreground">{tag}</li>)}</ul> : null}
      <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-0.5 pt-3 text-xs font-medium">
        {activity.projectUrl && <Link href={activity.projectUrl} className="inline-flex min-h-9 items-center gap-1.5 text-foreground hover:text-accent">Case study<ArrowUpRight className="size-3.5" /><span className="sr-only"> — {activity.project}</span></Link>}
        {activity.url && <a href={activity.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-9 items-center gap-1.5 text-muted-foreground hover:text-foreground">Event details<ArrowUpRight className="size-3.5" /><span className="sr-only"> — {activity.name}</span></a>}
      </div>
    </div>
  </article>;
}

export function Activities() {
  const activities = activityData as Activity[];
  const carousel = useRef<HTMLUListElement>(null);
  const [slide, setSlide] = useState(0);
  const hintId = useId();
  return <section id="activities" aria-labelledby="activities-heading" className="scroll-section section-y"><div className="shell">
    <SectionHeading id="activities-heading" eyebrow="Beyond the coursework" title="ExtraCurricular" description="Selected hackathons and builder communities — the academic problems, team contributions, and projects behind each experience." />
    {!activities.length && <div className="surface flex flex-col gap-5 rounded-2xl border border-line p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8"><div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-background"><Code2 className="size-5" aria-hidden="true" /></div><div><h3 className="text-lg font-semibold tracking-tight text-foreground">Build. Collaborate. Contribute.</h3><p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">A collection of hackathons, team challenges, and experiences beyond the coursework. Selected event stories are coming soon.</p></div></div>}
    {!!activities.length && <><ul ref={carousel} tabIndex={0} aria-label="ExtraCurricular activities" aria-describedby={hintId} onScroll={event => { const element = event.currentTarget; const first = element.firstElementChild as HTMLElement | null; if (first) setSlide(Math.max(0, Math.min(activities.length - 1, Math.round(element.scrollLeft / (first.offsetWidth + 12))))); }} onKeyDown={event => { if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return; const element = event.currentTarget; if (element.scrollWidth <= element.clientWidth) return; event.preventDefault(); const first = element.firstElementChild as HTMLElement | null; element.scrollBy({ left: ((first?.offsetWidth || element.clientWidth) + 12) * (event.key === "ArrowRight" ? 1 : -1), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" }); }} className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:p-0 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
      {activities.map(activity => <li key={activity.id} className="w-[84%] max-w-[22rem] min-w-0 shrink-0 snap-start sm:w-[46%] lg:w-auto lg:max-w-none"><ActivityCard activity={activity} /></li>)}
    </ul><div id={hintId} className="mt-4 flex items-center gap-4 lg:hidden"><span className="font-mono text-[11px] tabular-nums text-foreground" aria-live="polite">{String(slide + 1).padStart(2, "0")}<span className="text-muted-foreground"> / {String(activities.length).padStart(2, "0")}</span></span><span className="relative h-px flex-1 overflow-hidden bg-line" aria-hidden="true"><span className="absolute inset-y-0 left-0 bg-foreground transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((slide + 1) / activities.length) * 100}%` }} /></span><span className="eyebrow text-[10px]">Swipe</span><span className="sr-only">Swipe horizontally or focus the list and use the left and right arrow keys to browse activities.</span></div></>}
  </div></section>;
}
