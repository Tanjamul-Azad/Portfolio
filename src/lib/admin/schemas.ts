import { z } from "zod";
import type { ContentType } from "./content";

const str = z.string();
const strArr = z.array(z.string());

const projectFeature = z.object({
  title: str,
  description: str,
  image: str.optional(),
});
const challenge = z.object({ challenge: str, learned: str });
const result = z.object({ metric: str, value: str, description: str.optional() });

// Matches ArchitectureDiagram in src/types/index.ts. The admin editor has no
// UI to author or change this yet, but the field still has to round-trip
// through a save: Zod's z.object() strips any key it doesn't know about, so
// without this every save from the Projects editor was silently deleting the
// diagram on all seven projects — confirmed live, restored from git history.
const architectureNode = z.object({ label: str, detail: str.optional() });
const architectureLayer = z.object({
  title: str,
  nodes: z.array(architectureNode),
  edgeLabel: str.optional(),
});
const architectureDiagram = z.object({
  caption: str,
  layers: z.array(architectureLayer),
});

const project = z.object({
  id: str,
  slug: str,
  title: str,
  description: str,
  role: str,
  impact: str,
  image: str,
  color: str.optional(),
  tags: strArr,
  liveUrl: str.optional(),
  sourceUrl: str.optional(),
  videoUrl: str.optional(),
  featured: z.boolean().optional(),
  pinned: z.boolean().optional(),
  overview: str.optional(),
  problem: str.optional(),
  solution: str.optional(),
  architecture: str.optional(),
  architectureDiagram: architectureDiagram.optional(),
  features: z.array(projectFeature).optional(),
  challenges: z.array(challenge).optional(),
  results: z.array(result).optional(),
});

const blog = z.object({
  slug: str,
  title: str,
  excerpt: str,
  content: str,
  date: str,
  readTime: str,
  tags: strArr,
  featured: z.boolean().optional(),
});

const achievement = z.object({
  id: str,
  title: str,
  issuer: str,
  date: str,
  type: z.enum(["certification", "award", "achievement"]),
  icon: str,
  image: str.optional(),
  momentImage: str.optional(),
  description: str,
  details: str.optional(),
  gallery: strArr.optional(),
  credentialUrl: str.optional(),
  skills: strArr,
});

const experience = z.object({
  id: str,
  company: str,
  role: str,
  period: str,
  description: strArr,
  technologies: strArr.optional(),
});

const testimonial = z.object({
  id: str,
  name: str,
  role: str,
  company: str,
  image: str.optional(),
  content: str,
  rating: z.number().optional(),
});

const techItem = z.object({
  name: str,
  icon: str,
  category: z.enum([
    "language",
    "frontend",
    "backend",
    "ai",
    "database",
    "cloud",
    "tools",
    "design",
  ]),
  description: str,
});

const nowItem = z.object({
  category: z.enum(["building", "learning", "looking"]),
  items: strArr,
});

const site = z.object({
  name: str,
  title: str,
  description: str,
  url: str,
  ogImage: str,
  links: z.object({
    github: str,
    linkedin: str,
    facebook: str,
    twitter: str,
    resume: str,
  }),
  contact: z.object({ email: str, whatsapp: str }),
  author: z.object({
    name: str,
    // Both added after this schema was first written — missing here meant a
    // save from the admin Site editor would silently strip them, the same
    // failure mode as the architectureDiagram gap above.
    alternateNames: strArr.optional(),
    role: str,
    location: str,
    twitterHandle: str,
    avatar: str.optional(),
  }),
});

const hero = z.object({
  badge: z.object({ status: str, text: str }),
  headlineLines: z.array(z.object({ text: str, muted: z.boolean().optional() })),
  typewriter: str,
  actions: z.array(z.object({ label: str, href: str })),
  profileVideo: str,
  profilePoster: str.optional(),
});

const about = z.object({
  eyebrow: str,
  heading: str,
  personality: z.object({ type: str, label: str }),
  paragraphs: strArr,
  quote: str,
});

const sections = z.object({
  now: z.object({ eyebrow: str, heading: str, subtext: str }),
  contact: z.object({
    eyebrow: str,
    headingLine1: str,
    headingLine2: str,
    subtext: str,
    responseTime: str,
  }),
});

export const schemas: Record<ContentType, z.ZodTypeAny> = {
  site,
  hero,
  about,
  sections,
  now: z.array(nowItem),
  "tech-stack": z.array(techItem),
  projects: z.array(project),
  experiences: z.array(experience),
  achievements: z.array(achievement),
  testimonials: z.array(testimonial),
  blog: z.array(blog),
};
