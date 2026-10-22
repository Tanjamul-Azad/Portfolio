"use client";

import { motion } from "framer-motion";
import { Navbar, Footer } from "@/components/layout";
import { BlogCollection } from "@/components/common/blog-collection";
import { blogPosts } from "@/data";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

export default function BlogPageClient({ showAll = false }: { showAll?: boolean }) {
  const visiblePosts = showAll ? blogPosts : blogPosts.slice(0, 4);
  return (
    <main className="min-h-svh bg-background">
      <Navbar />
      <section className="relative overflow-hidden pb-8 pt-24 sm:pb-10 sm:pt-28">
        <div className="shell relative">
          <motion.div variants={staggerContainer} initial={false} animate="visible" className="max-w-3xl">
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
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 id="all-posts-heading" className="eyebrow">{showAll ? "All articles" : "Latest articles"} · {visiblePosts.length}</h2>
            {!showAll && blogPosts.length > visiblePosts.length && (
              <Link href="/blog/all" className="inline-flex min-h-11 items-center gap-1.5 rounded-full border border-line-strong px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-surface-2">
                View all<ArrowUpRight className="size-3.5" aria-hidden="true" />
              </Link>
            )}
          </div>
          <BlogCollection posts={visiblePosts} priorityFirst />
        </div>
      </section>
      <Footer />
    </main>
  );
}
