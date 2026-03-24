"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Menu, Github, Linkedin, Facebook, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { siteConfig, navLinks } from "@/config";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/common";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("now");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const sectionIds = navLinks
      .map((link) => link.href.replace("#", ""))
      .filter(Boolean);

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => section !== null);

    if (sections.length === 0) return;

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
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-500 ease-in-out border-b border-transparent",
        scrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-xl border-neutral-200/50 dark:border-white/5 py-2"
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold font-heading tracking-tight text-neutral-900 dark:text-white"
        >
          {siteConfig.name}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          <div className="flex items-center gap-1">
            {navLinks.map((link) => {
              const isAnchorLink = link.href.startsWith('#');
              const href = isAnchorLink ? `/${link.href}` : link.href;
              const sectionId = link.href.replace("#", "");
              const isActive = isAnchorLink && activeSection === sectionId;

              return (
                <Link
                  key={link.name}
                  href={href}
                  scroll={!isAnchorLink}
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
                className="p-2 rounded-full text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-all duration-300 hover-lift focus-visible:ring-2 focus-visible:ring-amber-500/70"
              >
                <Icon className="w-4.5 h-4.5" />
              </Link>
            ))}

            <ThemeToggle />

            <Button
              asChild
              variant="default"
              size="sm"
              className="ml-2 rounded-full px-5 font-medium bg-neutral-900 text-white dark:bg-white dark:text-black hover:bg-neutral-800 dark:hover:bg-neutral-200 transition-all duration-300 hover-lift"
            >
              <a href="/resume.pdf" download>
                Resume
              </a>
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-neutral-900 dark:text-white">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-neutral-200 dark:border-neutral-800 w-full sm:w-80">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between pb-6 border-b border-neutral-100 dark:border-neutral-900">
                  <span className="text-lg font-bold font-heading">Menu</span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="rounded-full">
                      <X className="w-5 h-5" />
                    </Button>
                  </SheetClose>
                </div>

                <nav className="flex-1 py-8">
                  <ul className="space-y-4">
                    {navLinks.map((link, i) => (
                      <motion.li
                        key={link.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                        <SheetClose asChild>
                          <Link
                            href={link.href.startsWith('#') ? `/${link.href}` : link.href}
                            scroll={!link.href.startsWith('#')}
                            className="block text-2xl font-light tracking-tight hover:text-amber-500 transition-colors focus-visible:text-amber-500"
                          >
                            {link.name}
                          </Link>
                        </SheetClose>
                      </motion.li>
                    ))}
                  </ul>
                </nav>

                <div className="pt-6 border-t border-neutral-100 dark:border-neutral-900">
                  <div className="flex gap-4 justify-center mb-6">
                    {[
                      { Icon: Github, href: siteConfig.links.github, label: "GitHub" },
                      { Icon: Linkedin, href: siteConfig.links.linkedin, label: "LinkedIn" },
                    ].map(({ Icon, href, label }, i) => (
                      <Link
                        key={i}
                        href={href}
                        target="_blank"
                        aria-label={`Open ${label}`}
                        className="p-3 rounded-full bg-neutral-100 dark:bg-neutral-900 hover:bg-amber-100 dark:hover:bg-amber-900/20 text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-500 transition-colors focus-visible:ring-2 focus-visible:ring-amber-500/70"
                      >
                        <Icon className="w-5 h-5" />
                      </Link>
                    ))}
                  </div>
                  <Button asChild className="w-full rounded-full py-6 text-lg">
                    <a href="/resume.pdf" download>Download Resume</a>
                  </Button>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}

