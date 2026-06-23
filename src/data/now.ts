import data from "@/content/now.json";
import type { NowItem } from "@/types";

export const nowItems: NowItem[] = data as NowItem[];

export const getNowItems = () => nowItems;
export const getNowByCategory = (category: NowItem["category"]) =>
  nowItems.find((item) => item.category === category);
