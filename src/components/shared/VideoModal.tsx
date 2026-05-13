"use client";

import React, { useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursorContext } from "@/providers/CursorProvider";

interface VideoModalProps {
  src: string;
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

export default function VideoModal({ src, isOpen, onClose, title }: VideoModalProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const { setCursor, resetCursor } = useCursorContext();

  useEffect(() => {
    if (isOpen && videoRef.current) {
      videoRef.current.play().catch(() => {});
    }
    if (!isOpen && videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          onClick={onClose}
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.95)",
            zIndex: 99990,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backdropFilter: "blur(8px)",
          }}
          onMouseEnter={() => setCursor("video")}
          onMouseLeave={resetCursor}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            style={{
              position: "relative",
              width: "min(90vw, 1200px)",
              aspectRatio: "16/9",
            }}
          >
            {/* Film border frame */}
            <div
              style={{
                position: "absolute",
                inset: -20,
                border: "2px solid rgba(212,175,119,0.2)",
                borderRadius: 2,
                pointerEvents: "none",
              }}
            />
            {/* Sprocket holes decorative */}
            {[...Array(8)].map((_, i) => (
              <div
                key={`l-${i}`}
                style={{
                  position: "absolute",
                  left: -12,
                  top: `${(i + 0.5) * 12.5}%`,
                  width: 6,
                  height: 10,
                  border: "1px solid rgba(212,175,119,0.3)",
                  borderRadius: 1,
                  background: "rgba(0,0,0,0.8)",
                }}
              />
            ))}
            {[...Array(8)].map((_, i) => (
              <div
                key={`r-${i}`}
                style={{
                  position: "absolute",
                  right: -12,
                  top: `${(i + 0.5) * 12.5}%`,
                  width: 6,
                  height: 10,
                  border: "1px solid rgba(212,175,119,0.3)",
                  borderRadius: 1,
                  background: "rgba(0,0,0,0.8)",
                }}
              />
            ))}

            <video
              ref={videoRef}
              src={src}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
              controls
              playsInline
            />

            {title && (
              <div
                style={{
                  position: "absolute",
                  bottom: -36,
                  left: 0,
                  right: 0,
                  textAlign: "center",
                  fontFamily: "var(--font-cinzel), serif",
                  fontSize: 12,
                  letterSpacing: "0.3em",
                  color: "rgba(212,175,119,0.6)",
                  textTransform: "uppercase",
                }}
              >
                {title}
              </div>
            )}
          </motion.div>

          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close video"
            style={{
              position: "absolute",
              top: 24,
              right: 24,
              background: "none",
              border: "1px solid rgba(212,175,119,0.4)",
              color: "#d4af77",
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
