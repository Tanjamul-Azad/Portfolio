import data from "@/content/projects.json";
import type { Project } from "@/types";

export const projects: Project[] = data as Project[];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id: string) => projects.find((p) => p.id === id);
export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const getAllProjectSlugs = () => projects.map((p) => p.slug);

// Projects flagged `pinned` are surfaced first on the homepage, in array order.
export const getPinnedProjects = () => projects.filter((p) => p.pinned);
