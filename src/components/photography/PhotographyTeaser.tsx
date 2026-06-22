"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import Link from "next/link";
import { useCursorContext } from "@/providers/CursorProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import PhotoLightbox from "./PhotoLightbox";
import { PHOTOS, FEATURED_PHOTOS } from "@/lib/data";
import type { Photo } from "@/types";

const ASPECT_HEIGHTS: Record<string, string> = {
  tall: "85vh",
  wide: "38vh",
  square: "55vh",
};

const CORNERS = [
  { top: 8, left: 8, borderTop: "1px solid rgba(170,146,115,0.35)", borderLeft: "1px solid rgba(170,146,115,0.35)" },
  { top: 8, right: 8, borderTop: "1px solid rgba(170,146,115,0.35)", borderRight: "1px solid rgba(170,146,115,0.35)" },
  { bottom: 8, left: 8, borderBottom: "1px solid rgba(170,146,115,0.35)", borderLeft: "1px solid rgba(170,146,115,0.35)" },
  { bottom: 8, right: 8, borderBottom: "1px solid rgba(170,146,115,0.35)", borderRight: "1px solid rgba(170,146,115,0.35)" },
] as const;

function TeaserCard({
  photo,
  index,
  onOpen,
}: {
  photo: Photo;
  index: number;
  onOpen: (index: number) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();
  const isMobile = useIsMobile();
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
      style={{ breakInside: "avoid", marginBottom: 0, cursor: "none" }}
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
          borderRadius: 0,
          background: "#45302A",
        }}
      >
        <motion.img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
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

        {CORNERS.map((cs, ci) => (
          <div
            key={ci}
            style={{ position: "absolute", width: 14, height: 14, pointerEvents: "none", ...cs }}
          />
        ))}

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

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.3, delay: 0.07 }}
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(0.75rem, 1.4vw, 1rem)",
              fontWeight: 700,
              color: "#F8F4ED",
              letterSpacing: "0.08em",
              margin: "0 0 4px",
              lineHeight: 1.25,
            }}
          >
            {photo.project}
          </motion.p>

          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 10,
              color: "rgba(170,146,115,0.7)",
              letterSpacing: "0.15em",
            }}
          >
            {photo.role} &nbsp;&middot;&nbsp; {photo.year}
          </motion.span>
        </motion.div>

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

export default function PhotographyTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-15%" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const { setCursor, resetCursor } = useCursorContext();

  const featuredPhotos = PHOTOS.filter((p) => FEATURED_PHOTOS.includes(p.id));

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
        style={{ position: "relative", background: "#111823", padding: "100px 0 0", overflow: "hidden" }}
        aria-label="Photography by Pratham Raje Urs"
      >
        {/* Section header */}
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

        {/* Masonry gallery — 6 featured photos */}
        {/* Full-bleed masonry gallery */}
        <motion.div
          style={{
            scale,
            opacity,
            transformOrigin: "top center",
          }}
        >
          <style>{`
            .teaser-masonry {
              columns: 3;
              column-gap: 0;
            }
            @media (max-width: 780px) {
              .teaser-masonry {
                columns: 2;
              }
            }
            @media (max-width: 480px) {
              .teaser-masonry {
                columns: 2;
              }
            }
          `}</style>

          <div className="teaser-masonry">
            {featuredPhotos.map((photo, i) => (
              <TeaserCard
                key={photo.id}
                photo={photo}
                index={i}
                onOpen={openLightbox}
              />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: "center", padding: "48px 0 24px" }}
          >
            <Link
              href="/photography"
              onMouseEnter={() => !isMobile && setCursor("crosshair")}
              onMouseLeave={() => !isMobile && resetCursor()}
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 12,
                padding: "14px 36px",
                border: "1px solid rgba(170,146,115,0.4)",
                borderRadius: 2,
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "clamp(0.7rem, 1.2vw, 0.85rem)",
                fontWeight: 700,
                letterSpacing: "0.15em",
                color: "#AA9273",
                textDecoration: "none",
                textTransform: "uppercase",
                cursor: "none",
                transition: "all 0.35s ease",
                background: "transparent",
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = "#AA9273";
                e.currentTarget.style.background = "rgba(170,146,115,0.06)";
                e.currentTarget.style.boxShadow = "0 0 30px rgba(170,146,115,0.08)";
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = "rgba(170,146,115,0.4)";
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              View Full Contact Sheet
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path
                  d="M3 8h10M9 4l4 4-4 4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </Link>
          </motion.div>

          {/* Hint */}
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
              paddingBottom: 40,
              textTransform: "uppercase",
            }}
          >
            Click any frame to enter the still
          </motion.p>
        </motion.div>

      </section>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={featuredPhotos}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
