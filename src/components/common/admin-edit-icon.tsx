"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Pencil icon in the navbar that opens the editor, matching the theme toggle's
 * own size and shape.
 *
 * A client component that asks the server whether the editor is enabled,
 * rather than importing `isAdminEnabled()` directly. Navbar renders on every
 * route (the homepage, the blog list, project pages) through several different
 * client entry points with no shared server ancestor to hand a prop down from,
 * and that check reads server-only env vars through node:crypto — importing it
 * anywhere reachable from a client component breaks the client bundle, which is
 * exactly what happened building this feature the first time.
 */
export function AdminEditIcon() {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/status", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : { enabled: false }))
      .then((data) => {
        if (active) setEnabled(Boolean(data?.enabled));
      })
      .catch(() => {
        // Editor unreachable or unconfigured — stay hidden, same as disabled.
      });
    return () => {
      active = false;
    };
  }, []);

  if (!enabled) return null;

  return (
    <Button variant="ghost" size="icon" asChild className="rounded-full">
      <Link href="/admin" aria-label="Edit portfolio content" title="Edit portfolio">
        <Pencil className="h-4 w-4" />
      </Link>
    </Button>
  );
}
