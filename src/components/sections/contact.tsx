"use client";

import { motion } from "framer-motion";
import { Mail, Calendar, ArrowUpRight, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactForm } from "./contact-form";
import { siteConfig } from "@/config";

export function Contact() {
  return (
    <section id="contact" className="py-28 relative overflow-hidden bg-neutral-50 dark:bg-black">
      {/* Background */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-[600px] h-[600px] bg-amber-400/5 dark:bg-amber-500/3 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-orange-400/5 dark:bg-orange-500/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="container px-6 mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Column */}
          <div>
            <motion.span
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="text-xs text-amber-600 dark:text-amber-400/80 tracking-[0.3em] uppercase mb-4 block"
            >
              Contact
            </motion.span>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-6xl font-bold font-heading mb-6 tracking-tight text-neutral-900 dark:text-white leading-[1.1]"
            >
              Let&apos;s build<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500 dark:from-amber-200 dark:to-orange-300">
                something great.
              </span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-lg text-neutral-500 dark:text-neutral-400 mb-12 max-w-md leading-relaxed"
            >
              Have a project in mind? Let&apos;s discuss how we can work together 
              to bring your vision to life.
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
                className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 hover:border-amber-400/40 dark:hover:border-amber-500/30 hover:bg-white dark:hover:bg-neutral-900/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-400/10 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-400/20 dark:group-hover:bg-amber-500/20 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
                    Email
                  </div>
                  <div className="text-neutral-900 dark:text-white font-medium group-hover:text-amber-600 dark:group-hover:text-amber-200 transition-colors">
                    {siteConfig.contact.email}
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-neutral-400 dark:text-neutral-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
              </a>

              <a
                href={siteConfig.contact.calendly}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 rounded-2xl border border-neutral-200 dark:border-neutral-800/50 bg-white/50 dark:bg-neutral-900/30 hover:border-amber-400/40 dark:hover:border-amber-500/30 hover:bg-white dark:hover:bg-neutral-900/50 transition-all duration-300 group"
              >
                <div className="w-12 h-12 rounded-full bg-amber-400/10 dark:bg-amber-500/10 flex items-center justify-center text-amber-600 dark:text-amber-400 group-hover:bg-amber-400/20 dark:group-hover:bg-amber-500/20 transition-colors">
                  <Calendar className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <div className="text-xs text-neutral-400 dark:text-neutral-500 uppercase tracking-wider mb-1">
                    Schedule
                  </div>
                  <div className="text-neutral-900 dark:text-white font-medium group-hover:text-amber-600 dark:group-hover:text-amber-200 transition-colors">
                    Book a 30-min call
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-neutral-400 dark:text-neutral-600 group-hover:text-amber-500 dark:group-hover:text-amber-400 transition-colors" />
              </a>
              
              {/* Response time notice */}
              <div className="flex items-center gap-2 mt-6 p-3 rounded-xl bg-amber-50 dark:bg-amber-500/5 border border-amber-200/50 dark:border-amber-500/20">
                <Clock className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                <span className="text-sm text-amber-700 dark:text-amber-300">
                  Typically replies within 24–48 hours
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
            className="p-8 rounded-3xl bg-white/50 dark:bg-neutral-900/30 border border-neutral-200 dark:border-neutral-800/50 backdrop-blur-sm"
          >
            <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-6">Send a message</h3>
            <ContactForm />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
