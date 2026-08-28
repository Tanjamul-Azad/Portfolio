import Link from "next/link";
import { Pencil } from "lucide-react";
import { isAdminEnabled } from "@/lib/admin/auth";

/**
 * Entry point to the editor.
 *
 * A server component on purpose: `isAdminEnabled()` reads server-only
 * environment variables, so when the editor is off this renders nothing at all
 * and no marker reaches the browser. The routes themselves 404 in that state
 * regardless — this only decides whether the door is visible, never whether it
 * is locked.
 */
export function EditPortfolioLink() {
  if (!isAdminEnabled()) return null;

  return (
    <Link
      href="/admin"
      aria-label="Edit portfolio content"
      className="fixed bottom-[max(1rem,env(safe-area-inset-bottom))] left-[max(1rem,env(safe-area-inset-left))] z-40 inline-flex h-11 items-center gap-2 rounded-full border border-neutral-200/80 bg-white/90 px-4 text-sm font-medium text-neutral-700 shadow-lg backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:text-accent hover:shadow-xl dark:border-neutral-800/80 dark:bg-neutral-900/90 dark:text-neutral-200"
    >
      <Pencil className="h-4 w-4" />
      <span className="hidden sm:inline">Edit portfolio</span>
    </Link>
  );
}
