"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { ArrowRight, Download, Github, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config";
import { fadeInUp, staggerContainer } from "@/lib/animations";
import { getFeaturedProjects } from "@/data";
import { Scene3D, Magnetic } from "@/components/effects";

// Roles to cycle through (with proper articles)
const roles = [
  { article: "an", role: "AI/ML Enthusiast..." },
  { article: "a", role: "Full Stack Developer..." },
  { article: "a", role: "UI/UX Designer..." },
  { article: "a", role: "Tech Explorer" },
];

interface HeroProps {
  showContent?: boolean;
}

export function Hero({ showContent = true }: HeroProps) {
  const sectionRef = useRef(null);
  const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

  // Cycle through roles
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentRoleIndex((prev) => (prev + 1) % roles.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const photoScale = useTransform(scrollYProgress, [0, 0.3], [1, 1.02]);

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
        <Scene3D />
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,0,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.03)_1px,transparent_1px)] dark:bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:60px_60px] pointer-events-none" />
        <div className="absolute top-1/4 left-0 w-[600px] h-[600px] bg-amber-500/5 dark:bg-blue-600/5 blur-[150px] rounded-full pointer-events-none" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-orange-400/5 dark:bg-purple-600/5 blur-[120px] rounded-full pointer-events-none" />

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
                <span className="text-neutral-500 dark:text-neutral-400">I&apos;m {roles[currentRoleIndex].article} </span>
                <span className="relative inline-block min-w-[280px] md:min-w-[320px]">
                  <AnimatePresence mode="wait">
                    <motion.span
                      key={currentRoleIndex}
                      initial={{ opacity: 0, y: 20, filter: "blur(8px)" }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                      exit={{ opacity: 0, y: -20, filter: "blur(8px)" }}
                      transition={{ duration: 0.5, ease: "easeOut" }}
                      className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 dark:from-amber-300 dark:via-orange-400 dark:to-amber-300 font-medium"
                    >
                      {roles[currentRoleIndex].role}
                    </motion.span>
                  </AnimatePresence>
                  <motion.span
                    className="inline-block w-[3px] h-6 md:h-7 bg-amber-500 dark:bg-amber-400 ml-1 align-middle"
                    animate={{ opacity: [1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
                  />
                </span>
              </motion.p>

              <motion.p
                variants={fadeInUp}
                className="text-base md:text-lg text-neutral-500 dark:text-neutral-400 leading-relaxed mb-10 max-w-lg"
              >
                Building intelligent systems and elegant web solutions with clarity and purpose.
              </motion.p>

              {/* CTAs */}
              <motion.div variants={fadeInUp} className="flex flex-wrap gap-4 mb-14">
                <Button
                  asChild
                  size="lg"
                  className="btn-primary-cta group rounded-full px-7 sm:px-9 py-5 sm:py-6 text-base text-black font-semibold"
                >
                  <Link href="#contact">
                    <span className="relative z-10 flex items-center">
                      Let&apos;s Talk
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </span>
                  </Link>
                </Button>
                <Button
                  asChild
                  size="lg"
                  variant="outline"
                  className="btn-secondary-cta group rounded-full px-7 sm:px-9 py-5 sm:py-6 text-base border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900 text-neutral-800 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 font-medium"
                >
                  <a href="/resume.pdf" download>
                    <Download className="mr-2 w-4 h-4 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-200" />
                    Download Resume
                  </a>
                </Button>
              </motion.div>
            </motion.div>

            {/* Photo Section */}
            <motion.div
              className="order-1 lg:order-2 flex justify-center lg:justify-end"
              style={{ scale: photoScale }}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <div className="relative aspect-[4/5] w-[280px] sm:w-[320px] md:w-[360px] lg:w-[400px] xl:w-full xl:max-w-[450px]">
                {/* Frame decorations */}
                <motion.div
                  className="absolute -top-3 -left-3 md:-top-4 md:-left-4 w-12 h-12 md:w-16 md:h-16 border-l-2 border-t-2 border-neutral-300 dark:border-white/20"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 }}
                />
                <motion.div
                  className="absolute -bottom-3 -right-3 md:-bottom-4 md:-right-4 w-12 h-12 md:w-16 md:h-16 border-r-2 border-b-2 border-neutral-300 dark:border-white/20"
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
                    sizes="(max-width: 640px) 280px, (max-width: 768px) 320px, (max-width: 1024px) 360px, 450px"
                    className="object-cover"
                    placeholder="blur"
                    blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFgABAQEAAAAAAAAAAAAAAAAAAAUH/8QAIBAAAgIBBAMBAAAAAAAAAAAAAQIDBAAFBhESITFBUf/EABUBAQEAAAAAAAAAAAAAAAAAAAAB/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AztNR1C1bhjhuTpGsgVVWRgAM+AMZwxGP/9k="
                    priority
                  />
                  {/* Gradient overlay on edges */}
                  <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-neutral-50/40 dark:from-black/40 to-transparent" />
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-neutral-50/40 dark:from-black/40 to-transparent" />
                    <div className="absolute inset-y-0 left-0 w-12 bg-gradient-to-r from-neutral-50/30 dark:from-black/30 to-transparent" />
                    <div className="absolute inset-y-0 right-0 w-12 bg-gradient-to-l from-neutral-50/30 dark:from-black/30 to-transparent" />
                  </div>
                </div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -right-2 md:-right-4 top-1/4 bg-white/80 dark:bg-black/80 backdrop-blur-sm border border-amber-400/30 dark:border-amber-500/30 text-amber-600 dark:text-amber-300 px-4 py-2 rounded-full text-xs font-medium shadow-xl"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  Open to Opportunities
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
