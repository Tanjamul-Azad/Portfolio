export interface Project {
  id: string;
  title: string;
  description: string;
  role: string;
  impact: string;
  image: string;
  tags: string[];
  liveUrl?: string;
  sourceUrl?: string;
  featured?: boolean;
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
