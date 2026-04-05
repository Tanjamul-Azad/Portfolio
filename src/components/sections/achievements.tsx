"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Award, Medal, Trophy, Star } from "lucide-react";
import { achievements } from "@/data";
import type { Achievement } from "@/types";

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const TypeIcon = {
    certification: Award,
    award: Trophy,
    achievement: Star,
  }[achievement.type];

  const typeLabel = {
    certification: "Certification",
    award: "Award",
    achievement: "Achievement",
  }[achievement.type];

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.55, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className="group h-full"
    >
      <div className="relative h-full rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col overflow-hidden transition-all duration-300 group-hover:border-amber-500/35 group-hover:shadow-xl group-hover:shadow-amber-500/10">
        <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-amber-500/75 to-transparent opacity-70 group-hover:opacity-100" />

        <div className="flex items-start justify-between gap-4 mb-5">
          <motion.div
            whileHover={{ scale: 1.06 }}
            transition={{ duration: 0.2 }}
            className="w-11 h-11 rounded-xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center"
          >
            <TypeIcon className="w-5 h-5 text-amber-500" />
          </motion.div>

          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300 text-[11px] font-medium uppercase tracking-[0.14em]">
            <TypeIcon className="w-3.5 h-3.5" />
            {typeLabel}
          </span>
        </div>

        <h3 className="text-lg md:text-xl font-semibold text-neutral-900 dark:text-white leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors duration-300">
          {achievement.title}
        </h3>

        <div className="mt-3 flex items-center gap-2 text-sm">
          <span className="text-neutral-600 dark:text-neutral-300 font-medium">{achievement.issuer}</span>
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
          <span className="text-neutral-500 dark:text-neutral-400">{achievement.date}</span>
        </div>

        <p className="mt-4 text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed line-clamp-3">
          {achievement.description}
        </p>

        <div className="mt-5 pt-4 border-t border-neutral-200/80 dark:border-neutral-800/80">
          <p className="text-[10px] uppercase tracking-[0.18em] text-neutral-500 dark:text-neutral-400 mb-2">Skills</p>
          <div className="flex flex-wrap gap-1.5">
            {achievement.skills.slice(0, 4).map((skill) => (
              <span
                key={skill}
                className="text-[10px] px-2.5 py-1 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700"
              >
                {skill}
              </span>
            ))}
            {achievement.skills.length > 4 && (
              <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300">
                +{achievement.skills.length - 4}
              </span>
            )}
          </div>
        </div>

        {achievement.credentialUrl ? (
          <motion.a
            href={achievement.credentialUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.98 }}
            className="mt-5 inline-flex items-center justify-center gap-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black px-4 py-2.5 text-sm font-medium transition-colors hover:bg-neutral-800 dark:hover:bg-neutral-200"
          >
            Verify Credential
            <ExternalLink className="w-3.5 h-3.5" />
          </motion.a>
        ) : (
          <span className="mt-5 inline-flex items-center justify-center rounded-full border border-neutral-300 dark:border-neutral-700 px-4 py-2.5 text-xs uppercase tracking-[0.14em] text-neutral-500 dark:text-neutral-400">
            Internal Recognition
          </span>
        )}
      </div>
    </motion.article>
  );
}

export function Achievements() {
  const [filter, setFilter] = useState<"all" | Achievement["type"]>("all");

  const filteredAchievements = filter === "all" 
    ? achievements 
    : achievements.filter((a) => a.type === filter);

  const filters: { label: string; value: "all" | Achievement["type"]; icon: typeof Award }[] = [
    { label: "All", value: "all", icon: Medal },
    { label: "Certifications", value: "certification", icon: Award },
    { label: "Awards", value: "award", icon: Trophy },
    { label: "Achievements", value: "achievement", icon: Star },
  ];

  return (
    <section id="achievements" className="scroll-section py-28 relative overflow-hidden">
      <div className="container px-6 mx-auto relative">
        {/* Header */}
        <div className="mb-16 text-center">
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
            className="text-4xl md:text-6xl font-bold font-heading mb-6 text-neutral-900 dark:text-white tracking-tight"
          >
            Achievements & Awards
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 dark:text-neutral-400 text-lg max-w-xl mx-auto leading-relaxed"
          >
            CV-verified milestones from competitions, academics, and project-based recognition.
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
                onClick={() => setFilter(f.value)}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 ${
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
            {filteredAchievements.map((achievement, index) => (
              <AchievementCard
                key={achievement.id}
                achievement={achievement}
                index={index}
              />
            ))}
          </AnimatePresence>
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 grid grid-cols-3 gap-4 max-w-2xl mx-auto"
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
    </section>
  );
}
