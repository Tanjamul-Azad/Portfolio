"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { fadeInUp, staggerContainer } from "@/lib/animations";

interface HeroProps {
  showContent?: boolean;
}

export function Hero({ showContent = true }: HeroProps) {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const photoScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.02]);

  const { author } = siteConfig;

  if (!showContent) {
    return (
      <section
        ref={sectionRef}
        id="hero"
        className="relative min-h-screen bg-neutral-50 dark:bg-black"
      />
    );
  }

  return (
    <section ref={sectionRef} id="hero" className="relative bg-neutral-50 dark:bg-black">
      {/* Main Hero Section */}
      <div className="relative min-h-screen flex items-center py-20 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-amber-500/10 dark:bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-orange-400/10 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container px-6 mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Content */}
            <motion.div
              variants={staggerContainer}
              initial="hidden"
              animate="visible"
              className="order-2 lg:order-1"
            >
              <motion.span
                variants={fadeInUp}
                className="text-xs text-neutral-500 dark:text-neutral-500 tracking-[0.25em] uppercase block mb-4"
              >
                This is me.
              </motion.span>

              <motion.h1
                variants={fadeInUp}
                className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6 text-neutral-900 dark:text-white leading-[1.1] tracking-tight"
              >
                Hi, I&apos;m{" "}
                <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 dark:from-amber-300 dark:via-orange-400 dark:to-amber-300 animate-gradient">
                    {siteConfig.name}
                  </span>
                  <span className="absolute -bottom-1 left-0 w-full h-[2px] bg-gradient-to-r from-amber-500/0 via-amber-500 to-amber-500/0 dark:from-amber-400/0 dark:via-amber-400 dark:to-amber-400/0" />
                </span>
              </motion.h1>

              <motion.p
                variants={fadeInUp}
                className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-200 leading-relaxed mb-6 font-light"
              >
                Crafting digital experiences that blend
                <span className="text-amber-600 dark:text-amber-300 font-medium"> aesthetics</span> with
                <span className="text-amber-600 dark:text-amber-300 font-medium"> performance</span>.
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed mb-10 max-w-lg"
              >
                I build fast, accessible, and beautifully designed web applications 
                with modern technologies. Every pixel matters.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-14">
                <Button
                  size="lg"
                  className="rounded-full px-8 py-6 text-base bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:from-amber-300 hover:to-orange-400 transition-all duration-500 group font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30"
                >
                  Let&apos;s Talk
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full px-8 py-6 text-base border-neutral-300 dark:border-neutral-600 bg-white/50 dark:bg-neutral-900/50 text-neutral-800 dark:text-white hover:border-amber-500/50 hover:text-amber-600 dark:hover:text-amber-300 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all duration-500 font-medium"
                >
                  Resume
                  <Download className="ml-2 w-4 h-4" />
                </Button>
              </motion.div>

              {/* Stats */}
              <motion.div variants={fadeInUp} className="flex gap-10 md:gap-14">
                {[
                  { value: `${author.yearsOfExperience}+`, label: "Years" },
                  { value: `${author.projectsCompleted}+`, label: "Projects" },
                  { value: `${Math.floor(author.hoursWorked / 1000)}K+`, label: "Hours" },
                ].map((stat, i) => (
                  <div key={i} className="text-left group">
                    <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-neutral-800 to-neutral-500 dark:from-white dark:to-neutral-400 group-hover:from-amber-500 group-hover:to-amber-600 dark:group-hover:from-amber-200 dark:group-hover:to-amber-400 transition-all duration-500">
                      {stat.value}
                    </div>
                    <div className="text-xs md:text-sm text-neutral-400 dark:text-neutral-500 mt-2 uppercase tracking-widest font-medium">
                      {stat.label}
                    </div>
                  </div>
                ))}
              </motion.div>
            </motion.div>

            {/* Photo Section */}
            <motion.div
              className="order-1 lg:order-2"
              style={{ scale: photoScale }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative aspect-[4/5] max-w-md mx-auto lg:max-w-none">
                {/* Frame decorations */}
                <motion.div
                  className="absolute -top-4 -left-4 w-16 h-16 border-l-2 border-t-2 border-neutral-300 dark:border-white/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                />
                <motion.div
                  className="absolute -bottom-4 -right-4 w-16 h-16 border-r-2 border-b-2 border-neutral-300 dark:border-white/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                />

                {/* Photo container */}
                <div className="relative w-full h-full bg-neutral-200 dark:bg-neutral-900 rounded-lg overflow-hidden">
                  <Image
                    src="/images/profile.jpg"
                    alt={siteConfig.name}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -right-2 md:-right-4 top-1/4 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-amber-400/30 dark:border-amber-500/30 text-amber-600 dark:text-amber-300 px-4 py-2 rounded-full text-xs font-medium shadow-xl"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  {author.yearsOfExperience}+ Years Exp.
                </motion.div>

                <motion.div
                  className="absolute -left-2 md:-left-4 bottom-1/3 bg-gradient-to-r from-amber-500 to-orange-500 text-black px-4 py-2 rounded-full text-xs font-semibold shadow-xl shadow-amber-500/20"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                >
                  Available for Work
                </motion.div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          <motion.div
            className="flex flex-col items-center gap-2 text-neutral-400 dark:text-neutral-500"
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
          >
            <span className="text-xs tracking-[0.2em] uppercase">Scroll</span>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M12 5v14M5 12l7 7 7-7" />
            </svg>
          </motion.div>
        </motion.div>
      </div>

      {/* Quote Section */}
      <div className="relative py-24 border-t border-neutral-200 dark:border-neutral-800/50">
        <div className="container px-6 mx-auto">
          <motion.blockquote
            className="max-w-4xl mx-auto text-center"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <p className="text-xl md:text-2xl lg:text-3xl font-light text-neutral-600 dark:text-neutral-300 leading-relaxed italic">
              &ldquo;Great design is not just how it looks, but
              <span className="text-amber-600 dark:text-amber-300 font-normal not-italic"> how it works</span>.
              I craft interfaces that feel intuitive and perform flawlessly.&rdquo;
            </p>
          </motion.blockquote>
        </div>
      </div>
    </section>
  );
}
