"use client";

import React, { useRef, useState, useEffect, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform, useInView, PanInfo } from "framer-motion";
import Link from "next/link";
import { useCursorContext } from "@/providers/CursorProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import PhotoLightbox from "./PhotoLightbox";
import { PHOTOS } from "@/lib/data";
import type { Photo } from "@/types";

const POOL_SIZE = 48;
const STACK_SIZE = 9;

const CORNERS = [
  { top: 8, left: 8, borderTop: "1px solid rgba(170,146,115,0.35)", borderLeft: "1px solid rgba(170,146,115,0.35)" },
  { top: 8, right: 8, borderTop: "1px solid rgba(170,146,115,0.35)", borderRight: "1px solid rgba(170,146,115,0.35)" },
  { bottom: 8, left: 8, borderBottom: "1px solid rgba(170,146,115,0.35)", borderLeft: "1px solid rgba(170,146,115,0.35)" },
  { bottom: 8, right: 8, borderBottom: "1px solid rgba(170,146,115,0.35)", borderRight: "1px solid rgba(170,146,115,0.35)" },
] as const;

/** Fisher-Yates shuffle — never mutates the source array. */
function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function ratio(photo: Photo): number {
  return photo.width && photo.height ? photo.width / photo.height : 0.75;
}

/** Scales both column count and photo count with the viewport — bigger screens earn more frames. */
function computeMasonryLayout(width: number) {
  const columns = Math.min(9, Math.max(3, Math.round(width / 380)));
  const count = Math.min(POOL_SIZE, columns * 5);
  return { columns, count };
}

function useMasonryLayout() {
  const [layout, setLayout] = useState(() =>
    computeMasonryLayout(typeof window !== "undefined" ? window.innerWidth : 1280)
  );
  useEffect(() => {
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => setLayout(computeMasonryLayout(window.innerWidth)));
    };
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);
  return layout;
}

