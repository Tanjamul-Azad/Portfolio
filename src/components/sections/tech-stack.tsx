"use client";

import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { CodeFlowPattern } from "@/components/ui/code-flow-pattern";

type Tech = {
  name: string;
  slug: string;
  color: string;
};

const categoryOrder = ["Frontend", "Backend", "Database", "AI/ML", "Hardware", "Tools"] as const;
type Category = (typeof categoryOrder)[number];

const categories: Record<Category, Tech[]> = {
  Frontend: [
    { name: "React", slug: "react", color: "#61DAFB" },
    { name: "Next.js", slug: "nextdotjs", color: "#FFFFFF" },
    { name: "TypeScript", slug: "typescript", color: "#3178C6" },
    { name: "JavaScript", slug: "javascript", color: "#F7DF1E" },
    { name: "HTML", slug: "html5", color: "#E34F26" },
    { name: "CSS", slug: "css3", color: "#1572B6" },
    { name: "Tailwind CSS", slug: "tailwindcss", color: "#06B6D4" },
    { name: "Vite", slug: "vite", color: "#646CFF" },
  ],
  Backend: [
    { name: "Django", slug: "django", color: "#092E20" },
    { name: "Spring Boot", slug: "springboot", color: "#6DB33F" },
    { name: "Flask", slug: "flask", color: "#FFFFFF" },
    { name: "Node.js", slug: "nodedotjs", color: "#5FA04E" },
    { name: "JWT", slug: "jwt", color: "#D63AFF" },
    { name: "PHP", slug: "php", color: "#777BB4" },
    { name: "Java", slug: "java", color: "#ED8B00" },
  ],
  Database: [
    { name: "MySQL", slug: "mysql", color: "#4479A1" },
    { name: "PostgreSQL", slug: "postgresql", color: "#4169E1" },
    { name: "Firebase", slug: "firebase", color: "#FFCA28" },
    { name: "MongoDB", slug: "mongodb", color: "#47A248" },
  ],
  "AI/ML": [
    { name: "PyTorch", slug: "pytorch", color: "#EE4C2C" },
    { name: "TensorFlow", slug: "tensorflow", color: "#FF6F00" },
    { name: "MobileNetSSD", slug: "mobilenetssd", color: "#FF6F00" },
    { name: "scikit-learn", slug: "scikitlearn", color: "#F7931E" },
    { name: "spaCy", slug: "spacy", color: "#09A3D5" },
    { name: "OpenCV", slug: "opencv", color: "#5C3EE8" },
    { name: "Pandas", slug: "pandas", color: "#150458" },
    { name: "NumPy", slug: "numpy", color: "#013243" },
    { name: "Python", slug: "python", color: "#3776AB" },
  ],
  Hardware: [
    { name: "Raspberry Pi", slug: "raspberrypi", color: "#A22846" },
    { name: "Arduino", slug: "arduino", color: "#00979D" },
    { name: "DHT11 Sensor", slug: "dht11", color: "#00979D" },
    { name: "MQ-2 Gas Sensor", slug: "mq2", color: "#EA4335" },
    { name: "Pulse Sensor", slug: "pulsesensor", color: "#E91E63" },
    { name: "Flame Sensor", slug: "flamesensor", color: "#FB8C00" },
  ],
  Tools: [
    { name: "Docker", slug: "docker", color: "#2496ED" },
    { name: "Git", slug: "git", color: "#F05032" },
    { name: "GitHub", slug: "github", color: "#FFFFFF" },
    { name: "Google Cloud", slug: "googlecloud", color: "#4285F4" },
    { name: "Figma", slug: "figma", color: "#F24E1E" },
    { name: "Adobe", slug: "adobe", color: "#FF0000" },
    { name: "Postman", slug: "postman", color: "#FF6C37" },
    { name: "Notion", slug: "notion", color: "#FFFFFF" },
  ],
};

