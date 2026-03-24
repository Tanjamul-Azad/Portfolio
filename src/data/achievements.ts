import type { Achievement } from "@/types";

export const achievements: Achievement[] = [
  {
    id: "1",
    title: "Champion, UIU CSE Project Show Summer 2025",
    issuer: "United International University",
    date: "2025",
    type: "award",
    icon: "🏆",
    description:
      "Awarded first place in System Analysis & Design for UI/UX contribution to the Complete Legal Aid platform.",
    skills: ["System Analysis", "UI/UX", "Product Design", "Legal Tech"],
  },
  {
    id: "2",
    title: "3rd Runner-Up, UIU CSE Project Show Fall 2025",
    issuer: "United International University",
    date: "2025",
    type: "award",
    icon: "🥉",
    description:
      "Recognized in Software Engineering category for development work on Complete Legal Aid.",
    skills: ["Software Engineering", "Team Delivery", "Full-Stack Development"],
  },
  {
    id: "3",
    title: "4th Runner-Up, UIU CSE Project Show 2024",
    issuer: "United International University",
    date: "2024",
    type: "award",
    icon: "🏅",
    description:
      "Recognized for AI + IoT innovation with the Care Companion smart healthcare rover.",
    skills: ["AI", "IoT", "Embedded Systems", "Innovation"],
  },
  {
    id: "4",
    title: "3rd Place, Math & Physics Olympiad (Junior)",
    issuer: "BdMOC",
    date: "2016",
    type: "achievement",
    icon: "🥉",
    description:
      "Achieved 3rd place in a national-level junior competition, demonstrating strong quantitative problem-solving skills.",
    skills: ["Mathematics", "Physics", "Analytical Thinking"],
  },
  {
    id: "5",
    title: "Perfect GPA in SSC and HSC",
    issuer: "National Public Examinations",
    date: "2018 - 2020",
    type: "achievement",
    icon: "📘",
    description:
      "Maintained GPA 5.00/5.00 in both SSC (2018) and HSC (2020).",
    skills: ["Academic Excellence", "Consistency", "Discipline"],
  },
];

export function getAchievementsByType(type: Achievement["type"]) {
  return achievements.filter((a) => a.type === type);
}
