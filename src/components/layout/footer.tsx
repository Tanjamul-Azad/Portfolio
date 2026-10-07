import Link from "next/link";
import { ArrowUp, ArrowUpRight } from "lucide-react";
import { siteConfig, footerLinks, navLinks } from "@/config";

export function Footer() {
  const elsewhere = [
    ...footerLinks,
    { name: "Facebook", href: siteConfig.links.facebook },
  ];

  return (
    <footer className="relative mt-8 overflow-hidden border-t border-line">
      <div className="shell grid gap-10 py-12 sm:py-16 md:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)_minmax(0,1fr)]">
        <div className="max-w-sm">
          <Link href="/" className="inline-flex min-h-11 items-center font-heading text-xl font-semibold tracking-[-0.03em] text-foreground">
            {siteConfig.name}
            <span className="text-accent">.</span>
          </Link>
          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
            {siteConfig.author.role}, based in{" "}
            {siteConfig.author.location}.
          </p>
          <a
            href={`mailto:${siteConfig.contact.email}`}
            className="mt-2 inline-flex min-h-11 items-center gap-1 text-sm font-medium text-foreground hover:text-accent"
          >
            {siteConfig.contact.email}
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>

        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 md:col-span-2 md:grid-cols-2">
          <div>
            <p className="eyebrow mb-4 text-[10px]">Sitemap</p>
            <ul>
              {navLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={`/${link.href}`}
                    className="inline-flex min-h-11 items-center sm:min-h-9 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-[10px]">Elsewhere</p>
            <ul>
              {elsewhere.map((link) => (
                <li key={link.name}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group inline-flex min-h-11 items-center sm:min-h-9 gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.name}
                    <ArrowUpRight className="h-3 w-3 opacity-0 transition-opacity group-hover:opacity-100" />
                  </a>
                </li>
              ))}
              <li>
                <a
                  href={siteConfig.links.resume}
                  download="Md. Tanzamul Azad - CV.pdf"
                  className="inline-flex min-h-11 items-center sm:min-h-9 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  Resume (PDF)
                </a>
              </li>
            </ul>
          </div>
        </nav>
      </div>

      <div className="shell flex items-center justify-between gap-4 border-t border-line py-5">
        <p className="font-mono text-[11px] text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.author.name}
        </p>
        <a
          href="#main-content"
          className="group inline-flex h-11 items-center gap-1.5 rounded-full border border-line px-4 sm:h-9 sm:px-3.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
        >
          Back to top
          <ArrowUp className="h-3.5 w-3.5 transition-transform group-hover:-translate-y-0.5" />
        </a>
      </div>

      {/* Oversized wordmark bleeding off the bottom edge — a quiet sign-off. */}
      <div aria-hidden="true" className="pointer-events-none select-none overflow-hidden">
        <p className="display -mb-[0.22em] text-center text-[21vw] leading-none text-transparent [-webkit-text-stroke:1px_var(--line-strong)] lg:text-[16rem]">
          {siteConfig.name}
        </p>
      </div>
    </footer>
  );
}
