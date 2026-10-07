import { NextRequest, NextResponse } from "next/server";
import { buildSystemPrompt } from "@/lib/chat/knowledge";
import { readAnswerStream, type ProviderFormat } from "@/lib/chat/stream";

export const runtime = "nodejs";
// Streaming answers stay open for a few seconds; give them room.
export const maxDuration = 30;

// ── Rate limiting ─────────────────────────────────────────────────────────
// Protects the shared LLM API keys from being drained by abuse/spam.
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 15; // 15 chat messages per minute per IP

// How long a provider gets to produce its first token before the next one is
// tried, and the hard cap on a whole answer once it is streaming.
const FIRST_TOKEN_TIMEOUT_MS = 15_000;
const ANSWER_TIMEOUT_MS = 45_000;

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

interface Provider {
  name: string;
  url: string;
  key: string | undefined;
  model: string;
  format: ProviderFormat;
}

function getProviders(): Provider[] {
  const providers: Provider[] = [
    {
      // llama-3.3-70b-versatile was retired from Groq and returned 404
      // model_not_found, which silently took the whole assistant down.
      name: "Groq",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: process.env.GROQ_API_KEY,
      model: "openai/gpt-oss-120b",
      format: "openai",
    },
    {
      name: "Groq (small)",
      url: "https://api.groq.com/openai/v1/chat/completions",
      key: process.env.GROQ_API_KEY,
      model: "openai/gpt-oss-20b",
      format: "openai",
    },
    {
      name: "GLM",
      url: "https://open.bigmodel.cn/api/paas/v4/chat/completions",
      key: process.env.GLM_API_KEY,
      model: "glm-4",
      format: "openai",
    },
    {
      name: "Gemini",
      // The key travels in a header so it cannot leak through logs or referrers.
      url: "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:streamGenerateContent?alt=sse",
      key: process.env.GEMINI_API_KEY,
      model: "gemini-2.0-flash",
      format: "google",
    },
    {
      name: "Deepseek",
      url: "https://api.deepseek.com/chat/completions",
      key: process.env.DEEPSEEK_API_KEY,
      model: "deepseek-chat",
      format: "openai",
    },
  ];

  // Local testing only: point the assistant at any OpenAI-compatible endpoint
  // (a mock server, Ollama, LM Studio). Never consulted in production.
  if (process.env.NODE_ENV !== "production" && process.env.CHAT_MOCK_URL) {
    providers.unshift({
      name: "Local",
      url: process.env.CHAT_MOCK_URL,
      key: process.env.CHAT_MOCK_KEY || "local",
      model: process.env.CHAT_MOCK_MODEL || "local",
      format: "openai",
    });
  }

  return providers;
}

type Turn = { role: "user" | "assistant"; content: string };

function providerRequest(provider: Provider, system: string, turns: Turn[], signal: AbortSignal) {
  if (provider.format === "openai") {
    return fetch(provider.url, {
      method: "POST",
      signal,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${provider.key}`,
      },
      body: JSON.stringify({
        model: provider.model,
        messages: [{ role: "system", content: system }, ...turns],
        max_tokens: 900,
        temperature: 0.4,
        stream: true,
      }),
    });
  }

  // Gemini: the conversation is mapped turn by turn, with the system prompt
  // as a proper system instruction.
  return fetch(provider.url, {
    method: "POST",
    signal,
    headers: {
      "Content-Type": "application/json",
      "x-goog-api-key": provider.key ?? "",
    },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: turns.map((t) => ({
        role: t.role === "user" ? "user" : "model",
        parts: [{ text: t.content }],
      })),
      generationConfig: { maxOutputTokens: 700, temperature: 0.4 },
    }),
  });
}

/** Strips a role prefix some models add to the very start of an answer. */
const stripLeadingRole = (s: string) => s.replace(/^\s*(Assistant:|AI:|Bot:)\s*/i, "");

export async function POST(request: NextRequest) {
  try {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
      request.headers.get("x-real-ip") ||
      "unknown";

    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Too many messages. Please slow down and try again shortly.", code: "rate_limited" },
        { status: 429 }
      );
    }

    const body = await request.json();
    const { message, history } = body ?? {};

    if (!message || typeof message !== "string" || !message.trim()) {
      return NextResponse.json({ error: "Message is required", code: "bad_request" }, { status: 400 });
    }

    if (message.length > 2000) {
      return NextResponse.json(
        { error: "Message is too long. Please keep it under 2000 characters.", code: "too_long" },
        { status: 400 }
      );
    }

    const historyTurns: Turn[] = Array.isArray(history)
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

    const turns: Turn[] = [...historyTurns, { role: "user", content: message }];
    const system = buildSystemPrompt();
    const providers = getProviders().filter((p) => Boolean(p.key));
    let lastError = "";

    for (const provider of providers) {
      const controller = new AbortController();
      let timer = setTimeout(() => controller.abort(), FIRST_TOKEN_TIMEOUT_MS);

      try {
        const res = await providerRequest(provider, system, turns, controller.signal);
        if (!res.ok || !res.body) {
          const errText = await res.text().catch(() => "");
          console.warn(`[Chat API] ${provider.name} failed (${res.status}):`, errText.slice(0, 300));
          lastError = `${provider.name}: ${res.status}`;
          clearTimeout(timer);
          continue;
        }

        // Wait for the first real token before committing to this provider, so
        // one that connects and then says nothing still falls through to the next.
        const fragments = readAnswerStream(res.body, provider.format);
        let first = "";
        while (!first) {
          const next = await fragments.next();
          if (next.done) break;
          first = stripLeadingRole(next.value);
        }
        if (!first) {
          lastError = `${provider.name}: empty`;
          clearTimeout(timer);
          continue;
        }

        clearTimeout(timer);
        timer = setTimeout(() => controller.abort(), ANSWER_TIMEOUT_MS);
        const encoder = new TextEncoder();

        const stream = new ReadableStream<Uint8Array>({
          start(c) {
            c.enqueue(encoder.encode(first));
          },
          async pull(c) {
            try {
              const next = await fragments.next();
              if (next.done) {
                clearTimeout(timer);
                c.close();
              } else {
                c.enqueue(encoder.encode(next.value));
              }
            } catch (err) {
              clearTimeout(timer);
              console.error(`[Chat API] ${provider.name} stream error:`, err instanceof Error ? err.message : err);
              c.close();
            }
          },
          cancel() {
            // The visitor pressed stop or closed the panel: stop paying for tokens.
            clearTimeout(timer);
            controller.abort();
          },
        });

        return new Response(stream, {
          headers: {
            "Content-Type": "text/plain; charset=utf-8",
            "Cache-Control": "no-store",
            "X-Accel-Buffering": "no",
          },
        });
      } catch (err) {
        clearTimeout(timer);
        const errMessage = err instanceof Error ? err.message : String(err);
        console.error(`[Chat API] ${provider.name} error:`, errMessage);
        lastError = errMessage;
      }
    }

    // The browser gets a stable code. Provider names and status codes stay in
    // the server log.
    console.error("[Chat API] All providers failed. Last error:", lastError || "none configured");
    return NextResponse.json(
      {
        error: "The assistant is unavailable right now. Please try again shortly.",
        code: providers.length > 0 ? "upstream_unavailable" : "not_configured",
      },
      { status: 503 }
    );
  } catch (error) {
    console.error("Chat API Critical Error:", error);
    return NextResponse.json({ error: "Failed to process request", code: "unknown" }, { status: 500 });
  }
}
