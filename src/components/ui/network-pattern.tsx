"use client";

import { useEffect, useId, useRef, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NetworkPatternProps {
  className?: string;
  numNodes?: number;
  connectionDistance?: number;
  nodeSize?: number;
  animationSpeed?: number;
  lineOpacity?: number;
  nodeOpacity?: number;
}

interface Node {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

interface Connection {
  from: Node;
  to: Node;
  distance: number;
}

export function NetworkPattern({
  className,
  numNodes = 25,
  connectionDistance = 150,
  nodeSize = 4,
  animationSpeed = 0.3,
  lineOpacity = 0.2,
  nodeOpacity = 0.6,
  ...props
}: NetworkPatternProps) {
  const id = useId();
  const containerRef = useRef<SVGSVGElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [nodes, setNodes] = useState<Node[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Initialize nodes
  useEffect(() => {
    if (dimensions.width && dimensions.height) {
      const newNodes: Node[] = [];

      for (let i = 0; i < numNodes; i++) {
        newNodes.push({
          id: i,
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
          vx: (Math.random() - 0.5) * animationSpeed,
          vy: (Math.random() - 0.5) * animationSpeed,
          radius: Math.random() * nodeSize + 2,
        });
      }

      setNodes(newNodes);
    }
  }, [dimensions, numNodes, animationSpeed, nodeSize]);

  // Animate nodes
  useEffect(() => {
    if (nodes.length === 0) return;

    const animate = () => {
      setNodes((prevNodes) =>
        prevNodes.map((node) => {
          let newX = node.x + node.vx;
          let newY = node.y + node.vy;
          let newVx = node.vx;
          let newVy = node.vy;

          // Bounce off walls
          if (newX < 0 || newX > dimensions.width) {
            newVx = -node.vx;
            newX = Math.max(0, Math.min(dimensions.width, newX));
          }
          if (newY < 0 || newY > dimensions.height) {
            newVy = -node.vy;
            newY = Math.max(0, Math.min(dimensions.height, newY));
          }

          return {
            ...node,
            x: newX,
            y: newY,
            vx: newVx,
            vy: newVy,
          };
        })
      );

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [nodes.length, dimensions]);

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

  // Calculate connections
  const connections: Connection[] = [];
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const dx = nodes[i].x - nodes[j].x;
      const dy = nodes[i].y - nodes[j].y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < connectionDistance) {
        connections.push({
          from: nodes[i],
          to: nodes[j],
          distance,
        });
      }
    }
  }

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
        {/* Gradient for connections */}
        <linearGradient id={`network-gradient-${id}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="0.8" />
          <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity="0.6" />
          <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0.8" />
        </linearGradient>

        {/* Radial gradient for nodes */}
        <radialGradient id={`node-gradient-${id}`}>
          <stop offset="0%" stopColor="rgb(59, 130, 246)" stopOpacity="1" />
          <stop offset="50%" stopColor="rgb(139, 92, 246)" stopOpacity="0.8" />
          <stop offset="100%" stopColor="rgb(236, 72, 153)" stopOpacity="0.6" />
        </radialGradient>

        {/* Glow filter for nodes */}
        <filter id={`node-glow-${id}`}>
          <feGaussianBlur stdDeviation="2" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Pulse animation for data packets */}
        <circle id={`data-packet-${id}`} r="2" fill="rgb(245, 158, 11)" opacity="0.8">
          <animate
            attributeName="r"
            values="1;3;1"
            dur="1.5s"
            repeatCount="indefinite"
          />
        </circle>
      </defs>

      {/* Connection lines */}
      <g className="connections">
        {connections.map((conn, index) => {
          const opacity = Math.max(0, (1 - conn.distance / connectionDistance) * lineOpacity);
          return (
            <line
              key={`connection-${index}`}
              x1={conn.from.x}
              y1={conn.from.y}
              x2={conn.to.x}
              y2={conn.to.y}
              stroke={`url(#network-gradient-${id})`}
              strokeWidth="1"
              opacity={opacity}
              strokeLinecap="round"
            />
          );
        })}
      </g>

      {/* Data packets traveling on connections (only on some lines) */}
      <g className="data-packets">
        {connections.slice(0, Math.min(5, connections.length)).map((conn, index) => (
          <motion.circle
            key={`packet-${index}`}
            r="2"
            fill="rgb(245, 158, 11)"
            filter={`url(#node-glow-${id})`}
            initial={{
              cx: conn.from.x,
              cy: conn.from.y,
              opacity: 0,
            }}
            animate={{
              cx: [conn.from.x, conn.to.x, conn.from.x],
              cy: [conn.from.y, conn.to.y, conn.from.y],
              opacity: [0, 0.8, 0],
            }}
            transition={{
              duration: 3,
              delay: index * 0.6,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </g>

      {/* Nodes */}
      <g className="nodes">
        {nodes.map((node) => (
          <g key={node.id}>
            {/* Outer pulse ring */}
            <motion.circle
              cx={node.x}
              cy={node.y}
              r={node.radius}
              fill="none"
              stroke={`url(#node-gradient-${id})`}
              strokeWidth="1"
              initial={{ scale: 1, opacity: nodeOpacity }}
              animate={{
                scale: [1, 1.8, 1],
                opacity: [nodeOpacity, 0, nodeOpacity],
              }}
              transition={{
                duration: 2,
                delay: node.id * 0.1,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            {/* Main node */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.radius}
              fill={`url(#node-gradient-${id})`}
              opacity={nodeOpacity}
              filter={`url(#node-glow-${id})`}
            />
            {/* Inner bright core */}
            <circle
              cx={node.x}
              cy={node.y}
              r={node.radius * 0.4}
              fill="rgb(255, 255, 255)"
              opacity="0.8"
            />
          </g>
        ))}
      </g>

      {/* Floating communication icons/signals */}
      <g className="signals">
        {Array.from({ length: 6 }).map((_, i) => {
          const startX = Math.random() * dimensions.width;
          const startY = Math.random() * dimensions.height;
          return (
            <motion.g
              key={`signal-${i}`}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 0.4, 0],
              }}
              transition={{
                duration: 2,
                delay: i * 0.8,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            >
              <motion.path
                d={`M ${startX} ${startY} Q ${startX + 30} ${startY - 20}, ${startX + 60} ${startY}`}
                fill="none"
                stroke="rgb(59, 130, 246)"
                strokeWidth="1.5"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{
                  duration: 1.5,
                  delay: i * 0.8,
                  repeat: Infinity,
                  repeatDelay: 2.5,
                }}
              />
            </motion.g>
          );
        })}
      </g>
    </svg>
  );
}
