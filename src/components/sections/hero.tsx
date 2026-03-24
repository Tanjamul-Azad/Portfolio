"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Image from "next/image";
import {
  motion,
  useReducedMotion,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";
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

function TypewriterText({
  text,
  startDelay = 1800,
  charInterval = 38,
  loopDelay = 2200,
  reducedMotion = false,
}: {
  text: string;
  startDelay?: number;
  charInterval?: number;
  loopDelay?: number;
  reducedMotion?: boolean;
}) {
  const [visibleCount, setVisibleCount] = useState(reducedMotion ? text.length : 0);

  useEffect(() => {
    if (reducedMotion) {
      setVisibleCount(text.length);
      return;
    }

    let timeoutId: number | undefined;
    let isDisposed = false;

    const startTypingCycle = (delay: number) => {
      timeoutId = window.setTimeout(() => {
        if (isDisposed) return;

        setVisibleCount(0);
        let index = 0;

        const step = () => {
          if (isDisposed) return;

          index += 1;
          setVisibleCount(Math.min(index, text.length));

          if (index < text.length) {
            timeoutId = window.setTimeout(step, charInterval);
            return;
          }

          timeoutId = window.setTimeout(() => startTypingCycle(0), loopDelay);
        };

        timeoutId = window.setTimeout(step, charInterval);
      }, delay);
    };

    startTypingCycle(startDelay);

    return () => {
      isDisposed = true;
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [charInterval, loopDelay, reducedMotion, startDelay, text]);

  const visibleText = text.slice(0, visibleCount);
  const isComplete = visibleCount >= text.length;

  return (
    <span className="relative block">
      {/* Reserve final multiline height so surrounding layout never shifts. */}
      <span className="invisible">
        {text}...
      </span>
      <span className="absolute inset-0">
        {visibleText}
        <motion.span
          aria-hidden
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={isComplete ? { opacity: [1, 0.25, 1] } : { opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          ...
        </motion.span>
      </span>
      <span className="sr-only" aria-live="polite">
        {isComplete ? "typing complete" : "typing"}
      </span>
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
                <span className="text-[10px] font-semibold tracking-[0.16em] text-green-600 dark:text-green-400 uppercase">
                  OPEN
                </span>
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
              className="mb-3 text-sm md:text-base font-medium tracking-[0.08em] uppercase text-neutral-500 dark:text-neutral-400"
            >
              {siteConfig.author.name}
            </motion.p>

            <motion.div
              variants={HERO_SEQUENCE.item}
              className="mb-10 text-sm md:text-base italic tracking-[0.04em] leading-relaxed text-neutral-700 dark:text-neutral-200 max-w-[34rem] min-h-[3.2rem] md:min-h-[3rem]"
            >
              <TypewriterText
                text="Full-Stack Developer | ML Researcher | BSc CSE Undergrad (Data Science)"
                startDelay={2200}
                charInterval={44}
                loopDelay={2800}
                reducedMotion={prefersReducedMotion}
              />
            </motion.div>

            <motion.div
              variants={HERO_SEQUENCE.item}
              className="flex flex-wrap gap-4"
            >
              <InteractiveHoverButton
                text="View Selected Work"
                href="#projects"
                aria-label="View Selected Work"
                classes="h-14 px-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black text-sm font-semibold hover-lift"
              />

              <InteractiveHoverButton
                text="Start a Project"
                href="#contact"
                aria-label="Start a Project"
                classes="h-14 px-8 rounded-full text-sm font-semibold border-neutral-300 dark:border-neutral-800 bg-white dark:bg-black text-neutral-900 dark:text-white hover-lift"
              />
            </motion.div>

            <div className="mt-8" />
          </motion.div>

          <motion.div
            style={{ scale: imageScale }}
            variants={HERO_SEQUENCE.media}
            initial="hidden"
            animate="visible"
            className="block order-1 lg:order-2 justify-self-center lg:justify-self-end"
          >
            <motion.div
              ref={imageWrapRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setImageHover(true)}
              onMouseLeave={() => {
                setImageHover(false);
                mouseX.set(0);
                mouseY.set(0);
              }}
              style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 800 }}
              className="relative w-70 h-95 sm:w-85 sm:h-115 lg:w-125 lg:h-170 mx-auto lg:mx-0"
            >
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
