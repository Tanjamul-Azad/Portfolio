"use client";

import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { getPinnedProjects, projects } from "@/data/projects";
import { Navbar, Footer } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, ChevronLeft, ChevronRight, ExternalLink, Github, Lock, Search, Video, X } from "lucide-react";
import { siteConfig } from "@/config/site";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import type { Project } from "@/types";

const PROJECTS_PER_PAGE = 9;
type PageItem = number | "...";

/** Project thumbnail that degrades to a branded placeholder if the image is missing. */
function ProjectThumbnail({ project }: { project: Project }) {
  const [failed, setFailed] = useState(false);

  if (!project.image || failed) {
    return (
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          background: `radial-gradient(120% 120% at 30% 20%, ${project.color ?? "#525252"}33, transparent), #0a0a0a`,
        }}
      >
        <span className="text-6xl font-bold text-white/90 select-none">
          {project.title.charAt(0)}
        </span>
      </div>
    );
  }

  return (
    <Image
      src={project.image}
      alt={project.title}
      fill
      sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
      onError={() => setFailed(true)}
    />
  );
}

function getVisiblePageItems(totalPages: number, currentPage: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(totalPages - 1, currentPage + 1);

  if (start > 2) {
    items.push("...");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < totalPages - 1) {
    items.push("...");
  }

  items.push(totalPages);
  return items;
}

