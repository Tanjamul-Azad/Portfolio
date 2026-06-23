"use client";

import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { fetchContent, saveContent } from "./client";

export function useContent<T>(type: string) {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setLoading(true);
    fetchContent<T>(type)
      .then((d) => {
        if (!active) return;
        setData(d);
        setError(null);
      })
      .catch((e: unknown) => {
        if (active) setError(e instanceof Error ? e.message : "Failed to load");
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [type]);

  const save = useCallback(
    async (next?: T) => {
      const payload = next ?? data;
      if (payload == null) return;
      setSaving(true);
      try {
        await saveContent(type, payload);
        toast.success("Saved — refresh the site to preview, then commit & push to publish.");
      } catch (e) {
        toast.error(e instanceof Error ? e.message : "Save failed");
        throw e;
      } finally {
        setSaving(false);
      }
    },
    [data, type]
  );

  return { data, setData, loading, saving, error, save };
}
