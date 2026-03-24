"use client";

import { motion } from "framer-motion";
import { Quote, Star } from "lucide-react";
import { testimonials } from "@/data";
import { SECTION_REVEAL } from "@/lib";
import { useRouteTransitioning } from "@/components/providers/page-transition";

export function Testimonials() {
  const { isRouteTransitioning } = useRouteTransitioning();

  return (
    <section id="testimonials" className="py-28 relative bg-neutral-50 dark:bg-black overflow-hidden">
      <div className="container px-6 mx-auto relative">
        {/* Header */}
        <motion.div
          variants={SECTION_REVEAL.container}
          initial="hidden"
          whileInView={isRouteTransitioning ? undefined : "visible"}
          viewport={{ once: true }}
        >
          <motion.div variants={SECTION_REVEAL.heading} className="mb-4">
            <span className="text-sm text-neutral-500 dark:text-neutral-400 tracking-[0.2em] uppercase font-medium">
              What People Say
            </span>
          </motion.div>

          <motion.h2
            variants={SECTION_REVEAL.heading}
            className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4"
          >
            Testimonials
          </motion.h2>

          <motion.p
            variants={SECTION_REVEAL.heading}
            className="text-neutral-500 dark:text-neutral-400 mb-12 max-w-2xl"
          >
            Kind words from colleagues, mentors, and clients I&apos;ve had the pleasure to work with.
          </motion.p>
        </motion.div>

        {/* Testimonials Grid */}
        <motion.div
          variants={SECTION_REVEAL.container}
          initial="hidden"
          whileInView={isRouteTransitioning ? undefined : "visible"}
          viewport={{ once: true }}
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {testimonials.map((testimonial) => (
            <motion.div
              key={testimonial.id}
              variants={SECTION_REVEAL.item}
              className="group relative p-6 rounded-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 hover:border-amber-500/35 transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute -top-3 -left-3 w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                <Quote className="w-5 h-5 text-white" />
              </div>

              {/* Rating */}
              {testimonial.rating && (
                <div className="flex items-center gap-1 mb-4 pt-2">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
              )}

              {/* Content */}
              <p className="text-neutral-600 dark:text-neutral-300 text-sm leading-relaxed mb-6 italic">
                &ldquo;{testimonial.content}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3">
                {/* Avatar placeholder */}
                <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center text-white font-bold text-sm">
                  {testimonial.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                  <p className="font-semibold text-neutral-900 dark:text-white text-sm">
                    {testimonial.name}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400">
                    {testimonial.role} at {testimonial.company}
                  </p>
                </div>
              </div>

              <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-amber-500/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
