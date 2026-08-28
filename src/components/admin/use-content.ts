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
        const result = await saveContent(type, payload);
        if (result?.pendingDeploy) {
          toast.success("Committed to GitHub — the site rebuilds and goes live in about a minute.");
        } else {
          toast.success("Saved to your local files. Refresh to preview, then push to publish.");
        }
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
