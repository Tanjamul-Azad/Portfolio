"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight, ExternalLink, Github, Lock, Play } from "lucide-react";
import { siteConfig } from "@/config/site";
import { getPinnedProjects, projects as allProjects } from "@/data/projects";
import type { Project } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { SectionHeading } from "@/components/common";
import { trackEvent } from "@/lib/telemetry";
import { MOTION_TOKENS } from "@/lib";
import { cn } from "@/lib/utils";
import { useRouteTransitioning } from "@/components/providers/page-transition";

/** A direct, inline-playable video file (vs. an external link like YouTube). */
function isVideoFile(url?: string) {
  return !!url && /\.(mp4|webm|mov|ogg)$/i.test(url);
}

const hasLink = (url?: string) => !!url && url !== "#";

/**
 * Project visual: an inline looping video when the project has a direct
 * video file, otherwise the thumbnail, degrading to a branded letter tile when
 * there is no image or it fails to load.
 */
function ProjectMedia({
  project,
  sizes,
  priority,
  allowVideo = false,
  className,
}: {
  project: Project;
  sizes: string;
  priority?: boolean;
  allowVideo?: boolean;
  className?: string;
}) {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  if (allowVideo && isVideoFile(project.videoUrl)) {
    return (
      <video
        src={encodeURI(project.videoUrl!)}
        poster={project.image ? encodeURI(project.image) : undefined}
        aria-hidden="true"
        tabIndex={-1}
        autoPlay
        muted
        loop
        playsInline
        preload="metadata"
        className={cn("absolute inset-0 h-full w-full object-cover", className)}
      />
    );
  }

  if (!project.image || failed) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `radial-gradient(120% 120% at 30% 20%, ${project.color ?? "#525252"}40, transparent), #0a0a0a`,
        }}
      >
        <span className="select-none font-heading text-3xl font-semibold text-white/90">
          {project.title.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <>
      {!loaded && <div className="absolute inset-0 animate-pulse bg-surface-2" />}
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={() => setLoaded(true)}
        onError={() => setFailed(true)}
        className={cn(
          "object-cover transition-[opacity,transform] duration-700 ease-out",
          loaded ? "opacity-100" : "opacity-0",
          className
        )}
      />
    </>
  );
}

/** The source-code action: a GitHub link, or a mailto request for a private repo. */
function sourceAction(project: Project) {
  if (project.sourcePrivate) {
    return {
      href: `mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(`Source code request — ${project.title}`)}`,
      label: `Request source code for ${project.title}`,
      Icon: Lock,
      event: "projects_request_source",
      external: false,
    };
  }
  if (hasLink(project.sourceUrl)) {
    return {
      href: project.sourceUrl!,
      label: `View source for ${project.title} on GitHub`,
      Icon: Github,
      event: "projects_open_source",
      external: true,
    };
  }
  return null;
}

const iconButton =
  "inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-foreground transition-colors duration-200 hover:bg-surface-2 sm:h-10 sm:w-10";

/** Live-demo + source icon buttons, shared by the phone card and desktop preview. */
function SecondaryActions({ project, source }: { project: Project; source: string }) {
  const src = sourceAction(project);
  return (
    <>
      {hasLink(project.liveUrl) && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open the live demo of ${project.title}`}
          title="Live demo"
          onClick={() => trackEvent("projects_open_live_demo", { project_slug: project.slug, source })}
          className={iconButton}
        >
          <ExternalLink className="h-4 w-4" />
        </a>
      )}
      {hasLink(project.videoUrl) && !isVideoFile(project.videoUrl) && (
        <a
          href={project.videoUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Watch the demo video of ${project.title}`}
          title="Watch demo"
          onClick={() => trackEvent("projects_open_video", { project_slug: project.slug, source })}
          className={iconButton}
        >
          <Play className="h-4 w-4" />
        </a>
      )}
      {src && (
        <a
          href={src.href}
          {...(src.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          aria-label={src.label}
          title={project.sourcePrivate ? "Request source" : "Source code"}
          onClick={() => trackEvent(src.event, { project_slug: project.slug, source })}
          className={iconButton}
        >
          <src.Icon className="h-4 w-4" />
        </a>
      )}
    </>
  );
}

