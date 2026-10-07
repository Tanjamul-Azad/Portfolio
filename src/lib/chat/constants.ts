/**
 * Shared by the chat route and the chat panel. Kept free of imports so the
 * client bundle does not pull in the content files the prompt is built from.
 */

/**
 * The marker the model puts before its suggested follow-up questions. A
 * single unusual character, so the panel can hide it the moment it appears in
 * the stream instead of flashing a half-written label.
 */
export const FOLLOW_UP_MARKER = "§";

/** Splits a raw answer into the visible text and its suggested follow-ups. */
export function splitFollowUps(raw: string): { text: string; followUps: string[] } {
  const at = raw.indexOf(FOLLOW_UP_MARKER);
  if (at === -1) return { text: raw.trimEnd(), followUps: [] };
  const followUps = raw
    .slice(at + FOLLOW_UP_MARKER.length)
    .split("|")
    .map((q) => q.trim().replace(/^["'“”]+|["'“”]+$/g, ""))
    .filter((q) => q.length > 2 && q.length < 90)
    .slice(0, 3);
  return { text: raw.slice(0, at).trimEnd(), followUps };
}
