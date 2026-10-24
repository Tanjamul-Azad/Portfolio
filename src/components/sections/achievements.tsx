"use client";

import { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { ArrowUpRight, ExternalLink, Award, Trophy, Star, ChevronDown, RotateCw, X as XIcon } from "lucide-react";
import Image from "@/components/common/site-image";
import { achievements } from "@/data";
import { SectionHeading } from "@/components/common";
import { cn } from "@/lib/utils";
import type { Achievement } from "@/types";
import styles from "./achievements.module.css";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";

const TYPE_ICON = {
  certification: Award,
  award: Trophy,
  achievement: Star,
} as const;

const TYPE_LABEL = {
  certification: "Certification",
  award: "Award",
  achievement: "Achievement",
} as const;

const THUMB_SIZES = "(min-width: 1280px) 260px, (min-width: 1024px) 30vw, (min-width: 640px) 46vw, 84vw";

/**
 * Thumbnail image with a branded fallback when no picture is set.
 *
 * When a `momentImage` (a photo from the actual ceremony/ ­submission moment)
 * is also present, hovering flips the card to reveal it — a 3D rotation built
 * from two backface-hidden faces rather than a crossfade, so it reads as one
 * physical card turning over rather than two images swapping. Touch devices
 * have no hover, so the same photo is offered again in the detail dialog
 * (AchievementDialog) rather than only living behind a gesture nobody there
 * can make.
 */
function AchievementThumb({ achievement }: { achievement: Achievement }) {
  const TypeIcon = TYPE_ICON[achievement.type];

  if (achievement.image && achievement.momentImage) {
    return (
      <div className="absolute inset-0 [perspective:1200px]">
        <div className="relative h-full w-full transition-transform duration-700 ease-out [transform-style:preserve-3d] motion-safe:group-hover:[transform:rotateY(180deg)] motion-reduce:transition-none">
          <div className="absolute inset-0 [backface-visibility:hidden]">
            <Image
              src={achievement.image}
              alt={achievement.title}
              fill
              sizes={THUMB_SIZES}
              className="object-contain"
            />
          </div>
          <div className="absolute inset-0 [backface-visibility:hidden] [transform:rotateY(180deg)]">
            <Image
              src={achievement.momentImage}
              alt=""
              fill
              sizes={THUMB_SIZES}
              className="object-cover"
            />
          </div>
        </div>
        {/* Hints that there's a second side, for anyone who hasn't hovered yet. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-1 rounded-full bg-black/55 px-2 py-1 text-[9px] font-medium text-white opacity-80 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-0 sm:flex"
        >
          <RotateCw className="h-3 w-3" />
          Hover to flip
        </span>
      </div>
    );
  }

  if (achievement.image) {
    return (
      <Image
        src={achievement.image}
        alt={achievement.title}
        fill
        sizes={THUMB_SIZES}
        className="object-contain transition-transform duration-500 motion-safe:group-hover:scale-[1.025] motion-reduce:transition-none"
      />
    );
  }

  return (
    <div className={cn("absolute inset-0", styles.recognition)}>
      <div className="relative flex h-full flex-col items-center justify-center">
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-muted-foreground">
          {achievement.title.includes("Scholarship") ? "Academic merit" : "Competition result"}
        </span>
        <span className={cn("my-1 select-none text-5xl tracking-[-0.06em]", styles.result)}>
          {achievement.title.match(/^\d+(?:%|st|nd|rd|th)?/)?.[0] || <TypeIcon className="h-9 w-9" />}
        </span>
        <span className="h-px w-7 bg-accent/70" aria-hidden="true" />
      </div>
    </div>
  );
}

function AchievementCard({
  achievement,
  index,
  onOpen,
}: {
  achievement: Achievement;
  index: number;
  onOpen: () => void;
}) {
  const reducedMotion = useReducedMotion();
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const rotateX = useSpring(tiltX, { stiffness: 210, damping: 24 });
  const rotateY = useSpring(tiltY, { stiffness: 210, damping: 24 });

  function resetTilt() {
    tiltX.set(0);
    tiltY.set(0);
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: reducedMotion ? 0 : 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: Math.min(index, 6) * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="group h-full w-[84%] max-w-[22rem] min-w-0 shrink-0 snap-start [perspective:1000px] sm:w-[46%] lg:w-auto lg:max-w-none"
    >
      <motion.button
        type="button"
        onClick={onOpen}
        onPointerMove={(event) => {
          if (reducedMotion || event.pointerType !== "mouse") return;
          const rect = event.currentTarget.getBoundingClientRect();
          tiltX.set(((event.clientY - rect.top) / rect.height - 0.5) * -4);
          tiltY.set(((event.clientX - rect.left) / rect.width - 0.5) * 4);
        }}
        onPointerLeave={resetTilt}
        onBlur={resetTilt}
        style={{ rotateX, rotateY }}
        aria-label={`Details: ${achievement.title}`}
        aria-haspopup="dialog"
        className={cn("surface flex h-full w-full flex-col overflow-hidden text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background", styles.card)}
      >
        <div className={cn("relative aspect-16/10 w-full shrink-0 overflow-hidden border-b border-line", styles.display)}>
          <div className={cn("absolute inset-[9px]", achievement.image && styles.document)}>
            <AchievementThumb achievement={achievement} />
          </div>
          <span className={styles.sheen} aria-hidden="true" />
          {achievement.credentialUrl && (
            <span className="absolute right-2 top-2 rounded-full bg-amber-400 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">
              Verified
            </span>
          )}
        </div>

        <div className="flex min-w-0 flex-1 flex-col px-3.5 pt-3.5">
          <div className="mb-2 flex items-center justify-between gap-3 text-muted-foreground">
            <span className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.16em]"><span className="h-1 w-1 rounded-full bg-accent/80" aria-hidden="true" />{TYPE_LABEL[achievement.type]}</span>
            <span className="font-mono text-[10px]">{achievement.date}</span>
          </div>
          <h3 className="line-clamp-3 min-h-10 text-sm font-semibold leading-5 tracking-[-0.01em] text-foreground">
            {achievement.title}
          </h3>

          <p className="mt-1 truncate text-[11px] text-muted-foreground">
            {achievement.issuer}
          </p>

          <div className="mt-auto pt-3">
            <span className="flex min-h-11 items-center justify-between gap-2 border-t border-line text-xs font-medium text-foreground">
              Details
              <span className={cn("flex h-6 w-6 items-center justify-center rounded-full border border-line text-muted-foreground", styles.arrow)}><ArrowUpRight className="h-3 w-3" aria-hidden="true" /></span>
            </span>
          </div>
        </div>
      </motion.button>
    </motion.li>
  );
}

/** Click-to-open detail view with the full image and all metadata. */
function AchievementDialog({
  achievement,
  onClose,
}: {
  achievement: Achievement | null;
  onClose: () => void;
}) {
  const TypeIcon = achievement ? TYPE_ICON[achievement.type] : Star;
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);

  // The lightbox is local to whichever achievement is open, so switching
  // achievements (or closing) can't leave a stale image behind.
  useEffect(() => {
    setLightboxSrc(null);
  }, [achievement]);

  // Portal target: document.body only exists on the client, so this flips true
  // one tick after mount rather than being read during render.
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Dialog open={!!achievement} onOpenChange={(open) => !open && onClose()}>
      {/* overflow was set twice on the same element (hidden + y-auto); which
          axis won depended on generated CSS order, so it is now per-axis. */}
      <DialogContent
        className="max-h-[90vh] max-w-2xl gap-0 overflow-x-hidden overflow-y-auto overscroll-contain p-0"
      >
        {achievement && (
          <>
            {/* Full image (contained, so certificates are fully readable) */}
            <div className="relative aspect-video w-full bg-neutral-100 dark:bg-neutral-950">
              {achievement.image ? (
                <Image
                  src={achievement.image}
                  alt={achievement.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 42rem"
                  className="object-contain"
                />
              ) : <AchievementThumb achievement={achievement} />}
            </div>

            {achievement.image && (
              <a
                href={achievement.image}
                target="_blank"
                rel="noopener noreferrer"
                className="flex min-h-11 items-center justify-between gap-3 border-b border-line px-6 text-xs font-medium text-foreground hover:text-accent"
              >
                Open full image
                <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
              </a>
            )}

            {/* The ceremony/moment photo, offered again here so touch visitors —
                who have no hover — still get to see it, not just the certificate. */}
            {achievement.momentImage && (
              <div className="relative aspect-video w-full border-t border-neutral-200 bg-neutral-100 dark:border-neutral-800 dark:bg-neutral-950">
                <Image
                  src={achievement.momentImage}
                  alt={`${achievement.title} — the moment`}
                  fill
                  sizes="(max-width: 768px) 100vw, 42rem"
                  className="object-cover"
                />
                <span className="absolute left-3 top-3 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-medium uppercase tracking-wide text-white backdrop-blur-sm">
                  The moment
                </span>
              </div>
            )}

            {achievement.gallery && achievement.gallery.length > 0 && (
              <div className="border-t border-neutral-200 p-4 dark:border-neutral-800">
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  Gallery
                </p>
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {achievement.gallery.map((src, i) => (
                    <button
                      key={`${src}-${i}`}
                      type="button"
                      onClick={() => setLightboxSrc(src)}
                      className="relative aspect-square overflow-hidden rounded-lg bg-neutral-100 outline-none transition-transform hover:scale-[1.03] focus-visible:ring-2 focus-visible:ring-amber-500/70 dark:bg-neutral-950"
                    >
                      <Image
                        src={src}
                        alt={`${achievement.title} — photo ${i + 1}`}
                        fill
                        sizes="120px"
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="p-6">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.14em] text-accent">
                  <TypeIcon className="h-3.5 w-3.5" />
                  {TYPE_LABEL[achievement.type]}
                </span>
                {achievement.credentialUrl && (
                  <span className="rounded-full bg-amber-500 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-black">
                    Verified
                  </span>
                )}
              </div>

              <DialogTitle className="text-xl font-bold leading-tight text-neutral-900 md:text-2xl dark:text-white">
                {achievement.title}
              </DialogTitle>
              <DialogDescription className="mt-1.5 text-sm text-neutral-500 dark:text-neutral-400">
                {achievement.issuer} · {achievement.date}
              </DialogDescription>

              <p className="mt-4 text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                {achievement.description}
              </p>

              {achievement.details && (
                <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-neutral-600 dark:text-neutral-300">
                  {achievement.details}
                </p>
              )}

              <div className="mt-5">
                <p className="mb-2 text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400">
                  Skills
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {achievement.skills.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-neutral-200 bg-neutral-100 px-2.5 py-1 text-[11px] text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {achievement.credentialUrl ? (
                <a
                  href={achievement.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-neutral-800 dark:bg-white dark:text-black dark:hover:bg-neutral-200"
                >
                  Verify Credential
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              ) : null}
            </div>
          </>
        )}
      </DialogContent>

      {/* Full-screen preview for a gallery photo, portaled straight to
          document.body. Rendered inline it inherited the CSS transform on the
          section's scroll-reveal wrapper a few ancestors up, which retargets
          `position: fixed` to that ancestor instead of the viewport — the
          overlay was fixed, just not to the screen. Kept as a sibling of
          DialogContent rather than nested inside it: Radix Dialog only
          manages one focus trap, and a second dialog-like layer inside it
          isn't worth fighting that for something this simple. Escape and a
          backdrop click both close it. */}
      {mounted && createPortal(
      <AnimatePresence>
        {lightboxSrc && (
          <motion.div
            role="dialog"
            aria-modal="true"
            aria-label="Photo preview"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-100 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
            onClick={() => setLightboxSrc(null)}
            onKeyDown={(e) => e.key === "Escape" && setLightboxSrc(null)}
            tabIndex={-1}
            ref={(node) => node?.focus()}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative h-[85vh] w-full max-w-3xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={lightboxSrc} alt="" fill sizes="768px" className="object-contain" />
            </motion.div>
            <button
              type="button"
              onClick={() => setLightboxSrc(null)}
              aria-label="Close photo preview"
              className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white backdrop-blur-md hover:bg-white/20"
            >
              <XIcon className="h-5 w-5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>,
      document.body
      )}
    </Dialog>
  );
}

const VISIBLE_LIMIT = 6;

export function Achievements() {
  const [filter, setFilter] = useState<"all" | Achievement["type"]>("all");
  const [selected, setSelected] = useState<Achievement | null>(null);
  const [showAll, setShowAll] = useState(false);
  const carousel = useRef<HTMLUListElement>(null);
  const [slide, setSlide] = useState(0);
  const hintId = useId();

  // Reset after the filtered cards have committed. Resetting in the click
  // handler lets scroll-snap preserve an old card when new ones precede it.
  useEffect(() => {
    carousel.current?.scrollTo({ left: 0, behavior: "instant" });
  }, [filter, showAll]);

  const filteredAchievements =
    filter === "all" ? achievements : achievements.filter((a) => a.type === filter);

  const visibleAchievements = showAll
    ? filteredAchievements
    : filteredAchievements.slice(0, VISIBLE_LIMIT);
  const hiddenCount = filteredAchievements.length - visibleAchievements.length;

  // Counts live on the filter chips themselves — that replaces the separate
  // stats block, and an empty category simply has no chip.
  const filters = (
    [
      { label: "All", value: "all" },
      { label: "Awards", value: "award" },
      { label: "Achievements", value: "achievement" },
      { label: "Certifications", value: "certification" },
    ] as { label: string; value: "all" | Achievement["type"] }[]
  )
    .map((f) => ({
      ...f,
      count: f.value === "all" ? achievements.length : achievements.filter((a) => a.type === f.value).length,
    }))
    .filter((f) => f.value === "all" || f.count > 0);

  return (
    <section id="achievements" className="scroll-section section-y relative">
      <div className="shell">
        <SectionHeading
          index="07"
          eyebrow="Recognition"
          title={
            <>
              Achievements &amp; awards
            </>
          }
          description="Selected recognition from projects, competitions and academics."
        />

        {filters.length > 2 && (
          <div className="-mx-5 mb-5 overflow-x-auto px-5 [scrollbar-width:none] sm:mx-0 sm:px-0 [&::-webkit-scrollbar]:hidden">
            <div role="group" aria-label="Filter achievements" className="flex w-max gap-1 rounded-xl border border-line bg-surface/60 p-1">
              {filters.map((f) => {
                const isActive = filter === f.value;
                return (
                  <button
                    key={f.value}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => {
                      setFilter(f.value);
                      setShowAll(false);
                      setSlide(0);
                    }}
                    className="relative flex h-11 items-center gap-2 rounded-lg px-3.5 sm:h-9 text-[13px] font-medium outline-none focus-visible:ring-2 focus-visible:ring-amber-500/70"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="achievement-filter"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-foreground"
                      />
                    )}
                    <span className={cn("relative z-10", isActive ? "text-background" : "text-muted-foreground hover:text-foreground")}>
                      {f.label}
                    </span>
                    <span className={cn("relative z-10 font-mono text-[10px]", isActive ? "text-background/70" : "text-muted-foreground")}>
                      {f.count}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        <ul
          ref={carousel}
          tabIndex={0}
          aria-label="Achievements and awards"
          aria-describedby={hintId}
          onScroll={(event) => {
            const element = event.currentTarget;
            const first = element.firstElementChild as HTMLElement | null;
            if (first) setSlide(Math.max(0, Math.min(visibleAchievements.length - 1, Math.round(element.scrollLeft / (first.offsetWidth + 12)))));
          }}
          onKeyDown={(event) => {
            if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
            const element = event.currentTarget;
            if (element.scrollWidth <= element.clientWidth) return;
            event.preventDefault();
            const first = element.firstElementChild as HTMLElement | null;
            element.scrollBy({
              left: ((first?.offsetWidth || element.clientWidth) + 12) * (event.key === "ArrowRight" ? 1 : -1),
              behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
            });
          }}
          className="-mx-5 flex snap-x snap-mandatory gap-3 overflow-x-auto scroll-px-5 px-5 pb-1 outline-none focus-visible:rounded-2xl focus-visible:ring-1 focus-visible:ring-accent/40 [overflow-anchor:none] [scrollbar-width:none] sm:-mx-6 sm:scroll-px-6 sm:px-6 lg:mx-0 lg:grid lg:grid-cols-3 lg:gap-4 lg:overflow-visible lg:p-0 xl:grid-cols-4 [&::-webkit-scrollbar]:hidden"
        >
          <AnimatePresence mode="popLayout">
            {visibleAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
                onOpen={() => setSelected(achievement)}
              />
            ))}
          </AnimatePresence>
        </ul>

        <div id={hintId} className="mt-4 flex items-center gap-4 lg:hidden">
          <span className="font-mono text-[11px] tabular-nums text-foreground" aria-live="polite">
            {String(slide + 1).padStart(2, "0")}<span className="text-muted-foreground"> / {String(visibleAchievements.length).padStart(2, "0")}</span>
          </span>
          <span className="relative h-px flex-1 overflow-hidden bg-line" aria-hidden="true">
            <span className="absolute inset-y-0 left-0 bg-foreground transition-[width] duration-300 motion-reduce:transition-none" style={{ width: `${((slide + 1) / Math.max(visibleAchievements.length, 1)) * 100}%` }} />
          </span>
          <span className="eyebrow text-[10px]">Swipe</span>
          <span className="sr-only">Swipe horizontally or use the left and right arrow keys to browse achievements.</span>
        </div>

        {/* Show more / less — keeps the section compact as the list grows */}
        {(hiddenCount > 0 || showAll) && filteredAchievements.length > VISIBLE_LIMIT && (
          <div className="mt-8 flex justify-center">
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="inline-flex h-11 items-center gap-2 rounded-full border border-line-strong bg-surface/60 px-5 text-[13px] font-medium text-foreground transition-colors hover:bg-surface-2"
            >
              {showAll ? "Show less" : `Show ${hiddenCount} more`}
              <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", showAll && "rotate-180")} />
            </button>
          </div>
        )}
      </div>

      <AchievementDialog achievement={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
