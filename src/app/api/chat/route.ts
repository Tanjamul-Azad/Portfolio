import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

// Portfolio context for the AI
const PORTFOLIO_CONTEXT = `
You are an AI assistant for Tanjamul's portfolio website. You help visitors learn about Tanjamul and his work.

ABOUT TANJAMUL:
- Name: Tanjamul
- Role: Frontend Developer
- Location: Bangladesh
- Experience: 3+ years in web development
- Projects Completed: 40+
- Hours Worked: 10,000+
- Email: i.m.tanjamul@gmail.com
- GitHub: https://github.com/Tanjamul-Azad
- LinkedIn: https://linkedin.com/in/tanjamul

TECH STACK & SKILLS:
- Frontend: React, TypeScript, Next.js, Tailwind CSS, Framer Motion
- Backend: Node.js, Express
- Databases: PostgreSQL, MongoDB
- Tools: Docker, Git, VS Code
- Specializes in creating seamless user experiences and pixel-perfect designs

WORK EXPERIENCE:
1. Senior Frontend Engineer at Tech Solutions Ltd. (2022 - Present)
   - Led migration of legacy codebase to React 18 and TypeScript
   - Optimized core web vitals with 30% improvement in LCP
   - Mentored junior engineers and established UI best practices

2. Frontend Developer at Creative Agency (2020 - 2022)
   - Developed custom e-commerce solutions for various brands
   - Implemented responsive designs with pixel-perfect accuracy
   - Collaborated with designers for exceptional UX

FEATURED PROJECTS:
1. Nova Dashboard - SaaS analytics dashboard with real-time data visualization
2. EcoSphere - Carbon footprint tracking platform (10k+ users)
3. Flux Payment - Payment processing with multi-currency support

GUIDELINES:
- Be friendly, professional, and concise
- For hiring inquiries, encourage them to email i.m.tanjamul@gmail.com
- Stay focused on Tanjamul and web development topics
`;

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message } = body;

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
    
    // Use gemini-pro model
    const model = genAI.getGenerativeModel({ 
      model: "gemini-pro",
    });

    // Simple prompt-based approach (more reliable than chat)
    const prompt = `${PORTFOLIO_CONTEXT}

User Question: ${message}

Please provide a helpful, friendly, and concise response about Tanjamul or web development:`;

    const result = await model.generateContent(prompt);
    const response = result.response.text();

    return NextResponse.json({ response });
  } catch (error) {
    console.error("Chat API Error:", error);
    
    // Return a more specific error message
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    
    return NextResponse.json(
      { error: `Failed to generate response: ${errorMessage}` },
      { status: 500 }
    );
  }
}
