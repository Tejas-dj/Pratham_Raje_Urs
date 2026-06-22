"use client";

import React, { useState, useCallback, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import CuttingRoomHero from "@/components/reels/CuttingRoomHero";
import ReelFilterBar from "@/components/reels/ReelFilterBar";
import ReelsGrid from "@/components/reels/ReelsGrid";
import ReelPlayer from "@/components/reels/ReelPlayer";
import { REELS, FEATURED_REELS } from "@/lib/data";
import type { Reel, ReelCategory } from "@/types";

export default function ReelsPage() {
  const [activeCategory, setActiveCategory] = useState<ReelCategory | "all">("all");
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const [spliceDone, setSpliceDone] = useState(false);

  // Film splice entry animation
  useEffect(() => {
    const t = setTimeout(() => setSpliceDone(true), 600);
    return () => clearTimeout(t);
  }, []);

  const filteredReels = useMemo(
    () =>
      activeCategory === "all"
        ? REELS
        : REELS.filter((r) => r.category === activeCategory),
    [activeCategory]
  );

  const handleFilterChange = useCallback((cat: ReelCategory | "all") => {
    setActiveCategory(cat);
  }, []);

  const openPlayer = useCallback((reel: Reel) => {
    setActiveReel(reel);
  }, []);

  const closePlayer = useCallback(() => {
    setActiveReel(null);
  }, []);

  const featuredReel = REELS.find((r) => FEATURED_REELS.includes(r.id));

  return (
    <>
      {/* Film splice line animation */}
      <AnimatePresence>
        {!spliceDone && (
          <motion.div
            key="splice"
            initial={{ scaleX: 0 }}
            animate={{ scaleX: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: "fixed",
              top: "50%",
              left: 0,
              right: 0,
              height: 2,
              background: "linear-gradient(to right, transparent, #AA9273, transparent)",
              transformOrigin: "left center",
              zIndex: 9998,
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
        {featuredReel && (
          <CuttingRoomHero reel={featuredReel} onPlay={openPlayer} />
        )}

        {/* Page title */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}>
          <h1
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(1.8rem, 5vw, 3.5rem)",
              fontWeight: 800,
              color: "#F8F4ED",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            The Cutting Room
          </h1>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              color: "rgba(248,244,237,0.35)",
              maxWidth: 500,
              lineHeight: 1.8,
              fontStyle: "italic",
            }}
          >
            Quick cuts. Raw reels. The edit before the edit. Every piece here is
            a distilled fragment of something larger — mood boards, teasers, and
            experiments that deserve their own frame.
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 24 }}>
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 10,
                letterSpacing: "0.2em",
                color: "rgba(170,146,115,0.4)",
                textTransform: "uppercase",
              }}
            >
              {REELS.length} Reels &middot; 2023&ndash;2025
            </span>
            <div style={{ flex: 1, height: 1, background: "rgba(170,146,115,0.1)" }} />
          </div>
        </div>

        {/* Filters */}
        <ReelFilterBar active={activeCategory} onChange={handleFilterChange} />

        {/* Grid */}
        <ReelsGrid reels={filteredReels} onPlay={openPlayer} />

      </div>

      {/* Player */}
      {activeReel && (
        <ReelPlayer
          reels={filteredReels}
          initialReel={activeReel}
          onClose={closePlayer}
        />
      )}
    </>
  );
}
