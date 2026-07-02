"use client";

import React, { useRef, useState } from "react";
import { motion } from "framer-motion";
import CldPhoto from "@/components/common/CldPhoto";
import type { Project } from "@/types";
import { useCursorContext } from "@/providers/CursorProvider";
import { getBlurDataUrl } from "@/lib/blur-placeholders";

interface ProjectCardProps {
  project: Project;
  onClick: () => void;
}

export default function ProjectCard({ project, onClick }: ProjectCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [hovered, setHovered] = useState(false);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const { setCursor, resetCursor } = useCursorContext();
  const hasHoverVideo = Boolean(project.video);

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
    <div style={{ display: "flex", flexDirection: "column" }}>
      <style>{`
        .project-card-wrapper {
          aspect-ratio: 2/3;
        }
        @media (max-width: 768px) {
          .project-card-wrapper {
            aspect-ratio: 16/9 !important;
          }
        }
        .project-card-poster-landscape {
          display: none;
        }
        @media (max-width: 768px) {
          .project-card-poster-portrait {
            display: none;
          }
          .project-card-poster-landscape {
            display: block;
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
        background: "#45302A",
        border: `1px solid ${hovered ? "rgba(170,146,115,0.3)" : "rgba(170,146,115,0.08)"}`,
        transformStyle: "preserve-3d",
        transform: `perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${hovered ? 1.03 : 1})`,
        transition: "transform 0.15s ease, border-color 0.3s ease",
        boxShadow: hovered ? "0 20px 60px rgba(0,0,0,0.6), 0 0 0 1px rgba(170,146,115,0.1)" : "none",
      }}
      role="button"
      aria-label={`View ${project.title}`}
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
    >
      {/* Poster image */}
      {project.poster ? (
        <>
          <CldPhoto
            src={project.poster}
            alt={project.title}
            fill
            crop="fill"
            gravity="auto"
            placeholder="blur"
            blurDataURL={getBlurDataUrl(project.poster)}
            className={project.posterLandscape ? "project-card-poster-portrait" : undefined}
            style={{
              objectFit: "cover",
              filter: hovered ? "brightness(0.85) contrast(1.05)" : "brightness(0.75) grayscale(0.15) sepia(0.1)",
              opacity: hovered && hasHoverVideo ? 0 : 1,
              transition: "opacity 0.5s ease, filter 0.6s ease, transform 0.6s ease",
              transform: hovered ? "scale(1.06)" : "scale(1)",
            }}
            sizes="(max-width: 768px) 50vw, 30vw"
          />
          {project.posterLandscape && (
            <CldPhoto
              src={project.posterLandscape}
              alt={project.title}
              fill
              crop="fill"
              gravity="auto"
              placeholder="blur"
              blurDataURL={getBlurDataUrl(project.posterLandscape)}
              className="project-card-poster-landscape"
              style={{
                objectFit: "cover",
                filter: hovered ? "brightness(0.85) contrast(1.05)" : "brightness(0.75) grayscale(0.15) sepia(0.1)",
                opacity: hovered && hasHoverVideo ? 0 : 1,
                transition: "opacity 0.5s ease, filter 0.6s ease, transform 0.6s ease",
                transform: hovered ? "scale(1.06)" : "scale(1)",
              }}
              sizes="(max-width: 768px) 50vw, 30vw"
            />
          )}
        </>
      ) : (
        <div style={{ position: "absolute", inset: 0, background: "#1a1e28" }} />
      )}

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
            opacity: hovered ? 1 : 0,
            transition: "opacity 0.5s ease",
          }}
        />
      )}

      {/* Film frame border */}
      <div
        style={{
          position: "absolute",
          inset: 8,
          border: "1px solid rgba(170,146,115,0.12)",
          borderRadius: 1,
          pointerEvents: "none",
          opacity: hovered ? 1 : 0.4,
          transition: "opacity 0.3s ease",
        }}
        aria-hidden
      />

      {/* Small bottom gradient for title legibility only */}
      <div
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "35%",
          background: "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)",
          pointerEvents: "none",
        }}
        aria-hidden
      />

      {/* Year */}
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          fontFamily: "Courier New, monospace",
          fontSize: 16,
          fontWeight: 700,
          color: "rgba(248,244,237,0.7)",
          letterSpacing: "0.08em",
          textShadow: "0 1px 6px rgba(0,0,0,0.6)",
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
          padding: "20px 16px 6px",
        }}
      >
        <h3
          style={{
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "clamp(0.8rem, 1.4vw, 1rem)",
            fontWeight: 700,
            color: "#F8F4ED",
            letterSpacing: "0.06em",
            marginBottom: 0,
          }}
        >
          {project.title}
        </h3>

        {/* Watch indicator */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 8 }}
          transition={{ duration: 0.25 }}
          style={{
            marginTop: 8,
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 9,
            letterSpacing: "0.25em",
            color: "#AA9273",
            textTransform: "uppercase",
          }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#AA9273">
            <circle cx="12" cy="12" r="10" fill="none" stroke="#AA9273" strokeWidth="1.5" />
            <path d="M10 8l6 4-6 4V8z" />
          </svg>
          Click to Screen
        </motion.div>
      </div>
    </motion.div>

    {/* Role / work done — displayed outside and below the poster */}
    <div
      style={{
        padding: "10px 4px 0",
        display: "flex",
        alignItems: "center",
        gap: 6,
      }}
    >
      <span
        style={{
          width: 4,
          height: 4,
          borderRadius: "50%",
          background: "#AA9273",
          flexShrink: 0,
        }}
      />
      <p
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 11,
          fontWeight: 500,
          color: "rgba(248,244,237,0.55)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          margin: 0,
        }}
      >
        {project.role}
      </p>
    </div>
    </div>
  );
}
