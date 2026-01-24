import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "1",
    company: "Tech Solutions Ltd.",
    role: "Senior Frontend Engineer",
    period: "2022 - Present",
    description: [
      "Led the migration of a legacy codebase to React 18 and TypeScript.",
      "Optimized core web vitals resulting in a 30% improvement in LCP.",
      "Mentored junior engineers and established best practices for UI development.",
    ],
    technologies: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
  },
  {
    id: "2",
    company: "Creative Agency",
    role: "Frontend Developer",
    period: "2020 - 2022",
    description: [
      "Developed custom e-commerce solutions for various brands.",
      "Implemented responsive designs with pixel-perfect accuracy.",
      "Collaborated with designers to deliver exceptional user experiences.",
    ],
    technologies: ["React", "JavaScript", "SCSS", "Redux"],
  },
];

export const getExperiences = () => experiences;
