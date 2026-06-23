import data from "@/content/tech-stack.json";
import type { TechItem } from "@/types";

export const techStack: TechItem[] = data as TechItem[];

export const getTechByCategory = (category: TechItem["category"]) =>
  techStack.filter((t) => t.category === category);
