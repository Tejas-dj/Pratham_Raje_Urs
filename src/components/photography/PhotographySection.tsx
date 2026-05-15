"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useCursorContext } from "@/providers/CursorProvider";
import PhotoLightbox, { type LightboxPhoto } from "./PhotoLightbox";

/* ─── Photo data ─────────────────────────────────────────────────────────── */
const PHOTOS: (LightboxPhoto & { aspect: "tall" | "wide" | "square" })[] = [
  {
    id: 1,
    src: "/images/still_sunflowers.png",
    alt: "Golden-hour sunflower field",
    project: "She Asked for Sunflowers",
    year: "2024",
    category: "Narrative Short",
    role: "Director | DOP",
    btsNote: "Shot entirely during a 15-minute magic hour window before the storm hit.",
    aspect: "tall",
  },
  {
    id: 2,
    src: "/images/still_coffee_cold.png",
    alt: "Rain-streaked café window portrait",
    project: "Before The Coffee Gets Cold",
    year: "2024",
    category: "Narrative Short",
    role: "DOP",
    btsNote: "Used a custom prism filter to catch the neon reflections off the wet window.",
    aspect: "wide",
  },
  {
    id: 3,
    src: "/images/still_christmas.png",
    alt: "Festive living room, warm light",
    project: "The Christmas Guest",
    year: "2023",
    category: "Phalke Selected",
    role: "Director",
    btsNote: "We lit the entire scene using only practical tungsten bulbs and the Christmas tree lights.",
    aspect: "square",
  },
  {
    id: 4,
    src: "/images/still_monsoon.png",
    alt: "Red umbrella in monsoon cobblestones",
    project: "Mysuru Streets",
    year: "2024",
    category: "Still Photography",
    role: "Photographer",
    aspect: "tall",
  },
  {
    id: 5,
    src: "/images/still_wedding.png",
    alt: "Golden-hour garden ceremony",
    project: "Wedding Cinema — Talon",
    year: "2025",
    category: "Wedding Film",
    role: "Director | Editor",
    btsNote: "Captured on a vintage 35mm lens to give the digital sensor an organic, timeless feel.",
    aspect: "wide",
  },
  {
    id: 6,
    src: "/images/still_dot.png",
    alt: "Silhouette against concrete wall",
    project: "DOT.",
    year: "2024",
    category: "Narrative Short",
    role: "DOP",
    btsNote: "The stark contrast was achieved with a single 10K light positioned 50 feet down the alley.",
    aspect: "tall",
  },
  {
    id: 7,
    src: "/images/still_bts.png",
    alt: "Blue-hour rooftop shoot",
    project: "Behind The Frame",
    year: "2025",
    category: "Making Of",
    role: "Director",
    aspect: "wide",
  },
  {
    id: 8,
    src: "/images/still_rice_fields.png",
    alt: "Karnataka sunrise paddy fields",
    project: "Karnataka Diaries",
    year: "2023",
    category: "Documentary",
    role: "DOP | Drone Op",
    btsNote: "Woke up at 4 AM to hike 3 miles just to catch the morning mist rolling off the fields.",
    aspect: "wide",
  },
  {
    id: 9,
    src: "/images/still_sees_kaddi.png",
    alt: "Night alley, dramatic sidelight",
    project: "Sees Kaddi",
    year: "2023",
    category: "Acting Reel",
    role: "Actor | Co-Director",
    aspect: "tall",
  },
];

/* ─── Aspect heights ─────────────────────────────────────────────────────── */
const ASPECT_HEIGHTS: Record<string, number> = {
  tall: 360,
  wide: 230,
  square: 280,
};

/* ─── Film-frame corner accent ───────────────────────────────────────────── */
const CORNERS = [
  { top: 8, left: 8, borderTop: "1px solid rgba(212,175,119,0.35)", borderLeft: "1px solid rgba(212,175,119,0.35)" },
  { top: 8, right: 8, borderTop: "1px solid rgba(212,175,119,0.35)", borderRight: "1px solid rgba(212,175,119,0.35)" },
  { bottom: 8, left: 8, borderBottom: "1px solid rgba(212,175,119,0.35)", borderLeft: "1px solid rgba(212,175,119,0.35)" },
  { bottom: 8, right: 8, borderBottom: "1px solid rgba(212,175,119,0.35)", borderRight: "1px solid rgba(212,175,119,0.35)" },
] as const;

