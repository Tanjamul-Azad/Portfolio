"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, Github, Linkedin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { siteConfig, navLinks } from "@/config";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/common";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300 border-b border-transparent",
        scrolled
          ? "bg-white/80 dark:bg-black/80 backdrop-blur-md border-neutral-200 dark:border-neutral-800/50"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="text-xl font-bold font-heading tracking-tight flex items-center gap-2 text-neutral-900 dark:text-white"
        >
          <span className="text-amber-500 text-2xl">⚡</span>
          {siteConfig.name}
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              {link.name}
            </Link>
          ))}

          <div className="w-px h-6 bg-neutral-200 dark:bg-neutral-800 mx-2" />

          <div className="flex items-center gap-3">
            <Link
              href={siteConfig.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <Github className="w-5 h-5" />
            </Link>
            <Link
              href={siteConfig.links.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </Link>
            <ThemeToggle />
            <Button
              variant="outline"
              size="sm"
              className="font-semibold rounded-full px-6 border-neutral-300 dark:border-neutral-600 bg-neutral-900 dark:bg-white text-white dark:text-black hover:bg-amber-500 hover:border-amber-500 hover:text-black transition-all duration-300"
            >
              Resume
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden flex items-center gap-2">
          <ThemeToggle />
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="text-neutral-900 dark:text-white touch-target">
                <Menu className="w-6 h-6" />
                <span className="sr-only">Open menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent className="bg-white dark:bg-black border-neutral-200 dark:border-neutral-800 w-full sm:w-80">
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between pb-6 border-b border-neutral-200 dark:border-neutral-800">
                  <span className="text-lg font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                    <span className="text-amber-500 text-xl">⚡</span>
                    {siteConfig.name}
                  </span>
                  <SheetClose asChild>
                    <Button variant="ghost" size="icon" className="touch-target">
                      <X className="w-5 h-5" />
                      <span className="sr-only">Close menu</span>
                    </Button>
                  </SheetClose>
                </div>
                
                {/* Navigation Links */}
                <nav className="flex-1 py-8">
                  <ul className="space-y-2">
                    {navLinks.map((link) => (
                      <li key={link.name}>
                        <SheetClose asChild>
                          <Link
                            href={link.href}
                            className="flex items-center px-4 py-3 text-lg font-medium text-neutral-700 dark:text-neutral-300 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 rounded-xl transition-all duration-200 touch-target"
                          >
                            {link.name}
                          </Link>
                        </SheetClose>
                      </li>
                    ))}
                  </ul>
                </nav>
                
                {/* Footer Actions */}
                <div className="pt-6 border-t border-neutral-200 dark:border-neutral-800 space-y-4">
                  {/* Social Links */}
                  <div className="flex items-center justify-center gap-4">
                    <Link
                      href={siteConfig.links.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors touch-target"
                    >
                      <Github className="w-5 h-5" />
                      <span className="sr-only">GitHub</span>
                    </Link>
                    <Link
                      href={siteConfig.links.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-12 h-12 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-500/10 transition-colors touch-target"
                    >
                      <Linkedin className="w-5 h-5" />
                      <span className="sr-only">LinkedIn</span>
                    </Link>
                  </div>
                  
                  {/* Resume Button */}
                  <Button
                    asChild
                    className="w-full rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black hover:from-amber-300 hover:to-orange-400 font-semibold shadow-md shadow-amber-500/20 touch-target"
                  >
                    <a href="/resume.pdf" download>
                      Download Resume
                    </a>
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
