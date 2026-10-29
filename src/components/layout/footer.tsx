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

/** The ORCID iD mark. */
function OrcidIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className={className}>
      <path d="M12 0C5.372 0 0 5.372 0 12s5.372 12 12 12 12-5.372 12-12S18.628 0 12 0zM7.369 4.378c.525 0 .947.431.947.947s-.422.947-.947.947a.95.95 0 0 1-.947-.947c0-.525.422-.947.947-.947zm-.722 3.038h1.444v10.041H6.647V7.416zm3.562 0h3.9c3.712 0 5.344 2.653 5.344 5.025 0 2.578-2.016 5.025-5.325 5.025h-3.919V7.416zm1.444 1.303v7.444h2.297c3.272 0 4.022-2.484 4.022-3.722 0-2.016-1.284-3.722-4.097-3.722h-2.222z" />
    </svg>
  );
}

/** ResearchGate has no glyph in the icon set, so it is set as a two-letter mark. */
function ResearchGateIcon({ className }: { className?: string }) {
  return (
    <span aria-hidden="true" className={`${className ?? ""} flex items-center justify-center text-[12px] font-bold leading-none tracking-tight`}>
      RG
    </span>
  );
}

const iconClass = "h-[18px] w-[18px]";

const socials: { name: string; href: string; icon: LucideIcon | typeof XIcon }[] = [
  { name: "GitHub", href: siteConfig.links.github, icon: Github },
  { name: "LinkedIn", href: siteConfig.links.linkedin, icon: Linkedin },
  { name: "X", href: siteConfig.links.twitter, icon: XIcon },
  { name: "ORCID", href: siteConfig.links.orcid, icon: OrcidIcon },
  { name: "ResearchGate", href: siteConfig.links.researchgate, icon: ResearchGateIcon },
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
