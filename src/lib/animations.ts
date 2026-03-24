/**
 * Animation variants for Framer Motion
 * All animations respect prefers-reduced-motion via the useReducedMotion hook
 */

import type { Variants } from "framer-motion";

export const MOTION_TOKENS = {
  duration: {
    quick: 0.12,
    regular: 0.22,
    medium: 0.38,
    slow: 0.55,
  },
  stagger: {
    tight: 0.04,
    regular: 0.08,
    loose: 0.12,
  },
  distance: {
    sm: 8,
    md: 16,
    lg: 24,
  },
  easing: {
    premium: [0.22, 1, 0.36, 1] as [number, number, number, number],
  },
};

export const HERO_SEQUENCE = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: MOTION_TOKENS.duration.quick,
        staggerChildren: MOTION_TOKENS.stagger.regular,
      },
    },
  } satisfies Variants,
  item: {
    hidden: { opacity: 0, y: MOTION_TOKENS.distance.md },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: MOTION_TOKENS.duration.slow,
        ease: MOTION_TOKENS.easing.premium,
      },
    },
  } satisfies Variants,
  media: {
    hidden: { opacity: 0, x: 40, y: MOTION_TOKENS.distance.sm },
    visible: {
      opacity: 1,
      x: 0,
      y: 0,
      transition: {
        duration: 0.75,
        ease: MOTION_TOKENS.easing.premium,
      },
    },
  } satisfies Variants,
};

export const SECTION_REVEAL = {
  container: {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: MOTION_TOKENS.duration.quick,
        staggerChildren: MOTION_TOKENS.stagger.regular,
      },
    },
  } satisfies Variants,
  heading: {
    hidden: { opacity: 0, y: MOTION_TOKENS.distance.md },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: MOTION_TOKENS.duration.medium,
        ease: MOTION_TOKENS.easing.premium,
      },
    },
  } satisfies Variants,
  item: {
    hidden: { opacity: 0, y: MOTION_TOKENS.distance.lg },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: MOTION_TOKENS.duration.slow,
        ease: MOTION_TOKENS.easing.premium,
      },
    },
  } satisfies Variants,
};

// Helper to create accessible animations
// Use with Framer Motion's useReducedMotion hook
export const getReducedMotionVariant = (
  fullVariant: Variants,
  reducedVariant: Variants,
  prefersReducedMotion: boolean
): Variants => {
  return prefersReducedMotion ? reducedVariant : fullVariant;
};

// Simple fade only (for reduced motion)
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.3 },
  },
};

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
};

export const fadeInUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.7,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    },
  },
};

// Subtle version for scroll animations
export const fadeInUpSubtle: Variants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    },
  },
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Reduced stagger for subtle effect
export const staggerContainerSubtle: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.05,
      delayChildren: 0.1,
    },
  },
};

export const slideInFromLeft: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    },
  },
};

export const slideInFromRight: Variants = {
  hidden: { opacity: 0, x: 50 },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    },
  },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    },
  },
};

export const letterReveal: Variants = {
  hidden: { y: 100, opacity: 0 },
  visible: (i: number) => ({
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.6,
      delay: i * 0.05,
      ease: [0.215, 0.61, 0.355, 1] as [number, number, number, number],
    },
  }),
};

// Hook helper for components
export const motionConfig = {
  // For viewport-triggered animations
  viewport: { once: true, margin: "-50px" },
  // Reduced motion transition
  reducedTransition: { duration: 0.01 },
};

