export const siteConfig = {
  name: "Tanjamul",
  title: "Md. Tanzamul Azad | Full-Stack Developer, ML Researcher & CSE Undergrad",
  description:
    "CSE undergraduate (Data Science major) at United International University, building ML-driven applications, AI + IoT systems, and production-grade full-stack platforms.",
  url: "https://tanjamul.dev",
  ogImage: "https://i.postimg.cc/8JZRwxxV/og-image.jpg",
  links: {
    github: "https://github.com/Tanjamul-Azad",
    linkedin: "https://www.linkedin.com/in/tanjamul-azad/",
    facebook: "https://www.facebook.com/tanjamul.tonmoy69",
    twitter: "https://x.com/TanjamulTonmoy",
    resume: "/Md.%20Tanzamul%20Azad%20-%20CV.pdf",
  },
  contact: {
    email: "i.m.tanjamul@gmail.com",
    whatsapp: "+8801316022879",
  },
  author: {
    name: "Md. Tanzamul Azad",
    role: "Full-Stack Developer | ML Researcher | CSE Undergrad (Data Science)",
    location: "Dhaka, Bangladesh",
    twitterHandle: "@tanjamul",
  },
} as const;

export type SiteConfig = typeof siteConfig;
