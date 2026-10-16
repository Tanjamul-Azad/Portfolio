import { NextResponse } from "next/server";
import { siteConfig } from "@/config";
import { parseContributionCalendar } from "@/lib/github-contributions";
import type { GitHubActivity } from "@/types/github";

export const revalidate = 900;

export async function GET() {
  const username = new URL(siteConfig.links.github).pathname.split("/").filter(Boolean)[0];
  if (!username || !/^[a-z\d-]+$/i.test(username)) {
    return NextResponse.json({ error: "GitHub profile is not configured" }, { status: 503 });
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Tanzamul-Azad-Portfolio",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const [calendar, profile] = await Promise.allSettled([
    fetch(`https://github.com/users/${username}/contributions`, {
      headers: { Accept: "text/html", "User-Agent": headers["User-Agent"] },
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8000),
    }).then(async (response) => {
      if (!response.ok) throw new Error("GitHub calendar request failed");
      return parseContributionCalendar(await response.text());
    }),
    fetch(`https://api.github.com/users/${username}`, {
      headers,
      next: { revalidate: 900 },
      signal: AbortSignal.timeout(8000),
    }).then(async (response) => {
      if (!response.ok) throw new Error("GitHub profile request failed");
      const data = await response.json();
      if (!Number.isInteger(data.public_repos)) {
        throw new Error("GitHub profile is unavailable");
      }
      return { repositories: data.public_repos as number };
    }),
  ]);

  if (calendar.status === "rejected" && profile.status === "rejected") {
    return NextResponse.json({ error: "GitHub activity is temporarily unavailable" }, { status: 503 });
  }

  const activity: GitHubActivity = {
    username,
    profileUrl: `https://github.com/${username}`,
    calendar: calendar.status === "fulfilled" ? calendar.value : null,
    repositories: profile.status === "fulfilled" ? profile.value.repositories : null,
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json(activity);
}
