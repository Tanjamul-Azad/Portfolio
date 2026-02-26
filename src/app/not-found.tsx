"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center px-6">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-amber-100/40 dark:bg-amber-900/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-neutral-200/50 dark:bg-neutral-900/30 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center max-w-lg"
      >
        {/* Label */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <Sparkles className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-medium tracking-[0.25em] uppercase text-neutral-500 dark:text-neutral-400">
            Page Not Found
          </span>
        </div>

        {/* 404 */}
        <h1 className="text-[clamp(6rem,20vw,14rem)] font-bold leading-none tracking-tighter text-neutral-900 dark:text-white select-none">
          <span className="text-transparent bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text">
            404
          </span>
        </h1>

        <p className="mt-4 text-lg text-neutral-600 dark:text-neutral-400 font-light leading-relaxed">
          Looks like this page took a different path. Let&apos;s get you back to
          something that actually exists.
        </p>

        <div className="mt-10 flex flex-wrap gap-4 justify-center">
          <Button
            asChild
            size="lg"
            className="h-12 px-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-medium transition-all"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 px-8 rounded-full text-sm font-medium hover:bg-neutral-100 dark:hover:bg-white/5 transition-all"
          >
            <Link href="/#contact">Get in Touch</Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
