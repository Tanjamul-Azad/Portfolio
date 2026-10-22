"use client";

import settings from "@/content/analytics.json";

type EventPayload = Record<string, string | number | boolean | null | undefined>;

export const ANALYTICS_CONSENT_KEY = "portfolio_analytics_consent_v1";
export const measurementId = /^G-[A-Z0-9]{6,20}$/.test(settings.measurementId) ? settings.measurementId : "";

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    portfolioAnalyticsReady?: boolean;
  }
}

export function analyticsAllowed() {
  if (typeof window === "undefined" || !measurementId || window.location.pathname.startsWith("/admin")) return false;
  try {
    return localStorage.getItem(ANALYTICS_CONSENT_KEY) === "granted"
      && navigator.doNotTrack !== "1"
      && !(navigator as Navigator & { globalPrivacyControl?: boolean }).globalPrivacyControl;
  } catch { return false; }
}

const parameterKeys = new Set([
  "project_slug", "article_slug", "source", "method", "link_domain",
  "file_name", "file_extension", "metric_name", "metric_rating", "value",
]);

export function trackEvent(name: string, payload?: EventPayload) {
  if (!analyticsAllowed() || !window.portfolioAnalyticsReady || !/^[a-z][a-z0-9_]{0,39}$/.test(name)) return;
  try {
    const parameters = Object.fromEntries(Object.entries(payload || {}).filter(([key, value]) => parameterKeys.has(key) && value != null));
    window.gtag?.("event", name, {
      ...parameters, send_to: measurementId,
      page_location: window.location.origin + window.location.pathname,
    });
  } catch {
    // Telemetry failures should never affect UX.
  }
}
