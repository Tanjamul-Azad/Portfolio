"use client";

import { useRef, useState, useEffect } from "react";
import type { ComponentProps } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Points, PointMaterial } from "@react-three/drei";
import * as THREE from "three";

function Particles(props: Omit<ComponentProps<typeof Points>, "positions">) {
  const ref = useRef<THREE.Points>(null!);

  // Generate particles in a sphere manually to avoid NaN issues
  const [sphere, setSphere] = useState<Float32Array | null>(null);

  useEffect(() => {
    const count = 5000;
    const radius = 1.5;
    const points = new Float32Array(count * 3);

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const r = Math.cbrt(Math.random()) * radius;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      points[i * 3] = x;
      points[i * 3 + 1] = y;
      points[i * 3 + 2] = z;
    }
    const timer = setTimeout(() => setSphere(points), 0);
    return () => clearTimeout(timer);
  }, []);

  useFrame((state, delta) => {
    if (ref.current) {
      ref.current.rotation.x -= delta / 10;
      ref.current.rotation.y -= delta / 15;
    }
  });

  if (!sphere) return null;

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#f59e0b" // Amber/Gold color matching the theme
          size={0.005}
          sizeAttenuation={true}
          depthWrite={false}
        />
      </Points>
    </group>
  );
}

export function Scene3D() {
  return (
    <div className="absolute inset-0 z-0 opacity-50 dark:opacity-80 pointer-events-none">
      <Canvas camera={{ position: [0, 0, 3] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} />
        <Particles />
        {/* <FloatingShape />  -- Optional: Uncomment for a solid shape instead of particles */}
      </Canvas>
    </div>
  );
}
