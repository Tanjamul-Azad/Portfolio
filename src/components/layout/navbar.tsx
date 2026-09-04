"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, Github, Linkedin, Facebook, X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import InteractiveHoverButton from "@/components/ui/interactive-hover-button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { siteConfig, navLinks } from "@/config";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/common";
import { AdminEditIcon } from "@/components/common/admin-edit-icon";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("");
  const pathname = usePathname();
  const isHome = pathname === "/";

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
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

  return (
    <nav
      aria-label="Main"
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 ease-in-out border-b border-transparent",
        scrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-neutral-200/50 dark:border-white/5 py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center py-2.5 text-lg sm:text-xl font-bold font-heading tracking-tight text-neutral-900 dark:text-white"
        >
          {siteConfig.name}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isAnchorLink = link.href.startsWith('#');
              const href = isAnchorLink ? (isHome ? link.href : `/${link.href}`) : link.href;
              const sectionId = link.href.replace("#", "");
              const isActive = isHome && isAnchorLink && activeSection === sectionId;

              return (
                <Link
                  key={link.name}
                  href={href}
                  scroll
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "link-underline relative px-3 py-2 text-sm font-medium transition-colors duration-300",
                    isActive
                      ? "text-neutral-900 dark:text-white"
                      : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
                  )}
                >
                  {link.name}
                </Link>
              );
            })}
          </div>

          <div className="w-px h-4 bg-neutral-300 dark:bg-neutral-800" />

          <div className="flex items-center gap-2">
            {[
              { Icon: Github, href: siteConfig.links.github, label: "GitHub" },
              { Icon: Linkedin, href: siteConfig.links.linkedin, label: "LinkedIn" },
              { Icon: Facebook, href: siteConfig.links.facebook, label: "Facebook" },
            ].map(({ Icon, href, label }, i) => (
              <Link
                key={i}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${label}`}
                className="inline-flex h-11 w-11 items-center justify-center rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-all duration-300 hover-lift focus-visible:ring-2 focus-visible:ring-amber-500/70"
              >
                <Icon className="w-4.5 h-4.5" />
              </Link>
            ))}

            <AdminEditIcon />
            <ThemeToggle />

            <InteractiveHoverButton
              text="Resume"
              hoverIcon={<Download className="h-4 w-4" />}
              hoverIconPosition="right"
              showArrow={false}
              href={siteConfig.links.resume}
              download="Md. Tanzamul Azad - CV.pdf"
              classes="ml-2 h-10 min-w-34 rounded-full bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white px-5 text-sm font-semibold"
            />

          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <AdminEditIcon />
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-neutral-900 dark:text-white">
                <Menu className="w-6 h-6" />
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
              className="bg-white dark:bg-black border-t border-neutral-200 dark:border-neutral-800/60 max-h-[85svh] rounded-t-3xl p-0"
            >
              <div className="flex max-h-[85svh] flex-col">
                {/* Grab handle, the usual affordance for a sheet that can be
                    dismissed by dragging or tapping away. */}
                <div aria-hidden="true" className="mx-auto mt-3 h-1 w-10 shrink-0 rounded-full bg-neutral-300 dark:bg-neutral-700" />

                {/* Header */}
                <div className="flex items-center justify-between px-6 pt-4 pb-5 border-b border-neutral-100 dark:border-neutral-900">
                  <SheetTitle asChild>
                    <Link
                      href="/"
                      onClick={() => setIsOpen(false)}
                      className="text-base font-bold font-heading tracking-tight text-neutral-900 dark:text-white"
                    >
                      {siteConfig.name}
                    </Link>
                  </SheetTitle>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full -mr-1 text-neutral-500 hover:text-neutral-900 dark:hover:text-white">
                      <X className="w-5 h-5" />
                    </Button>
                  </SheetClose>
                </div>

                {/* Nav links */}
                <nav aria-label="Mobile" className="flex-1 overflow-y-auto px-4 py-5">
                  <ul className="space-y-0.5">
                    {navLinks.map((link, i) => {
                      const sectionId = link.href.replace("#", "");
                      const isActive = isHome && activeSection === sectionId;
                      return (
                        <motion.li
                          key={link.name}
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.045, duration: 0.25 }}
                        >
                          <SheetClose asChild>
                            <Link
                              href={link.href.startsWith('#') ? (isHome ? link.href : `/${link.href}`) : link.href}
                              scroll
                              className={cn(
                                "flex items-center gap-3 px-3 py-3 rounded-xl text-base font-medium transition-all group",
                                isActive
                                  ? "text-accent bg-amber-500/8 dark:bg-amber-500/10"
                                  : "text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-900"
                              )}
                            >
                              <span className={cn(
                                "w-1.5 h-1.5 rounded-full shrink-0 transition-colors",
                                isActive
                                  ? "bg-amber-500"
                                  : "bg-neutral-300 dark:bg-neutral-700 group-hover:bg-amber-400"
                              )} />
                              {link.name}
                            </Link>
                          </SheetClose>
                        </motion.li>
                      );
                    })}
                  </ul>
                </nav>

                {/* Footer. Bottom padding clears the home indicator on a
                    gesture-navigation handset. */}
                <div className="shrink-0 border-t border-neutral-100 px-6 pt-2 pb-[max(1.5rem,env(safe-area-inset-bottom))] dark:border-neutral-900">
                  <div className="flex items-center gap-2 mt-5 mb-5">
                    {[
                      { Icon: Github, href: siteConfig.links.github, label: "GitHub" },
                      { Icon: Linkedin, href: siteConfig.links.linkedin, label: "LinkedIn" },
                      { Icon: Facebook, href: siteConfig.links.facebook, label: "Facebook" },
                    ].map(({ Icon, href, label }, i) => (
                      <Link
                        key={i}
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`Open ${label}`}
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-amber-500/10 dark:hover:bg-amber-500/10 text-neutral-500 dark:text-neutral-400 hover:text-accent transition-colors"
                      >
                        <Icon className="w-4.5 h-4.5" />
                      </Link>
                    ))}
                  </div>

                  <InteractiveHoverButton
                    text="Download Resume"
                    hoverIcon={<Download className="h-4 w-4" />}
                    hoverIconPosition="right"
                    showArrow={false}
                    href={siteConfig.links.resume}
                    download="Md. Tanzamul Azad - CV.pdf"
                    classes="w-full min-w-0 rounded-full py-3.5 text-sm font-semibold bg-neutral-900 dark:bg-white text-white dark:text-black border-neutral-900 dark:border-white"
                  />
                </div>

              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

