"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
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
    // The visible characters are individual spans for the stagger, which screen
    // readers announce one letter at a time. Expose the whole word once instead.
    <span className={`inline-flex overflow-hidden ${className}`} role="text" aria-label={text}>
      {text.split("").map((char, i) => (
        <motion.span
          key={`${char}-${i}`}
          aria-hidden="true"
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

    // The loop is infinite, so it would otherwise keep scheduling timers for a
    // tab nobody is looking at.
    const onVisibility = () => {
      if (document.hidden && timeoutId) window.clearTimeout(timeoutId);
      else if (!document.hidden && !isDisposed) startTypingCycle(0);
    };

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
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      isDisposed = true;
      document.removeEventListener("visibilitychange", onVisibility);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [charInterval, loopDelay, reducedMotion, startDelay, text]);

  const visibleText = text.slice(0, visibleCount);
  const isComplete = visibleCount >= text.length;

  return (
    // The full string is exposed once, statically. The animated copy is hidden:
    // the old version had an aria-live region that re-announced "typing" /
    // "typing complete" on every loop of an infinite animation.
    <span className="relative block" role="text" aria-label={text}>
      {/* Reserve final multiline height so surrounding layout never shifts. */}
      <span className="invisible" aria-hidden="true">
        {text}...
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        {visibleText}
        <motion.span
          className="inline-block"
          initial={{ opacity: 0 }}
          animate={isComplete ? { opacity: [1, 0.25, 1] } : { opacity: 0 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          ...
        </motion.span>
      </span>
    </span>
  );
}

/**
 * Hero portrait. The source may be a video or a still, and either can fail, so
 * this handles all three states.
 *
 * The video is decorative, muted, and looping, so it is hidden from assistive
 * tech and the still carries the alt text. It preloads metadata only — the old
 * `preload="auto"` pulled the full multi-megabyte file on every page load — and
 * it does not autoplay under prefers-reduced-motion. A pause control is offered
 * either way, since auto-playing motion needs a way to stop it (WCAG 2.2.2).
 */
function HeroMedia({ reducedMotion }: { reducedMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [isPlaying, setIsPlaying] = useState(!reducedMotion);

  const src = heroContent.profileVideo;
  const poster = heroContent.profilePoster;
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    if (reducedMotion) {
      video.pause();
      setIsPlaying(false);
    }
  }, [reducedMotion]);

  const toggle = () => {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) {
      void video.play().then(() => setIsPlaying(true)).catch(() => setIsPlaying(false));
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  if (!isVideo || videoFailed) {
    const fallback = videoFailed ? poster ?? src : src;
    return (
      <Image
        src={fallback}
        alt={siteConfig.author.name}
        fill
        priority
        sizes="(max-width: 640px) 224px, (max-width: 1024px) 384px, 608px"
        className="object-cover"
      />
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        src={encodeURI(src)}
        poster={poster ? encodeURI(poster) : undefined}
        autoPlay={!reducedMotion}
        muted
        loop
        playsInline
        preload="metadata"
        aria-hidden="true"
        tabIndex={-1}
        disablePictureInPicture
        onError={() => setVideoFailed(true)}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        className="h-full w-full object-cover"
      />
      <button
        type="button"
        onClick={toggle}
        aria-label={isPlaying ? "Pause background video" : "Play background video"}
        className="absolute bottom-3 right-3 z-10 flex h-11 w-11 items-center justify-center rounded-full border border-white/25 bg-black/45 text-white opacity-60 backdrop-blur-md transition-all duration-300 hover:scale-105 hover:bg-black/75 hover:opacity-100 focus-visible:opacity-100"
      >
        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
      </button>
      {/* The portrait still carries the accessible name for the whole media slot. */}
      <span className="sr-only">{siteConfig.author.name}</span>
    </>
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
            className="max-w-150 order-1"
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
            className="block order-2 justify-self-center lg:justify-self-end"
          >
            <motion.div
              className="relative w-56 h-72 sm:w-72 sm:h-96 md:w-96 md:h-136 lg:w-136 lg:h-176 xl:w-152 xl:h-200 mx-auto lg:ml-auto lg:-mr-12 xl:-mr-24"
            >
              <div className="relative h-full w-full overflow-hidden rounded-2xl bg-neutral-200 dark:bg-neutral-900 shadow-xl dark:shadow-2xl ring-1 ring-black/5 dark:ring-white/10 transition-colors duration-300">
                <HeroMedia reducedMotion={prefersReducedMotion} />
                <div className="pointer-events-none absolute inset-0 shadow-[inset_0_0_60px_rgba(0,0,0,0.15)] dark:shadow-[inset_0_0_80px_rgba(0,0,0,0.6)]" />
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
