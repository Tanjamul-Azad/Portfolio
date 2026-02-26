"use client";

import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Github, ExternalLink, Layers, Lightbulb, Target, Trophy, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getProjectBySlug, projects } from "@/data";
import { Navbar, Footer } from "@/components/layout";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function ProjectCaseStudy() {
  const params = useParams();
  const router = useRouter();
  const project = getProjectBySlug(params.slug as string);

  if (!project) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-black">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white mb-4">Project not found</h1>
          <Button onClick={() => router.push("/")} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-neutral-50 dark:bg-black min-h-screen">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 right-0 w-[600px] h-[600px] bg-amber-500/10 dark:bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container px-6 mx-auto relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link 
              href="/#projects"
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
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6"
            >
              {project.title}
            </motion.h1>

            <motion.p 
              variants={fadeInUp}
              className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed"
            >
              {project.overview || project.description}
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap items-center gap-4 mb-8">
              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-neutral-200/50 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 text-sm">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                {project.role}
              </span>
              {project.liveUrl && project.liveUrl !== "#" && (
                <Button asChild size="sm" className="rounded-full bg-amber-500 hover:bg-amber-600 text-black">
                  <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                    Live Demo <ExternalLink className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              )}
              {project.sourceUrl && project.sourceUrl !== "#" && (
                <Button asChild size="sm" variant="outline" className="rounded-full">
                  <a href={project.sourceUrl} target="_blank" rel="noopener noreferrer">
                    Source Code <Github className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Project Screenshot */}
      {project.image && (
        <section className="bg-neutral-50 dark:bg-black py-6">
          <div className="container px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden shadow-2xl ring-1 ring-neutral-200 dark:ring-neutral-800 bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-900 dark:to-neutral-800"
            >
              <img
                src={project.image}
                alt={`${project.title} screenshot`}
                className="w-full h-auto object-cover block"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).parentElement!.style.display = "none";
                }}
              />
            </motion.div>
          </div>
        </section>
      )}

      {/* Problem & Solution */}
      {(project.problem || project.solution) && (
        <section className="py-20 bg-white dark:bg-neutral-900/50">
          <div className="container px-6 mx-auto">
            <div className="grid md:grid-cols-2 gap-12 max-w-5xl mx-auto">
              {project.problem && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5 }}
                  className="p-8 rounded-2xl bg-red-50 dark:bg-red-500/10 border border-red-100 dark:border-red-500/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center mb-6">
                    <Target className="w-6 h-6 text-red-500" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">The Problem</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">{project.problem}</p>
                </motion.div>
              )}
              {project.solution && (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  className="p-8 rounded-2xl bg-green-50 dark:bg-green-500/10 border border-green-100 dark:border-green-500/20"
                >
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center mb-6">
                    <Lightbulb className="w-6 h-6 text-green-500" />
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-4">The Solution</h3>
                  <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed">{project.solution}</p>
                </motion.div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Architecture */}
      {project.architecture && (
        <section className="py-20 bg-neutral-50 dark:bg-black">
          <div className="container px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="max-w-4xl mx-auto"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                  <Layers className="w-5 h-5 text-amber-500" />
                </div>
                <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Architecture</h2>
              </div>
              <div className="p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800">
                <p className="text-neutral-600 dark:text-neutral-300 leading-relaxed font-mono text-sm">
                  {project.architecture}
                </p>
              </div>
            </motion.div>
          </div>
        </section>
      )}

      {/* Key Features */}
      {project.features && project.features.length > 0 && (
        <section className="py-20 bg-white dark:bg-neutral-900/50">
          <div className="container px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-12"
            >
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <Zap className="w-5 h-5 text-amber-500" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Key Features</h2>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
              {project.features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 hover:border-amber-500/50 transition-colors group"
                >
                  <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2 group-hover:text-amber-500 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
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
        <section className="py-20 bg-neutral-50 dark:bg-black">
          <div className="container px-6 mx-auto">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="flex items-center gap-3 mb-12"
            >
              <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-purple-500" />
              </div>
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-white">Challenges & What I Learned</h2>
            </motion.div>

            <div className="space-y-6 max-w-4xl mx-auto">
              {project.challenges.map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="p-6 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800"
                >
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-white mb-2">
                        Challenge: {item.challenge}
                      </h4>
                      <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed">
                        <span className="text-green-500 font-medium">What I learned:</span> {item.learned}
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
        <section className="py-20 bg-gradient-to-br from-amber-500/10 via-orange-500/5 to-transparent dark:from-amber-500/5 dark:via-orange-500/5">
          <div className="container px-6 mx-auto">
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

            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {project.results.map((result, index) => (
                <motion.div
                  key={result.metric}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className="text-center p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg"
                >
                  <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 mb-2">
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
        <div className="container px-6 mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-neutral-500 mb-4">Next Project</p>
            {(() => {
              const currentIndex = projects.findIndex(p => p.slug === project.slug);
              const nextProject = projects[(currentIndex + 1) % projects.length];
              return (
                <Link 
                  href={`/projects/${nextProject.slug}`}
                  className="inline-flex items-center gap-3 text-3xl font-bold text-neutral-900 dark:text-white hover:text-amber-500 transition-colors group"
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
