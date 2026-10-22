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
    title: `${post.title} | Tanzamul Azad`,
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
      modifiedTime: post.updatedAt || post.date,
      tags: post.tags,
      authors: [siteConfig.url],
      images: [{ url: post.image ? new URL(post.image, siteConfig.url).toString() : siteConfig.ogImage, alt: post.imageAlt || post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.excerpt,
      images: [post.image ? new URL(post.image, siteConfig.url).toString() : siteConfig.ogImage],
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

  const url = `${siteConfig.url}/blog/${post.slug}`;
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({
      "@context": "https://schema.org",
      "@graph": [
        {
          "@type": "BlogPosting", "@id": `${url}#article`, url,
          headline: post.title, description: post.excerpt,
          datePublished: `${post.date}T00:00:00+06:00`,
          dateModified: `${post.updatedAt || post.date}T00:00:00+06:00`,
          image: [post.image ? new URL(post.image, siteConfig.url).toString() : siteConfig.ogImage], inLanguage: "en",
          author: { "@type": "Person", "@id": `${siteConfig.url}/#person`, name: siteConfig.author.name, url: siteConfig.url },
          publisher: { "@id": `${siteConfig.url}/#person` },
          mainEntityOfPage: { "@type": "WebPage", "@id": url },
          keywords: post.tags.join(", "),
        },
        {
          "@type": "BreadcrumbList", itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteConfig.url },
            { "@type": "ListItem", position: 2, name: "Blog", item: `${siteConfig.url}/blog` },
            { "@type": "ListItem", position: 3, name: post.title, item: url },
          ],
        },
      ],
    }).replace(/</g, "\\u003c") }} />
    <BlogPostClient slug={slug} />
  </>;
}
