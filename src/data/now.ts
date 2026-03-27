import type { NowItem } from "@/types";

export const nowItems: NowItem[] = [
  {
    category: "building",
    items: [
      "Complete Legal Aid — Currently implementing proper security using BlockChain",
      "SkillEx — peer skill-exchange platform (React 19 + Spring Boot 3, AOOP project)",
      "UniShare — real-time university community platform (React 19 + Socket.IO)",
    ],
  },
  {
    category: "learning",
    items: [
      "Ongoing Final Year Design Project",
      "Green Computing: Federated Learning Based Intrusion Detection for IoT",
      "ML Research: Conflict-Aware Hallucination Detection in Multi-Document Summarization"

    ],
  },
  {
    category: "looking",
    items: [
      "AI/ML internship or research collaboration",
      "Software Engineering (part-time / internship / freelance)",
      "Open-source or data-driven product challenges",
    ],
  },
];

export const getNowItems = () => nowItems;
export const getNowByCategory = (category: NowItem["category"]) =>
  nowItems.find((item) => item.category === category);
