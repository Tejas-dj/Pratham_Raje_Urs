"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useCursorContext } from "@/providers/CursorProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import CldPhoto from "@/components/common/CldPhoto";
import type { Photo } from "@/types";

const FALLBACK_RATIOS: Record<string, number> = {
  tall: 3 / 4,
  wide: 16 / 9,
  square: 1,
};

const EAGER_COUNT = 6;
const GALLERY_SIZES = "(max-width: 780px) 50vw, (max-width: 1200px) 33vw, 400px";

/** Deterministic pseudo-random [0,1) from an integer seed — consistent per photo. */
function seededRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/* Size multiplier range: images display between 75% and 125% of their natural height */
const SIZE_JITTER = 0.25;

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
  const baseRatio =
    photo.width && photo.height ? photo.width / photo.height : FALLBACK_RATIOS[photo.aspect];

  // Deterministic per-photo size jitter: multiplies the aspect ratio so
  // the rendered height varies ±25%, creating an organic, mixed layout.
  const jitter = 1 + (seededRand(photo.id) * 2 - 1) * SIZE_JITTER;
  const ratio = baseRatio * jitter;

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
      style={{ breakInside: "avoid", marginBottom: 4, cursor: "none" }}
    >
      <div
        role="button"
        tabIndex={0}
        aria-label={photo.project ? `Open ${photo.project}: ${photo.alt}` : `Open ${photo.alt}`}
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
          aspectRatio: ratio,
          overflow: "hidden",
          borderRadius: 2,
          background: "#45302A",
          border: "1px solid rgba(170,146,115,0.18)",
        }}
      >
        {/* Image — "develops" on hover */}
        {photo.src && (
          <motion.div
            animate={{ scale: hovered ? 1.06 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            <CldPhoto
              src={photo.src}
              alt={photo.alt}
              fill
              sizes={GALLERY_SIZES}
              loading={index < EAGER_COUNT ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              style={{
                objectFit: "cover",
              }}
            />
          </motion.div>
        )}

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
