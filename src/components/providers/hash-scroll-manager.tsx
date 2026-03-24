"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { MOTION_TOKENS } from "@/lib";

function scrollToHash(hash: string, behavior: ScrollBehavior = "smooth") {
  const id = hash.replace(/^#/, "");
  if (!id) return;

  const target = document.getElementById(id);
  if (!target) return;

  const nav = document.querySelector("nav");
  const navHeight = nav instanceof HTMLElement ? nav.offsetHeight : 80;
  const top = target.getBoundingClientRect().top + window.scrollY - navHeight - 12;

  window.scrollTo({ top: Math.max(0, top), behavior });
}

export function HashScrollManager() {
  const pathname = usePathname();

  useEffect(() => {
    const handleHashChange = () => {
      if (!window.location.hash) return;
      scrollToHash(window.location.hash, "smooth");
    };

    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  useEffect(() => {
    if (!window.location.hash) return;

    const timeoutId = window.setTimeout(() => {
      scrollToHash(window.location.hash, "smooth");
    }, Math.round(MOTION_TOKENS.duration.medium * 1000) + 40);

    return () => window.clearTimeout(timeoutId);
  }, [pathname]);

  return null;
}
