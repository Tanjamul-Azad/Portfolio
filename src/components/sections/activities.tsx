"use client";

import Image from "next/image";
import Link from "next/link";
import { useId, useRef, useState } from "react";
import { ArrowUpRight, Code2, Users } from "lucide-react";
import { SectionHeading } from "@/components/common";
import activityData from "@/content/activities.json";
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

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
  projectSlug?: string;
  certificateUrl?: string;
  proofLinks?: { label: string; url: string }[];
  summary: string;
  learning?: string;
  tags?: string[];
  url?: string;
  image?: string;
  imageAlt?: string;
  thumbnail?: string;
  preview?: string;
  imageWidth?: number;
  imageHeight?: number;
  gallery?: { src: string; preview?: string; alt: string; label: string; width: number; height: number; download?: boolean }[];
  imageLabel?: string;
  imageSource?: string;
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
      <div className="relative aspect-video shrink-0 overflow-hidden bg-surface-2">
        <Image src={activity.thumbnail || activity.image} alt={activity.imageAlt || activity.name} fill unoptimized loading="eager" fetchPriority="low" className="object-contain" />
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
  const media = [
    ...(activity.image ? [{ src: activity.image, preview: activity.preview, alt: activity.imageAlt || activity.name, label: activity.imageLabel || "Official event poster", width: activity.imageWidth || 1200, height: activity.imageHeight || 675, download: false }] : []),
    ...(activity.gallery || []),
  ];
  return <article className="group surface flex h-full flex-col overflow-hidden transition-[border-color,transform] duration-300 hover:-translate-y-1 hover:border-line-strong">
    <ActivityVisual activity={activity} />
    <div className="flex flex-1 flex-col p-3.5">
      <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-[10px] text-muted-foreground"><span>{activity.dateLabel || activity.date.slice(0, 4)}</span>{activity.outcome && <><span aria-hidden="true">·</span>{activity.proofLinks?.[0] ? <a href={activity.proofLinks[0].url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-8 items-center gap-1 underline decoration-line underline-offset-4 hover:text-foreground" aria-label={`${activity.outcome} — ${activity.proofLinks[0].label}, ${activity.name}`}>{activity.outcome}<ArrowUpRight className="size-3" aria-hidden="true" /></a> : <span className="inline-flex min-h-8 items-center">{activity.outcome}</span>}</>}</div>
      <h3 className="line-clamp-2 text-sm font-semibold leading-snug tracking-tight text-foreground">{activity.name}</h3>
      <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{activity.summary}</p>
      <div className="mt-auto flex items-center gap-4 pt-2 text-xs font-medium">
        <Dialog>
          <DialogTrigger asChild><button type="button" className="inline-flex min-h-11 flex-1 items-center justify-between gap-2 text-left text-foreground hover:text-accent">Details<ArrowUpRight className="size-4" /><span className="sr-only"> — {activity.name}</span></button></DialogTrigger>
          <DialogContent className="max-h-[90dvh] overflow-y-auto overscroll-contain p-4 sm:max-w-3xl sm:p-6">
            <div className="pr-8">
              <p className="mb-2 font-mono text-[11px] text-muted-foreground"><ActivityDate activity={activity} />{activity.outcome && ` · ${activity.outcome}`}</p>
              <DialogTitle className="text-xl leading-snug">{activity.name}</DialogTitle>
              <DialogDescription className="mt-2 leading-relaxed">{activity.role}{activity.project ? ` · ${activity.project}` : ""}</DialogDescription>
            </div>
            <p className="text-sm leading-relaxed text-muted-foreground">{activity.summary}</p>
            {!!activity.proofLinks?.length && <div className="flex flex-wrap gap-2" aria-label="Participation evidence">{activity.proofLinks.map(proof => <a key={proof.url} href={proof.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-line px-3 text-xs font-medium hover:border-line-strong hover:text-accent">{proof.label}<ArrowUpRight className="size-3.5" aria-hidden="true" /></a>)}</div>}
            {media.map(item => <figure key={item.src} className="min-w-0"><a href={item.src} target="_blank" rel="noopener noreferrer" className="block rounded-lg bg-neutral-950 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground"><Image src={item.preview || item.src} alt={item.alt} width={item.width} height={item.height} unoptimized loading="eager" className="h-auto max-h-[65dvh] w-full rounded-lg object-contain" /></a><figcaption className="mt-2 flex flex-wrap justify-between gap-2 text-xs text-muted-foreground"><span>{item.label}</span><a href={item.src} target="_blank" rel="noopener noreferrer" className="underline underline-offset-4">Open full image<span className="sr-only"> — {item.label}</span></a>{item.download && <a href={item.src} download className="underline underline-offset-4">Download certificate<span className="sr-only"> — {item.label}</span></a>}</figcaption></figure>)}
            <div className="flex flex-wrap gap-x-5 gap-y-2 border-t border-line pt-3 text-xs font-medium">
              {activity.projectSlug && <Link href={`/projects/${activity.projectSlug}`} className="inline-flex min-h-11 items-center gap-1.5 hover:text-accent">Related project<ArrowUpRight className="size-3.5" aria-hidden="true" /></Link>}
              {activity.url && <a href={activity.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 hover:text-accent">Official event website<ArrowUpRight className="size-3.5" /></a>}
              {activity.imageSource && <a href={activity.imageSource} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 text-muted-foreground hover:text-foreground">Poster source<ArrowUpRight className="size-3.5" /></a>}
            </div>
          </DialogContent>
        </Dialog>
        {activity.certificateUrl && <a href={activity.certificateUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 shrink-0 items-center gap-1.5 text-foreground hover:text-accent">Certificate<ArrowUpRight className="size-3.5" aria-hidden="true" /><span className="sr-only"> — {activity.name}</span></a>}
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
