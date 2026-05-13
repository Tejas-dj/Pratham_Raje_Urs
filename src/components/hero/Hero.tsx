"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HeroText from "./HeroText";
import HeroButtons from "./HeroButtons";
import HeroShowreel from "./HeroShowreel";
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
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0a0a0a",
      }}
      aria-label="Hero — Pratham Raje Urs"
    >
      {/* ── Layer 1: Fullscreen video showreel (all devices) ── */}
      <HeroShowreel />

      {/* ── Layer 2: 3D WebGL scene, desktop only — blends over the video ── */}
      {!isMobile && !reduced && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            opacity: 0.42,
            mixBlendMode: "screen",
          }}
        >
          <HeroScene />
        </div>
      )}

      {/* Scan line overlay */}
      <div
        className="film-scan-line"
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          zIndex: 5,
          opacity: 0.25,
        }}
        aria-hidden
      />

      {/* Film grain overlay */}
      <div
        style={{
          position: "absolute",
          inset: "-100%",
          pointerEvents: "none",
          zIndex: 6,
          opacity: 0.05,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          animation: "grain-shift 8s steps(10) infinite",
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
          zIndex: 7,
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
            zIndex: 11,
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
