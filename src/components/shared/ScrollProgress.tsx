"use client";

import React, { useEffect, useState } from "react";
import { useLenisContext } from "@/providers/LenisProvider";

export default function ScrollProgress() {
  const [progress, setProgress] = useState(0);
  const { lenis } = useLenisContext();

  useEffect(() => {
    const update = () => {
      const el = document.documentElement;
      const scrollable = el.scrollHeight - el.clientHeight;
      if (scrollable > 0) {
        setProgress(window.scrollY / scrollable);
      }
    };

    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, [lenis]);

  const PERF_COUNT = 18;
  const filledCount = Math.round(progress * PERF_COUNT);

  return (
    <div
      style={{
        position: "fixed",
        right: 6,
        top: "50%",
        transform: "translateY(-50%)",
        zIndex: 9998,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        padding: "10px 6px",
        background: "rgba(17,24,35,0.55)",
        backdropFilter: "blur(6px)",
        borderRadius: 4,
        pointerEvents: "none",
      }}
      aria-hidden
    >
      {Array.from({ length: PERF_COUNT }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 8,
            height: 12,
            border: "1px solid rgba(31,85,96,0.25)",
            borderRadius: 1,
            background: i < filledCount ? "rgba(31,85,96,0.7)" : "transparent",
            transition: "background 0.3s ease",
            boxShadow: i < filledCount ? "0 0 4px rgba(31,85,96,0.4)" : "none",
          }}
        />
      ))}
    </div>
  );
}
