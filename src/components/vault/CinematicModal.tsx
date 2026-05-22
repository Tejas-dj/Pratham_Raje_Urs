"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import type { Project } from "@/types";

interface CinematicModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function CinematicModal({ project, isOpen, onClose }: CinematicModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [showContent, setShowContent] = useState(false);

  useEffect(() => {
    if (!isOpen) {
      setPlaying(false);
      setCountdown(3);
      setShowContent(false);
      return;
    }

    // Film countdown before content
    setCountdown(3);
    setShowContent(false);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setShowContent(true);
      }
    }, 500);

    return () => clearInterval(interval);
  }, [isOpen, project]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === " ") togglePlay();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  function togglePlay() {
    if (!videoRef.current || !project?.video) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setPlaying((p) => !p);
  }

  if (!project) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99980,
            background: "rgba(0,0,0,0.98)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {/* Film countdown */}
          <AnimatePresence>
            {!showContent && (
              <motion.div
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "#111823",
                  zIndex: 2,
                }}
              >
                {/* Countdown number */}
                <motion.div
                  key={countdown}
                  initial={{ scale: 2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: "15vw",
                    fontWeight: 900,
                    color: "#F8F4ED",
                    textShadow: "0 0 60px rgba(255,255,255,0.2)",
                  }}
                >
                  {countdown > 0 ? countdown : "▶"}
                </motion.div>

                {/* Ring */}
                <div
                  style={{
                    position: "absolute",
                    width: "20vw",
                    height: "20vw",
                    border: "1px solid rgba(170,146,115,0.2)",
                    borderRadius: "50%",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    width: "22vw",
                    height: "22vw",
                    border: "1px solid rgba(170,146,115,0.08)",
                    borderRadius: "50%",
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Main content */}
          <AnimatePresence>
            {showContent && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6 }}
                style={{
                  position: "relative",
                  width: "min(94vw, 1100px)",
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                }}
              >
                {/* Film borders top */}
                <div
                  style={{
                    height: 28,
                    background: "#45302A",
                    border: "1px solid rgba(170,146,115,0.12)",
                    borderBottom: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 12px",
                    overflow: "hidden",
                  }}
                  aria-hidden
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 14,
                        height: 12,
                        border: "1px solid rgba(170,146,115,0.25)",
                        borderRadius: 1,
                        background: "#111823",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>

                {/* Video or poster */}
                <div style={{ position: "relative", aspectRatio: "16/9", background: "#111823" }}>
                  {project.video ? (
                    <video
                      ref={videoRef}
                      src={project.video}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                      playsInline
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                    />
                  ) : (
                    <Image
                      src={project.poster}
                      alt={project.title}
                      fill
                      style={{ objectFit: "cover" }}
                    />
                  )}

                  {/* Projector beam overlay */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      background: "radial-gradient(ellipse at 50% -10%, rgba(255,220,150,0.06) 0%, transparent 60%)",
                      pointerEvents: "none",
                    }}
                  />

                  {/* Play/pause overlay */}
                  {project.video && (
                    <button
                      onClick={togglePlay}
                      style={{
                        position: "absolute",
                        inset: 0,
                        background: "none",
                        border: "none",
                        cursor: "none",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                      aria-label={playing ? "Pause" : "Play"}
                    >
                      <AnimatePresence>
                        {!playing && (
                          <motion.div
                            initial={{ scale: 0.8, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.8, opacity: 0 }}
                            style={{
                              width: 64,
                              height: 64,
                              border: "2px solid rgba(170,146,115,0.7)",
                              borderRadius: "50%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              background: "rgba(0,0,0,0.5)",
                            }}
                          >
                            <svg width="22" height="22" viewBox="0 0 24 24" fill="#AA9273">
                              <path d="M8 5v14l11-7z" />
                            </svg>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </button>
                  )}
                </div>

                {/* Film borders bottom */}
                <div
                  style={{
                    height: 28,
                    background: "#45302A",
                    border: "1px solid rgba(170,146,115,0.12)",
                    borderTop: "none",
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    padding: "0 12px",
                    overflow: "hidden",
                  }}
                  aria-hidden
                >
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      style={{
                        width: 14,
                        height: 12,
                        border: "1px solid rgba(170,146,115,0.25)",
                        borderRadius: 1,
                        background: "#111823",
                        flexShrink: 0,
                      }}
                    />
                  ))}
                </div>

                {/* Info bar */}
                <div
                  style={{
                    padding: "16px 24px",
                    background: "rgba(10,10,10,0.8)",
                    backdropFilter: "blur(8px)",
                    display: "flex",
                    alignItems: "flex-start",
                    justifyContent: "space-between",
                    gap: 16,
                    flexWrap: "wrap",
                    border: "1px solid rgba(170,146,115,0.08)",
                    borderTop: "none",
                  }}
                >
                  <div>
                    <h2
                      style={{
                        fontFamily: "var(--font-cinzel), serif",
                        fontSize: "clamp(1rem, 2.5vw, 1.5rem)",
                        fontWeight: 700,
                        color: "#AA9273",
                        letterSpacing: "0.08em",
                        marginBottom: 4,
                      }}
                    >
                      {project.title}
                    </h2>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: 12,
                        color: "rgba(248,244,237,0.5)",
                        letterSpacing: "0.1em",
                        marginBottom: 8,
                      }}
                    >
                      {project.role} · {project.year}
                    </p>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: 13,
                        color: "rgba(248,244,237,0.65)",
                        lineHeight: 1.6,
                        maxWidth: 500,
                      }}
                    >
                      {project.description}
                    </p>
                    {project.badges.length > 0 && (
                      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
                        {project.badges.map((badge) => (
                          <span
                            key={badge}
                            style={{
                              padding: "3px 10px",
                              border: "1px solid rgba(170,146,115,0.4)",
                              borderRadius: 1,
                              fontSize: 9,
                              fontFamily: "var(--font-inter), sans-serif",
                              fontWeight: 600,
                              letterSpacing: "0.2em",
                              color: "#AA9273",
                              textTransform: "uppercase",
                            }}
                          >
                            {badge}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* End card title */}
                  <div style={{ textAlign: "right", flexShrink: 0 }}>
                    <div
                      style={{
                        fontFamily: "Courier New, monospace",
                        fontSize: 9,
                        color: "rgba(170,146,115,0.3)",
                        letterSpacing: "0.2em",
                        marginBottom: 4,
                      }}
                    >
                      TALON PRODUCTION HOUSE
                    </div>
                    <div
                      style={{
                        fontFamily: "Courier New, monospace",
                        fontSize: 8,
                        color: "rgba(170,146,115,0.2)",
                        letterSpacing: "0.15em",
                      }}
                    >
                      prathamrajeurs.com
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              position: "absolute",
              top: 20,
              right: 20,
              background: "rgba(0,0,0,0.7)",
              border: "1px solid rgba(170,146,115,0.3)",
              color: "#AA9273",
              width: 36,
              height: 36,
              borderRadius: "50%",
              fontSize: 18,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "none",
            }}
          >
            ×
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
