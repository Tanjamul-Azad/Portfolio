"use client";

import type { ReactNode } from "react";
import { motion } from "framer-motion";
import { MOTION_TOKENS } from "@/lib";
import { cn } from "@/lib/utils";

interface SectionHeadingProps {
  /** Two-digit section number, e.g. "01". Rendered as a mono index. */
  index?: string;
  eyebrow: string;
  /** Plain text or JSX — wrap a word in `<em className="accent-serif">` for the serif accent. */
  title: ReactNode;
  description?: ReactNode;
  /** Optional control aligned to the heading's baseline on wide screens (e.g. "View all"). */
  action?: ReactNode;
  className?: string;
  /** Heading level id, for `aria-labelledby` on the section. */
  id?: string;
}

/**
 * The one section header used across the home page.
 *
 * Left-aligned, editorial: a mono index + hairline + eyebrow, then the title,
 * with the description and an optional action sitting to the right on wide
 * screens and stacking under the title on phones. Every section previously
 * rolled its own — centred here, left there, three eyebrow sizes, headings
 * from 2xl to 6xl — which is most of why the page read as scattered.
 */
export function SectionHeading({
  index,
  eyebrow,
  title,
  description,
  action,
  className,
  id,
}: SectionHeadingProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.4 }}
      transition={{ duration: MOTION_TOKENS.duration.slow, ease: MOTION_TOKENS.easing.premium }}
      className={cn("mb-8 sm:mb-12", className)}
    >
      <div className="mb-4 flex items-center gap-3">
        {index && <span className="eyebrow text-accent">{index}</span>}
        {index && <span aria-hidden="true" className="h-px w-8 bg-line-strong" />}
        <span className="eyebrow">{eyebrow}</span>
      </div>

      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between md:gap-12">
        <h2
          id={id}
          className="display max-w-3xl text-[clamp(2rem,6.5vw,3.75rem)] text-balance text-foreground"
        >
          {title}
        </h2>

        {(description || action) && (
          <div className="flex flex-col gap-4 md:max-w-sm md:items-end md:pb-1.5 md:text-right">
            {description && (
              <p className="text-[15px] leading-relaxed text-muted-foreground">{description}</p>
            )}
            {action}
          </div>
        )}
      </div>
    </motion.header>
  );
}

/**
 * Sets the last word of an editor-supplied heading in the serif italic, so
 * headings that come from content JSON get the same editorial accent as the
 * hand-written ones without the editor having to know about it.
 */
export function withSerifAccent(text: string): ReactNode {
  const trimmed = text.trim();
  const cut = trimmed.lastIndexOf(" ");
  if (cut === -1) return trimmed;
  return (
    <>
      {trimmed.slice(0, cut)}{" "}
      <em className="accent-serif">{trimmed.slice(cut + 1)}</em>
    </>
  );
}
