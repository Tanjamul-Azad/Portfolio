import heroData from "@/content/hero.json";
import aboutData from "@/content/about.json";
import sectionsData from "@/content/sections.json";
import type { AboutContent, HeroContent, SectionsContent } from "@/types";

export const heroContent = heroData as HeroContent;
export const aboutContent = aboutData as AboutContent;
export const sectionsContent = sectionsData as SectionsContent;
