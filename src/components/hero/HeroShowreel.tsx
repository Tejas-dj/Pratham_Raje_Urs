"use client";

import React, { useRef, useEffect, useState } from "react";
import { useSoundContext } from "@/providers/SoundProvider";

interface HeroShowreelProps {
  /** Called once the video has loaded enough to play */
  onReady?: () => void;
}

/**
 * Fullscreen autoplay looping video showreel — also the site's sole audio
 * source (see SoundProvider). Sits at z-index 1 (below 3D scene and text layers).
 * Fades in cinematic-style once the browser fires `canplaythrough`.
 */
export default function HeroShowreel({ onReady }: HeroShowreelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const { enabled, volume, videoRef: soundVideoRef, setInView } = useSoundContext();

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const reveal = () => {
      setVisible(true);
      onReady?.();
    };

    // Autoplay must start muted to be reliably allowed by every browser.
    // Once playback has actually begun, unmuting via the `muted` property
    // (rather than a fresh play() call) isn't subject to the same
    // gesture/engagement restrictions, so this reflects the default
    // "sound on" intent as soon as playback starts.
    video.muted = true;
    video.volume = volume;

    // If already buffered enough (cached second visit), reveal immediately
    if (video.readyState >= 2) {
      reveal();
    } else {
      video.addEventListener("canplay", reveal, { once: true });
    }

    video.play()
      .then(() => {
        video.muted = !enabled;
      })
      .catch(() => {
        // Autoplay blocked — still show poster frame
        reveal();
      });

    soundVideoRef.current = video;

    return () => {
      video.removeEventListener("canplay", reveal);
      soundVideoRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onReady]);

  // Keep the video's mute state in sync with whatever made `enabled` change —
  // the mute button, or the showreel scrolling in/out of view below.
  useEffect(() => {
    const video = videoRef.current;
    if (video) video.muted = !enabled;
  }, [enabled]);

  // Auto-mute while the showreel is scrolled off screen, and restore sound
  // when it scrolls back into view (unless the user has muted it themselves —
  // SoundProvider ignores this signal in that case).
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [setInView]);

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
