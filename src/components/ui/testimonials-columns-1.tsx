"use client";

import React, { Fragment } from "react";
import { motion } from "motion/react";

export type TestimonialItem = {
  text: string;
  /** Optional avatar URL. Without one, initials are rendered locally. */
  image?: string;
  name: string;
  role: string;
};

/** "Ada Lovelace" -> "AL". Falls back to a single letter for one-word names. */
function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join("");
}

export function TestimonialsColumn(props: {
  className?: string;
  testimonials: TestimonialItem[];
  duration?: number;
}) {
  return (
    <div className={props.className}>
      <motion.div
        animate={{
          translateY: "-50%",
        }}
        transition={{
          duration: props.duration ?? 10,
          repeat: Infinity,
          ease: "linear",
          repeatType: "loop",
        }}
        aria-hidden={false}
        className="flex flex-col gap-6 pb-6 bg-background"
      >
        {new Array(2).fill(0).map((_, index) => (
          <Fragment key={index}>
            {props.testimonials.map(({ text, image, name, role }, i) => (
              <div
                className="p-5 sm:p-8 md:p-10 rounded-3xl border shadow-lg shadow-primary/10 max-w-[88vw] sm:max-w-xs w-full"
                key={`${name}-${i}`}
              >
                <div>{text}</div>
                <div className="flex items-center gap-2 mt-5">
                  {image ? (
                    // Arbitrary remote avatar, deliberately outside the optimizer.
                    <img
                      width={40}
                      height={40}
                      src={image}
                      alt=""
                      loading="lazy"
                      decoding="async"
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  ) : (
                    // Rendered locally rather than fetched from an avatar service:
                    // that was a third-party request on every visit, leaking the
                    // referrer and breaking whenever the service was down.
                    <span
                      aria-hidden="true"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-500 text-sm font-semibold text-white"
                    >
                      {initialsOf(name)}
                    </span>
                  )}
                  <div className="flex flex-col">
                    <div className="font-medium tracking-tight leading-5">{name}</div>
                    <div className="leading-5 opacity-60 tracking-tight">{role}</div>
                  </div>
                </div>
              </div>
            ))}
          </Fragment>
        ))}
      </motion.div>
    </div>
  );
}
