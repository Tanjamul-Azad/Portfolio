"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { type ReactNode, useRef } from "react";
import { cn } from "@/lib/utils";

interface SectionWrapperProps {
  children: ReactNode;
  className?: string;
  fullHeight?: boolean;
  theme?: "light" | "dark" | "gradient";
  id?: string;
}

export function SectionWrapper({
  children,
  className,
  fullHeight = false,
  theme = "light",
  id,
}: SectionWrapperProps) {
  const ref = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });

  // Parallax effect for the section
  const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0.95, 1, 1, 0.95]);

  const themeClasses = {
    light: "bg-white dark:bg-black",
    dark: "bg-neutral-950 dark:bg-neutral-950",
    gradient: "bg-linear-to-b from-white via-neutral-50 to-white dark:from-black dark:via-neutral-950 dark:to-black",
  };

  return (
    <motion.section
      ref={ref}
      id={id}
      style={{ opacity, scale }}
      className={cn(
        "relative overflow-hidden",
        fullHeight ? "min-h-screen flex items-center" : "py-32",
        themeClasses[theme],
        // Add shadow between sections for separation
        "shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.05)] dark:shadow-[0_-20px_40px_-20px_rgba(0,0,0,0.3)]",
        className
      )}
    >
      {/* Grain texture overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.015] dark:opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzMDAiIGhlaWdodD0iMzAwIj48ZmlsdGVyIGlkPSJhIiB4PSIwIiB5PSIwIj48ZmVUdXJidWxlbmNlIGJhc2VGcmVxdWVuY3k9Ii43NSIgc3RpdGNoVGlsZXM9InN0aXRjaCIgdHlwZT0iZnJhY3RhbE5vaXNlIi8+PGZlQ29sb3JNYXRyaXggdHlwZT0ic2F0dXJhdGUiIHZhbHVlcz0iMCIvPjwvZmlsdGVyPjxwYXRoIGQ9Ik0wIDBoMzAwdjMwMEgweiIgZmlsdGVyPSJ1cmwoI2EpIiBvcGFjaXR5PSIuMDUiLz48L3N2Zz4=')]" />

      {children}
    </motion.section>
  );
}
