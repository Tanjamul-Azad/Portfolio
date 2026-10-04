"use client";

import { motion } from "motion/react";
import { ArrowUpRight, Quote } from "lucide-react";
import { testimonials } from "@/data";
import { siteConfig } from "@/config";
import { SectionHeading } from "@/components/common";
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

  // Nothing published: one slim strip instead of a full section with a
  // heading over an empty box.
  if (testimonialItems.length === 0) {
    return (
      <section id="testimonials" aria-label="References" className="scroll-section relative py-4 sm:py-6">
        <div className="shell">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            className="surface flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:gap-6 sm:p-6"
          >
            <span className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 sm:flex">
              <Quote className="h-4.5 w-4.5 text-accent" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="flex items-center gap-2 text-base font-semibold tracking-[-0.01em] text-foreground">
                <Quote className="h-4 w-4 text-accent sm:hidden" />
                References &amp; recommendations
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                Not published publicly — verified references are shared during recruitment or collaboration discussions.
              </p>
            </div>
            <a
              href={`mailto:${siteConfig.contact.email}?subject=${encodeURIComponent("Reference request")}`}
              className="inline-flex h-11 shrink-0 items-center justify-center gap-1.5 self-start rounded-full border border-line-strong px-5 text-[13px] font-medium text-foreground transition-colors hover:bg-surface-2 sm:h-10 sm:self-auto"
            >
              Request references
              <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section id="testimonials" className="scroll-section section-y relative overflow-hidden">
      <div className="shell">
        <SectionHeading
          eyebrow="References"
          title={
            <>
              Kind <em className="accent-serif">words</em>
            </>
          }
          description="From people I've built, researched, and studied with."
        />

        <div className="flex justify-center gap-4 sm:max-h-185 sm:gap-6 sm:overflow-hidden sm:mask-[linear-gradient(to_bottom,transparent,black_25%,black_75%,transparent)]">
          <TestimonialsColumn testimonials={firstColumn} duration={15} />
          <TestimonialsColumn testimonials={secondColumn} className="hidden md:block" duration={19} />
          <TestimonialsColumn testimonials={thirdColumn} className="hidden lg:block" duration={17} />
        </div>
      </div>
    </section>
  );
}
