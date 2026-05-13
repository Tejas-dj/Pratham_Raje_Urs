"use client";

import React, { useRef, Suspense } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Plane } from "@react-three/drei";
import * as THREE from "three";
import { useMousePosition } from "@/hooks/useMousePosition";
import { parallaxBlendFrag, filmGrainVert } from "@/shaders";
import CameraLens from "./CameraLens";
import FilmStrip3D from "./FilmStrip3D";

function BackgroundPlane({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const matRef = useRef<THREE.ShaderMaterial>(null);
  const timeRef = useRef(0);

  useFrame((_, delta) => {
    timeRef.current += delta;
    if (matRef.current) {
      matRef.current.uniforms.uParallax.value.set(mouseX, mouseY);
      matRef.current.uniforms.uBlend.value = 0.3 + Math.sin(timeRef.current * 0.05) * 0.05;
    }
  });

  return (
    <Plane args={[16, 9]} position={[0, 0, -3.5]}>
      <shaderMaterial
        ref={matRef}
        vertexShader={filmGrainVert}
        fragmentShader={parallaxBlendFrag}
        uniforms={{
          uTexture1: { value: null },
          uTexture2: { value: null },
          uBlend: { value: 0.3 },
          uParallax: { value: new THREE.Vector2(0, 0) },
        }}
        transparent={false}
        attach="material"
      />
    </Plane>
  );
}

function GradientBackground() {
  return (
    <Plane args={[20, 12]} position={[0, 0, -4]}>
      <meshBasicMaterial color="#0a0a0a" />
    </Plane>
  );
}

function SceneCamera({ mouseX, mouseY }: { mouseX: number; mouseY: number }) {
  const { camera } = useThree();

  useFrame(() => {
    camera.position.x += (mouseX * 0.3 - camera.position.x) * 0.04;
    camera.position.y += (mouseY * 0.2 - camera.position.y) * 0.04;
  });

  return null;
}

interface HeroSceneProps {
  className?: string;
}

export default function HeroScene({ className }: HeroSceneProps) {
  const mouse = useMousePosition();

  const FILM_STRIPS = [
    { src: "/videos/sample_video.mp4", pos: [-3.5, 0.5, -1.2] as [number, number, number], rot: [0.05, 0.15, -0.08] as [number, number, number] },
    { src: "/videos/sample_video.mp4", pos: [3.2, -0.8, -1.8] as [number, number, number], rot: [-0.06, -0.1, 0.1] as [number, number, number] },
    { src: "/videos/sample_video.mp4", pos: [0.2, 1.8, -1.5] as [number, number, number], rot: [0.08, 0.05, 0.05] as [number, number, number] },
  ];

  return (
    <div
      className={className}
      style={{
        position: "absolute",
        inset: 0,
        pointerEvents: "none",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 4], fov: 60, near: 0.1, far: 100 }}
        gl={{
          antialias: false,
          powerPreference: "high-performance",
          alpha: false,
        }}
        dpr={[1, 1.5]}
      >
        <Suspense fallback={null}>
          <SceneCamera mouseX={mouse.normalizedX} mouseY={mouse.normalizedY} />
          <GradientBackground />
          <BackgroundPlane mouseX={mouse.normalizedX} mouseY={mouse.normalizedY} />

          {FILM_STRIPS.map((strip, i) => (
            <FilmStrip3D
              key={i}
              videoSrc={strip.src}
              position={strip.pos}
              rotation={strip.rot}
              index={i}
            />
          ))}

          <CameraLens mouseX={mouse.normalizedX} mouseY={mouse.normalizedY} />

          <ambientLight intensity={0.3} color="#d4af77" />
          <pointLight position={[5, 5, 5]} intensity={1} color="#f5f0e8" />
          <pointLight position={[-5, -3, 2]} intensity={0.5} color="#7ed4d4" />
        </Suspense>
      </Canvas>
    </div>
  );
}
