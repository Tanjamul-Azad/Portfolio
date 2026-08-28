export interface Project {
  /** Rendered as an inline SVG on the case-study page. */
  architectureDiagram?: ArchitectureDiagram;
  id: string;
  slug: string;
  title: string;
  description: string;
  role: string;
  impact: string;
  image: string;
  color?: string;
  tags: string[];
  liveUrl?: string;
  sourceUrl?: string;
  videoUrl?: string;
  featured?: boolean;
  pinned?: boolean;
  // Case study details
  overview?: string;
  problem?: string;
  solution?: string;
  architecture?: string;
  features?: ProjectFeature[];
  challenges?: Challenge[];
  results?: Result[];
}

export interface ProjectFeature {
  title: string;
  description: string;
  image?: string;
}

export interface Challenge {
  challenge: string;
  learned: string;
}

export interface Result {
  metric: string;
  value: string;
  description?: string;
}

export interface Experience {
  id: string;
  company: string;
  role: string;
  period: string;
  description: string[];
  technologies?: string[];
}

export interface TechItem {
  name: string;
  icon: string;
  category: "language" | "frontend" | "backend" | "ai" | "database" | "cloud" | "tools" | "design";
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  type: "certification" | "award" | "achievement";
  icon: string;
  image?: string;
  description: string;
  credentialUrl?: string;
  skills: string[];
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  company: string;
  image?: string;
  content: string;
  rating?: number;
}

export interface NowItem {
  category: "building" | "learning" | "looking";
  items: string[];
}

export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  readTime: string;
  tags: string[];
  featured?: boolean;
}

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    github: string;
    linkedin: string;
    facebook: string;
    twitter: string;
    resume: string;
  };
  contact: {
    email: string;
    whatsapp: string;
  };
  author: {
    name: string;
    /** Other spellings and short forms people search for, fed to SEO metadata. */
    alternateNames?: string[];
    role: string;
    location: string;
    twitterHandle: string;
    /** Shown on the AI chat launcher and inside the panel header. */
    avatar?: string;
  };
}

/** One box in an architecture diagram row. */
export interface ArchitectureNode {
  label: string;
  /** Optional second line — a technology, protocol, or brief qualifier. */
  detail?: string;
}

/** A horizontal band of the diagram; bands are drawn top to bottom in order. */
export interface ArchitectureLayer {
  /** Small caption above the row, e.g. "Client" or "Persistence". */
  title: string;
  nodes: ArchitectureNode[];
  /** Label drawn on the arrow leading into the next layer, e.g. "HTTPS / JSON". */
  edgeLabel?: string;
}

export interface ArchitectureDiagram {
  /** Sentence describing what the reader is looking at; also the accessible name. */
  caption: string;
  layers: ArchitectureLayer[];
}

export interface HeroContent {
  badge: { status: string; text: string };
  headlineLines: { text: string; muted?: boolean }[];
  typewriter: string;
  actions: { label: string; href: string }[];
  profileVideo: string;
  /** Optional still shown before the video decodes, and in place of it when the
   *  visitor has asked for reduced motion. */
  profilePoster?: string;
}

export interface AboutContent {
  eyebrow: string;
  heading: string;
  personality: { type: string; label: string };
  paragraphs: string[];
  quote: string;
}

export interface SectionsContent {
  now: { eyebrow: string; heading: string; subtext: string };
  contact: {
    eyebrow: string;
    headingLine1: string;
    headingLine2: string;
    subtext: string;
    responseTime: string;
  };
}
