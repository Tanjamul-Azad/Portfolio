"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight, Sparkles } from "lucide-react";
import { Navbar, Footer } from "@/components/layout";
import { blogPosts } from "@/data";
import Link from "next/link";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { Badge } from "@/components/ui/badge";

export default function BlogPage() {
  const featuredPosts = blogPosts.filter(p => p.featured);

  return (
    <main className="bg-neutral-50 dark:bg-black min-h-screen">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-amber-500/10 dark:bg-amber-500/5 blur-[150px] rounded-full pointer-events-none" />
        
        <div className="container px-6 mx-auto relative">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="max-w-3xl"
          >
            <motion.div variants={fadeInUp} className="flex items-center gap-3 mb-4">
              <Sparkles className="w-5 h-5 text-amber-500" />
              <span className="text-sm text-amber-600 dark:text-amber-400/80 tracking-[0.2em] uppercase font-medium">
                Blog & Notes
              </span>
            </motion.div>
            
            <motion.h1 
              variants={fadeInUp}
              className="text-4xl md:text-5xl font-bold text-neutral-900 dark:text-white mb-6"
            >
              Thoughts, Learnings & Tutorials
            </motion.h1>
            
            <motion.p 
              variants={fadeInUp}
              className="text-xl text-neutral-600 dark:text-neutral-300"
            >
              I write about web development, AI, and things I learn while building projects.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12 bg-white dark:bg-neutral-900/50">
          <div className="container px-6 mx-auto">
            <h2 className="text-sm text-neutral-500 uppercase tracking-widest mb-8">Featured</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {featuredPosts.map((post, index) => (
                <motion.article
                  key={post.slug}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Link 
                    href={`/blog/${post.slug}`}
                    className="block p-6 rounded-2xl bg-gradient-to-br from-amber-500/5 via-orange-500/5 to-transparent border border-amber-500/20 hover:border-amber-500/40 transition-all group h-full"
                  >
                    <div className="flex flex-wrap gap-2 mb-4">
                      {post.tags.slice(0, 3).map(tag => (
                        <Badge 
                          key={tag} 
                          variant="secondary" 
                          className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20 text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    
                    <h3 className="text-xl font-bold text-neutral-900 dark:text-white mb-3 group-hover:text-amber-500 transition-colors">
                      {post.title}
                    </h3>
                    
                    <p className="text-neutral-600 dark:text-neutral-400 text-sm mb-4 line-clamp-2">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center justify-between text-xs text-neutral-500">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {post.readTime}
                        </span>
                      </div>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-amber-500" />
                    </div>
                  </Link>
                </motion.article>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-16 bg-neutral-50 dark:bg-black">
        <div className="container px-6 mx-auto">
          <h2 className="text-sm text-neutral-500 uppercase tracking-widest mb-8">All Posts</h2>
          <div className="space-y-4 max-w-3xl">
            {blogPosts.map((post, index) => (
              <motion.article
                key={post.slug}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: index * 0.05 }}
              >
                <Link 
                  href={`/blog/${post.slug}`}
                  className="flex items-center justify-between p-4 rounded-xl hover:bg-white dark:hover:bg-neutral-900 transition-all group"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-neutral-900 dark:text-white group-hover:text-amber-500 transition-colors mb-1">
                      {post.title}
                    </h3>
                    <div className="flex items-center gap-4 text-xs text-neutral-500">
                      <span>{new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-neutral-400 group-hover:text-amber-500 group-hover:translate-x-1 transition-all" />
                </Link>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
