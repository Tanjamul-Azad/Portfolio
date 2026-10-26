"use client";

import { useEffect, useState } from "react";
import { ArrowRight, ArrowUpRight, MapPin } from "lucide-react";
import { SignaturePortrait } from "@/components/common/signature-portrait";
import { siteConfig } from "@/config";
import { heroContent } from "@/data/site-content";

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
  const [primaryAction, ...secondaryActions] = heroContent.actions;

  return (
    <section id="hero" className="scroll-section hero-section relative z-10 flex min-h-svh items-center overflow-hidden bg-background">
      <div className="shell hero-shell relative z-10 pb-7 pt-18 sm:pt-20 hero-wide:pb-12 hero-wide:pt-24">
        <div className="grid grid-cols-1 items-center hero-wide:grid-cols-[minmax(0,1fr)_auto] hero-wide:gap-x-12 xl:gap-x-16">
          <div className="relative col-start-1 row-start-1 hero-wide:col-start-2 hero-wide:row-span-2">
            <SignaturePortrait />
          </div>

          <div className="hero-name-frame relative z-10 col-start-1 row-start-2 mt-1 min-w-0 [container-type:inline-size] hero-wide:row-start-1 hero-wide:mb-6 hero-wide:mt-0 hero-wide:self-end">
            <h1 className="display hero-name text-center text-[1.6rem] text-foreground hero-wide:text-left hero-wide:text-[clamp(2rem,min(21cqw,15svh),7.5rem)]">
              {heroContent.headlineLines.map((line, i) => (
                <span key={`${line.text}-${i}`} className={`inline hero-wide:block ${line.muted ? "text-muted-foreground" : ""}`}>
                  {i > 0 && <span className="hero-wide:hidden"> </span>}{line.text}
                </span>
              ))}
            </h1>
          </div>

          <div className="hero-copy col-start-1 row-start-3 mx-auto mt-3 w-full max-w-xl text-center hero-wide:row-start-2 hero-wide:mx-0 hero-wide:mt-0 hero-wide:self-start hero-wide:text-left">
            <p className="hero-tagline text-balance text-[15px] font-medium leading-snug tracking-[-0.02em] text-foreground sm:text-lg hero-wide:text-2xl">
              {heroContent.tagline}
            </p>
            <p className="hero-role mx-auto mt-2 max-w-[22rem] font-mono text-[11px] leading-relaxed text-muted-foreground sm:text-[13px] hero-wide:mx-0 hero-wide:mt-3 hero-wide:max-w-none">
              {heroContent.typewriter}
            </p>

            <div className="hero-actions mt-4 flex justify-center gap-2.5 sm:gap-3 hero-wide:mt-7 hero-wide:justify-start">
              {primaryAction && <a href={primaryAction.href}
                className="group inline-flex h-11 flex-1 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-foreground px-4 text-[13px] font-semibold text-background shadow-[0_10px_30px_-10px_rgb(0_0_0/0.35)] transition-transform duration-300 hover:-translate-y-0.5 sm:flex-none sm:px-7 sm:text-sm">
                {primaryAction.label}<ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5 max-[400px]:hidden" />
              </a>}
              {secondaryActions.map((action, i) => <a key={`${action.label}-${i}`} href={action.href}
                className="inline-flex h-11 flex-1 items-center justify-center whitespace-nowrap rounded-full border border-line-strong bg-surface/60 px-4 text-[13px] font-medium text-foreground backdrop-blur transition-colors duration-300 hover:bg-surface-2 sm:flex-none sm:px-7 sm:text-sm">
                {action.label}
              </a>)}
            </div>

            {heroContent.stats.length > 0 && <dl className="hero-stats mt-5 grid grid-cols-3 divide-x divide-line border-y border-line py-3 sm:py-4 hero-wide:mt-8 [@media(max-height:740px)]:hidden"
              style={{ gridTemplateColumns: `repeat(${Math.min(heroContent.stats.length, 3)}, minmax(0, 1fr))` }}>
              {heroContent.stats.slice(0, 3).map((stat, i) => <div key={`${stat.label}-${i}`} className="flex flex-col gap-1 px-3 first:pl-0 sm:px-5">
                <dt className="order-2 text-[10px] font-medium uppercase leading-snug tracking-[0.06em] text-muted-foreground sm:text-[11px] sm:tracking-[0.12em]">{stat.label}</dt>
                <dd className="display order-1 text-[1.75rem] text-foreground sm:text-4xl">{stat.value}</dd>
              </div>)}
            </dl>}

            <ul className="hero-socials mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 hero-wide:mt-6 hero-wide:justify-start">
              {heroSocials.map((social) => <li key={social.label}>
                <a href={social.href} target="_blank" rel="noopener noreferrer" className="group inline-flex items-center gap-1 text-[13px] font-medium text-muted-foreground transition-colors hover:text-foreground">
                  {social.label}<ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </a>
              </li>)}
              <li className="hero-location flex items-center gap-1.5 font-mono text-[11px] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-accent" aria-hidden="true" /><span>Dhaka</span><span aria-hidden="true">·</span><LocalTime /><span>GMT+6</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <a href="#about" aria-label="Scroll to About" className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-muted-foreground transition-colors hover:text-foreground hero-wide:flex [@media(max-height:740px)]:hidden">
        <span className="eyebrow text-[10px]">Scroll</span><span aria-hidden="true" className="h-6 w-px bg-line-strong" />
      </a>
    </section>
  );
}
