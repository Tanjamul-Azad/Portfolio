"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, ExternalLink, Award, Medal, Trophy, Star, ChevronDown } from "lucide-react";
import Image from "next/image";
import { achievements } from "@/data";
import type { Achievement } from "@/types";
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

/** Thumbnail image with a branded fallback when no picture is set. */
function AchievementThumb({ achievement }: { achievement: Achievement }) {
  const TypeIcon = TYPE_ICON[achievement.type];

  if (achievement.image) {
    return (
      <Image
        src={achievement.image}
        alt={achievement.title}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
        className="object-cover transition-transform duration-500 group-hover:scale-105"
      />
    );
  }

  return (
    <div
      className="absolute inset-0 flex flex-col items-center justify-center gap-2"
      style={{
        background:
          "radial-gradient(120% 120% at 30% 20%, rgba(245,158,11,0.20), transparent), #0a0a0a",
      }}
    >
      <TypeIcon className="h-9 w-9 text-amber-400/80" />
      <span className="select-none text-3xl font-bold text-white/85">
        {achievement.title.charAt(0)}
      </span>
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
  const TypeIcon = TYPE_ICON[achievement.type];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: Math.min(index, 6) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group h-full"
    >
      <button
        type="button"
        onClick={onOpen}
        className="flex h-full w-full flex-col overflow-hidden rounded-2xl border border-neutral-200 bg-white text-left transition-all duration-300 group-hover:border-amber-500/40 group-hover:shadow-xl group-hover:shadow-amber-500/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500/50 dark:border-neutral-800 dark:bg-neutral-900"
      >
        {/* Thumbnail — the dominant visual */}
        <div className="relative aspect-16/10 w-full overflow-hidden bg-neutral-100 dark:bg-neutral-950">
          <AchievementThumb achievement={achievement} />
          <div className="absolute inset-0 ring-1 ring-inset ring-black/5 dark:ring-white/10" />
          <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-black/55 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-white backdrop-blur-sm">
            <TypeIcon className="h-3 w-3" />
            {TYPE_LABEL[achievement.type]}
          </span>
          {achievement.credentialUrl && (
            <span className="absolute right-3 top-3 rounded-full bg-amber-500 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-black">
              Verified
            </span>
          )}
        </div>

        {/* Details */}
        <div className="flex flex-1 flex-col p-5">
          <h3 className="line-clamp-2 text-base font-semibold leading-tight text-neutral-900 transition-colors duration-300 group-hover:text-accent md:text-lg dark:text-white dark:group-hover:text-amber-300">
            {achievement.title}
          </h3>

          <div className="mt-2 flex items-center gap-2 text-xs">
            <span className="truncate font-medium text-neutral-600 dark:text-neutral-300">
              {achievement.issuer}
            </span>
            <span className="h-1 w-1 shrink-0 rounded-full bg-amber-500" />
            <span className="shrink-0 text-neutral-500 dark:text-neutral-400">{achievement.date}</span>
          </div>

          <p className="mt-3 line-clamp-2 text-sm leading-relaxed text-neutral-600 dark:text-neutral-400">
            {achievement.description}
          </p>

          <div className="mt-3 flex flex-wrap gap-1.5">
            {achievement.skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-neutral-200 bg-neutral-100 px-2 py-0.5 text-[10px] text-neutral-700 dark:border-neutral-700 dark:bg-neutral-800 dark:text-neutral-300"
              >
                {skill}
              </span>
            ))}
            {achievement.skills.length > 3 && (
              <span className="rounded-full border border-amber-500/25 bg-amber-500/10 px-2 py-0.5 text-[10px] text-accent">
                +{achievement.skills.length - 3}
              </span>
            )}
          </div>

          <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-amber-600 opacity-0 transition-opacity duration-300 group-hover:opacity-100 dark:text-amber-400">
            View details
            <ArrowUpRight className="h-3.5 w-3.5" />
          </span>
        </div>
      </button>
    </motion.div>
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

  return (
    <Dialog open={!!achievement} onOpenChange={(open) => !open && onClose()}>
      {/* data-lenis-prevent: without it the smooth-scroll layer swallows wheel
          events inside the modal and the certificate can't be scrolled.
          overflow was set twice on the same element (hidden + y-auto), which
          axis won depended on generated CSS order — now stated per-axis. */}
      <DialogContent
        data-lenis-prevent
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
              ) : (
                <div
                  className="absolute inset-0 flex flex-col items-center justify-center gap-3"
                  style={{
                    background:
                      "radial-gradient(120% 120% at 30% 20%, rgba(245,158,11,0.20), transparent), #0a0a0a",
                  }}
                >
                  <TypeIcon className="h-12 w-12 text-amber-400/80" />
                  <span className="text-5xl font-bold text-white/85">
                    {achievement.title.charAt(0)}
                  </span>
                </div>
              )}
            </div>

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
              ) : (
                <span className="mt-6 inline-flex items-center rounded-full border border-neutral-300 px-4 py-2 text-xs uppercase tracking-[0.14em] text-neutral-500 dark:border-neutral-700 dark:text-neutral-400">
                  Internal Recognition
                </span>
              )}
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

