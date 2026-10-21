import Image from "@/components/common/site-image";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { BlogPost } from "@/types";

export function BlogCard({ post, priority = false }: { post: BlogPost; priority?: boolean }) {
  return (
    <article className="h-full">
      <Link href={`/blog/${post.slug}`} className="surface group flex h-full flex-col overflow-hidden transition-colors hover:border-line-strong focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-foreground">
        {post.image && (
          <div className="relative aspect-video shrink-0 overflow-hidden bg-neutral-950">
            <Image src={post.image} alt={post.imageAlt || post.title} fill
              sizes="(max-width: 639px) 84vw, (max-width: 1023px) 46vw, (max-width: 1279px) 33vw, 260px"
              priority={priority} className="object-cover transition-transform duration-500 motion-safe:group-hover:scale-[1.03]" />
          </div>
        )}
        <div className="flex flex-1 flex-col p-4">
          <div className="mb-2 flex flex-wrap items-center gap-x-2 gap-y-1 font-mono text-[10px] text-muted-foreground">
            <time dateTime={post.date}>{new Date(`${post.date}T12:00:00Z`).toLocaleDateString("en-US", {
              month: "short", day: "numeric", year: "numeric", timeZone: "UTC",
            })}</time>
            <span aria-hidden="true">·</span><span>{post.readTime}</span>
          </div>
          <h3 className="line-clamp-2 text-base font-semibold leading-snug tracking-tight text-foreground transition-colors group-hover:text-accent">{post.title}</h3>
          <p className="mt-2 line-clamp-2 text-xs leading-relaxed text-muted-foreground">{post.excerpt}</p>
          <div className="mt-auto flex items-center justify-between gap-3 pt-3 text-xs font-medium text-foreground">
            <span>Read article</span>
            <ArrowUpRight className="size-4 transition-transform motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:translate-x-0.5" aria-hidden="true" />
          </div>
        </div>
      </Link>
    </article>
  );
}
