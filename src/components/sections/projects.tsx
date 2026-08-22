"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate, useScroll } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, FileText, Play } from "lucide-react";
import { getPinnedProjects, projects as allProjects } from "@/data/projects";
import type { Project } from "@/types";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/telemetry";
import { MOTION_TOKENS } from "@/lib";
import { cn } from "@/lib/utils";
import { useRouteTransitioning } from "@/components/providers/page-transition";

/** A direct, inline-playable video file (vs. an external link like YouTube). */
function isVideoFile(url?: string) {
  return !!url && /\.(mp4|webm|mov|ogg)$/i.test(url);
}

/** Image thumbnail that degrades to a branded letter placeholder. */
function ProjectThumb({
  project,
  loaded,
  failed,
  onLoad,
  onError,
  sizes,
  priority,
}: {
  project: Project;
  loaded: boolean;
  failed: boolean;
  onLoad: () => void;
  onError: () => void;
  sizes: string;
  priority?: boolean;
}) {
  if (!project.image || failed) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `radial-gradient(120% 120% at 30% 20%, ${project.color ?? "#525252"}40, transparent), #0a0a0a`,
        }}
      >
        <span className="text-3xl font-bold text-white/90 select-none">
          {project.title.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <>
      {!loaded && (
        <div className="absolute inset-0 z-0 animate-pulse bg-neutral-200/70 dark:bg-neutral-800/70" />
      )}
      <Image
        src={project.image}
        alt={project.title}
        fill
        sizes={sizes}
        priority={priority}
        onLoad={onLoad}
        onError={onError}
        className={`object-cover transition-all duration-500 ease-out group-hover:scale-105 ${loaded ? "opacity-100" : "opacity-0"}`}
      />
    </>
  );
}
  
