"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_THEME, THEME_STORAGE_KEY } from "@/lib/theme-script";

type Theme = "light" | "dark" | "system";
type Resolved = "light" | "dark";

interface ThemeContextValue {
  theme: Theme;
  resolvedTheme: Resolved;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: DEFAULT_THEME,
  resolvedTheme: DEFAULT_THEME,
  setTheme: () => {},
});

const MEDIA = "(prefers-color-scheme: dark)";

/**
 * Puts the resolved theme on <html>, and does nothing at all when it is
 * already there. Only a real change touches the root: altering its class or
 * inline style restyles every element on the page.
 */
function applyTheme(resolved: Resolved, withoutTransitions: boolean) {
  const root = document.documentElement;
  const other: Resolved = resolved === "dark" ? "light" : "dark";
  if (root.classList.contains(resolved) && !root.classList.contains(other)) return;

  // Freeze transitions for the one frame of the swap, so every colour flips at
  // once instead of each element fading at its own speed.
  let freeze: HTMLStyleElement | null = null;
  if (withoutTransitions) {
    freeze = document.createElement("style");
    freeze.textContent = "*,*::before,*::after{transition:none!important}";
    document.head.appendChild(freeze);
  }

  root.classList.remove(other);
  root.classList.add(resolved);
  root.style.colorScheme = resolved;

  if (freeze) {
    window.getComputedStyle(document.body);
    const node = freeze;
    window.setTimeout(() => node.remove(), 1);
  }
}

/**
 * Light/dark theme without work on page load.
 *
 * Replaces next-themes, which re-applied the theme on mount even when nothing
 * had changed — removing and re-adding the class on <html>, rewriting
 * color-scheme and injecting a global stylesheet. Each of those restyles the
 * whole page; together they cost two ~250ms main-thread blocks on a mid-range
 * phone, landing right after hydration, which is exactly when a visitor
 * starts to scroll. Here mount only reads state; <html> is written on toggle.
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  // Same first render on server and client; corrected from the DOM on mount.
  const [theme, setThemeState] = useState<Theme>(DEFAULT_THEME);
  const [systemDark, setSystemDark] = useState(true);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let stored: Theme | null = null;
    try {
      stored = localStorage.getItem(THEME_STORAGE_KEY) as Theme | null;
    } catch {
      // Storage blocked (private mode, policy): fall back to the default.
    }
    const media = window.matchMedia(MEDIA);
    setThemeState(stored === "light" || stored === "dark" || stored === "system" ? stored : DEFAULT_THEME);
    setSystemDark(media.matches);
    setReady(true);

    const onChange = (event: MediaQueryListEvent) => setSystemDark(event.matches);
    media.addEventListener("change", onChange);
    return () => media.removeEventListener("change", onChange);
  }, []);

  const resolvedTheme: Resolved = theme === "system" ? (systemDark ? "dark" : "light") : theme;

  // Follows the OS when the visitor chose "system". A no-op on load, because
  // the head script already applied the same value.
  useEffect(() => {
    if (ready) applyTheme(resolvedTheme, true);
  }, [ready, resolvedTheme]);

  const setTheme = useCallback((next: Theme) => {
    setThemeState(next);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, next);
    } catch {
      // Not persisted, but still applied for this visit.
    }
  }, []);

  const value = useMemo(() => ({ theme, resolvedTheme, setTheme }), [theme, resolvedTheme, setTheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export const useTheme = () => useContext(ThemeContext);
