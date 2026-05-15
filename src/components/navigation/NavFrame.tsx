"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import { useCursorContext } from "@/providers/CursorProvider";

interface NavFrameProps {
  label: string;
  href: string;
  clip?: string;
  isActive?: boolean;
  onClick?: (e: React.MouseEvent) => void;
}

export default function NavFrame({ label, href, clip, isActive, onClick }: NavFrameProps) {
  const [hovered, setHovered] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setCursor, resetCursor } = useCursorContext();

  const handleEnter = () => {
    setHovered(true);
    if (videoRef.current && clip) {
      videoRef.current.play().catch(() => {});
    }
    setCursor("crosshair");
  };

  const handleLeave = () => {
    setHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    resetCursor();
  };

  return (
    <motion.a
      href={href}
      onClick={onClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        width: "auto",
        minWidth: 80,
        padding: "0 12px",
        height: 52,
        textDecoration: "none",
        overflow: "hidden",
        flexShrink: 0,
      }}
      aria-label={`Navigate to ${label}`}
    >
      {/* Frame border */}
      <div
        style={{
          position: "absolute",
          inset: 2,
          border: isActive
            ? "1px solid rgba(212,175,119,0.7)"
            : "1px solid rgba(212,175,119,0.2)",
          borderRadius: 1,
          transition: "border-color 0.3s ease",
        }}
      />

      {/* Video preview — develops on hover */}
      {clip && (
        <video
          ref={videoRef}
          src={clip}
          muted
          playsInline
          loop
          style={{
            position: "absolute",
            inset: 3,
            width: "calc(100% - 6px)",
            height: "calc(100% - 6px)",
            objectFit: "cover",
            filter: hovered
              ? "grayscale(0) brightness(0.7) sepia(0.1)"
              : "grayscale(1) brightness(0) sepia(1)",
            transition: "filter 0.8s ease",
            opacity: hovered ? 0.5 : 0,
          }}
        />
      )}

      {/* Dark overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hovered ? "rgba(0,0,0,0.3)" : "rgba(0,0,0,0.7)",
          transition: "background 0.5s ease",
        }}
      />

      {/* Frame number (top left) */}
      <div
        style={{
          position: "absolute",
          top: 5,
          left: 6,
          fontFamily: "Courier New, monospace",
          fontSize: 7,
          color: "rgba(212,175,119,0.3)",
          letterSpacing: "0.05em",
          lineHeight: 1,
        }}
      >
        {String(Math.floor(Math.random() * 90) + 10)}A
      </div>

      {/* Label */}
      <motion.span
        style={{
          position: "relative",
          fontFamily: "var(--font-cinzel), serif",
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: isActive ? "#d4af77" : "rgba(245,240,232,0.7)",
          transition: "color 0.3s ease",
          zIndex: 1,
          textAlign: "center",
        }}
        animate={{ color: hovered ? "#d4af77" : isActive ? "#d4af77" : "rgba(245,240,232,0.7)" }}
      >
        {label}
      </motion.span>

      {/* Gold underline */}
      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isActive || hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          bottom: 6,
          left: "20%",
          right: "20%",
          height: 1,
          background: "#d4af77",
          transformOrigin: "left",
          boxShadow: "0 0 4px rgba(212,175,119,0.6)",
        }}
      />
    </motion.a>
  );
}