/* ── Phone: swipeable card ──────────────────────────────────────────────── */

function MobileProjectCard({ project, index, isPinned }: { project: Project; index: number; isPinned: boolean }) {
  return (
    <article className="surface flex h-full flex-col overflow-hidden">
      <Link
        href={`/projects/${project.slug}`}
        aria-label={`${project.title} case study`}
        className="relative block aspect-[16/10] overflow-hidden bg-surface-2 focus-visible:ring-inset"
      >
        <ProjectMedia project={project} sizes="(max-width: 640px) 85vw, 50vw" allowVideo priority={index === 0} />
        <div className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
        <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2 py-1 font-mono text-[10px] font-medium text-white backdrop-blur-sm">
          {String(index + 1).padStart(2, "0")}
        </span>
        {isPinned && (
          <span className="absolute right-3 top-3 rounded-full bg-amber-400 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-black">
            Pinned
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <p className="eyebrow mb-1.5 truncate text-[10px]">{project.role}</p>
        <h3 className="text-lg font-semibold leading-tight tracking-[-0.02em] text-foreground">
          {project.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
          {project.description}
        </p>

        <div className="mt-3 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span key={tag} className="chip">{tag}</span>
          ))}
        </div>

        <div className="mt-auto flex items-center gap-2 pt-4">
          <Link
            href={`/projects/${project.slug}`}
            onClick={() => trackEvent("projects_open_case_study", { project_slug: project.slug, source: "mobile_card" })}
            className="inline-flex h-11 flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground text-[13px] font-semibold text-background"
          >
            Case study
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
          <SecondaryActions project={project} source="mobile_card" />
        </div>
      </div>
    </article>
  );
}

/* ── Desktop: rail row + preview ────────────────────────────────────────── */

interface RailRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  isPinned: boolean;
  onActivate: () => void;
  rowRef: (el: HTMLAnchorElement | null) => void;
}

function RailRow({ project, index, isActive, isPinned, onActivate, rowRef }: RailRowProps) {
  return (
    <Link
      ref={rowRef}
      href={`/projects/${project.slug}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={() =>
        trackEvent("projects_open_case_study", { project_slug: project.slug, source: "desktop_rail" })
      }
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "group relative flex items-center gap-4 rounded-2xl border p-2 pr-4 outline-none transition-all duration-300 ease-out scroll-mt-4",
        isActive
          ? "border-line bg-surface shadow-[var(--surface-shadow)]"
          : "border-transparent hover:bg-surface/50 focus-visible:bg-surface/50"
      )}
    >
      <div className="relative aspect-[16/10] w-24 shrink-0 overflow-hidden rounded-xl bg-surface-2 ring-1 ring-inset ring-line xl:w-28">
        <ProjectMedia project={project} sizes="128px" />
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className={cn("font-mono text-[11px] transition-colors", isActive ? "text-accent" : "text-muted-foreground")}>
            {String(index + 1).padStart(2, "0")}
          </span>
          <h3
            className={cn(
              "truncate text-[15px] font-semibold tracking-[-0.01em] transition-colors xl:text-base",
              isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
            )}
          >
            {project.title}
          </h3>
          {isPinned && (
            <span className="shrink-0 rounded-full bg-amber-500/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-accent">
              Pinned
            </span>
          )}
        </div>
        <p className="mt-1 truncate text-xs text-muted-foreground">{project.role}</p>
      </div>

      <ArrowUpRight
        className={cn(
          "h-4 w-4 shrink-0 transition-all duration-300",
          isActive
            ? "translate-x-0 text-foreground opacity-100"
            : "-translate-x-1 text-muted-foreground opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        )}
      />
    </Link>
  );
}

function ProjectPreview({ project, isPinned }: { project: Project; isPinned: boolean }) {
  return (
    <AnimatePresence mode="wait">
      <motion.article
        key={project.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
        className="surface group relative overflow-hidden"
      >
        {/* Ambient wash in the project's own colour, behind the card. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -inset-x-10 -top-24 h-64 opacity-25 blur-[90px] dark:opacity-30"
          style={{ backgroundColor: project.color || "#f59e0b" }}
        />

        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${project.title} case study`}
          tabIndex={-1}
          className="relative m-2 block aspect-[16/9] overflow-hidden rounded-xl bg-surface-2"
        >
          <ProjectMedia
            project={project}
            sizes="(min-width: 1024px) 50vw, 100vw"
            allowVideo
            priority={project.featured}
            className="group-hover:scale-[1.03]"
          />
          <div className="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-black/5 dark:ring-white/10" />
        </Link>

        <div className="relative px-6 pb-6 pt-4">
          <div className="flex items-start justify-between gap-6">
            <div className="min-w-0">
              <p className="eyebrow mb-2 truncate text-[10px]">{project.role}</p>
              <h3 className="flex items-center gap-2.5 text-2xl font-semibold tracking-[-0.025em] text-foreground">
                {project.title}
                {isPinned && (
                  <span className="rounded-full bg-amber-500/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-accent">
                    Pinned
                  </span>
                )}
              </h3>
            </div>
          </div>

          <p className="mt-3 line-clamp-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {project.description}
          </p>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-5">
            <div className="flex flex-wrap gap-1.5">
              {project.tags.slice(0, 4).map((tag) => (
                <span key={tag} className="chip">{tag}</span>
              ))}
            </div>
            <div className="flex items-center gap-2">
              <SecondaryActions project={project} source="desktop_preview" />
              <Link
                href={`/projects/${project.slug}`}
                onClick={() => trackEvent("projects_open_case_study", { project_slug: project.slug, source: "desktop_preview" })}
                className="group/cta inline-flex h-10 items-center gap-1.5 rounded-full bg-foreground pl-5 pr-4 text-[13px] font-semibold text-background transition-transform duration-300 hover:-translate-y-px"
              >
                Case study
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover/cta:translate-x-0.5" />
              </Link>
            </div>
          </div>
        </div>
      </motion.article>
    </AnimatePresence>
  );
}

