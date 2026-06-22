"use client";

import React, { useRef, useEffect, useState } from "react";

interface HeroShowreelProps {
  /** Called once the video has loaded enough to play */
  onReady?: () => void;
}

/**
 * Fullscreen autoplay muted looping video showreel.
 * Sits at z-index 1 (below 3D scene and text layers).
 * Fades in cinematic-style once the browser fires `canplaythrough`.
 */
export default function HeroShowreel({ onReady }: HeroShowreelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reveal = () => {
      setVisible(true);
      onReady?.();
    };

    video.muted = true;

    // If already buffered enough (cached second visit), reveal immediately
    if (video.readyState >= 2) {
      reveal();
    } else {
      video.addEventListener("canplay", reveal, { once: true });
    }

    video.play().catch(() => {
      // Autoplay blocked — still show poster frame
      reveal();
    });

    return () => video.removeEventListener("canplay", reveal);
  }, [onReady]);

  return (
    <div
      aria-hidden
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        overflow: "hidden",
      }}
    >
      {/* ── Video layer ── */}
      <video
        ref={videoRef}
        src="/videos/website showreel_compressed.webm"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.3s ease",
          // Subtle photo-chemical desaturation — keeps the dark cinematic feel
          filter: "brightness(0.88) saturate(1.0) contrast(1.02)",
          willChange: "opacity",
        }}
      />

      {/* ── Dark cinematic gradient scrim — ensures text legibility ── */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: `
            linear-gradient(
              to bottom,
              rgba(17,24,35,0.15) 0%,
              rgba(17,24,35,0.04) 30%,
              rgba(17,24,35,0.04) 65%,
              rgba(17,24,35,0.40) 100%
            ),
            radial-gradient(
              ellipse at 50% 50%,
              transparent 30%,
              rgba(0,0,0,0.22) 100%
            )
          `,
          zIndex: 2,
        }}
      />




      {/* ── Timecode — bottom right, like a camera LCD ── */}
      <div
        style={{
          position: "absolute",
          bottom: 80,
          right: 28,
          zIndex: 10,
          opacity: visible ? 0.45 : 0,
          transition: "opacity 2.4s ease 1.2s",
          fontFamily: "'Courier New', monospace",
          fontSize: "clamp(0.5rem, 0.9vw, 0.65rem)",
          letterSpacing: "0.15em",
          color: "rgba(170,146,115,0.9)",
        }}
      >
        00:00:00:00
      </div>

      {/* ── Inline style for the recording-dot blink keyframe ── */}
      <style>{`
        @keyframes reel-recording-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  );
}
