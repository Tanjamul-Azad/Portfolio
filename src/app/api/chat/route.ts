import { NextRequest, NextResponse } from "next/server";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";
import { techStack } from "@/data/tech-stack";
import { achievements } from "@/data/achievements";
import { nowItems } from "@/data/now";
import { siteConfig } from "@/config";

export const runtime = "nodejs";

// ── Rate limiting ─────────────────────────────────────────────────────────
// Protects the shared LLM API keys from being drained by abuse/spam.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15; // 15 chat messages per minute per IP

// Without a deadline a wedged provider holds the request open until the platform
// kills it, and the remaining fallbacks never get a turn.
const PROVIDER_TIMEOUT_MS = 12_000;

function isRateLimited(ip: string): boolean {
  const now = Date.now();
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

/** Dynamically calculate age from DOB so it increments day by day */
function calculateAge(dob: Date): number {
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const m = today.getMonth() - dob.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
  return age;
}

function buildPortfolioContext(): string {
  const DOB = new Date("2002-12-20");
  const age = calculateAge(DOB);

  // ── PROJECTS: Optimized for token limits ───────────────────────────────
  const allProjects = projects
    .map((p) => {
      return [
        `  PROJECT: ${p.title}${p.featured ? " [Featured]" : ""}`,
        `    Role: ${p.role}`,
        `    Tech: ${p.tags.join(", ")}`,
        `    Impact: ${p.impact}`,
      ].join("\n");
    })
    .join("\n\n");

  // ── EXPERIENCES: Minimal ───────────────────────────────────────────────
  const experienceList = experiences
    .map((e) => `  - ${e.role} at ${e.company} (${e.period})`)
    .join("\n");

  // ── TECH STACK ───────────────────────────────────────────────────────────
  const techSummary = techStack.map((t) => t.name).join(", ");

  // ── ACHIEVEMENTS ────────────────────────────────────────────────────────
  const allAchievements = achievements
    .map((a) => `  - ${a.title} (${a.date})`)
    .join("\n");

  // ── NOW ──────────────────────────────────────────────────────────────────
  const currentlyBuilding = nowItems.find((n) => n.category === "building")?.items.join("; ") || "";
  const lookingFor = nowItems.find((n) => n.category === "looking")?.items.join("; ") || "";

  return `You are the personal AI assistant for Md. Tanzamul Azad (Tonmoy).
Your role is to speak ABOUT him in the third person (he, him, his).
Be warm, professional, and concise. Use real facts from the data below.

IDENTITY:
- Name: Md. Tanzamul Azad (Tonmoy)
- Age: ${age} (DOB: 2002-12-20)
- Background: Full-Stack Developer & ML Researcher at United International University (UIU), Dhaka.
- Key Stats: CGPA 3.78/4.0, 3x UIU Project Show winner.

CONTACT: ${siteConfig.contact.email} | ${siteConfig.contact.whatsapp}
LINKS: GitHub: ${siteConfig.links.github}, LinkedIn: ${siteConfig.links.linkedin}

EXPERIENCE:
${experienceList}

FEATURED PROJECTS:
${allProjects}

TECH STACK: ${techSummary}

ACHIEVEMENTS:
${allAchievements}

CURRENTLY:
- Building: ${currentlyBuilding}
- Open to: ${lookingFor}

RESPONSE STYLE:
- Always use third-person pronouns.
- Keep responses short (under 80 words).
- If you don't know something, point them to ${siteConfig.contact.email} or his resume.
`;
}

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please slow down and try again shortly." },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, history } = body;

    if (!message || typeof message !== "string") {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long. Please keep it under 2000 characters." },
        { status: 400 }
      );
    }

    const historyMessages =
      Array.isArray(history) && history.length > 0
        ? history
            .filter(
              (m: unknown): m is { role?: string; content: string } =>
                typeof m === "object" &&
                m !== null &&
                typeof (m as { content?: unknown }).content === "string" &&
                (m as { content: string }).content.trim().length > 0
            )
            .slice(-8)
            .map((m) => ({
              role: m.role === "user" ? ("user" as const) : ("assistant" as const),
              // History is client-supplied: cap each turn before it reaches a paid provider.
              content: m.content.slice(0, 2000),
            }))
        : [];

    const context = buildPortfolioContext();

    // ── PROVIDER SEQUENCING ────────────────────────────────────────────────
    const providers = [
      {
        // llama-3.3-70b-versatile was retired from Groq and returned 404
        // model_not_found, which silently took the whole assistant down.
        // Verified against the live model list on this account.
        name: "Groq",
        url: "https://api.groq.com/openai/v1/chat/completions",
        key: process.env.GROQ_API_KEY,
        model: "openai/gpt-oss-120b",
        type: "openai",
      },
      {
        name: "Groq (small)",
        url: "https://api.groq.com/openai/v1/chat/completions",
        key: process.env.GROQ_API_KEY,
        model: "openai/gpt-oss-20b",
        type: "openai",
      },
      {
        name: "GLM",
        url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
        key: process.env.GLM_API_KEY,
        model: "glm-4",
        type: "openai",
      },
      {
        name: "Gemini",
        // gemini-1.5-flash on the v1 endpoint has been retired; 2.0-flash on
        // v1beta is the current equivalent. The key moves to a header so it
        // cannot leak through logs or referrers.
        url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent",
        key: process.env.GEMINI_API_KEY,
        model: "gemini-2.0-flash",
        type: "google",
      },
      {
        name: "Deepseek",
        url: "https://api.deepseek.com/chat/completions",
        key: process.env.DEEPSEEK_API_KEY,
        model: "deepseek-chat",
        type: "openai",
      },
    ];

    let lastError = "";
    const providersConfigured = providers.some((p) => Boolean(p.key));

    for (const provider of providers) {
      if (!provider.key) continue;

      try {
        const signal = AbortSignal.timeout(PROVIDER_TIMEOUT_MS);

        let res;
        if (provider.type === "openai") {
          res = await fetch(provider.url, {
            method: "POST",
            signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${provider.key}`,
            },
            body: JSON.stringify({
              model: provider.model,
              messages: [{ role: "system", content: context }, ...historyMessages, { role: "user", content: message }],
              max_tokens: 800,
              temperature: 0.5,
            }),
          });
        } else {
          // Google Gemini format. The conversation is mapped turn by turn — the
          // previous version folded the system prompt into the user message and
          // dropped history entirely, so the Gemini fallback answered every
          // message with no memory of the one before it.
          res = await fetch(provider.url, {
            method: "POST",
            signal,
            headers: {
              "Content-Type": "application/json",
              "x-goog-api-key": provider.key,
            },
            body: JSON.stringify({
              systemInstruction: { parts: [{ text: context }] },
              contents: [
                ...historyMessages.map((m) => ({
                  role: m.role === "user" ? "user" : "model",
                  parts: [{ text: m.content }],
                })),
                { role: "user", parts: [{ text: message }] },
              ],
              generationConfig: { maxOutputTokens: 400, temperature: 0.5 },
            }),
          });
        }

        if (!res.ok) {
          const errText = await res.text();
          console.warn(`[Chat API] ${provider.name} failed (${res.status}):`, errText);
          lastError = `${provider.name}: ${res.status}`;
          continue; // Try next provider
        }

        const data = await res.json();
        let rawResponse = "";

        if (provider.type === "openai") {
          rawResponse = data.choices?.[0]?.message?.content ?? "";
        } else {
          rawResponse = data.candidates?.[0]?.content?.parts?.[0]?.text ?? "";
        }

        if (!rawResponse) continue;

        // SANITIZATION
        const response = rawResponse
          // Reasoning models sometimes emit their scratchpad inline.
          .replace(/<think>[\s\S]*?<\/think>/gi, "")
          .replace(/<think>[\s\S]*$/i, "")
          .replace(/^(Assistant:|AI:|Bot:)\s*/i, "")
          .replace(/\*\*(.*?)\*\*/g, "$1")
          .replace(/\*(.*?)\*/g, "$1")
          .replace(/`([^`]+)`/g, "$1")
          .replace(/^#{1,6}\s+/gm, "")
          .replace(/^[-*+]\s+/gm, "• ")
          .trim();

        return NextResponse.json({ response });
      } catch (err) {
        const errMessage = err instanceof Error ? err.message : String(err);
        console.error(`[Chat API] ${provider.name} critical error:`, errMessage);
        lastError = errMessage;
        continue;
      }
    }

    // The browser gets a generic message. Provider names and status codes stay in
    // the server log, where they belong — they were previously echoed to the client.
    console.error("[Chat API] All providers failed. Last error:", lastError || "none configured");
    return NextResponse.json(
      {
        error: "The assistant is unavailable right now. Please try again shortly.",
        code: providersConfigured ? "upstream_unavailable" : "not_configured",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Chat API Critical Error:", error);
    return NextResponse.json({ error: "Failed to process request" }, { status: 500 });
  }
}
