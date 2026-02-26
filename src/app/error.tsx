"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, RefreshCw, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Application error:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-neutral-50 dark:bg-black flex items-center justify-center px-6">
      {/* Ambient blobs */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-red-100/30 dark:bg-red-900/10 blur-[140px] rounded-full" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-neutral-200/50 dark:bg-neutral-900/30 blur-[120px] rounded-full" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="relative text-center max-w-lg"
      >
        {/* Icon */}
        <div className="flex justify-center mb-8">
          <div className="w-16 h-16 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
            <AlertTriangle className="w-7 h-7 text-red-500" />
          </div>
        </div>

        <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Something went wrong
        </h1>

        <p className="text-neutral-600 dark:text-neutral-400 font-light leading-relaxed mb-2">
          An unexpected error occurred. This has been logged and we&apos;ll look
          into it.
        </p>

        {error.digest && (
          <p className="text-xs font-mono text-neutral-400 dark:text-neutral-600 mb-8">
            Error ID: {error.digest}
          </p>
        )}

        <div className="mt-8 flex flex-wrap gap-4 justify-center">
          <Button
            onClick={reset}
            size="lg"
            className="h-12 px-8 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 text-sm font-medium transition-all"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Try Again
          </Button>

          <Button
            asChild
            size="lg"
            variant="ghost"
            className="h-12 px-8 rounded-full text-sm font-medium hover:bg-neutral-100 dark:hover:bg-white/5 transition-all"
          >
            <Link href="/">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Link>
          </Button>
        </div>
      </motion.div>
    </main>
  );
}
