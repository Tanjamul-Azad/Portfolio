import type { BlogPost } from "@/types";

export const blogPosts: BlogPost[] = [
  {
    slug: "building-complete-legal-aid-production",
    title: "Building Complete Legal Aid for Production",
    excerpt:
      "Lessons from shipping a legal technology platform with role-based dashboards, real-time messaging, and AI drafting workflows.",
    content: `
# Building Complete Legal Aid for Production

Complete Legal Aid is a legal technology platform where citizens, lawyers, and admins collaborate in one system.

## My Role

I worked as Frontend Lead and Full-Stack Contributor.

## What I Built

- Full frontend experience for 3 user roles
- Real-time chat interface with attachments and read receipts
- Booking and payment UI flows
- AI drafting integration for legal document assistance

## Core Stack

- React 19 + TypeScript + Vite
- Django + WebSocket
- Firebase notifications
- GCP-backed deployment services

## Key Outcome

The AI drafting flow reduced document preparation time from around 45 minutes to under 3 minutes.

## Takeaway

In legal-tech products, workflow clarity matters as much as raw features. Reliable role separation and communication flow made the platform usable in real scenarios.
    `,
    date: "2026-01-20",
    readTime: "5 min read",
    tags: ["React", "TypeScript", "Django", "WebSocket", "Legal Tech"],
    featured: true,
  },
  {
    slug: "chefmate-nlp-and-ml-pipeline",
    title: "ChefMate: NLP + ML Pipeline from User Input to Recipe",
    excerpt:
      "How I used spaCy, fuzzy matching, and scikit-learn to build a practical recipe recommendation workflow.",
    content: `
# ChefMate: NLP + ML Pipeline from User Input to Recipe

ChefMate is an AI-powered recipe suggestion app I built as a solo developer.

## Problem

Ingredient input is usually messy: spelling errors, synonyms, and inconsistent naming.

## Pipeline

1. Normalize ingredients with spaCy
2. Handle input variation with FuzzyWuzzy
3. Predict cuisine and recipe candidates with scikit-learn
4. Return filtered suggestions through a Flask app

## Dataset

I trained models using a 643MB recipe dataset and focused heavily on preprocessing quality.

## Result

The NLP + fuzzy matching pipeline improved ingredient recognition by around 70% on noisy input scenarios.

## Takeaway

For practical ML products, input normalization often drives quality more than model complexity.
    `,
    date: "2025-11-08",
    readTime: "6 min read",
    tags: ["Python", "Flask", "NLP", "scikit-learn", "spaCy"],
    featured: true,
  },
  {
    slug: "care-companion-ai-iot-system-design",
    title: "Care Companion: Designing an AI + IoT Healthcare Rover",
    excerpt:
      "Software architecture notes from building a Raspberry Pi + Arduino healthcare monitoring rover with real-time vision.",
    content: `
# Care Companion: Designing an AI + IoT Healthcare Rover

Care Companion combines AI and IoT for home-care monitoring.

## My Scope

I implemented all software modules and led the team workflow.

## Software Modules

- Sensor data collection pipeline
- Voice command handling
- Motor control logic
- Flask dashboard for caregiver monitoring
- OpenCV + MobileNetSSD vision inference

## Hardware Integration

- Raspberry Pi 4 as AI core
- Arduino for sensor communication
- DHT11, MQ-2, pulse, and flame sensors

## Measured Result

Real-time human detection ran at around 60 FPS on Raspberry Pi 4 during testing.

## Takeaway

Stable embedded software boundaries (sensing, control, dashboard, vision) are essential for reliable AI + IoT systems.
    `,
    date: "2025-09-28",
    readTime: "5 min read",
    tags: ["AI", "IoT", "OpenCV", "Raspberry Pi", "Flask"],
    featured: false,
  },
];

export const getBlogPosts = () => blogPosts;
export const getFeaturedPosts = () => blogPosts.filter((p) => p.featured);
export const getPostBySlug = (slug: string) => blogPosts.find((p) => p.slug === slug);
export const getAllPostSlugs = () => blogPosts.map((p) => p.slug);
