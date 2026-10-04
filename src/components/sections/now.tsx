"use client";

import { motion } from "framer-motion";
import { Rocket, Microscope, Search } from "lucide-react";
import { nowItems } from "@/data";
import { sectionsContent } from "@/data/site-content";
import { SectionHeading, withSerifAccent } from "@/components/common";

const categoryConfig = {
  building: {
    icon: Rocket,
    title: "Currently Building",
  },
  learning: {
    icon: Microscope,
    title: "Active Research",
  },
  looking: {
    icon: Search,
    title: "Looking For",
  },
};

export function Now() {
  // Content is editor-driven, so an unknown category is skipped rather than crashing.
  const groups = nowItems.filter((item) => categoryConfig[item.category]);

  return (
    <section id="now" className="scroll-section section-y relative">
      <div className="shell">
        <SectionHeading
          index="02"
          eyebrow={sectionsContent.now.eyebrow}
          title={withSerifAccent(sectionsContent.now.heading)}
          description={sectionsContent.now.subtext}
        />

        {/* One panel split into columns, rather than three free-floating
            cards: on a phone the groups stack as rows of the same surface,
            which reads as a single block and takes half the height. */}
        <div className="surface grid overflow-hidden md:grid-cols-3">
          {groups.map((item, categoryIndex) => {
            const config = categoryConfig[item.category];
            const Icon = config.icon;

            return (
              <motion.div
                key={item.category}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.45, delay: categoryIndex * 0.08, ease: [0.22, 1, 0.36, 1] }}
                onPointerMove={(event) => {
                  const el = event.currentTarget;
                  const rect = el.getBoundingClientRect();
                  el.style.setProperty("--spot-x", `${event.clientX - rect.left}px`);
                  el.style.setProperty("--spot-y", `${event.clientY - rect.top}px`);
                }}
                className="spotlight-surface group border-line p-5 sm:p-7 [&:not(:first-child)]:border-t md:[&:not(:first-child)]:border-l md:[&:not(:first-child)]:border-t-0"
              >
                <div className="spotlight-content">
                  <h3 className="mb-3.5 flex items-center gap-3 text-base font-semibold tracking-[-0.01em] text-foreground sm:mb-4 sm:text-lg">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-foreground text-background transition-transform duration-300 group-hover:-rotate-6">
                      <Icon className="h-4 w-4" />
                    </span>
                    {config.title}
                  </h3>

                  <ul className="space-y-2.5">
                    {item.items.map((text, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm leading-relaxed text-muted-foreground">
                        <span className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-line-strong transition-colors duration-300 group-hover:bg-amber-500" />
                        <span>{text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
