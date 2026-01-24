export const siteConfig = {
  name: "Tanjamul",
  title: "Tanjamul | Frontend Developer",
  description:
    "Frontend web developer dedicated to turning ideas into creative solutions. Specializing in React, Next.js, and creating seamless user experiences.",
  url: "https://tanjamul.dev",
  ogImage: "https://i.postimg.cc/8JZRwxxV/og-image.jpg",
  links: {
    github: "https://github.com/Tanjamul-Azad",
    linkedin: "https://linkedin.com/in/tanjamul",
    twitter: "https://twitter.com/tanjamul",
  },
  contact: {
    email: "i.m.tanjamul@gmail.com",
    calendly: "https://calendly.com/tanjamul",
  },
  author: {
    name: "Tanjamul",
    role: "Frontend Developer",
    location: "Bangladesh",
    yearsOfExperience: 3,
    projectsCompleted: 40,
    hoursWorked: 10000,
  },
} as const;

export type SiteConfig = typeof siteConfig;