export function Projects() {
  const { isRouteTransitioning } = useRouteTransitioning();
  const totalProjects = allProjects.length;

  // Every project, pinned first.
  const displayProjects = useMemo(() => {
    const pinned = getPinnedProjects();
    const pinnedIds = new Set(pinned.map((p) => p.id));
    const rest = allProjects.filter((p) => !pinnedIds.has(p.id));
    return [...pinned, ...rest];
  }, []);
  const pinnedIdSet = useMemo(() => new Set(getPinnedProjects().map((p) => p.id)), []);

  const [hoveredProject, setHoveredProject] = useState<string | null>(displayProjects[0]?.id || null);
  const projectLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  // Phone carousel position, for the counter and progress bar under it.
  const carouselRef = useRef<HTMLDivElement>(null);
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    const el = carouselRef.current;
    if (!el) return;
    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const first = el.firstElementChild as HTMLElement | null;
        if (!first) return;
        const step = first.offsetWidth + 12;
        setSlide(Math.min(displayProjects.length - 1, Math.max(0, Math.round(el.scrollLeft / step))));
      });
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      if (frame) cancelAnimationFrame(frame);
      el.removeEventListener("scroll", onScroll);
    };
  }, [displayProjects.length]);

  const activeProject =
    displayProjects.length === 0
      ? null
      : displayProjects.find((p) => p.id === hoveredProject) || displayProjects[0];

  const focusProjectByOffset = (offset: 1 | -1) => {
    if (displayProjects.length === 0) return;
    const currentIndex = Math.max(0, displayProjects.findIndex((p) => p.id === hoveredProject));
    const nextIndex = (currentIndex + offset + displayProjects.length) % displayProjects.length;
    setHoveredProject(displayProjects[nextIndex].id);
    const nextRow = projectLinkRefs.current[nextIndex];
    nextRow?.focus();
    nextRow?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  const browseAll = (
    <Link
      href="/projects"
      onClick={() => trackEvent("projects_open_all_projects", { source: "homepage_section" })}
      className="group inline-flex h-11 items-center gap-1.5 self-start rounded-full sm:h-10 border border-line-strong bg-surface/60 px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-surface-2 md:self-auto"
    >
      All {totalProjects} projects
      <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
    </Link>
  );

  return (
    <section id="projects" className="scroll-section section-y relative">
      <div className="shell">
        <SectionHeading
          index="04"
          eyebrow="Selected Work"
          title={
            <>
              Things I&apos;ve <em className="accent-serif">built</em>
            </>
          }
          description="Production platforms, AI tooling and research prototypes — each with a written case study."
          action={browseAll}
        />

        {displayProjects.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-line-strong p-8 text-center text-sm text-muted-foreground">
            No projects to show yet — check back soon.
          </div>
        ) : (
          <>
            {/* Desktop: scrollable rail on the left, live preview on the right. */}
            <div className="hidden items-start gap-8 lg:grid lg:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] xl:gap-10">
              <div className="relative">
                <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-6 bg-linear-to-b from-background to-transparent" />
                <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-linear-to-t from-background to-transparent" />

                <div
                  role="list"
                  aria-label="Project list — use arrow keys to navigate"
                  tabIndex={0}
                  onKeyDown={(event) => {
                    if (event.key === "ArrowDown") {
                      event.preventDefault();
                      focusProjectByOffset(1);
                    }
                    if (event.key === "ArrowUp") {
                      event.preventDefault();
                      focusProjectByOffset(-1);
                    }
                  }}
                  className="custom-scrollbar max-h-[33rem] space-y-1 overflow-y-auto py-2 pr-2 outline-none"
                >
                  {displayProjects.map((project, index) => (
                    <motion.div
                      key={project.id}
                      role="listitem"
                      initial={{ opacity: 0, y: 12 }}
                      whileInView={isRouteTransitioning ? undefined : { opacity: 1, y: 0 }}
                      transition={{ duration: MOTION_TOKENS.duration.medium, delay: Math.min(index, 6) * 0.04, ease: MOTION_TOKENS.easing.premium }}
                      viewport={{ once: true }}
                    >
                      <RailRow
                        project={project}
                        index={index}
                        isActive={activeProject?.id === project.id}
                        isPinned={pinnedIdSet.has(project.id)}
                        onActivate={() => setHoveredProject(project.id)}
                        rowRef={(el) => {
                          projectLinkRefs.current[index] = el;
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="sticky top-28">
                {activeProject && (
                  <ProjectPreview project={activeProject} isPinned={pinnedIdSet.has(activeProject.id)} />
                )}
              </div>
            </div>

            {/* Phones and tablets: a sideways snap carousel. Every project is
                one swipe away and the section stays one card tall, instead of
                a stack of full-width cards several screens long. It scrolls on
                the horizontal axis only, so it never traps vertical scrolling. */}
            <div className="lg:hidden">
              <div
                ref={carouselRef}
                role="list"
                aria-label="Projects"
                className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 [&::-webkit-scrollbar]:hidden"
              >
                {displayProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    role="listitem"
                    initial={{ opacity: 0, x: 24 }}
                    whileInView={isRouteTransitioning ? undefined : { opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: Math.min(index, 3) * 0.06, ease: MOTION_TOKENS.easing.premium }}
                    className="w-[84%] max-w-[22rem] shrink-0 snap-start sm:w-[46%]"
                  >
                    <MobileProjectCard project={project} index={index} isPinned={pinnedIdSet.has(project.id)} />
                  </motion.div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-4" aria-hidden="true">
                <span className="font-mono text-[11px] tabular-nums text-foreground">
                  {String(slide + 1).padStart(2, "0")}
                  <span className="text-muted-foreground"> / {String(displayProjects.length).padStart(2, "0")}</span>
                </span>
                <span className="relative h-px flex-1 overflow-hidden bg-line">
                  <span
                    className="absolute inset-y-0 left-0 bg-foreground transition-[width] duration-300 ease-out"
                    style={{ width: `${((slide + 1) / displayProjects.length) * 100}%` }}
                  />
                </span>
                <span className="eyebrow text-[10px]">Swipe</span>
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
