"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Sparkles, X } from "lucide-react";
import { siteConfig } from "@/config";
import { cn } from "@/lib/utils";

const loadPanel = () => import("./ai-chat-panel");

// The conversation UI (markdown rendering, streaming, the lot) is only fetched
// when someone is about to use it. Before, the whole assistant was mounted a
// couple of seconds after load — a ~280ms render that landed in the middle of
// a phone's first scroll.
const Panel = dynamic(loadPanel, {
  ssr: false,
  loading: () => (
    <div
      aria-hidden="true"
      className="fixed inset-x-0 bottom-0 z-60 h-[88dvh] animate-pulse rounded-t-[1.75rem] border border-line bg-background sm:inset-x-auto sm:bottom-24 sm:right-4 sm:h-[min(40rem,calc(100dvh-8rem))] sm:w-[25rem] sm:rounded-3xl"
    />
  ),
});

/**
 * The floating "Ask AI" button. Plain markup and CSS only, so it costs nothing
 * on page load; the panel's code is prefetched once the page is idle, or the
 * moment a pointer or finger approaches the button.
 */
export function AiChatLauncher() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const pathname = usePathname();
  const onAdmin = pathname?.startsWith("/admin") ?? false;

  useEffect(() => {
    if (onAdmin) return;
    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    const id = window.setTimeout(() => {
      if (w.requestIdleCallback) w.requestIdleCallback(() => void loadPanel(), { timeout: 4000 });
      else void loadPanel();
    }, 6000);
    return () => window.clearTimeout(id);
  }, [onAdmin]);

  const close = useCallback(() => {
    setOpen(false);
    buttonRef.current?.focus();
  }, []);

  if (onAdmin) return null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        onPointerEnter={() => void loadPanel()}
        onTouchStart={() => void loadPanel()}
        onFocus={() => void loadPanel()}
        aria-expanded={open}
        aria-haspopup="dialog"
        aria-label={open ? "Close AI assistant" : "Ask AI about my work"}
        className={cn(
          "group fixed bottom-[max(1rem,env(safe-area-inset-bottom))] right-[max(1rem,env(safe-area-inset-right))] z-50 flex h-13 items-center gap-2.5 rounded-full border border-line bg-background/85 p-1 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.35)] backdrop-blur-xl transition-[transform,opacity] duration-300 animate-in fade-in slide-in-from-bottom-2 fill-mode-both [animation-delay:800ms] hover:-translate-y-0.5 sm:pr-4",
          // On a phone the sheet covers the bottom of the screen; the button steps aside.
          open && "max-sm:pointer-events-none max-sm:opacity-0"
        )}
      >
        <span className="relative h-11 w-11 shrink-0">
          <span className="block h-full w-full overflow-hidden rounded-full ring-1 ring-line">
            <Image
              src={siteConfig.author.avatar || "/images/profile.jpg"}
              alt=""
              fill
              sizes="44px"
              className="rounded-full object-cover"
            />
          </span>
          <span className="absolute -right-0.5 -top-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-foreground text-background ring-2 ring-background">
            {open ? <X className="h-3 w-3" /> : <Sparkles className="h-3 w-3" />}
          </span>
        </span>
        <span className="hidden text-sm font-semibold text-foreground sm:block">
          {open ? "Close" : "Ask AI about me"}
        </span>
      </button>

      {open && <Panel onClose={close} />}
    </>
  );
}
