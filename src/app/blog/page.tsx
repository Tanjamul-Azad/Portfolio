import type { Metadata } from "next";
import { siteConfig } from "@/config";
import BlogPageClient from "./blog-index-client";

// The list page previously had no metadata of its own, so search results and
// link previews for /blog showed the homepage title and description.
export const metadata: Metadata = {
  title: `Blog | ${siteConfig.name}`,
  description:
    "Notes on web development, machine learning, and lessons from building production systems.",
  alternates: { canonical: `${siteConfig.url}/blog` },
  openGraph: {
    type: "website",
    url: `${siteConfig.url}/blog`,
    title: `Blog | ${siteConfig.name}`,
    description:
      "Notes on web development, machine learning, and lessons from building production systems.",
    siteName: siteConfig.name,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: `${siteConfig.name} blog` }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Blog | ${siteConfig.name}`,
    description:
      "Notes on web development, machine learning, and lessons from building production systems.",
    images: [siteConfig.ogImage],
    creator: siteConfig.author.twitterHandle,
  },
};

export default function BlogPage() {
  return <BlogPageClient />;
}
