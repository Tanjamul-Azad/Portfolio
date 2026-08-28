"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { SaveBar } from "./save-bar";

export function EditorPage({
  title,
  description,
  loading,
  error,
  saving,
  onSave,
  children,
}: {
  title: string;
  description?: string;
  loading: boolean;
  error: string | null;
  saving: boolean;
  onSave: () => void;
  children: ReactNode;
}) {
  // Determines whether the hint under Save should say "GitHub" or "local
  // files" — previously this was never wired up at all, so it always claimed
  // local files even when running against the deployed, GitHub-backed editor.
  const [storage, setStorage] = useState<"local" | "github">("local");
  useEffect(() => {
    let active = true;
    fetch("/api/admin/status", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (active && data?.storage === "github") setStorage("github");
      })
      .catch(() => {
        // Stay on the "local" assumption — worst case the hint undersells what
        // actually happens, rather than overselling.
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <header className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">{title}</h1>
        {description && <p className="mt-1 text-sm text-neutral-500">{description}</p>}
      </header>

      {loading ? (
        <div className="flex items-center gap-2 py-16 text-neutral-500">
          <Loader2 className="size-4 animate-spin" /> Loading…
        </div>
      ) : error ? (
        <div className="flex items-start gap-2 rounded-lg border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300">
          <AlertCircle className="mt-0.5 size-4 shrink-0" />
          <span>{error}</span>
        </div>
      ) : (
        <>
          <div className="space-y-6">{children}</div>
          <SaveBar onSave={onSave} saving={saving} deployed={storage === "github"} />
        </>
      )}
    </div>
  );
}

export function FormSection({ title }: { title: string }) {
  return (
    <h2 className="border-t border-neutral-200 pt-5 text-sm font-semibold text-neutral-900 dark:border-neutral-800 dark:text-white">
      {title}
    </h2>
  );
}
