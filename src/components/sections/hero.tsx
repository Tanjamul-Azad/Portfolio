"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  MotionConfig,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, MapPin, Pause, Play } from "lucide-react";
import { siteConfig } from "@/config";
import { heroContent } from "@/data/site-content";
import { HERO_SEQUENCE, MOTION_TOKENS } from "@/lib";

function SplitText({
  text,
  delay = 0,
  charStagger = 0.028,
  className = "",
}: {
  text: string;
  delay?: number;
  charStagger?: number;
  className?: string;
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
          // The same initial state on server and client, whatever the visitor's
          // motion preference: branching on it here rendered different inline
          // styles on each side and broke hydration. Reduced motion is handled
          // by the MotionConfig around the hero, which drops the transform and
          // keeps only the fade.
          initial={{ y: "115%", rotateZ: 3, opacity: 0 }}
          animate={{ y: 0, rotateZ: 0, opacity: 1 }}
          transition={{
            duration: 0.65,
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
  // Starts empty on both server and client; the effect fills it in at once
  // under reduced motion. Seeding it from the preference broke hydration.
  const [visibleCount, setVisibleCount] = useState(0);

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
        {text}_
      </span>
      <span className="absolute inset-0" aria-hidden="true">
        {visibleText}
        <motion.span
          className="ml-px inline-block h-[1.05em] w-[0.5ch] translate-y-[0.18em] bg-current align-baseline"
          initial={{ opacity: 1 }}
          animate={isComplete ? { opacity: [1, 0, 1] } : { opacity: 1 }}
          transition={isComplete ? { duration: 1.05, repeat: Infinity, ease: "linear" } : { duration: 0 }}
        />
      </span>
    </span>
  );
}

/**
 * Hero portrait.
 *
 * The still is always rendered first, through next/image with priority, so it
 * is what the browser paints as the largest element: an optimised AVIF/WebP of
 * a few dozen KB rather than a 3 MB video. The looping video is an
 * enhancement layered on top, and only where it is cheap: a wide screen, no
 * reduced-motion or data-saver preference, and only once the page has loaded
 * and gone idle. Phones keep the still, which was most of the mobile LCP.
 *
 * The video is decorative, so it is hidden from assistive tech and the still
 * carries the alt text. A pause control is offered while it plays, since
 * auto-playing motion needs a way to stop it (WCAG 2.2.2).
 */
function HeroMedia({ reducedMotion }: { reducedMotion: boolean }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoFailed, setVideoFailed] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const src = heroContent.profileVideo;
  const isVideo = /\.(mp4|webm|mov)$/i.test(src);
  const still = isVideo ? heroContent.profilePoster : src;

  useEffect(() => {
    if (!isVideo || reducedMotion) return;
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (connection?.saveData) return;
    if (!window.matchMedia("(min-width: 1024px)").matches) return;

    let idleId = 0;
    let timeoutId = 0;
    const start = () => {
      const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
      if (w.requestIdleCallback) idleId = w.requestIdleCallback(() => setShowVideo(true), { timeout: 2500 });
      else timeoutId = window.setTimeout(() => setShowVideo(true), 1200);
    };

    if (document.readyState === "complete") start();
    else window.addEventListener("load", start, { once: true });

    return () => {
      window.removeEventListener("load", start);
      const w = window as Window & { cancelIdleCallback?: (id: number) => void };
      if (idleId && w.cancelIdleCallback) w.cancelIdleCallback(idleId);
      if (timeoutId) window.clearTimeout(timeoutId);
    };
  }, [isVideo, reducedMotion]);

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

  return (
    <>
      {still ? (
        <Image
          src={still}
          alt={siteConfig.author.name}
          fill
          priority
          fetchPriority="high"
          sizes="(max-width: 1024px) 100vw, 520px"
          className="object-cover"
        />
      ) : (
        <span className="sr-only">{siteConfig.author.name}</span>
      )}

      {showVideo && !videoFailed && (
        <>
          <video
            ref={videoRef}
            src={encodeURI(src)}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            aria-hidden="true"
            tabIndex={-1}
            disablePictureInPicture
            onError={() => setVideoFailed(true)}
            onPlaying={() => {
              setVideoReady(true);
              setIsPlaying(true);
            }}
            onPause={() => setIsPlaying(false)}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${videoReady ? "opacity-100" : "opacity-0"}`}
          />
          {/* Kept out of sight so nothing sits on the portrait, but still reachable
              by keyboard — auto-playing motion needs a way to stop it (WCAG 2.2.2). */}
          <button
            type="button"
            onClick={toggle}
            aria-label={isPlaying ? "Pause background video" : "Play background video"}
            className="sr-only focus-visible:not-sr-only focus-visible:absolute focus-visible:bottom-3 focus-visible:right-3 focus-visible:z-10 focus-visible:flex focus-visible:h-11 focus-visible:w-11 focus-visible:items-center focus-visible:justify-center focus-visible:rounded-full focus-visible:border focus-visible:border-white/25 focus-visible:bg-black/75 focus-visible:text-white focus-visible:backdrop-blur-md"
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </button>
        </>
      )}
    </>
  );
}

/**
 * Local time in Dhaka, ticking once a minute. Rendered only after mount —
 * the server's clock and the visitor's would otherwise disagree and trip a
 * hydration warning.
 */
function LocalTime() {
  const [time, setTime] = useState<string | null>(null);

  useEffect(() => {
    const format = new Intl.DateTimeFormat("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: "Asia/Dhaka",
    });
    const tick = () => setTime(format.format(new Date()));
    tick();
    const id = window.setInterval(tick, 30_000);
    return () => window.clearInterval(id);
  }, []);

  return <span className="tabular-nums">{time ?? "\u00A0"}</span>;
}

const heroSocials = [
  { label: "GitHub", href: siteConfig.links.github },
  { label: "LinkedIn", href: siteConfig.links.linkedin },
  { label: "Facebook", href: siteConfig.links.facebook },
];

export function Hero() {
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = useReducedMotion() ?? false;

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const heroOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 0.6], [0, 60]);

  const [primaryAction, ...secondaryActions] = heroContent.actions;

  return (
    <MotionConfig reducedMotion="user">
    <section
      ref={sectionRef}
      id="hero"
      className="scroll-section relative z-10 flex min-h-svh items-center overflow-hidden bg-background"
    >
      {/* Backdrop: a faint grid fading out from the top, and a warm glow
          behind the headline. Both static — painted once, never animated. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 opacity-70 [background-image:linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] [background-size:64px_64px] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_0%,black,transparent)]" />
        <div className="absolute left-1/2 top-[-18%] h-[55svh] w-[min(80rem,120vw)] -translate-x-1/2 rounded-full bg-amber-500/[0.08] blur-[120px] dark:bg-amber-400/[0.07]" />
      </div>

      <div className="shell relative z-10 pb-10 pt-20 sm:pt-24 hero-wide:pb-16 hero-wide:pt-28">
        {/* One grid, two arrangements. On a phone the badge and the name sit
            in the same cell as the portrait, overlaid on it, so name and face
            read as a single composed card instead of separate floating
            blocks. Once there is room across — desktop, or a phone turned
            landscape — the portrait moves out to its own right-hand column. */}
        <motion.div
          style={{ opacity: heroOpacity, y: heroY }}
          variants={HERO_SEQUENCE.container}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 hero-wide:grid-cols-[minmax(0,1fr)_auto] hero-wide:gap-x-14 xl:gap-x-20"
        >
          {/* Portrait */}
          <motion.div
            variants={HERO_SEQUENCE.media}
            className="relative col-start-1 row-start-1 hero-wide:col-start-2 hero-wide:row-span-4 hero-wide:self-center"
          >
            <div className="relative aspect-[5/6] max-h-[50svh] w-full overflow-hidden rounded-[1.75rem] bg-surface-2 ring-1 ring-line hero-wide:aspect-[3/4] hero-wide:h-[min(40rem,74svh)] hero-wide:max-h-none hero-wide:w-auto">
              <HeroMedia reducedMotion={prefersReducedMotion} />
              {/* Phone only: darkens the lower half so the overlaid name stays legible. */}
              <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/10 hero-wide:hidden" />
              <div className="pointer-events-none absolute inset-0 rounded-[1.75rem] ring-1 ring-inset ring-white/10" />
            </div>

            {/* Desktop: location + local time, docked on the portrait's edge. */}
            <div className="absolute -left-6 bottom-8 hidden items-center gap-3 rounded-2xl border border-line bg-background/80 px-4 py-3 shadow-xl backdrop-blur-xl hero-wide:flex">
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-surface-2">
                <MapPin className="h-4 w-4 text-accent" />
              </span>
              <span className="flex flex-col">
                <span className="text-[13px] font-medium text-foreground">{siteConfig.author.location}</span>
                <span className="font-mono text-[11px] text-muted-foreground">
                  <LocalTime /> · GMT+6
                </span>
              </span>
            </div>
          </motion.div>

          {/* Availability badge — glass over the photo on phones. */}
          <motion.div
            variants={HERO_SEQUENCE.item}
            className="relative z-10 col-start-1 row-start-1 self-start p-3.5 hero-wide:mb-8 hero-wide:p-0"
          >
            <span className="inline-flex items-center gap-2.5 rounded-full border border-white/15 bg-black/35 py-1.5 pl-2.5 pr-3.5 text-white backdrop-blur-md hero-wide:border-line hero-wide:bg-surface/70 hero-wide:text-foreground">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
              </span>
              <span className="font-mono text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-300 hero-wide:text-emerald-700 dark:hero-wide:text-emerald-400">
                {heroContent.badge.status}
              </span>
              <span className="text-xs font-medium">{heroContent.badge.text}</span>
            </span>
          </motion.div>

          {/* Name. Overlaid on the portrait's lower edge on phones; the
              second line is set in the serif italic for an editorial pairing.
              The svh term keeps it from eating a short landscape screen. */}
          <h1 className="display relative z-10 col-start-1 row-start-1 self-end p-5 pb-6 text-[clamp(3rem,15vw,4.5rem)] text-white hero-wide:row-start-2 hero-wide:mb-6 hero-wide:self-auto hero-wide:p-0 hero-wide:text-[clamp(3.5rem,min(8vw,15svh),7.5rem)] hero-wide:text-foreground">
            {heroContent.headlineLines.map((line, i) => (
              <div key={`${line.text}-${i}`}>
                <SplitText
                  text={line.text}
                  delay={0.16 + i * 0.08}
                  className={
                    i > 0
                      ? "accent-serif -mt-[0.06em] pr-[0.12em] text-[1.08em]"
                      : line.muted
                        ? "text-muted-foreground"
                        : ""
                  }
                />
              </div>
            ))}
          </h1>

          {/* Copy, actions, proof */}
          <motion.div
            variants={HERO_SEQUENCE.container}
            className="col-start-1 mt-5 max-w-xl hero-wide:row-start-3 hero-wide:mt-0"
          >
            <motion.p
              variants={HERO_SEQUENCE.item}
              className="text-balance text-xl font-medium leading-snug tracking-[-0.02em] text-foreground sm:text-2xl"
            >
              {heroContent.tagline}
            </motion.p>

            <motion.div
              variants={HERO_SEQUENCE.item}
              className="mt-3 font-mono text-[12px] leading-relaxed text-muted-foreground sm:text-[13px]"
            >
              <TypewriterText
                text={heroContent.typewriter}
                startDelay={2200}
                charInterval={44}
                loopDelay={2800}
                reducedMotion={prefersReducedMotion}
              />
            </motion.div>

            <motion.div variants={HERO_SEQUENCE.item} className="mt-6 flex gap-2.5 sm:mt-7 sm:gap-3">
              {primaryAction && (
                <a
                  href={primaryAction.href}
                  className="group inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-foreground px-5 text-[13px] font-semibold text-background shadow-[0_10px_30px_-10px_rgb(0_0_0/0.45)] transition-transform duration-300 hover:-translate-y-0.5 sm:flex-none sm:px-7 sm:text-sm"
                >
                  {primaryAction.label}
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 max-[400px]:hidden" />
                </a>
              )}
              {secondaryActions.map((action, i) => (
                <a
                  key={`${action.label}-${i}`}
                  href={action.href}
                  className="inline-flex h-12 flex-1 items-center justify-center rounded-full border border-line-strong bg-surface/60 px-5 text-[13px] font-medium text-foreground backdrop-blur transition-colors duration-300 hover:bg-surface-2 sm:flex-none sm:px-7 sm:text-sm"
                >
                  {action.label}
                </a>
              ))}
            </motion.div>

            {heroContent.stats.length > 0 && (
              <motion.dl
                variants={HERO_SEQUENCE.item}
                // Dropped on a landscape phone, where it is the difference
                // between the buttons being on screen and below the fold.
                className="mt-6 grid grid-cols-3 divide-x divide-line border-y border-line py-3.5 sm:mt-8 sm:py-4 [@media(max-height:560px)]:hidden"
                style={{ gridTemplateColumns: `repeat(${Math.min(heroContent.stats.length, 3)}, minmax(0, 1fr))` }}
              >
                {heroContent.stats.slice(0, 3).map((stat, i) => (
                  <div key={`${stat.label}-${i}`} className="flex flex-col gap-1 px-3 first:pl-0 sm:px-5">
                    <dt className="order-2 text-[10px] font-medium uppercase leading-snug tracking-[0.06em] text-muted-foreground sm:text-[11px] sm:tracking-[0.12em]">
                      {stat.label}
                    </dt>
                    <dd className="display order-1 text-[1.75rem] text-foreground sm:text-4xl">{stat.value}</dd>
                  </div>
                ))}
              </motion.dl>
            )}

            <motion.ul variants={HERO_SEQUENCE.item} className="mt-6 hidden items-center gap-5 hero-wide:flex">
              {heroSocials.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {social.label}
                    <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                  </a>
                </li>
              ))}
            </motion.ul>
          </motion.div>
        </motion.div>
      </div>

      <motion.div
        aria-hidden="true"
        initial={{ opacity: 0 }}
        animate={{ opacity: prefersReducedMotion ? 0 : 1 }}
        transition={{ delay: MOTION_TOKENS.duration.slow }}
        className="pointer-events-none absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 hero-wide:flex [@media(max-height:560px)]:hidden"
      >
        <span className="eyebrow text-[10px]">Scroll</span>
        <motion.span
          className="h-8 w-px origin-top bg-line-strong"
          animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </section>
    </MotionConfig>
  );
}
