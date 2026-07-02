"use client";

import React, { useEffect, useCallback, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { Reel } from "@/types";

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function SprocketRow() {
  const holes = Array.from({ length: 32 });
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-evenly",
        alignItems: "center",
        height: 18,
        background: "rgba(17,24,35,0.95)",
        flexShrink: 0,
      }}
    >
      {holes.map((_, i) => (
        <div
          key={i}
          style={{
            width: 6,
            height: 10,
            borderRadius: 1,
            background: "rgba(170,146,115,0.06)",
            border: "1px solid rgba(170,146,115,0.1)",
          }}
        />
      ))}
    </div>
  );
}

interface ReelPlayerProps {
  reels: Reel[];
  initialReel: Reel;
  onClose: () => void;
}

export default function ReelPlayer({ reels, initialReel, onClose }: ReelPlayerProps) {
  const currentIndex = reels.findIndex((r) => r.id === initialReel.id);
  const [index, setIndex] = useState(currentIndex >= 0 ? currentIndex : 0);
  const [countdown, setCountdown] = useState(3);
  const [showContent, setShowContent] = useState(false);
  const [playing, setPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const touchStartX = useRef<number | null>(null);

  const reel = reels[index];

  // Countdown
  useEffect(() => {
    setCountdown(3);
    setShowContent(false);
    setPlaying(false);

    let count = 3;
    const interval = setInterval(() => {
      count -= 1;
      setCountdown(count);
      if (count <= 0) {
        clearInterval(interval);
        setShowContent(true);
      }
    }, 400);
    return () => clearInterval(interval);
  }, [index]);

  // Auto-play after countdown
  useEffect(() => {
    if (showContent && videoRef.current) {
      videoRef.current.play().then(() => setPlaying(true)).catch(() => {});
    }
  }, [showContent]);

  // Scroll lock
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const goNext = useCallback(() => {
    setIndex((i) => (i + 1) % reels.length);
  }, [reels.length]);

  const goPrev = useCallback(() => {
    setIndex((i) => (i - 1 + reels.length) % reels.length);
  }, [reels.length]);

  const togglePlay = useCallback(() => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(() => {});
    }
    setPlaying((p) => !p);
  }, [playing]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === " ") { e.preventDefault(); togglePlay(); }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose, togglePlay]);

  // Swipe
  const onTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(dx) > 50) {
      dx < 0 ? goNext() : goPrev();
    }
    touchStartX.current = null;
  };

  // Up-next reels (next 3)
  const upNext = Array.from({ length: 3 }, (_, i) =>
    reels[(index + 1 + i) % reels.length]
  );

  return (
    <AnimatePresence>
      <motion.div
        key="reel-player-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 9999,
          background: "rgba(0,0,0,0.98)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
        }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        {/* Projector beam */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "radial-gradient(ellipse at 50% -10%, rgba(255,220,150,0.04) 0%, transparent 60%)",
            pointerEvents: "none",
          }}
        />

        {/* Close */}
        <button
          onClick={onClose}
          aria-label="Close player"
          style={{
            position: "absolute",
            top: 20,
            right: 24,
            background: "none",
            border: "1px solid rgba(170,146,115,0.25)",
            color: "rgba(170,146,115,0.7)",
            width: 36,
            height: 36,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "none",
            zIndex: 10,
            transition: "border-color 0.2s, color 0.2s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = "rgba(170,146,115,0.7)";
            e.currentTarget.style.color = "#AA9273";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = "rgba(170,146,115,0.25)";
            e.currentTarget.style.color = "rgba(170,146,115,0.7)";
          }}
        >
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
            <line x1="1" y1="1" x2="13" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <line x1="13" y1="1" x2="1" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        </button>

        {/* Counter */}
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 24,
            fontFamily: "'Courier New', monospace",
            fontSize: 11,
            letterSpacing: "0.25em",
            color: "rgba(170,146,115,0.55)",
            zIndex: 10,
          }}
        >
          REEL {String(index + 1).padStart(2, "0")}&nbsp;/&nbsp;{String(reels.length).padStart(2, "0")}
        </div>

        {/* Main content area */}
        <div
          style={{
            width: "100%",
            maxWidth: 900,
            display: "flex",
            flexDirection: "column",
            padding: "60px 24px 120px",
          }}
        >
          {/* Countdown overlay */}
          <AnimatePresence mode="wait">
            {!showContent && (
              <motion.div
                key="countdown"
                initial={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  zIndex: 20,
                }}
              >
                <motion.span
                  key={countdown}
                  initial={{ opacity: 0, scale: 1.3 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: "'Courier New', monospace",
                    fontSize: 64,
                    fontWeight: 700,
                    color: "#AA9273",
                    textShadow: "0 0 40px rgba(170,146,115,0.3)",
                  }}
                >
                  {countdown > 0 ? countdown : ""}
                </motion.span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Video with film borders */}
          {showContent && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <SprocketRow />
              <div
                style={{ position: "relative", width: "100%", aspectRatio: "16 / 9", background: "#0a0e14" }}
                role="button"
                tabIndex={0}
                onClick={togglePlay}
                onKeyDown={(e) => e.key === " " && togglePlay()}
              >
                {reel.videoSrc ? (
                  <video
                    ref={videoRef}
                    key={reel.id}
                    src={reel.videoSrc}
                    poster={reel.poster || undefined}
                    playsInline
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      cursor: "none",
                    }}
                  />
                ) : (
                  <div style={{ position: "absolute", inset: 0, background: "#1a1e28" }} />
                )}

                {/* Pause indicator */}
                <AnimatePresence>
                  {!playing && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{
                        position: "absolute",
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        width: 64,
                        height: 64,
                        borderRadius: "50%",
                        border: "2px solid rgba(170,146,115,0.5)",
                        background: "rgba(17,24,35,0.5)",
                        backdropFilter: "blur(8px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none",
                      }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <path d="M8 5v14l11-7L8 5z" fill="#AA9273" />
                      </svg>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <SprocketRow />

              {/* Info */}
              <div style={{ padding: "20px 0 0" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
                  <span
                    style={{
                      padding: "3px 10px",
                      border: "1px solid rgba(170,146,115,0.3)",
                      borderRadius: 2,
                      fontFamily: "'Courier New', monospace",
                      fontSize: 9,
                      letterSpacing: "0.2em",
                      color: "rgba(170,146,115,0.7)",
                      textTransform: "uppercase",
                    }}
                  >
                    {reel.category}
                  </span>
                  <span
                    style={{
                      fontFamily: "'Courier New', monospace",
                      fontSize: 11,
                      color: "rgba(170,146,115,0.4)",
                      letterSpacing: "0.15em",
                    }}
                  >
                    {formatTime(reel.duration)}
                  </span>
                </div>
                <h2
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: "clamp(1rem, 2vw, 1.4rem)",
                    fontWeight: 700,
                    color: "#F8F4ED",
                    letterSpacing: "0.08em",
                    margin: "0 0 6px",
                  }}
                >
                  {reel.title}
                </h2>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 12,
                    color: "rgba(248,244,237,0.35)",
                    lineHeight: 1.6,
                    margin: 0,
                    maxWidth: 600,
                  }}
                >
                  {reel.description}
                </p>
              </div>
            </motion.div>
          )}
        </div>

        {/* Up Next strip */}
        {showContent && (
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              padding: "16px 24px 20px",
              background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 100%)",
              display: "flex",
              alignItems: "center",
              gap: 16,
              zIndex: 10,
            }}
          >
            <span
              style={{
                fontFamily: "'Courier New', monospace",
                fontSize: 9,
                letterSpacing: "0.2em",
                color: "rgba(170,146,115,0.4)",
                textTransform: "uppercase",
                flexShrink: 0,
              }}
            >
              Up Next
            </span>
            <div style={{ display: "flex", gap: 12, overflowX: "auto", scrollbarWidth: "none" }}>
              {upNext.map((r) => (
                <button
                  key={r.id}
                  onClick={() => setIndex(reels.findIndex((x) => x.id === r.id))}
                  style={{
                    flexShrink: 0,
                    width: 100,
                    height: 56,
                    borderRadius: 2,
                    overflow: "hidden",
                    border: "1px solid rgba(170,146,115,0.15)",
                    background: "none",
                    padding: 0,
                    cursor: "none",
                    position: "relative",
                  }}
                >
                  {r.poster ? (
                    <img
                      src={r.poster}
                      alt={r.title}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        display: "block",
                        filter: "brightness(0.6)",
                      }}
                      draggable={false}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", background: "#1a1e28" }} />
                  )}
                  <span
                    style={{
                      position: "absolute",
                      bottom: 3,
                      right: 4,
                      fontFamily: "'Courier New', monospace",
                      fontSize: 8,
                      color: "rgba(248,244,237,0.6)",
                    }}
                  >
                    {formatTime(r.duration)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Nav arrows */}
        {showContent && [
          { label: "Previous", side: "left" as const, onClick: goPrev, icon: "←" },
          { label: "Next", side: "right" as const, onClick: goNext, icon: "→" },
        ].map(({ label, side, onClick, icon }) => (
          <button
            key={side}
            onClick={onClick}
            aria-label={label}
            style={{
              position: "absolute",
              top: "50%",
              [side]: 20,
              transform: "translateY(-50%)",
              background: "rgba(17,24,35,0.6)",
              border: "1px solid rgba(170,146,115,0.2)",
              color: "rgba(170,146,115,0.65)",
              width: 44,
              height: 44,
              borderRadius: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "none",
              fontSize: 20,
              transition: "border-color 0.2s, color 0.2s, background 0.2s",
              backdropFilter: "blur(8px)",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              const btn = e.currentTarget;
              btn.style.borderColor = "rgba(170,146,115,0.6)";
              btn.style.color = "#AA9273";
              btn.style.background = "rgba(17,24,35,0.8)";
            }}
            onMouseLeave={(e) => {
              const btn = e.currentTarget;
              btn.style.borderColor = "rgba(170,146,115,0.2)";
              btn.style.color = "rgba(170,146,115,0.65)";
              btn.style.background = "rgba(17,24,35,0.6)";
            }}
          >
            {icon}
          </button>
        ))}
      </motion.div>
    </AnimatePresence>
  );
}
