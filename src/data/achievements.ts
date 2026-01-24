import type { Achievement } from "@/types";

export const achievements: Achievement[] = [
  {
    id: "1",
    title: "AWS Certified Developer",
    issuer: "Amazon Web Services",
    date: "2025",
    type: "certification",
    icon: "🏆",
    description:
      "Professional certification demonstrating expertise in developing and maintaining AWS-based applications.",
    credentialUrl: "https://aws.amazon.com/certification/",
    skills: ["AWS Lambda", "DynamoDB", "S3", "CloudFormation"],
  },
  {
    id: "2",
    title: "Best Innovation Award",
    issuer: "TechCrunch Hackathon",
    date: "2024",
    type: "award",
    icon: "🥇",
    description:
      "First place for building an AI-powered accessibility tool that helps visually impaired users navigate websites.",
    skills: ["React", "TensorFlow.js", "Web Accessibility"],
  },
  {
    id: "3",
    title: "Meta Frontend Developer",
    issuer: "Meta (Coursera)",
    date: "2024",
    type: "certification",
    icon: "📜",
    description:
      "Professional certificate covering advanced React patterns, testing, and performance optimization.",
    credentialUrl: "https://coursera.org/",
    skills: ["React", "Jest", "Performance"],
  },
  {
    id: "4",
    title: "Open Source Contributor",
    issuer: "Next.js",
    date: "2024",
    type: "achievement",
    icon: "⭐",
    description:
      "Recognized contributor to the Next.js framework with multiple merged pull requests improving documentation and bug fixes.",
    credentialUrl: "https://github.com/vercel/next.js",
    skills: ["Next.js", "TypeScript", "Documentation"],
  },
  {
    id: "5",
    title: "Google UX Design",
    issuer: "Google (Coursera)",
    date: "2023",
    type: "certification",
    icon: "🎨",
    description:
      "Comprehensive UX design certification covering user research, wireframing, prototyping, and usability testing.",
    credentialUrl: "https://coursera.org/",
    skills: ["Figma", "User Research", "Prototyping"],
  },
  {
    id: "6",
    title: "Rising Star Developer",
    issuer: "Dev.to Community",
    date: "2023",
    type: "award",
    icon: "🌟",
    description:
      "Recognized for publishing high-quality technical articles with over 50,000 total views and helping the developer community.",
    skills: ["Technical Writing", "Community"],
  },
];

export function getAchievementsByType(type: Achievement["type"]) {
  return achievements.filter((a) => a.type === type);
}
