"use client";

import { motion } from "framer-motion";
import { Navbar, Footer } from "@/components/layout";
import { BlogCard } from "@/components/common/blog-card";
import { blogPosts } from "@/data";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export default function BlogPageClient() {
  return (
    <main className="min-h-svh bg-background">
      <Navbar />
      <section className="relative overflow-hidden pb-10 pt-24 sm:pb-14 sm:pt-28 md:pt-32">
        <div className="shell relative">
          <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="max-w-3xl">
            <motion.p variants={fadeInUp} className="eyebrow mb-4">Blog & Notes</motion.p>
            <motion.h1 variants={fadeInUp} className="mb-5 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl md:text-5xl">
              Research, systems & things I learn.
            </motion.h1>
            <motion.p variants={fadeInUp} className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              Notes on AI research, intelligent systems, and the engineering behind the projects I build.
            </motion.p>
          </motion.div>
        </div>
      </section>
      <section className="pb-16 sm:pb-24" aria-labelledby="all-posts-heading">
        <div className="shell">
          <h2 id="all-posts-heading" className="eyebrow mb-6">All articles · {blogPosts.length}</h2>
          <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
            {blogPosts.map((post, index) => (
              <li key={post.slug} className="min-w-0"><BlogCard post={post} priority={index === 0} /></li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </main>
  );
}
