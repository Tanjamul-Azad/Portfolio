"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MessageCircle, Clock, Sparkles, ChevronDown } from "lucide-react";
import { ContactForm } from "./contact-form";
import { siteConfig } from "@/config";
import { sectionsContent } from "@/data/site-content";
import { NetworkPattern } from "@/components/ui/network-pattern";

export function Contact() {
  const [isFormOpen, setIsFormOpen] = useState(false);

  return (
    <section id="contact" className="scroll-section py-16 md:py-24 relative overflow-hidden md:min-h-screen flex items-center">
      {/* Network connection pattern */}
      <NetworkPattern
        className="opacity-50 dark:opacity-30"
        numNodes={20}
        connectionDistance={180}
        animationSpeed={0.4}
        lineOpacity={0.25}
        nodeOpacity={0.7}
      />

      <div className="container px-4 sm:px-6 mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Column */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs text-neutral-400 dark:text-neutral-500 tracking-[0.3em] uppercase mb-3 block"
            >
              {sectionsContent.contact.eyebrow}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold font-heading mb-4 tracking-tight text-neutral-900 dark:text-white leading-[1.1]"
            >
              {sectionsContent.contact.headingLine1}<br />
              <span className="inline-block border-b-4 border-neutral-900 dark:border-white pb-1">
                {sectionsContent.contact.headingLine2}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 mb-6 sm:mb-8 max-w-md leading-relaxed"
            >
              {sectionsContent.contact.subtext}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
            >
              <div className="grid grid-cols-2 gap-3">
                <a
                  href={`mailto:${siteConfig.contact.email}`}
                  className="group flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-900 hover:border-neutral-900 hover:text-white dark:hover:bg-white dark:hover:border-white dark:hover:text-neutral-900 transition-colors duration-200"
                >
                  <Mail className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">Email</span>
                </a>

                <a
                  href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl border border-neutral-200 dark:border-neutral-800 text-neutral-900 dark:text-white hover:bg-neutral-900 hover:border-neutral-900 hover:text-white dark:hover:bg-white dark:hover:border-white dark:hover:text-neutral-900 transition-colors duration-200"
                >
                  <MessageCircle className="w-4 h-4 shrink-0" />
                  <span className="text-sm font-medium">WhatsApp</span>
                </a>
              </div>

              {/* Meta notes */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-5 text-xs text-neutral-400 dark:text-neutral-500">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 shrink-0" />
                  {sectionsContent.contact.responseTime}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 shrink-0" />
                  Or ask the AI assistant, bottom right
                </span>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white/50 dark:bg-neutral-900/30 backdrop-blur-sm overflow-hidden"
          >
            <button
              type="button"
              onClick={() => setIsFormOpen((open) => !open)}
              aria-expanded={isFormOpen}
              className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 text-left group cursor-pointer"
            >
              <div>
                <h3 className="text-base sm:text-lg font-semibold text-neutral-900 dark:text-white">
                  Send a message
                </h3>
                <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-0.5">
                  {isFormOpen ? "Fill in the fields below" : "Tap to open the form"}
                </p>
              </div>
              <span className="w-9 h-9 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shrink-0 group-hover:bg-neutral-900 group-hover:border-neutral-900 group-hover:text-white dark:group-hover:bg-white dark:group-hover:border-white dark:group-hover:text-neutral-900 transition-colors duration-200">
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-300 ${isFormOpen ? "rotate-180" : ""}`}
                />
              </span>
            </button>

            <div
              className={`grid transition-[grid-template-rows] duration-400 ease-in-out ${
                isFormOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="px-5 sm:px-6 pb-6">
                  <ContactForm />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
