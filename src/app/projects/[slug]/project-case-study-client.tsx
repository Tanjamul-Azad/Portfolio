"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Github, ExternalLink, Layers, Lightbulb, Target, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProjectBySlug, projects } from "@/data/projects";
import { Navbar, Footer } from "@/components/layout";
import Link from "next/link";
import Image from "next/image";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function ProjectCaseStudy({ slug }: { slug: string }) {
  const project = getProjectBySlug(slug);
  const [imageVisible, setImageVisible] = useState(true);

  useEffect(() => {
    setImageVisible(true);
  }, [slug]);

  if (!project) {
    return (
      <main className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center p-6">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            The project you're looking for doesn't exist or has been moved.
          </p>
          <Button asChild>
            <Link href="/#projects">Back to Projects</Link>
          </Button>
        </div>
      </main>
    );
  }

  return (
    <main 
      className="bg-neutral-50 dark:bg-black min-h-screen selection:bg-amber-500/30"
      style={{ '--project-color': project.color } as React.CSSProperties}
    >
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 sm:pt-28 md:pt-32 pb-14 sm:pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[60px_60px]" />
        <div className="absolute top-1/4 right-0 w-150 h-150 bg-amber-500/10 dark:bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container px-4 sm:px-6 mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/#projects"
              scroll={false}
              className="inline-flex items-center gap-2 text-neutral-500 hover:text-amber-500 transition-colors mb-8 group"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
              Back to Projects
            </Link>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.div variants={fadeInUp} className="flex flex-wrap gap-2 mb-6">
              {project.tags.map((tag) => (
                <Badge 
                  key={tag} 
                  variant="secondary"
                  className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                >
                  {tag}
                </Badge>
              ))}
            </motion.div>

            <motion.h1 
              variants={fadeInUp}
              className="text-3xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-neutral-900 dark:text-white mb-8 tracking-tight"
            >
              {project.title}
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-base sm:text-lg md:text-2xl text-neutral-600 dark:text-neutral-300 mb-10 leading-relaxed max-w-2xl"
            >
              {project.overview || project.description}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-6 mb-12">
              <div className="flex items-center gap-3 px-5 py-2.5 rounded-full bg-white dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: project.color }} />
                <span className="text-sm font-semibold text-neutral-700 dark:text-neutral-200">{project.role}</span>
              </div>
              
              <div className="flex items-center gap-4">
                {project.liveUrl && project.liveUrl !== "#" && (
                  <Button asChild size="default" className="rounded-full shadow-lg transition-all hover:scale-105" style={{ backgroundColor: project.color }}>
                    <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                      Live Demo <ExternalLink className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
                {project.sourceUrl && project.sourceUrl !== "#" && (
                  <Button asChild size="default" variant="outline" className="rounded-full bg-white/50 dark:bg-black/50 backdrop-blur-sm border-neutral-200 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900">
                    <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                      Source Code <Github className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                )}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Hero Parallax Image */}
      {project.image && imageVisible && (
        <section className="relative h-[42vh] sm:h-[55vh] md:h-[80vh] w-full overflow-hidden">
          <motion.div 
            initial={{ scale: 1.1, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            className="absolute inset-0"
          >
            <Image
              src={project.image}
              alt={project.title}
              fill
              priority
              className="object-cover"
              onError={() => setImageVisible(false)}
            />
            <div className="absolute inset-0 bg-linear-to-b from-transparent via-neutral-50/20 to-neutral-50 dark:via-black/20 dark:to-black" />
          </motion.div>
        </section>
      )}

      {/* Problem & Solution */}
      {(project.problem || project.solution) && (
        <section className="py-20 md:py-32 bg-white dark:bg-neutral-900/50">
          <div className="container px-4 sm:px-6 mx-auto">
            <div className="grid md:grid-cols-2 gap-8 md:gap-16 max-w-6xl mx-auto">
              {project.problem && (
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative group"
                >
                  <div className="absolute -inset-4 bg-red-500/5 rounded-3xl blur-2xl group-hover:bg-red-500/10 transition-all" />
                  <div className="relative p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-black/40 backdrop-blur-xl border border-red-500/10 shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 rotate-12">
                      <Target className="w-24 h-24 text-red-500" />
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-red-500/10 flex items-center justify-center mb-8 border border-red-500/20 shadow-inner">
                      <Target className="w-7 h-7 text-red-500" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-6">The Problem</h3>
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">{project.problem}</p>
                  </div>
                </motion.div>
              )}
              {project.solution && (
                <motion.div
                  initial={{ opacity: 0, x: 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative group"
                >
                  <div className="absolute -inset-4 bg-emerald-500/5 rounded-3xl blur-2xl group-hover:bg-emerald-500/10 transition-all" />
                  <div className="relative p-6 sm:p-8 md:p-10 rounded-3xl bg-white dark:bg-black/40 backdrop-blur-xl border border-emerald-500/10 shadow-xl overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-[0.03] scale-150 -rotate-12">
                      <Lightbulb className="w-24 h-24 text-emerald-500" />
                    </div>
                    <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-8 border border-emerald-500/20 shadow-inner">
                      <Lightbulb className="w-7 h-7 text-emerald-500" />
                    </div>
                    <h3 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white mb-6">The Solution</h3>
                    <p className="text-base sm:text-lg text-neutral-600 dark:text-neutral-300 leading-relaxed font-light">{project.solution}</p>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Architecture */}
      {project.architecture && (
        <section className="py-20 md:py-32 bg-neutral-50 dark:bg-black/50 overflow-hidden">
          <div className="container px-4 sm:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="max-w-5xl mx-auto"
            >
              <div className="flex items-center gap-4 mb-10 justify-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 shadow-lg">
                  <Layers className="w-6 h-6 text-amber-500" />
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white tracking-tight">System Architecture</h2>
              </div>
              
              <div className="relative group">
                <div className="absolute -inset-1 bg-linear-to-r from-amber-500/20 to-sky-500/20 rounded-[2rem] blur-xl opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative p-5 sm:p-8 md:p-14 rounded-[2rem] bg-white dark:bg-neutral-900/80 backdrop-blur-2xl border border-neutral-200 dark:border-neutral-800 shadow-2xl">
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-mono text-sm md:text-base whitespace-pre-wrap">
                    {project.architecture}
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Key Features */}
      {project.features && project.features.length > 0 && (
        <section className="py-20 md:py-32 bg-white dark:bg-neutral-900/30 relative">
          <div className="container px-4 sm:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex flex-col items-center text-center max-w-2xl mx-auto mb-20"
            >
              <div className="w-16 h-16 rounded-3xl bg-amber-500/10 flex items-center justify-center mb-6 border border-amber-500/20">
                <Zap className="w-8 h-8 text-amber-500" />
              </div>
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-4 tracking-tight">Key Features</h2>
              <p className="text-neutral-500 dark:text-neutral-400">Innovative solutions developed to solve complex technical challenges.</p>
            </motion.div>
 
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8 max-w-7xl mx-auto">
              {project.features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="group p-5 sm:p-8 rounded-3xl bg-neutral-50 dark:bg-neutral-800/20 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-5 h-5 text-amber-500" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4 group-hover:text-amber-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 leading-relaxed text-sm lg:text-base">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Challenges & Learnings */}
      {project.challenges && project.challenges.length > 0 && (
        <section className="py-20 md:py-32 bg-neutral-50 dark:bg-black/80 backdrop-blur-sm">
          <div className="container px-4 sm:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-center mb-20"
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-neutral-900 dark:text-white tracking-tight">Challenges & Breakthroughs</h2>
            </motion.div>
 
            <div className="grid lg:grid-cols-2 gap-8 max-w-6xl mx-auto">
              {project.challenges.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex flex-col sm:flex-row gap-4 sm:gap-6 p-5 sm:p-8 rounded-[2rem] bg-white dark:bg-neutral-900/50 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/30 transition-all group"
                >
                  <span className="shrink-0 w-12 h-12 rounded-2xl bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white flex items-center justify-center text-xl font-bold border border-neutral-200 dark:border-neutral-700 group-hover:bg-amber-500 group-hover:text-black transition-colors">
                    {index + 1}
                  </span>
                  <div>
                    <h4 className="text-lg font-bold text-neutral-900 dark:text-white mb-3">
                      Challenge: {item.challenge}
                    </h4>
                    <div className="p-5 rounded-2xl bg-amber-500/[0.03] dark:bg-amber-500/[0.02] border border-amber-500/10">
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm md:text-base leading-relaxed">
                        <span className="text-amber-500 font-bold italic mr-2 text-xs uppercase tracking-widest">Growth:</span> {item.learned}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Results */}
      {project.results && project.results.length > 0 && (
        <section className="py-20 bg-neutral-100 dark:bg-neutral-950">
          <div className="container px-4 sm:px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-12"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Results & Impact</h2>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {project.results.map((result, index) => (
                <motion.div
                  key={result.metric}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 relative overflow-hidden"
                >
                  <div
                    className={`absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent to-transparent ${
                      index % 3 === 0
                        ? "via-amber-500/70"
                        : index % 3 === 1
                          ? "via-sky-500/65"
                          : "via-emerald-500/65"
                    }`}
                  />
                  <div
                    className={`text-4xl font-bold mb-2 ${
                      index % 3 === 0
                        ? "text-amber-500"
                        : index % 3 === 1
                          ? "text-sky-500"
                          : "text-emerald-500"
                    }`}
                  >
                    {result.value}
                  </div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white mb-1">{result.metric}</div>
                  {result.description && (
                    <div className="text-xs text-neutral-500 dark:text-neutral-400">{result.description}</div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Next Project */}
      <section className="py-20 bg-neutral-50 dark:bg-black">
        <div className="container px-4 sm:px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-neutral-500 mb-4">Next Project</p>
            {(() => {
              const currentIndex = projects.findIndex(p => p.slug === project.slug);
              const nextProject = projects[(currentIndex + 1) % projects.length];
              return (
                <Link 
                  href={`/projects/${nextProject.slug}`}
                  className="inline-flex items-center gap-3 text-2xl sm:text-3xl font-bold text-neutral-900 dark:text-white hover:text-amber-500 transition-colors group"
                >
                  {nextProject.title}
                  <ArrowUpRight className="w-8 h-8 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </Link>
              );
            })()}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
