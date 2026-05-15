"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/types";
import { useCursorContext } from "@/providers/CursorProvider";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

const BADGE_COLORS: Record<string, string> = {
  "He Stars In This": "#d4af77",
  "Dada Saheb Phalke Selected": "#7ed4d4",
  "Wedding Cinema": "#ff5e5e",
  "Acting Reel": "#a08040",
};

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const { setCursor, resetCursor } = useCursorContext();

  function handleMouseMove(e: React.MouseEvent) {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const rx = ((e.clientY - cy) / rect.height) * -12;
    const ry = ((e.clientX - cx) / rect.width) * 12;
    setRotateX(rx);
    setRotateY(ry);
  }

  function handleEnter() {
    setHovered(true);
    setCursor("video");
    if (videoRef.current && project.video) {
      videoRef.current.play().catch(() => {});
    }
  }

  function handleLeave() {
    setHovered(false);
    resetCursor();
    setRotateX(0);
    setRotateY(0);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }

  return (
    <>
      <style>{`
        .project-card-wrapper {
          aspect-ratio: 2/3;
        }
        @media (max-width: 768px) {
          .project-card-wrapper {
            aspect-ratio: 16/9 !important;
          }
        }
      `}</style>
    <motion.div
      ref={cardRef}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      className="project-card-wrapper"
      style={{
        position: "relative",
        borderRadius: 2,
        overflow: "hidden",
        cursor: "none",
        background: "#0d0d0d",
        border: `1px solid ${hovered ? "rgba(212,175,119,0.3)" : "rgba(212,175,119,0.08)"}`,
        transformStyle: "preserve-3d",
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${hovered ? 1.03 : 1})`,
        transition: "transform 0.15s ease, border-color 0.3s ease",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(212,175,119,0.1)" : "none",
      }}
      role="button"
      aria-label={`View ${project.title}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Poster image */}
      <Image
        src={project.poster}
        alt={project.title}
        fill
        style={{
          objectFit: "cover",
          filter: hovered ? "brightness(0.7) contrast(1.1)" : "brightness(0.55) grayscale(0.3) sepia(0.15)",
          transition: "filter 0.6s ease",
          transform: hovered ? "scale(1.06)" : "scale(1)",
        }}
        sizes="(max-width: 768px) 50vw, 30vw"
      />

      {/* Video layer */}
      {project.video && (
        <video
          ref={videoRef}
          src={project.video}
          muted
          playsInline
          loop
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: hovered ? 0.45 : 0,
            transition: "opacity 0.8s ease",
          }}
        />
      )}

      {/* Film frame border */}
      <div
        style={{
          position: "absolute",
          inset: 8,
          border: "1px solid rgba(212,175,119,0.12)",
          borderRadius: 1,
          pointerEvents: "none",
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.3s ease",
        }}
        aria-hidden
      />

      {/* Gradient overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
        aria-hidden
      />

      {/* Badges */}
      {project.badges.length > 0 && (
        <div
          style={{
            position: "absolute",
            top: 14,
            left: 14,
            display: "flex",
            flexDirection: "column",
            gap: 5,
          }}
        >
          {project.badges.map((badge) => (
            <span
              key={badge}
              style={{
                padding: "3px 8px",
                background: "rgba(0,0,0,0.7)",
                border: `1px solid ${BADGE_COLORS[badge] || "#d4af77"}`,
                borderRadius: 1,
                fontSize: 8,
                fontFamily: "var(--font-inter), sans-serif",
                fontWeight: 700,
                letterSpacing: "0.2em",
                color: BADGE_COLORS[badge] || "#d4af77",
                textTransform: "uppercase",
              }}
            >
              {badge}
            </span>
          ))}
        </div>
      )}

      {/* Year */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          fontFamily: "Courier New, monospace",
          fontSize: 9,
          color: "rgba(212,175,119,0.4)",
          letterSpacing: "0.1em",
        }}
      >
        {project.year}
      </div>

      {/* Title */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          padding: "20px 16px 16px",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "clamp(0.8rem, 1.4vw, 1rem)",
            fontWeight: 700,
            color: "#f5f0e8",
            letterSpacing: "0.06em",
            marginBottom: 4,
          }}
        >
          {project.title}
        </h3>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 10,
            color: "rgba(245,240,232,0.4)",
            letterSpacing: "0.1em",
            opacity: hovered ? 1 : 0.6,
            transition: "opacity 0.3s ease",
          }}
        >
          {project.role}
        </p>

        {/* Watch indicator */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.25 }}
          style={{
            marginTop: 10,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 9,
            letterSpacing: "0.25em",
            color: "#d4af77",
            textTransform: "uppercase",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#d4af77">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#d4af77" strokeWidth="1.5" />
            <path d="M10 8l6 4-6 4V8z" />
          </svg>
          Click to Screen
        </motion.div>
      </div>
    </motion.div>
    </>
  );
}
