"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import ContactSheetHero from "@/components/photography/ContactSheetHero";
import FilterBar from "@/components/photography/FilterBar";
import ContactSheetGallery from "@/components/photography/ContactSheetGallery";
import PhotoLightbox from "@/components/photography/PhotoLightbox";
import { PHOTOS, FEATURED_PHOTOS } from "@/lib/data";
import type { PhotoCategory } from "@/types";

const BATCH_SIZE = 20;

export default function PhotographyPage() {
  const [activeCategory, setActiveCategory] = useState<PhotoCategory | "all">("all");
  const [page, setPage] = useState(1);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [darkroomDone, setDarkroomDone] = useState(false);

  // Darkroom entry animation
  useEffect(() => {
    const t = setTimeout(() => setDarkroomDone(true), 800);
    return () => clearTimeout(t);
  }, []);

  const filteredPhotos = useMemo(
    () =>
      activeCategory === "all"
        ? PHOTOS
        : PHOTOS.filter((p) => p.category === activeCategory),
    [activeCategory]
  );

  const visiblePhotos = useMemo(
    () => filteredPhotos.slice(0, page * BATCH_SIZE),
    [filteredPhotos, page]
  );

  const hasMore = visiblePhotos.length < filteredPhotos.length;

  const handleFilterChange = useCallback((cat: PhotoCategory | "all") => {
    setActiveCategory(cat);
    setPage(1);
  }, []);

  const handleLoadMore = useCallback(() => {
    setPage((p) => p + 1);
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const featuredPhoto = PHOTOS.find((p) => p.id === FEATURED_PHOTOS[0]);

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
          />
        )}

        {/* Filters */}
        <FilterBar active={activeCategory} onChange={handleFilterChange} />

        {/* Gallery */}
        <ContactSheetGallery
          photos={visiblePhotos}
          onOpen={openLightbox}
          onLoadMore={handleLoadMore}
          hasMore={hasMore}
        />

      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <PhotoLightbox
          photos={visiblePhotos}
          initialIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}
