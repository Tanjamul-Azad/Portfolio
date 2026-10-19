import type { Metadata } from "next";
import { metadata as blogMetadata } from "../page";
import { siteConfig } from "@/config";
import BlogPageClient from "../blog-index-client";

export const metadata: Metadata = {
  ...blogMetadata,
  title: `All articles | ${siteConfig.name}`,
  alternates: { canonical: `${siteConfig.url}/blog/all` },
  openGraph: {
    ...blogMetadata.openGraph,
    title: `All articles | ${siteConfig.name}`,
    url: `${siteConfig.url}/blog/all`,
  },
  twitter: { ...blogMetadata.twitter, title: `All articles | ${siteConfig.name}` },
};

export default function AllArticlesPage() {
  return <BlogPageClient showAll />;
}
