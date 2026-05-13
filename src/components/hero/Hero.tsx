"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HeroText from "./HeroText";
import HeroButtons from "./HeroButtons";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const HeroScene = dynamic(() => import("./HeroScene"), {
  ssr: false,
  loading: () => null,
});

interface HeroProps {
  preloaderDone: boolean;
}

export default function Hero({ preloaderDone }: HeroProps) {
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (preloaderDone) {
      const delay = reduced ? 0 : 400;
      const t = setTimeout(() => setReady(true), delay);
      return () => clearTimeout(t);
    }
  }, [preloaderDone, reduced]);

  return (
    <section
      id="hero"
      style={{
        position: "relative",
        width: "100%",
        height: "100vh",
        minHeight: 600,
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
      }}
      aria-label="Hero — Pratham Raje Urs"
    >
      {/* 3D WebGL scene (desktop only) */}
      {!isMobile && !reduced && <HeroScene />}

      {/* Mobile fallback bg */}
      {isMobile && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `
              radial-gradient(ellipse at 30% 40%, rgba(212,175,119,0.08) 0%, transparent 60%),
              radial-gradient(ellipse at 70% 70%, rgba(126,212,212,0.05) 0%, transparent 50%),
              #0a0a0a
            `,
          }}
        />
      )}

      {/* Scan line overlay */}
      <div
        className="film-scan-line"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 2,
          opacity: 0.4,
        }}
        aria-hidden
      />

      {/* Vignette */}
      <div
        className="film-vignette"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 3,
        }}
        aria-hidden
      />

      {/* Content layer */}
      <div
        style={{
          position: "relative",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          padding: "80px 24px 24px",
        }}
      >
        <HeroText ready={ready} />
        <HeroButtons ready={ready} />
      </div>

      {/* Scroll indicator */}
      {ready && (
        <div
          style={{
            position: "absolute",
            bottom: 32,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 8,
            animation: "float-slow 3s ease-in-out infinite",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 9,
              letterSpacing: "0.4em",
              color: "rgba(212,175,119,0.4)",
              textTransform: "uppercase",
            }}
          >
            Scroll
          </span>
          <svg width="20" height="30" viewBox="0 0 20 30" fill="none">
            <rect x="1" y="1" width="18" height="28" rx="9" stroke="rgba(212,175,119,0.3)" strokeWidth="1" />
            <rect x="9" y="6" width="2" height="8" rx="1" fill="rgba(212,175,119,0.6)">
              <animateTransform
                attributeName="transform"
                type="translate"
                values="0 0; 0 8; 0 0"
                dur="1.8s"
                repeatCount="indefinite"
              />
            </rect>
          </svg>
        </div>
      )}
    </section>
  );
}
