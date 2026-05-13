"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { useCursorContext } from "@/providers/CursorProvider";

interface SocialOrbProps {
  platform: string;
  href: string;
  icon: React.ReactNode;
  color: string;
  label: string;
}

export default function SocialOrb({ platform, href, icon, color, label }: SocialOrbProps) {
  const [hovered, setHovered] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();

  return (
    <motion.a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onMouseEnter={() => { setHovered(true); setCursor("crosshair"); }}
      onMouseLeave={() => { setHovered(false); resetCursor(); }}
      aria-label={`Visit ${platform}`}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        textDecoration: "none",
        cursor: "none",
      }}
    >
      <motion.div
        animate={{
          rotate: hovered ? 0 : 360,
          scale: hovered ? 1.15 : 1,
          boxShadow: hovered
            ? `0 0 0 1px ${color}40, 0 0 24px ${color}30`
            : "0 0 0 1px rgba(212,175,119,0.1)",
        }}
        transition={
          hovered
            ? { duration: 0.3 }
            : { rotate: { duration: 8, repeat: Infinity, ease: "linear" }, scale: { duration: 0.3 } }
        }
        style={{
          width: 56,
          height: 56,
          borderRadius: "50%",
          background: `rgba(${hexToRgb(color)}, 0.08)`,
          border: `1px solid ${color}30`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          position: "relative",
        }}
      >
        {icon}

        {/* Orbit ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
          style={{
            position: "absolute",
            inset: -6,
            border: `1px dashed ${color}20`,
            borderRadius: "50%",
          }}
        />
      </motion.div>

      <span
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 9,
          letterSpacing: "0.2em",
          color: hovered ? color : "rgba(245,240,232,0.3)",
          textTransform: "uppercase",
          transition: "color 0.25s ease",
        }}
      >
        {label}
      </span>
    </motion.a>
  );
}

function hexToRgb(hex: string): string {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  if (!result) return "212, 175, 119";
  return `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`;
}
