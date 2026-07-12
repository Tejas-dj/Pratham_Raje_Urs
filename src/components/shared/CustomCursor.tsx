"use client";

import React, { useEffect, useRef } from "react";
import { useCursorContext } from "@/providers/CursorProvider";

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);
  const { variant } = useCursorContext();
  const posRef = useRef({ x: -100, y: -100 });
  const currentRef = useRef({ x: -100, y: -100 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    // Matches the `(pointer: coarse)` rule in globals.css that already hides
    // this cursor visually on touch devices — skip the mousemove listener and
    // RAF loop entirely there too, since they'd just be updating a transform
    // nobody can see.
    const coarseQuery = window.matchMedia("(pointer: coarse)");
    if (coarseQuery.matches) return;

    const handleMove = (e: MouseEvent) => {
      posRef.current = { x: e.clientX, y: e.clientY };
    };

    const loop = () => {
      // Lerp outer cursor for smooth lag
      currentRef.current.x += (posRef.current.x - currentRef.current.x) * 0.12;
      currentRef.current.y += (posRef.current.y - currentRef.current.y) * 0.12;

      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate(${currentRef.current.x}px, ${currentRef.current.y}px) translate(-50%, -50%)`;
      }
      // Dot follows directly
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      }

      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMove, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  const isCrosshair = variant === "crosshair" || variant === "video";
  const isDrag = variant === "drag";
  const isHidden = variant === "hidden";

  return (
    <>
      {/* Outer aperture ring */}
      <div
        ref={cursorRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: isCrosshair ? 64 : isDrag ? 56 : 40,
          height: isCrosshair ? 64 : isDrag ? 56 : 40,
          pointerEvents: "none",
          zIndex: 99999,
          willChange: "transform",
          opacity: isHidden ? 0 : 1,
          transition: "width 0.3s ease, height 0.3s ease, opacity 0.2s ease",
        }}
      >
        <svg
          viewBox="0 0 64 64"
          style={{ width: "100%", height: "100%", display: "block" }}
        >
          {isCrosshair ? (
            <>
              {/* Open aperture — blades retracted, wide center opening */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <path
                  key={i}
                  d={`M 32 32 L ${32 + 18 * Math.cos((angle * Math.PI) / 180)} ${32 + 18 * Math.sin((angle * Math.PI) / 180)} A 18 18 0 0 1 ${32 + 18 * Math.cos(((angle + 26) * Math.PI) / 180)} ${32 + 18 * Math.sin(((angle + 26) * Math.PI) / 180)} Z`}
                  fill="rgba(170,146,115,0.1)"
                  stroke="rgba(170,146,115,0.75)"
                  strokeWidth="0.8"
                />
              ))}
              <circle cx="32" cy="32" r="21" fill="none" stroke="rgba(170,146,115,0.85)" strokeWidth="1.2" />
              <circle cx="32" cy="32" r="9" fill="none" stroke="rgba(170,146,115,0.25)" strokeWidth="0.6" strokeDasharray="2 3" />
            </>
          ) : isDrag ? (
            <>
              <circle cx="32" cy="32" r="20" fill="none" stroke="rgba(170,146,115,0.4)" strokeWidth="1.5" strokeDasharray="6 3" />
              <text x="32" y="36" textAnchor="middle" fill="#AA9273" fontSize="8" fontFamily="Inter, sans-serif" letterSpacing="1">DRAG</text>
            </>
          ) : (
            <>
              {/* Aperture blades (6 blades) */}
              {[0, 60, 120, 180, 240, 300].map((angle, i) => (
                <path
                  key={i}
                  d={`M 32 32 L ${32 + 14 * Math.cos((angle * Math.PI) / 180)} ${32 + 14 * Math.sin((angle * Math.PI) / 180)} A 14 14 0 0 1 ${32 + 14 * Math.cos(((angle + 50) * Math.PI) / 180)} ${32 + 14 * Math.sin(((angle + 50) * Math.PI) / 180)} Z`}
                  fill="rgba(170,146,115,0.15)"
                  stroke="rgba(170,146,115,0.5)"
                  strokeWidth="0.5"
                />
              ))}
              <circle cx="32" cy="32" r="16" fill="none" stroke="rgba(170,146,115,0.6)" strokeWidth="1" />
              <circle cx="32" cy="32" r="4" fill="rgba(170,146,115,0.8)" />
            </>
          )}
        </svg>
      </div>

      {/* Center dot — always sharp */}
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: 4,
          height: 4,
          background: "#AA9273",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 100000,
          willChange: "transform",
          opacity: isHidden ? 0 : 1,
          transition: "opacity 0.2s ease",
          boxShadow: "0 0 6px rgba(170,146,115,0.8)",
        }}
      />
    </>
  );
}
