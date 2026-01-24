import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    title: "Nova Dashboard",
    description:
      "A high-performance SaaS analytics dashboard with real-time data visualization and customizable widgets.",
    role: "Frontend Lead",
    impact: "Improved data visualization performance by 50% using D3.js optimization.",
    image: "/images/projects/nova-dashboard.jpg",
    tags: ["React", "TypeScript", "D3.js", "Tailwind CSS"],
    liveUrl: "#",
    sourceUrl: "#",
    featured: true,
  },
  {
    id: "2",
    title: "EcoSphere",
    description:
      "Platform for tracking carbon footprints and sustainable lifestyle recommendations.",
    role: "Full Stack Developer",
    impact: "Scaled to 10k+ monthly active users in the first quarter.",
    image: "/images/projects/ecosphere.jpg",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS"],
    liveUrl: "#",
    sourceUrl: "#",
    featured: true,
  },
  {
    id: "3",
    title: "Flux Payment",
    description:
      "Secured payment processing interface with multi-currency support and advanced fraud detection.",
    role: "UI/UX Engineer",
    impact: "Reduced checkout abandonment by 25% with streamlined UX.",
    image: "/images/projects/flux-payment.jpg",
    tags: ["React", "Stripe", "Framer Motion", "Node.js"],
    liveUrl: "#",
    sourceUrl: "#",
    featured: true,
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id: string) => projects.find((p) => p.id === id);