export default function ProjectsPageClient() {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  const pinnedSlugs = useMemo(() => new Set(getPinnedProjects().map((project) => project.slug)), []);

  const allTags = useMemo(
    () => ["All", ...Array.from(new Set(projects.flatMap((project) => project.tags))).slice(0, 10)],
    []
  );

  const querySearchTerm = searchParams.get("q") ?? "";
  const queryTagParam = searchParams.get("tag") ?? "All";
  const queryPageRaw = Number.parseInt(searchParams.get("page") ?? "1", 10);
  const queryPage = Number.isFinite(queryPageRaw) && queryPageRaw > 0 ? queryPageRaw : 1;
  const queryTag = allTags.includes(queryTagParam) ? queryTagParam : "All";

  const [searchTerm, setSearchTerm] = useState(querySearchTerm);
  const [activeTag, setActiveTag] = useState(queryTag);
  const [currentPage, setCurrentPage] = useState(queryPage);

  const filteredProjects = useMemo(() => {
    return projects.filter((project) => {
      const normalizedSearch = searchTerm.trim().toLowerCase();
      const matchesSearch =
        normalizedSearch.length === 0 ||
        project.title.toLowerCase().includes(normalizedSearch) ||
        project.description.toLowerCase().includes(normalizedSearch) ||
        project.tags.some((tag) => tag.toLowerCase().includes(normalizedSearch));

      const matchesTag = activeTag === "All" || project.tags.includes(activeTag);
      return matchesSearch && matchesTag;
    });
  }, [activeTag, searchTerm]);

  const totalPages = Math.max(1, Math.ceil(filteredProjects.length / PROJECTS_PER_PAGE));
  const hasActiveFilters = activeTag !== "All" || searchTerm.trim().length > 0;

  useEffect(() => {
    const nextSearchTerm = searchParams.get("q") ?? "";
    const nextTagParam = searchParams.get("tag") ?? "All";
    const nextTag = allTags.includes(nextTagParam) ? nextTagParam : "All";
    const nextPageRaw = Number.parseInt(searchParams.get("page") ?? "1", 10);
    const nextPage = Number.isFinite(nextPageRaw) && nextPageRaw > 0 ? nextPageRaw : 1;

    setSearchTerm((previous) => (previous === nextSearchTerm ? previous : nextSearchTerm));
    setActiveTag((previous) => (previous === nextTag ? previous : nextTag));
    setCurrentPage((previous) => (previous === nextPage ? previous : nextPage));
  }, [allTags, searchParams]);

  useEffect(() => {
    setCurrentPage((previous) => Math.min(previous, totalPages));
  }, [totalPages]);

  useEffect(() => {
    const params = new URLSearchParams(searchParams.toString());

    if (searchTerm.trim().length > 0) {
      params.set("q", searchTerm.trim());
    } else {
      params.delete("q");
    }

    if (activeTag !== "All") {
      params.set("tag", activeTag);
    } else {
      params.delete("tag");
    }

    if (currentPage > 1) {
      params.set("page", String(currentPage));
    } else {
      params.delete("page");
    }

    const nextQuery = params.toString();
    const currentQuery = searchParams.toString();

    if (nextQuery !== currentQuery) {
      const nextUrl = nextQuery.length > 0 ? `${pathname}?${nextQuery}` : pathname;
      router.replace(nextUrl, { scroll: false });
    }
  }, [activeTag, currentPage, pathname, router, searchParams, searchTerm]);

  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * PROJECTS_PER_PAGE;
    return filteredProjects.slice(start, start + PROJECTS_PER_PAGE);
  }, [currentPage, filteredProjects]);

  const pageItems = useMemo(() => getVisiblePageItems(totalPages, currentPage), [currentPage, totalPages]);

  const rangeStart = filteredProjects.length === 0 ? 0 : (currentPage - 1) * PROJECTS_PER_PAGE + 1;
  const rangeEnd = filteredProjects.length === 0 ? 0 : rangeStart + paginatedProjects.length - 1;

  const resetFilters = () => {
    setSearchTerm("");
    setActiveTag("All");
    setCurrentPage(1);
  };

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-black">
      <Navbar />

      <section className="relative overflow-hidden pb-16 sm:pb-20 pt-24 sm:pt-28 md:pt-32">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] bg-size-[60px_60px] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)]" />

        <div className="container relative mx-auto px-4 sm:px-6">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.h1
              variants={fadeInUp}
              className="mb-6 text-3xl sm:text-4xl font-bold text-neutral-900 dark:text-white md:text-5xl lg:text-6xl"
            >
              All Projects
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="mb-8 text-base sm:text-lg md:text-xl leading-relaxed text-neutral-600 dark:text-neutral-300"
            >
              Every project I&apos;ve shipped, in one place. Open any card for the full case study, or jump straight to the live preview, source code, or demo video.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-wide">
                {projects.length} Total Projects
              </Badge>
              <Badge variant="outline" className="rounded-full px-3 py-1 text-[11px] uppercase tracking-wide">
                {pinnedSlugs.size} Pinned On Homepage
              </Badge>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-6 flex flex-col gap-4">
              <div className="relative w-full md:max-w-md">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input
                  type="search"
                  value={searchTerm}
                  onChange={(event) => {
                    setSearchTerm(event.target.value);
                    setCurrentPage(1);
                  }}
                  aria-label="Search projects"
                  autoComplete="off"
                  spellCheck={false}
                  placeholder="Search by project, description, or stack"
                  className="w-full rounded-full border border-neutral-300/70 bg-white/90 py-2.5 pl-10 pr-10 text-sm text-neutral-800 placeholder:text-neutral-400 backdrop-blur-sm transition-colors focus:border-amber-500/60 dark:border-neutral-700 dark:bg-neutral-900/80 dark:text-neutral-200"
                />
                {searchTerm.length > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchTerm("");
                      setCurrentPage(1);
                    }}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full p-0.5 text-neutral-400 transition-colors hover:text-neutral-700 dark:hover:text-neutral-200"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => {
                  const isActive = tag === activeTag;

                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        setActiveTag(tag);
                        setCurrentPage(1);
                      }}
                      className={`rounded-full px-3 py-2 text-xs font-medium transition-colors ${
                        isActive
                          ? "bg-amber-500 text-black"
                          : "bg-white/85 text-neutral-600 hover:bg-neutral-100 dark:bg-neutral-900/80 dark:text-neutral-300 dark:hover:bg-neutral-800"
                      }`}
                    >
                      {tag}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-neutral-500 dark:text-neutral-400">
                <span>
                  <span role="status" aria-live="polite">
                    Showing {rangeStart}-{rangeEnd} of {filteredProjects.length} projects
                  </span>
                </span>

                {hasActiveFilters && (
                  <Button size="xs" variant="ghost" className="rounded-full" onClick={resetFilters}>
                    Clear filters
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>

          {paginatedProjects.length > 0 ? (
            <div className="mt-10 sm:mt-12 grid gap-4 max-[360px]:gap-3 sm:gap-6 md:grid-cols-2 xl:grid-cols-3">
              {paginatedProjects.map((project, index) => (
              <motion.article
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: index * 0.05 }}
                className="group relative overflow-hidden rounded-xl max-[360px]:rounded-lg sm:rounded-2xl border border-neutral-200/80 bg-white/95 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-amber-500/40 hover:shadow-xl hover:shadow-neutral-900/10 dark:border-neutral-800/90 dark:bg-neutral-950/90 dark:hover:shadow-black/40"
              >
                <div className="relative">
                  {pinnedSlugs.has(project.slug) && (
                    <span className="absolute left-3 top-3 z-20 rounded-full border border-amber-500/30 bg-amber-500/15 px-2.5 max-[360px]:px-2 py-1 max-[360px]:py-0.5 text-[10px] max-[360px]:text-[9px] font-semibold uppercase tracking-wide text-accent">
                      Pinned
                    </span>
                  )}

                  <Link href={`/projects/${project.slug}`} className="block aspect-video max-[360px]:aspect-2/1 sm:aspect-16/10 relative overflow-hidden">
                    <ProjectThumbnail project={project} />

                    <div className="absolute inset-0 bg-linear-to-t from-black/55 via-black/10 to-transparent opacity-75 transition-opacity group-hover:opacity-90" />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10 dark:ring-white/10" />

                    <span className="absolute right-3 top-3 rounded-full border border-white/40 bg-black/35 px-2.5 max-[360px]:px-2 py-1 max-[360px]:py-0.5 text-[10px] max-[360px]:text-[9px] font-semibold uppercase tracking-wide text-white backdrop-blur-sm">
                      Case Study
                    </span>
                  </Link>
                </div>

                <div className="p-4 max-[360px]:p-3 sm:p-5">
                  <div className="mb-3 max-[360px]:mb-2.5 flex flex-wrap gap-1.5 max-[360px]:gap-1">
                    {project.tags.slice(0, 3).map((tag, tagIndex) => (
                      <Badge key={tag} variant="secondary" className={`text-[10px] max-[360px]:text-[9px] uppercase tracking-wider ${tagIndex === 2 ? "max-[360px]:hidden" : ""}`}>
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <h3 className="mb-2 text-lg max-[360px]:text-base sm:text-xl font-bold text-neutral-900 transition-colors group-hover:text-accent dark:text-white">
                    <Link href={`/projects/${project.slug}`} className="inline-flex items-center gap-1.5">
                      {project.title}
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  </h3>

                  <p className="mb-4 max-[360px]:mb-3 line-clamp-2 text-sm max-[360px]:text-xs text-neutral-600 dark:text-neutral-400">
                    {project.description}
                  </p>

                  <div className="border-t border-neutral-200/80 pt-3 max-[360px]:pt-2.5 sm:pt-4 dark:border-neutral-800/90">
                    <div className="flex flex-wrap items-center gap-1.5 max-[360px]:gap-1 sm:gap-2">
                      {project.liveUrl && project.liveUrl !== "#" && (
                        <Button asChild size="xs" variant="outline" className="rounded-full max-[360px]:h-8 max-[360px]:px-2.5 max-[360px]:text-[11px]">
                          <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                            Live Preview
                          </a>
                        </Button>
                      )}

                      {project.sourcePrivate ? (
                        <Button asChild size="xs" variant="outline" className="rounded-full max-[360px]:h-8 max-[360px]:px-2.5 max-[360px]:text-[11px]">
                          <a href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent(`Source code request — ${project.title}`)}`}>
                            <Lock className="h-3 w-3" />
                            Request Source Code
                          </a>
                        </Button>
                      ) : (
                        project.sourceUrl && project.sourceUrl !== "#" && (
                          <Button asChild size="xs" variant="outline" className="rounded-full max-[360px]:h-8 max-[360px]:px-2.5 max-[360px]:text-[11px]">
                            <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                              <Github className="h-3 w-3" />
                              Source Code
                            </a>
                          </Button>
                        )
                      )}

                      {project.videoUrl && project.videoUrl !== "#" && (
                        <Button asChild size="xs" variant="outline" className="rounded-full max-[360px]:h-8 max-[360px]:px-2.5 max-[360px]:text-[11px]">
                          <a href={project.videoUrl} target="_blank" rel="noopener noreferrer">
                            <Video className="h-3 w-3" />
                            Video
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.article>
              ))}
            </div>
          ) : (
            <div className="mt-12 rounded-2xl border border-dashed border-neutral-300/80 bg-white/70 p-10 text-center dark:border-neutral-700 dark:bg-neutral-900/40">
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">No matching projects</h3>
              <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
                Try a different search keyword or select another tag filter.
              </p>
              {hasActiveFilters && (
                <Button size="sm" variant="outline" className="mt-5 rounded-full" onClick={resetFilters}>
                  Reset Filters
                </Button>
              )}
            </div>
          )}

          {totalPages > 1 && (
            <div className="mt-10 flex flex-wrap items-center justify-center gap-2">
              <Button
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                aria-label="Previous page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              {pageItems.map((item, index) => {
                if (item === "...") {
                  return (
                    <span key={`ellipsis-${index}`} className="px-1 text-sm text-neutral-400">
                      ...
                    </span>
                  );
                }

                const isActive = item === currentPage;

                return (
                  <Button
                    key={`page-${item}`}
                    size="icon-sm"
                    variant={isActive ? "default" : "outline"}
                    className={isActive ? "rounded-full bg-neutral-900 text-white dark:bg-white dark:text-neutral-900" : "rounded-full"}
                    onClick={() => setCurrentPage(item)}
                    aria-label={`Page ${item}`}
                    aria-current={isActive ? "page" : undefined}
                  >
                    {item}
                  </Button>
                );
              })}

              <Button
                size="icon-sm"
                variant="outline"
                className="rounded-full"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                aria-label="Next page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
