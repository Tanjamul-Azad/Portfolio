"use client";

import { track } from "@vercel/analytics";

type EventPayload = Record<string, string | number | boolean | null | undefined>;

export function trackEvent(name: string, payload?: EventPayload) {
  try {
    track(name, payload);
  } catch {
    // Telemetry failures should never affect UX.
  }
}
