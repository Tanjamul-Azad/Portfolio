"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { ExternalLink, Sparkles } from "lucide-react";
import Link from "next/link";
import { achievements } from "@/data";
import { useRef } from "react";

const typeConfig = {
  certification: {
    gradient: "from-blue-500 to-purple-500",
    glow: "shadow-blue-500/20",
    badge: "bg-blue-500/10 border-blue-500/20 text-blue-700 dark:text-blue-300",
  },
  award: {
    gradient: "from-amber-500 to-orange-500",
    glow: "shadow-amber-500/20",
    badge: "bg-amber-500/10 border-amber-500/20 text-amber-700 dark:text-amber-300",
  },
  achievement: {
    gradient: "from-green-500 to-emerald-500",
    glow: "shadow-green-500/20",
    badge: "bg-green-500/10 border-green-500/20 text-green-700 dark:text-green-300",
  },
};

export function AchievementsCinematic() {
  const containerRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  // Parallax effects for wow factor
  const y1 = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [-50, 50]);

  return (
    <section
      ref={containerRef}
      className="scroll-section relative min-h-screen flex items-center bg-linear-to-br from-white via-amber-50/30 to-white dark:from-black dark:via-amber-950/20 dark:to-black overflow-hidden"
    >
      {/* Wow Factor: Parallax floating orbs */}
      <motion.div
        style={{ y: y1 }}
        className="absolute top-1/4 left-1/4 w-[700px] h-[700px] bg-linear-to-br from-amber-400/15 to-orange-500/15 dark:from-amber-500/8 dark:to-orange-500/8 blur-[150px] rounded-full pointer-events-none"
      />
      <motion.div
        style={{ y: y2 }}
        className="absolute bottom-1/4 right-1/4 w-150 h-150 bg-linear-to-br from-purple-400/15 to-blue-500/15 dark:from-purple-500/8 dark:to-blue-500/8 blur-[150px] rounded-full pointer-events-none"
      />

      <div className="container max-w-7xl px-6 mx-auto relative z-10 py-32">
        {/* Wow Factor: 3D perspective header */}
        <motion.div
          initial={{ opacity: 0, z: -100, rotateX: 45 }}
          whileInView={{ opacity: 1, z: 0, rotateX: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{ perspective: "1000px" }}
          className="text-center mb-24"
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            whileInView={{ scale: 1, rotate: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", delay: 0.2 }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <Sparkles className="w-6 h-6 text-amber-500" />
            <span className="text-sm font-mono text-amber-600 dark:text-amber-400 tracking-[0.3em] uppercase font-medium">
              Recognition
            </span>
          </motion.div>

          <h2 className="text-6xl md:text-8xl lg:text-9xl font-bold font-heading mb-6 leading-[0.9]">
            <motion.span
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="block text-neutral-900 dark:text-white"
            >
              Awards &{" "}
            </motion.span>
            <motion.span
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, type: "spring" }}
              className="block text-transparent bg-clip-text bg-linear-to-r from-amber-600 via-orange-600 to-amber-600 dark:from-amber-400 dark:via-orange-400 dark:to-amber-400"
            >
              Milestones
            </motion.span>
          </h2>

          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.7 }}
            className="text-xl text-neutral-600 dark:text-neutral-400 max-w-2xl mx-auto"
          >
            Celebrating continuous learning and growth
          </motion.p>
        </motion.div>

        {/* Wow Factor: Cards reveal with curtain effect */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {achievements.map((achievement, index) => {
            const config = typeConfig[achievement.type];
            const delay = 0.9 + index * 0.1;

            return (
              <motion.div
                key={achievement.id}
                initial={{
                  opacity: 0,
                  y: 100,
                  rotateX: 45,
                  scale: 0.8,
                }}
                whileInView={{
                  opacity: 1,
                  y: 0,
                  rotateX: 0,
                  scale: 1,
                }}
                viewport={{ once: true }}
                transition={{
                  delay,
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }}
                whileHover={{
                  y: -12,
                  rotateY: 5,
                  scale: 1.02,
                }}
                style={{ perspective: "1000px" }}
                className="group relative"
              >
                {/* Animated border gradient on hover */}
                <motion.div
                  className="absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: `linear-gradient(135deg, var(--tw-gradient-stops))`,
                  }}
                  animate={{
                    backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                />

                {/* Main card */}
                <div className="relative h-full flex flex-col p-6 md:p-8 bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50 shadow-2xl hover:shadow-3xl transition-all duration-500">
                  {/* Gradient overlay on hover */}
                  <div className={`absolute inset-0 rounded-3xl bg-linear-to-br ${config.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 pointer-events-none`} />

                  {/* Icon with pulse animation */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    whileInView={{ scale: 1, rotate: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      type: "spring",
                      delay: delay + 0.2,
                      stiffness: 200,
                    }}
                    whileHover={{ rotate: 4, scale: 1.05 }}
                    className="relative z-10"
                  >
                    <div className={`w-16 h-16 mb-4 rounded-2xl bg-linear-to-br ${config.gradient} flex items-center justify-center text-3xl shadow-lg ${config.glow} group-hover:shadow-2xl transition-shadow duration-500`}>
                      {achievement.icon}
                    </div>

                    {/* Pulse ring effect */}
                    <motion.div
                      className={`absolute inset-0 rounded-2xl bg-linear-to-br ${config.gradient} opacity-20`}
                      animate={{
                        scale: [1, 1.12, 1],
                        opacity: [0.2, 0, 0.2],
                      }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        delay: index * 0.3,
                      }}
                    />
                  </motion.div>

                  {/* Type badge */}
                  <div className={`inline-flex items-center gap-2 px-3 py-1 mb-3 text-xs font-semibold rounded-full border ${config.badge} w-fit relative z-10`}>
                    {achievement.type}
                  </div>

                  {/* Title with gradient hover */}
                  <h3 className={`relative z-10 text-xl md:text-2xl font-bold mb-3 text-neutral-900 dark:text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-linear-to-r ${config.gradient} transition-all duration-300`}>
                    {achievement.title}
                  </h3>

                  {/* Description */}
                  <p className="relative z-10 text-sm text-neutral-600 dark:text-neutral-400 mb-4 leading-relaxed flex-1">
                    {achievement.description}
                  </p>

                  {/* Meta info */}
                  <div className="relative z-10 text-xs text-neutral-500 dark:text-neutral-500 mb-4 space-y-1">
                    <div className="font-medium">{achievement.issuer}</div>
                    <div>{achievement.date}</div>
                  </div>

                  {/* Skills tags */}
                  {achievement.skills && (
                    <div className="relative z-10 flex flex-wrap gap-1.5 mb-4">
                      {achievement.skills.slice(0, 3).map((skill, idx) => (
                        <motion.span
                          key={skill}
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: delay + 0.4 + idx * 0.1 }}
                          className="px-2 py-1 text-xs bg-neutral-100 dark:bg-neutral-800/50 text-neutral-600 dark:text-neutral-400 rounded-md"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  )}

                  {/* Link */}
                  {achievement.credentialUrl && (
                    <Link
                      href={achievement.credentialUrl}
                      target="_blank"
                      className={`relative z-10 inline-flex items-center gap-2 text-sm font-semibold text-transparent bg-clip-text bg-linear-to-r ${config.gradient} hover:opacity-80 transition-opacity group/link`}
                    >
                      View Credential
                      <ExternalLink className="w-3.5 h-3.5 text-neutral-400 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                    </Link>
                  )}

                  {/* Decorative gradient blur */}
                  <div className={`absolute -bottom-8 -right-8 w-32 h-32 bg-linear-to-br ${config.gradient} opacity-10 group-hover:opacity-20 rounded-full blur-2xl pointer-events-none transition-opacity duration-500`} />
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Section separator */}
      <div className="absolute bottom-0 inset-x-0 h-20 bg-linear-to-t from-black/5 to-transparent dark:from-black/30 pointer-events-none" />
    </section>
  );
}
