import Link from "next/link";
import {
  ArrowUp,
  ArrowUpRight,
  Facebook,
  FileText,
  Github,
  Linkedin,
  Mail,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { siteConfig, navLinks } from "@/config";
import { AnalyticsPreferencesButton } from "@/components/providers/analytics";

/** The X mark; lucide only ships the old bird. */
function XIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const iconClass = "h-[18px] w-[18px]";

const socials: { name: string; href: string; icon: LucideIcon | typeof XIcon }[] = [
  { name: "GitHub", href: siteConfig.links.github, icon: Github },
  { name: "LinkedIn", href: siteConfig.links.linkedin, icon: Linkedin },
  { name: "X", href: siteConfig.links.twitter, icon: XIcon },
  { name: "Facebook", href: siteConfig.links.facebook, icon: Facebook },
];

const linkClass =
  "group inline-flex min-h-11 items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:min-h-9";

export function Footer() {
  const whatsapp = `https://wa.me/${siteConfig.contact.whatsapp.replace(/[^0-9]/g, "")}`;

  return (
    <footer className="relative mt-8 border-t border-line">
      <div className="shell grid gap-12 py-14 sm:py-20 md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1fr)] md:gap-10">
        <div className="max-w-sm">
          <Link
            href="/"
            className="inline-flex min-h-11 items-center font-heading text-2xl font-semibold tracking-[-0.03em] text-foreground"
          >
            {siteConfig.name}
            <span className="text-accent">.</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {siteConfig.author.role}. Building reliable AI systems and the software around them from{" "}
            {siteConfig.author.location}.
          </p>

          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Social profiles">
            {socials.map(({ name, href, icon: Icon }) => (
              <li key={name}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={name}
                  title={name}
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted-foreground transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:text-foreground sm:h-10 sm:w-10"
                >
                  <Icon className={iconClass} />
                </a>
              </li>
            ))}
            <li>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                aria-label="Email"
                title="Email"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-line text-muted-foreground transition-[color,border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-line-strong hover:text-foreground sm:h-10 sm:w-10"
              >
                <Mail className={iconClass} />
              </a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-2 md:gap-10">
          <div>
            <p className="eyebrow mb-3 text-[10px]">Sitemap</p>
            <ul>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link href={`/${link.href}`} className={linkClass}>
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="eyebrow mb-3 text-[10px]">Get in touch</p>
            <ul>
              <li>
                <a href={`mailto:${siteConfig.contact.email}`} className={linkClass}>
                  <Mail className="h-3.5 w-3.5" />
                  Email
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a href={whatsapp} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  <MessageCircle className="h-3.5 w-3.5" />
                  WhatsApp
                  <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                </a>
              </li>
              <li>
                <a href={siteConfig.links.resume} download="Md. Tanzamul Azad - CV.pdf" className={linkClass}>
                  <FileText className="h-3.5 w-3.5" />
                  Resume (PDF)
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-line">
        <div className="shell flex flex-col gap-3 py-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-muted-foreground">
            <p className="font-mono">
              &copy; {new Date().getFullYear()} {siteConfig.author.name}
            </p>
            <Link href="/privacy" className="inline-flex min-h-11 items-center hover:text-foreground sm:min-h-9">
              Privacy &amp; analytics
            </Link>
            <AnalyticsPreferencesButton />
          </div>
          <a
            href="#main-content"
            className="group inline-flex h-11 items-center gap-1.5 self-start rounded-full border border-line px-4 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground sm:h-9 sm:self-auto sm:px-3.5"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
