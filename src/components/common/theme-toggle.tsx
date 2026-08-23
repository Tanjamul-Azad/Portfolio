"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  // `resolvedTheme` is the theme actually being displayed. `theme` can be
  // "system", which made the icon show the wrong glyph and made the first click
  // a no-op (it set "dark" while the system was already dark).
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Theme is only known on the client, so render a same-sized placeholder on the
  // server pass to keep the navbar from shifting when the real button appears.
  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = resolvedTheme === "dark";

  if (!mounted) {
    return (
      <Button
        variant="ghost"
        size="icon"
        aria-hidden="true"
        tabIndex={-1}
        className="h-11 w-11 rounded-full sm:h-9 sm:w-9"
      >
        <span className="w-5 h-5" />
      </Button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      title={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className="group h-11 w-11 sm:h-9 sm:w-9 rounded-full bg-neutral-100 dark:bg-neutral-800 hover:bg-neutral-200 dark:hover:bg-neutral-700 hover:scale-110 active:scale-95 transition-all duration-300"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-amber-400 group-hover:rotate-180 transition-transform duration-500" />
      ) : (
        <Moon className="w-5 h-5 text-neutral-700 group-hover:-rotate-12 transition-transform duration-300" />
      )}
    </Button>
  );
}
