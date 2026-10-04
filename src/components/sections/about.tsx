"use client";

import { motion, type Variants } from "framer-motion";
import { Brain, Compass, Mail, MapPin } from "lucide-react";
import Markdown, { type Components } from "react-markdown";
import { SectionHeading, withSerifAccent } from "@/components/common";
import { siteConfig } from "@/config";
import { aboutContent } from "@/data/site-content";

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
  const facts = [
    { icon: MapPin, label: "Based in", value: siteConfig.author.location },
    {
      icon: Brain,
      label: "Personality",
      value: `${aboutContent.personality.type} · ${aboutContent.personality.label}`,
    },
    {
      icon: Compass,
      label: "Focus",
      value: siteConfig.author.role.split("|").slice(0, 2).map((s) => s.trim()).join(" · "),
    },
    {
      icon: Mail,
      label: "Email",
      value: siteConfig.contact.email,
      href: `mailto:${siteConfig.contact.email}`,
    },
  ];

  return (
    <section id="about" className="scroll-section section-y relative">
      <div className="shell">
        <SectionHeading index="01" eyebrow={aboutContent.eyebrow} title={withSerifAccent(aboutContent.heading)} />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          className="grid gap-8 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] lg:gap-16"
        >
          {/* At-a-glance facts. A 2×2 grid on phones, a sticky column beside
              the bio on desktop. */}
          <motion.aside variants={item} className="lg:sticky lg:top-28 lg:self-start">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-line bg-line shadow-[var(--surface-shadow)] lg:grid-cols-1">
              {facts.map(({ icon: Icon, label, value, href }, i) => (
                // The longer values (focus, email) get the full row on a phone
                // rather than being truncated to half a line.
                <div key={label} className={`flex min-w-0 flex-col gap-2 bg-surface p-4 sm:p-5 ${i >= 2 ? "col-span-2 lg:col-span-1" : ""}`}>
                  <dt className="flex items-center gap-2 eyebrow text-[10px]">
                    <Icon className="h-3.5 w-3.5 text-accent" />
                    {label}
                  </dt>
                  <dd className="break-words text-sm font-medium text-foreground">
                    {href ? (
                      <a href={href} className="-my-3 inline-block py-3 hover:text-accent hover:underline">{value}</a>
                    ) : (
                      value
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </motion.aside>

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

            <motion.figure variants={item} className="relative mt-2 border-t border-line pt-6 sm:pt-8">
              <span aria-hidden="true" className="accent-serif absolute -top-1 left-0 text-5xl leading-none text-accent">
                &ldquo;
              </span>
              <blockquote className="accent-serif pl-8 text-2xl leading-snug text-foreground sm:text-[1.75rem]">
                {aboutContent.quote}
              </blockquote>
            </motion.figure>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
