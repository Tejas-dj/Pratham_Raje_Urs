"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getCldImageUrl } from "next-cloudinary";
import CldPhoto from "@/components/common/CldPhoto";
import { extractPublicId } from "@/lib/cloudinary";
import type { Photo } from "@/types";

interface PhotoLightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
  showCategory?: boolean;
}

const LIGHTBOX_ASPECT: Record<Photo["aspect"], string> = {
  tall: "3 / 4",
  wide: "16 / 9",
  square: "1 / 1",
};

function isCloudinarySrc(src: string): boolean {
  return !!src && !src.startsWith("/") && !src.startsWith("data:");
}

/** Builds a direct Cloudinary delivery URL for preloading/blur-up — never crops. */
function lightboxUrl(src: string, width: number, quality: number | "auto"): string | undefined {
  if (!isCloudinarySrc(src)) return undefined;
  return getCldImageUrl({
    src: extractPublicId(src),
    width,
    format: "auto",
    quality,
  });
}

function SprocketStrip({ side }: { side: "left" | "right" }) {
  const holes = Array.from({ length: 12 });
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        [side]: 0,
        bottom: 0,
        width: 28,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "space-evenly",
        pointerEvents: "none",
        zIndex: 4,
      }}
    >
      {holes.map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 6,
            borderRadius: 1,
            background: "rgba(170,146,115,0.06)",
            border: "1px solid rgba(170,146,115,0.1)",
          }}
        />
      ))}
    </div>
  );
}

function ExifStrip({ exif }: { exif: NonNullable<Photo["exif"]> }) {
  const entries = [
    exif.camera,
    exif.lens,
    exif.focalLength,
    exif.aperture && `ƒ/${exif.aperture}`,
    exif.iso && `ISO ${exif.iso}`,
    exif.shutter,
  ].filter(Boolean);

  if (entries.length === 0) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: 0.2 }}
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "6px 16px",
        justifyContent: "center",
        padding: "10px 20px",
        marginTop: 8,
        background: "rgba(69,48,42,0.35)",
        border: "1px solid rgba(170,146,115,0.12)",
        borderRadius: 2,
      }}
    >
      {entries.map((entry, i) => (
        <span
          key={i}
          style={{
            fontFamily: "'Courier New', monospace",
            fontSize: 9,
            letterSpacing: "0.15em",
            color: "rgba(170,146,115,0.55)",
            textTransform: "uppercase",
          }}
        >
          {entry}
        </span>
      ))}
    </motion.div>
  );
}

export default function PhotoLightbox({
  photos,
  initialIndex,
  onClose,
  showCategory = true,
}: PhotoLightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [direction, setDirection] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  useEffect(() => {
    setLoaded(false);
  }, [current]);

  // Warm the browser's image cache for the adjacent full-res photos so
  // Next/Prev feels instant instead of showing a bare blur-up each time.
  useEffect(() => {
    [current + 1, current - 1].forEach((i) => {
      const idx = (i + photos.length) % photos.length;
      const url = lightboxUrl(photos[idx]?.src ?? "", 1600, "auto");
      if (!url) return;
      const img = new Image();
      img.src = url;
    });
  }, [current, photos]);

  const goNext = useCallback(() => {
    setDirection(1);
    setCurrent((c) => (c + 1) % photos.length);
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setCurrent((c) => (c - 1 + photos.length) % photos.length);
  }, [photos.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

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
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Film sprocket strips */}
        <SprocketStrip side="left" />
        <SprocketStrip side="right" />

        {/* Top bar */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 28,
            right: 28,
            padding: "20px 24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            zIndex: 5,
            background: "linear-gradient(to bottom, rgba(17,24,35,0.8) 0%, transparent 100%)",
          }}
        >
          {/* Frame number */}
          <span
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              letterSpacing: "0.25em",
              color: "rgba(170,146,115,0.55)",
            }}
          >
            FRAME {String(current + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(photos.length).padStart(2, "0")}
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

        {/* Image area */}
        <div
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 1000,
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            overflow: "hidden",
            padding: "80px 56px 100px",
          }}
        >
          {/* Film-frame corner brackets */}
          {[
            { top: 72, left: 48, borderTop: "1px solid rgba(170,146,115,0.2)", borderLeft: "1px solid rgba(170,146,115,0.2)" },
            { top: 72, right: 48, borderTop: "1px solid rgba(170,146,115,0.2)", borderRight: "1px solid rgba(170,146,115,0.2)" },
            { bottom: 92, left: 48, borderBottom: "1px solid rgba(170,146,115,0.2)", borderLeft: "1px solid rgba(170,146,115,0.2)" },
            { bottom: 92, right: 48, borderBottom: "1px solid rgba(170,146,115,0.2)", borderRight: "1px solid rgba(170,146,115,0.2)" },
          ].map((cs, i) => (
            <div
              key={i}
              style={{ position: "absolute", width: 24, height: 24, pointerEvents: "none", ...cs }}
            />
          ))}

          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={current}
              custom={direction}
              variants={variants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              style={{
                position: "relative",
                width: "min(100%, 900px)",
                maxHeight: "70vh",
                aspectRatio: LIGHTBOX_ASPECT[photo.aspect] ?? "4 / 3",
                display: photo.src ? "block" : "none",
              }}
            >
              {/* Blur-up placeholder — shown instantly, fades out once the full image loads */}
              {photo.src && isCloudinarySrc(photo.src) && (
                <img
                  src={lightboxUrl(photo.src, 60, 10)}
                  alt=""
                  aria-hidden
                  draggable={false}
                  style={{
                    position: "absolute",
                    inset: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "contain",
                    filter: "brightness(0.92) contrast(1.05) blur(16px)",
                    transform: "scale(1.05)",
                    opacity: loaded ? 0 : 1,
                    transition: "opacity 0.4s ease",
                  }}
                />
              )}

              {photo.src && (
                <CldPhoto
                  src={photo.src}
                  alt={photo.alt}
                  fill
                  sizes="(max-width: 900px) 100vw, 900px"
                  draggable={false}
                  onLoad={() => setLoaded(true)}
                  style={{
                    objectFit: "contain",
                    filter: "brightness(0.92) contrast(1.05)",
                    boxShadow: "0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(170,146,115,0.08)",
                    opacity: !isCloudinarySrc(photo.src) || loaded ? 1 : 0,
                    transition: "opacity 0.4s ease",
                  }}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {/* EXIF data strip */}
          {photo.exif && <ExifStrip exif={photo.exif} />}
        </div>



        {/* Prev / Next arrows */}
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
              [side]: 36,
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
              zIndex: 5,
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

        {/* Dot indicators — only show if <= 30 photos */}
        {photos.length <= 30 && (
          <div
            style={{
              position: "absolute",
              bottom: 90,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 6,
              zIndex: 5,
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
        )}
      </motion.div>
    </AnimatePresence>
  );
}
