"use client";

import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function RawVaultEasterEgg() {
  const [clickCount, setClickCount] = useState(0);
  const [unlocked, setUnlocked] = useState(false);
  const TARGET = 7;

  const handleClick = useCallback(() => {
    const next = clickCount + 1;
    setClickCount(next);
    if (next >= TARGET) setUnlocked(true);
  }, [clickCount]);

  const CLIPS = [
    { title: "Age 10 — First Film", year: "2016", desc: "Shot on a Nokia smartphone. Raw. Real. Already cinematic." },
    { title: "School Corridor Short", year: "2017", desc: "No crew. No budget. Just a feeling that had to get out." },
    { title: "Mysuru Rain Test", year: "2018", desc: "Testing slow-mo in the monsoon. The mud. The puddles. The light." },
  ];

  return (
    <>
      {/* Invisible clickable region over the name */}
      <span
        onClick={handleClick}
        style={{ cursor: "none", userSelect: "none" }}
        title={clickCount > 0 && clickCount < TARGET ? `${TARGET - clickCount} more…` : undefined}
        aria-hidden
      >
        {/* Render nothing visible — parent will overlay this */}
      </span>

      {/* Subtle hint after a few clicks */}
      <AnimatePresence>
        {clickCount > 0 && clickCount < TARGET && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              bottom: 80,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 9999,
              fontFamily: "Courier New, monospace",
              fontSize: 10,
              color: "rgba(212,175,119,0.5)",
              letterSpacing: "0.2em",
              background: "rgba(0,0,0,0.8)",
              padding: "6px 14px",
              borderRadius: 2,
              border: "1px solid rgba(212,175,119,0.15)",
              pointerEvents: "none",
            }}
          >
            {TARGET - clickCount} CLICKS TO UNLOCK THE RAW VAULT
          </motion.div>
        )}
      </AnimatePresence>

      {/* Raw Vault Modal */}
      <AnimatePresence>
        {unlocked && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 99990,
              background: "rgba(0,0,0,0.97)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(12px)",
            }}
            onClick={() => { setUnlocked(false); setClickCount(0); }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                width: "min(90vw, 600px)",
                background: "#0d0d0d",
                border: "1px solid rgba(212,175,119,0.2)",
                borderRadius: 4,
                padding: "36px 32px",
                position: "relative",
              }}
            >
              {/* VHS distortion header */}
              <div
                style={{
                  fontFamily: "Courier New, monospace",
                  fontSize: 9,
                  color: "#ff5e5e",
                  letterSpacing: "0.3em",
                  marginBottom: 6,
                  animation: "film-flicker 0.3s steps(1) infinite",
                }}
              >
                ● REC · RAW VAULT · RESTRICTED ACCESS
              </div>

              <h3
                style={{
                  fontFamily: "var(--font-cinzel), serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#d4af77",
                  letterSpacing: "0.1em",
                  marginBottom: 4,
                }}
              >
                The Raw Vault
              </h3>
              <p
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 12,
                  color: "rgba(245,240,232,0.4)",
                  marginBottom: 28,
                  lineHeight: 1.6,
                }}
              >
                You found it. Age 10. A smartphone. The very first frames.
                <br />
                Before the world knew. Before Pratham knew what he would become.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {CLIPS.map((clip, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.15 }}
                    style={{
                      padding: "14px 16px",
                      background: "rgba(212,175,119,0.04)",
                      border: "1px solid rgba(212,175,119,0.1)",
                      borderRadius: 2,
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
                      <span
                        style={{
                          fontFamily: "var(--font-cinzel), serif",
                          fontSize: 12,
                          fontWeight: 700,
                          color: "#f5f0e8",
                          letterSpacing: "0.06em",
                        }}
                      >
                        {clip.title}
                      </span>
                      <span
                        style={{
                          fontFamily: "Courier New, monospace",
                          fontSize: 9,
                          color: "rgba(212,175,119,0.4)",
                        }}
                      >
                        {clip.year}
                      </span>
                    </div>
                    <p
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontSize: 11,
                        color: "rgba(245,240,232,0.4)",
                        lineHeight: 1.5,
                        marginBottom: 8,
                      }}
                    >
                      {clip.desc}
                    </p>
                    <div
                      style={{
                        padding: "10px",
                        background: "#111",
                        border: "1px solid rgba(212,175,119,0.08)",
                        borderRadius: 1,
                        fontFamily: "Courier New, monospace",
                        fontSize: 9,
                        color: "rgba(212,175,119,0.3)",
                        textAlign: "center",
                        letterSpacing: "0.2em",
                      }}
                    >
                      [ CLIP FILE UNAVAILABLE — LOCKED IN MYSURU HARD DRIVE ]
                    </div>
                  </motion.div>
                ))}
              </div>

              <div
                style={{
                  marginTop: 24,
                  fontFamily: "Courier New, monospace",
                  fontSize: 9,
                  color: "rgba(212,175,119,0.2)",
                  textAlign: "center",
                  letterSpacing: "0.2em",
                }}
              >
                CLICK ANYWHERE TO CLOSE · THESE FRAMES ARE NOT FOR THE WORLD. YET.
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function useEasterEggTrigger() {
  const [count, setCount] = useState(0);
  const increment = () => setCount((c) => c + 1);
  return { count, increment, isUnlocked: count >= 7 };
}
