import { siteConfig } from "@/config";
import { blogPosts, projects } from "@/data";

export const dynamic = "force-static";

/**
 * llms.txt (https://llmstxt.org): a plain-Markdown map of the site for AI
 * search engines, built from the same data as the pages so it never drifts.
 */
export function GET() {
  const { author, links, url } = siteConfig;
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const body = [
    `# ${author.name}`,
    "",
    `> ${siteConfig.description}`,
    "",
    `${author.name} (also written ${["Md. Tanzamul Azad", ...(author.alternateNames ?? [])]
      .filter((name, i, all) => name !== author.name && all.indexOf(name) === i)
      .join(", ")}) is a ${author.role} based in ${author.location}. ${url} is the official portfolio.`,
    "",
    "## Profiles",
    "",
    `- [Portfolio](${url})`,
    `- [GitHub](${links.github})`,
    `- [LinkedIn](${links.linkedin})`,
    `- [X](${links.twitter})`,
    `- [Resume (PDF)](${new URL(links.resume, url)})`,
    "",
    "## Projects",
    "",
    ...projects.map((p) => `- [${p.title}](${url}/projects/${p.slug}): ${p.description}`),
    "",
    "## Writing",
    "",
    ...posts.map((p) => `- [${p.title}](${url}/blog/${p.slug}): ${p.excerpt}`),
    "",
  ].join("\n");

  return new Response(body, {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
