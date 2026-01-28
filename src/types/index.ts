export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  role: string;
  impact: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
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
  category: "frontend" | "backend" | "database" | "tools" | "cloud";
  description: string;
}

export interface Achievement {
  id: string;
  title: string;
  issuer: string;
  date: string;
  type: "certification" | "award" | "achievement";
  icon: string;
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
