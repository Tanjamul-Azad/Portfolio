import { siteConfig } from "@/config";

/** Describes the visible archive, without implying a Google rich-result feature. */
export function CollectionSchema({ path, name, items, offset = 0 }: {
  path: string;
  name: string;
  items: { title: string; slug: string }[];
  offset?: number;
}) {
  const url = siteConfig.url + path;
  const prefix = path.startsWith("/projects") ? "/projects/" : "/blog/";
  const graph = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": url + "#collection",
    url, name,
    isPartOf: { "@id": siteConfig.url + "/#website" },
    about: { "@id": siteConfig.url + "/#person" },
    mainEntity: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem", position: offset + index + 1,
        name: item.title, url: siteConfig.url + prefix + item.slug,
      })),
    },
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(graph).replace(/</g, "\\u003c") }} />;
}
