"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ContactSheetHero from "@/components/photography/ContactSheetHero";
import ContactSheetGallery from "@/components/photography/ContactSheetGallery";
import PhotoLightbox from "@/components/photography/PhotoLightbox";
import LightboxPreloader from "@/components/photography/LightboxPreloader";
import { PHOTOS } from "@/lib/data";

const BATCH_SIZE = 20;

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
 * Spread-shuffle: groups photos by shoot, interleaves round-robin,
 * then does a clean-up pass to break any remaining same-group adjacencies.
 * Guarantees maximum visual variety across the masonry.
 */
function spreadShuffle<T extends { alt: string; project?: string }>(arr: T[]): T[] {
  // 1. Group by shoot
  const groups = new Map<string, T[]>();
  for (const item of arr) {
    const key = getShootKey(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(item);
  }
  // 2. Shuffle within each group
  const buckets = [...groups.values()].map((g) => shuffle(g));
  // 3. Sort buckets by size descending for balanced interleaving
  buckets.sort((a, b) => b.length - a.length);
  // 4. Round-robin interleave
  const result: T[] = [];
  const maxLen = Math.max(...buckets.map((g) => g.length));
  for (let i = 0; i < maxLen; i++) {
    for (const bucket of buckets) {
      if (i < bucket.length) result.push(bucket[i]);
    }
  }
  // 5. Clean-up pass: swap adjacent same-group items
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

export default function PhotographyPage() {
  const [page, setPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [darkroomDone, setDarkroomDone] = useState(false);

  // Darkroom entry animation
  useEffect(() => {
    const t = setTimeout(() => setDarkroomDone(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Thumbnail-folder images are low-res poster crops for other pages — never show them here.
  const galleryPhotos = useMemo(() => spreadShuffle(PHOTOS.filter((p) => !p.isThumbnail)), []);


  const visiblePhotos = useMemo(
    () => galleryPhotos.slice(0, page * BATCH_SIZE),
    [galleryPhotos, page]
  );

  const hasMore = visiblePhotos.length < galleryPhotos.length;

  const handleLoadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const featuredPhoto = galleryPhotos.find((p) => p.aspect === "wide") || galleryPhotos[0];

  return (
    <>
      {/* Darkroom wash overlay */}
      <AnimatePresence>
        {!darkroomDone && (
          <motion.div
            key="darkroom"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9998,
              background: "rgba(140, 30, 30, 0.12)",
              pointerEvents: "none",
            }}
          />
        )}
      </AnimatePresence>

      <div style={{ background: "#111823", minHeight: "100vh", paddingTop: 100, paddingBottom: 80 }}>
        {/* Back link */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 32px" }}>
          <Link
            href="/"
            style={{
              fontFamily: "'Courier New', monospace",
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "rgba(170,146,115,0.5)",
              textDecoration: "none",
              textTransform: "uppercase",
              transition: "color 0.3s ease",
              cursor: "none",
            }}
            onMouseOver={(e) => (e.currentTarget.style.color = "#AA9273")}
            onMouseOut={(e) => (e.currentTarget.style.color = "rgba(170,146,115,0.5)")}
          >
            &larr; Back to Infinite Frames
          </Link>
        </div>

        {/* Hero */}
        {featuredPhoto && (
          <ContactSheetHero
            featuredSrc={featuredPhoto.src}
            featuredAlt={featuredPhoto.alt}
            frameCount={galleryPhotos.length}
          />
        )}

        {/* Gallery */}
        <ContactSheetGallery
          photos={visiblePhotos}
          onOpen={openLightbox}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />

      </div>

      {/* Warms the browser cache for full-res photos during idle time */}
      <LightboxPreloader photos={galleryPhotos} />

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={visiblePhotos}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
          showCategory={false}
        />
      )}
    </>
  );
}
