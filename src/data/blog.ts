import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "how-i-built-my-nextjs-portfolio",
    title: "How I Built My Next.js Portfolio",
    excerpt: "A deep dive into creating a modern, performant portfolio with Next.js 14, Framer Motion, and Tailwind CSS.",
    content: `
# How I Built My Next.js Portfolio

Building a portfolio that stands out is crucial for any developer. Here's how I approached creating mine with modern technologies.

## The Tech Stack

I chose **Next.js 14** with the App Router for its excellent performance and developer experience. Combined with **Tailwind CSS** for styling and **Framer Motion** for animations, it creates a perfect foundation.

## Key Decisions

### 1. App Router vs Pages Router
The App Router's server components allow for better performance and SEO. I use client components only where interactivity is needed.

### 2. Animation Strategy
Rather than animating everything, I focused on meaningful micro-interactions:
- Smooth page transitions
- Hover states that provide feedback
- Scroll-triggered reveals for content sections

### 3. Performance First
- Images optimized with next/image
- Fonts loaded with next/font
- Critical CSS inlined automatically

## Lessons Learned

1. **Start with content**: Design follows content, not the other way around
2. **Test on real devices**: Animations that look smooth on desktop might lag on mobile
3. **Accessibility matters**: Every animation has reduced-motion alternatives

## Results

The final portfolio loads in under 1 second and scores 95+ on all Lighthouse metrics. Most importantly, it effectively showcases my work and personality.

---

*Want to build something similar? Feel free to reach out!*
    `,
    date: "2025-01-15",
    readTime: "5 min read",
    tags: ["Next.js", "React", "Portfolio", "Web Development"],
    featured: true,
  },
  {
    slug: "rag-pipeline-in-5-steps",
    title: "Building a RAG Pipeline in 5 Steps",
    excerpt: "Learn how to build a Retrieval-Augmented Generation pipeline from scratch with practical examples.",
    content: `
# Building a RAG Pipeline in 5 Steps

Retrieval-Augmented Generation (RAG) is revolutionizing how we build AI applications. Here's a practical guide to building your own.

## What is RAG?

RAG combines the power of large language models with your own data. Instead of relying solely on the model's training data, RAG retrieves relevant context from your documents before generating responses.

## The 5 Steps

### Step 1: Document Processing
Break your documents into chunks. The chunk size matters - too small loses context, too large adds noise.

\`\`\`python
from langchain.text_splitter import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50
)
chunks = splitter.split_documents(documents)
\`\`\`

### Step 2: Generate Embeddings
Convert text chunks into vector embeddings using a model like OpenAI's ada-002 or open-source alternatives.

### Step 3: Store in Vector Database
Use Pinecone, Weaviate, or Chroma to store and index your embeddings for fast similarity search.

### Step 4: Retrieval
When a query comes in, convert it to an embedding and find the most similar chunks in your database.

### Step 5: Generation
Pass the retrieved context along with the query to your LLM for a grounded, accurate response.

## Pro Tips

- **Experiment with chunk sizes**: Different content types need different chunking strategies
- **Use metadata**: Filter results by date, source, or category
- **Implement caching**: Common queries shouldn't hit the vector DB every time

## What I'm Building

I'm currently applying these concepts to Farm-Friend, an AI assistant for farmers that answers questions based on agricultural research papers and local growing conditions.

---

*Questions? Let's discuss on Twitter!*
    `,
    date: "2025-01-10",
    readTime: "7 min read",
    tags: ["AI", "RAG", "LLM", "Python"],
    featured: true,
  },
  {
    slug: "lessons-from-building-ecosphere",
    title: "What I Learned Building EcoSphere",
    excerpt: "Reflections on scaling a sustainability platform to 10,000 users and the technical challenges along the way.",
    content: `
# What I Learned Building EcoSphere

EcoSphere grew from a hackathon project to a platform with 10,000+ monthly active users. Here are the key lessons.

## The Journey

What started as a weekend project at a climate hackathon turned into a six-month journey of building, learning, and scaling.

## Technical Lessons

### 1. Database Design Matters Early
We started with a simple schema that couldn't handle complex queries. Migrating to a properly normalized design with strategic denormalization took weeks.

**Lesson**: Invest time in data modeling upfront. It's much harder to change later.

### 2. Real-time Features Are Addictive (To Build)
We added WebSocket-based live leaderboards. Users loved it, but it added significant complexity.

**Lesson**: Question whether you truly need real-time. Often, polling or optimistic updates suffice.

### 3. Third-party API Reliability
Our carbon calculation relied on external APIs that occasionally went down.

**Lesson**: Always have fallbacks. Cache aggressively. Implement circuit breakers.

## Product Lessons

### 1. Gamification Works (When Done Right)
Adding streaks and badges increased retention by 40%. But we had to be careful not to make it feel manipulative.

### 2. Users Want Simplicity
Our first version had too many features. Simplifying to core actions improved onboarding completion by 60%.

### 3. Community Creates Stickiness
The challenges feature where friends compete became our biggest retention driver.

## What I'd Do Differently

1. Start with better monitoring and logging
2. Build an admin dashboard earlier
3. Focus on one platform (web) before expanding to mobile

---

*Building something similar? I'd love to hear about it!*
    `,
    date: "2025-01-05",
    readTime: "6 min read",
    tags: ["Startup", "Next.js", "Scaling", "Product"],
    featured: false,
  },
];

export const getBlogPosts = () => blogPosts;
export const getFeaturedPosts = () => blogPosts.filter((p) => p.featured);
export const getPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);
export const getAllPostSlugs = () => blogPosts.map((p) => p.slug);
