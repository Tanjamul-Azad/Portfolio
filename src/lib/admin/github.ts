/**
 * Commits files to GitHub through the contents API.
 *
 * The deployed site runs on a read-only, ephemeral filesystem, and the content
 * JSON is imported at build time anyway — so writing a file at runtime could
 * neither persist nor change what the pages render. Committing instead makes the
 * repository the single source of truth and lets the existing deploy hook
 * rebuild, which is what actually publishes the change.
 */

const API = "https://api.github.com";


export interface GitHubConfig {
  token: string;
  owner: string;
  repo: string;
  branch: string;
}

export function getGitHubConfig(): GitHubConfig | null {
  const token = process.env.GITHUB_TOKEN;
  if (!token) return null;
  return {
    token,
    owner: process.env.GITHUB_OWNER || "Tanjamul-Azad",
    repo: process.env.GITHUB_REPO || "Portfolio",
    branch: process.env.GITHUB_BRANCH || "main",
  };
}

/** Read failures are almost always a token problem; say so rather than a number. */
function readFailureMessage(status: number): string {
  if (status === 401 || status === 403) {
    return "GitHub rejected the token. Check GITHUB_TOKEN and that it has Contents: Read and write on this repository.";
  }
  if (status === 404) {
    return "Repository or branch not found. Check GITHUB_OWNER, GITHUB_REPO and GITHUB_BRANCH.";
  }
  return `Could not reach GitHub (${status}). Please try again.`;
}

function headers(cfg: GitHubConfig) {
  return {
    Authorization: `Bearer ${cfg.token}`,
    Accept: "application/vnd.github+json",
    "X-GitHub-Api-Version": "2022-11-28",
    "Content-Type": "application/json",
  };
}

/** The blob SHA GitHub needs to accept an update, or null when the file is new. */
async function getFileSha(cfg: GitHubConfig, path: string): Promise<string | null> {
  const url = `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURI(path)}?ref=${cfg.branch}`;
  const res = await fetch(url, {
    headers: headers(cfg),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(readFailureMessage(res.status));
  const data = (await res.json()) as { sha?: string };
  return data.sha ?? null;
}

/** Reads a file's decoded contents, or null when it does not exist. */
export async function readFileFromGitHub(
  cfg: GitHubConfig,
  path: string
): Promise<string | null> {
  const url = `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURI(path)}?ref=${cfg.branch}`;
  const res = await fetch(url, {
    headers: headers(cfg),
    cache: "no-store",
    signal: AbortSignal.timeout(15_000),
  });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(readFailureMessage(res.status));
  const data = (await res.json()) as { content?: string; encoding?: string };
  if (!data.content) return null;
  return Buffer.from(data.content, "base64").toString("utf8");
}

/**
 * Creates or updates one file on the configured branch.
 *
 * `contentBase64` is passed already encoded so binary uploads and text edits use
 * the same path without a second round of conversion.
 */
export async function commitFile(
  cfg: GitHubConfig,
  {
    path,
    contentBase64,
    message,
  }: { path: string; contentBase64: string; message: string }
): Promise<{ commitUrl: string | null }> {
  const sha = await getFileSha(cfg, path);

  const res = await fetch(
    `${API}/repos/${cfg.owner}/${cfg.repo}/contents/${encodeURI(path)}`,
    {
      method: "PUT",
      headers: headers(cfg),
      signal: AbortSignal.timeout(20_000),
      body: JSON.stringify({
        message,
        content: contentBase64,
        branch: cfg.branch,
        ...(sha ? { sha } : {}),
      }),
    }
  );

  if (!res.ok) {
    const detail = await res.text();
    // Surface the status but not the token or the raw body, which can echo config.
    console.error(`[admin] GitHub commit failed (${res.status}):`, detail.slice(0, 400));
    if (res.status === 409) {
      throw new Error("The file changed on GitHub since this page loaded. Reload and try again.");
    }
    if (res.status === 401 || res.status === 403) {
      throw new Error("GitHub rejected the token. Check GITHUB_TOKEN and its repository permissions.");
    }
    throw new Error("Could not save to GitHub. Please try again.");
  }

  const data = (await res.json()) as { commit?: { html_url?: string } };
  return { commitUrl: data.commit?.html_url ?? null };
}
