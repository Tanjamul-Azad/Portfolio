"use client";

import { useId, useRef, useState } from "react";
import type { BlogPost } from "@/types";
import { BlogCard } from "./blog-card";

export function BlogCollection({ posts, priorityFirst = false }: { posts: BlogPost[]; priorityFirst?: boolean }) {
  const carousel = useRef<HTMLUListElement>(null);
  const [slide, setSlide] = useState(0);
  const hintId = useId();
  if (!posts.length) return null;

  return (
    <>
      <ul ref={carousel} tabIndex={0} aria-label="Articles" aria-describedby={hintId}
        onScroll={event => {
          const element = event.currentTarget;
          const first = element.firstElementChild as HTMLElement | null;
          if (first) setSlide(Math.max(0, Math.min(posts.length - 1, Math.round(element.scrollLeft / (first.offsetWidth + 12)))));
        }}
        onKeyDown={event => {
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          const element = event.currentTarget;
          if (element.scrollWidth <= element.clientWidth) return;
          event.preventDefault();
          const first = element.firstElementChild as HTMLElement | null;
          element.scrollBy({ left: ((first?.offsetWidth || element.clientWidth) + 12) * (event.key === "ArrowRight" ? 1 : -1),
            behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
        }}
        className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:p-0 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden">
        {posts.map((post, index) => (
          <li key={post.slug} className="w-[84%] max-w-[22rem] min-w-0 shrink-0 snap-start sm:w-[46%] lg:w-auto lg:max-w-none">
            <BlogCard post={post} priority={priorityFirst && index === 0} />
          </li>
        ))}
      </ul>
      <div id={hintId} className="mt-4 flex items-center gap-4 lg:hidden">
        <span className="font-mono text-[11px] tabular-nums text-foreground" aria-live="polite">
          {String(slide + 1).padStart(2, "0")}<span className="text-muted-foreground"> / {String(posts.length).padStart(2, "0")}</span>
        </span>
        <span className="relative h-px flex-1 overflow-hidden bg-line" aria-hidden="true">
          <span className="absolute inset-y-0 left-0 bg-foreground transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((slide + 1) / posts.length) * 100}%` }} />
        </span>
        <span className="eyebrow text-[10px]">Swipe</span>
        <span className="sr-only">Swipe horizontally or focus the list and use the left and right arrow keys to browse articles.</span>
      </div>
    </>
  );
}
