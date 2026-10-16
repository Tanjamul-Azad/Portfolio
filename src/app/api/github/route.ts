import { NextResponse } from "next/server";
import { siteConfig } from "@/config";
import { getContributionRange, mergeContributionCalendars, parseContributionCalendar } from "@/lib/github-contributions";
import type { GitHubActivity } from "@/types/github";

// Run on every request so the contribution calendar never waits for ISR.
export const revalidate = 0;

const responseHeaders = {
  "Cache-Control": "private, no-store, max-age=0",
  "CDN-Cache-Control": "no-store",
  "Vercel-CDN-Cache-Control": "no-store",
};

export async function GET() {
  const username = new URL(siteConfig.links.github).pathname.split("/").filter(Boolean)[0];
  if (!username || !/^[a-z\d-]+$/i.test(username)) {
    return NextResponse.json({ error: "GitHub profile is not configured" }, { status: 503, headers: responseHeaders });
  }

  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "Tanzamul-Azad-Portfolio",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  const range = getContributionRange(new Date());

  const [calendar, profile] = await Promise.allSettled([
    // Explicit yearly calendars include today's local-date commits even when
    // GitHub's anonymous rolling calendar still stops at yesterday in UTC.
    Promise.all(range.years.map(async (year) => {
      const response = await fetch(`https://github.com/users/${username}/contributions?from=${year}-01-01&to=${year}-12-31`, {
        headers: { Accept: "text/html", "User-Agent": headers["User-Agent"], "Cache-Control": "no-cache" },
        cache: "no-store",
        signal: AbortSignal.timeout(8000),
      });
      if (!response.ok) throw new Error("GitHub calendar request failed");
      return parseContributionCalendar(await response.text());
    })).then((calendars) => mergeContributionCalendars(calendars, range)),
    fetch(`https://api.github.com/users/${username}`, {
      headers,
      // Only repository metadata is cached, to protect the unauthenticated
      // REST rate limit. The contribution calendar above is always fresh.
      next: { revalidate: 300 },
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
    return NextResponse.json({ error: "GitHub activity is temporarily unavailable" }, { status: 503, headers: responseHeaders });
  }

  const activity: GitHubActivity = {
    username,
    profileUrl: `https://github.com/${username}`,
    calendar: calendar.status === "fulfilled" ? calendar.value : null,
    repositories: profile.status === "fulfilled" ? profile.value.repositories : null,
    updatedAt: new Date().toISOString(),
  };
  return NextResponse.json(activity, { headers: responseHeaders });
}
