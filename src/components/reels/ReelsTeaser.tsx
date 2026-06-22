"use client";

import React, { useRef, useState, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import Link from "next/link";
import { useCursorContext } from "@/providers/CursorProvider";
import { useIsMobile } from "@/hooks/useIsMobile";
import ReelCard from "./ReelCard";
import ReelPlayer from "./ReelPlayer";
import { REELS, FEATURED_REELS } from "@/lib/data";
import type { Reel } from "@/types";

export default function ReelsTeaser() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-15%" });
  const [activeReel, setActiveReel] = useState<Reel | null>(null);
  const isMobile = useIsMobile();
  const { setCursor, resetCursor } = useCursorContext();

  const featuredReels = REELS.filter((r) => FEATURED_REELS.includes(r.id));

  const openPlayer = useCallback((reel: Reel) => setActiveReel(reel), []);
  const closePlayer = useCallback(() => setActiveReel(null), []);

  return (
    <>
      <section
        id="reels"
        ref={sectionRef}
        style={{ position: "relative", background: "#111823", padding: "100px 0 80px", overflow: "hidden" }}
        aria-label="Short-form reels by Pratham Raje Urs"
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
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              Latest Cuts
              {/* Blinking REC dot */}
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: "#c04040",
                  display: "inline-block",
                  animation: "film-flicker 1.5s ease-in-out infinite",
                }}
              />
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
            Quick Cuts &amp; Reels
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
            Short-form cinema — mood edits, behind-the-scenes, and experiments
            distilled into 15-60 second cuts.
          </p>
        </motion.div>

        {/* 3-card grid */}
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
          <style>{`
            .teaser-reels-grid {
              display: grid;
              grid-template-columns: repeat(3, 1fr);
              gap: 24px;
            }
            @media (max-width: 768px) {
              .teaser-reels-grid {
                grid-template-columns: 1fr;
                gap: 20px;
              }
            }
          `}</style>

          <div className="teaser-reels-grid">
            {featuredReels.map((reel, i) => (
              <ReelCard key={reel.id} reel={reel} index={i} onPlay={openPlayer} />
            ))}
          </div>

          {/* CTA */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            style={{ textAlign: "center", marginTop: 48 }}
          >
            <Link
              href="/reels"
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
              Enter The Cutting Room
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
        </div>

        {/* Edge vignette */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse 110% 70% at 50% 50%, transparent 45%, rgba(17,24,35,0.55) 100%)",
            pointerEvents: "none",
          }}
        />
      </section>

      {activeReel && (
        <ReelPlayer
          reels={featuredReels}
          initialReel={activeReel}
          onClose={closePlayer}
        />
      )}
    </>
  );
}