const VISIBLE_LIMIT = 6;

export function Achievements() {
  const [filter, setFilter] = useState<"all" | Achievement["type"]>("all");
  const [selected, setSelected] = useState<Achievement | null>(null);
  const [showAll, setShowAll] = useState(false);

  const filteredAchievements =
    filter === "all" ? achievements : achievements.filter((a) => a.type === filter);

  const visibleAchievements = showAll
    ? filteredAchievements
    : filteredAchievements.slice(0, VISIBLE_LIMIT);
  const hiddenCount = filteredAchievements.length - visibleAchievements.length;

  const filters: { label: string; value: "all" | Achievement["type"]; icon: typeof Award }[] = [
    { label: "All", value: "all", icon: Medal },
    { label: "Certifications", value: "certification", icon: Award },
    { label: "Awards", value: "award", icon: Trophy },
    { label: "Achievements", value: "achievement", icon: Star },
  ];

  return (
    <section id="achievements" className="scroll-section py-20 md:py-28 relative overflow-hidden">
      <div className="container px-4 sm:px-6 mx-auto relative">
        {/* Header */}
        <div className="mb-12 md:mb-16 text-center">
          <motion.span
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-xs text-neutral-500 dark:text-neutral-400 tracking-[0.3em] uppercase mb-4 block"
          >
            Recognition
          </motion.span>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl md:text-6xl font-bold font-heading mb-6 text-neutral-900 dark:text-white tracking-tight"
          >
            Achievements & Awards
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Milestones from competitions, academics, and the projects I&apos;ve shipped.
            Tap any card to view the certificate and full details.
          </motion.p>
        </div>

        {/* Filter Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-wrap justify-center gap-2 mb-12"
        >
          {filters.map((f) => {
            const Icon = f.icon;
            return (
              <button
                key={f.value}
                onClick={() => {
                  setFilter(f.value);
                  setShowAll(false);
                }}
                className={`flex min-h-11 items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs sm:text-sm font-medium transition-all duration-300 ${
                  filter === f.value
                    ? "bg-amber-500 text-black"
                    : "bg-white/50 dark:bg-neutral-900/50 text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-neutral-800"
                }`}
              >
                <Icon className="w-4 h-4" />
                {f.label}
              </button>
            );
          })}
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
        </div>

        {/* Show more / less — keeps the section compact as the list grows */}
        {(hiddenCount > 0 || showAll) && filteredAchievements.length > VISIBLE_LIMIT && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mt-10 flex justify-center"
          >
            <button
              type="button"
              onClick={() => setShowAll((prev) => !prev)}
              className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/70 px-6 py-2.5 text-sm font-medium text-neutral-700 backdrop-blur-sm transition-all duration-300 hover:border-amber-500/40 hover:text-accent dark:border-neutral-800 dark:bg-neutral-900/60 dark:text-neutral-300 dark:hover:text-amber-300"
            >
              {showAll ? "Show less" : `Show ${hiddenCount} more`}
              <ChevronDown
                className={`h-4 w-4 transition-transform duration-300 ${showAll ? "rotate-180" : ""}`}
              />
            </button>
          </motion.div>
        )}

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 md:mt-20 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-2xl mx-auto"
        >
          {[
            {
              count: achievements.filter((a) => a.type === "certification").length,
              label: "Certifications",
              icon: Award,
              accentLine: "via-amber-500/70",
              accentIcon: "text-amber-500/70",
            },
            {
              count: achievements.filter((a) => a.type === "award").length,
              label: "Awards",
              icon: Trophy,
              accentLine: "via-sky-500/65",
              accentIcon: "text-sky-500/70",
            },
            {
              count: achievements.filter((a) => a.type === "achievement").length,
              label: "Achievements",
              icon: Star,
              accentLine: "via-emerald-500/65",
              accentIcon: "text-emerald-500/70",
            },
          ].map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={i}
                whileHover={{ scale: 1.03, y: -2 }}
                className="relative text-center p-5 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/30 transition-colors duration-300 overflow-hidden group"
              >
                <div className={`absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent ${stat.accentLine} to-transparent`} />
                <Icon className={`w-5 h-5 mx-auto mb-2 ${stat.accentIcon}`} />
                <div className="text-3xl font-bold text-neutral-900 dark:text-white">{stat.count}</div>
                <div className="text-xs text-neutral-500 mt-1">{stat.label}</div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      <AchievementDialog achievement={selected} onClose={() => setSelected(null)} />
    </section>
  );
}
