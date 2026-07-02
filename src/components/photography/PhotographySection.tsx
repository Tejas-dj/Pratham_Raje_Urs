"use client";

import React, { useRef, useState, useCallback, useMemo } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useCursorContext } from "@/providers/CursorProvider";
import PhotoLightbox from "./PhotoLightbox";
import LightboxPreloader from "./LightboxPreloader";
import CldPhoto from "@/components/common/CldPhoto";
import { PHOTOS } from "@/lib/data";

const EAGER_COUNT = 6;
const GALLERY_SIZES = "(max-width: 780px) 50vw, (max-width: 1200px) 33vw, 400px";

/** Fisher-Yates shuffle — never mutates the source array. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Derives a shoot/group key so images from the same session can be spread apart. */
function getShootKey(photo: { alt: string; project?: string }): string {
  if (photo.project) return photo.project;
  const m = photo.alt.match(/—\s*(.+?)(?:\s+\d+)?$/);
  return m ? m[1].trim() : `solo-${photo.alt}`;
}

/**
 * Spread-shuffle: groups by shoot → round-robin interleave → cleanup pass.
 */
function spreadShuffle<T extends { alt: string; project?: string }>(arr: T[]): T[] {
  const groups = new Map<string, T[]>();
  for (const item of arr) {
    const key = getShootKey(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  const buckets = [...groups.values()].map((g) => shuffle(g));
  buckets.sort((a, b) => b.length - a.length);
  const result: T[] = [];
  const maxLen = Math.max(...buckets.map((g) => g.length));
  for (let i = 0; i < maxLen; i++) {
    for (const bucket of buckets) {
      if (i < bucket.length) result.push(bucket[i]);
    }
  }
  for (let i = 1; i < result.length; i++) {
    if (getShootKey(result[i]) === getShootKey(result[i - 1])) {
      for (let j = i + 2; j < result.length; j++) {
        if (
          getShootKey(result[j]) !== getShootKey(result[i - 1]) &&
          (i + 1 >= result.length || getShootKey(result[j]) !== getShootKey(result[i + 1]))
        ) {
          [result[i], result[j]] = [result[j], result[i]];
          break;
        }
      }
    }
  }
  return result;
}

/** Deterministic pseudo-random [0,1) from an integer seed — consistent per photo. */
function seededRand(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

/* ─── Base aspect heights — each card gets a ±30% jitter for visual variety ── */
const BASE_HEIGHTS: Record<string, number> = {
  tall: 360,
  wide: 230,
  square: 280,
};
const HEIGHT_JITTER = 0.30;

/* ─── Film-frame corner accent ───────────────────────────────────────────── */
const CORNERS = [
  { top: 8, left: 8, borderTop: "1px solid rgba(170,146,115,0.35)", borderLeft: "1px solid rgba(170,146,115,0.35)" },
  { top: 8, right: 8, borderTop: "1px solid rgba(170,146,115,0.35)", borderRight: "1px solid rgba(170,146,115,0.35)" },
  { bottom: 8, left: 8, borderBottom: "1px solid rgba(170,146,115,0.35)", borderLeft: "1px solid rgba(170,146,115,0.35)" },
  { bottom: 8, right: 8, borderBottom: "1px solid rgba(170,146,115,0.35)", borderRight: "1px solid rgba(170,146,115,0.35)" },
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
  // Deterministic per-photo height jitter: ±30% of the base height
  const jitter = 1 + (seededRand(photo.id) * 2 - 1) * HEIGHT_JITTER;
  const height = Math.round((BASE_HEIGHTS[photo.aspect] ?? 280) * jitter);

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
        aria-label={`Open ${photo.project}: ${photo.alt}`}
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
          background: "#45302A",
          display: "block",
        }}
      >
        {/* ── Image with zoom on hover ── */}
        {photo.src && (
          <motion.div
            animate={{ scale: hovered ? 1.07 : 1 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "absolute", inset: 0 }}
          >
            <CldPhoto
              src={photo.src}
              alt={photo.alt}
              fill
              crop="fill"
              gravity="auto"
              sizes={GALLERY_SIZES}
              loading={index < EAGER_COUNT ? "eager" : "lazy"}
              decoding="async"
              draggable={false}
              style={{
                objectFit: "cover",
                filter: hovered
                  ? "brightness(0.6) contrast(1.08)"
                  : "brightness(0.82) contrast(1.05)",
                transition: "filter 0.5s ease",
              }}
            />
          </motion.div>
        )}

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
            color: "rgba(170,146,115,0.25)",
            letterSpacing: "0.15em",
            pointerEvents: "none",
          }}
        >
          {String(photo.id).padStart(2, "0")}
        </div>



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
            border: "1px solid rgba(170,146,115,0.55)",
            background: "rgba(17,24,35,0.55)",
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

/* ─── Section ────────────────────────────────────────────────────────────── */
export default function PhotographySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-15%" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const shuffledPhotos = useMemo(() => spreadShuffle(PHOTOS), []);

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
        style={{ position: "relative", background: "#111823", padding: "100px 0 80px", overflow: "hidden" }}
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
            <div style={{ width: 40, height: 1, background: "#AA9273", opacity: 0.4 }} />
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 10,
                letterSpacing: "0.4em",
                color: "rgba(170,146,115,0.5)",
                textTransform: "uppercase",
              }}
            >
              Still Frames
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(170,146,115,0.08)" }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(1.4rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#F8F4ED",
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
              color: "rgba(248,244,237,0.35)",
              maxWidth: 460,
              lineHeight: 1.8,
            }}
          >
            Between frames, Pratham photographs the quiet in-between, still
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
            {shuffledPhotos.map((photo, i) => (
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
              color: "rgba(170,146,115,0.28)",
              letterSpacing: "0.3em",
              textAlign: "center",
              marginTop: 32,
              textTransform: "uppercase",
            }}
          >
            Click any frame to enter the still
          </motion.p>
        </motion.div>

      </section>

      {/* ── Warms the browser cache for full-res photos during idle time ── */}
      <LightboxPreloader photos={shuffledPhotos} />

      {/* ── Lightbox (portal-level, outside section) ── */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={shuffledPhotos}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
