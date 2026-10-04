"use client";

import { useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { SectionHeading } from "@/components/common";
import { cn } from "@/lib/utils";

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
    { name: "CSS", slug: "css", color: "#1572B6" },
    { name: "Tailwind CSS", slug: "tailwindcss", color: "#06B6D4" },
    { name: "Vite", slug: "vite", color: "#646CFF" },
    { name: "Electron", slug: "electron", color: "#47848F" },
    { name: "TanStack Query", slug: "reactquery", color: "#FF4154" },
    { name: "Zod", slug: "zod", color: "#3E67B1" },
  ],
  Backend: [
    { name: "Django", slug: "django", color: "#092E20" },
    { name: "Spring Boot", slug: "springboot", color: "#6DB33F" },
    { name: "Flask", slug: "flask", color: "#FFFFFF" },
    { name: "FastAPI", slug: "fastapi", color: "#009688" },
    { name: "Node.js", slug: "nodedotjs", color: "#5FA04E" },
    { name: "Express", slug: "express", color: "#FFFFFF" },
    { name: "Socket.IO", slug: "socketdotio", color: "#FFFFFF" },
    { name: "Celery", slug: "celery", color: "#37814A" },
    { name: "JWT", slug: "jwt", color: "#D63AFF" },
    { name: "PHP", slug: "php", color: "#777BB4" },
    { name: "Java", slug: "java", color: "#ED8B00" },
  ],
  Database: [
    { name: "MySQL", slug: "mysql", color: "#4479A1" },
    { name: "PostgreSQL", slug: "postgresql", color: "#4169E1" },
    { name: "SQLite", slug: "sqlite", color: "#003B57" },
    { name: "Firebase", slug: "firebase", color: "#FFCA28" },
    { name: "MongoDB", slug: "mongodb", color: "#47A248" },
    { name: "Redis", slug: "redis", color: "#FF4438" },
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
    { name: "Gemini", slug: "googlegemini", color: "#8E75B2" },
    { name: "ChromaDB", slug: "chromadb", color: "#FF6F00" },
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
  if (slug === "jwt") return `https://cdn.simpleicons.org/jsonwebtokens/${hex.replace("#", "")}`;
  if (slug === "mobilenetssd") return `https://cdn.simpleicons.org/tensorflow/${hex.replace("#", "")}`;
  if (slug === "dht11") return `https://cdn.simpleicons.org/arduino/${hex.replace("#", "")}`;
  if (slug === "mq2") return `https://cdn.simpleicons.org/arduino/${hex.replace("#", "")}`;
  if (slug === "pulsesensor") return `https://cdn.simpleicons.org/raspberrypi/${hex.replace("#", "")}`;
  if (slug === "flamesensor") return `https://cdn.simpleicons.org/raspberrypi/${hex.replace("#", "")}`;
  return `https://cdn.simpleicons.org/${slug}/${hex.replace("#", "")}`;
}

/**
 * Remote brand icon with a monogram fallback.
 *
 * The icons come from a third-party CDN whose slugs get renamed and removed
 * (simple-icons dropped the Adobe marks and renamed css3 → css, both of which
 * were rendering as broken images here). Rather than trust the slug list to stay
 * correct forever, a failed load degrades to the tech's initial on a tinted chip.
 */
function TechIcon({
  tech,
  size,
  className,
}: {
  tech: Tech;
  size: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className={cn(
          "flex items-center justify-center rounded font-bold leading-none",
          className
        )}
        style={{ color: tech.color, fontSize: size * 0.62 }}
      >
        {tech.name.charAt(0).toUpperCase()}
      </span>
    );
  }

  return (
    <img
      src={getIconUrl(tech.slug, tech.color)}
      // Decorative: the tech's name is always printed right beside its logo.
      alt=""
      width={size}
      height={size}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
      className={cn("object-contain", className)}
      draggable={false}
    />
  );
}

