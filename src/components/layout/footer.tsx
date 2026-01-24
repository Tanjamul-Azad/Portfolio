import Link from "next/link";
import { siteConfig, footerLinks } from "@/config";

export function Footer() {
  return (
    <footer className="py-8 border-t border-neutral-200 dark:border-neutral-800/50 bg-neutral-50 dark:bg-black">
      <div className="container px-6 mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="text-xs text-neutral-400 dark:text-neutral-600">
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-neutral-600 dark:text-neutral-400">{siteConfig.name}</span>
        </div>

        <div className="flex items-center gap-6">
          {footerLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 dark:text-neutral-600 hover:text-amber-600 dark:hover:text-amber-400 transition-colors duration-300"
            >
              {link.name}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  );
}
