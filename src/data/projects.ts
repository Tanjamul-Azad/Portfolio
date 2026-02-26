import type { Project } from "@/types";

export const projects: Project[] = [
  {
    id: "1",
    slug: "complete-legal-aid",
    title: "Complete Legal Aid",
    description:
      "A full-stack legal-tech platform bridging citizens, lawyers, and NGOs in Bangladesh through verified lawyer search, AI-powered legal guidance, and encrypted evidence management.",
    role: "Frontend Lead & Full Stack Developer",
    impact: "Delivered a production-ready platform connecting 3 user roles — citizens, lawyers, and admins — with real-time consultation booking and an AI assistant supporting both Bangla and English.",
    image: "/images/projects/complete-legal-aid.jpg",
    tags: ["React", "TypeScript", "Django", "MySQL", "Gemini AI", "Docker", "JWT"],
    liveUrl: "https://completelegalaid.systems/",
    sourceUrl: "https://github.com/Tanjamul-Azad/Complete-Legal-Aid",
    featured: true,
    overview:
      "Complete Legal Aid (CLA) is a digital justice platform designed to make legal services accessible to every citizen in Bangladesh. It unifies citizens, verified lawyers, NGOs, and administrators into a single trusted hub — offering AI-powered legal guidance, secure evidence management, and real-time consultation booking.",
    problem:
      "In Bangladesh, access to legal services is limited by geography, cost, and lack of transparency. Citizens are unable to find verified lawyers, evidence is shared insecurely, and there is no central system for emergency legal reporting or case tracking.",
    solution:
      "Built a three-tier full-stack platform with a React + Vite frontend, Django REST API backend, and MySQL database. Integrated a bilingual AI legal assistant (Bangla + English) powered by Gemini API for document analysis and legal Q&A. Implemented an encrypted evidence vault with MIME validation and time-limited secure share links for legal documents.",
    architecture:
      "React + Vite + TypeScript SPA for the frontend with Context API for state management and i18n for Bangla/English support. Django REST Framework backend with JWT authentication and role-based access control. MySQL with Cloud SQL for persistent storage. Gemini/OpenAI API for the AI legal assistant. Docker for containerized deployment on Cloud Compute and Cloud Run.",
    features: [
      {
        title: "Verified Lawyer Directory",
        description:
          "Search and filter lawyers by specialization, rating, language, and availability. All profiles are admin-verified for trust and transparency.",
      },
      {
        title: "Real-time Consultation Booking",
        description:
          "Book in-person, phone, or video consultations with live availability. Lawyers accept or decline requests with automated notifications.",
      },
      {
        title: "Encrypted Evidence Vault",
        description:
          "End-to-end encrypted file uploads with virus scanning, MIME validation, audit logs, and time-limited secure share links. Supports PDF, DOCX, JPG, PNG, MP3.",
      },
      {
        title: "AI Legal Assistant (Bangla + English)",
        description:
          "Bilingual AI assistant covering labor law, cyber law, family law, and criminal basics. Supports Q&A, document summary, risk analysis, and next-steps guidance.",
      },
      {
        title: "Emergency Legal Helpline",
        description:
          "Anonymous emergency reporting with fast evidence upload, auto-routing to NGOs and verified responders, and priority alert system.",
      },
      {
        title: "Case Timeline & Admin Dashboard",
        description:
          "Real-time case milestones, lawyer verification panel, audit logs, usage analytics, and emergency report monitoring for administrators.",
      },
    ],
    challenges: [
      {
        challenge: "Building a secure multi-role system with citizens, lawyers, and admins",
        learned:
          "Designed a JWT-based RBAC system where each role has strictly scoped API access. Implemented row-level security on case and evidence data so lawyers only see their assigned clients.",
      },
      {
        challenge: "Delivering a bilingual AI assistant that understands local legal context",
        learned:
          "Fine-tuned prompts with Bangladesh-specific legal references and combined Gemini API with structured data retrieval from the legal knowledge base for accurate, context-aware responses.",
      },
    ],
    results: [
      {
        metric: "User Roles",
        value: "3",
        description: "Citizens, lawyers, and admins in one unified system",
      },
      {
        metric: "Languages",
        value: "2",
        description: "Full Bangla and English support throughout the platform",
      },
      {
        metric: "Contributors",
        value: "4",
        description: "Team of 4 developers — built and shipped as a team",
      },
    ],
  },
  {
    id: "2",
    slug: "convoverse",
    title: "ConvoVerse",
    description:
      "An LLM-powered multi-agent social practice system that helps introverted learners build confidence for real-world communication through safe, low-pressure simulated conversations.",
    role: "Lead Developer & HCI Researcher",
    impact: "Designed and built an HCI research prototype accepted as a contribution to AI-for-social-participation research, demonstrating AI as a supportive facilitator rather than a replacement for human interaction.",
    image: "/images/projects/convoverse.jpg",
    tags: ["TypeScript", "React", "LLM", "Multi-Agent AI", "HCI", "CSS"],
    liveUrl: "#",
    sourceUrl: "https://github.com/Tanjamul-Azad/ConvoVerse",
    featured: true,
    overview:
      "ConvoVerse is an HCI-focused, LLM-powered multi-agent interactive system designed for introverted and socially hesitant learners. It provides a psychologically safe, pressure-free simulated environment where users can practice conversations at their own pace — gradually building the confidence needed for real-world participation.",
    problem:
      "Many capable learners — particularly introverts and socially anxious students — struggle with classroom participation, group discussions, and presentations. Existing educational platforms focus on content delivery while ignoring social readiness, emotional comfort, and participation confidence.",
    solution:
      "Built a gradual scaffolding system with multiple AI agents representing distinct social roles: Peer, Group Member, and Facilitator. Users progress through Observer Mode → One-on-One → Small Group interactions, with the AI adapting pacing and complexity to user comfort. Implemented a Rewind & Retry feature so users can explore alternative responses without penalty.",
    architecture:
      "TypeScript + React frontend with a modular agent orchestration layer. LLM-based conversational agents with role-specific prompting strategies. Adaptive interaction flow controller that adjusts conversation complexity based on user engagement signals. Non-evaluative reflection log system for post-session confidence building.",
    features: [
      {
        title: "Multi-Agent Social Simulation",
        description:
          "AI agents model realistic peer-to-peer and group discussion dynamics, each with distinct communication styles and social roles.",
      },
      {
        title: "Gradual Participation Scaffolding",
        description:
          "Three-stage progression — Observer Mode, One-on-One, and Small Group — lets users build confidence incrementally without pressure.",
      },
      {
        title: "Psychological Safety by Design",
        description:
          "Private, non-judgmental interactions with no scoring, no public exposure, and no forced participation — designed around psychological safety principles.",
      },
      {
        title: "Rewind & Retry",
        description:
          "Users can safely replay any exchange and explore alternative responses without consequence, enabling deliberate social practice.",
      },
      {
        title: "Reflective Feedback",
        description:
          "Non-evaluative post-session reflections help users recognize progress and build intrinsic confidence over time.",
      },
      {
        title: "Adaptive Interaction Flow",
        description:
          "Conversation pacing and social complexity automatically adjust based on real-time user comfort signals.",
      },
    ],
    challenges: [
      {
        challenge:
          "Designing AI agents that feel socially authentic without being overwhelming",
        learned:
          "Developed role-specific prompting strategies for each agent type (Peer, Facilitator, Group Member) with controlled response length and social complexity that scales with the user's chosen exposure level.",
      },
      {
        challenge:
          "Balancing HCI research rigor with a working interactive prototype",
        learned:
          "Grounded all design decisions in psychological safety theory and user-centered design principles, maintaining a clear separation between research contributions and prototype implementation scope.",
      },
    ],
    results: [
      {
        metric: "Research Contribution",
        value: "HCI",
        description: "Accepted as an HCI research contribution on AI for social participation",
      },
      {
        metric: "Interaction Modes",
        value: "3",
        description: "Observer, One-on-One, and Small Group — progressive scaffolding stages",
      },
      {
        metric: "Agent Roles",
        value: "3",
        description: "Peer, Group Member, and Facilitator — distinct social simulation agents",
      },
    ],
  },
  {
    id: "3",
    slug: "chefmate",
    title: "ChefMate",
    description:
      "An AI-powered recipe discovery web app that uses NLP and machine learning to suggest personalized dishes from whatever ingredients a user has at home.",
    role: "Full Stack Developer & ML Engineer",
    impact: "Built and trained an ML model on a 643MB Kaggle recipe dataset, achieving accurate cuisine and recipe predictions from unstructured ingredient lists using NLP normalization and fuzzy matching.",
    image: "/images/projects/chefmate.jpg",
    tags: ["Python", "Flask", "spaCy", "Scikit-learn", "FuzzyWuzzy", "HTML", "CSS"],
    liveUrl: "#",
    sourceUrl: "https://github.com/Tanjamul-Azad/ChefMate",
    featured: true,
    overview:
      "ChefMate is an AI-powered recipe assistant that understands what ingredients you have and recommends the best matching dishes. It combines NLP-based ingredient normalization, fuzzy matching, and a trained ML model to intelligently bridge the gap between a nearly-empty fridge and a great meal.",
    problem:
      "Users often have a handful of ingredients but no idea what to cook. Traditional recipe search requires exact ingredient names and fails with typos, plural forms, or synonyms. There was no intelligent system that could understand natural language ingredient lists and suggest genuinely matching recipes.",
    solution:
      "Built a Flask web application with an NLP pipeline using spaCy for lemmatization and synonym normalization, and FuzzyWuzzy for tolerating typos and variations. Trained a Scikit-learn ML model on a 643MB Kaggle recipe dataset to predict cuisine types and recipe names from ingredient combinations. Added dropdown filters for cuisine, diet type, and meal type for refined discovery.",
    architecture:
      "Flask backend serving a responsive HTML/CSS/JS frontend. NLP pipeline: spaCy lemmatization → synonym normalization → FuzzyWuzzy matching against the recipe database. ML layer: Scikit-learn classifier trained on cleaned Kaggle recipe CSV with ingredient-to-cuisine mapping. model.pkl for fast inference without retraining on each request.",
    features: [
      {
        title: "NLP Ingredient Normalization",
        description:
          "spaCy lemmatization and synonym mapping intelligently handles variations like 'tomatoes' → 'tomato', ensuring accurate matching regardless of how ingredients are entered.",
      },
      {
        title: "Fuzzy Matching Engine",
        description:
          "FuzzyWuzzy-powered matching tolerates typos and minor variations, comparing user inputs against the full recipe database with confidence scores.",
      },
      {
        title: "ML Cuisine Prediction",
        description:
          "A trained Scikit-learn model predicts likely cuisine type and recipe name from ingredient lists, learning flavor patterns from thousands of real recipes.",
      },
      {
        title: "Smart Filters",
        description:
          "Dropdown filters for cuisine, diet type (vegetarian, vegan, etc.), and meal type enable refined discovery beyond simple ingredient matching.",
      },
    ],
    challenges: [
      {
        challenge: "Handling the diversity of natural language ingredient inputs",
        learned:
          "Combined lemmatization, synonym dictionaries, and fuzzy matching in a layered pipeline, progressively normalizing inputs before matching against the dataset.",
      },
      {
        challenge: "Training an accurate model on a large, noisy recipe dataset",
        learned:
          "Implemented a data cleaning pipeline (prepare.py) to normalize ingredient lists, remove noise, and engineer meaningful features before training, significantly improving prediction accuracy.",
      },
    ],
    results: [
      {
        metric: "Dataset Size",
        value: "643MB",
        description: "Kaggle recipe dataset used for ML model training",
      },
      {
        metric: "Matching Strategy",
        value: "3-layer",
        description: "Lemmatization → Synonym mapping → Fuzzy matching pipeline",
      },
      {
        metric: "Prediction Targets",
        value: "2",
        description: "Cuisine type and recipe name predicted from ingredient input",
      },
    ],
  },
  {
    id: "4",
    slug: "ihmt",
    title: "Integrated Healthcare Management System",
    description:
      "A comprehensive hospital management platform connecting patients, doctors, and blood banks — with appointment scheduling, medical records, AI chatbot, and prescription management.",
    role: "Full Stack Developer",
    impact: "Delivered a complete multi-role healthcare system covering patient management, doctor dashboards, blood bank integration, and an AI chatbot — consolidating fragmented hospital workflows into one platform.",
    image: "/images/projects/ihmt.jpg",
    tags: ["PHP", "MySQL", "HTML", "CSS", "JavaScript", "AI Chatbot"],
    liveUrl: "#",
    sourceUrl: "https://github.com/Tanjamul-Azad/Integrated-Healthcare-Management-System",
    featured: false,
    overview:
      "IHMT is a full-featured hospital management system that connects patients, doctors, and blood banks into a unified digital platform. It streamlines appointment booking, medical record management, prescription handling, and real-time blood bank availability — with an integrated AI chatbot for patient guidance.",
    problem:
      "Healthcare facilities in Bangladesh rely on fragmented manual systems for patient registration, appointment scheduling, and blood bank management. There is no unified platform connecting patients with doctors and critical medical resources, leading to delays, errors, and poor patient outcomes.",
    solution:
      "Built a multi-module PHP/MySQL web application with role-based access for patients, doctors, and administrators. Implemented end-to-end appointment workflows, digitized medical records and prescriptions, and integrated a blood bank module with real-time availability tracking. Added an AI chatbot module for first-line patient guidance and symptom triage.",
    architecture:
      "PHP backend with modular architecture (admin, patient, doctor, blood_bank, chatbot modules). MySQL relational database with normalized schema for patients, appointments, records, and prescriptions. HTML/CSS/JavaScript frontend with responsive design. Session-based authentication with role-based view rendering.",
    features: [
      {
        title: "Multi-Role Dashboard",
        description:
          "Separate, role-scoped dashboards for patients, doctors, and administrators — each with tailored views, permissions, and workflows.",
      },
      {
        title: "Appointment Booking System",
        description:
          "Patients book appointments with specific doctors, with real-time availability and automated confirmation. Doctors manage their schedules and view upcoming cases.",
      },
      {
        title: "Blood Bank Management",
        description:
          "Real-time blood type availability tracking with donor management, cross-matching records, and emergency request workflows.",
      },
      {
        title: "Medical Records & Prescriptions",
        description:
          "Doctors create and manage digital prescriptions and full patient history. Patients access their complete medical timeline securely.",
      },
      {
        title: "AI Chatbot",
        description:
          "Integrated chatbot module for patient guidance, symptom triage, and directing users to appropriate services within the platform.",
      },
    ],
    challenges: [
      {
        challenge: "Designing a normalized schema for complex healthcare relationships",
        learned:
          "Carefully modeled many-to-many relationships between patients, doctors, appointments, and records using junction tables and foreign key constraints to maintain data integrity across modules.",
      },
      {
        challenge: "Securing sensitive patient data with role-based access",
        learned:
          "Implemented server-side session validation on every request, preventing unauthorized cross-role data access while keeping the codebase maintainable.",
      },
    ],
    results: [
      {
        metric: "Modules",
        value: "5",
        description: "Admin, Patient, Doctor, Blood Bank, and AI Chatbot",
      },
      {
        metric: "User Roles",
        value: "3",
        description: "Fully scoped dashboards for patients, doctors, and administrators",
      },
      {
        metric: "Core Workflows",
        value: "4",
        description: "Appointments, medical records, prescriptions, and blood bank",
      },
    ],
  },
  {
    id: "5",
    slug: "care-companion",
    title: "Care Companion",
    description:
      "An AI + IoT smart healthcare assistant built on Raspberry Pi 4 and Arduino that monitors patient vitals, detects emergencies, delivers medication reminders, and enables voice-controlled operation.",
    role: "Embedded Systems & AI Developer",
    impact: "Designed and built a fully functional hardware prototype that combines real-time biomedical sensing, AI-based human detection, voice commands, and a web dashboard — demonstrating smart healthcare for elderly and home care.",
    image: "/images/projects/care-companion.jpg",
    tags: ["Python", "Raspberry Pi", "Arduino", "OpenCV", "MobileNetSSD", "Flask", "IoT"],
    liveUrl: "#",
    sourceUrl: "https://github.com/Tanjamul-Azad/Silicon-Squad-",
    featured: false,
    overview:
      "Care Companion is an AI-powered IoT healthcare rover built for elderly and home patient care. Running on Raspberry Pi 4 with Arduino sensor integration, it continuously monitors temperature, pulse rate, gas levels, and fire hazards — while offering voice command control, AI-based human detection, automated medication reminders, and a real-time caregiver dashboard.",
    problem:
      "Elderly patients and home-care patients often lack continuous monitoring between caregiver visits. Emergency situations like falls, fire hazards, or sudden health deterioration go undetected. Medication non-adherence is a major cause of preventable complications.",
    solution:
      "Built a mobile healthcare rover with Raspberry Pi 4 as the AI controller and Arduino UNO for sensor communication. Integrated MobileNetSSD for real-time human detection and intelligent movement. Implemented a voice trigger system (e.g., 'Come Kiki') for hands-free operation. Built a servo-controlled medication drawer with automated reminders. Added a Flask-based web dashboard for caregivers to monitor vitals and receive alerts in real time.",
    architecture:
      "Raspberry Pi 4 (core AI + web server) communicates with Arduino UNO over serial for sensor data. Python scripts handle camera-based human detection (MobileNetSSD + OpenCV), voice trigger recognition, motor control (L298N driver), and servo actuation. Flask web app exposes a real-time monitoring dashboard. DHT11, Pulse Sensor, MQ-2, and flame sensor data stream continuously to the dashboard database.",
    features: [
      {
        title: "AI Human Detection & Navigation",
        description:
          "MobileNetSSD model detects humans and QR codes in real time via the Raspberry Pi camera, enabling intelligent movement and obstacle avoidance.",
      },
      {
        title: "Voice Command Control",
        description:
          "Recognizes natural voice commands like 'Come Kiki' and 'Go' for hands-free, accessible operation — critical for patients with limited mobility.",
      },
      {
        title: "Biomedical Vital Monitoring",
        description:
          "Continuously measures body temperature (DHT11) and heart rate (Pulse Sensor Amped), streaming data to the caregiver dashboard in real time.",
      },
      {
        title: "Automated Medication Reminder",
        description:
          "Servo-controlled medicine drawer opens automatically at set intervals with an audible buzzer alert — ensuring consistent medication adherence.",
      },
      {
        title: "Hazard Detection & Emergency Alerts",
        description:
          "MQ-2 gas sensor and IR flame module detect hazards instantly, triggering audio/LED alerts and sending notifications to caregivers.",
      },
      {
        title: "Real-time Caregiver Dashboard",
        description:
          "Flask-based web dashboard displays live vitals, alert logs, and system status — accessible from any device on the local network.",
      },
    ],
    challenges: [
      {
        challenge: "Synchronizing real-time sensor data between Arduino and Raspberry Pi",
        learned:
          "Implemented a reliable serial communication protocol with error handling and data buffering, ensuring no sensor readings are dropped even during motor activity.",
      },
      {
        challenge: "Running MobileNetSSD inference in real time on low-power hardware",
        learned:
          "Optimized the inference pipeline by reducing frame resolution, using OpenCV's DNN module with pre-compiled Caffe weights, and dropping frames during motor operations to maintain smooth performance.",
      },
    ],
    results: [
      {
        metric: "Sensors",
        value: "4",
        description: "Temperature, pulse, gas, and flame — continuous real-time monitoring",
      },
      {
        metric: "AI Models",
        value: "2",
        description: "MobileNetSSD for human detection and voice trigger recognition",
      },
      {
        metric: "Hardware Stack",
        value: "RPi 4 + Arduino",
        description: "Production hardware prototype — not a simulation",
      },
    ],
  },
];

export const getFeaturedProjects = () => projects.filter((p) => p.featured);
export const getProjectById = (id: string) => projects.find((p) => p.id === id);
export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug);
export const getAllProjectSlugs = () => projects.map((p) => p.slug);
