"use client";

import { useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowRight, Code2, Download, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { HERO_SEQUENCE, MOTION_TOKENS } from "@/lib";

function SplitText({
  text,
  delay = 0,
  charStagger = 0.028,
  className = "",
  reducedMotion = false,
}: {
  text: string;
  delay?: number;
  charStagger?: number;
  className?: string;
  reducedMotion?: boolean;
}) {
  return (
    <span className={`inline-flex overflow-hidden ${className}`}>
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          className="inline-block"
          initial={reducedMotion ? { opacity: 0 } : { y: "115%", rotateZ: 3, opacity: 0 }}
          animate={reducedMotion ? { opacity: 1 } : { y: 0, rotateZ: 0, opacity: 1 }}
          transition={{
            duration: reducedMotion ? MOTION_TOKENS.duration.quick : 0.65,
            delay: delay + i * charStagger,
            ease: MOTION_TOKENS.easing.premium,
          }}
        >
          {char === " " ? "\u00A0" : char}
        </motion.span>
      ))}
    </span>
  );
}

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const [imageHover, setImageHover] = useState(false);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springCfg = { stiffness: 180, damping: 25, mass: 0.5 };
  const rotateX = useSpring(useTransform(mouseY, [-200, 200], [12, -12]), springCfg);
  const rotateY = useSpring(useTransform(mouseX, [-200, 200], [-12, 12]), springCfg);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.55], [0, 80]);
  const imageScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.88]);

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    if (!imageWrapRef.current) return;

    const { left, top, width, height } = imageWrapRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - (left + width / 2));
    mouseY.set(e.clientY - (top + height / 2));
  }

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="scroll-section relative min-h-svh flex items-center justify-center overflow-hidden bg-white dark:bg-black"
    >
      <div className="container max-w-7xl px-6 relative z-10 pt-24 pb-12">
        <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-12 lg:gap-12 items-center">
          <motion.div
            style={{ opacity: heroOpacity, y: heroY }}
            className="max-w-150 order-2 lg:order-1"
            variants={HERO_SEQUENCE.container}
            initial="hidden"
            animate="visible"
          >
            <motion.div
              variants={HERO_SEQUENCE.item}
              className="flex items-center gap-3 mb-10"
            >
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-black/70 backdrop-blur-md w-fit">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-400">
                  Available for new projects
                </span>
              </div>
            </motion.div>

            <h1 className="display-heading text-[clamp(3.2rem,7.5vw,6.5rem)] leading-[0.92] mb-6 text-neutral-900 dark:text-white">
              <div>
                <SplitText text="Crafting" delay={0.16} reducedMotion={prefersReducedMotion} />
              </div>
              <div>
                <SplitText
                  text="digital"
                  delay={0.24}
                  className="text-neutral-400 dark:text-neutral-600"
                  reducedMotion={prefersReducedMotion}
                />
              </div>
              <div>
                <SplitText text="experiences" delay={0.32} reducedMotion={prefersReducedMotion} />
              </div>
              <div>
                <SplitText text="that matter." delay={0.4} reducedMotion={prefersReducedMotion} />
              </div>
            </h1>

            <motion.p
              variants={HERO_SEQUENCE.item}
              className="text-lg text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10 max-w-lg font-light"
            >
              I help brands and founders turn complex ideas into{" "}
              <span className="text-foreground font-medium">elegant</span>, scalable software
              solutions. Focus on clarity, performance, and impact.
            </motion.p>

            <motion.div
              variants={HERO_SEQUENCE.item}
              className="flex flex-wrap gap-4"
            >
              <Button
                asChild
                size="lg"
                className="h-14 px-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-semibold transition-all duration-300 group hover-lift"
              >
                <Link href="#projects">
                  View Selected Work
                  <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-full text-sm font-semibold border-neutral-300 dark:border-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-all duration-300 hover-lift"
              >
                <a href="/resume.pdf" download className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Resume
                </a>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-14 px-8 rounded-full text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-white/5 transition-all"
              >
                <Link href="#contact" className="flex items-center group">
                  Contact Me
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
            </motion.div>

            <div className="mt-8" />
          </motion.div>

          <motion.div
            style={{ scale: imageScale }}
            variants={HERO_SEQUENCE.media}
            initial="hidden"
            animate="visible"
            className="block order-1 lg:order-2 justify-self-center lg:justify-self-end"
            ref={imageWrapRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setImageHover(true)}
            onMouseLeave={() => {
              setImageHover(false);
              mouseX.set(0);
              mouseY.set(0);
            }}
          >
            <motion.div
              style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
              className="relative w-70 h-95 sm:w-85 sm:h-115 lg:w-125 lg:h-170 mx-auto lg:mx-0"
            >
              <motion.div
                className="absolute -top-5 -right-4 z-30 px-4 py-2 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 text-xs font-bold shadow-lg transform-[translateZ(50px)]"
                animate={{ y: [0, -7, 0] }}
                transition={{ duration: 3.2, repeat: Infinity, ease: "easeInOut" }}
              >
                Available for new projects
              </motion.div>

              <motion.div
                className="hidden md:flex absolute -bottom-3 -left-2 z-30 items-center gap-2 px-4 py-3 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-xl transform-[translateZ(50px)]"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 3.8, repeat: Infinity, ease: "easeInOut", delay: 0.7 }}
              >
                <MapPin className="w-3.5 h-3.5 text-neutral-600 dark:text-neutral-300 shrink-0" />
                <div>
                  <div className="text-[10px] text-neutral-500">Focused on</div>
                  <div className="text-xs font-semibold text-neutral-900 dark:text-white leading-none mt-0.5">
                    Product quality
                  </div>
                </div>
              </motion.div>

              <motion.div
                className="hidden md:flex absolute top-[45%] -left-6 z-30 items-center gap-2 px-3 py-2 rounded-xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 shadow-lg transform-[translateZ(35px)]"
                animate={{ x: [0, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <Code2 className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-medium text-neutral-700 dark:text-neutral-300">
                  Performance
                </span>
              </motion.div>

              <div className="absolute inset-0 border border-neutral-200 dark:border-neutral-800 rounded-2xl translate-x-3 translate-y-3 opacity-40" />
              <div className="absolute inset-0 border border-neutral-300/60 dark:border-neutral-700/60 rounded-2xl -translate-x-2 -translate-y-2 opacity-40" />

              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-100 dark:bg-neutral-900">
                <Image
                  src="/images/profile.jpg"
                  alt={siteConfig.name}
                  fill
                  className="object-cover transition-all duration-700 ease-out"
                  style={{ filter: imageHover ? "grayscale(0)" : "grayscale(0.25)" }}
                  priority
                  unoptimized
                  sizes="(max-width: 640px) 280px, (max-width: 1024px) 340px, 500px"
                />

                <div className="absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: prefersReducedMotion ? 0 : 1 }}
        transition={{ delay: MOTION_TOKENS.duration.slow }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 pointer-events-none"
      >
        <motion.div
          className="w-px h-10 bg-neutral-400/70 dark:bg-neutral-600/70"
          animate={{ opacity: [1, 0.2, 1], scaleY: [1, 0.6, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
