"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useCursorContext } from "@/providers/CursorProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import type { Reel } from "@/types";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

const CORNERS = [
  { top: 6, left: 6, borderTop: "1px solid rgba(170,146,115,0.3)", borderLeft: "1px solid rgba(170,146,115,0.3)" },
  { top: 6, right: 6, borderTop: "1px solid rgba(170,146,115,0.3)", borderRight: "1px solid rgba(170,146,115,0.3)" },
  { bottom: 6, left: 6, borderBottom: "1px solid rgba(170,146,115,0.3)", borderLeft: "1px solid rgba(170,146,115,0.3)" },
  { bottom: 6, right: 6, borderBottom: "1px solid rgba(170,146,115,0.3)", borderRight: "1px solid rgba(170,146,115,0.3)" },
] as const;

interface ReelCardProps {
  reel: Reel;
  index: number;
  onPlay: (reel: Reel) => void;
}

export default function ReelCard({ reel, index, onPlay }: ReelCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });

  const handleMouseEnter = () => {
    setHovered(true);
    if (!isMobile) setCursor("video");
    videoRef.current?.play().catch(() => {});
  };

  const handleMouseLeave = () => {
    setHovered(false);
    if (!isMobile) resetCursor();
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{
        duration: 0.8,
        delay: (index % 3) * 0.1,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={`Play ${reel.title}`}
        onClick={() => onPlay(reel)}
        onKeyDown={(e) => e.key === "Enter" && onPlay(reel)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: "16 / 9",
          overflow: "hidden",
          borderRadius: 2,
          background: "#0a0e14",
          border: "1px solid rgba(170,146,115,0.15)",
          cursor: "none",
        }}
      >
        {/* Poster */}
        <img
          src={reel.poster}
          alt={reel.title}
          loading="lazy"
          decoding="async"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "brightness(0.8) contrast(1.05)",
          }}
          draggable={false}
        />

        {/* Hover video preview */}
        <motion.video
          ref={videoRef}
          src={reel.videoSrc}
          muted
          playsInline
          loop
          preload="none"
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.4 }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            filter: "brightness(0.85) contrast(1.05)",
          }}
        />

        {/* Film corners */}
        {CORNERS.map((cs, ci) => (
          <div
            key={ci}
            style={{ position: "absolute", width: 12, height: 12, pointerEvents: "none", ...cs }}
          />
        ))}

        {/* Category pill */}
        <div
          style={{
            position: "absolute",
            top: 10,
            left: 10,
            padding: "3px 8px",
            border: "1px solid rgba(170,146,115,0.4)",
            borderRadius: 2,
            fontFamily: "'Courier New', monospace",
            fontSize: 8,
            letterSpacing: "0.2em",
            color: "rgba(170,146,115,0.85)",
            textTransform: "uppercase",
            background: "rgba(17,24,35,0.6)",
            backdropFilter: "blur(4px)",
            zIndex: 2,
          }}
        >
          {reel.category}
        </div>

        {/* Duration badge */}
        <div
          style={{
            position: "absolute",
            bottom: 10,
            right: 10,
            padding: "3px 8px",
            fontFamily: "'Courier New', monospace",
            fontSize: 10,
            letterSpacing: "0.1em",
            color: "rgba(248,244,237,0.8)",
            background: "rgba(17,24,35,0.7)",
            backdropFilter: "blur(4px)",
            borderRadius: 2,
            zIndex: 2,
          }}
        >
          {formatTime(reel.duration)}
        </div>

        {/* Play icon on hover */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 52,
            height: 52,
            borderRadius: "50%",
            border: "1.5px solid rgba(170,146,115,0.5)",
            background: "rgba(17,24,35,0.5)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            zIndex: 2,
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M8 5v14l11-7L8 5z" fill="#AA9273" />
          </svg>
        </motion.div>
      </div>

      {/* Title + description below */}
      <div style={{ padding: "12px 4px 0" }}>
        <h3
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "clamp(0.8rem, 1.5vw, 1rem)",
            fontWeight: 700,
            color: "#F8F4ED",
            letterSpacing: "0.06em",
            margin: "0 0 4px",
          }}
        >
          {reel.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 11,
            color: "rgba(248,244,237,0.35)",
            lineHeight: 1.5,
            margin: 0,
          }}
        >
          {reel.description}
        </p>
      </div>
    </motion.div>
  );
}
