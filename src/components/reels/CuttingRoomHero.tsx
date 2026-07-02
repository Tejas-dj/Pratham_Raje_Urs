"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import type { Reel } from "@/types";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function SprocketRow() {
  const holes = Array.from({ length: 24 });
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: 20,
        background: "rgba(17,24,35,0.9)",
        pointerEvents: "none",
      }}
    >
      {holes.map((_, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 10,
            borderRadius: 1,
            background: "rgba(170,146,115,0.06)",
            border: "1px solid rgba(170,146,115,0.1)",
          }}
        />
      ))}
    </div>
  );
}

interface CuttingRoomHeroProps {
  reel: Reel;
  onPlay: (reel: Reel) => void;
}

export default function CuttingRoomHero({ reel, onPlay }: CuttingRoomHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const inView = useInView(ref, { once: true, margin: "-10%" });
  const [hovered, setHovered] = useState(false);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      style={{
        maxWidth: 1200,
        margin: "0 auto 64px",
        padding: "0 24px",
      }}
    >
      <div
        style={{ position: "relative", borderRadius: 2, overflow: "hidden" }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Top sprocket row */}
        <SprocketRow />

        {/* Video area */}
        <div
          style={{
            position: "relative",
            width: "100%",
            aspectRatio: "16 / 9",
            background: "#0a0e14",
            cursor: "none",
          }}
          role="button"
          tabIndex={0}
          aria-label={`Play ${reel.title}`}
          onClick={() => onPlay(reel)}
          onKeyDown={(e) => e.key === "Enter" && onPlay(reel)}
        >
          {reel.videoSrc ? (
            <video
              ref={videoRef}
              src={reel.videoSrc}
              poster={reel.poster || undefined}
              muted
              playsInline
              loop
              autoPlay
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                filter: "brightness(0.75) contrast(1.05)",
              }}
            />
          ) : (
            <div style={{ position: "absolute", inset: 0, background: "#1a1e28" }} />
          )}

          {/* Gradient scrim */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.1) 40%, transparent 60%)",
              pointerEvents: "none",
            }}
          />

          {/* Play button */}
          <motion.div
            animate={{ scale: hovered ? 1.1 : 1, opacity: hovered ? 1 : 0.8 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: 72,
              height: 72,
              borderRadius: "50%",
              border: "2px solid rgba(170,146,115,0.6)",
              background: "rgba(17,24,35,0.5)",
              backdropFilter: "blur(8px)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              pointerEvents: "none",
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M8 5v14l11-7L8 5z" fill="#AA9273" />
            </svg>
          </motion.div>

          {/* Title + category overlay bottom-left */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              left: 24,
              zIndex: 2,
            }}
          >
            <span
              style={{
                display: "inline-block",
                padding: "4px 10px",
                border: "1px solid rgba(170,146,115,0.4)",
                borderRadius: 2,
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 9,
                letterSpacing: "0.25em",
                color: "rgba(170,146,115,0.85)",
                textTransform: "uppercase",
                marginBottom: 10,
                background: "rgba(170,146,115,0.06)",
                backdropFilter: "blur(4px)",
              }}
            >
              {reel.category}
            </span>
            <h3
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "clamp(1rem, 2.5vw, 1.6rem)",
                fontWeight: 700,
                color: "#F8F4ED",
                letterSpacing: "0.08em",
                margin: 0,
              }}
            >
              {reel.title}
            </h3>
          </div>

          {/* Timecode bottom-right */}
          <div
            style={{
              position: "absolute",
              bottom: 24,
              right: 24,
              fontFamily: "'Courier New', monospace",
              fontSize: 12,
              letterSpacing: "0.15em",
              color: "rgba(170,146,115,0.55)",
              zIndex: 2,
            }}
          >
            {formatTime(reel.duration)}
          </div>
        </div>

        {/* Bottom sprocket row */}
        <SprocketRow />
      </div>
    </motion.div>
  );
}
