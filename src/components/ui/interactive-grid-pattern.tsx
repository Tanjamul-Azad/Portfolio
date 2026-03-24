"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface InteractiveGridPatternProps {
  width?: number;
  height?: number;
  numSquares?: number;
  className?: string;
  maxOpacity?: number;
  duration?: number;
  interactionRadius?: number;
  lineColor?: string;
  squareColor?: string;
}

interface Square {
  id: number;
  x: number;
  y: number;
  gridX: number;
  gridY: number;
  opacity: number;
  isActive: boolean;
}

export function InteractiveGridPattern({
  width = 40,
  height = 40,
  numSquares = 50,
  className,
  maxOpacity = 0.6,
  duration = 0.4,
  interactionRadius = 150,
  lineColor = "rgba(245, 158, 11, 0.3)", // amber-500
  squareColor = "currentColor",
  ...props
}: InteractiveGridPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [squares, setSquares] = useState<Square[]>([]);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const animationFrameRef = useRef<number | null>(null);

  // Initialize squares
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const cols = Math.floor(dimensions.width / width);
      const rows = Math.floor(dimensions.height / height);
      const totalSquares = Math.min(cols * rows, numSquares);

      const newSquares: Square[] = [];
      const positions = new Set<string>();

      for (let i = 0; i < totalSquares; i++) {
        let gridX, gridY;
        let posKey;

        // Ensure unique positions
        do {
          gridX = Math.floor(Math.random() * cols);
          gridY = Math.floor(Math.random() * rows);
          posKey = `${gridX}-${gridY}`;
        } while (positions.has(posKey));

        positions.add(posKey);

        newSquares.push({
          id: i,
          gridX,
          gridY,
          x: gridX * width,
          y: gridY * height,
          opacity: 0,
          isActive: false,
        });
      }

      setSquares(newSquares);
    }
  }, [dimensions, numSquares, width, height]);

  // Update square states based on mouse position
  useEffect(() => {
    if (squares.length === 0) return;

    const updateSquares = () => {
      setSquares((prev) =>
        prev.map((square) => {
          const dx = mousePos.x - (square.x + width / 2);
          const dy = mousePos.y - (square.y + height / 2);
          const distance = Math.sqrt(dx * dx + dy * dy);

          const isActive = distance < interactionRadius;
          const opacity = isActive
            ? Math.max(0, 1 - distance / interactionRadius) * maxOpacity
            : 0;

          return { ...square, opacity, isActive };
        })
      );
    };

    animationFrameRef.current = requestAnimationFrame(updateSquares);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [mousePos, squares.length, width, height, interactionRadius, maxOpacity]);

  // Track mouse position
  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: -1000, y: -1000 });
  };

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

  // Get active squares for constellation lines
  const activeSquares = squares.filter((s) => s.isActive);
  const connectionLines: Array<[Square, Square]> = [];

  // Create connections between nearby active squares
  for (let i = 0; i < activeSquares.length; i++) {
    for (let j = i + 1; j < activeSquares.length; j++) {
      const sq1 = activeSquares[i];
      const sq2 = activeSquares[j];
      const dx = sq1.x - sq2.x;
      const dy = sq1.y - sq2.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < interactionRadius * 0.8) {
        connectionLines.push([sq1, sq2]);
      }
    }
  }

  return (
    <svg
      ref={containerRef}
      aria-hidden="true"
      className={cn(
        "pointer-events-auto absolute inset-0 h-full w-full fill-gray-400/30 stroke-gray-400/30",
        className,
      )}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <defs>
        <pattern
          id={`grid-${id}`}
          width={width}
          height={height}
          patternUnits="userSpaceOnUse"
        >
          <path
            d={`M.5 ${height}V.5H${width}`}
            fill="none"
            strokeDasharray={0}
          />
        </pattern>
      </defs>

      {/* Base grid */}
      <rect width="100%" height="100%" fill={`url(#grid-${id})`} />

      {/* Constellation lines */}
      <g className="constellation-lines">
        {connectionLines.map(([sq1, sq2], index) => {
          const opacity = Math.min(sq1.opacity, sq2.opacity);
          return (
            <motion.line
              key={`line-${sq1.id}-${sq2.id}-${index}`}
              x1={sq1.x + width / 2}
              y1={sq1.y + height / 2}
              x2={sq2.x + width / 2}
              y2={sq2.y + height / 2}
              stroke={lineColor}
              strokeWidth="1"
              initial={{ opacity: 0 }}
              animate={{ opacity }}
              transition={{ duration: duration * 0.5 }}
            />
          );
        })}
      </g>

      {/* Interactive squares */}
      <g className="interactive-squares">
        {squares.map((square) => (
          <motion.rect
            key={square.id}
            width={width - 1}
            height={height - 1}
            x={square.x + 1}
            y={square.y + 1}
            fill={squareColor}
            strokeWidth="0"
            animate={{ opacity: square.opacity }}
            transition={{ duration }}
          />
        ))}
      </g>

      {/* Mouse glow effect */}
      {mousePos.x > 0 && mousePos.y > 0 && (
        <motion.circle
          cx={mousePos.x}
          cy={mousePos.y}
          r={interactionRadius * 0.3}
          fill="url(#mouseGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          exit={{ opacity: 0 }}
        />
      )}

      <defs>
        <radialGradient id="mouseGlow">
          <stop offset="0%" stopColor="rgb(245, 158, 11)" stopOpacity="0.4" />
          <stop offset="100%" stopColor="rgb(245, 158, 11)" stopOpacity="0" />
        </radialGradient>
      </defs>
    </svg>
  );
}
