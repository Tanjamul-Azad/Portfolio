import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    slug: "complete-legal-aid",
    title: "Complete Legal Aid",
    description:
      "Legal technology platform with role-based dashboards, real-time communication, and AI-powered legal drafting support.",
    role: "Frontend Lead & Full-Stack Contributor",
    impact:
      "Developed AI-powered auto-drafting API flow that reduced lawyer document drafting time from approximately 45 minutes to under 3 minutes (about 15x reduction).",
    image: "/images/projects/complete-legal-aid.jpg",
    tags: [
      "React 19",
      "TypeScript",
      "Vite",
      "Django",
      "WebSocket",
      "Tailwind CSS",
      "Firebase",
      "GCP",
    ],
    liveUrl: "https://completelegalaid.systems/",
    sourceUrl: "https://github.com/Tanjamul-Azad/Complete-Legal-Aid",
    featured: true,
    overview:
      "Complete Legal Aid is a production legal technology platform where citizens, lawyers, and admins work in one system. It includes role-based dashboards, real-time communication, booking flow, AI-assisted drafting, and analytics views.",
    problem:
      "Legal support workflows were fragmented across channels, making collaboration, drafting, and case communication slower and harder to manage.",
    solution:
      "Built and shipped a complete frontend for three user roles, integrated real-time chat with Django Channels and WebSocket, and connected AI document drafting APIs with practical in-product flows.",
    architecture:
      "React 19 + TypeScript + Vite frontend, Django backend, real-time communication through Django Channels/WebSocket, Firebase Cloud Messaging for notifications, and GCP-backed deployment services.",
    features: [
      {
        title: "Role-Based Dashboards",
        description:
          "Built dedicated workflows for Citizen, Lawyer, and Admin users with clear permissions and task-oriented UI.",
      },
      {
        title: "Real-Time Chat System",
        description:
          "Implemented end-to-end real-time messaging with attachments, read receipts, and live push notifications.",
      },
      {
        title: "Authentication and Access",
        description:
          "Implemented JWT and Google OAuth 2.0 flows with token refresh and 2FA support.",
      },
      {
        title: "AI Auto-Drafting",
        description:
          "Integrated AI drafting APIs that cut document drafting time from roughly 45 minutes to under 3 minutes.",
      },
    ],
    challenges: [
      {
        challenge: "Coordinating real-time communication and file workflows across three user roles",
        learned:
          "Designed robust UI state and messaging flows that kept conversations, attachments, and notifications synchronized reliably.",
      },
      {
        challenge: "Balancing complex legal workflows with simple UX",
        learned:
          "Used task-first interface design to keep advanced capability available without overwhelming first-time users.",
      },
    ],
    results: [
      {
        metric: "Drafting Speed",
        value: "15x",
        description: "Reduced legal drafting from about 45 minutes to under 3 minutes",
      },
      {
        metric: "User Roles",
        value: "3",
        description: "Citizen, Lawyer, and Admin workflows delivered in one platform",
      },
      {
        metric: "System Scope",
        value: "Production",
        description: "Live deployment with real-time features and AI integration",
      },
    ],
  },
  {
    id: "2",
    slug: "chefmate",
    title: "ChefMate",
    description:
      "AI-powered recipe suggestion web app using NLP normalization and ML-based cuisine and recipe prediction from user ingredients.",
    role: "Solo Developer",
    impact:
      "Improved ingredient recognition accuracy by approximately 70% on noisy and varied user inputs through NLP normalization and typo-tolerant matching.",
    image: "/images/projects/chefmate.jpg",
    tags: ["Python", "Flask", "spaCy", "scikit-learn", "FuzzyWuzzy", "Pandas"],
    sourceUrl: "https://github.com/Tanjamul-Azad/ChefMate",
    featured: true,
    overview:
      "ChefMate helps users discover recipes from available ingredients. It combines NLP preprocessing, fuzzy matching, and classification models for practical real-time recommendations.",
    problem:
      "User-entered ingredients are often noisy, misspelled, or inconsistent, making strict keyword matching unreliable for recipe discovery.",
    solution:
      "Built an end-to-end Flask app with spaCy lemmatization and synonym handling, FuzzyWuzzy typo-tolerant matching, and scikit-learn prediction workflows trained on a large recipe dataset.",
    architecture:
      "Python + Flask app, NLP preprocessing with spaCy, matching layer with FuzzyWuzzy, model training and inference with scikit-learn and Pandas-driven data preparation.",
    features: [
      {
        title: "NLP Preprocessing",
        description:
          "Normalized ingredient text through lemmatization and synonym handling to improve matching quality.",
      },
      {
        title: "Typo-Tolerant Matching",
        description:
          "Used FuzzyWuzzy matching to maintain robust behavior against noisy and partial user input.",
      },
      {
        title: "ML-Based Prediction",
        description:
          "Trained classifiers on a 643MB Kaggle dataset to predict cuisines and recipe names with confidence output.",
      },
      {
        title: "Interactive Web UI",
        description:
          "Delivered real-time response UX with cuisine, diet, and meal-type filters.",
      },
    ],
    challenges: [
      {
        challenge: "Handling inconsistent ingredient vocabulary from users",
        learned:
          "Layered normalization and fuzzy matching significantly improved robustness over plain token matching.",
      },
      {
        challenge: "Training practical models on a large dataset",
        learned:
          "Data cleaning and feature preparation quality had more impact than model complexity for this task.",
      },
    ],
    results: [
      {
        metric: "Recognition Gain",
        value: "~70%",
        description: "Improved ingredient recognition on noisy and varied inputs",
      },
      {
        metric: "Dataset",
        value: "643MB",
        description: "Kaggle recipe data used for training and evaluation",
      },
      {
        metric: "Delivery",
        value: "End-to-End",
        description: "Implemented preprocessing, model training, inference, and web interface solo",
      },
    ],
  },
  {
    id: "3",
    slug: "convoverse",
    title: "ConvoVerse",
    description:
      "LLM-based multi-agent social practice system with staged exposure modes to help users build communication confidence.",
    role: "System Designer & Frontend Developer",
    impact:
      "Designed a multi-agent LLM flow with adaptive pacing, rewind-and-retry mechanics, and reflective feedback for social practice.",
    image: "/images/projects/convoverse.jpg",
    tags: ["TypeScript", "React", "Next.js", "LLM APIs", "HCI"],
    sourceUrl: "https://github.com/Tanjamul-Azad/ConvoVerse",
    featured: true,
    overview:
      "ConvoVerse is an LLM-based practice environment for communication training. It introduces progressive interaction stages and role-based AI agents to reduce social pressure while practicing.",
    problem:
      "Many learners need low-pressure practice before participating confidently in real social or academic interactions.",
    solution:
      "Designed a three-stage progression (Observer, One-on-One, Small Group) and built an interactive frontend that supports adaptive pacing, retries, and reflection.",
    architecture:
      "TypeScript/React/Next.js interface integrated with role-based LLM agent APIs and session-level interaction controls.",
    features: [
      {
        title: "Multi-Agent Roles",
        description:
          "Introduced three distinct AI roles for controlled social simulation across different interaction styles.",
      },
      {
        title: "Graduated Exposure",
        description:
          "Designed Observer to One-on-One to Small Group progression for confidence-building practice.",
      },
      {
        title: "Rewind and Retry",
        description:
          "Enabled users to revisit and retry responses, improving iterative communication learning.",
      },
      {
        title: "Reflective Feedback",
        description:
          "Included post-session reflection flows to support continuous behavioral improvement.",
      },
    ],
    challenges: [
      {
        challenge: "Balancing realism and emotional safety in generated interactions",
        learned:
          "Role-specific prompts and pacing controls reduced overload and improved consistency of practice sessions.",
      },
      {
        challenge: "Translating HCI concepts into practical UI behavior",
        learned:
          "Iterative UI prototyping with small feedback loops produced clearer interaction patterns.",
      },
    ],
    results: [
      {
        metric: "Agent Roles",
        value: "3",
        description: "Role-based AI interaction design implemented",
      },
      {
        metric: "Exposure Stages",
        value: "3",
        description: "Observer, One-on-One, and Small Group progression",
      },
      {
        metric: "Approach",
        value: "HCI-Guided",
        description: "System design grounded in communication practice principles",
      },
    ],
  },
  {
    id: "4",
    slug: "care-companion",
    title: "Care Companion",
    description:
      "AI + IoT smart healthcare rover for patient monitoring with sensor integration, autonomous tracking, and caregiver dashboard.",
    role: "Software Developer & Team Lead",
    impact:
      "Coded all software modules independently and integrated MobileNetSSD with OpenCV, achieving real-time human detection at about 60 FPS on Raspberry Pi 4.",
    image: "/images/projects/care-companion.jpg",
    tags: ["Python", "Flask", "OpenCV", "MobileNetSSD", "Raspberry Pi 4", "Arduino"],
    sourceUrl: "https://github.com/Tanjamul-Azad/Silicon-Squad-",
    featured: false,
    overview:
      "Care Companion combines AI and IoT to support elderly and home patient care through real-time sensing, autonomous behavior, and remote monitoring.",
    problem:
      "Home-care environments often lack continuous monitoring and fast visibility for caregivers during routine and emergency situations.",
    solution:
      "Built Raspberry Pi-based AI control software, integrated Arduino sensor streams, implemented motor control and voice commands, and created a Flask dashboard for live monitoring.",
    architecture:
      "Raspberry Pi 4 as AI core, Arduino for sensor interfaces, Python control scripts, MobileNetSSD/OpenCV vision pipeline, and Flask web dashboard.",
    features: [
      {
        title: "Real-Time Monitoring",
        description:
          "Collected and surfaced sensor data (DHT11, MQ-2, pulse sensor, flame) through a caregiver-facing dashboard.",
      },
      {
        title: "Autonomous Human Detection",
        description:
          "Integrated MobileNetSSD and OpenCV for real-time tracking and patient-following behavior.",
      },
      {
        title: "Voice Command Control",
        description:
          "Implemented command handling for hands-free rover interaction.",
      },
      {
        title: "Medication and Alert Workflows",
        description:
          "Added reminder and alert logic to support safer day-to-day caregiving.",
      },
    ],
    challenges: [
      {
        challenge: "Maintaining real-time behavior on constrained hardware",
        learned:
          "Optimized capture and inference flow to keep detection responsive while other control loops ran concurrently.",
      },
      {
        challenge: "Coordinating multiple sensor and control channels",
        learned:
          "Built modular software boundaries between sensing, motion, and dashboard pipelines to keep the system reliable.",
      },
    ],
    results: [
      {
        metric: "Detection Speed",
        value: "~60 FPS",
        description: "Real-time human detection achieved on Raspberry Pi 4",
      },
      {
        metric: "Software Scope",
        value: "End-to-End",
        description: "Implemented sensing, control, AI vision, and dashboard modules",
      },
      {
        metric: "Platform",
        value: "AI + IoT",
        description: "Integrated embedded hardware with practical web monitoring",
      },
    ],
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id: string) => projects.find((p) => p.id === id);
export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const getAllProjectSlugs = () => projects.map((p) => p.slug);
