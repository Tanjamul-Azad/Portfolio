import type { Metadata } from "next";
import { metadata as blogMetadata } from "../page";
import { siteConfig } from "@/config";
import BlogPageClient from "../blog-index-client";
import { blogPosts } from "@/data";
import { CollectionSchema } from "@/components/common/collection-schema";

export const metadata: Metadata = {
  ...blogMetadata,
  title: "All AI & Engineering Articles | Tanzamul Azad",
  alternates: { canonical: `${siteConfig.url}/blog/all` },
  openGraph: {
    ...blogMetadata.openGraph,
    title: `All articles | ${siteConfig.name}`,
    url: `${siteConfig.url}/blog/all`,
  },
  twitter: { ...blogMetadata.twitter, title: `All articles | ${siteConfig.name}` },
};

export default function AllArticlesPage() {
  return <><CollectionSchema path="/blog/all" name="All articles by Tanzamul Azad" items={blogPosts} /><BlogPageClient showAll /></>;
}
