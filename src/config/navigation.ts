import { siteConfig } from "./site";

export const navLinks = [
  { name: "Now", href: "#now" },
  { name: "Projects", href: "#projects" },
  { name: "Experience", href: "#experience" },
  { name: "Blog", href: "#blog" },
  { name: "Contact", href: "#contact" },
] as const;

export const footerLinks = [
  { name: "GitHub", href: siteConfig.links.github },
  { name: "LinkedIn", href: siteConfig.links.linkedin },
  { name: "Twitter", href: siteConfig.links.twitter },
] as const;
