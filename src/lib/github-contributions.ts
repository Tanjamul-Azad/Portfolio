import type { ContributionDay } from "@/types/github";

function attributes(tag: string): Record<string, string> {
  return Object.fromEntries(
    Array.from(tag.matchAll(/([\w-]+)="([^"]*)"/g), (match) => [match[1], match[2]])
  );
}

/** Read GitHub's public calendar without embedding third-party HTML or scripts. */
export function parseContributionCalendar(html: string) {
  const counts = new Map<string, number>();
  for (const match of html.matchAll(/<tool-tip\b([^>]*)>([\s\S]*?)<\/tool-tip>/g)) {
    const id = attributes(match[1]).for;
    const text = match[2].replace(/<[^>]*>/g, "").trim();
    const count = text.match(/^(No|[\d,]+) contributions?\b/);
    if (id && count) counts.set(id, count[1] === "No" ? 0 : Number(count[1].replaceAll(",", "")));
  }

  const days: ContributionDay[] = [];
  for (const match of html.matchAll(/<td\b[^>]*>/g)) {
    const attr = attributes(match[0]);
    if (!attr["data-date"]) continue;
    const date = attr["data-date"];
    const level = Number(attr["data-level"]);
    const count = counts.get(attr.id);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !Number.isInteger(level) || level < 0 || level > 4 || count === undefined) {
      throw new Error("GitHub calendar format changed");
    }
    days.push({ date, level, count });
  }

  if (days.length === 0) throw new Error("GitHub calendar is unavailable");
  days.sort((a, b) => a.date.localeCompare(b.date));
  return { days, total: days.reduce((total, day) => total + day.count, 0) };
}
