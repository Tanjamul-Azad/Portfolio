"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";
import { siteConfig } from "@/config";
import { heroContent } from "@/data/site-content";
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
  const prefersReducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.55], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.55], [0, 80]);
  const imageScale = useTransform(scrollYProgress, [0, 0.55], [1, 0.88]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="scroll-section relative z-10 min-h-svh flex items-center justify-center overflow-hidden bg-white dark:bg-black transition-colors duration-500"
    >
      <div className="absolute inset-0 z-0 bg-white dark:bg-black transition-colors duration-500" />

      <div className="container max-w-7xl px-4 sm:px-6 relative z-10 pt-24 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-10 sm:gap-12 items-center">
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
              <div className="flex items-center gap-2.5 px-4 py-2 rounded-full border border-neutral-300/70 dark:border-white/15 bg-white/70 dark:bg-black/55 backdrop-blur-md w-fit transition-colors duration-300">
                <span className="text-[10px] font-semibold tracking-[0.16em] text-green-600 dark:text-green-400 uppercase">
                  {heroContent.badge.status}
                </span>
                <span className="text-xs font-medium text-neutral-600 dark:text-neutral-300">
                  {heroContent.badge.text}
                </span>
              </div>
            </motion.div>

            <h1 className="display-heading text-[clamp(2.25rem,11vw,6.5rem)] leading-[0.92] mb-6 text-neutral-900 dark:text-white transition-colors duration-300">
              {heroContent.headlineLines.map((line, i) => (
                <div key={`${line.text}-${i}`}>
                  <SplitText
                    text={line.text}
                    delay={0.16 + i * 0.08}
                    className={line.muted ? "text-neutral-500 dark:text-neutral-500" : ""}
                    reducedMotion={prefersReducedMotion}
                  />
                </div>
              ))}
            </h1>

            <motion.p
              variants={HERO_SEQUENCE.item}
              className="mb-3 text-sm md:text-base font-medium tracking-[0.08em] uppercase text-neutral-500 dark:text-neutral-400 transition-colors duration-300"
            >
              {siteConfig.author.name}
            </motion.p>

            <motion.div
              variants={HERO_SEQUENCE.item}
              className="mb-10 text-sm md:text-base italic tracking-[0.04em] leading-relaxed text-neutral-700 dark:text-neutral-200 max-w-136 min-h-[3.2rem] md:min-h-12 transition-colors duration-300"
            >
              <TypewriterText
                text={heroContent.typewriter}
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
              {heroContent.actions.map((action, i) => (
                <InteractiveHoverButton
                  key={`${action.label}-${i}`}
                  text={action.label}
                  href={action.href}
                  aria-label={action.label}
                  classes={
                    i === 0
                      ? "h-12 sm:h-14 px-6 sm:px-8 rounded-full bg-neutral-900 text-white dark:bg-white dark:text-black text-xs sm:text-sm font-semibold hover-lift"
                      : "h-12 sm:h-14 px-6 sm:px-8 rounded-full text-xs sm:text-sm font-semibold border-neutral-300 text-neutral-800 dark:border-white/35 dark:text-white bg-transparent hover-lift"
                  }
                />
              ))}
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
              className="relative w-56 h-72 sm:w-72 sm:h-96 md:w-96 md:h-[34rem] lg:w-[34rem] lg:h-[44rem] xl:w-[38rem] xl:h-[50rem] mx-auto lg:ml-auto lg:-mr-12 xl:-mr-24"
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-900 shadow-xl dark:shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-colors duration-300">
                {/\.(mp4|webm)$/i.test(heroContent.profileVideo) ? (
                  <video
                    src={encodeURI(heroContent.profileVideo)}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                  />
                ) : (
                   
                  <img
                    src={encodeURI(heroContent.profileVideo)}
                    alt={siteConfig.author.name}
                    className="w-full h-full object-cover"
                  />
                )}

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
        className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden sm:flex flex-col items-center gap-2 pointer-events-none"
      >
        <motion.div
          className="w-px h-10 bg-neutral-500/70 dark:bg-neutral-400/70"
          animate={{ opacity: [1, 0.2, 1], scaleY: [1, 0.6, 1] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
  );
}
