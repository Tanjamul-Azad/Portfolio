import type { NowItem } from "@/types";

export const nowItems: NowItem[] = [
  {
    category: "building",
    items: [
      "Farm-Friend - AI-powered agriculture assistant",
      "ConvoVerse - Real-time chat platform with AI features",
      "Complete Legal Aid - Legal document automation system",
    ],
  },
  {
    category: "learning",
    items: [
      "Next.js 15 & React Server Components",
      "Spring Boot for enterprise backends",
      "RAG pipelines & vector databases",
      "System design patterns",
    ],
  },
  {
    category: "looking",
    items: [
      "Software Engineering Internship",
      "Research Assistant positions",
      "Freelance web development projects",
      "Open source collaboration opportunities",
    ],
  },
];

export const getNowItems = () => nowItems;
export const getNowByCategory = (category: NowItem["category"]) => 
  nowItems.find((item) => item.category === category);
