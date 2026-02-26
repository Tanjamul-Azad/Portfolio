import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { projects } from "@/data/projects";
import { experiences } from "@/data/experiences";
import { techStack } from "@/data/tech-stack";
import { achievements } from "@/data/achievements";
import { nowItems } from "@/data/now";
import { siteConfig } from "@/config";

function buildPortfolioContext(): string {
  const featuredProjects = projects.filter((p) => p.featured);
  const projectsList = featuredProjects
    .map((p) => `  - ${p.title}: ${p.description} (Role: ${p.role}, Impact: ${p.impact})`)
    .join("\n");

  const experienceList = experiences
    .map(
      (e) =>
        `  - ${e.role} at ${e.company} (${e.period}):\n` +
        e.description.map((d) => `      • ${d}`).join("\n")
    )
    .join("\n");

  const techByCategory = {
    frontend: techStack.filter((t) => t.category === "frontend").map((t) => t.name).join(", "),
    backend: techStack.filter((t) => t.category === "backend").map((t) => t.name).join(", "),
    database: techStack.filter((t) => t.category === "database").map((t) => t.name).join(", "),
    tools: techStack.filter((t) => t.category === "tools").map((t) => t.name).join(", "),
  };

  const certifications = achievements
    .filter((a) => a.type === "certification" || a.type === "award")
    .map((a) => `  - ${a.title} by ${a.issuer} (${a.date}): ${a.description}`)
    .join("\n");

  const currentlyBuilding = nowItems.find((n) => n.category === "building")?.items.join(", ") || "";
  const currentlyLearning = nowItems.find((n) => n.category === "learning")?.items.join(", ") || "";
  const lookingFor = nowItems.find((n) => n.category === "looking")?.items.join(", ") || "";

  return `
You are an AI assistant embedded in ${siteConfig.author.name}'s personal portfolio website.
Your job is to help visitors learn about ${siteConfig.author.name} — his skills, projects, experience, and how to hire him.
Always be friendly, professional, and concise. Never fabricate information.

--- ABOUT ---
Name: ${siteConfig.author.name}
Role: ${siteConfig.author.role}
Location: ${siteConfig.author.location}
Email: ${siteConfig.contact.email}
GitHub: ${siteConfig.links.github}
LinkedIn: ${siteConfig.links.linkedin}
Website: ${siteConfig.url}

--- TECH STACK ---
Frontend: ${techByCategory.frontend}
Backend: ${techByCategory.backend}
Databases: ${techByCategory.database}
Tools & DevOps: ${techByCategory.tools}

--- WORK EXPERIENCE ---
${experienceList}

--- FEATURED PROJECTS ---
${projectsList}

--- CERTIFICATIONS & AWARDS ---
${certifications}

--- CURRENTLY ---
Building: ${currentlyBuilding}
Learning: ${currentlyLearning}
Looking for: ${lookingFor}

--- RESPONSE RULES ---
- Write in plain conversational text only. No markdown. No asterisks. No bullet symbols. No headers.
- Use short natural sentences. If listing things, separate them with commas or "and".
- Keep responses under 120 words unless a detailed explanation is explicitly requested.
- For hiring or project inquiries, direct them to email ${siteConfig.contact.email}
- Stay on topic: ${siteConfig.author.name}, his work, and web/AI development.
- Never invent projects, experiences, or skills not listed above.
- Never start your response with "Assistant:" or any similar prefix.
`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, history } = body;

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "AI service not configured" },
        { status: 500 }
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      generationConfig: {
        maxOutputTokens: 512,
        temperature: 0.7,
      },
    });

    // Build conversation history context
    const historyContext =
      Array.isArray(history) && history.length > 0
        ? history
            .slice(-6) // last 3 turns
            .map((m: { role: string; content: string }) =>
              `${m.role === "user" ? "User" : "Assistant"}: ${m.content}`
            )
            .join("\n")
        : "";

    const prompt = `${buildPortfolioContext()}
${
  historyContext
    ? `--- CONVERSATION HISTORY ---\n${historyContext}\n`
    : ""
}
Visitor: ${message}`;

    const result = await model.generateContent(prompt);
    const rawResponse = result.response.text();

    // Strip any leaked role prefixes Gemini occasionally outputs
    const response = rawResponse
      .replace(/^(Assistant:|AI:|Bot:)\s*/i, "")
      .trim();

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API Error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";

    // Surface quota/rate-limit errors clearly so the user knows what's wrong
    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("Too Many Requests")) {
      return NextResponse.json(
        { error: "quota_exceeded" },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Failed to generate response: ${errorMessage}` },
      { status: 500 }
    );
  }
}
