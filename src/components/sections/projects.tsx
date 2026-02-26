"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, ExternalLink, Github, FileText } from "lucide-react";
import { projects } from "@/data";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Projects() {
  const [hoveredProject, setHoveredProject] = useState<string | null>(projects[0]?.id || null);

  const activeProject = projects.find(p => p.id === hoveredProject) || projects[0];

  return (
    <section id="projects" className="py-28 relative bg-neutral-100 dark:bg-neutral-950 overflow-hidden">
      {/* Subtle background accents */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-amber-500/5 dark:bg-amber-500/3 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-orange-500/5 dark:bg-orange-500/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-6 mx-auto relative">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="flex items-center gap-3 mb-4"
          >
            <Sparkles className="w-5 h-5 text-amber-500" />
            <span className="text-sm text-amber-600 dark:text-amber-400/80 tracking-[0.2em] uppercase font-medium">
              Selected Projects
            </span>
          </motion.div>
        </div>

        {/* Main Content - Split Layout */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-start">
          {/* Left Side - Project List */}
          <div className="space-y-0">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
                viewport={{ once: true }}
                className="group relative"
                onMouseEnter={() => setHoveredProject(project.id)}
              >
                <Link
                  href={`/projects/${project.slug}`}
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
                    <div className="flex-grow">
                      <div className="flex items-center gap-3">
                        <h3 className={`text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight transition-all duration-500 ${hoveredProject === project.id
                          ? "text-transparent bg-gradient-to-r from-amber-600 via-orange-600 to-amber-600 dark:from-amber-300 dark:via-orange-400 dark:to-amber-400 bg-clip-text"
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
            <AnimatePresence mode="wait">
              <motion.div
                key={activeProject?.id}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -20 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="relative"
              >
                {/* Decorative frame */}
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-500/20 via-transparent to-orange-500/20 rounded-3xl blur-2xl opacity-60" />

                {/* Image container */}
                <div className="relative rounded-2xl overflow-hidden glass shadow-2xl shadow-neutral-900/10 dark:shadow-black/30">
                  {/* Browser-like header */}
                  <div className="flex items-center gap-2 px-4 py-3 bg-white/40 dark:bg-neutral-800/20 border-b border-neutral-200/50 dark:border-neutral-700/50 backdrop-blur-sm">
                    <div className="flex gap-1.5">
                      <div className="w-3 h-3 rounded-full bg-red-400/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-400/80" />
                      <div className="w-3 h-3 rounded-full bg-green-400/80" />
                    </div>
                    <div className="flex-grow flex justify-center">
                      <div className="px-4 py-1 bg-white dark:bg-neutral-900 rounded-md text-xs text-neutral-400 font-mono">
                        {activeProject?.title.toLowerCase().replace(/\s+/g, '-')}.app
                      </div>
                    </div>
                  </div>

                  {/* Project image/preview */}
                  <div className="aspect-[4/3] relative bg-gradient-to-br from-neutral-100 via-white to-neutral-50 dark:from-neutral-900 dark:via-neutral-800 dark:to-neutral-900">
                    {/* Actual screenshot — visible when file exists, hidden on 404 */}
                    {activeProject?.image && (
                      <img
                        src={activeProject.image}
                        alt={activeProject.title}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
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
                        transition={{ delay: 0.2 }}
                        className="relative z-10 text-center"
                      >
                        {/* Large project initial/logo */}
                        <div className="w-24 h-24 mx-auto mb-6 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center shadow-lg shadow-amber-500/25">
                          <span className="text-4xl font-bold text-white">
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
                        <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-sm font-medium">
                          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
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
                              className="group rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-medium shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300"
                            >
                              <a href={activeProject.liveUrl} target="_blank" rel="noopener noreferrer">
                                <ExternalLink className="w-3.5 h-3.5 mr-1.5 group-hover:rotate-12 transition-transform duration-300" />
                                Live Demo
                              </a>
                            </Button>
                          )}
                          <Button
                            asChild
                            size="sm"
                            variant="outline"
                            className="group rounded-full border-neutral-300 dark:border-neutral-700 hover:border-amber-500/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 font-medium hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-300"
                          >
                            <Link href={`/projects/${activeProject?.slug}`}>
                              <FileText className="w-3.5 h-3.5 mr-1.5 group-hover:scale-110 transition-transform duration-300" />
                              Case Study
                            </Link>
                          </Button>
                          {activeProject?.sourceUrl && activeProject.sourceUrl !== '#' && (
                            <Button
                              asChild
                              size="icon"
                              variant="ghost"
                              className="group rounded-full w-8 h-8 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-110 active:scale-95 transition-all duration-300"
                            >
                              <a href={activeProject.sourceUrl} target="_blank" rel="noopener noreferrer" title="View Source">
                                <Github className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                              </a>
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    </div>

                    {/* Gradient overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-neutral-900 to-transparent pointer-events-none" />
                  </div>
                </div>

                {/* Floating decorative elements */}
                <div className="absolute -top-2 -right-2 w-20 h-20 bg-amber-400/20 rounded-full blur-2xl" />
                <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-orange-400/10 rounded-full blur-3xl" />
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Project Cards */}
        <div className="lg:hidden mt-12 space-y-6">
          {projects.map((project, index) => (
            <motion.div
              key={project.id + '-mobile'}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="rounded-2xl overflow-hidden border border-neutral-200/50 dark:border-neutral-800/50 bg-white dark:bg-neutral-900 shadow-lg">
                {/* Image area - clickable to case study */}
                <Link href={`/projects/${project.slug}`} className="block">
                  <div className="aspect-video relative bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-900 group overflow-hidden">
                    {project.image && (
                      <img
                        src={project.image}
                        alt={project.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        onError={(e) => {
                          (e.currentTarget as HTMLImageElement).style.display = "none";
                        }}
                      />
                    )}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                        <span className="text-2xl font-bold text-white">
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
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {project.title}
                      </h3>
                      <ArrowUpRight className="w-5 h-5 text-amber-500 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
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
                        className="group flex-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black text-xs font-medium shadow-md shadow-amber-500/20 hover:shadow-lg hover:shadow-amber-500/30 active:scale-[0.97] transition-all duration-300"
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="w-3 h-3 mr-1 group-hover:rotate-12 transition-transform duration-300" />
                          Live Demo
                        </a>
                      </Button>
                    )}
                    <Button
                      asChild
                      size="sm"
                      variant="outline"
                      className="group flex-1 rounded-full border-neutral-300 dark:border-neutral-700 hover:border-amber-500/50 text-xs font-medium active:scale-[0.97] transition-all duration-300"
                    >
                      <Link href={`/projects/${project.slug}`}>
                        <FileText className="w-3 h-3 mr-1 group-hover:scale-110 transition-transform duration-300" />
                        Case Study
                      </Link>
                    </Button>
                    {project.sourceUrl && project.sourceUrl !== '#' && (
                      <Button
                        asChild
                        size="icon"
                        variant="ghost"
                        className="group rounded-full w-8 h-8 shrink-0 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:scale-110 active:scale-95 transition-all duration-300"
                      >
                        <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
