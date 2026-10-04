"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/data";
import { SECTION_REVEAL } from "@/lib";
import { SectionHeading } from "@/components/common";
import { useRouteTransitioning } from "@/components/providers/page-transition";

export function Blog() {
  const recentPosts = blogPosts.slice(0, 4);
  const { isRouteTransitioning } = useRouteTransitioning();

  // Nothing to show is better handled by hiding the section than by rendering a
  // heading over an empty grid.
  if (recentPosts.length === 0) return null;

  return (
    <section id="blog" className="scroll-section section-y relative">
      <div className="shell">
        <SectionHeading
          index="07"
          eyebrow="Blog & Notes"
          title={
            <>
              Latest <em className="accent-serif">writing</em>
            </>
          }
          action={
            <Link
              href="/blog"
              className="group inline-flex h-11 items-center gap-1.5 self-start rounded-full sm:h-10 border border-line-strong bg-surface/60 px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-surface-2 md:self-auto"
            >
              All posts
              <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </Link>
          }
        />

        {/* An editorial index rather than a grid of tag-heavy cards: date,
            title and one line of excerpt per row, so four posts fit in the
            space two cards used to take. */}
        <ul className="surface divide-y divide-line overflow-hidden">
          {recentPosts.map((post, index) => (
            <motion.li
              key={post.slug}
              variants={SECTION_REVEAL.item}
              initial="hidden"
              whileInView={isRouteTransitioning ? undefined : "visible"}
              viewport={{ once: true }}
              transition={{ delay: index * 0.06 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group grid grid-cols-[minmax(0,1fr)_auto] items-start gap-x-4 gap-y-1 p-5 transition-colors hover:bg-surface-2/50 focus-visible:bg-surface-2/50 sm:p-6 md:grid-cols-[9rem_minmax(0,1fr)_auto] md:gap-x-8"
              >
                <div className="col-span-2 flex items-center gap-2 font-mono text-[11px] text-muted-foreground md:col-span-1 md:flex-col md:items-start md:gap-1 md:pt-1">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </time>
                  <span aria-hidden="true" className="md:hidden">·</span>
                  <span>{post.readTime}</span>
                </div>

                <div className="min-w-0">
                  <h3 className="text-base font-semibold leading-snug tracking-[-0.015em] text-foreground transition-colors group-hover:text-accent sm:text-lg">
                    {post.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-muted-foreground md:line-clamp-1">
                    {post.excerpt}
                  </p>
                  <div className="mt-3 hidden flex-wrap gap-1.5 sm:flex">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="chip">{tag}</span>
                    ))}
                  </div>
                </div>

                <span className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-full border border-line text-muted-foreground transition-all duration-300 group-hover:border-foreground group-hover:bg-foreground group-hover:text-background">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </Link>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
