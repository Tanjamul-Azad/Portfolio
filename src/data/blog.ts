import data from "@/content/blog.json";
import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = data as BlogPost[];

export const getBlogPosts = () => blogPosts;
export const getFeaturedPosts = () => blogPosts.filter((p) => p.featured);
export const getPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);
export const getAllPostSlugs = () => blogPosts.map((p) => p.slug);
