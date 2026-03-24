import type { TechItem } from "@/types";

export const techStack: TechItem[] = [
  {
    name: "TypeScript",
    icon: "📘",
    category: "frontend",
    description: "Typed frontend development",
  },
  {
    name: "React",
    icon: "⚛️",
    category: "frontend",
    description: "Component-driven UI",
  },
  {
    name: "Next.js",
    icon: "▲",
    category: "frontend",
    description: "App routing and SSR",
  },
  {
    name: "Vite",
    icon: "⚡",
    category: "frontend",
    description: "Frontend build tooling",
  },
  {
    name: "Tailwind CSS",
    icon: "🌊",
    category: "frontend",
    description: "Utility-first styling",
  },
  {
    name: "Django",
    icon: "🎯",
    category: "backend",
    description: "Backend APIs and auth",
  },
  {
    name: "Flask",
    icon: "🧪",
    category: "backend",
    description: "Lightweight Python services",
  },
  {
    name: "Spring Boot",
    icon: "☕",
    category: "backend",
    description: "Java backend development",
  },
  {
    name: "MySQL",
    icon: "🐬",
    category: "database",
    description: "Relational data storage",
  },
  {
    name: "Firebase",
    icon: "🔥",
    category: "cloud",
    description: "Auth and notifications",
  },
  {
    name: "Google Cloud Platform",
    icon: "☁️",
    category: "cloud",
    description: "Deployment and cloud services",
  },
  {
    name: "scikit-learn",
    icon: "🤖",
    category: "tools",
    description: "ML modeling",
  },
  {
    name: "spaCy",
    icon: "🧠",
    category: "tools",
    description: "NLP processing",
  },
  {
    name: "OpenCV",
    icon: "📷",
    category: "tools",
    description: "Computer vision",
  },
  {
    name: "Docker",
    icon: "🐳",
    category: "tools",
    description: "Containerized workflows",
  },
];

export const getTechByCategory = (category: TechItem["category"]) =>
  techStack.filter((t) => t.category === category);
