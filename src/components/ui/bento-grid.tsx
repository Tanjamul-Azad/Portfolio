import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BentoGridProps {
  children: ReactNode;
  className?: string;
}

interface BentoCardProps {
  children: ReactNode;
  className?: string;
  span?: "1" | "2" | "3" | "4" | "full";
  rowSpan?: "1" | "2" | "3";
  hoverable?: boolean;
}

export function BentoGrid({ children, className }: BentoGridProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 auto-rows-fr",
        className
      )}
    >
      {children}
    </div>
  );
}

export function BentoCard({
  children,
  className,
  span = "1",
  rowSpan = "1",
  hoverable = true,
}: BentoCardProps) {
  const spanClasses = {
    "1": "md:col-span-1",
    "2": "md:col-span-2",
    "3": "md:col-span-3",
    "4": "md:col-span-4",
    full: "md:col-span-full",
  };

  const rowSpanClasses = {
    "1": "md:row-span-1",
    "2": "md:row-span-2",
    "3": "md:row-span-3",
  };

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-3xl border border-neutral-200/50 dark:border-neutral-800/50",
        "bg-linear-to-br from-white via-neutral-50 to-neutral-100",
        "dark:from-neutral-900 dark:via-neutral-900/90 dark:to-neutral-950",
        "p-6 md:p-8",
        spanClasses[span],
        rowSpanClasses[rowSpan],
        hoverable &&
          "transition-all duration-500 hover:shadow-2xl hover:shadow-neutral-900/10 dark:hover:shadow-black/30 hover:scale-[1.02] hover:-translate-y-1",
        className
      )}
    >
      {/* Glassmorphism overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-white/40 via-transparent to-transparent dark:from-white/5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10">{children}</div>

      {/* Decorative gradient blur */}
      <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-linear-to-br from-amber-400/20 to-orange-500/20 dark:from-amber-500/10 dark:to-orange-500/10 rounded-full blur-3xl pointer-events-none" />
    </div>
  );
}
