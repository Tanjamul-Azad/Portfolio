"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";

// The assistant is ~470 lines plus its own animation tree, and nobody uses it
// in the first seconds of a visit. Splitting it out and mounting it once the
// page is idle keeps it off the critical path for first paint.
const AiChat = dynamic(() => import("./ai-chat").then((m) => m.AiChat), { ssr: false });

export function LazyAiChat() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const w = window as Window & {
      requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number;
      cancelIdleCallback?: (id: number) => void;
    };
    if (w.requestIdleCallback) {
      const id = w.requestIdleCallback(() => setReady(true), { timeout: 3000 });
      return () => w.cancelIdleCallback?.(id);
    }
    const id = window.setTimeout(() => setReady(true), 1500);
    return () => window.clearTimeout(id);
  }, []);

  return ready ? <AiChat /> : null;
}
