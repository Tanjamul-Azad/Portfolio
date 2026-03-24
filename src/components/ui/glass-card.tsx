import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  blur?: "sm" | "md" | "lg" | "xl";
  tint?: "light" | "dark" | "amber" | "blue";
}

export function GlassCard({
  children,
  className,
  blur = "xl",
  tint = "light",
}: GlassCardProps) {
  const blurClasses = {
    sm: "backdrop-blur-sm",
    md: "backdrop-blur-md",
    lg: "backdrop-blur-lg",
    xl: "backdrop-blur-xl",
  };

  const tintClasses = {
    light:
      "bg-white/80 dark:bg-neutral-900/80 border-neutral-200/60 dark:border-neutral-700/60",
    dark: "bg-neutral-900/80 dark:bg-neutral-950/80 border-neutral-700/60 dark:border-neutral-800/60",
    amber:
      "bg-amber-500/10 dark:bg-amber-500/5 border-amber-500/30 dark:border-amber-500/20",
    blue: "bg-blue-500/10 dark:bg-blue-500/5 border-blue-500/30 dark:border-blue-500/20",
  };

  return (
    <div
      className={cn(
        "relative rounded-2xl border overflow-hidden",
        blurClasses[blur],
        tintClasses[tint],
        "shadow-lg shadow-neutral-900/5 dark:shadow-black/20",
        className
      )}
    >
      {/* Subtle light reflection on top edge */}
      <div className="absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-white/50 to-transparent dark:via-white/10" />

      {children}
    </div>
  );
}
