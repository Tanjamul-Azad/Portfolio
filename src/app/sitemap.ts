import { MetadataRoute } from "next";
import { siteConfig } from "@/config";
import { projects } from "@/data";
import { blogPosts } from "@/data";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = siteConfig.url;

  // Main pages
  const mainPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${baseUrl}/projects`,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/blog`,
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Full article archive
  mainPages.push({ url: `${baseUrl}/blog/all`, changeFrequency: "weekly", priority: 0.7 });

  // Project pages
  for (let page = 2; page <= Math.ceil(projects.length / 9); page++) {
    mainPages.push({ url: `${baseUrl}/projects/page/${page}`, changeFrequency: "monthly", priority: 0.5 });
  }
  const projectPages: MetadataRoute.Sitemap = projects.map((project) => ({
    url: `${baseUrl}/projects/${project.slug}`,
    images: project.image ? [new URL(project.image, baseUrl).toString()] : undefined,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // Blog post pages
  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    images: post.image ? [new URL(post.image, baseUrl).toString()] : undefined,
    lastModified: new Date(post.updatedAt || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...mainPages, ...projectPages, ...blogPages];
}
