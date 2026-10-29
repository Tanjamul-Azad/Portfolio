"use client";

import { useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, Copy, MessageCircle, PenLine } from "lucide-react";
import { toast } from "sonner";
import dynamic from "next/dynamic";

// react-hook-form + zod only matter once someone starts typing; split them out
// of the first load. The placeholder holds the form's height so nothing jumps.
const ContactForm = dynamic(() => import("./contact-form").then((m) => m.ContactForm), {
  ssr: false,
  loading: () => <div aria-hidden="true" className="h-[22rem] animate-pulse rounded-xl bg-surface-2/40" />,
});
import { siteConfig } from "@/config";
import { sectionsContent } from "@/data/site-content";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function Contact() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const email = siteConfig.contact.email;

  async function copyEmail() {
    try {
      await navigator.clipboard.writeText(email);
      setCopied(true);
      toast.success("Email copied to clipboard");
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard can be blocked (insecure context, permissions) — fall back to mailto.
      window.location.href = `mailto:${email}`;
    }
  }

  function toggleForm() {
    const opening = !isFormOpen;
    setIsFormOpen(opening);
    if (!opening) return;
    // Bring the form into view once it has started to open, and put the
    // cursor in the first field so a visitor can just start typing.
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.setTimeout(() => {
      panelRef.current?.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "center" });
      panelRef.current?.querySelector<HTMLInputElement>('input[name="name"]')?.focus({ preventScroll: true });
    }, 420);
  }

  return (
    <section id="contact" className="scroll-section section-y relative">
      <div className="shell">
        <div className="border-t border-line pt-16 sm:pt-24">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.7, ease }}
            className="mx-auto flex max-w-3xl flex-col items-center text-center"
          >
            <div className="flex items-center gap-3">
              <span className="eyebrow text-accent">10</span>
              <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
              <span className="eyebrow">{sectionsContent.contact.eyebrow}</span>
            </div>

            {/* Availability: the one piece of live-feeling information a visitor
                deciding whether to write actually wants. */}
            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-line bg-surface/60 px-3.5 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="relative flex h-2 w-2" aria-hidden="true">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400/70 motion-reduce:hidden" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
              </span>
              Open to internships &amp; research collaborations
            </p>

            <h2 className="display mt-7 text-[clamp(2.6rem,9vw,6rem)] text-foreground">
              {sectionsContent.contact.headingLine1}
              <br />
              {sectionsContent.contact.headingLine2}
            </h2>

            <p className="mt-6 max-w-xl text-[15px] leading-relaxed text-muted-foreground sm:text-lg">
              {sectionsContent.contact.subtext}
            </p>

            {/* The address is the call to action, set as type rather than boxed. */}
            <div className="mt-10 flex max-w-full items-center gap-2">
              <a
                href={`mailto:${email}`}
                className="group min-w-0 break-all text-[clamp(1.2rem,4.6vw,2.1rem)] font-semibold tracking-[-0.02em] text-foreground"
              >
                <span className="bg-[linear-gradient(currentColor,currentColor)] bg-[length:100%_2px] bg-[position:0_100%] bg-no-repeat pb-1 transition-[background-size,color] duration-300 group-hover:bg-[length:0%_2px] group-hover:text-accent">
                  {email}
                </span>
              </a>
              <button
                type="button"
                onClick={copyEmail}
                aria-label={copied ? "Email copied" : "Copy email address"}
                className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-line text-muted-foreground transition-colors hover:border-line-strong hover:text-foreground"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
              </button>
            </div>

            <div className="mt-8 flex w-full flex-col gap-2.5 sm:w-auto sm:flex-row">
              <a
                href={`mailto:${email}`}
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full bg-foreground px-7 text-sm font-semibold text-background transition-transform duration-300 hover:-translate-y-0.5"
              >
                Send an email
                <ArrowUpRight className="h-4 w-4" />
              </a>
              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-line-strong px-7 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
              >
                <MessageCircle className="h-4 w-4" />
                WhatsApp
              </a>
              <button
                type="button"
                onClick={toggleForm}
                aria-expanded={isFormOpen}
                aria-controls="contact-form-panel"
                className="inline-flex h-12 items-center justify-center gap-1.5 rounded-full border border-line-strong px-7 text-sm font-medium text-foreground transition-colors hover:bg-surface-2"
              >
                <PenLine className="h-4 w-4" />
                Write a message
                <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isFormOpen && "rotate-180")} />
              </button>
            </div>

            {/* Form, folded away until asked for. */}
            <div
              id="contact-form-panel"
              ref={panelRef}
              className={cn(
                "grid w-full text-left transition-[grid-template-rows,margin] duration-500 ease-in-out",
                isFormOpen ? "mt-10 grid-rows-[1fr]" : "mt-0 grid-rows-[0fr]"
              )}
            >
              <div className="overflow-hidden" inert={!isFormOpen}>
                <div className="rounded-2xl border border-line bg-surface/50 p-5 sm:p-7">
                  <h3 className="text-base font-semibold text-foreground">Send a message</h3>
                  <p className="mb-5 mt-0.5 text-sm text-muted-foreground">Lands straight in my inbox.</p>
                  <ContactForm />
                </div>
              </div>
            </div>

            <p className="mt-10 flex flex-col items-center gap-1.5 text-xs text-muted-foreground sm:flex-row sm:gap-5">
              <span>{sectionsContent.contact.responseTime}</span>
              <span aria-hidden="true" className="hidden h-3 w-px bg-line-strong sm:block" />
              <span>Or ask the AI assistant, bottom right</span>
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