/* ─── PhotoCard ──────────────────────────────────────────────────────────── */
function PhotoCard({
  photo,
  index,
  onOpen,
}: {
  photo: (typeof PHOTOS)[0];
  index: number;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });
  const height = ASPECT_HEIGHTS[photo.aspect];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 32 }}
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
        aria-label={`Open ${photo.project} — ${photo.alt}`}
        onClick={() => onOpen(index)}
        onKeyDown={(e) => e.key === "Enter" && onOpen(index)}
        onMouseEnter={() => {
          setHovered(true);
          setCursor("crosshair");
        }}
        onMouseLeave={() => {
          setHovered(false);
          resetCursor();
        }}
        style={{
          position: "relative",
          width: "100%",
          height,
          overflow: "hidden",
          borderRadius: 2,
          background: "#111",
          display: "block",
        }}
      >
        {/* ── Image with zoom on hover ── */}
        <motion.img
          src={photo.src}
          alt={photo.alt}
          animate={{ scale: hovered ? 1.07 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: hovered
              ? "brightness(0.6) contrast(1.08)"
              : "brightness(0.82) contrast(1.05)",
            transition: "filter 0.5s ease",
          }}
          draggable={false}
        />

        {/* ── Film-frame corners ── */}
        {CORNERS.map((cs, ci) => (
          <div
            key={ci}
            style={{ position: "absolute", width: 14, height: 14, pointerEvents: "none", ...cs }}
          />
        ))}

        {/* ── Frame number (top-right, always visible) ── */}
        <div
          style={{
            position: "absolute",
            top: 10,
            right: 12,
            fontFamily: "'Courier New', monospace",
            fontSize: 8,
            color: "rgba(212,175,119,0.25)",
            letterSpacing: "0.15em",
            pointerEvents: "none",
          }}
        >
          {String(photo.id).padStart(2, "0")}
        </div>

        {/* ── Hover overlay: project name + year ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: hovered ? 1 : 0 }}
          transition={{ duration: 0.35 }}
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.82) 0%, rgba(0,0,0,0.18) 60%, transparent 100%)",
            pointerEvents: "none",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            padding: "16px 14px 14px",
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
              border: "1px solid rgba(212,175,119,0.4)",
              borderRadius: 2,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 8,
              letterSpacing: "0.25em",
              color: "rgba(212,175,119,0.85)",
              textTransform: "uppercase",
              marginBottom: 8,
              background: "rgba(212,175,119,0.06)",
              backdropFilter: "blur(4px)",
            }}
          >
            {photo.category}
          </motion.span>

          {/* Project title */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.3, delay: 0.07 }}
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(0.75rem, 1.4vw, 1rem)",
              fontWeight: 700,
              color: "#f5f0e8",
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
              fontSize: 10,
              color: "rgba(212,175,119,0.7)",
              letterSpacing: "0.15em",
            }}
          >
            {photo.role} &nbsp;&middot;&nbsp; {photo.year}
          </motion.span>

        </motion.div>

        {/* ── "Open" expand icon, center, only on hover ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.7 }}
          animate={{ opacity: hovered ? 1 : 0, scale: hovered ? 1 : 0.7 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 44,
            height: 44,
            borderRadius: 2,
            border: "1px solid rgba(212,175,119,0.55)",
            background: "rgba(10,10,10,0.55)",
            backdropFilter: "blur(6px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
          }}
        >
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M6 2H2v4M10 2h4v4M6 14H2v-4M10 14h4v-4"
              stroke="rgba(212,175,119,0.9)"
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

/* ─── Section ────────────────────────────────────────────────────────────── */
export default function PhotographySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-15%" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.93, 1.0]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  const openLightbox = useCallback((index: number) => setLightboxIndex(index), []);
  const closeLightbox = useCallback(() => setLightboxIndex(null), []);

  return (
    <>
      <section
        id="photography"
        ref={sectionRef}
        style={{ position: "relative", background: "#0a0a0a", padding: "100px 0 80px", overflow: "hidden" }}
        aria-label="Photography by Pratham Raje Urs"
      >
        {/* ── Section header ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 52px" }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
            <div style={{ width: 40, height: 1, background: "#d4af77", opacity: 0.4 }} />
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 10,
                letterSpacing: "0.4em",
                color: "rgba(212,175,119,0.5)",
                textTransform: "uppercase",
              }}
            >
              Still Frames
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(212,175,119,0.08)" }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(1.4rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#f5f0e8",
              letterSpacing: "0.06em",
              marginBottom: 12,
            }}
          >
            The World Through His Lens
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              color: "rgba(245,240,232,0.35)",
              maxWidth: 460,
              lineHeight: 1.8,
            }}
          >
            Between frames, Pratham photographs the quiet in-between — still
            moments that cinema never gets to hold long enough.
          </p>
        </motion.div>

        {/* ── Masonry gallery ── */}
        <motion.div
          style={{
            scale,
            opacity,
            transformOrigin: "top center",
            maxWidth: 1200,
            margin: "0 auto",
            padding: "0 24px",
          }}
        >
          {/* 
            CSS columns masonry:
            3 cols on desktop (≥900px), 2 on tablet, 1 on mobile.
            We use a wrapping div with an inline <style> for the responsive breakpoints
            since this is a client component — keeps it self-contained.
          */}
          <style>{`
            .gallery-masonry {
              columns: 3 260px;
              column-gap: 12px;
            }
            @media (max-width: 780px) {
              .gallery-masonry {
                columns: 2 160px;
                column-gap: 10px;
              }
            }
            @media (max-width: 480px) {
              .gallery-masonry {
                columns: 2 150px;
                column-gap: 8px;
              }
            }
          `}</style>

          <div className="gallery-masonry">
            {PHOTOS.map((photo, i) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                index={i}
                onOpen={openLightbox}
              />
            ))}
          </div>

          {/* ── Keyboard hint ── */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ delay: 1.2, duration: 0.8 }}
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 10,
              color: "rgba(212,175,119,0.28)",
              letterSpacing: "0.3em",
              textAlign: "center",
              marginTop: 32,
              textTransform: "uppercase",
            }}
          >
            Click any frame to enter the still
          </motion.p>
        </motion.div>

        {/* Edge vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 110% 70% at 50% 50%, transparent 45%, rgba(10,10,10,0.55) 100%)",
            pointerEvents: "none",
          }}
        />
      </section>

      {/* ── Lightbox (portal-level, outside section) ── */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={PHOTOS}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