function TeaserCard({
  photo,
  index,
  onOpen,
  preserveRatio,
}: {
  photo: Photo;
  index: number;
  onOpen: (index: number) => void;
  preserveRatio?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();
  const isMobile = useIsMobile();
  const inView = useInView(ref, { once: true, margin: "-6% 0px" });

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
      style={{ width: "100%", height: preserveRatio ? "auto" : "100%", cursor: "none" }}
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
          height: preserveRatio ? "auto" : "100%",
          overflow: "hidden",
          borderRadius: 0,
          background: "#45302A",
          lineHeight: 0,
        }}
      >
        <motion.img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          decoding="async"
          animate={{ scale: hovered ? 1.045 : 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          style={preserveRatio
            ? {
                width: "100%",
                height: "auto",
                aspectRatio: ratio(photo),
                display: "block",
                filter: hovered
                  ? "brightness(0.72) contrast(1.08)"
                  : "brightness(0.9) contrast(1.02)",
                transition: "filter 0.5s ease",
              }
            : {
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
            {photo.category?.replace("-", " ")}
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

/* ─── Mobile: a self-advancing "stories" deck — swipe still works, but nothing is required ── */
const AUTO_ADVANCE_MS = 4000;

function PhotoDeck({
  photos,
  onOpen,
  active,
}: {
  photos: Photo[];
  onOpen: (index: number) => void;
  active: boolean;
}) {
  const [top, setTop] = useState(0);
  const [exitDir, setExitDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const n = photos.length;

  const advance = useCallback((dir: 1 | -1) => {
    setExitDir(dir);
    setTop((i) => (i + dir + n) % n);
  }, [n]);

  // Auto-plays like a stories reel; pauses mid-drag or while the lightbox is open.
  useEffect(() => {
    if (!active || paused || n <= 1) return;
    const t = setTimeout(() => advance(1), AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [active, paused, top, n, advance]);

  const handleDragStart = useCallback(() => setPaused(true), []);
  const handleDragEnd = useCallback((_: unknown, info: PanInfo) => {
    if (info.offset.y < -70 || info.velocity.y < -500) advance(1);
    else if (info.offset.y > 70 || info.velocity.y > 500) advance(-1);
    setPaused(false);
  }, [advance]);

  const current = photos[top];

  return (
    <div style={{ position: "relative" }}>
      {/* Stories-style progress bar — fills on its own, no swipe required */}
      <style>{`
        @keyframes storyFill {
          from { transform: scaleX(0); }
          to { transform: scaleX(1); }
        }
      `}</style>
      <div style={{ display: "flex", gap: 4, padding: "0 20px", marginBottom: 16 }}>
        {photos.map((p, i) => (
          <div
            key={p.id}
            style={{
              flex: 1,
              height: 2,
              borderRadius: 1,
              background: "rgba(170,146,115,0.2)",
              overflow: "hidden",
            }}
          >
            {i === top && (
              <div
                key={top}
                style={{
                  height: "100%",
                  background: "#AA9273",
                  transformOrigin: "left",
                  animation: `storyFill ${AUTO_ADVANCE_MS}ms linear forwards`,
                  animationPlayState: paused || !active ? "paused" : "running",
                }}
              />
            )}
            {i < top && (
              <div style={{ height: "100%", background: "#AA9273" }} />
            )}
          </div>
        ))}
      </div>

      <div
        style={{
          position: "relative",
          height: "62vh",
          maxHeight: 520,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <AnimatePresence initial={false} custom={exitDir} mode="popLayout">
          <motion.div
            key={current.id}
            custom={exitDir}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={0.65}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            initial={{ y: exitDir * 60, opacity: 0, scale: 0.96 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -exitDir * 260, opacity: 0, scale: 0.94, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] } }}
            transition={{ duration: 0.38, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ cursor: "grabbing" }}
            style={{
              position: "absolute",
              width: "84vw",
              maxWidth: 360,
              aspectRatio: String(ratio(current)),
              maxHeight: "62vh",
              touchAction: "pan-x",
              cursor: "grab",
            }}
          >
            <TeaserCard photo={current} index={photos.indexOf(current)} onOpen={onOpen} />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function PhotographyTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-15%" });
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const isMobile = useIsMobile();
  const { setCursor, resetCursor } = useCursorContext();
  const { columns, count } = useMasonryLayout();

  // Random mix of full portfolio shots — excludes photos reused as film/project thumbnails.
  const featuredPhotos = useMemo(() => {
    const eligible = PHOTOS.filter((p) => !p.isThumbnail);
    return shuffle(eligible).slice(0, POOL_SIZE);
  }, []);

  const masonryPhotos = featuredPhotos.slice(0, count);
  const stackPhotos = featuredPhotos.slice(0, STACK_SIZE);

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

        {/* Gallery — a natural, uncropped collage on desktop; a swipeable deck on phones */}
        <motion.div
          style={{
            scale,
            opacity,
            transformOrigin: "top center",
          }}
        >
          <style>{`
            .gallery-masonry {
              display: block;
              width: 100vw;
              margin-left: calc(50% - 50vw);
              margin-right: calc(50% - 50vw);
              padding: 0 20px;
              box-sizing: border-box;
            }
            .gallery-stack { display: none; padding: 0 20px; }
            .gallery-cta { margin-top: -60px; }
            @media (max-width: 767px) {
              .gallery-masonry { display: none; }
              .gallery-stack { display: block; }
              .gallery-cta { margin-top: 0; }
            }
            .gallery-masonry-item { break-inside: avoid; margin-bottom: 14px; }
          `}</style>

          <div className="gallery-masonry">
            {/* Deliberately overflows past maxHeight so the bottom fade always has
                real content under it, no matter how the columns balance out. */}
            <div style={{ position: "relative", maxHeight: 1600, overflow: "hidden" }}>
              <div style={{ columns, columnGap: 14 }}>
                {masonryPhotos.map((photo, i) => (
                  <div className="gallery-masonry-item" key={photo.id}>
                    <TeaserCard photo={photo} index={i} onOpen={openLightbox} preserveRatio />
                  </div>
                ))}
              </div>
              <div
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 260,
                  background: "linear-gradient(to top, #111823 0%, rgba(17,24,35,0.9) 30%, rgba(17,24,35,0) 100%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          </div>

          <div className="gallery-stack">
            <PhotoDeck photos={stackPhotos} onOpen={openLightbox} active={lightboxIndex === null} />
          </div>

          {/* CTA — sits at the end of the fade on desktop */}
          <motion.div
            className="gallery-cta"
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: "relative", textAlign: "center", padding: "48px 0 24px" }}
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
              View More
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
        </motion.div>

      </section>

      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={isMobile ? stackPhotos : masonryPhotos}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
