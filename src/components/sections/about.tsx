"use client";

import { motion, type Variants } from "framer-motion";
import Markdown, { type Components } from "react-markdown";
import { SectionHeading } from "@/components/common";
import Image from "@/components/common/site-image";
import { aboutContent } from "@/data/site-content";
import portraits from "@/content/portraits.json";
import { siteConfig } from "@/config";

// Render bio Markdown inline: keep the paragraph wrapper as the motion element
// and map **bold** to the highlighted-word styling the design uses.
const markdownComponents: Components = {
  p: ({ children }) => <>{children}</>,
  strong: ({ children }) => (
    <span className="font-medium text-foreground">{children}</span>
  ),
};

const container: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
  },
};

export function About() {
  return (
    <section id="about" className="scroll-section section-y relative">
      <div className="shell">
        <SectionHeading index="01" eyebrow={aboutContent.eyebrow} title={aboutContent.heading} />

        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,0.7fr)_minmax(0,1.3fr)] lg:gap-14 xl:gap-20">
        <figure className="mx-auto w-full max-w-[19rem] lg:sticky lg:top-28 lg:max-w-none">
          <div className="relative aspect-[1031/1525] overflow-hidden rounded-2xl border border-line bg-[#09090b]">
            <Image
              src={portraits.about}
              alt={`Portrait of ${siteConfig.author.name}`}
              fill
              sizes="(min-width: 1280px) 380px, (min-width: 1024px) 30vw, 304px"
              quality={90}
              className="object-cover object-top"
            />
          </div>
        </figure>
        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="max-w-3xl"
        >
          <div className="space-y-5 sm:space-y-6">
            {aboutContent.paragraphs.map((para, i) => (
              <motion.div
                key={i}
                variants={item}
                className={
                  i === 0
                    ? "text-[1.25rem] font-medium leading-snug tracking-[-0.015em] text-foreground sm:text-2xl"
                    : "text-base leading-relaxed text-muted-foreground sm:text-[17px]"
                }
              >
                <Markdown components={markdownComponents}>{para}</Markdown>
              </motion.div>
            ))}

            {aboutContent.quote && <motion.figure variants={item} className="relative mt-2 border-t border-line pt-6 sm:pt-8">
              <span aria-hidden="true" className="absolute -top-1 left-0 text-5xl leading-none text-accent">
                &ldquo;
              </span>
              <blockquote className="pl-8 text-2xl leading-snug text-foreground sm:text-[1.75rem]">
                {aboutContent.quote}
              </blockquote>
            </motion.figure>}
          </div>
        </motion.div>
        </div>
      </div>
    </section>
  );
}
