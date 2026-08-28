import { NextRequest, NextResponse } from "next/server";

// Single, reliable gate for the editor (Next 16 "proxy" convention — formerly
// "middleware"). Runs before any route renders, so it can return a real 404 /
// redirect (layout-level notFound()/redirect() can't, because the HTTP status is
// already flushed mid-stream).
//
//   1. The editor is off unless configured: always available locally, and in
//      production only when ADMIN_PASSWORD, ADMIN_SESSION_SECRET and
//      GITHUB_TOKEN are all set. Otherwise every /admin route 404s.
//   2. When enabled, routes require the signed session cookie, except the login
//      page and the login/logout endpoints.

const COOKIE = "admin_session";

function getSecret(): string {
  // Must match src/lib/admin/auth.ts. Production always has an explicit secret,
  // because the gate above refuses to enable the editor without one.
  return (
    process.env.ADMIN_SESSION_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "insecure-dev-secret-change-me"
  );
}

function bufToBase64Url(buf: ArrayBuffer): string {
  let binary = "";
  for (const byte of new Uint8Array(buf)) binary += String.fromCharCode(byte);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function base64UrlToString(value: string): string {
  const b64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = b64 + "=".repeat((4 - (b64.length % 4)) % 4);
  return atob(padded);
}

async function verifySession(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return false;

  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const mac = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  if (bufToBase64Url(mac) !== sig) return false;

  try {
    const { exp } = JSON.parse(base64UrlToString(payload));
    return typeof exp === "number" && exp > Date.now();
  } catch {
    return false;
  }
}

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1. Disabled unless the editor is deliberately configured.
  //    Locally it is always on. In production every piece must be present —
  //    password, a session secret distinct from it, and a GitHub token — or the
  //    routes 404. This mirrors isAdminEnabled(); it is duplicated rather than
  //    imported because the proxy runs on the edge runtime, where the Node-only
  //    crypto import in that module is unavailable.
  const enabled =
    process.env.NODE_ENV === "development" ||
    Boolean(
      process.env.ADMIN_PASSWORD &&
        process.env.ADMIN_SESSION_SECRET &&
        process.env.GITHUB_TOKEN
    );

  if (!enabled) {
    return new NextResponse(null, { status: 404 });
  }

  // 2. Let the login surfaces through unauthenticated.
  if (
    pathname === "/admin/login" ||
    pathname === "/api/admin/login" ||
    pathname === "/api/admin/logout"
  ) {
    return NextResponse.next();
  }

  // 3. Everything else under /admin requires a valid session.
  if (await verifySession(req.cookies.get(COOKIE)?.value)) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const loginUrl = req.nextUrl.clone();
  loginUrl.pathname = "/admin/login";
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};
