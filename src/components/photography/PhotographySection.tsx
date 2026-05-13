"use client";

import React, { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useCursorContext } from "@/providers/CursorProvider";

const PHOTOS = [
  { id: 1, alt: "Mysuru streets at dawn", aspect: "tall" },
  { id: 2, alt: "Portrait in golden light", aspect: "wide" },
  { id: 3, alt: "Monsoon reflection", aspect: "tall" },
  { id: 4, alt: "Film set candid", aspect: "square" },
  { id: 5, alt: "Temple corridor", aspect: "wide" },
  { id: 6, alt: "Hands of the craft", aspect: "tall" },
  { id: 7, alt: "Twilight cityscape", aspect: "square" },
  { id: 8, alt: "Rice fields, Karnataka", aspect: "wide" },
  { id: 9, alt: "Smoke and shadows", aspect: "tall" },
];

const ASPECT_HEIGHTS: Record<string, number> = {
  tall: 340,
  wide: 220,
  square: 270,
};


const CORNER_STYLES = [
  { top: 6, left: 6, borderTop: "1px solid rgba(212,175,119,0.25)", borderLeft: "1px solid rgba(212,175,119,0.25)" },
  { top: 6, right: 6, borderTop: "1px solid rgba(212,175,119,0.25)", borderRight: "1px solid rgba(212,175,119,0.25)" },
  { bottom: 6, left: 6, borderBottom: "1px solid rgba(212,175,119,0.25)", borderLeft: "1px solid rgba(212,175,119,0.25)" },
  { bottom: 6, right: 6, borderBottom: "1px solid rgba(212,175,119,0.25)", borderRight: "1px solid rgba(212,175,119,0.25)" },
] as const;

function PhotoCard({ photo, index }: { photo: (typeof PHOTOS)[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursorContext();
  const inView = useInView(ref, { once: false, margin: "-8% 0px" });
  const height = ASPECT_HEIGHTS[photo.aspect];

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.75, delay: (index % 3) * 0.08, ease: [0.22, 1, 0.36, 1] }}
      style={{ breakInside: "avoid", marginBottom: 10, overflow: "hidden", borderRadius: 2, cursor: "none" }}
      onMouseEnter={() => setCursor("crosshair")}
      onMouseLeave={resetCursor}
      whileHover={{ scale: 1.015 }}
    >
      <div
        style={{
          width: "100%",
          height,
          position: "relative",
          overflow: "hidden",
          background: "#111",
        }}
      >
        <img
          src="/images/image_tester_1.png"
          alt={photo.alt}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            display: "block",
            filter: "brightness(0.8) contrast(1.05)",
          }}
        />
        {/* Film-frame corner brackets */}
        {CORNER_STYLES.map((cornerStyle, ci) => (
          <div key={ci} style={{ position: "absolute", width: 12, height: 12, ...cornerStyle }} />
        ))}

        {/* Frame number */}
        <div
          style={{
            position: "absolute",
            top: 8,
            left: 0,
            right: 0,
            textAlign: "right",
            paddingRight: 10,
            fontFamily: "Courier New, monospace",
            fontSize: 8,
            color: "rgba(212,175,119,0.18)",
            letterSpacing: "0.15em",
          }}
        >
          {String(photo.id).padStart(2, "0")}
        </div>

        {/* Caption on hover */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          whileHover={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "24px 12px 10px",
            background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 9,
              color: "rgba(212,175,119,0.6)",
              letterSpacing: "0.2em",
              textTransform: "uppercase",
            }}
          >
            {photo.alt}
          </span>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function PhotographySection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-15%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });

  const scale = useTransform(scrollYProgress, [0, 1], [0.9, 1.0]);
  const opacity = useTransform(scrollYProgress, [0, 0.25], [0, 1]);

  return (
    <section
      id="photography"
      ref={sectionRef}
      style={{ position: "relative", background: "#0a0a0a", padding: "100px 0 80px", overflow: "hidden" }}
      aria-label="Photography by Pratham"
    >
      {/* Section header */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 52px" }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
          <div style={{ width: 40, height: 1, background: "#d4af77", opacity: 0.4 }} />
          <span
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 10,
              letterSpacing: "0.4em",
              color: "rgba(212,175,119,0.5)",
              textTransform: "uppercase",
            }}
          >
            Still Frames
          </span>
          <div style={{ flex: 1, height: 1, background: "rgba(212,175,119,0.08)" }} />
        </div>
        <h2
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "clamp(1.4rem, 4vw, 2.8rem)",
            fontWeight: 800,
            color: "#f5f0e8",
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
            color: "rgba(245,240,232,0.35)",
            maxWidth: 460,
            lineHeight: 1.8,
          }}
        >
          Between frames, Pratham photographs the quiet in-between — still moments that cinema
          never gets to hold long enough.
        </p>
      </motion.div>

      {/* Masonry grid — grows into screen as section scrolls into view */}
      <motion.div
        style={{
          scale,
          opacity,
          transformOrigin: "top center",
          maxWidth: 1200,
          margin: "0 auto",
          padding: "0 24px",
          columns: "3 260px",
          columnGap: 10,
        }}
      >
        {PHOTOS.map((photo, i) => (
          <PhotoCard key={photo.id} photo={photo} index={i} />
        ))}
      </motion.div>

      {/* Edge vignette */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(ellipse 110% 70% at 50% 50%, transparent 45%, rgba(10,10,10,0.65) 100%)",
          pointerEvents: "none",
        }}
      />
    </section>
  );
}
