"use client";

import { useEffect, useId, useRef } from "react";
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
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
}

/**
 * Ambient drifting-node backdrop.
 *
 * Deliberately renders to <canvas> and mutates node positions in a ref rather
 * than React state: the previous SVG version called setState inside
 * requestAnimationFrame, which re-rendered ~100 DOM nodes 60 times a second for
 * the whole time the page was open. It also runs only while the element is
 * actually on screen, and not at all under prefers-reduced-motion.
 */
export function NetworkPattern({
  className,
  numNodes = 25,
  connectionDistance = 150,
  nodeSize = 4,
  animationSpeed = 0.3,
  lineOpacity = 0.2,
  nodeOpacity = 0.6,
}: NetworkPatternProps) {
  const id = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let nodes: Node[] = [];
    let width = 0;
    let height = 0;
    let frameId = 0;
    let onScreen = false;

    const seed = () => {
      nodes = Array.from({ length: numNodes }, () => ({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * animationSpeed,
        vy: (Math.random() - 0.5) * animationSpeed,
        radius: Math.random() * nodeSize + 2,
      }));
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = rect.width;
      height = rect.height;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      if (nodes.length === 0) seed();
      // Keep existing nodes inside the new bounds instead of re-seeding (which
      // would make the whole field visibly jump on every resize).
      for (const node of nodes) {
        node.x = Math.min(node.x, width);
        node.y = Math.min(node.y, height);
      }
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      // Connections first so nodes sit on top of the lines.
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const distance = Math.hypot(dx, dy);
          if (distance >= connectionDistance) continue;

          ctx.globalAlpha = (1 - distance / connectionDistance) * lineOpacity;
          ctx.strokeStyle = "rgb(139, 92, 246)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.stroke();
        }
      }

      for (const node of nodes) {
        ctx.globalAlpha = nodeOpacity;
        ctx.fillStyle = "rgb(99, 102, 241)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        ctx.fill();

        ctx.globalAlpha = nodeOpacity * 0.85;
        ctx.fillStyle = "rgba(255,255,255,0.9)";
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius * 0.4, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.globalAlpha = 1;
    };

    const step = () => {
      for (const node of nodes) {
        node.x += node.vx;
        node.y += node.vy;
        if (node.x <= 0 || node.x >= width) {
          node.vx = -node.vx;
          node.x = Math.max(0, Math.min(width, node.x));
        }
        if (node.y <= 0 || node.y >= height) {
          node.vy = -node.vy;
          node.y = Math.max(0, Math.min(height, node.y));
        }
      }
      draw();
      frameId = requestAnimationFrame(step);
    };

    const start = () => {
      if (frameId || reducedMotion) return;
      frameId = requestAnimationFrame(step);
    };

    const stop = () => {
      if (!frameId) return;
      cancelAnimationFrame(frameId);
      frameId = 0;
    };

    const resizeObserver = new ResizeObserver(() => {
      resize();
      if (reducedMotion || !onScreen) draw();
    });
    resizeObserver.observe(canvas);

    // Only burn frames while the section is actually visible.
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        onScreen = entry.isIntersecting;
        if (onScreen) start();
        else stop();
      },
      { threshold: 0 }
    );
    intersectionObserver.observe(canvas);

    // ...and pause entirely when the tab is backgrounded.
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (onScreen) start();
    };
    document.addEventListener("visibilitychange", onVisibility);

    resize();
    draw();

    return () => {
      stop();
      resizeObserver.disconnect();
      intersectionObserver.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [numNodes, connectionDistance, nodeSize, animationSpeed, lineOpacity, nodeOpacity]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      data-network-pattern={id}
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    />
  );
}