function getIconUrl(slug: string, hex: string) {
  if (slug === "java") return "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg";
  if (slug === "adobe") return "https://cdn.simpleicons.org/adobe/FF0000";
  if (slug === "jwt") return `https://cdn.simpleicons.org/jsonwebtokens/${hex.replace("#", "")}`;
  if (slug === "mobilenetssd") return `https://cdn.simpleicons.org/tensorflow/${hex.replace("#", "")}`;
  if (slug === "dht11") return `https://cdn.simpleicons.org/arduino/${hex.replace("#", "")}`;
  if (slug === "mq2") return `https://cdn.simpleicons.org/arduino/${hex.replace("#", "")}`;
  if (slug === "pulsesensor") return `https://cdn.simpleicons.org/raspberrypi/${hex.replace("#", "")}`;
  if (slug === "flamesensor") return `https://cdn.simpleicons.org/raspberrypi/${hex.replace("#", "")}`;
  return `https://cdn.simpleicons.org/${slug}/${hex.replace("#", "")}`;
}

function TechCard({ tech, index }: { tech: Tech; index: number }) {
  const isWhite = tech.color.toLowerCase() === "#ffffff";
  const chipBorder = isWhite ? "rgba(148, 163, 184, 0.65)" : `${tech.color}55`;
  const hoverBorder = isWhite ? "rgba(100, 116, 139, 0.8)" : `${tech.color}75`;
  const baseShadow = "0 10px 20px rgba(15, 23, 42, 0.12)";
  const hoverShadow = "0 16px 28px rgba(15, 23, 42, 0.24), inset 0 -8px 16px rgba(15, 23, 42, 0.12)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.05,
        duration: 0.4,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group flex flex-col items-center justify-center gap-3 p-3"
    >
      <motion.div
        className={`relative flex h-14 w-14 items-center justify-center rounded-2xl border backdrop-blur-sm transition-all duration-300 sm:h-16 sm:w-16 ${
          isWhite ? "bg-slate-900" : "bg-white/80 dark:bg-neutral-900/80"
        }`}
        style={{
          borderColor: chipBorder,
          boxShadow: baseShadow,
        }}
        whileHover={{
          y: -3,
          scale: 1.03,
          borderColor: hoverBorder,
          boxShadow: hoverShadow,
        }}
        transition={{ type: "spring", stiffness: 260, damping: 20 }}
      >
        <img
          src={getIconUrl(tech.slug, tech.color)}
          alt={tech.name}
          width={48}
          height={48}
          className={`h-8 w-8 object-contain transition-transform duration-300 group-hover:scale-110 sm:h-10 sm:w-10 ${
            isWhite ? "invert-0" : ""
          }`}
          draggable={false}
        />
      </motion.div>

      <span className="text-center text-xs font-medium tracking-wide text-neutral-500 transition-colors duration-300 group-hover:text-neutral-900 dark:group-hover:text-neutral-200">
        {tech.name}
      </span>
    </motion.div>
  );
}

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState<Category>("Frontend");

  const activeTech = useMemo(() => categories[activeCategory], [activeCategory]);
  const marqueeTech = useMemo(() => {
    const all = categoryOrder.flatMap((category) => categories[category]);
    return [...all, ...all];
  }, []);

  return (
    <motion.section
      initial={{ opacity: 0, y: 48 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
      className="py-20 md:py-24 relative border-y border-neutral-200 dark:border-neutral-800/50 bg-neutral-100/50 dark:bg-neutral-950/50 overflow-hidden"
    >
      <CodeFlowPattern
        className="opacity-25 dark:opacity-20 text-amber-500 dark:text-amber-400"
        numElements={35}
        flowSpeed={12}
        maxOpacity={0.2}
      />

      <div className="container relative z-10 mx-auto px-4 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mx-auto mb-10 max-w-2xl text-center"
        >
          <span className="mb-3 block text-xs uppercase tracking-[0.2em] text-neutral-500 dark:text-neutral-400">
            Tech Stack
          </span>

          <h3 className="font-heading text-2xl sm:text-3xl font-semibold text-neutral-900 dark:text-white md:text-4xl">
            Tools I Work With
          </h3>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-neutral-500 dark:text-neutral-400">
            Modern technologies for building fast, scalable applications.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          className="relative mt-8"
        >

          <div className="relative z-10 mb-7 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <div className="mx-auto flex min-w-max items-center gap-2 rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white/50 dark:bg-neutral-950/60 p-1.5 backdrop-blur-md md:min-w-0 md:w-fit">
              {categoryOrder.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className="relative rounded-xl px-3 sm:px-4 md:px-5 py-2.5 text-xs sm:text-sm font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/70 focus-visible:ring-offset-2 focus-visible:ring-offset-white dark:focus-visible:ring-offset-neutral-900"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-tech-tab"
                        transition={{ type: "spring", stiffness: 360, damping: 28 }}
                        className="absolute inset-0 rounded-xl border border-amber-500/20 dark:border-amber-400/55 bg-amber-50 dark:bg-amber-500/12 shadow-[0_0_24px_rgba(245,158,11,0.15)] dark:shadow-[0_0_24px_rgba(245,158,11,0.32)]"
                      />
                    )}

                    <span
                      className={`relative z-10 whitespace-nowrap ${
                        isActive ? "text-amber-600 dark:text-amber-300" : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-neutral-200"
                      }`}
                    >
                      {category}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="relative z-10 min-h-[280px] sm:min-h-[340px] overflow-x-auto pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.32, ease: [0.16, 1, 0.3, 1] }}
                className="flex min-w-max items-start gap-4 px-1 md:mx-auto md:grid md:w-fit md:min-w-fit md:grid-cols-3 md:gap-4 lg:grid-cols-4 lg:gap-5"
              >
                {activeTech.map((tech, index) => (
                  <TechCard key={`${activeCategory}-${tech.slug}`} tech={tech} index={index} />
                ))}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className="group relative mt-10 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800/80 bg-white/50 dark:bg-neutral-950/70 py-4 shadow-sm"
        >
          <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-24 bg-gradient-to-r from-neutral-100 dark:from-black via-neutral-100/90 dark:via-black/90 to-transparent" />
          <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-24 bg-gradient-to-l from-neutral-100 dark:from-black via-neutral-100/90 dark:via-black/90 to-transparent" />

          <div className="animate-marquee flex w-max min-w-full items-center gap-4 group-hover:[animation-play-state:paused]">
            {marqueeTech.map((tech, index) => {
              const isWhite = tech.color.toLowerCase() === "#ffffff";
              
              return (
                <div
                  key={`${tech.slug}-${index}`}
                  className="group/item flex items-center gap-2 rounded-full border border-neutral-200 dark:border-neutral-800/80 bg-neutral-50 dark:bg-neutral-900/70 px-3 py-1.5 transition-all duration-300 hover:-translate-y-0.5 hover:border-neutral-300 dark:hover:border-neutral-700"
                >
                  <span
                    className={`flex h-6 w-6 items-center justify-center rounded-md border ${
                      isWhite
                        ? "border-slate-300/80 bg-slate-900"
                        : "border-transparent bg-white/60 dark:bg-neutral-900/60"
                    }`}
                    style={isWhite ? undefined : { boxShadow: `0 0 0 1px ${tech.color}45 inset` }}
                  >
                    <img
                      src={getIconUrl(tech.slug, tech.color)}
                      alt={tech.name}
                      width={20}
                      height={20}
                      className="h-4 w-4 object-contain"
                      draggable={false}
                    />
                  </span>
                  <span className="text-xs font-medium tracking-wide text-neutral-600 dark:text-neutral-400">
                    {tech.name}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </motion.section>
  );
}

