"use client";

import { motion } from "framer-motion";
import { Rocket, BookOpen, Search, Sparkles } from "lucide-react";
import { nowItems } from "@/data";
import { fadeInUp, staggerContainer } from "@/lib/animations";

const categoryConfig = {
  building: {
    icon: Rocket,
    title: "Currently Building",
    color: "amber",
    bgColor: "bg-amber-500/10",
    borderColor: "border-amber-500/20",
    textColor: "text-amber-500",
    iconBg: "bg-amber-500/20",
  },
  learning: {
    icon: BookOpen,
    title: "Currently Learning",
    color: "blue",
    bgColor: "bg-blue-500/10",
    borderColor: "border-blue-500/20",
    textColor: "text-blue-500",
    iconBg: "bg-blue-500/20",
  },
  looking: {
    icon: Search,
    title: "Looking For",
    color: "green",
    bgColor: "bg-green-500/10",
    borderColor: "border-green-500/20",
    textColor: "text-green-500",
    iconBg: "bg-green-500/20",
  },
};

export function Now() {
  return (
    <section id="now" className="py-28 relative bg-white dark:bg-neutral-900/50 overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-blue-500/5 blur-[100px] rounded-full pointer-events-none" />

      <div className="container px-6 mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-center gap-3 mb-4"
        >
          <Sparkles className="w-5 h-5 text-amber-500" />
          <span className="text-sm text-amber-600 dark:text-amber-400/80 tracking-[0.2em] uppercase font-medium">
            What I&apos;m Up To
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-12"
        >
          Right Now
        </motion.h2>

        {/* Cards Grid */}
        <motion.div
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid md:grid-cols-3 gap-6"
        >
          {nowItems.map((item) => {
            const config = categoryConfig[item.category];
            const Icon = config.icon;

            return (
              <motion.div
                key={item.category}
                variants={fadeInUp}
                className={`p-6 rounded-2xl ${config.bgColor} border ${config.borderColor} hover:scale-[1.02] transition-transform duration-300`}
              >
                <div className={`w-12 h-12 rounded-xl ${config.iconBg} flex items-center justify-center mb-4`}>
                  <Icon className={`w-6 h-6 ${config.textColor}`} />
                </div>
                
                <h3 className={`text-lg font-bold ${config.textColor} mb-4`}>
                  {config.title}
                </h3>

                <ul className="space-y-3">
                  {item.items.map((text, idx) => (
                    <li 
                      key={idx}
                      className="flex items-start gap-3 text-neutral-600 dark:text-neutral-300 text-sm"
                    >
                      <span className={`mt-1.5 w-1.5 h-1.5 rounded-full ${config.textColor} bg-current flex-shrink-0`} />
                      {text}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
