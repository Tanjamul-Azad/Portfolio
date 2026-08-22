import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { siteConfig } from "@/config";

export const runtime = "nodejs";

// Server-side validation schema
const contactSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please enter a valid email address").max(254),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(5000),
  // Honeypot. Real submissions leave it empty; the field is off-screen and
  // untabbable. Deliberately accepts any string rather than rejecting a
  // non-empty one — a validation error would tell the bot exactly which field
  // tripped. It is checked after parsing and silently absorbed instead.
  website: z.string().max(200).optional(),
});

// Escape user-supplied values before interpolating into the email HTML.
function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Simple in-memory rate limiting (for hobby/small projects)
// For production, use Upstash Redis or similar
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 3; // 3 requests per minute
const RATE_LIMIT_MAX_ENTRIES = 500;
const DEFAULT_RESEND_FROM = "onboarding@resend.dev";

function resolveFromAddress(rawValue?: string): string {
  const candidate = rawValue?.trim();

  if (!candidate) {
    return DEFAULT_RESEND_FROM;
  }

  const lowerCandidate = candidate.toLowerCase();
  // Resend free tier rejects unverified personal domains such as Gmail.
  if (lowerCandidate.includes("@gmail.com")) {
    return DEFAULT_RESEND_FROM;
  }

  return candidate;
}

/**
 * Drops expired entries so the map cannot grow without bound.
 *
 * Done lazily on write rather than from a module-scope `setInterval`: on a
 * serverless runtime that timer re-arms on every cold start, is never cleared,
 * and holds a handle open for a process that may be frozen between requests.
 */
function pruneRateLimits(now: number): void {
  if (rateLimitMap.size < RATE_LIMIT_MAX_ENTRIES) return;
  for (const [key, value] of rateLimitMap) {
    if (now - value.timestamp > RATE_LIMIT_WINDOW * 2) {
      rateLimitMap.delete(key);
    }
  }
}

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  pruneRateLimits(now);

  const record = rateLimitMap.get(ip);

  if (!record || now - record.timestamp > RATE_LIMIT_WINDOW) {
    rateLimitMap.set(ip, { count: 1, timestamp: now });
    return false;
  }

  if (record.count >= MAX_REQUESTS) {
    return true;
  }

  record.count++;
  return false;
}

export async function POST(request: NextRequest) {
  try {
    // Get IP for rate limiting
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0] || 
               request.headers.get("x-real-ip") || 
               "unknown";

    // Check rate limit
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 }
      );
    }

    const body = await request.json();

    // Server-side validation
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      const errors = result.error.issues.map((issue) => issue.message).join(", ");
      return NextResponse.json({ error: errors }, { status: 400 });
    }

    const { name, email, message, website } = result.data;

    // Trap tripped. Return the same success shape a real send produces so the
    // bot gets no signal about why nothing arrived.
    if (website) {
      return NextResponse.json({ success: true, message: "Message received successfully" });
    }

    const safeName = escapeHtml(name);
    const safeEmail = escapeHtml(email);
    const safeMessage = escapeHtml(message);

    const resendApiKey = process.env.RESEND_API_KEY;

    if (!resendApiKey) {
      if (process.env.NODE_ENV === "production") {
        return NextResponse.json(
          { error: "Email service is not configured. Please try again later." },
          { status: 500 }
        );
      }

      // Local development fallback when API key is intentionally absent.
      console.log("[Contact Form] No RESEND_API_KEY set. Message received:", {
        name,
        email,
        message,
        timestamp: new Date().toISOString(),
        ip,
      });

      return NextResponse.json({
        success: true,
        message: "Message received in development mode",
      });
    }

    const resend = new Resend(resendApiKey);
    const fromAddress = resolveFromAddress(process.env.RESEND_FROM_EMAIL);

    const sendResult = await resend.emails.send({
      from: fromAddress,
      to: siteConfig.contact.email,
      replyTo: email,
      subject: `New message from ${name} via Portfolio`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:24px;border:1px solid #e5e7eb;border-radius:8px;">
          <h2 style="margin-top:0;color:#111827;">New Portfolio Contact</h2>
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#6b7280;width:80px;">Name</td><td style="padding:8px 0;font-weight:600;color:#111827;">${safeName}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Email</td><td style="padding:8px 0;"><a href="mailto:${safeEmail}" style="color:#f59e0b;">${safeEmail}</a></td></tr>
          </table>
          <div style="margin-top:16px;padding:16px;background:#f9fafb;border-radius:6px;">
            <p style="margin:0;color:#374151;white-space:pre-wrap;">${safeMessage}</p>
          </div>
          <p style="margin-top:16px;font-size:12px;color:#9ca3af;">Sent from ${siteConfig.url} · IP: ${ip}</p>
        </div>
      `,
    });

    if (sendResult.error) {
      console.error("Contact form resend error:", sendResult.error);
      return NextResponse.json(
        { error: "Email could not be delivered. Please try again." },
        { status: 502 }
      );
    }

    if (!sendResult.data?.id) {
      console.error("Contact form resend missing message id:", sendResult);
      return NextResponse.json(
        { error: "Email service did not confirm delivery. Please try again." },
        { status: 502 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Message received successfully",
    });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred. Please try again." },
      { status: 500 }
    );
  }
}
