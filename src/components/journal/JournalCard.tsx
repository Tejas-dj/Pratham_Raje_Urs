"use client";

import React, { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";
import type { JournalPost } from "@/types";
import { useCursorContext } from "@/providers/CursorProvider";
import { getBlurDataUrl } from "@/lib/blur-placeholders";

interface JournalCardProps {
  post: JournalPost;
}

export default function JournalCard({ post }: JournalCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();

  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [30, -30]);
  const imgScale = useTransform(scrollYProgress, [0, 1], [1.08, 1.0]);

  return (
    <motion.article
      ref={cardRef}
      onMouseEnter={() => {
        setHovered(true);
        setCursor("crosshair");
        if (videoRef.current && post.video) videoRef.current.play().catch(() => {});
      }}
      onMouseLeave={() => {
        setHovered(false);
        resetCursor();
        if (videoRef.current) { videoRef.current.pause(); videoRef.current.currentTime = 0; }
      }}
      style={{
        position: "relative",
        background: "#45302A",
        border: `1px solid ${hovered ? "rgba(170,146,115,0.25)" : "rgba(170,146,115,0.08)"}`,
        borderRadius: 2,
        overflow: "hidden",
        cursor: "none",
        transition: "border-color 0.3s ease",
      }}
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 250, damping: 20 }}
    >
      {/* Image with parallax */}
      <div style={{ position: "relative", height: 200, overflow: "hidden" }}>
        <motion.div style={{ scale: imgScale, height: "110%", position: "absolute", inset: 0 }}>
          <Image
            src={post.image}
            alt={post.title}
            fill
            placeholder="blur"
            blurDataURL={getBlurDataUrl(post.image)}
            style={{
              objectFit: "cover",
              filter: hovered ? "brightness(0.8) contrast(1.05)" : "brightness(0.6) grayscale(0.2) sepia(0.15)",
              transition: "filter 0.5s ease",
            }}
            sizes="(max-width: 768px) 100vw, 33vw"
          />
        </motion.div>

        {/* Video reveal on hover */}
        {post.video && (
          <video
            ref={videoRef}
            src={post.video}
            muted
            playsInline
            loop
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: hovered ? 0.5 : 0,
              transition: "opacity 0.6s ease",
            }}
          />
        )}

        {/* Category badge */}
        <div
          style={{
            position: "absolute",
            top: 12,
            left: 12,
            padding: "3px 10px",
            background: "rgba(0,0,0,0.7)",
            border: "1px solid rgba(170,146,115,0.3)",
            borderRadius: 1,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 8,
            fontWeight: 700,
            letterSpacing: "0.25em",
            color: "#AA9273",
            textTransform: "uppercase",
          }}
        >
          {post.category}
        </div>
      </div>

      {/* Content */}
      <motion.div style={{ y }}>
        <div style={{ padding: "18px 16px 20px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              marginBottom: 8,
            }}
          >
            <span
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: 9,
                color: "rgba(170,146,115,0.4)",
                letterSpacing: "0.1em",
              }}
            >
              {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
            </span>
            <span style={{ color: "rgba(170,146,115,0.2)" }}>·</span>
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 9,
                color: "rgba(248,244,237,0.3)",
                letterSpacing: "0.1em",
              }}
            >
              {post.readTime}
            </span>
          </div>

          <h3
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(0.85rem, 1.5vw, 1rem)",
              fontWeight: 700,
              color: "#F8F4ED",
              letterSpacing: "0.05em",
              marginBottom: 8,
              lineHeight: 1.4,
            }}
          >
            {post.title}
          </h3>

          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 12,
              color: "rgba(248,244,237,0.5)",
              lineHeight: 1.6,
              marginBottom: 14,
            }}
          >
            {post.excerpt}
          </p>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 9,
              letterSpacing: "0.2em",
              color: hovered ? "#AA9273" : "rgba(170,146,115,0.3)",
              textTransform: "uppercase",
              transition: "color 0.3s ease",
            }}
          >
            Read Entry
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M5 12h14M12 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </motion.div>
    </motion.article>
  );
}
