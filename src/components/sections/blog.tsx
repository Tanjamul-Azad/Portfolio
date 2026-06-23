"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { blogPosts } from "@/data";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { SECTION_REVEAL } from "@/lib";
import { useRouteTransitioning } from "@/components/providers/page-transition";

export function Blog() {
  const recentPosts = blogPosts.slice(0, 4);
  const { isRouteTransitioning } = useRouteTransitioning();

  return (
    <section id="blog" className="scroll-section py-20 md:py-28 relative overflow-hidden">
      <div className="container px-4 sm:px-6 mx-auto">
        {/* Header */}
        <motion.div
          variants={SECTION_REVEAL.container}
          initial="hidden"
          whileInView={isRouteTransitioning ? undefined : "visible"}
          viewport={{ once: true }}
          className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div>
            <motion.div
              variants={SECTION_REVEAL.heading}
              className="mb-4"
            >
              <span className="text-sm text-neutral-500 dark:text-neutral-400 tracking-[0.16em] uppercase font-medium">
                Blog & Notes
              </span>
            </motion.div>
            <motion.h2
              variants={SECTION_REVEAL.heading}
              className="text-3xl sm:text-4xl md:text-5xl font-bold font-heading text-neutral-900 dark:text-white tracking-tight"
            >
              Latest Writings
            </motion.h2>
          </div>
          
          <motion.div
            variants={SECTION_REVEAL.heading}
          >
            <Link
              href="/blog"
              className="group inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 font-medium transition-colors"
            >
              View All Posts
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

        {/* Blog Grid — capped scroll pane on mobile so the page stays short */}
        <div className="relative">
          {/* Edge fade masks (mobile only) */}
          <div className="md:hidden pointer-events-none absolute inset-x-0 top-0 z-20 h-8 bg-linear-to-b from-white to-transparent dark:from-black" />
          <div className="md:hidden pointer-events-none absolute inset-x-0 bottom-0 z-20 h-8 bg-linear-to-t from-white to-transparent dark:from-black" />

          <div
            data-lenis-prevent
            className="grid md:grid-cols-2 gap-4 sm:gap-6 max-md:custom-scrollbar max-md:max-h-[80vh] max-md:snap-y max-md:snap-proximity max-md:overflow-y-auto max-md:py-2 max-md:pr-1"
          >
          {recentPosts.map((post, index) => (
            <motion.article
              key={post.slug}
              variants={SECTION_REVEAL.item}
              initial="hidden"
              whileInView={isRouteTransitioning ? undefined : "visible"}
              viewport={{ once: true }}
              transition={{ delay: index * 0.08 }}
              className="max-md:snap-start"
            >
              <Link
                href={`/blog/${post.slug}`}
                className={`group block h-full p-4 sm:p-6 rounded-2xl border transition-all duration-300 ${
                  post.featured
                    ? "bg-neutral-50 dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-700"
                    : "glass hover:border-neutral-300 dark:hover:border-neutral-700"
                }`}
              >
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className={`text-xs ${
                        post.featured
                          ? "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"
                          : "bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400"
                      }`}
                    >
                      {tag}
                    </Badge>
                  ))}
                  {post.featured && (
                    <Badge className="bg-amber-500 text-black text-xs">
                      Featured
                    </Badge>
                  )}
                </div>

                {/* Title */}
                <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-3 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-neutral-600 dark:text-neutral-400 text-sm leading-relaxed mb-4 line-clamp-2">
                  {post.excerpt}
                </p>

                {/* Meta */}
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-neutral-500 dark:text-neutral-500">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" />
                    {post.readTime}
                  </span>
                </div>

                {/* Read more indicator */}
                <div className="mt-4 pt-4 border-t border-neutral-200/50 dark:border-neutral-800/50 flex items-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity">
                  Read Article
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            </motion.article>
          ))}
          </div>
        </div>
      </div>
    </section>
  );
}
