"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursorContext } from "@/providers/CursorProvider";
import VideoModal from "@/components/shared/VideoModal";

interface HeroButtonsProps {
  ready: boolean;
  onEnterReel?: () => void;
}

export default function HeroButtons({ ready, onEnterReel }: HeroButtonsProps) {
  const [videoOpen, setVideoOpen] = useState(false);
  const [bookingOpen, setBookingOpen] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();

  function scrollToAbout() {
    const el = document.getElementById("about");
    if (el) el.scrollIntoView({ behavior: "smooth" });
    if (onEnterReel) onEnterReel();
  }

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 3.2, ease: [0.22, 1, 0.36, 1] }}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 14,
          justifyContent: "center",
          marginTop: 40,
        }}
      >
        {/* Enter the Reel — primary CTA */}
        <motion.button
          onClick={scrollToAbout}
          onMouseEnter={() => setCursor("crosshair")}
          onMouseLeave={resetCursor}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 28px",
            background: "#d4af77",
            border: "none",
            borderRadius: 2,
            color: "#0a0a0a",
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "clamp(0.65rem, 1.2vw, 0.8rem)",
            fontWeight: 700,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            cursor: "none",
            boxShadow: "0 0 20px rgba(212,175,119,0.3)",
          }}
        >
          <ClapperIcon />
          Enter the Reel
        </motion.button>

        {/* Watch Latest Feeling */}
        <motion.button
          onClick={() => setVideoOpen(true)}
          onMouseEnter={() => setCursor("video")}
          onMouseLeave={resetCursor}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 28px",
            background: "transparent",
            border: "1px solid rgba(212,175,119,0.5)",
            borderRadius: 2,
            color: "#d4af77",
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "clamp(0.65rem, 1.2vw, 0.8rem)",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            cursor: "none",
            backdropFilter: "blur(4px)",
          }}
        >
          <PlayIcon />
          Watch Latest Feeling
        </motion.button>

        {/* Book Your Forever */}
        <motion.button
          onClick={() => setBookingOpen(true)}
          onMouseEnter={() => setCursor("crosshair")}
          onMouseLeave={resetCursor}
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.97 }}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 28px",
            background: "transparent",
            border: "1px solid rgba(255,94,94,0.4)",
            borderRadius: 2,
            color: "#ff5e5e",
            fontFamily: "var(--font-cinzel), serif",
            fontSize: "clamp(0.65rem, 1.2vw, 0.8rem)",
            fontWeight: 600,
            letterSpacing: "0.3em",
            textTransform: "uppercase",
            cursor: "none",
          }}
        >
          <HeartIcon />
          Book Your Forever
        </motion.button>
      </motion.div>

      {/* Currently Screening ticker */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={ready ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 3.8 }}
        style={{
          marginTop: 32,
          display: "flex",
          alignItems: "center",
          gap: 12,
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 11,
          letterSpacing: "0.15em",
          color: "rgba(245,240,232,0.4)",
          textTransform: "uppercase",
          overflow: "hidden",
          maxWidth: "100vw",
        }}
      >
        <span
          style={{
            background: "#ff5e5e",
            color: "#fff",
            padding: "2px 8px",
            fontSize: 9,
            letterSpacing: "0.2em",
            fontWeight: 700,
            borderRadius: 1,
            flexShrink: 0,
          }}
        >
          ● LIVE
        </span>
        <div style={{ overflow: "hidden", flex: 1 }}>
          <div
            style={{
              display: "inline-block",
              whiteSpace: "nowrap",
              animation: "ticker 20s linear infinite",
            }}
          >
            Currently Screening: She Asked for Sunflowers &nbsp;·&nbsp; The Christmas Guest (Phalke Selected) &nbsp;·&nbsp; Before The Coffee Gets Cold &nbsp;·&nbsp; DOT. &nbsp;·&nbsp; Talon Wedding Films &nbsp;·&nbsp;{" "}
            Currently Screening: She Asked for Sunflowers &nbsp;·&nbsp; The Christmas Guest (Phalke Selected) &nbsp;·&nbsp; Before The Coffee Gets Cold &nbsp;·&nbsp; DOT. &nbsp;·&nbsp; Talon Wedding Films &nbsp;·&nbsp;
          </div>
        </div>
      </motion.div>

      {/* Video Modal */}
      <VideoModal
        src="/videos/sample_video.mp4"
        isOpen={videoOpen}
        onClose={() => setVideoOpen(false)}
        title="She Asked for Sunflowers"
      />

      {/* Booking modal (simplified script-page form) */}
      <AnimatePresence>
        {bookingOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setBookingOpen(false)}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99990,
              background: "rgba(0,0,0,0.92)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(8px)",
            }}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="script-page"
              style={{
                maxWidth: "600px",
                width: "90vw",
                maxHeight: "80vh",
                overflowY: "auto",
                borderRadius: 4,
              }}
            >
              <div style={{ textAlign: "center", marginBottom: 24, fontFamily: "var(--font-cinzel), serif" }}>
                <div style={{ fontSize: 10, letterSpacing: "0.4em", color: "#a08040", marginBottom: 8 }}>
                  TALON PRODUCTION HOUSE
                </div>
                <div style={{ fontSize: 20, fontWeight: 700 }}>BOOK YOUR FOREVER</div>
                <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#555", marginTop: 4 }}>
                  WEDDING INQUIRY · DRAFT SCRIPT
                </div>
              </div>

              <div style={{ marginBottom: 12, fontSize: 11, color: "#888", letterSpacing: "0.1em" }}>
                INT. YOUR MOST IMPORTANT DAY - FOREVER
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Script received! Pratham will be in touch within 24 hours.");
                  setBookingOpen(false);
                }}
                style={{ display: "flex", flexDirection: "column", gap: 16 }}
              >
                {[
                  { label: "YOUR NAME", placeholder: "The protagonist of this story..." },
                  { label: "PARTNER'S NAME", placeholder: "Co-star..." },
                  { label: "WEDDING DATE", placeholder: "The day the film begins..." },
                  { label: "LOCATION", placeholder: "Where this scene takes place..." },
                  { label: "EMAIL", placeholder: "How we find you after the credits roll..." },
                ].map((field) => (
                  <div key={field.label}>
                    <div style={{ fontSize: 9, letterSpacing: "0.3em", color: "#888", marginBottom: 4, fontWeight: 700 }}>
                      {field.label}
                    </div>
                    <input
                      type="text"
                      placeholder={field.placeholder}
                      style={{
                        width: "100%",
                        padding: "8px 0",
                        background: "none",
                        border: "none",
                        borderBottom: "1px solid #ccc",
                        fontFamily: "Courier New, monospace",
                        fontSize: 12,
                        color: "#0a0a0a",
                        outline: "none",
                      }}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  style={{
                    marginTop: 8,
                    padding: "12px",
                    background: "#0a0a0a",
                    color: "#d4af77",
                    border: "none",
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: 11,
                    letterSpacing: "0.3em",
                    fontWeight: 700,
                    textTransform: "uppercase",
                    cursor: "pointer",
                    borderRadius: 2,
                  }}
                >
                  Send the Script
                </button>
              </form>

              <button
                onClick={() => setBookingOpen(false)}
                style={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  background: "none",
                  border: "none",
                  fontSize: 20,
                  cursor: "pointer",
                  color: "#888",
                }}
                aria-label="Close"
              >
                ×
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function ClapperIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M2 6h20v16H2z" />
      <path d="M2 6l4-4h12l4 4" />
      <line x1="8" y1="2" x2="6" y2="6" />
      <line x1="16" y1="2" x2="14" y2="6" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
      <circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M10 8l6 4-6 4V8z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  );
}
