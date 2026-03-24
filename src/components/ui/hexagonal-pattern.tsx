"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface HexagonalPatternProps {
  className?: string;
  hexSize?: number;
  numHexagons?: number;
  strokeWidth?: number;
  maxOpacity?: number;
  animationDuration?: number;
}

interface Hexagon {
  id: number;
  x: number;
  y: number;
  delay: number;
}

export function HexagonalPattern({
  className,
  hexSize = 60,
  numHexagons = 30,
  strokeWidth = 1.5,
  maxOpacity = 0.3,
  animationDuration = 2,
  ...props
}: HexagonalPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [hexagons, setHexagons] = useState<Hexagon[]>([]);

  // Generate hexagon path
  const getHexagonPath = (size: number) => {
    const points: [number, number][] = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      const x = size * Math.cos(angle);
      const y = size * Math.sin(angle);
      points.push([x, y]);
    }
    return `M ${points.map((p) => p.join(",")).join(" L ")} Z`;
  };

  // Initialize hexagons
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const newHexagons: Hexagon[] = [];

      for (let i = 0; i < numHexagons; i++) {
        newHexagons.push({
          id: i,
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          delay: Math.random() * 2,
        });
      }

      setHexagons(newHexagons);
    }
  }, [dimensions, numHexagons]);

  // Resize observer
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.unobserve(container);
    };
  }, []);

  const hexPath = getHexagonPath(hexSize / 2);

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full",
        className,
      )}
      {...props}
    >
      <defs>
        {/* Gradient for hexagons */}
        <linearGradient id={`hex-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.6" />
          <stop offset="50%" stopColor="rgb(147, 51, 234)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity="0.6" />
        </linearGradient>

        {/* Glow filter */}
        <filter id={`hex-glow-${id}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Hexagonal grid pattern (static background) */}
      <pattern
        id={`hex-pattern-${id}`}
        x="0"
        y="0"
        width={hexSize * 1.5}
        height={hexSize * Math.sqrt(3)}
        patternUnits="userSpaceOnUse"
      >
        <g transform={`translate(${hexSize * 0.75}, ${(hexSize * Math.sqrt(3)) / 2})`}>
          <path
            d={hexPath}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth * 0.5}
            opacity={0.1}
          />
        </g>
      </pattern>

      <rect width="100%" height="100%" fill={`url(#hex-pattern-${id})`} />

      {/* Animated hexagons */}
      <g className="animated-hexagons">
        {hexagons.map((hex) => (
          <motion.g
            key={hex.id}
            initial={{ opacity: 0, scale: 0.3, rotate: -180 }}
            animate={{
              opacity: [0, maxOpacity, maxOpacity, 0],
              scale: [0.3, 1, 1, 1.2],
              rotate: [0, 0, 0, 180],
            }}
            transition={{
              duration: animationDuration * 3,
              delay: hex.delay,
              repeat: Infinity,
              repeatDelay: 1,
              ease: "easeInOut",
            }}
          >
            <g transform={`translate(${hex.x}, ${hex.y})`}>
              <path
                d={hexPath}
                fill="none"
                stroke={`url(#hex-gradient-${id})`}
                strokeWidth={strokeWidth}
                filter={`url(#hex-glow-${id})`}
              />
              {/* Inner hexagon for tech effect */}
              <motion.path
                d={getHexagonPath(hexSize / 3)}
                fill="none"
                stroke={`url(#hex-gradient-${id})`}
                strokeWidth={strokeWidth * 0.7}
                opacity={0.6}
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: animationDuration * 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
              />
            </g>
          </motion.g>
        ))}
      </g>

      {/* Floating particles for extra tech feel */}
      <g className="tech-particles">
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.circle
            key={`particle-${i}`}
            cx={Math.random() * dimensions.width}
            cy={Math.random() * dimensions.height}
            r={Math.random() * 2 + 1}
            fill="currentColor"
            initial={{ opacity: 0 }}
            animate={{
              opacity: [0, 0.6, 0],
              y: [0, -50],
            }}
            transition={{
              duration: animationDuration * 2,
              delay: Math.random() * 2,
              repeat: Infinity,
              repeatDelay: Math.random() * 3,
              ease: "easeOut",
            }}
          />
        ))}
      </g>
    </svg>
  );
}
