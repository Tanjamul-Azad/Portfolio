import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { projects } from "@/data";
import { siteConfig } from "@/config";
import ProjectsPageClient from "../../projects-index-client";
import { CollectionSchema } from "@/components/common/collection-schema";

const pageCount = Math.ceil(projects.length / 9);
export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from({ length: Math.max(0, pageCount - 1) }, (_, i) => ({ page: String(i + 2) }));
}

function validPage(value: string) {
  const page = Number(value);
  return /^\d+$/.test(value) && page >= 2 && page <= pageCount ? page : undefined;
}

export async function generateMetadata({ params }: { params: Promise<{ page: string }> }): Promise<Metadata> {
  const page = validPage((await params).page);
  if (!page) return { title: "Page not found", robots: { index: false } };
  const title = `Projects — Page ${page} | Tanzamul Azad`;
  const url = `${siteConfig.url}/projects/page/${page}`;
  const description = `More AI, web and IoT projects by Tanzamul Azad. Browse project case studies, implementation details and source links.`;
  return { title, description, alternates: { canonical: url },
    openGraph: { type: "website", title, description, url, siteName: siteConfig.name, images: [siteConfig.ogImage] },
    twitter: { card: "summary_large_image", title, description, images: [siteConfig.ogImage] } };
}

export default async function ProjectArchivePage({ params }: { params: Promise<{ page: string }> }) {
  const page = validPage((await params).page);
  if (!page) notFound();
  return <><CollectionSchema path={`/projects/page/${page}`} name={`Projects by Tanzamul Azad — Page ${page}`} items={projects.slice((page - 1) * 9, page * 9)} offset={(page - 1) * 9} /><ProjectsPageClient initialPage={page} /></>;
}
