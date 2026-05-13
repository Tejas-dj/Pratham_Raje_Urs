"use client";

import React, { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

interface CameraLensProps {
  mouseX: number;
  mouseY: number;
}

export default function CameraLens({ mouseX, mouseY }: CameraLensProps) {
  const groupRef = useRef<THREE.Group>(null);
  const bladeGroupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const targetAngle = useRef(0);
  const currentAngle = useRef(0);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Lerp position toward mouse
    groupRef.current.position.x += (mouseX * 1.2 - groupRef.current.position.x) * 0.08;
    groupRef.current.position.y += (mouseY * 0.8 - groupRef.current.position.y) * 0.08;

    // Aperture open/close animation
    targetAngle.current = hovered ? 0.6 : 0;
    currentAngle.current += (targetAngle.current - currentAngle.current) * 6 * delta;

    if (bladeGroupRef.current) {
      bladeGroupRef.current.children.forEach((child, i) => {
        (child as THREE.Mesh).rotation.z = (i * Math.PI * 2) / 6 + currentAngle.current;
      });
    }

    // Subtle rotation wobble
    groupRef.current.rotation.z = mouseX * 0.05;
  });

  // Aperture blade geometry
  const bladeShape = new THREE.Shape();
  bladeShape.moveTo(0, 0);
  bladeShape.quadraticCurveTo(0.06, 0.18, 0, 0.32);
  bladeShape.quadraticCurveTo(-0.06, 0.18, 0, 0);

  const bladeGeometry = new THREE.ShapeGeometry(bladeShape);

  return (
    <group
      ref={groupRef}
      position={[0, 0, -0.5]}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Outer lens barrel */}
      <mesh>
        <torusGeometry args={[0.38, 0.02, 8, 64]} />
        <meshStandardMaterial
          color="#d4af77"
          metalness={0.9}
          roughness={0.2}
          emissive="#d4af77"
          emissiveIntensity={0.15}
        />
      </mesh>

      {/* Middle ring */}
      <mesh>
        <torusGeometry args={[0.32, 0.01, 8, 64]} />
        <meshStandardMaterial
          color="#a08040"
          metalness={0.8}
          roughness={0.3}
        />
      </mesh>

      {/* Inner lens glass */}
      <mesh position={[0, 0, 0.01]}>
        <circleGeometry args={[0.3, 64]} />
        <meshStandardMaterial
          color="#0a1520"
          metalness={0.1}
          roughness={0}
          transparent
          opacity={0.85}
          envMapIntensity={2}
        />
      </mesh>

      {/* Aperture blades */}
      <group ref={bladeGroupRef} position={[0, 0, 0.02]}>
        {Array.from({ length: 6 }).map((_, i) => (
          <mesh
            key={i}
            geometry={bladeGeometry}
            rotation={[0, 0, (i * Math.PI * 2) / 6]}
          >
            <meshStandardMaterial
              color="#0d0d0d"
              metalness={0.5}
              roughness={0.6}
              side={THREE.DoubleSide}
            />
          </mesh>
        ))}
      </group>

      {/* Center dot (lens reflection) */}
      <mesh position={[0.04, 0.04, 0.03]}>
        <circleGeometry args={[0.025, 16]} />
        <meshStandardMaterial
          color="#7ed4d4"
          emissive="#7ed4d4"
          emissiveIntensity={0.5}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Gold glow point light */}
      <pointLight
        position={[0, 0, 0.5]}
        color="#d4af77"
        intensity={hovered ? 2 : 0.8}
        distance={3}
      />
    </group>
  );
}
