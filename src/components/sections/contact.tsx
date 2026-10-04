"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight, Check, ChevronDown, Clock, Copy, MessageCircle, Sparkles } from "lucide-react";
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

export function Contact() {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [copied, setCopied] = useState(false);
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

  return (
    <section id="contact" className="scroll-section section-y relative">
      <div className="shell">
        {/* The finale is one panel rather than a heading floating over a
            background animation: everything needed to get in touch sits on a
            single surface. */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-[1.75rem] border border-line bg-surface p-5 shadow-[var(--surface-shadow)] sm:rounded-[2rem] sm:p-10 lg:p-14"
        >
          <div aria-hidden="true" className="pointer-events-none absolute inset-0">
            <div className="absolute -right-24 -top-32 h-96 w-96 rounded-full bg-amber-500/15 blur-[110px] dark:bg-amber-400/10" />
            <div className="absolute inset-0 opacity-60 [background-image:linear-gradient(to_right,var(--line)_1px,transparent_1px),linear-gradient(to_bottom,var(--line)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_60%_70%_at_100%_0%,black,transparent)]" />
          </div>

          <div className="relative grid gap-10 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-14">
            <div className="flex flex-col">
              <div className="mb-5 flex items-center gap-3">
                <span className="eyebrow text-accent">09</span>
                <span aria-hidden="true" className="h-px w-8 bg-line-strong" />
                <span className="eyebrow">{sectionsContent.contact.eyebrow}</span>
              </div>

              <h2 className="display text-[clamp(2.5rem,8vw,4.75rem)] text-foreground">
                {sectionsContent.contact.headingLine1}
                <br />
                <em className="accent-serif text-[1.06em]">{sectionsContent.contact.headingLine2}</em>
              </h2>

              <p className="mt-5 max-w-md text-[15px] leading-relaxed text-muted-foreground sm:text-base">
                {sectionsContent.contact.subtext}
              </p>

              {/* The address itself is the call to action. */}
              <div className="mt-8 flex items-center gap-2 rounded-2xl border border-line bg-background/60 p-1.5 pl-4 backdrop-blur sm:max-w-md">
                <a
                  href={`mailto:${email}`}
                  className="min-w-0 flex-1 truncate py-2.5 text-[15px] font-medium text-foreground hover:text-accent sm:text-base"
                >
                  {email}
                </a>
                <button
                  type="button"
                  onClick={copyEmail}
                  aria-label={copied ? "Email copied" : "Copy email address"}
                  className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-surface-2 text-foreground transition-colors hover:bg-line"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2 sm:flex sm:max-w-md">
                <a
                  href={`mailto:${email}`}
                  className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full bg-foreground text-[13px] font-semibold text-background transition-transform duration-300 hover:-translate-y-0.5 sm:text-sm"
                >
                  Send an email
                  <ArrowUpRight className="h-4 w-4" />
                </a>
                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-12 flex-1 items-center justify-center gap-1.5 rounded-full border border-line-strong bg-surface/60 text-[13px] font-medium text-foreground transition-colors hover:bg-surface-2 sm:text-sm"
                >
                  <MessageCircle className="h-4 w-4" />
                  WhatsApp
                </a>
              </div>

              <div className="mt-5 flex flex-col gap-1.5 text-xs text-muted-foreground sm:flex-row sm:flex-wrap sm:gap-x-5">
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 shrink-0" />
                  {sectionsContent.contact.responseTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 shrink-0" />
                  Or ask the AI assistant, bottom right
                </span>
              </div>
            </div>

            {/* Form. Always open beside the copy on desktop; folded behind a
                single row on phones so the panel stays short until wanted. */}
            <div className="rounded-2xl border border-line bg-background/70 backdrop-blur-sm lg:self-start">
              <button
                type="button"
                onClick={() => setIsFormOpen((open) => !open)}
                aria-expanded={isFormOpen}
                className="flex w-full items-center justify-between gap-4 p-4 text-left sm:p-5 lg:hidden"
              >
                <span>
                  <span className="block text-[15px] font-semibold text-foreground">Send a message</span>
                  <span className="mt-0.5 block text-xs text-muted-foreground">
                    {isFormOpen ? "Fill in the fields below" : "Tap to open the form"}
                  </span>
                </span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-line">
                  <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isFormOpen && "rotate-180")} />
                </span>
              </button>

              <div className="hidden px-6 pt-6 lg:block">
                <h3 className="text-[15px] font-semibold text-foreground">Send a message</h3>
                <p className="mt-0.5 text-xs text-muted-foreground">Lands straight in my inbox.</p>
              </div>

              <div
                className={cn(
                  "grid transition-[grid-template-rows] duration-400 ease-in-out lg:grid-rows-[1fr]",
                  isFormOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-4 pb-5 sm:px-5 lg:p-6">
                    <ContactForm />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
