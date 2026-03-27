"use client";

import { motion } from "framer-motion";
import { projects } from "@/data/projects";
import { Navbar, Footer } from "@/components/layout";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Github, ExternalLink } from "lucide-react";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function ProjectsPage() {
  return (
    <main className="bg-neutral-50 dark:bg-black min-h-screen">
      <Navbar />
      
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-size-[60px_60px]" />
        
        <div className="container px-6 mx-auto relative">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-4xl"
          >
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl lg:text-6xl font-bold text-neutral-900 dark:text-white mb-6"
            >
              All Projects
            </motion.h1>
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-neutral-600 dark:text-neutral-300 mb-8 leading-relaxed"
            >
              A comprehensive list of my work, ranging from full-stack applications to AI research and IoT prototypes.
            </motion.p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {projects.map((project, index) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/50 transition-all duration-300"
              >
                <Link href={`/projects/${project.slug}`} className="block aspect-video relative overflow-hidden">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-4 py-2 bg-white text-black rounded-full text-sm font-semibold flex items-center gap-2">
                      View Case Study <ArrowUpRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
                
                <div className="p-6">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tags.slice(0, 3).map(tag => (
                      <Badge key={tag} variant="secondary" className="text-[10px] uppercase tracking-wider">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-2 group-hover:text-amber-500 transition-colors">
                    <Link href={`/projects/${project.slug}`}>{project.title}</Link>
                  </h3>
                  <p className="text-neutral-600 dark:text-neutral-400 text-sm line-clamp-2 mb-6">
                    {project.description}
                  </p>
                  
                  <div className="flex items-center gap-4 mt-auto">
                    {project.sourceUrl && project.sourceUrl !== "#" && (
                      <a 
                        href={project.sourceUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <Github className="w-5 h-5" />
                      </a>
                    )}
                    {project.liveUrl && project.liveUrl !== "#" && (
                      <a 
                        href={project.liveUrl} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </a>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
