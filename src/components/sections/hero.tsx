"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Download, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { fadeInUp, staggerContainer } from "@/lib/animations";

export function Hero() {
  const sectionRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 100]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.95]);

  return (
    <section
      ref={sectionRef}
      id="hero"
      className="relative min-h-[95vh] flex items-center justify-center overflow-hidden bg-white dark:bg-black"
    >
      {/* Refined Background Pulse */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-neutral-200/50 dark:bg-neutral-900/30 blur-[120px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-100/40 dark:bg-neutral-900/20 blur-[100px] rounded-full mix-blend-multiply dark:mix-blend-screen" />
      </div>

      <div className="container px-6 relative z-10 pt-20">
        <div className="grid lg:grid-cols-[1.5fr_1fr] gap-12 lg:gap-20 items-center">

          {/* Text Content - Editorial Style */}
          <motion.div
            style={{ opacity, y }}
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="order-2 lg:order-1 max-w-3xl"
          >
            <motion.div
              variants={fadeInUp}
              className="flex items-center gap-3 mb-8"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/20 text-amber-600 dark:text-amber-500">
                <Sparkles className="w-4 h-4" />
              </span>
              <span className="text-sm font-medium tracking-wide uppercase text-neutral-500 dark:text-neutral-400">
                Available for new projects
              </span>
            </motion.div>

            <motion.h1
              variants={fadeInUp}
              className="display-heading text-6xl md:text-7xl lg:text-8xl mb-8 text-neutral-900 dark:text-white"
            >
              Crafting digital <br />
              <span className="text-neutral-400 dark:text-neutral-600">experiences</span> that matter.
            </motion.h1>

            <motion.p
              variants={fadeInUp}
              className="text-xl md:text-2xl text-neutral-600 dark:text-neutral-400 leading-relaxed mb-10 max-w-2xl font-light"
            >
              I help brands and founders turn complex ideas into <span className="text-foreground font-medium">elegant</span>, scalable software solutions. Focus on clarity, performance, and impact.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-wrap gap-5">
              <Button
                asChild
                size="lg"
                className="h-14 px-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 text-base font-medium transition-all hover-lift"
              >
                <Link href="#projects">
                  View Selected Work
                </Link>
              </Button>

              <Button
                asChild
                variant="ghost"
                size="lg"
                className="h-14 px-8 rounded-full text-base font-medium hover:bg-neutral-100 dark:hover:bg-white/5 transition-all"
              >
                <Link href="#contact" className="flex items-center group">
                  Contact Me
                  <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="h-14 px-8 rounded-full text-base font-medium border-neutral-300 dark:border-neutral-700 hover:border-amber-500/50 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-all"
              >
                <a href="/resume.pdf" download className="flex items-center gap-2">
                  <Download className="w-4 h-4" />
                  Resume
                </a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Visual/Image - Minimalist Frame */}
          <motion.div
            style={{ scale }}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="order-1 lg:order-2 relative hidden lg:block"
          >
            <div className="relative aspect-[3/4] w-full max-w-md mx-auto grayscale hover:grayscale-0 transition-all duration-700 ease-out">
              <div className="absolute inset-0 border border-neutral-200 dark:border-neutral-800 rounded-sm translate-x-4 translate-y-4" />
              <div className="relative h-full w-full overflow-hidden rounded-sm bg-neutral-100 dark:bg-neutral-900">
                <Image
                  src="/images/profile.jpg"
                  alt={siteConfig.name}
                  fill
                  className="object-cover"
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                />

                {/* Subtle inner shadow overlay */}
                <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_0_100px_rgba(0,0,0,0.5)]" />
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
