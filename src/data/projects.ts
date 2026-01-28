import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    slug: "nova-dashboard",
    title: "Nova Dashboard",
    description:
      "A high-performance SaaS analytics dashboard with real-time data visualization and customizable widgets.",
    role: "Frontend Lead",
    impact: "Improved data visualization performance by 50% using D3.js optimization.",
    image: "/images/projects/nova-dashboard.jpg",
    tags: ["React", "TypeScript", "D3.js", "Tailwind CSS", "WebSocket", "Node.js"],
    liveUrl: "#",
    sourceUrl: "#",
    featured: true,
    overview: "Nova Dashboard is an enterprise-grade analytics platform that transforms complex data into actionable insights through beautiful, real-time visualizations.",
    problem: "Enterprise clients struggled with slow, outdated dashboard solutions that couldn't handle real-time data updates. Existing tools were clunky, had poor performance with large datasets, and lacked customization options that modern businesses need.",
    solution: "Built a modular, widget-based dashboard system with real-time WebSocket connections, virtualized data tables for handling 100k+ rows, and a drag-and-drop interface for complete customization. Implemented smart caching and lazy loading for optimal performance.",
    architecture: "React + TypeScript frontend with Context API for state management. D3.js for custom visualizations. WebSocket server (Node.js) for real-time updates. Redis for caching frequently accessed data. PostgreSQL for persistent storage.",
    features: [
      {
        title: "Real-time Data Streaming",
        description: "Live data updates via WebSocket with automatic reconnection and offline queue management."
      },
      {
        title: "Custom Widget Builder",
        description: "Drag-and-drop interface to create personalized dashboards with 20+ widget types."
      },
      {
        title: "Advanced Charting",
        description: "Interactive D3.js visualizations with zoom, pan, and drill-down capabilities."
      },
      {
        title: "Export & Reporting",
        description: "Automated PDF/CSV reports with scheduling and email delivery."
      }
    ],
    challenges: [
      {
        challenge: "Rendering thousands of data points without performance degradation",
        learned: "Implemented canvas-based rendering for large datasets, virtual scrolling, and requestAnimationFrame for smooth 60fps animations."
      },
      {
        challenge: "Managing complex state across multiple real-time widgets",
        learned: "Designed a pub/sub pattern with selective re-renders using React.memo and useMemo strategically."
      }
    ],
    results: [
      { metric: "Performance", value: "50%", description: "Faster render times compared to previous solution" },
      { metric: "User Adoption", value: "200+", description: "Enterprise users onboarded in first month" },
      { metric: "Data Points", value: "100K+", description: "Rows handled smoothly in data tables" }
    ]
  },
  {
    id: "2",
    slug: "ecosphere",
    title: "EcoSphere",
    description:
      "Platform for tracking carbon footprints and sustainable lifestyle recommendations.",
    role: "Full Stack Developer",
    impact: "Scaled to 10k+ monthly active users in the first quarter.",
    image: "/images/projects/ecosphere.jpg",
    tags: ["Next.js", "Prisma", "PostgreSQL", "Tailwind CSS", "OpenAI", "Vercel"],
    liveUrl: "#",
    sourceUrl: "#",
    featured: true,
    overview: "EcoSphere empowers individuals to understand and reduce their environmental impact through personalized tracking, AI-powered recommendations, and community challenges.",
    problem: "People want to live more sustainably but lack tools to measure their impact and don't know where to start. Existing carbon calculators are one-time use and don't provide ongoing guidance or motivation.",
    solution: "Created a comprehensive platform that tracks daily activities, calculates carbon footprint in real-time, and uses AI to provide personalized, actionable recommendations. Added gamification with challenges and leaderboards to maintain engagement.",
    architecture: "Next.js 14 with App Router for SSR/ISR. Prisma ORM with PostgreSQL. OpenAI API for personalized recommendations. Vercel Edge Functions for fast API responses. Redis for session management and caching.",
    features: [
      {
        title: "Smart Activity Tracking",
        description: "Log meals, transportation, energy usage with auto-suggestions and smart defaults."
      },
      {
        title: "AI Recommendations",
        description: "GPT-powered suggestions based on your habits, location, and goals."
      },
      {
        title: "Community Challenges",
        description: "Join global challenges, compete with friends, earn badges for sustainable choices."
      },
      {
        title: "Impact Visualization",
        description: "Beautiful charts showing your progress, comparisons, and equivalent impact metrics."
      }
    ],
    challenges: [
      {
        challenge: "Calculating accurate carbon footprints from varied user inputs",
        learned: "Built a flexible calculation engine with regional emission factors and integrated multiple data sources for accuracy."
      },
      {
        challenge: "Keeping users engaged long-term with sustainability tracking",
        learned: "Implemented gamification, streak systems, and social features that increased 30-day retention by 40%."
      }
    ],
    results: [
      { metric: "Monthly Active Users", value: "10K+", description: "Organic growth in first quarter" },
      { metric: "Avg. Session Duration", value: "8 min", description: "High engagement per visit" },
      { metric: "CO2 Tracked", value: "500 tons", description: "Cumulative user impact measured" }
    ]
  },
  {
    id: "3",
    slug: "flux-payment",
    title: "Flux Payment",
    description:
      "Secured payment processing interface with multi-currency support and advanced fraud detection.",
    role: "UI/UX Engineer",
    impact: "Reduced checkout abandonment by 25% with streamlined UX.",
    image: "/images/projects/flux-payment.jpg",
    tags: ["React", "Stripe", "Framer Motion", "Node.js", "Redis", "TypeScript"],
    liveUrl: "#",
    sourceUrl: "#",
    featured: true,
    overview: "Flux Payment is a modern payment processing solution designed for seamless checkout experiences with enterprise-grade security and beautiful animations.",
    problem: "E-commerce clients faced high cart abandonment rates due to clunky checkout flows, lack of trust signals, and poor mobile experiences. Existing payment forms felt outdated and increased user anxiety.",
    solution: "Designed and built a conversion-optimized payment interface with smooth micro-interactions, real-time validation, smart autofill, and trust-building UI patterns. Focused heavily on mobile-first design and accessibility.",
    architecture: "React with Framer Motion for fluid animations. Stripe Elements for PCI-compliant card handling. Node.js backend for payment processing. Redis for rate limiting and session management. Comprehensive A/B testing infrastructure.",
    features: [
      {
        title: "One-Click Checkout",
        description: "Saved payment methods with biometric authentication for returning customers."
      },
      {
        title: "Smart Form UX",
        description: "Real-time validation, auto-formatting, and intelligent error recovery."
      },
      {
        title: "Multi-Currency Support",
        description: "Dynamic currency conversion with transparent fees and local payment methods."
      },
      {
        title: "Fraud Detection",
        description: "ML-powered risk scoring with manual review workflows for edge cases."
      }
    ],
    challenges: [
      {
        challenge: "Balancing security requirements with smooth user experience",
        learned: "Implemented progressive security - minimal friction for low-risk transactions, additional verification only when needed."
      },
      {
        challenge: "Creating consistent experience across all devices and browsers",
        learned: "Built a comprehensive component library with extensive cross-browser testing and graceful degradation strategies."
      }
    ],
    results: [
      { metric: "Cart Abandonment", value: "-25%", description: "Reduction in checkout drop-offs" },
      { metric: "Mobile Conversion", value: "+35%", description: "Improvement in mobile purchases" },
      { metric: "Fraud Rate", value: "0.1%", description: "Industry-leading low fraud rate" }
    ]
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id: string) => projects.find((p) => p.id === id);
export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const getAllProjectSlugs = () => projects.map((p) => p.slug);
