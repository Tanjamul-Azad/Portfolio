import Link from "next/link";
import {
  Award,
  Briefcase,
  FileText,
  FolderKanban,
  Globe,
  Layers,
  MessageSquareQuote,
  Sparkles,
  User,
  Zap,
} from "lucide-react";

const CARDS = [
  { href: "/admin/site", title: "Site & SEO", desc: "Name, title, social links, contact, OG image", icon: Globe },
  { href: "/admin/hero", title: "Hero", desc: "Headline, availability badge, buttons, profile video", icon: Sparkles },
  { href: "/admin/about", title: "About / Bio", desc: "Bio paragraphs, personality, quote", icon: User },
  { href: "/admin/now", title: "Now & Sections", desc: "Current priorities and section copy", icon: Zap },
  { href: "/admin/projects", title: "Projects", desc: "Cards, images, full case studies, pinned/featured", icon: FolderKanban },
  { href: "/admin/blog", title: "Blog", desc: "Posts and Markdown content", icon: FileText },
  { href: "/admin/achievements", title: "Certificates & Awards", desc: "Achievements, awards, credentials", icon: Award },
  { href: "/admin/experiences", title: "Experience", desc: "Roles, periods, highlights", icon: Briefcase },
  { href: "/admin/tech-stack", title: "Tech Stack", desc: "Skills grouped by category", icon: Layers },
  { href: "/admin/testimonials", title: "Testimonials", desc: "Quotes from people you've worked with", icon: MessageSquareQuote },
];

export default function AdminDashboard() {
  return (
    <div className="mx-auto max-w-4xl">
      <header className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
          Welcome back 👋
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Edit any part of your portfolio below. Changes save to your project files — refresh the
          site to preview, then <code className="rounded bg-neutral-200 px-1 dark:bg-neutral-800">git push</code> to publish.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.href}
              href={card.href}
              className="group flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4 transition-colors hover:border-amber-400/60 dark:border-neutral-800 dark:bg-neutral-900 dark:hover:border-amber-500/40"
            >
              <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/15 text-amber-600 dark:text-amber-400">
                <Icon className="size-4.5" />
              </div>
              <div className="min-w-0">
                <h2 className="font-semibold text-neutral-900 group-hover:text-amber-600 dark:text-white dark:group-hover:text-amber-400">
                  {card.title}
                </h2>
                <p className="text-sm text-neutral-500">{card.desc}</p>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
