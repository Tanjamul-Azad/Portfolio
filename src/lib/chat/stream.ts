/**
 * Turns a provider's server-sent-event stream into a plain stream of answer
 * text, so the route can relay tokens to the browser as they arrive.
 *
 * Two wire formats are handled: OpenAI-compatible chat completions
 * (`choices[0].delta.content`) and Gemini's `streamGenerateContent?alt=sse`
 * (`candidates[0].content.parts[].text`). Reasoning models sometimes put their
 * scratchpad inline in `<think>…</think>`; that is removed here, including
 * when a tag is split across two network chunks.
 */

export type ProviderFormat = "openai" | "google";

function extractText(json: unknown, format: ProviderFormat): string {
  if (!json || typeof json !== "object") return "";
  if (format === "openai") {
    const choices = (json as { choices?: { delta?: { content?: unknown } }[] }).choices;
    const content = choices?.[0]?.delta?.content;
    return typeof content === "string" ? content : "";
  }
  const parts = (json as { candidates?: { content?: { parts?: { text?: unknown }[] } }[] }).candidates?.[0]?.content
    ?.parts;
  return (parts ?? []).map((p) => (typeof p.text === "string" ? p.text : "")).join("");
}

/** Strips `<think>…</think>` from a stream of text fragments. */
export function createThinkFilter() {
  let inThink = false;
  let carry = "";
  const OPEN = "<think>";
  const CLOSE = "</think>";

  return (fragment: string, flush = false): string => {
    let text = carry + fragment;
    carry = "";
    let out = "";

    while (text.length) {
      if (inThink) {
        const end = text.indexOf(CLOSE);
        if (end === -1) {
          // Keep a tail that might be the start of "</think>".
          carry = flush ? "" : text.slice(-(CLOSE.length - 1));
          return out;
        }
        text = text.slice(end + CLOSE.length);
        inThink = false;
      } else {
        const start = text.indexOf(OPEN);
        if (start === -1) {
          if (flush) return out + text;
          // Hold back a possible partial "<think>" at the very end.
          const lt = text.lastIndexOf("<");
          if (lt !== -1 && OPEN.startsWith(text.slice(lt))) {
            carry = text.slice(lt);
            return out + text.slice(0, lt);
          }
          return out + text;
        }
        out += text.slice(0, start);
        text = text.slice(start + OPEN.length);
        inThink = true;
      }
    }
    return out;
  };
}

/**
 * Reads an SSE body and yields answer text fragments (think-blocks removed).
 * Ends on the stream's end or an OpenAI-style `[DONE]` sentinel.
 */
export async function* readAnswerStream(
  body: ReadableStream<Uint8Array>,
  format: ProviderFormat
): AsyncGenerator<string> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  const think = createThinkFilter();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      let newline: number;
      while ((newline = buffer.indexOf("\n")) !== -1) {
        const line = buffer.slice(0, newline).trim();
        buffer = buffer.slice(newline + 1);
        if (!line.startsWith("data:")) continue;
        const data = line.slice(5).trim();
        if (data === "[DONE]") {
          const rest = think("", true);
          if (rest) yield rest;
          return;
        }
        try {
          const text = think(extractText(JSON.parse(data), format));
          if (text) yield text;
        } catch {
          // A malformed keep-alive or partial line: skip it.
        }
      }
    }
    const rest = think("", true);
    if (rest) yield rest;
  } finally {
    reader.releaseLock();
  }
}
