"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, Sphere } from "@react-three/drei";
import * as THREE from "three";
import type { Service } from "@/types";

interface LensOrbProps {
  service: Service;
  orbitRadius: number;
  orbitSpeed: number;
  orbitOffset: number;
  onSelect: (service: Service) => void;
}

export default function LensOrb({ service, orbitRadius, orbitSpeed, orbitOffset, onSelect }: LensOrbProps) {
  const groupRef = useRef<THREE.Group>(null);
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const hoverProgress = useRef(0);

  useFrame(({ clock }, delta) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    // Orbit in XZ plane
    const angle = t * orbitSpeed + orbitOffset;
    const targetX = Math.cos(angle) * orbitRadius;
    const targetZ = Math.sin(angle) * orbitRadius * 0.6;
    const targetY = Math.sin(t * 0.4 + orbitOffset) * 0.4;

    groupRef.current.position.x = targetX;
    groupRef.current.position.z = targetZ;
    groupRef.current.position.y = targetY;

    // Scale up on hover
    const targetScale = hovered ? 1.5 : 1;
    hoverProgress.current += (targetScale - hoverProgress.current) * 6 * delta;
    groupRef.current.scale.setScalar(hoverProgress.current);

    // Rotate slowly
    if (meshRef.current) {
      meshRef.current.rotation.y = t * 0.3;
      meshRef.current.rotation.x = t * 0.15;
    }
  });

  return (
    <group
      ref={groupRef}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onClick={() => onSelect(service)}
    >
      {/* Glass sphere */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[0.6, 32, 32]} />
        <meshPhysicalMaterial
          color={service.color}
          transparent
          opacity={0.25}
          roughness={0}
          metalness={0.1}
          transmission={0.8}
          thickness={0.5}
          envMapIntensity={2}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Inner glow sphere */}
      <mesh>
        <sphereGeometry args={[0.4, 16, 16]} />
        <meshStandardMaterial
          color={service.color}
          emissive={service.color}
          emissiveIntensity={hovered ? 0.6 : 0.15}
          transparent
          opacity={0.4}
        />
      </mesh>

      {/* Outer ring */}
      <mesh rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.65, 0.012, 8, 64]} />
        <meshStandardMaterial
          color={service.color}
          emissive={service.color}
          emissiveIntensity={hovered ? 0.8 : 0.2}
          metalness={0.8}
          roughness={0.1}
        />
      </mesh>

      {/* Label */}
      {hovered && (
        <Html center position={[0, 1.2, 0]} style={{ pointerEvents: "none" }}>
          <div
            style={{
              background: "rgba(0,0,0,0.85)",
              border: `1px solid ${service.color}40`,
              borderRadius: 2,
              padding: "6px 12px",
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 10,
              fontWeight: 700,
              color: service.color,
              letterSpacing: "0.15em",
              textTransform: "uppercase",
              whiteSpace: "nowrap",
              textAlign: "center",
              backdropFilter: "blur(8px)",
            }}
          >
            {service.title.split(" ").slice(0, 3).join(" ")}
          </div>
        </Html>
      )}

      {/* Point light for orb glow */}
      <pointLight
        color={service.color}
        intensity={hovered ? 3 : 0.8}
        distance={4}
      />
    </group>
  );
}
