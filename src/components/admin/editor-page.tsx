"use client";

import type { ReactNode } from "react";
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
          <SaveBar onSave={onSave} saving={saving} />
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
