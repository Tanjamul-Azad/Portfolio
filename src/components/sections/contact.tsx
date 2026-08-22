"use client";

import { motion } from "framer-motion";
import { Mail, MessageCircle, ArrowUpRight, Clock, Sparkles } from "lucide-react";
import { ContactForm } from "./contact-form";
import { siteConfig } from "@/config";
import { sectionsContent } from "@/data/site-content";
import { NetworkPattern } from "@/components/ui/network-pattern";

export function Contact() {
  return (
    <section id="contact" className="scroll-section py-20 md:py-32 relative overflow-hidden md:min-h-screen flex items-center">
      {/* Network connection pattern */}
      <NetworkPattern
        className="opacity-50 dark:opacity-30"
        numNodes={20}
        connectionDistance={180}
        animationSpeed={0.4}
        lineOpacity={0.25}
        nodeOpacity={0.7}
      />
      {/* Background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-150 h-150 bg-amber-400/5 dark:bg-amber-500/3 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-100 h-100 bg-orange-400/5 dark:bg-orange-500/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-4 sm:px-6 mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Left Column */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs text-accent tracking-[0.3em] uppercase mb-4 block"
            >
              {sectionsContent.contact.eyebrow}
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl sm:text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight text-neutral-900 dark:text-white leading-[1.1]"
            >
              {sectionsContent.contact.headingLine1}<br />
              <span className="text-accent">
                {sectionsContent.contact.headingLine2}
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-base sm:text-lg text-neutral-500 dark:text-neutral-400 mb-8 sm:mb-12 max-w-md leading-relaxed"
            >
              {sectionsContent.contact.subtext}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6"
            >
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/70 bg-white/85 dark:bg-neutral-900/70 backdrop-blur-sm transition-all duration-300 ease-out hover:border-amber-400/60 dark:hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 active:translate-y-0 overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-amber-500/75 to-transparent opacity-70 group-hover:opacity-100" />
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
                    Email
                  </div>
                  <div className="text-neutral-900 dark:text-white font-medium group-hover:text-accent transition-colors">
                    {siteConfig.contact.email}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-neutral-300 dark:text-neutral-600 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </a>

              <a
                href={`https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative flex items-center gap-4 p-4 sm:p-5 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/70 bg-white/85 dark:bg-neutral-900/70 backdrop-blur-sm transition-all duration-300 ease-out hover:border-amber-400/60 dark:hover:border-amber-500/40 hover:shadow-xl hover:shadow-amber-500/10 hover:-translate-y-1 active:translate-y-0 overflow-hidden"
              >
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-amber-500/75 to-transparent opacity-70 group-hover:opacity-100" />
                <div className="w-12 h-12 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-accent group-hover:scale-110 transition-transform duration-300">
                  <MessageCircle className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
                    WhatsApp
                  </div>
                  <div className="text-neutral-900 dark:text-white font-medium group-hover:text-accent transition-colors">
                    Chat with me directly
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-neutral-300 dark:text-neutral-600 group-hover:text-accent group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
              </a>

              <div className="group relative flex items-center gap-3 p-4 rounded-2xl border border-neutral-200/80 dark:border-neutral-800/70 bg-white/85 dark:bg-neutral-900/70 backdrop-blur-sm overflow-hidden">
                <div className="absolute top-0 inset-x-0 h-px bg-linear-to-r from-transparent via-amber-500/75 to-transparent opacity-70" />
                <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-accent">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-sm font-medium text-neutral-900 dark:text-white">Need a quick overview?</div>
                  <div className="text-xs text-neutral-500 dark:text-neutral-400">Ask the AI assistant in the bottom-right corner.</div>
                </div>
              </div>

              {/* Response time notice */}
              <div className="flex items-center gap-2 mt-6 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20">
                <Clock className="w-4 h-4 text-accent shrink-0" />
                <span className="text-sm text-accent">
                  {sectionsContent.contact.responseTime}
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
            className="p-4 sm:p-6 md:p-8 rounded-2xl sm:rounded-3xl bg-white/50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Send a message</h3>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
