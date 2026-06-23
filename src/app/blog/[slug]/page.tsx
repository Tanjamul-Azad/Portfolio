import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPostBySlug, getAllPostSlugs } from "@/data";
import { siteConfig } from "@/config";
import BlogPostClient from "./blog-post-client";

type PageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    return {
      title: "Post Not Found",
      description: "The requested blog post could not be found.",
      robots: { index: false, follow: false },
    };
  }

  const canonicalUrl = `${siteConfig.url}/blog/${post.slug}`;

  return {
    title: `${post.title} | ${siteConfig.name}`,
    description: post.excerpt,
    keywords: [...post.tags, "Blog", siteConfig.name],
    alternates: { canonical: canonicalUrl },
    openGraph: {
      type: "article",
      url: canonicalUrl,
      title: post.title,
      description: post.excerpt,
      siteName: siteConfig.name,
      publishedTime: post.date,
      tags: post.tags,
      images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [siteConfig.ogImage],
      creator: siteConfig.author.twitterHandle,
    },
  };
}

export default async function BlogPostPage({ params }: PageProps) {
  const { slug } = await params;
  const post = getPostBySlug(slug);

  if (!post) {
    notFound();
  }

  return <BlogPostClient slug={slug} />;
}
