"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { ANALYTICS_CONSENT_KEY, analyticsAllowed, measurementId, trackEvent } from "@/lib/telemetry";

type Choice = "granted" | "denied" | null;
const preferencesEvent = "portfolio:analytics-preferences";

function readChoice(): Choice {
  try {
    const value = localStorage.getItem(ANALYTICS_CONSENT_KEY);
    return value === "granted" || value === "denied" ? value : null;
  } catch { return "denied"; }
}

function cleanUrl(value: string) {
  try { const url = new URL(value); return url.origin + url.pathname; }
  catch { return ""; }
}

export function AnalyticsPreferencesButton() {
  if (!measurementId) return null;
  return <button type="button" onClick={() => window.dispatchEvent(new Event(preferencesEvent))}
    className="inline-flex min-h-11 items-center text-sm text-muted-foreground hover:text-foreground">Analytics preferences</button>;
}

export function Analytics() {
  const pathname = usePathname();
  const [choice, setChoice] = useState<Choice>(null);
  const [mounted, setMounted] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const lastPage = useRef("");
  const vitalsStarted = useRef(false);

  useEffect(() => {
    setChoice(readChoice());
    setMounted(true);
    const sync = () => setChoice(readChoice());
    const open = () => setPreferencesOpen(true);
    window.addEventListener("storage", sync);
    window.addEventListener(preferencesEvent, open);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener(preferencesEvent, open);
    };
  }, []);

  useEffect(() => {
    if (!measurementId || !mounted) return;
    const allowed = analyticsAllowed();
    (window as unknown as Record<string, unknown>)[`ga-disable-${measurementId}`] = !allowed;
    if (!allowed) {
      setReady(false);
      lastPage.current = "";
      window.gtag?.("consent", "update", { analytics_storage: "denied" });
      // Remove only analytics cookies, keeping login/preferences intact.
      if (choice === "denied") for (const cookie of document.cookie.split(";")) {
        const name = cookie.split("=")[0].trim();
        if (!/^(_ga($|_)|_gid$|_gat($|_))/.test(name)) continue;
        for (const domain of ["", `; Domain=${location.hostname}`, `; Domain=.${location.hostname}`]) {
          document.cookie = `${name}=; Max-Age=0; Path=/${domain}; SameSite=Lax`;
        }
      }
    }
  }, [choice, mounted, pathname]);

  useEffect(() => {
    if (!ready || !analyticsAllowed() || pathname.startsWith("/admin")) return;
    const page = location.origin + pathname;
    if (lastPage.current === page) return;
    window.gtag?.("event", "page_view", {
      send_to: measurementId, page_location: page, page_title: document.title,
      page_referrer: lastPage.current || cleanUrl(document.referrer),
    });
    lastPage.current = page;
  }, [pathname, ready, choice]);

  useEffect(() => {
    if (!ready || !analyticsAllowed()) return;
    const clicked = (event: MouseEvent) => {
      const anchor = event.target instanceof Element ? event.target.closest("a[href]") : null;
      if (!(anchor instanceof HTMLAnchorElement)) return;
      const href = anchor.getAttribute("href") || "";
      if (href.startsWith("mailto:")) return trackEvent("contact_click", { method: "email" });
      const url = new URL(anchor.href, location.href);
      if (url.hostname === "wa.me" || url.hostname === "api.whatsapp.com") return trackEvent("contact_click", { method: "whatsapp" });
      if (url.origin === location.origin && /\.pdf$/i.test(url.pathname)) return trackEvent("file_download", { file_name: "Tanzamul_Azad_CV.pdf", file_extension: "pdf" });
      if (url.origin === location.origin && url.hash === "#contact") return trackEvent("contact_click", { method: "form" });
      // Homepage project actions already carry more specific source information.
      if (anchor.closest("#projects")) return;
      const project = url.origin === location.origin && url.pathname.match(/^\/projects\/([^/]+)$/);
      if (project) return trackEvent("projects_open_case_study", { project_slug: project[1], source: pathname });
      const article = url.origin === location.origin && url.pathname.match(/^\/blog\/(?!all$)([^/]+)$/);
      if (article) return trackEvent("article_open", { article_slug: article[1], source: pathname });
      if (/^https?:$/.test(url.protocol) && url.origin !== location.origin) trackEvent("outbound_click", { link_domain: url.hostname, source: pathname });
    };
    document.addEventListener("click", clicked);
    return () => document.removeEventListener("click", clicked);
  }, [ready, pathname]);

  useEffect(() => {
    if (!ready || !analyticsAllowed() || vitalsStarted.current) return;
    let cancelled = false;
    void import("web-vitals").then(({ onCLS, onINP, onLCP }) => {
      if (cancelled) return;
      vitalsStarted.current = true;
      const report = (metric: { name: string; value: number; rating: string }) => trackEvent("web_vitals", {
        metric_name: metric.name, metric_rating: metric.rating,
        value: Math.round(metric.name === "CLS" ? metric.value * 1000 : metric.value),
      });
      onCLS(report); onINP(report); onLCP(report);
    }).catch(() => { /* Optional measurement must never break the page. */ });
    return () => { cancelled = true; };
  }, [ready]);

  if (!measurementId || !mounted || pathname.startsWith("/admin")) return null;

  const initialize = () => {
    if (!analyticsAllowed()) return;
    window.dataLayer ||= [];
    // eslint-disable-next-line prefer-rest-params -- Preserve Google's standard Arguments-based gtag queue.
    window.gtag ||= function () { window.dataLayer!.push(arguments); };
    window.gtag("consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" });
    if (!window.portfolioAnalyticsReady) {
      window.gtag("js", new Date());
      window.gtag("config", measurementId, {
        send_page_view: false, allow_google_signals: false, allow_ad_personalization_signals: false,
        page_location: cleanUrl(location.href), page_referrer: cleanUrl(document.referrer),
      });
      window.portfolioAnalyticsReady = true;
    }
    window.gtag("consent", "update", { analytics_storage: "granted" });
    setReady(true);
  };

  const choose = (value: "granted" | "denied") => {
    try { localStorage.setItem(ANALYTICS_CONSENT_KEY, value); } catch { return; }
    setChoice(value);
    setPreferencesOpen(false);
  };

  return <>
    {choice === "granted" && analyticsAllowed() && <Script id="portfolio-ga4" strategy="afterInteractive"
      src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`} onReady={initialize} />}
    {(choice === null || preferencesOpen) && <section aria-label="Analytics preferences"
      className="fixed bottom-4 left-4 z-50 max-w-sm rounded-xl border border-line bg-background p-4 shadow-xl max-sm:right-4">
      <p className="text-sm font-medium">Optional visitor analytics</p>
      <p className="mt-1 text-xs leading-relaxed text-muted-foreground">Help me understand which projects and articles are useful. Analytics starts only if you allow it. <Link href="/privacy" className="underline">Privacy details</Link></p>
      <div className="mt-3 flex gap-2">
        <button type="button" onClick={() => choose("granted")} className="min-h-11 rounded-lg bg-foreground px-4 text-xs font-medium text-background">Allow analytics</button>
        <button type="button" onClick={() => choose("denied")} className="min-h-11 rounded-lg border border-line px-4 text-xs">No thanks</button>
      </div>
    </section>}
  </>;
}
