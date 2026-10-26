import { siteConfig } from "./site";

export const navLinks = [
  { name: "About", href: "#about" },
  { name: "Now", href: "#now" },
  { name: "Projects", href: "#projects" },
  { name: "Research", href: "#research" },
  { name: "ExtraCurricular", href: "#activities" },
  { name: "Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
] as const;

export const footerLinks = [
  { name: "GitHub", href: siteConfig.links.github },
  { name: "LinkedIn", href: siteConfig.links.linkedin },
  { name: "X", href: siteConfig.links.twitter },
] as const;
