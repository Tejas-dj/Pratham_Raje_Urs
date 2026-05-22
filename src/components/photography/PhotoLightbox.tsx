"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface LightboxPhoto {
  id: number;
  src: string;
  alt: string;
  project: string;
  year: string;
  category: string;
  role: string;
  btsNote?: string;
}

interface PhotoLightboxProps {
  photos: LightboxPhoto[];
  initialIndex: number;
  onClose: () => void;
}

export default function PhotoLightbox({
  photos,
  initialIndex,
  onClose,
}: PhotoLightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [direction, setDirection] = useState(0); // +1 → next, -1 → prev
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  }, [photos.length]);

  // ── Keyboard ──────────────────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  // ── Scroll lock ───────────────────────────────────────────────────────────
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  // ── Touch / swipe ─────────────────────────────────────────────────────────
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    const dy = Math.abs(e.changedTouches[0].clientY - (touchStartY.current ?? 0));
    if (Math.abs(dx) > 40 && Math.abs(dx) > dy) {
      dx < 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  const photo = photos[current];

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <AnimatePresence>
      <motion.div
        key="lightbox-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.35 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(17,24,35,0.97)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        // Click backdrop (not image) → close
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* ── Top bar ── */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            padding: "20px 28px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 2,
            background: "linear-gradient(to bottom, rgba(17,24,35,0.8) 0%, transparent 100%)",
          }}
        >
          {/* Counter */}
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              letterSpacing: "0.25em",
              color: "rgba(170,146,115,0.55)",
            }}
          >
            {String(current + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(photos.length).padStart(2, "0")}
          </span>

          {/* Category tag */}
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 10,
              letterSpacing: "0.35em",
              color: "rgba(170,146,115,0.45)",
              textTransform: "uppercase",
            }}
          >
            {photo.category}
          </span>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close lightbox"
            style={{
              background: "none",
              border: "1px solid rgba(170,146,115,0.25)",
              color: "rgba(170,146,115,0.7)",
              width: 36,
              height: 36,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "none",
              transition: "border-color 0.2s, color 0.2s",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(170,146,115,0.7)";
              (e.currentTarget as HTMLButtonElement).style.color = "#AA9273";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(170,146,115,0.25)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(170,146,115,0.7)";
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* ── Image area ── */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 1000,
            flex: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "80px 80px 100px",
          }}
        >
          {/* Film-frame corner brackets */}
          {[
            { top: 80, left: 80, borderTop: "1px solid rgba(170,146,115,0.2)", borderLeft: "1px solid rgba(170,146,115,0.2)" },
            { top: 80, right: 80, borderTop: "1px solid rgba(170,146,115,0.2)", borderRight: "1px solid rgba(170,146,115,0.2)" },
            { bottom: 100, left: 80, borderBottom: "1px solid rgba(170,146,115,0.2)", borderLeft: "1px solid rgba(170,146,115,0.2)" },
            { bottom: 100, right: 80, borderBottom: "1px solid rgba(170,146,115,0.2)", borderRight: "1px solid rgba(170,146,115,0.2)" },
          ].map((cs, i) => (
            <div
              key={i}
              style={{ position: "absolute", width: 24, height: 24, pointerEvents: "none", ...cs }}
            />
          ))}

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.img
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              src={photo.src}
              alt={photo.alt}
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                objectFit: "contain",
                display: "block",
                filter: "brightness(0.92) contrast(1.05)",
                boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(170,146,115,0.08)",
              }}
              draggable={false}
            />
          </AnimatePresence>
        </div>

        {/* ── Bottom metadata ── */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "20px 80px 28px",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
            background: "linear-gradient(to top, rgba(17,24,35,0.9) 0%, transparent 100%)",
          }}
        >
          <div>
            <AnimatePresence mode="wait">
              <motion.p
                key={`project-${current}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3 }}
                style={{
                  fontFamily: "var(--font-cinzel), serif",
                  fontSize: "clamp(0.85rem, 1.6vw, 1.15rem)",
                  fontWeight: 700,
                  color: "#AA9273",
                  letterSpacing: "0.12em",
                  marginBottom: 4,
                }}
              >
                {photo.project}
              </motion.p>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={`alt-${current}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.3, delay: 0.05 }}
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  color: "rgba(248,244,237,0.4)",
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                }}
              >
                {photo.alt}
              </motion.p>
            </AnimatePresence>
            {photo.btsNote && (
              <AnimatePresence mode="wait">
                <motion.p
                  key={`bts-${current}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 11,
                    color: "rgba(170,146,115,0.8)",
                    marginTop: 8,
                    maxWidth: 500,
                    lineHeight: 1.4,
                    fontStyle: "italic",
                  }}
                >
                  * {photo.btsNote}
                </motion.p>
              </AnimatePresence>
            )}
          </div>

          <div style={{ textAlign: "right" }}>
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 11,
                color: "rgba(170,146,115,0.5)",
                letterSpacing: "0.15em",
                display: "block",
                marginBottom: 4,
                textTransform: "uppercase"
              }}
            >
              {photo.role}
            </span>
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 12,
                color: "rgba(170,146,115,0.35)",
                letterSpacing: "0.15em",
              }}
            >
              {photo.year}
            </span>
          </div>
        </div>

        {/* ── Prev / Next arrows ── */}
        {[
          { label: "Previous", side: "left" as const, onClick: goPrev, icon: "←" },
          { label: "Next", side: "right" as const, onClick: goNext, icon: "→" },
        ].map(({ label, side, onClick, icon }) => (
          <button
            key={side}
            onClick={onClick}
            aria-label={label}
            style={{
              position: "absolute",
              top: "50%",
              [side]: 20,
              transform: "translateY(-50%)",
              background: "rgba(17,24,35,0.6)",
              border: "1px solid rgba(170,146,115,0.2)",
              color: "rgba(170,146,115,0.65)",
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "none",
              fontSize: 20,
              transition: "border-color 0.2s, color 0.2s, background 0.2s",
              backdropFilter: "blur(8px)",
              zIndex: 3,
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.borderColor = "rgba(170,146,115,0.6)";
              btn.style.color = "#AA9273";
              btn.style.background = "rgba(17,24,35,0.8)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget as HTMLButtonElement;
              btn.style.borderColor = "rgba(170,146,115,0.2)";
              btn.style.color = "rgba(170,146,115,0.65)";
              btn.style.background = "rgba(17,24,35,0.6)";
            }}
          >
            {icon}
          </button>
        ))}

        {/* ── Dot indicators ── */}
        <div
          style={{
            position: "absolute",
            bottom: 90,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: 6,
            zIndex: 3,
          }}
        >
          {photos.map((_, i) => (
            <button
              key={i}
              onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
              aria-label={`Go to photo ${i + 1}`}
              style={{
                width: i === current ? 20 : 5,
                height: 5,
                borderRadius: 3,
                border: "none",
                background: i === current ? "#AA9273" : "rgba(170,146,115,0.25)",
                transition: "width 0.3s ease, background 0.3s ease",
                cursor: "none",
                padding: 0,
              }}
            />
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
