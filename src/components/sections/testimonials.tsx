"use client";

import { testimonials } from "@/data";
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

  if (testimonialItems.length === 0) return null;

  return (
    <section id="testimonials" className="scroll-section section-y relative overflow-hidden">
      <div className="shell">
        <SectionHeading
          eyebrow="References"
          title={
            <>
              Kind words
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
