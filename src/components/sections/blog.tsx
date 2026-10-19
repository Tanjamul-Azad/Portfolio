"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { blogPosts } from "@/data";
import { SECTION_REVEAL } from "@/lib";
import { SectionHeading } from "@/components/common";
import { BlogCard } from "@/components/common/blog-card";
import { useRouteTransitioning } from "@/components/providers/page-transition";

export function Blog() {
  const recentPosts = blogPosts.slice(0, 4);
  const { isRouteTransitioning } = useRouteTransitioning();
  if (!recentPosts.length) return null;

  return (
    <section id="blog" className="scroll-section section-y relative">
      <div className="shell">
        <SectionHeading index="08" eyebrow="Blog & Notes" title="Latest writing" action={
          <Link href="/blog" className="group inline-flex h-11 items-center gap-1.5 self-start rounded-full border border-line-strong bg-surface/60 px-4 text-[13px] font-medium text-foreground transition-colors hover:bg-surface-2 sm:h-10 md:self-auto">
            All posts<ArrowUpRight className="size-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </Link>
        } />
        <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6">
          {recentPosts.map((post, index) => (
            <motion.li key={post.slug} variants={SECTION_REVEAL.item} initial="hidden"
              whileInView={isRouteTransitioning ? undefined : "visible"} viewport={{ once: true }}
              transition={{ delay: index * 0.06 }} className="min-w-0">
              <BlogCard post={post} />
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
