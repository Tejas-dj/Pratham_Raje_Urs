"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import CldPhoto from "@/components/common/CldPhoto";

const CORNERS = [
  { top: 12, left: 12, borderTop: "1px solid rgba(170,146,115,0.3)", borderLeft: "1px solid rgba(170,146,115,0.3)" },
  { top: 12, right: 12, borderTop: "1px solid rgba(170,146,115,0.3)", borderRight: "1px solid rgba(170,146,115,0.3)" },
  { bottom: 12, left: 12, borderBottom: "1px solid rgba(170,146,115,0.3)", borderLeft: "1px solid rgba(170,146,115,0.3)" },
  { bottom: 12, right: 12, borderBottom: "1px solid rgba(170,146,115,0.3)", borderRight: "1px solid rgba(170,146,115,0.3)" },
] as const;

interface ContactSheetHeroProps {
  featuredSrc: string;
  featuredAlt: string;
  frameCount: number;
}

export default function ContactSheetHero({ featuredSrc, featuredAlt, frameCount }: ContactSheetHeroProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-5%" });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 48px" }}
    >
      {/* Featured image */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "clamp(220px, 40vw, 440px)",
          overflow: "hidden",
          borderRadius: 2,
          marginBottom: 32,
        }}
      >
        <CldPhoto
          src={featuredSrc}
          alt={featuredAlt}
          fill
          crop="fill"
          gravity="auto"
          sizes="100vw"
          loading="eager"
          preload
          style={{
            objectFit: "cover",
            filter: "brightness(0.75) contrast(1.08)",
          }}
        />
        {CORNERS.map((cs, i) => (
          <div
            key={i}
            style={{ position: "absolute", width: 18, height: 18, pointerEvents: "none", ...cs }}
          />
        ))}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to top, rgba(17,24,35,0.7) 0%, transparent 50%)",
            pointerEvents: "none",
          }}
        />
      </div>

      {/* Title block */}
      <motion.h1
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "clamp(2rem, 6vw, 4rem)",
          fontWeight: 900,
          color: "#AA9273",
          letterSpacing: "0.12em",
          marginBottom: 12,
          textShadow: "0 0 30px rgba(170,146,115,0.3)",
        }}
      >
        CONTACT SHEET
      </motion.h1>

      {/* Frame count */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ duration: 0.6, delay: 0.4 }}
        style={{
          fontFamily: "'Courier New', monospace",
          fontSize: 11,
          letterSpacing: "0.25em",
          color: "rgba(170,146,115,0.45)",
          textTransform: "uppercase",
          marginBottom: 16,
        }}
      >
        {frameCount} FRAMES &middot; 2022&ndash;2026
      </motion.p>

      {/* Manifesto */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, delay: 0.5 }}
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "clamp(0.8rem, 1.4vw, 1rem)",
          fontStyle: "italic",
          color: "rgba(248,244,237,0.35)",
          maxWidth: 520,
          lineHeight: 1.8,
        }}
      >
        Between the frames. Before the edit. The raw, uncut moments.
      </motion.p>

      {/* Separator */}
      <div
        style={{
          width: 60,
          height: 1,
          background: "rgba(170,146,115,0.2)",
          marginTop: 32,
        }}
      />
    </motion.div>
  );
}
