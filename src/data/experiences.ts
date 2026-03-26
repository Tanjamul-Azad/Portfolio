import type { Experience } from "@/types";

export const experiences: Experience[] = [
  {
    id: "1",
    company: "Complete Legal Aid (CLA)",
    role: "Frontend Lead & Full-Stack Contributor",
    period: "2025 - 2026",
    description: [
      "Engineered the full production frontend with role-based dashboards for Citizen, Lawyer, and Admin users.",
      "Implemented end-to-end real-time messaging with Django Channels, WebSocket, attachments, and read receipts.",
      "Built AI auto-drafting API workflow reducing legal document drafting time from around 45 minutes to under 3 minutes.",
    ],
    technologies: ["React 19", "TypeScript", "Vite", "Django", "WebSocket", "Tailwind CSS", "Firebase", "GCP"],
  },
  {
    id: "2",
    company: "ConvoVerse",
    role: "System Designer & Frontend Developer",
    period: "2024 - 2025",
    description: [
      "Designed an LLM-based multi-agent system with staged interaction flow (Observer to One-on-One to Small Group).",
      "Built interactive frontend prototype with adaptive pacing and rewind/retry practice mechanics.",
      "Implemented reflective feedback flow to support communication confidence-building sessions.",
    ],
    technologies: ["TypeScript", "React", "Next.js", "LLM APIs", "HCI"],
  },
  {
    id: "3",
    company: "ChefMate",
    role: "Solo Developer",
    period: "2024",
    description: [
      "Built full AI recipe recommendation pipeline using spaCy NLP normalization and typo-tolerant FuzzyWuzzy matching.",
      "Trained scikit-learn classification workflows on a 643MB Kaggle dataset for cuisine and recipe prediction.",
      "Delivered a responsive Flask web app with real-time filtered recommendations and confidence scores.",
    ],
    technologies: ["Python", "Flask", "spaCy", "scikit-learn", "FuzzyWuzzy", "Pandas"],
  },
  {
    id: "4",
    company: "Care Companion",
    role: "Software Developer & Team Lead",
    period: "2024",
    description: [
      "Implemented all software modules: sensor collection, voice command flow, motor control, and Flask caregiver dashboard.",
      "Integrated MobileNetSSD with OpenCV for real-time human detection at around 60 FPS on Raspberry Pi 4.",
      "Coordinated Raspberry Pi and Arduino communication for continuous AI + IoT monitoring workflows.",
    ],
    technologies: ["Python", "Flask", "OpenCV", "MobileNetSSD", "Raspberry Pi 4", "Arduino"],
  },
  {
    id: "5",
    company: "Independent Tutoring",
    role: "Academic Tutor",
    period: "Ongoing",
    description: [
      "Mentored and guided students in Classes 6 through 12, fostering a strong foundational understanding of core science and mathematics subjects.",
      "Developed customized and adaptable lesson plans tailored to individual student learning paces and academic goals.",
      "Cultivated critical problem-solving skills, resulting in consistent and measurable improvements in students' examination results."
    ],
    technologies: ["Mentorship", "Teaching", "Curriculum Planning", "Communication"],
  },
];

export const getExperiences = () => experiences;
