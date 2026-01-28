export const siteConfig = {
  name: "Tanjamul",
  title: "Tanjamul | AI/ML Enthusiast & Full-Stack Developer",
  description:
    "Full-stack developer and AI/ML enthusiast dedicated to turning ideas into creative solutions. Specializing in React, Next.js, and creating seamless user experiences.",
  url: "https://tanjamul.dev",
  ogImage: "https://i.postimg.cc/8JZRwxxV/og-image.jpg",
  links: {
    github: "https://github.com/Tanjamul-Azad",
    linkedin: "https://linkedin.com/in/tanjamul",
    facebook: "https://www.facebook.com/tanjamul.tonmoy69/",
  },
  contact: {
    email: "i.m.tanjamul@gmail.com",
    whatsapp: "+8801316022879",
  },
  author: {
    name: "Tanjamul Azad",
    role: "Full-Stack Developer & AI/ML Enthusiast",
    location: "Bangladesh",
 
  },
} as const;

export type SiteConfig = typeof siteConfig;
