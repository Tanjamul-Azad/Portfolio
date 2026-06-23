import { NextRequest, NextResponse } from "next/server";

// Single, reliable gate for the editor (Next 16 "proxy" convention — formerly
// "middleware"). Runs before any route renders, so it can return a real 404 /
// redirect (layout-level notFound()/redirect() can't, because the HTTP status is
// already flushed mid-stream).
//
//   1. Production (any non-development runtime, incl. Vercel): every /admin and
//      /api/admin route 404s — the editor is never exposed on the live site.
//   2. Development: routes require the signed session cookie, except the login
//      page and the login/logout endpoints.

const COOKIE = "admin_session";

function getSecret(): string {
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

  // 1. Disabled entirely outside local development.
  if (process.env.NODE_ENV !== "development") {
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
