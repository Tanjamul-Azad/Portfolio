"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink, Github, FileText, Search } from "lucide-react";
import { projects } from "@/data/projects";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { trackEvent } from "@/lib/telemetry";
import { MOTION_TOKENS } from "@/lib";
import { useRouteTransitioning } from "@/components/providers/page-transition";

export function Projects() {
  const { isRouteTransitioning } = useRouteTransitioning();
  const [hoveredProject, setHoveredProject] = useState<string | null>(projects[0]?.id || null);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTag, setActiveTag] = useState<string>("All");
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const searchInputRef = useRef<HTMLInputElement>(null);
  const projectLinkRefs = useRef<Array<HTMLAnchorElement | null>>([]);

  const allTags = [
    "All",
    ...Array.from(new Set(projects.flatMap((project) => project.tags))).slice(0, 8),
  ];

  const filteredProjects = projects.filter((project) => {
    const matchesSearch =
      searchTerm.trim().length === 0 ||
      project.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

    const matchesTag = activeTag === "All" || project.tags.includes(activeTag);
    return matchesSearch && matchesTag;
  });

  const activeProject =
    filteredProjects.length === 0
      ? null
      : filteredProjects.find((p) => p.id === hoveredProject) || filteredProjects[0];

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

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "/") return;
      const target = event.target as HTMLElement | null;
      const tag = target?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea" || target?.isContentEditable) return;

      event.preventDefault();
      searchInputRef.current?.focus();
      trackEvent("projects_search_shortcut", { key: "/" });
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

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
    projectLinkRefs.current[nextIndex]?.focus();
  };

  return (
    <section id="projects" className="scroll-section py-28 relative bg-neutral-50 dark:bg-neutral-950 overflow-hidden min-h-screen flex items-center">

      <div className="container px-6 mx-auto relative">
        {/* Header */}
        <div className="mb-16">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-sm text-neutral-500 dark:text-neutral-400 tracking-[0.16em] uppercase font-medium"
          >
            Selected Projects
          </motion.span>

          <div className="mt-6 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full lg:max-w-sm">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  const nextValue = e.target.value;
                  setSearchTerm(nextValue);
                  trackEvent("projects_search_changed", {
                    query_length: nextValue.length,
                  });
                }}
                placeholder="Search projects or tech stack"
                className="w-full rounded-full border border-neutral-300/70 bg-white/80 py-2.5 pl-10 pr-4 text-sm text-neutral-800 placeholder:text-neutral-400 backdrop-blur dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-200"
                aria-label="Search projects"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => {
                const isActive = tag === activeTag;
                return (
                  <button
                    key={tag}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setActiveTag(tag);
                      trackEvent("projects_filter_tag", { tag });
                    }}
                    className={`rounded-full px-3 py-2 min-h-10 text-xs font-medium transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/70 ${
                      isActive
                        ? "bg-amber-500 text-black"
                        : "bg-white/80 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:bg-neutral-800"
                    }`}
                  >
                    {tag}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Side - Project List */}
          <div
            className="space-y-0"
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
            aria-label="Project list"
          >
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={isRouteTransitioning ? undefined : { opacity: 1, x: 0 }}
                transition={{ duration: MOTION_TOKENS.duration.slow, delay: index * MOTION_TOKENS.stagger.regular, ease: MOTION_TOKENS.easing.premium }}
                viewport={{ once: true }}
                className="group relative"
                onMouseEnter={() => setHoveredProject(project.id)}
              >
                <Link
                  ref={(element) => {
                    projectLinkRefs.current[index] = element;
                  }}
                  href={`/projects/${project.slug}`}
                  onFocus={() => setHoveredProject(project.id)}
                  onClick={() =>
                    trackEvent("projects_open_case_study", {
                      project_slug: project.slug,
                      source: "desktop_list",
                    })
                  }
                  className={`block py-6 cursor-pointer transition-all duration-500 ${hoveredProject === project.id
                    ? "opacity-100"
                    : "opacity-40 hover:opacity-70"
                    }`}
                >
                  <div className="flex items-start gap-4">
                    {/* Index number */}
                    <span className={`font-mono text-sm mt-2 transition-colors duration-300 ${hoveredProject === project.id
                      ? "text-amber-500"
                      : "text-neutral-400 dark:text-neutral-600"
                      }`}>
                      _{(index + 1).toString().padStart(2, "0")}.
                    </span>

                    {/* Project info */}
                    <div className="grow">
                      <div className="flex items-center gap-3">
                        <h3 className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-500 ${hoveredProject === project.id
                          ? "text-neutral-900 dark:text-white"
                          : "text-neutral-700 dark:text-neutral-400"
                          }`}>
                          {project.title}
                        </h3>
                        <ArrowUpRight className={`w-6 h-6 transition-all duration-300 ${hoveredProject === project.id
                          ? "text-amber-500 opacity-100 translate-x-0"
                          : "text-neutral-400 opacity-0 -translate-x-2"
                          }`} />
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-3">
                        {project.tags.slice(0, 4).map((tag, tagIndex) => (
                          <span
                            key={tag}
                            className={`text-sm transition-colors duration-300 ${hoveredProject === project.id
                              ? "text-neutral-600 dark:text-neutral-400"
                              : "text-neutral-400 dark:text-neutral-600"
                              }`}
                          >
                            {tag}
                            {tagIndex < Math.min(project.tags.length, 4) - 1 && (
                              <span className="ml-4 text-neutral-300 dark:text-neutral-700">•</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>

          {/* Right Side - Project Preview Image */}
          <div className="hidden lg:block sticky top-32">
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
                {/* Image container */}
                <div className="relative rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-sm">
                  {/* Browser-like header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-neutral-800/20 border-b border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-sm">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                      <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <div className="grow flex justify-center">
                      <div className="px-4 py-1 bg-white dark:bg-neutral-900 rounded-md text-xs text-neutral-400 font-mono">
                        {activeProject?.title.toLowerCase().replace(/\s+/g, '-')}.app
                      </div>
                    </div>
                  </div>

                  {/* Project image/preview */}
                  <div className="aspect-4/3 relative bg-neutral-100 dark:bg-neutral-900">
                    {/* Actual screenshot — visible when file exists, hidden on 404 */}
                    {activeProject?.image && !failedImages[activeProject.id] && (
                      <>
                        <AnimatePresence>
                          {!loadedImages[activeProject.id] && (
                            <motion.div
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
                              className="absolute inset-0 animate-pulse bg-neutral-200/70 dark:bg-neutral-800/70"
                            />
                          )}
                        </AnimatePresence>
                        <Image
                          src={activeProject.image}
                          alt={activeProject.title}
                          fill
                          sizes="(min-width: 1024px) 50vw, 100vw"
                          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-300 ${loadedImages[activeProject.id] ? "opacity-100" : "opacity-0"}`}
                          onLoad={() => markImageLoaded(activeProject.id)}
                          onError={() => markImageFailed(activeProject.id)}
                          priority={activeProject.featured}
                        />
                      </>
                    )}
                    {/* Placeholder with project branding */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8">
                      {/* Decorative grid */}
                      <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]"
                        style={{
                          backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
                          backgroundSize: '40px 40px'
                        }}
                      />

                      {/* Project showcase */}
                      <motion.div
                        key={activeProject?.id + '-content'}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: MOTION_TOKENS.duration.regular, duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
                        className="relative z-10 text-center"
                      >
                        {/* Large project initial/logo */}
                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center">
                          <span className="text-4xl font-bold text-white dark:text-neutral-900">
                            {activeProject?.title.substring(0, 1)}
                          </span>
                        </div>

                        <h4 className="text-2xl font-bold text-neutral-800 dark:text-white mb-3">
                          {activeProject?.title}
                        </h4>
                        <p className="text-sm text-neutral-500 dark:text-neutral-400 max-w-sm mx-auto mb-4">
                          {activeProject?.description}
                        </p>

                        {/* Role badge */}
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-200 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-neutral-500" />
                          {activeProject?.role}
                        </span>

                        {/* Impact stat */}
                        <p className="mt-4 text-xs text-neutral-400 dark:text-neutral-500 italic">
                          "{activeProject?.impact}"
                        </p>

                        {/* Action buttons */}
                        <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
                          {activeProject?.liveUrl && activeProject.liveUrl !== '#' && (
                            <Button
                              asChild
                              size="sm"
                              className="group rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.98] transition-all duration-200"
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
                                <ExternalLink className="w-3.5 h-3.5 mr-1.5" />
                                Live Demo
                              </a>
                            </Button>
                          )}
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="group rounded-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 font-medium active:scale-[0.98] transition-all duration-200"
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
                              <FileText className="w-3.5 h-3.5 mr-1.5" />
                              Case Study
                            </Link>
                          </Button>
                          {activeProject?.sourceUrl && activeProject.sourceUrl !== '#' && (
                            <Button
                              asChild
                              size="icon"
                              variant="ghost"
                              className="group rounded-full w-8 h-8 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all duration-200"
                            >
                              <a
                                href={activeProject.sourceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                title="View Source"
                                onClick={() =>
                                  trackEvent("projects_open_source", {
                                    project_slug: activeProject.slug,
                                    source: "desktop_preview",
                                  })
                                }
                              >
                                <Github className="w-4 h-4" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    </div>

                  </div>
                </div>
              </motion.div>
              </AnimatePresence>
            ) : (
              <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                No projects matched your filters. Try a different keyword or tag.
              </div>
            )}
          </div>
        </div>

        {/* Mobile Project Cards */}
        <div className="lg:hidden mt-12 space-y-6">
          {filteredProjects.map((project, index) => (
            <motion.div
              key={project.id + '-mobile'}
              initial={{ opacity: 0, y: 20 }}
              whileInView={isRouteTransitioning ? undefined : { opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-900 shadow-lg">
                {/* Image area - clickable to case study */}
                <Link href={`/projects/${project.slug}`} className="block">
                  <div className="aspect-video relative bg-neutral-100 dark:bg-neutral-900 group overflow-hidden">
                    {project.image && !failedImages[project.id] && (
                      <>
                        <AnimatePresence>
                          {!loadedImages[project.id] && (
                            <motion.div
                              initial={{ opacity: 1 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: MOTION_TOKENS.duration.medium, ease: MOTION_TOKENS.easing.premium }}
                              className="absolute inset-0 animate-pulse bg-neutral-200/70 dark:bg-neutral-800/70"
                            />
                          )}
                        </AnimatePresence>
                        <Image
                          src={project.image}
                          alt={project.title}
                          fill
                          sizes="(max-width: 1024px) 100vw, 50vw"
                          className={`absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition-transform duration-500 ${loadedImages[project.id] ? "opacity-100" : "opacity-0"}`}
                          onLoad={() => markImageLoaded(project.id)}
                          onError={() => markImageFailed(project.id)}
                        />
                      </>
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-xl bg-neutral-900 dark:bg-neutral-100 flex items-center justify-center transition-transform">
                        <span className="text-2xl font-bold text-white dark:text-neutral-900">
                          {project.title.substring(0, 1)}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>

                {/* Content */}
                <div className="p-5">
                  <Link href={`/projects/${project.slug}`} className="block group">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-neutral-700 dark:group-hover:text-neutral-200 transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-neutral-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </div>
                  </Link>
                  <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-3">
                    {project.description}
                  </p>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 rounded-md"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                  {/* Action buttons for mobile */}
                  <div className="flex items-center gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800">
                    {project.liveUrl && project.liveUrl !== '#' && (
                      <Button
                        asChild
                        size="sm"
                        className="group flex-1 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 text-xs font-medium hover:bg-neutral-800 dark:hover:bg-neutral-200 active:scale-[0.97] transition-all duration-200"
                      >
                        <a
                          href={project.liveUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent("projects_open_live_demo", {
                              project_slug: project.slug,
                              source: "mobile_card",
                            })
                          }
                        >
                          <ExternalLink className="w-3 h-3 mr-1" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="group flex-1 rounded-full border-neutral-300 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-medium active:scale-[0.97] transition-all duration-200"
                    >
                      <Link
                        href={`/projects/${project.slug}`}
                        onClick={() =>
                          trackEvent("projects_open_case_study", {
                            project_slug: project.slug,
                            source: "mobile_card",
                          })
                        }
                      >
                        <FileText className="w-3 h-3 mr-1" />
                        Case Study
                      </Link>
                    </Button>
                    {project.sourceUrl && project.sourceUrl !== '#' && (
                      <Button
                        asChild
                        size="icon"
                        variant="ghost"
                        className="group rounded-full w-8 h-8 shrink-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 active:scale-95 transition-all duration-200"
                      >
                        <a
                          href={project.sourceUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() =>
                            trackEvent("projects_open_source", {
                              project_slug: project.slug,
                              source: "mobile_card",
                            })
                          }
                        >
                          <Github className="w-4 h-4" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}

          {filteredProjects.length === 0 && (
            <div className="rounded-2xl border border-dashed border-neutral-300 p-8 text-center text-sm text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
              No projects matched your filters. Try a different keyword or tag.
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
