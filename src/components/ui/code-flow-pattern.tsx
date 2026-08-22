"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface CodeFlowPatternProps {
  className?: string;
  numElements?: number;
  flowSpeed?: number;
  maxOpacity?: number;
}

interface CodeElement {
  id: number;
  x: number;
  y: number;
  text: string;
  size: number;
  duration: number;
  delay: number;
}

const codeSymbols = [
  "{ }",
  "< >",
  "[ ]",
  "( )",
  "=>",
  "&&",
  "||",
  "===",
  "!==",
  "++",
  "--",
  "fn",
  "var",
  "let",
  "const",
  "if",
  "else",
  "for",
  "map",
  "filter",
  "async",
  "await",
  "return",
  "import",
  "export",
  "class",
  "extends",
  "new",
  "this",
  "void",
  "null",
  "true",
  "false",
  "0x",
  "0b",
  "//",
  "/**/",
  "=>{}",
  "...",
  "??",
  "?.",
];

/**
 * Deterministic stand-in for Math.random(), keyed on an index and a channel.
 *
 * These decorative values are computed during render, which runs on the server
 * too — Math.random() there produced different numbers than the client and broke
 * hydration ("server rendered text didn't match the client"). A pure function of
 * the index gives the same scatter on both sides, so the markup matches.
 */
function noise(index: number, channel: number): number {
  const x = Math.sin((index + 1) * 12.9898 + channel * 78.233) * 43758.5453;
  return x - Math.floor(x);
}

export function CodeFlowPattern({
  className,
  numElements = 40,
  flowSpeed = 15,
  maxOpacity = 0.25,
  ...props
}: CodeFlowPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [elements, setElements] = useState<CodeElement[]>([]);

  // Initialize code elements
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const newElements: CodeElement[] = [];

      for (let i = 0; i < numElements; i++) {
        newElements.push({
          id: i,
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          text: codeSymbols[Math.floor(Math.random() * codeSymbols.length)],
          size: Math.random() * 12 + 10,
          duration: flowSpeed + Math.random() * 10,
          delay: Math.random() * 5,
        });
      }

      setElements(newElements);
    }
  }, [dimensions, numElements, flowSpeed]);

  const binaryDrops = useMemo(
    () =>
      Array.from({ length: 20 }, (_, i) => ({
        duration: 8 + noise(i, 1) * 4,
        delay: noise(i, 2) * 3,
        bit: noise(i, 3) > 0.5 ? "1" : "0",
      })),
    []
  );

  const syntaxLines = useMemo(
    () =>
      Array.from({ length: 8 }, (_, i) => {
        const startFraction = noise(i, 4) * 0.3;
        return {
          startX: startFraction * dimensions.width,
          endX: (startFraction + noise(i, 5) * 0.4) * dimensions.width,
        };
      }),
    [dimensions.width]
  );

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

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-none absolute inset-0 h-full w-full overflow-visible",
        className,
      )}
      {...props}
    >
      <defs>
        {/* Gradient for code elements */}
        <linearGradient id={`code-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8" />
          <stop offset="33%" stopColor="rgb(147, 51, 234)" stopOpacity="0.6" />
          <stop offset="66%" stopColor="rgb(236, 72, 153)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity="0.8" />
        </linearGradient>

        {/* Blur filter for glow effect */}
        <filter id={`code-blur-${id}`}>
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.5" />
        </filter>

        {/* Grid pattern background */}
        <pattern
          id={`code-grid-${id}`}
          width="40"
          height="40"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            opacity="0.05"
          />
        </pattern>
      </defs>

      {/* Background grid */}
      <rect width="100%" height="100%" fill={`url(#code-grid-${id})`} />

      {/* Flowing code elements */}
      <g className="code-elements">
        {elements.map((element) => (
          <motion.g
            key={element.id}
            initial={{
              x: element.x,
              y: element.y,
              opacity: 0,
            }}
            animate={{
              x: [element.x, element.x - 100],
              y: [element.y, element.y - 50],
              opacity: [0, maxOpacity, maxOpacity, 0],
            }}
            transition={{
              duration: element.duration,
              delay: element.delay,
              repeat: Infinity,
              ease: "linear",
            }}
          >
            {/* Glow effect */}
            <text
              fontSize={element.size}
              fontFamily="'Fira Code', 'JetBrains Mono', 'Consolas', monospace"
              fontWeight="600"
              fill={`url(#code-gradient-${id})`}
              filter={`url(#code-blur-${id})`}
            >
              {element.text}
            </text>
            {/* Main text */}
            <text
              fontSize={element.size}
              fontFamily="'Fira Code', 'JetBrains Mono', 'Consolas', monospace"
              fontWeight="500"
              fill="currentColor"
              opacity="0.9"
            >
              {element.text}
            </text>
          </motion.g>
        ))}
      </g>

      {/* Binary rain effect */}
      <g className="binary-rain">
        {Array.from({ length: 20 }).map((_, i) => {
          const x = (i * dimensions.width) / 20;
          return (
            <motion.text
              key={`binary-${i}`}
              x={x}
              fontSize="10"
              fontFamily="monospace"
              fill="currentColor"
              initial={{ y: 0, opacity: 0 }}
              animate={{
                y: [0, dimensions.height + 100],
                opacity: [0, 0.15, 0.15, 0],
              }}
              transition={{
                duration: binaryDrops[i].duration,
                delay: binaryDrops[i].delay,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              {binaryDrops[i].bit}
            </motion.text>
          );
        })}
      </g>

      {/* Syntax highlighting lines */}
      <g className="syntax-lines">
        {syntaxLines.map(({ startX, endX }, i) => {
          const y = (i * dimensions.height) / 8;

          return (
            <motion.line
              key={`line-${i}`}
              x1={startX}
              y1={y}
              x2={endX}
              y2={y}
              stroke={`url(#code-gradient-${id})`}
              strokeWidth="1"
              strokeDasharray="4 8"
              initial={{ opacity: 0, pathLength: 0 }}
              animate={{
                opacity: [0, 0.2, 0],
                pathLength: [0, 1, 1],
              }}
              transition={{
                duration: 3,
                delay: i * 0.5,
                repeat: Infinity,
                repeatDelay: 2,
                ease: "easeInOut",
              }}
            />
          );
        })}
      </g>
    </svg>
  );
}
