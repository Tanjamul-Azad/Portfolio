import { Suspense } from "react";
import type { Metadata } from "next";
import { siteConfig } from "@/config";
import { projects } from "@/data";
import ProjectsPageClient from "./projects-index-client";

const description = `Selected engineering work by ${siteConfig.author.name} — ${projects.length} full-stack, AI, and IoT projects with case studies, live demos, and source.`;

// The list page previously inherited the homepage metadata verbatim.
export const metadata: Metadata = {
  title: `Projects | ${siteConfig.name}`,
  description,
  alternates: { canonical: `${siteConfig.url}/projects` },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/projects`,
    title: `Projects | ${siteConfig.name}`,
    description,
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.name} projects` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Projects | ${siteConfig.name}`,
    description,
    images: [siteConfig.ogImage],
    creator: siteConfig.author.twitterHandle,
  },
};

export default function ProjectsPage() {
  // The client view reads `?q`/`?tag`/`?page` via useSearchParams, which must sit
  // under a Suspense boundary for the route to stay statically renderable.
  return (
    <Suspense fallback={null}>
      <ProjectsPageClient />
    </Suspense>
  );
}
