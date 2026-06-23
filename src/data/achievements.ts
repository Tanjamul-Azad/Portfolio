import data from "@/content/achievements.json";
import type { Achievement } from "@/types";

export const achievements: Achievement[] = data as Achievement[];

export function getAchievementsByType(type: Achievement["type"]) {
  return achievements.filter((a) => a.type === type);
}
