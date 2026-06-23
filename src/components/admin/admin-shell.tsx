"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ExternalLink, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { adminLogout } from "./client";

const NAV: { group: string; items: { href: string; label: string }[] }[] = [
  {
    group: "Site",
    items: [
      { href: "/admin", label: "Dashboard" },
      { href: "/admin/site", label: "Site & SEO" },
      { href: "/admin/hero", label: "Hero" },
      { href: "/admin/about", label: "About / Bio" },
      { href: "/admin/now", label: "Now & Sections" },
    ],
  },
  {
    group: "Content",
    items: [
      { href: "/admin/projects", label: "Projects" },
      { href: "/admin/blog", label: "Blog" },
      { href: "/admin/achievements", label: "Certificates & Awards" },
      { href: "/admin/experiences", label: "Experience" },
      { href: "/admin/tech-stack", label: "Tech Stack" },
      { href: "/admin/testimonials", label: "Testimonials" },
    ],
  },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const onLogout = async () => {
    await adminLogout();
    router.replace("/admin/login");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900 dark:bg-neutral-950 dark:text-neutral-100 md:flex">
      <aside className="border-b border-neutral-200 md:h-screen md:w-60 md:shrink-0 md:overflow-y-auto md:border-b-0 md:border-r dark:border-neutral-800 md:sticky md:top-0">
        <div className="flex items-center justify-between p-4">
          <Link href="/admin" className="text-sm font-bold tracking-tight">
            Portfolio <span className="text-amber-500">Studio</span>
          </Link>
        </div>

        <nav className="flex gap-1 overflow-x-auto px-2 pb-2 md:flex-col md:gap-0 md:overflow-visible md:pb-4">
          {NAV.map((section) => (
            <div key={section.group} className="md:mt-4 md:first:mt-0">
              <p className="hidden px-3 pb-1 text-[10px] font-semibold uppercase tracking-wider text-neutral-400 md:block">
                {section.group}
              </p>
              <div className="flex gap-1 md:flex-col">
                {section.items.map((item) => {
                  const active =
                    item.href === "/admin"
                      ? pathname === "/admin"
                      : pathname.startsWith(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "whitespace-nowrap rounded-md px-3 py-2 text-sm transition-colors",
                        active
                          ? "bg-amber-500/15 font-medium text-amber-600 dark:text-amber-400"
                          : "text-neutral-600 hover:bg-neutral-200/60 dark:text-neutral-400 dark:hover:bg-neutral-800/60"
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="flex gap-2 p-3 md:mt-auto md:flex-col">
          <Button asChild variant="outline" size="sm" className="flex-1">
            <a href="/" target="_blank" rel="noopener noreferrer">
              <ExternalLink className="size-3.5" />
              View site
            </a>
          </Button>
          <Button variant="ghost" size="sm" className="flex-1" onClick={onLogout}>
            <LogOut className="size-3.5" />
            Log out
          </Button>
        </div>
      </aside>

      <main className="flex-1 p-4 sm:p-6 md:p-10">{children}</main>
    </div>
  );
}
