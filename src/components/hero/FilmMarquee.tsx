"use client";

import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";

const STRIP_IMAGES = [
  { src: "/images/She asked for Sunflowers.jpeg", title: "She Asked for Sunflowers" },
  { src: "/images/The Christmas Guest.jpeg", title: "The Christmas Guest" },
  { src: "/images/Before The Coffee Gets Cold.jpeg", title: "Before The Coffee Gets Cold" },
  { src: "/images/DOT..jpeg", title: "DOT." },
  { src: "/images/V_motionblur.webp", title: "Motion" },
  { src: "/images/Beach_Couple.webp", title: "Coastal Love" },
  { src: "/images/Model_Team.webp", title: "The Ensemble" },
  { src: "/images/Two_women.webp", title: "Monsoon Walk" },
  { src: "/images/Beach_Scenic.webp", title: "Karnataka Coast" },
  { src: "/images/still_bts.webp", title: "Behind The Frame" },
  { src: "/images/still_christmas.png", title: "Festive Warmth" },
  { src: "/images/still_dot.png", title: "Existence" },
];

function SprocketHoles({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "0 12px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 14,
            borderRadius: 2,
            background: "rgba(17,24,35,0.9)",
            border: "1px solid rgba(170,146,115,0.15)",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

function FilmFrame({ src, title, index }: { src: string; title: string; index: number }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: 200,
        flexShrink: 0,
        background: "#0a0e14",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid rgba(170,146,115,0.12)",
        transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        boxShadow: isHovered
          ? "0 0 30px rgba(170,146,115,0.3), 0 0 60px rgba(31,85,96,0.15)"
          : "0 2px 20px rgba(0,0,0,0.4)",
        cursor: "pointer",
      }}
    >
      {/* Sprocket holes top */}
      <div style={{ padding: "6px 0 4px" }}>
        <SprocketHoles count={13} />
      </div>

      {/* Image frame */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 120,
          overflow: "hidden",
          margin: "0 auto",
        }}
      >
        <Image
          src={src}
          alt={title}
          fill
          sizes="200px"
          style={{
            objectFit: "cover",
            transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1), filter 0.5s ease",
            transform: isHovered ? "scale(1.12)" : "scale(1)",
            filter: isHovered ? "brightness(1.1) saturate(1.2)" : "brightness(0.85) saturate(0.9)",
          }}
        />

        {/* Film frame counter */}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            right: 8,
            fontFamily: "var(--font-inter), monospace",
            fontSize: 9,
            letterSpacing: "0.15em",
            color: "rgba(170,146,115,0.5)",
            textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          }}
        >
          {String(index + 1).padStart(2, "0")}A
        </div>

        {/* Title overlay on hover */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "24px 12px 8px",
            background: "linear-gradient(transparent, rgba(10,14,20,0.9))",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#AA9273",
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
        </div>
      </div>

      {/* Sprocket holes bottom */}
      <div style={{ padding: "4px 0 6px" }}>
        <SprocketHoles count={13} />
      </div>
    </div>
  );
}

export default function FilmMarquee() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const topImages = STRIP_IMAGES.slice(0, 6);
  const bottomImages = STRIP_IMAGES.slice(6);

  const gap = isMobile ? 12 : 18;

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#111823",
        padding: isMobile ? "24px 0" : "40px 0",
      }}
    >
      {/* Top strip — scrolls left */}
      <div
        style={{
          position: "relative",
          marginBottom: isMobile ? 10 : 16,
          transform: "rotate(-1.5deg)",
          transformOrigin: "center center",
        }}
      >
        {/* Edge fade left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to right, #111823, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Edge fade right */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to left, #111823, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div
          className="marquee-strip"
          style={{
            display: "flex",
            gap,
            width: "max-content",
            animation: `marquee-scroll-left ${isMobile ? 14 : 20}s linear infinite`,
          }}
        >
          {[...topImages, ...topImages, ...topImages, ...topImages].map((img, i) => (
            <FilmFrame key={`top-${i}`} src={img.src} title={img.title} index={i % topImages.length} />
          ))}
        </div>
      </div>

      {/* Bottom strip — scrolls right */}
      <div
        style={{
          position: "relative",
          transform: "rotate(1.5deg)",
          transformOrigin: "center center",
        }}
      >
        {/* Edge fade left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to right, #111823, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Edge fade right */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to left, #111823, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div
          className="marquee-strip"
          style={{
            display: "flex",
            gap,
            width: "max-content",
            animation: `marquee-scroll-right ${isMobile ? 16 : 24}s linear infinite`,
          }}
        >
          {[...bottomImages, ...bottomImages, ...bottomImages, ...bottomImages].map((img, i) => (
            <FilmFrame key={`bot-${i}`} src={img.src} title={img.title} index={i % bottomImages.length + 6} />
          ))}
        </div>
      </div>

      {/* Projector light glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "80%",
          background: "radial-gradient(ellipse, rgba(170,146,115,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </section>
  );
}
