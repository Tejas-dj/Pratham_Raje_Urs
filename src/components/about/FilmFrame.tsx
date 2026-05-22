"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useCursorContext } from "@/providers/CursorProvider";
import { getBlurDataUrl } from "@/lib/blur-placeholders";

interface FilmFrameProps {
  year: string;
  title: string;
  description: string;
  image: string;
  hasVideo?: boolean;
  index: number;
}

export default function FilmFrame({ year, title, description, image, hasVideo, index }: FilmFrameProps) {
  const [hovered, setHovered] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();

  return (
    <motion.div
      onMouseEnter={() => { setHovered(true); setCursor("crosshair"); }}
      onMouseLeave={() => { setHovered(false); resetCursor(); }}
      style={{
        position: "relative",
        width: 280,
        flexShrink: 0,
        background: "#45302A",
        border: `1px solid ${hovered ? "rgba(170,146,115,0.4)" : "rgba(170,146,115,0.12)"}`,
        borderRadius: 2,
        overflow: "hidden",
        transition: "border-color 0.3s ease",
        cursor: "none",
      }}
      whileHover={{ y: -6 }}
      transition={{ type: "spring", stiffness: 300, damping: 25 }}
    >
      {/* Top perforations */}
      <div
        style={{
          height: 20,
          background: "#45302A",
          borderBottom: "1px solid rgba(170,146,115,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 10px",
        }}
        aria-hidden
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{ width: 12, height: 10, border: "1px solid rgba(170,146,115,0.25)", borderRadius: 1, background: "#111823" }}
          />
        ))}
      </div>

      {/* Image area */}
      <div style={{ position: "relative", height: 180, overflow: "hidden" }}>
        <Image
          src={image}
          alt={title}
          fill
          placeholder="blur"
          blurDataURL={getBlurDataUrl(image)}
          style={{
            objectFit: "cover",
            filter: hovered ? "grayscale(0) brightness(0.8)" : "grayscale(0.4) brightness(0.6) sepia(0.2)",
            transition: "filter 0.6s ease",
            transform: hovered ? "scale(1.04)" : "scale(1)",
          }}
          sizes="280px"
        />

        {/* "He Stars In This" type overlay */}
        {hovered && hasVideo && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "rgba(0,0,0,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 40,
                height: 40,
                border: "2px solid rgba(170,146,115,0.7)",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="#AA9273">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}

        {/* Frame counter (top-left) */}
        <div
          style={{
            position: "absolute",
            top: 6,
            left: 6,
            fontFamily: "Courier New, monospace",
            fontSize: 8,
            color: "rgba(170,146,115,0.5)",
            background: "rgba(0,0,0,0.5)",
            padding: "1px 4px",
          }}
        >
          {String(index + 1).padStart(2, "0")} / 06
        </div>
      </div>

      {/* Bottom perforations */}
      <div
        style={{
          height: 20,
          background: "#45302A",
          borderTop: "1px solid rgba(170,146,115,0.1)",
          borderBottom: "1px solid rgba(170,146,115,0.1)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-around",
          padding: "0 10px",
        }}
        aria-hidden
      >
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            style={{ width: 12, height: 10, border: "1px solid rgba(170,146,115,0.25)", borderRadius: 1, background: "#111823" }}
          />
        ))}
      </div>

      {/* Text content */}
      <div style={{ padding: "16px 14px 20px" }}>
        <div
          style={{
            fontFamily: "Courier New, monospace",
            fontSize: 9,
            color: "#AA9273",
            letterSpacing: "0.2em",
            marginBottom: 6,
          }}
        >
          {year}
        </div>
        <h3
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: 14,
            fontWeight: 700,
            color: "#F8F4ED",
            marginBottom: 8,
            letterSpacing: "0.05em",
          }}
        >
          {title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 12,
            color: "rgba(248,244,237,0.5)",
            lineHeight: 1.6,
          }}
        >
          {description}
        </p>
      </div>
    </motion.div>
  );
}
