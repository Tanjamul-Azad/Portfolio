import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectBySlug, getAllProjectSlugs } from "@/data/projects";
import { siteConfig } from "@/config";
import ProjectCaseStudyClient from "./project-case-study-client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    return {
      title: "Project Not Found",
      description: "The requested project case study could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const title = `${project.title} Case Study | ${siteConfig.name}`;
  const description = project.overview || project.description;
  const canonicalUrl = `${siteConfig.url}/projects/${project.slug}`;
  const imageUrl = project.image
    ? new URL(project.image, siteConfig.url).toString()
    : siteConfig.ogImage;

  return {
    title,
    description,
    keywords: [...project.tags, "Case Study", "Portfolio", siteConfig.name],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title,
      description,
      siteName: siteConfig.name,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: `${project.title} case study preview`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [imageUrl],
      creator: siteConfig.author.twitterHandle,
    },
  };
}

export default async function ProjectCaseStudyPage({ params }: PageProps) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const url = `${siteConfig.url}/projects/${project.slug}`;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "CreativeWork", "@id": `${url}#project`, url,
          name: project.title, description: project.overview || project.description,
          author: { "@id": `${siteConfig.url}/#person` },
          keywords: project.tags.join(", "), inLanguage: "en",
          ...(project.status === "building" ? { creativeWorkStatus: "In development" } : {}),
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
        },
        {
          "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Projects", item: `${siteConfig.url}/projects` },
            { "@type": "ListItem", position: 3, name: project.title, item: url },
          ],
        },
      ],
    }).replace(/</g, "\\u003c") }} />
    <ProjectCaseStudyClient slug={slug} />
  </>;
}
