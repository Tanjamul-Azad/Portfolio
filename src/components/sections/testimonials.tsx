"use client";

import { motion } from "motion/react";
import { testimonials } from "@/data";
import { TestimonialsColumn, type TestimonialItem } from "@/components/ui/testimonials-columns-1";

export function Testimonials() {
  // Avatars are rendered locally from initials — the previous version hit
  // ui-avatars.com on every page view, which is a third-party request, a
  // referrer leak, and a single point of failure for a purely decorative image.
  const testimonialItems: TestimonialItem[] = testimonials.map((testimonial) => ({
    text: testimonial.content,
    name: testimonial.name,
    role: `${testimonial.role} at ${testimonial.company}`,
  }));

  // Deal the items round-robin across the columns instead of slicing fixed
  // single-item windows, which silently dropped everything past the third entry.
  const columns: TestimonialItem[][] = [[], [], []];
  testimonialItems.forEach((item, i) => columns[i % 3].push(item));
  const [firstColumn, secondColumn, thirdColumn] = columns;
  const hasTestimonials = testimonialItems.length > 0;

  return (
    <section id="testimonials" className="scroll-section py-20 md:py-28 relative overflow-hidden">
      <div className="container px-4 sm:px-6 mx-auto relative">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          viewport={{ once: true }}
          className="mb-16 text-center max-w-3xl mx-auto"
        >
          <motion.span className="text-xs text-neutral-500 dark:text-neutral-400 tracking-[0.3em] uppercase mb-4 block">
            References
          </motion.span>

          <motion.h2
            className="text-3xl sm:text-4xl md:text-6xl font-bold font-heading mb-6 text-neutral-900 dark:text-white tracking-tight"
          >
            References & Recommendations
          </motion.h2>

          <motion.p
            className="text-neutral-500 dark:text-neutral-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed"
          >
            Professional references and recommendation letters can be shared on request.
          </motion.p>
        </motion.div>

        {/* Animated Columns */}
        {hasTestimonials ? (
          <div className="flex justify-center gap-4 sm:gap-6 mt-10 sm:mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] sm:max-h-185 sm:overflow-hidden">
            <TestimonialsColumn testimonials={firstColumn} duration={15} />
            <TestimonialsColumn
              testimonials={secondColumn}
              className="hidden md:block"
              duration={19}
            />
            <TestimonialsColumn
              testimonials={thirdColumn}
              className="hidden lg:block"
              duration={17}
            />
          </div>
        ) : (
          <div className="mx-auto mt-8 max-w-2xl rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/70 dark:bg-neutral-900/60 px-6 py-8 text-center">
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
              References are intentionally not published publicly. Verified recommendations are available during recruitment or collaboration discussions.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
