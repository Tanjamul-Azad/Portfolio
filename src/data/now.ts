import type { NowItem } from "@/types";

export const nowItems: NowItem[] = [
  {
    category: "building",
    items: [
      "Complete Legal Aid - production legal technology platform with AI drafting",
      "ConvoVerse - LLM-based multi-agent social practice system",
      "Care Companion - AI + IoT healthcare rover with real-time monitoring",
    ],
  },
  {
    category: "learning",
    items: [
      "Applied NLP pipelines with spaCy and fuzzy matching",
      "Model training and evaluation with scikit-learn",
      "Data-driven system design and deployment",
      "Production backend patterns with Django and Flask",
    ],
  },
  {
    category: "looking",
    items: [
      "Data Science internship roles",
      "Software Engineering opportunities",
      "NLP or AI research collaborations",
      "Real-world, data-driven product challenges",
    ],
  },
];

export const getNowItems = () => nowItems;
export const getNowByCategory = (category: NowItem["category"]) => 
  nowItems.find((item) => item.category === category);
