import Link from "next/link";
import { siteConfig, footerLinks } from "@/config";

export function Footer() {
  return (
    <footer className="relative py-8">
      <div className="container px-4 sm:px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
        <div className="text-xs text-neutral-400 dark:text-neutral-600">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-neutral-600 dark:text-neutral-400">{siteConfig.name}</span>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-11 items-center px-1 text-xs text-neutral-400 dark:text-neutral-600 hover:text-accent hover:-translate-y-0.5 active:translate-y-0 transition-all duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