function MagneticWrapper({ children, className }: { children: React.ReactNode, className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const x = e.clientX - (left + width / 2);
    const y = e.clientY - (top + height / 2);
    setPosition({ x: x * 0.2, y: y * 0.2 });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

interface MobileProjectCardProps {
  project: Project;
  index: number;
  isRouteTransitioning: boolean;
  failedImages: Record<string, boolean>;
  loadedImages: Record<string, boolean>;
  markImageLoaded: (id: string) => void;
  markImageFailed: (id: string) => void;
}

function MobileProjectCard({ project, index, isRouteTransitioning, failedImages, loadedImages, markImageLoaded, markImageFailed }: MobileProjectCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"]
  });
  
  // Parallax effect: image moves contrary to scroll direction slightly
  const y = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50, rotateX: 10 }}
      whileInView={isRouteTransitioning ? undefined : { opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, delay: index * 0.1, ease: [0.16, 1, 0.3, 1] }}
      viewport={{ once: true, margin: "-50px" }}
      style={{ perspective: "1000px" }}
    >
      <div className="group rounded-2xl max-[360px]:rounded-xl sm:rounded-3xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-900 shadow-lg sm:shadow-xl">
        {/* Image area */}
        <Link
          href={`/projects/${project.slug}`}
          aria-label={`${project.title} case study`}
          className="block relative rounded-t-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
        >
          <div className="aspect-video max-[360px]:aspect-2/1 sm:aspect-4/3 relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
            {isVideoFile(project.videoUrl) ? (
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
                className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />
            ) : project.image && !failedImages[project.id] ? (
              <>
                <AnimatePresence>
                  {!loadedImages[project.id] && (
                    <motion.div
                      initial={{ opacity: 1 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
                      className="absolute inset-0 z-0 animate-pulse bg-neutral-200/70 dark:bg-neutral-800/70"
                    />
                  )}
                </AnimatePresence>
                <motion.div style={{ y }} className="absolute inset-0 w-full h-[130%] -top-[15%]">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className={`object-cover h-full w-full z-0 transition-transform duration-700 ease-out group-hover:scale-105 ${loadedImages[project.id] ? "opacity-100" : "opacity-0"}`}
                    onLoad={() => markImageLoaded(project.id)}
                    onError={() => markImageFailed(project.id)}
                  />
                </motion.div>
              </>
            ) : (
              <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 dark:bg-neutral-100 z-0">
                <span className="text-5xl sm:text-6xl font-bold text-neutral-300 dark:text-neutral-700">
                  {project.title.substring(0, 1)}
                </span>
              </div>
            )}
            
            {/* Inner Shadow Gradient */}
            <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-black/5 dark:ring-white/10" />
          </div>
        </Link>

        {/* Content Area */}
        <div className="p-4 max-[360px]:p-3 sm:p-5">
          <Link
            href={`/projects/${project.slug}`}
            className="block w-fit rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
          >
            <h3 className="text-lg max-[360px]:text-base sm:text-xl font-bold text-neutral-900 dark:text-white mb-2 flex items-center gap-2 group-hover:text-accent transition-colors">
              {project.title}
              <ArrowUpRight className="w-4 h-4 sm:w-5 sm:h-5 text-neutral-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </h3>
          </Link>

          <p className="text-sm max-[360px]:text-xs text-neutral-600 dark:text-neutral-400 mb-4 max-[360px]:mb-3 line-clamp-2 sm:line-clamp-3">
            {project.description}
          </p>

          <div className="flex flex-wrap gap-2 max-[360px]:gap-1.5 mb-4 max-[360px]:mb-3">
            {project.tags.slice(0, 3).map((tag: string, tagIndex: number) => (
              <span
                key={tag}
                className={`text-[10px] max-[360px]:text-[9px] font-medium tracking-wide uppercase px-2.5 max-[360px]:px-2 py-1 max-[360px]:py-0.5 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-full border border-neutral-200 dark:border-neutral-700 ${tagIndex === 2 ? "max-[360px]:hidden" : ""}`}
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pt-3 max-[360px]:pt-2.5 sm:pt-4 border-t border-neutral-100 dark:border-neutral-800">
            {project.liveUrl && project.liveUrl !== '#' && (
              <Button asChild size="xs" className="w-full sm:flex-1 rounded-full max-[360px]:h-8 max-[360px]:px-3 max-[360px]:text-[11px] bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all duration-200">
                <a href={project.liveUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackEvent("projects_open_live_demo", { project_slug: project.slug, source: "mobile_card" })}>
                  <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Live Demo
                </a>
              </Button>
            )}
            <Button asChild size="xs" variant="outline" className="w-full sm:flex-1 rounded-full max-[360px]:h-8 max-[360px]:px-3 max-[360px]:text-[11px] border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium active:scale-[0.98] transition-all duration-200">
              <Link href={`/projects/${project.slug}`} onClick={() => trackEvent("projects_open_case_study", { project_slug: project.slug, source: "mobile_card" })}>
                <FileText className="w-3.5 h-3.5 mr-1.5" /> Case Study
              </Link>
            </Button>
            {project.sourceUrl && project.sourceUrl !== '#' && (
              <Button asChild size="icon" variant="ghost" className="self-end sm:self-auto rounded-full w-9 h-9 max-[360px]:w-8 max-[360px]:h-8 shrink-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all duration-200">
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => trackEvent("projects_open_source", { project_slug: project.slug, source: "mobile_card" })}
                >
                  <Github className="w-4 h-4" />
                  <span className="sr-only">View source for {project.title} on GitHub</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

interface RailRowProps {
  project: Project;
  index: number;
  isActive: boolean;
  isPinned: boolean;
  loaded: boolean;
  failed: boolean;
  onActivate: () => void;
  onLoad: () => void;
  onError: () => void;
  rowRef: (el: HTMLAnchorElement | null) => void;
}

/** A single compact, thumbnail-led row in the scrollable desktop project rail. */
function RailRow({
  project,
  index,
  isActive,
  isPinned,
  loaded,
  failed,
  onActivate,
  onLoad,
  onError,
  rowRef,
}: RailRowProps) {
  return (
    <Link
      ref={rowRef}
      href={`/projects/${project.slug}`}
      onMouseEnter={onActivate}
      onFocus={onActivate}
      onClick={() =>
        trackEvent("projects_open_case_study", {
          project_slug: project.slug,
          source: "desktop_rail",
        })
      }
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "group flex items-center gap-4 rounded-2xl border p-2.5 pr-3 transition-all duration-300 ease-out outline-none scroll-mt-4",
        isActive
          ? "border-amber-500/40 bg-neutral-100/90 dark:bg-neutral-900/80 shadow-sm translate-x-1"
          : "border-transparent opacity-55 hover:opacity-100 focus-visible:opacity-100"
      )}
    >
      {/* Thumbnail — top visual priority */}
      <div className="relative aspect-video w-28 xl:w-36 shrink-0 overflow-hidden rounded-xl bg-neutral-200 dark:bg-neutral-800 ring-1 ring-inset ring-black/5 dark:ring-white/10">
        <ProjectThumb
          project={project}
          loaded={loaded}
          failed={failed}
          onLoad={onLoad}
          onError={onError}
          sizes="160px"
        />
        <span className="font-mono absolute left-1.5 top-1.5 z-10 rounded-md bg-black/55 px-1.5 py-0.5 text-[10px] font-medium text-white backdrop-blur-sm">
          {(index + 1).toString().padStart(2, "0")}
        </span>
      </div>

      {/* Info */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h3
            className={cn(
              "truncate text-base xl:text-lg font-bold tracking-tight transition-colors",
              isActive ? "text-neutral-900 dark:text-white" : "text-neutral-700 dark:text-neutral-300"
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
        <p className="mt-0.5 truncate text-xs text-neutral-500 dark:text-neutral-400">{project.role}</p>
        <div className="mt-1.5 flex flex-wrap gap-1.5">
          {project.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-neutral-200/70 px-2 py-0.5 text-[10px] font-medium text-neutral-600 dark:bg-neutral-800/70 dark:text-neutral-400"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <ArrowUpRight
        className={cn(
          "h-5 w-5 shrink-0 transition-all duration-300",
          isActive
            ? "text-amber-500 translate-x-0 opacity-100"
            : "text-neutral-400 -translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
        )}
      />
    </Link>
  );
}

export function Projects() {
  const { isRouteTransitioning } = useRouteTransitioning();
  const totalProjects = allProjects.length;

  // Show every project (pinned first), so the rail can hold many without growing the page.
  const displayProjects = useMemo(() => {
    const pinned = getPinnedProjects();
    const pinnedIds = new Set(pinned.map((p) => p.id));
    const rest = allProjects.filter((p) => !pinnedIds.has(p.id));
    return [...pinned, ...rest];
  }, []);
  const pinnedIdSet = useMemo(() => new Set(getPinnedProjects().map((p) => p.id)), []);

  const [hoveredProject, setHoveredProject] = useState<string | null>(displayProjects[0]?.id || null);
  const [showAllMobile, setShowAllMobile] = useState(false);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const projectLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);
  const previewRef = useRef<HTMLDivElement>(null);

  // 3D Tilt Effect State
  const mouseX = useMotionValue(0.5);
  const mouseY = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 200, mass: 0.5 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  const rotateX = useTransform(springY, [0, 1], [6, -6]); // more pronounced tilt
  const rotateY = useTransform(springX, [0, 1], [-6, 6]);

  const glareX = useTransform(springX, [0, 1], [0, 100]);
  const glareY = useTransform(springY, [0, 1], [0, 100]);
  const glareBackground = useMotionTemplate`radial-gradient(circle 400px at ${glareX}% ${glareY}%, rgba(255,255,255,0.15), transparent)`;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!previewRef.current) return;
    const rect = previewRef.current.getBoundingClientRect();
    
    // Calculate 0 to 1 mapping based on mouse position within the element
    const x = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    
    mouseX.set(x);
    mouseY.set(y);
  };

  const handleMouseLeave = () => {
    mouseX.set(0.5);
    mouseY.set(0.5);
  };

  const filteredProjects = displayProjects;

  // Mobile shows a short, complete list first rather than a scroll-inside-scroll pane.
  const MOBILE_INITIAL_COUNT = 3;
  const visibleMobileProjects = showAllMobile
    ? filteredProjects
    : filteredProjects.slice(0, MOBILE_INITIAL_COUNT);
  const hiddenMobileCount = filteredProjects.length - visibleMobileProjects.length;

  const activeProject =
    filteredProjects.length === 0
      ? null
      : filteredProjects.find((p) => p.id === hoveredProject) || filteredProjects[0];

  // A direct video file plays inline as an animated preview; anything else
  // (YouTube, etc.) stays a "Watch Demo" link in the hover overlay.
  const previewVideo = isVideoFile(activeProject?.videoUrl) ? activeProject!.videoUrl : null;

  useEffect(() => {
    if (filteredProjects.length === 0) {
      setHoveredProject(null);
      return;
    }

    const isHoveredVisible = filteredProjects.some((project) => project.id === hoveredProject);
    if (!isHoveredVisible) {
      setHoveredProject(filteredProjects[0].id);
    }
  }, [filteredProjects, hoveredProject]);

  const markImageFailed = (projectId: string) => {
    setFailedImages((prev) => ({ ...prev, [projectId]: true }));
  };

  const markImageLoaded = (projectId: string) => {
    setLoadedImages((prev) => ({ ...prev, [projectId]: true }));
  };

  const focusProjectByOffset = (offset: 1 | -1) => {
    if (filteredProjects.length === 0) return;

    const currentIndex = Math.max(
      0,
      filteredProjects.findIndex((project) => project.id === hoveredProject)
    );
    const nextIndex = (currentIndex + offset + filteredProjects.length) % filteredProjects.length;
    const nextProject = filteredProjects[nextIndex];

    setHoveredProject(nextProject.id);
    const nextRow = projectLinkRefs.current[nextIndex];
    nextRow?.focus();
    nextRow?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  return (
    <section id="projects" className="scroll-section py-20 md:py-28 relative overflow-hidden md:min-h-screen flex items-center">

      <div className="container px-4 sm:px-6 mx-auto relative">
        {/* Header */}
        <div className="mb-10 md:mb-14 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-sm text-neutral-500 dark:text-neutral-400 tracking-[0.16em] uppercase font-medium"
            >
              Selected Work
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: MOTION_TOKENS.duration.slow, ease: MOTION_TOKENS.easing.premium }}
              className="mt-3 text-3xl sm:text-4xl md:text-5xl font-bold font-heading tracking-tight text-neutral-900 dark:text-white"
            >
              Projects
            </motion.h2>
          </div>

          <Button
            asChild
            size="default"
            className="self-start sm:self-auto rounded-full h-11 px-6 text-sm font-semibold bg-neutral-900 text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200 shadow-sm"
          >
            <Link
              href="/projects"
              onClick={() => trackEvent("projects_open_all_projects", { source: "homepage_section" })}
            >
              Browse all {totalProjects} projects
              <ArrowUpRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-[0.78fr_1.22fr] gap-8 lg:gap-10 items-start">
          {/* Left Side - Scrollable thumbnail rail (fixed height → page never grows) */}
          <div className="hidden lg:block">
            <div className="relative">
              {/* Fade masks */}
              <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-10 bg-linear-to-b from-white to-transparent dark:from-black" />
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-10 bg-linear-to-t from-white to-transparent dark:from-black" />

              <div
                role="list"
                aria-label="Project list — use arrow keys to navigate"
                tabIndex={0}
                data-lenis-prevent
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
                className="custom-scrollbar max-h-128 xl:max-h-144 space-y-2 overflow-y-auto py-4 pr-2 outline-none"
              >
                {filteredProjects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    role="listitem"
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={isRouteTransitioning ? undefined : { opacity: 1, y: 0 }}
                    transition={{ duration: MOTION_TOKENS.duration.medium, delay: Math.min(index, 6) * 0.05, ease: MOTION_TOKENS.easing.premium }}
                    viewport={{ once: true }}
                  >
                    <RailRow
                      project={project}
                      index={index}
                      isActive={hoveredProject === project.id}
                      isPinned={pinnedIdSet.has(project.id)}
                      loaded={!!loadedImages[project.id]}
                      failed={!!failedImages[project.id]}
                      onActivate={() => setHoveredProject(project.id)}
                      onLoad={() => markImageLoaded(project.id)}
                      onError={() => markImageFailed(project.id)}
                      rowRef={(el) => {
                        projectLinkRefs.current[index] = el;
                      }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Side - Project Preview Image */}
          <div className="hidden lg:block sticky top-32" style={{ perspective: "1500px" }}>
            {activeProject ? (
              <AnimatePresence mode="wait">
              <motion.div
                key={activeProject?.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: MOTION_TOKENS.duration.slow, ease: MOTION_TOKENS.easing.premium }}
                className="relative"
              >
                {/* Ambient Backlight */}
                <div 
                  className="absolute inset-0 blur-[80px] opacity-20 dark:opacity-30 transition-colors duration-1000 -z-10 rounded-full scale-105"
                  style={{ backgroundColor: activeProject?.color || "var(--theme-primary, #6366f1)" }}
                />

                {/* Image container */}
                <motion.div 
                  ref={previewRef}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
                  className="relative rounded-2xl overflow-hidden shadow-2xl group border border-neutral-200 dark:border-neutral-800"
                >
                  {/* Dynamic Glare */}
                  <motion.div
                    className="absolute inset-0 z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay"
                    style={{ background: glareBackground }}
                  />

                  {/* Project image/preview container */}
                  <div className="aspect-16/10 relative bg-neutral-100 dark:bg-neutral-900 overflow-hidden">
                    {/* Inline animated video preview takes priority when present */}
                    {previewVideo ? (
                      <video
                        key={previewVideo}
                        src={encodeURI(previewVideo)}
                        poster={activeProject?.image ? encodeURI(activeProject.image) : undefined}
                        autoPlay
                        muted
                        loop
                        playsInline
                        preload="metadata"
                        className="absolute inset-0 z-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      />
                    ) : activeProject?.image && !failedImages[activeProject.id] ? (
                      <>
                        <AnimatePresence>
                          {!loadedImages[activeProject.id] && (
                            <motion.div
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
                              className="absolute inset-0 z-0 animate-pulse bg-neutral-300/50 dark:bg-neutral-700/50"
                            />
                          )}
                        </AnimatePresence>
                        <Image
                          src={activeProject.image}
                          alt={activeProject.title}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className={`object-cover z-0 transition-transform duration-700 ease-out group-hover:scale-105 ${loadedImages[activeProject.id] ? "opacity-100" : "opacity-0"}`}
                          onLoad={() => markImageLoaded(activeProject.id)}
                          onError={() => markImageFailed(activeProject.id)}
                          priority={activeProject.featured}
                        />
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-neutral-900 dark:bg-neutral-100 z-0">
                        <span className="text-6xl font-bold text-white dark:text-neutral-900">
                          {activeProject?.title.substring(0, 1)}
                        </span>
                      </div>
                    )}

                    {/* Faded shades at borders */}
                    <div className="absolute inset-0 z-10 bg-linear-to-t from-black/80 via-transparent to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out" />
                    <div className="absolute inset-0 z-10 ring-1 ring-inset ring-black/10 dark:ring-white/10 pointer-events-none" />

                    {/* Content overlaid at the bottom */}
                    <AnimatePresence mode="wait">
                      <motion.div
                        key={activeProject?.id + '-actions'}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
                        className="absolute inset-0 z-20 flex flex-col items-center justify-center p-8 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                      >
                        {/* Action buttons */}
                        <div className="flex flex-wrap items-center justify-center gap-4 translate-y-4 group-hover:translate-y-0 transition-all duration-500 ease-out" style={{ transform: "translateZ(30px)" }}>
                          {activeProject?.liveUrl && activeProject.liveUrl !== '#' && (
                            <MagneticWrapper>
                              <Button
                                asChild
                                size="default"
                                className="rounded-full bg-white text-black font-semibold hover:bg-neutral-200 active:scale-[0.98] transition-all duration-200 shadow-[0_0_30px_rgba(255,255,255,0.3)] px-6 h-12"
                              >
                                <a
                                  href={activeProject.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() =>
                                    trackEvent("projects_open_live_demo", {
                                      project_slug: activeProject.slug,
                                      source: "desktop_preview",
                                    })
                                  }
                                >
                                  <ExternalLink className="w-4 h-4 mr-2" />
                                  Live Demo
                                </a>
                              </Button>
                            </MagneticWrapper>
                          )}
                          {activeProject?.videoUrl && activeProject.videoUrl !== '#' && !isVideoFile(activeProject.videoUrl) && (
                            <MagneticWrapper>
                              <Button
                                asChild
                                size="default"
                                variant="outline"
                                className="rounded-full bg-black/60 hover:text-white border-white/20 text-white hover:bg-black/90 font-semibold active:scale-[0.98] transition-all duration-200 shadow-2xl backdrop-blur-xl px-6 h-12"
                              >
                                <a
                                  href={activeProject.videoUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() =>
                                    trackEvent("projects_open_video", {
                                      project_slug: activeProject.slug,
                                      source: "desktop_preview",
                                    })
                                  }
                                >
                                  <Play className="w-4 h-4 mr-2" />
                                  Watch Demo
                                </a>
                              </Button>
                            </MagneticWrapper>
                          )}
                          <MagneticWrapper>
                            <Button
                              asChild
                              size="default"
                              variant="outline"
                              className="rounded-full bg-black/60 hover:text-white border-white/20 text-white hover:bg-black/90 font-semibold active:scale-[0.98] transition-all duration-200 shadow-2xl backdrop-blur-xl px-6 h-12"
                            >
                              <Link
                                href={`/projects/${activeProject?.slug}`}
                                onClick={() =>
                                  trackEvent("projects_open_case_study", {
                                    project_slug: activeProject.slug,
                                    source: "desktop_preview",
                                  })
                                }
                              >
                                <FileText className="w-4 h-4 mr-2" />
                                Case Study
                              </Link>
                            </Button>
                          </MagneticWrapper>
                          {activeProject?.sourceUrl && activeProject.sourceUrl !== '#' && (
                            <MagneticWrapper>
                              <Button
                                asChild
                                size="icon"
                                variant="ghost"
                                className="rounded-full w-12 h-12 bg-black/60 text-white hover:text-white hover:bg-black/90 active:scale-95 transition-all duration-200 shadow-2xl backdrop-blur-xl"
                              >
                                <a
                                  href={activeProject.sourceUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  onClick={() =>
                                    trackEvent("projects_open_source", {
                                      project_slug: activeProject.slug,
                                      source: "desktop_preview",
                                    })
                                  }
                                >
                                  <Github className="w-5 h-5" />
                                  <span className="sr-only">
                                    View source for {activeProject.title} on GitHub
                                  </span>
                                </a>
                              </Button>
                            </MagneticWrapper>
                          )}
                        </div>
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
              </AnimatePresence>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                No projects to show yet — check back soon.
              </div>
            )}
          </div>
        </div>

        {/* Mobile project cards.
            These used to live in a `max-h-[82vh] overflow-y-auto` pane. Nesting a
            scroll container inside the page scroll traps the finger on touch and
            hides the rest of the list behind an edge with no affordance, so the
            cards now flow in the page and a "show more" control keeps the section
            short instead. */}
        <div className="lg:hidden mt-8 sm:mt-12">
          {filteredProjects.length > 0 ? (
            <>
              <div className="space-y-4 sm:space-y-6">
                {visibleMobileProjects.map((project, index) => (
                  <MobileProjectCard
                    key={project.id + "-mobile"}
                    project={project}
                    index={index}
                    isRouteTransitioning={isRouteTransitioning}
                    failedImages={failedImages}
                    loadedImages={loadedImages}
                    markImageLoaded={markImageLoaded}
                    markImageFailed={markImageFailed}
                  />
                ))}
              </div>

              {hiddenMobileCount > 0 && (
                <div className="mt-6 flex justify-center">
                  <Button
                    variant="outline"
                    onClick={() => setShowAllMobile(true)}
                    className="rounded-full h-11 px-6 text-sm font-semibold border-neutral-300 dark:border-neutral-700"
                  >
                    Show {hiddenMobileCount} more{" "}
                    {hiddenMobileCount === 1 ? "project" : "projects"}
                  </Button>
                </div>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
              No projects to show yet — check back soon.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