function TechTile({ tech, index }: { tech: Tech; index: number }) {
  const isWhite = tech.color.toLowerCase() === "#ffffff";

  return (
    <motion.li
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      className="group flex h-13 items-center gap-3 rounded-xl border border-line bg-surface px-2.5 transition-[border-color,transform] duration-300 hover:-translate-y-0.5 hover:border-line-strong"
    >
      {/* Brand colour shows as a faint ring on the icon well, so a grid of
          thirty logos stays calm instead of turning into a colour chart. */}
      <span
        className={cn(
          "flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
          isWhite ? "bg-neutral-900" : "bg-surface-2"
        )}
        style={{ boxShadow: `inset 0 0 0 1px ${isWhite ? "rgba(255,255,255,0.12)" : `${tech.color}40`}` }}
      >
        <TechIcon tech={tech} size={20} className="h-4.5 w-4.5" />
      </span>
      <span className="truncate text-[13px] font-medium text-muted-foreground transition-colors duration-300 group-hover:text-foreground">
        {tech.name}
      </span>
    </motion.li>
  );
}

export function TechStack() {
  const [activeCategory, setActiveCategory] = useState<Category>("Frontend");

  const activeTech = useMemo(() => categories[activeCategory], [activeCategory]);
  const totalTools = useMemo(
    () => categoryOrder.reduce((sum, category) => sum + categories[category].length, 0),
    []
  );

  return (
    <section id="stack" className="scroll-section section-y relative">
      <div className="shell">
        <SectionHeading
          index="03"
          eyebrow="Tech Stack"
          title={
            <>
              Tools I <em className="accent-serif">work with</em>
            </>
          }
          description="The languages, frameworks, and tools I reach for across frontend, backend, AI, and hardware work."
        />

        <div className="surface p-2 sm:p-3">
          {/* Category switcher. Scrolls sideways on a phone, with the edges
              faded so it is obvious there is more to the right. */}
          <div className="-mx-2 overflow-x-auto px-2 [mask-image:linear-gradient(to_right,transparent,black_12px,black_calc(100%-24px),transparent)] [scrollbar-width:none] sm:mx-0 sm:px-0 sm:[mask-image:none] [&::-webkit-scrollbar]:hidden">
            <div role="group" aria-label="Tech categories" className="flex w-max gap-1 rounded-xl bg-surface-2/70 p-1">
              {categoryOrder.map((category) => {
                const isActive = activeCategory === category;

                return (
                  <button
                    key={category}
                    type="button"
                    aria-pressed={isActive}
                    onClick={() => setActiveCategory(category)}
                    className="relative flex h-11 items-center gap-2 rounded-lg px-3.5 sm:h-9 text-[13px] font-medium outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-amber-500/70"
                  >
                    {isActive && (
                      <motion.span
                        layoutId="active-tech-tab"
                        transition={{ type: "spring", stiffness: 380, damping: 32 }}
                        className="absolute inset-0 rounded-lg bg-surface shadow-sm ring-1 ring-line"
                      />
                    )}
                    <span className={cn("relative z-10 whitespace-nowrap", isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                      {category}
                    </span>
                    <span className={cn("relative z-10 font-mono text-[10px]", isActive ? "text-accent" : "text-muted-foreground")}>
                      {categories[category].length}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Reserves the tallest category's height so switching tabs never
              shoves the rest of the page up and down. */}
          <div className="mt-2 min-h-[22rem] sm:mt-3 sm:min-h-[14.5rem] lg:min-h-[10.75rem]">
            <AnimatePresence mode="wait">
              <motion.ul
                key={activeCategory}
                aria-label={`${activeCategory} tools`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.18 }}
                className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4"
              >
                {activeTech.map((tech, index) => (
                  <TechTile key={`${activeCategory}-${tech.slug}`} tech={tech} index={index} />
                ))}
              </motion.ul>
            </AnimatePresence>
          </div>
        </div>

        <p className="mt-4 font-mono text-[11px] text-muted-foreground">
          {totalTools} tools across {categoryOrder.length} categories
        </p>
      </div>
    </section>
  );
}
