import data from "@/content/experiences.json";
import type { Experience } from "@/types";

export const experiences: Experience[] = data as Experience[];

export const getExperiences = () => experiences;
