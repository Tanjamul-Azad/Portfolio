"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ExternalLink, Award, Medal, Trophy, Star } from "lucide-react";
import { achievements } from "@/data";
import type { Achievement } from "@/types";

function AchievementCard({ achievement, index }: { achievement: Achievement; index: number }) {
  const [isFlipped, setIsFlipped] = useState(false);

  const TypeIcon = {
    certification: Award,
    award: Trophy,
    achievement: Star,
  }[achievement.type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotateX: 10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="h-[360px] perspective-1000 group"
      onMouseEnter={() => setIsFlipped(true)}
      onMouseLeave={() => setIsFlipped(false)}
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="relative w-full h-full cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Front of Card */}
        <div
          className="absolute inset-0 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col overflow-hidden"
          style={{ backfaceVisibility: "hidden" }}
        >
          {/* Accent border line */}
          <motion.div
            className="absolute top-0 left-0 w-full h-[1px] bg-linear-to-r from-transparent via-amber-500/70 to-transparent"
            initial={{ x: "-100%" }}
            animate={{ x: "100%" }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />

          {/* Icon & Type */}
          <div className="flex items-start justify-between mb-6 relative">
            <motion.div
              className="relative"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
                <TypeIcon className="w-5 h-5 text-amber-500" />
              </div>
            </motion.div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-600 dark:text-amber-400 text-xs font-medium">
              <TypeIcon className="w-3 h-3" />
              <span className="capitalize">{achievement.type}</span>
            </div>
          </div>

          {/* Title */}
          <h3 className="text-xl font-semibold text-neutral-900 dark:text-white mb-2 leading-tight group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors duration-300">
            {achievement.title}
          </h3>

          {/* Issuer & Date */}
          <div className="flex items-center gap-2 text-sm mb-4">
            <span className="text-neutral-500 dark:text-neutral-400">{achievement.issuer}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
            <span className="text-amber-600 dark:text-amber-400 font-medium">{achievement.date}</span>
          </div>

          {/* Skills Preview */}
          <div className="flex flex-wrap gap-1.5 mt-auto relative">
            {achievement.skills.slice(0, 3).map((skill, i) => (
              <motion.span
                key={skill}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="text-[10px] px-2.5 py-1 bg-neutral-200/80 dark:bg-neutral-800/80 text-neutral-600 dark:text-neutral-300 rounded-full border border-neutral-300/50 dark:border-neutral-700/50"
              >
                {skill}
              </motion.span>
            ))}
            {achievement.skills.length > 3 && (
              <span className="text-[10px] px-2.5 py-1 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-full border border-amber-500/25">
                +{achievement.skills.length - 3}
              </span>
            )}
          </div>
        </div>

        {/* Back of Card */}
        <div
          className="absolute inset-0 rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 p-6 flex flex-col overflow-hidden"
          style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}
        >
          {/* Header */}
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-200 dark:border-neutral-800 relative">
            <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <TypeIcon className="w-5 h-5 text-amber-500" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-neutral-900 dark:text-white leading-tight">
                {achievement.title}
              </h3>
              <p className="text-xs text-amber-600 dark:text-amber-400/80">{achievement.issuer} • {achievement.date}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-4 grow">
            {achievement.description}
          </p>

          {/* Skills */}
          <div className="mb-4">
            <p className="text-[10px] text-neutral-400 dark:text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-1">
              <Star className="w-3 h-3 text-amber-500/70" />
              Skills & Technologies
            </p>
            <div className="flex flex-wrap gap-1.5">
              {achievement.skills.map((skill) => (
                <span
                  key={skill}
                  className="text-[10px] px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/25 text-amber-700 dark:text-amber-300"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* CTA */}
          {achievement.credentialUrl && (
            <motion.a
              href={achievement.credentialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-3 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black font-semibold text-sm hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300"
              onClick={(e) => e.stopPropagation()}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Credential
              <ExternalLink className="w-3.5 h-3.5" />
            </motion.a>
          )}
        </div>
      </motion.div>
    </motion.div>
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
    <section id="achievements" className="py-28 relative bg-neutral-100 dark:bg-black overflow-hidden">
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
            Achievements & Certifications
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-neutral-500 dark:text-neutral-400 text-lg max-w-xl mx-auto leading-relaxed"
          >
            Milestones that mark my journey of continuous learning and excellence.
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
