"use client";

import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SaveBar({ onSave, saving }: { onSave: () => void; saving: boolean }) {
  return (
    <div className="sticky bottom-0 z-10 mt-8 flex flex-col gap-3 border-t border-neutral-200 bg-neutral-50/90 py-3 backdrop-blur sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-950/90">
      <p className="text-xs text-neutral-500">
        Changes save to your project files. Refresh the site to preview, then{" "}
        <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">git push</code> to publish.
      </p>
      <Button onClick={onSave} disabled={saving} className="bg-amber-500 text-black hover:bg-amber-400">
        {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
        {saving ? "Saving…" : "Save changes"}
      </Button>
    </div>
  );
}
