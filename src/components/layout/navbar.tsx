"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Github, Linkedin, Facebook, X, Download, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { siteConfig, navLinks } from "@/config";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/common";
import { AdminEditIcon } from "@/components/common/admin-edit-icon";

const socials = [
  { Icon: Github, href: siteConfig.links.github, label: "GitHub" },
  { Icon: Linkedin, href: siteConfig.links.linkedin, label: "LinkedIn" },
  { Icon: Facebook, href: siteConfig.links.facebook, label: "Facebook" },
];

/** Two short bars that read as a menu glyph, lighter than lucide's three. */
function MenuGlyph() {
  return (
    <span aria-hidden="true" className="flex w-4.5 flex-col items-end gap-1.25">
      <span className="h-[1.5px] w-full rounded-full bg-current" />
      <span className="h-[1.5px] w-2/3 rounded-full bg-current" />
    </span>
  );
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 24);
      // Back over the hero no nav section is in view; without this the last
      // section observed (often Contact) stayed highlighted at the top.
      if (window.scrollY < window.innerHeight * 0.5) setActiveSection("");
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks
      .map((link) => link.href.replace("#", ""))
      .filter(Boolean);

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) {
      setActiveSection("");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries.length > 0) {
          setActiveSection(visibleEntries[0].target.id);
        }
      },
      { rootMargin: "-35% 0px -45% 0px", threshold: [0.2, 0.5, 0.8] }
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [pathname]);

  const hrefFor = (href: string) =>
    href.startsWith("#") ? (isHome ? href : `/${href}`) : href;

  return (
    <nav
      aria-label="Main"
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-[padding] duration-500 ease-out",
        scrolled ? "px-3 pt-3 sm:px-4" : "px-0 pt-0"
      )}
    >
      {/* Full-width and transparent over the hero; once the page moves it
          tucks into a floating, blurred island so it stops competing with the
          content scrolling under it. */}
      <div
        className={cn(
          "mx-auto flex items-center justify-between rounded-full border transition-all duration-500 ease-out",
          scrolled
            ? "max-w-5xl border-line bg-background/75 py-1.5 pl-5 pr-1.5 shadow-[0_8px_30px_-12px_rgb(0_0_0/0.25)] backdrop-blur-xl"
            : "max-w-6xl border-transparent bg-transparent px-5 py-4 sm:px-6 lg:px-8"
        )}
      >
        <Link
          href="/"
          className="inline-flex items-center py-2 font-heading text-lg font-semibold tracking-[-0.03em] text-foreground"
        >
          {siteConfig.name}
          <span className="text-accent">.</span>
        </Link>

        {/* Desktop: centred link pill with a sliding active marker. */}
        <ul className="hidden items-center gap-0.5 rounded-full border border-line bg-surface/50 p-1 backdrop-blur-md md:flex">
          {navLinks.map((link) => {
            const isAnchorLink = link.href.startsWith("#");
            const sectionId = link.href.replace("#", "");
            const isActive = isHome && isAnchorLink && activeSection === sectionId;

            return (
              <li key={link.name} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="nav-active"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                    className="absolute inset-0 rounded-full bg-surface-2 ring-1 ring-line"
                  />
                )}
                <Link
                  href={hrefFor(link.href)}
                  scroll
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative z-10 inline-flex h-8 items-center rounded-full px-3.5 text-[13px] font-medium transition-colors duration-300",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.name}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="hidden items-center gap-2 md:flex">
          <AdminEditIcon />
          <ThemeToggle />
          <a
            href={siteConfig.links.resume}
            download="Md. Tanzamul Azad - CV.pdf"
            className="group inline-flex h-9 items-center gap-1.5 rounded-full bg-foreground pl-4 pr-3 text-[13px] font-semibold text-background transition-transform duration-300 hover:-translate-y-px"
          >
            Resume
            <Download className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
          </a>
        </div>

        {/* Mobile */}
        <div className="flex items-center gap-1.5 md:hidden">
          <AdminEditIcon />
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full border border-line bg-surface/60 text-foreground hover:bg-surface-2"
              >
                <MenuGlyph />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            {/* A bottom sheet rather than a side drawer: the trigger has to live
                in the navbar, but that puts it in the top corner a thumb reaches
                last. Opening upward from the bottom edge lands the links
                themselves in the easy part of the screen. */}
            <SheetContent
              side="bottom"
              // The header below carries its own close button; the built-in one
              // would sit a few pixels above it as a second, identical X.
              showCloseButton={false}
              className="max-h-[88svh] rounded-t-[1.75rem] border-t border-line bg-background p-0"
            >
              <div className="flex max-h-[88svh] flex-col">
                <div aria-hidden="true" className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-line-strong" />

                <div className="flex items-center justify-between px-5 pb-3 pt-3">
                  <SheetTitle asChild>
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="font-heading text-base font-semibold tracking-[-0.03em] text-foreground"
                    >
                      {siteConfig.name}
                      <span className="text-accent">.</span>
                    </Link>
                  </SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="-mr-1 rounded-full text-muted-foreground hover:text-foreground">
                      <X className="h-5 w-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>

                {/* Links as a numbered two-column grid: six destinations fit
                    in three short rows instead of a tall list. */}
                <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 pb-2">
                  <ul className="grid grid-cols-2 gap-2">
                    {navLinks.map((link, i) => {
                      const sectionId = link.href.replace("#", "");
                      const isActive = isHome && activeSection === sectionId;
                      return (
                        <motion.li
                          key={link.name}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.035, duration: 0.25 }}
                        >
                          <SheetClose asChild>
                            <Link
                              href={hrefFor(link.href)}
                              scroll
                              aria-current={isActive ? "page" : undefined}
                              className={cn(
                                "flex h-16 flex-col justify-between rounded-2xl border px-3.5 py-2.5 transition-colors",
                                isActive
                                  ? "border-amber-500/40 bg-amber-500/10"
                                  : "border-line bg-surface active:bg-surface-2"
                              )}
                            >
                              <span className={cn("font-mono text-[10px] tracking-[0.14em]", isActive ? "text-accent" : "text-muted-foreground")}>
                                {String(i + 1).padStart(2, "0")}
                              </span>
                              <span className="text-[15px] font-medium text-foreground">{link.name}</span>
                            </Link>
                          </SheetClose>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Bottom padding clears the home indicator on a
                    gesture-navigation handset. */}
                <div className="flex shrink-0 items-center gap-2 px-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] pt-3">
                  {socials.map(({ Icon, href, label }) => (
                    <Link
                      key={label}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Open ${label}`}
                      className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-surface text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <Icon className="h-4.5 w-4.5" />
                    </Link>
                  ))}
                  <a
                    href={siteConfig.links.resume}
                    download="Md. Tanzamul Azad - CV.pdf"
                    className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-foreground text-sm font-semibold text-background"
                  >
                    Resume
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
