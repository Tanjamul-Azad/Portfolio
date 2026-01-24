import type { TechItem } from "@/types";

export const techStack: TechItem[] = [
  {
    name: "React",
    icon: "⚛️",
    category: "frontend",
    description: "UI Library",
  },
  {
    name: "TypeScript",
    icon: "📘",
    category: "frontend",
    description: "Type-safe JavaScript",
  },
  {
    name: "Next.js",
    icon: "▲",
    category: "frontend",
    description: "React Framework",
  },
  {
    name: "Tailwind CSS",
    icon: "🌊",
    category: "frontend",
    description: "Utility-first CSS",
  },
  {
    name: "Node.js",
    icon: "🟢",
    category: "backend",
    description: "JS Runtime",
  },
  {
    name: "PostgreSQL",
    icon: "🐘",
    category: "database",
    description: "SQL Database",
  },
  {
    name: "MongoDB",
    icon: "🍃",
    category: "database",
    description: "NoSQL Database",
  },
  {
    name: "Docker",
    icon: "🐳",
    category: "tools",
    description: "Containerization",
  },
];

export const getTechByCategory = (category: TechItem["category"]) =>
  techStack.filter((t) => t.category === category);
