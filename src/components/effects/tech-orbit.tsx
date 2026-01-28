"use client";

import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Line, Sphere, Stars } from "@react-three/drei";
import * as THREE from "three";

function Electron({ radius = 2, speed = 1, ...props }) {
  const ref = useRef<THREE.Mesh>(null!);
  useFrame((state) => {
    const t = state.clock.getElapsedTime() * speed;
    ref.current.position.set(Math.sin(t) * radius, (Math.cos(t) * radius * Math.atan(t)) / Math.PI, 0);
  });
  return (
    <group {...props}>
      <mesh ref={ref}>
        <sphereGeometry args={[0.05]} />
        <meshBasicMaterial color="#f59e0b" toneMapped={false} />
      </mesh>
    </group>
  );
}

function Atom() {
  return (
    <group rotation={[Math.PI / 4, Math.PI / 4, 0]}>
        <Float speed={4} rotationIntensity={1} floatIntensity={2}>
            <Sphere args={[0.3, 32, 32]} >
                 <meshStandardMaterial color="#f59e0b" emissive="#f59e0b" emissiveIntensity={0.5} roughness={0} />
            </Sphere>
            <Electron radius={1.5} speed={2} rotation={[0, 0, 0]} />
            <Electron radius={1.7} speed={2.5} rotation={[0, Math.PI / 3, 0]} />
            <Electron radius={1.9} speed={3} rotation={[0, -Math.PI / 3, 0]} />
        </Float>
    </group>
  );
}


function NeuralConnections() {
    const points = useMemo(() => {
        const p = [];
        for (let i = 0; i < 30; i++) {
            p.push(
                new THREE.Vector3(
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4,
                    (Math.random() - 0.5) * 4
                )
            );
        }
        return p;
    }, []);

    const lineRef = useRef<any>(null);

    useFrame((state) => {
        if(lineRef.current) {
            lineRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
        }
    });

    return (
        <group ref={lineRef}>
            {points.map((point, i) => (
                <Sphere key={i} position={point} args={[0.03, 10, 10]}>
                    <meshBasicMaterial color="#f59e0b" transparent opacity={0.6} />
                </Sphere>
            ))}
            <Line
                points={points}
                color="#f59e0b"
                lineWidth={0.5}
                opacity={0.2}
                transparent
            />
        </group>
    );
}

export function TechOrbit() {
  return (
    <div className="absolute inset-0 z-0 pointer-events-none fade-in-0 zoom-in-95 duration-1000">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} intensity={1.5} />
        <Atom />
        <NeuralConnections />
        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
      </Canvas>
    </div>
  );
}
