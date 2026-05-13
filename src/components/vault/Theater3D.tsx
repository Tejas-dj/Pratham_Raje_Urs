"use client";

import React, { useRef, useState, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Text, Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import type { Project } from "@/types";
import Image from "next/image";

function TheaterRoom() {
  return (
    <>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#0a0a0a" roughness={0.9} metalness={0.1} />
      </mesh>

      {/* Ceiling */}
      <mesh rotation={[Math.PI / 2, 0, 0]} position={[0, 4, 0]}>
        <planeGeometry args={[30, 20]} />
        <meshStandardMaterial color="#080808" roughness={1} />
      </mesh>

      {/* Back wall */}
      <mesh position={[0, 0.5, -8]}>
        <planeGeometry args={[30, 10]} />
        <meshStandardMaterial color="#0d0d0d" roughness={0.95} />
      </mesh>

      {/* Screen */}
      <mesh position={[0, 0.5, -7.8]}>
        <planeGeometry args={[10, 5.6]} />
        <meshStandardMaterial
          color="#fff8f0"
          emissive="#fff8f0"
          emissiveIntensity={0.05}
          roughness={0.4}
        />
      </mesh>

      {/* Left wall */}
      <mesh rotation={[0, Math.PI / 2, 0]} position={[-8, 0.5, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.95} />
      </mesh>

      {/* Right wall */}
      <mesh rotation={[0, -Math.PI / 2, 0]} position={[8, 0.5, 0]}>
        <planeGeometry args={[20, 10]} />
        <meshStandardMaterial color="#0c0c0c" roughness={0.95} />
      </mesh>
    </>
  );
}

function PosterPlane({
  project,
  position,
  rotation,
  onClick,
}: {
  project: Project;
  position: [number, number, number];
  rotation: [number, number, number];
  onClick: () => void;
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const posterTexture = useTexture(project.poster || "/images/image_tester_1.png");

  useFrame((_, delta) => {
    if (!meshRef.current) return;
    const targetY = hovered ? position[1] + 0.08 : position[1];
    meshRef.current.position.y += (targetY - meshRef.current.position.y) * 6 * delta;
  });

  return (
    <group position={position} rotation={rotation}>
      <mesh
        ref={meshRef}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <planeGeometry args={[1.6, 2.4]} />
        <meshStandardMaterial
          map={posterTexture}
          color={hovered ? "#d4af77" : "#ffffff"}
          emissive={hovered ? "#d4af77" : "#000000"}
          emissiveIntensity={hovered ? 0.08 : 0}
          roughness={0.5}
          toneMapped={false}
        />
      </mesh>

      {/* Border */}
      <mesh position={[0, 0, 0.001]}>
        <planeGeometry args={[1.64, 2.44]} />
        <meshBasicMaterial
          color={hovered ? "rgba(212,175,119,0.6)" : "rgba(212,175,119,0.15)"}
          transparent
          opacity={hovered ? 0.6 : 0.15}
          wireframe
        />
      </mesh>

      {/* Title using HTML overlay */}
      <Html
        position={[0, -1.4, 0.01]}
        center
        style={{ pointerEvents: "none" }}
      >
        <div
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: 8,
            fontWeight: 700,
            color: hovered ? "#d4af77" : "rgba(245,240,232,0.5)",
            letterSpacing: "0.15em",
            textAlign: "center",
            whiteSpace: "nowrap",
            textTransform: "uppercase",
            padding: "2px 4px",
            background: "rgba(0,0,0,0.8)",
          }}
        >
          {project.title.length > 20 ? project.title.slice(0, 20) + "…" : project.title}
        </div>
      </Html>
    </group>
  );
}

function ProjectorBeam({ active }: { active: boolean }) {
  const lightRef = useRef<THREE.SpotLight>(null);

  useFrame((_, delta) => {
    if (!lightRef.current) return;
    const targetIntensity = active ? 8 : 0.5;
    lightRef.current.intensity += (targetIntensity - lightRef.current.intensity) * 4 * delta;
  });

  return (
    <spotLight
      ref={lightRef}
      position={[0, 3.8, 2]}
      target-position={[0, 0.5, -8]}
      angle={0.28}
      penumbra={0.5}
      intensity={0.5}
      color="#fff8f0"
      castShadow
    />
  );
}

function SceneCamera({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x += (mouseX * 1.5 - camera.position.x) * 0.03;
    camera.position.y += (mouseY * 0.5 + 0.2 - camera.position.y) * 0.03;
    camera.lookAt(0, 0.2, -4);
  });

  return null;
}

interface Theater3DProps {
  projects: Project[];
  onProjectClick: (project: Project) => void;
}

const POSTER_POSITIONS: [number, number, number][] = [
  [-5.5, 0.5, -5],
  [-3.5, 0.5, -6],
  [-1.5, 0.5, -7],
  [1.5, 0.5, -7],
  [3.5, 0.5, -6],
  [5.5, 0.5, -5],
];

const POSTER_ROTATIONS: [number, number, number][] = [
  [0, 0.3, 0],
  [0, 0.15, 0],
  [0, 0.05, 0],
  [0, -0.05, 0],
  [0, -0.15, 0],
  [0, -0.3, 0],
];

export default function Theater3D({ projects, onProjectClick }: Theater3DProps) {
  const mouse = useMousePosition();
  const [anyHovered, setAnyHovered] = useState(false);

  return (
    <div style={{ width: "100%", height: "70vh", position: "relative" }}>
      <Canvas
        camera={{ position: [0, 0.5, 4], fov: 70, near: 0.1, far: 50 }}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        shadows
      >
        <Suspense fallback={null}>
          <SceneCamera mouseX={mouse.normalizedX} mouseY={mouse.normalizedY} />

          <ambientLight intensity={0.15} color="#1a1520" />
          <ProjectorBeam active={anyHovered} />
          <pointLight position={[0, 2, 0]} intensity={0.3} color="#d4af77" />

          <TheaterRoom />

          {projects.slice(0, 6).map((project, i) => (
            <PosterPlane
              key={project.id}
              project={project}
              position={POSTER_POSITIONS[i]}
              rotation={POSTER_ROTATIONS[i]}
              onClick={() => onProjectClick(project)}
            />
          ))}

          <Environment preset="night" />
        </Suspense>
      </Canvas>

      {/* Theater instruction */}
      <div
        style={{
          position: "absolute",
          bottom: 20,
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 10,
          letterSpacing: "0.3em",
          color: "rgba(212,175,119,0.35)",
          textTransform: "uppercase",
          textAlign: "center",
          pointerEvents: "none",
        }}
      >
        Move mouse to look around · Click a poster to screen
      </div>
    </div>
  );
}
