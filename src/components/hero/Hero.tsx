"use client";

import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import HeroText from "./HeroText";
import HeroShowreel from "./HeroShowreel";
import { useReducedMotion } from "@/hooks/useReducedMotion";

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
        minHeight: isMobile ? "85vh" : "100vh",
        height: "100svh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#111823",
      }}
      aria-label="Hero: Pratham Raje Urs"
    >
      {/* ── Layer 1: Fullscreen video showreel (all devices) ── */}
      <HeroShowreel />



      {/* Film grain overlay — kept at very low opacity for hero video only */}
      <div
        style={{
          position: "absolute",
          inset: "-100%",
          pointerEvents: "none",
          zIndex: 6,
          opacity: 0.02,
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
          animation: "grain-shift 8s steps(10) infinite",
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
          padding: "0 24px",
        }}
      >
        <HeroText ready={ready} />

      </div>

    </section>
  );
}
