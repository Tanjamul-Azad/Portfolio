export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** Short stable id for new collection entries. */
export function generateId(existing: string[] = []): string {
  const numeric = existing.map((id) => Number.parseInt(id, 10)).filter((n) => Number.isFinite(n));
  if (numeric.length === existing.length && existing.length > 0) {
    return String(Math.max(...numeric) + 1);
  }
  return (
    Date.now().toString(36) + Math.random().toString(36).slice(2, 6)
  );
}
