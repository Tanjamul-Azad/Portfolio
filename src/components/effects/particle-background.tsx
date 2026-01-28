"use client";

import { useSyncExternalStore, useMemo } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useTheme } from "next-themes";

interface Particle {
  id: number;
  size: number;
  left: number;
  top: number;
  duration: number;
  delay: number;
}

// Generate particles deterministically based on seed
function generateParticles(): Particle[] {
  return Array.from({ length: 30 }, (_, i) => ({
    id: i,
    size: ((i * 7 + 3) % 30) / 10 + 1,
    left: ((i * 13 + 7) % 100),
    top: ((i * 17 + 11) % 100),
    duration: ((i * 11 + 5) % 15) + 15,
    delay: ((i * 19 + 3) % 10),
  }));
}

// Custom hook to detect client-side mounting without useEffect setState
function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export function ParticleBackground() {
  const isClient = useIsClient();
  const { resolvedTheme } = useTheme();
  const prefersReducedMotion = useReducedMotion();

  // Generate particles with consistent values
  const particles = useMemo(() => generateParticles(), []);

  if (!isClient) return null;
  
  // Disable particle animations for users who prefer reduced motion
  if (prefersReducedMotion) {
    return null;
  }

  const isDark = resolvedTheme === "dark";

  return (
    <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
      {/* Floating Particles */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={isDark ? "absolute rounded-full bg-amber-400/20" : "absolute rounded-full bg-amber-500/30"}
          style={{
            width: particle.size,
            height: particle.size,
            left: `${particle.left}%`,
            top: `${particle.top}%`,
          }}
          animate={{
            y: [0, -800],
            opacity: [0, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "linear",
          }}
        />
      ))}

      {/* Ambient Glow Orbs */}
      <motion.div
        className={isDark ? "absolute w-[500px] h-[500px] rounded-full bg-amber-500/3 blur-[120px]" : "absolute w-[500px] h-[500px] rounded-full bg-amber-400/10 blur-[120px]"}
        animate={{
          x: ["-20%", "20%", "-20%"],
          y: ["-20%", "30%", "-20%"],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ top: "10%", left: "10%" }}
      />
      <motion.div
        className={isDark ? "absolute w-[400px] h-[400px] rounded-full bg-orange-500/3 blur-[100px]" : "absolute w-[400px] h-[400px] rounded-full bg-orange-400/10 blur-[100px]"}
        animate={{
          x: ["20%", "-20%", "20%"],
          y: ["30%", "-10%", "30%"],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{ bottom: "10%", right: "10%" }}
      />
    </div>
  );
}
