"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useCursorContext } from "@/providers/CursorProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { Photo } from "@/types";

const ASPECT_HEIGHTS: Record<string, number> = {
  tall: 360,
  wide: 230,
  square: 280,
};

const CORNERS = [
  { top: 6, left: 6, borderTop: "1px solid rgba(170,146,115,0.3)", borderLeft: "1px solid rgba(170,146,115,0.3)" },
  { top: 6, right: 6, borderTop: "1px solid rgba(170,146,115,0.3)", borderRight: "1px solid rgba(170,146,115,0.3)" },
  { bottom: 6, left: 6, borderBottom: "1px solid rgba(170,146,115,0.3)", borderLeft: "1px solid rgba(170,146,115,0.3)" },
  { bottom: 6, right: 6, borderBottom: "1px solid rgba(170,146,115,0.3)", borderRight: "1px solid rgba(170,146,115,0.3)" },
] as const;

interface ContactSheetCardProps {
  photo: Photo;
  index: number;
  onOpen: (index: number) => void;
}

export default function ContactSheetCard({ photo, index, onOpen }: ContactSheetCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });
  const height = ASPECT_HEIGHTS[photo.aspect];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: (index % 3) * 0.09,
        ease: [0.22, 1, 0.36, 1],
      }}
      style={{ breakInside: "avoid", marginBottom: 12, cursor: "none" }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Open ${photo.project}: ${photo.alt}`}
        onClick={() => onOpen(index)}
        onKeyDown={(e) => e.key === "Enter" && onOpen(index)}
        onMouseEnter={() => {
          setHovered(true);
          if (!isMobile) setCursor("crosshair");
        }}
        onMouseLeave={() => {
          setHovered(false);
          if (!isMobile) resetCursor();
        }}
        style={{
          position: "relative",
          width: "100%",
          height,
          overflow: "hidden",
          borderRadius: 2,
          background: "#45302A",
          border: "1px solid rgba(170,146,115,0.18)",
        }}
      >
        {/* Image — "develops" on hover */}
        <motion.img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          animate={{ scale: hovered ? 1.06 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: hovered
              ? "grayscale(0) brightness(0.95) contrast(1.05)"
              : "grayscale(0.6) brightness(0.78) contrast(1.02)",
            transition: "filter 0.5s ease",
          }}
          draggable={false}
        />

        {/* Film-frame corners */}
        {CORNERS.map((cs, ci) => (
          <div
            key={ci}
            style={{ position: "absolute", width: 12, height: 12, pointerEvents: "none", ...cs }}
          />
        ))}

        {/* Frame number */}
        <div
          style={{
            position: "absolute",
            top: 8,
            right: 10,
            fontFamily: "'Courier New', monospace",
            fontSize: 8,
            color: "rgba(170,146,115,0.25)",
            letterSpacing: "0.15em",
            pointerEvents: "none",
          }}
        >
          {String(photo.id).padStart(2, "0")}
        </div>

        {/* Hover overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.15) 60%, transparent 100%)",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "16px 12px 12px",
          }}
        >
          {/* Category pill */}
          <motion.span
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 6 }}
            transition={{ duration: 0.3, delay: 0.04 }}
            style={{
              display: "inline-block",
              alignSelf: "flex-start",
              padding: "3px 8px",
              border: "1px solid rgba(170,146,115,0.4)",
              borderRadius: 2,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 8,
              letterSpacing: "0.25em",
              color: "rgba(170,146,115,0.85)",
              textTransform: "uppercase",
              marginBottom: 8,
              background: "rgba(170,146,115,0.06)",
              backdropFilter: "blur(4px)",
            }}
          >
            {photo.category.replace("-", " ")}
          </motion.span>

          {/* Project title */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.3, delay: 0.07 }}
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(0.72rem, 1.3vw, 0.95rem)",
              fontWeight: 700,
              color: "#F8F4ED",
              letterSpacing: "0.08em",
              margin: "0 0 4px",
              lineHeight: 1.25,
            }}
          >
            {photo.project}
          </motion.p>

          {/* Role & Year */}
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 9,
              color: "rgba(170,146,115,0.65)",
              letterSpacing: "0.15em",
            }}
          >
            {photo.role} &nbsp;&middot;&nbsp; {photo.year}
          </motion.span>
        </motion.div>

        {/* Expand icon */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 40,
            height: 40,
            borderRadius: 2,
            border: "1px solid rgba(170,146,115,0.5)",
            background: "rgba(17,24,35,0.5)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4"
              stroke="rgba(170,146,115,0.9)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      </div>
    </motion.div>
  );
}
