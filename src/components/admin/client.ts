// Client-side helpers for talking to the admin API. Safe to import in client
// components (plain fetch only — no server modules).

async function readError(res: Response): Promise<string> {
  try {
    const j = await res.json();
    return j.error || `Request failed (${res.status})`;
  } catch {
    return `Request failed (${res.status})`;
  }
}

export async function fetchContent<T>(type: string): Promise<T> {
  const res = await fetch(`/api/admin/content/${type}`, { cache: "no-store" });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()).data as T;
}

export async function saveContent(type: string, data: unknown): Promise<void> {
  const res = await fetch(`/api/admin/content/${type}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error(await readError(res));
}

export async function uploadFile(file: File, folder: string): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  fd.append("folder", folder);
  const res = await fetch("/api/admin/upload", { method: "POST", body: fd });
  if (!res.ok) throw new Error(await readError(res));
  return (await res.json()).path as string;
}

export async function adminLogin(password: string): Promise<void> {
  const res = await fetch("/api/admin/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!res.ok) throw new Error(await readError(res));
}

export async function adminLogout(): Promise<void> {
  await fetch("/api/admin/logout", { method: "POST" });
}
