"use client";

import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useVideoTexture } from "@react-three/drei";
import * as THREE from "three";

interface FilmStrip3DProps {
  videoSrc: string;
  position: [number, number, number];
  rotation: [number, number, number];
  index: number;
}

function VideoFrame({
  videoSrc,
  floatOffset,
  position,
  rotation,
}: {
  videoSrc: string;
  floatOffset: number;
  position: [number, number, number];
  rotation: [number, number, number];
}) {
  const meshRef = useRef<THREE.Mesh>(null);
  const texture = useVideoTexture(videoSrc, {
    muted: true,
    loop: true,
    start: true,
    crossOrigin: "anonymous",
  });

  useFrame(({ clock }) => {
    if (!meshRef.current) return;
    const t = clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(t * 0.4 + floatOffset) * 0.25;
    meshRef.current.rotation.z = rotation[2] + Math.sin(t * 0.25 + floatOffset) * 0.04;
    meshRef.current.position.x = position[0] + Math.sin(t * 0.18 + floatOffset) * 0.1;
  });

  return (
    <mesh ref={meshRef} position={[0, 0, 0.001]}>
      <planeGeometry args={[1.8, 1.2]} />
      <meshBasicMaterial map={texture} transparent opacity={0.9} toneMapped={false} />
    </mesh>
  );
}

export default function FilmStrip3D({ videoSrc, position, rotation, index }: FilmStrip3DProps) {
  const floatOffset = (index * Math.PI * 2) / 3;

  return (
    <group position={position} rotation={rotation}>
      {/* Strip background */}
      <mesh>
        <planeGeometry args={[2.2, 1.6]} />
        <meshBasicMaterial color="#111823" transparent opacity={0.9} />
      </mesh>

      {/* Video frame — useVideoTexture handles autoplay + browser policy */}
      <VideoFrame
        videoSrc={videoSrc}
        floatOffset={floatOffset}
        position={position}
        rotation={rotation}
      />

      {/* Top perforations */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`top-${i}`} position={[-1.1 + i * 0.44, 0.7, 0.002]}>
          <planeGeometry args={[0.14, 0.18]} />
          <meshBasicMaterial color="#111823" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Bottom perforations */}
      {Array.from({ length: 6 }).map((_, i) => (
        <mesh key={`bot-${i}`} position={[-1.1 + i * 0.44, -0.7, 0.002]}>
          <planeGeometry args={[0.14, 0.18]} />
          <meshBasicMaterial color="#111823" transparent opacity={0.8} />
        </mesh>
      ))}

      {/* Frame border */}
      <mesh position={[0, 0, 0.003]}>
        <planeGeometry args={[1.82, 1.22]} />
        <meshBasicMaterial color="#AA9273" transparent opacity={0.15} wireframe />
      </mesh>
    </group>
  );
}
