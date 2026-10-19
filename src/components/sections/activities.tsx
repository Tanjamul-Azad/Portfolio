"use client";

import Image from "next/image";
import Link from "next/link";
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
}

function ActivityDate({ activity }: { activity: Activity }) {
  if (activity.dateLabel || /^\d{4}$/.test(activity.date)) {
    return <span>{activity.dateLabel || activity.date}</span>;
  }

  const format = (date: string) => new Date(`${date}T12:00:00Z`).toLocaleDateString("en-US", {
    day: "numeric", month: "short", year: "numeric", timeZone: "UTC",
  });

  return (
    <span>
      <time dateTime={activity.date}>{format(activity.date)}</time>
      {activity.endDate && <> – <time dateTime={activity.endDate}>{format(activity.endDate)}</time></>}
    </span>
  );
}

export function Activities() {
  const activities = activityData as Activity[];

  return (
    <section id="activities" aria-labelledby="activities-heading" className="scroll-section section-y">
      <div className="shell">
        <SectionHeading id="activities-heading" eyebrow="Beyond the coursework"
          title="ExtraCurricular"
          description="Hackathons and builder communities — where I participated, what I contributed, and the projects behind the experience." />
        {!activities.length && (
          <div className="surface flex flex-col gap-5 rounded-2xl border border-line p-6 sm:flex-row sm:items-center sm:gap-6 sm:p-8">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-foreground text-background"><Code2 className="size-5" aria-hidden="true" /></div>
            <div>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">Build. Collaborate. Contribute.</h3>
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">A collection of hackathons, team challenges, and experiences beyond the coursework. Selected event stories are coming soon.</p>
            </div>
          </div>
        )}
        <div className="grid gap-5 lg:grid-cols-2">
          {activities.map((activity) => (
            <article key={activity.id} className="surface flex flex-col overflow-hidden rounded-2xl border border-line">
              {activity.image && <Image src={activity.image} alt={activity.imageAlt || activity.name}
                width={1200} height={675} sizes="(max-width: 1024px) 100vw, 50vw" className="aspect-video w-full object-cover" />}
              <div className="flex flex-1 flex-col p-5 sm:p-7">
                <div className="mb-4 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1">
                    {activity.category === "Hackathon" ? <Code2 className="size-3.5" /> : <Users className="size-3.5" />}
                    {activity.category}
                  </span>
                  <ActivityDate activity={activity} />
                </div>
                {activity.outcome && <span className="mb-3 inline-flex self-start rounded-full border border-line-strong bg-foreground/5 px-2.5 py-1 text-[11px] font-medium text-muted-foreground">{activity.outcome}</span>}
                <h3 className="text-xl font-semibold tracking-tight text-foreground">{activity.name}</h3>
                <p className="mt-2 text-sm font-medium text-muted-foreground">{activity.role}{activity.project ? ` · ${activity.project}` : ""}</p>
                <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{activity.summary}</p>
                {activity.learning && <p className="mt-3 border-l-2 border-line-strong pl-3 text-sm leading-relaxed text-muted-foreground">{activity.learning}</p>}
                {activity.tags?.length ? <ul className="mb-5 mt-5 flex flex-wrap gap-2" aria-label="Tools and topics">{activity.tags.map(tag => <li key={tag} className="rounded-md bg-foreground/5 px-2 py-1 text-xs text-muted-foreground">{tag}</li>)}</ul> : null}
                <div className="mt-auto flex flex-wrap items-center gap-x-5 gap-y-1 border-t border-line pt-4">
                  {activity.projectUrl && <Link href={activity.projectUrl} className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-foreground">Project case study<ArrowUpRight className="size-4" /><span className="sr-only"> — {activity.project}</span></Link>}
                  {activity.url && <a href={activity.url} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">Event details<ArrowUpRight className="size-4" /><span className="sr-only"> — {activity.name}</span></a>}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
