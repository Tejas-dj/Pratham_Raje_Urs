"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { useMousePosition } from "@/hooks/useMousePosition";
import { getBlurDataUrl } from "@/lib/blur-placeholders";

export default function InteractivePortrait() {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouse = useMousePosition();
  const [scratches, setScratches] = useState<number[]>([]);

  // Generate random scratches on hover
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() > 0.7) {
        setScratches(Array.from({ length: Math.floor(Math.random() * 3) }, () => Math.random()));
      } else {
        setScratches([]);
      }
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // Calculate eye offset based on mouse position relative to container
  const getEyeOffset = () => {
    if (!containerRef.current) return { x: 0, y: 0 };
    const rect = containerRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height * 0.35;
    const dx = (mouse.x - cx) / rect.width;
    const dy = (mouse.y - cy) / rect.height;
    return {
      x: Math.max(-3, Math.min(3, dx * 6)),
      y: Math.max(-2, Math.min(2, dy * 4)),
    };
  };

  const eyeOffset = getEyeOffset();

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: 280,
        flexShrink: 0,
      }}
    >
      {/* Portrait image */}
      <div
        style={{
          position: "relative",
          width: 280,
          height: 380,
          borderRadius: 2,
          overflow: "hidden",
          border: "1px solid rgba(170,146,115,0.2)",
        }}
      >
        <Image
          src="/images/HeadShot_Pratham.jpeg"
          alt="Pratham Raje Urs"
          fill
          priority
          placeholder="blur"
          blurDataURL={getBlurDataUrl("/images/HeadShot_Pratham.jpeg")}
          style={{ objectFit: "cover", filter: "brightness(0.85) contrast(1.1)" }}
          sizes="280px"
        />

        {/* Film grain overlay on portrait */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "rgba(10,10,10,0.15)",
            mixBlendMode: "multiply",
            pointerEvents: "none",
          }}
        />

        {/* Eye tracking overlay (canvas simulation) */}
        <svg
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            pointerEvents: "none",
            opacity: 0,
          }}
        >
          {/* We'd need a face image to do real eye tracking */}
          {/* This creates a subtle highlight effect on eyes area */}
          <ellipse
            cx={`${42 + eyeOffset.x * 0.5}%`}
            cy={`${35 + eyeOffset.y * 0.3}%`}
            rx="4"
            ry="2"
            fill="rgba(255,255,220,0.1)"
          />
          <ellipse
            cx={`${58 + eyeOffset.x * 0.5}%`}
            cy={`${35 + eyeOffset.y * 0.3}%`}
            rx="4"
            ry="2"
            fill="rgba(255,255,220,0.1)"
          />
        </svg>

        {/* Film scratches */}
        {scratches.map((x, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: `${x * 100}%`,
              width: 1,
              background: "rgba(255,255,255,0.6)",
              pointerEvents: "none",
              opacity: 0.7,
              animation: "scratch 0.6s steps(3) forwards",
            }}
          />
        ))}

        {/* Vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.5) 100%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Name plate */}
      <div
        style={{
          marginTop: 14,
          padding: "12px 16px",
          border: "1px solid rgba(170,146,115,0.15)",
          borderRadius: 2,
          background: "rgba(170,146,115,0.04)",
        }}
      >
        <div
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: 13,
            fontWeight: 700,
            color: "#AA9273",
            letterSpacing: "0.15em",
            marginBottom: 4,
          }}
        >
          PRATHAM RAJE URS
        </div>
        <div
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 11,
            color: "rgba(248,244,237,0.4)",
            letterSpacing: "0.1em",
          }}
        >
          Director · DOP · Founder, Talon
        </div>
        <div
          style={{
            marginTop: 8,
            fontFamily: "Courier New, monospace",
            fontSize: 9,
            color: "rgba(170,146,115,0.3)",
            letterSpacing: "0.15em",
          }}
        >
          Born: 04.08.2006 · Mysuru, Karnataka
        </div>
      </div>
    </div>
  );
}
