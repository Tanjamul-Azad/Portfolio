"use client";

import { motion } from "motion/react";
import { testimonials } from "@/data";
import { TestimonialsColumn, type TestimonialItem } from "@/components/ui/testimonials-columns-1";

export function Testimonials() {
  const testimonialItems: TestimonialItem[] = testimonials.map((testimonial) => ({
    text: testimonial.content,
    image: `https://ui-avatars.com/api/?name=${encodeURIComponent(testimonial.name)}&background=f59e0b&color=fff&size=96`,
    name: testimonial.name,
    role: `${testimonial.role} at ${testimonial.company}`,
  }));

  const firstColumn = testimonialItems.slice(0, 1);
  const secondColumn = testimonialItems.slice(1, 2);
  const thirdColumn = testimonialItems.slice(2, 3);
  const hasTestimonials = testimonialItems.length > 0;

  return (
    <section id="testimonials" className="scroll-section py-28 relative overflow-hidden">
      <div className="container px-6 mx-auto relative">
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
            className="text-4xl md:text-6xl font-bold font-heading mb-6 text-neutral-900 dark:text-white tracking-tight"
          >
            References & Validation
          </motion.h2>

          <motion.p
            className="text-neutral-500 dark:text-neutral-400 text-lg max-w-xl mx-auto leading-relaxed"
          >
            Professional references and recommendation letters can be shared on request.
          </motion.p>
        </motion.div>

        {/* Animated Columns */}
        {hasTestimonials ? (
          <div className="flex justify-center gap-6 mt-10 mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)] max-h-185 overflow-hidden">
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
