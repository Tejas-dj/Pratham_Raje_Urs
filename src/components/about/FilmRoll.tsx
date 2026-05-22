"use client";

import React, { useRef } from "react";
import { useDrag } from "@use-gesture/react";
import { useSpring, animated } from "react-spring";
import FilmFrame from "./FilmFrame";
import { ABOUT_FRAMES } from "@/lib/data";
import { useCursorContext } from "@/providers/CursorProvider";

export default function FilmRoll() {
  const { setCursor, resetCursor } = useCursorContext();
  const [{ x }, api] = useSpring(() => ({ x: 0 }));
  const xRef = useRef(0);

  const FRAME_WIDTH = 296; // 280px + 16px gap
  const TOTAL_WIDTH = FRAME_WIDTH * ABOUT_FRAMES.length;
  const MIN_X = -(TOTAL_WIDTH - (typeof window !== "undefined" ? Math.min(window.innerWidth - 80, 1200) : 1000));

  const bind = useDrag(
    ({ offset: [ox], last, velocity: [vx], direction: [dx] }) => {
      const clamped = Math.max(MIN_X, Math.min(0, ox));

      if (last) {
        // Momentum on release
        const momentum = vx * dx * 120;
        const target = Math.max(MIN_X, Math.min(0, clamped + momentum));
        api.start({ x: target, config: { tension: 80, friction: 22 } });
        xRef.current = target;
      } else {
        api.start({ x: clamped, immediate: true });
        xRef.current = clamped;
      }
    },
    {
      axis: "x",
      from: () => [xRef.current, 0],
      filterTaps: true,
      pointer: { touch: true },
    }
  );

  return (
    <div
      style={{
        position: "relative",
        overflow: "hidden",
        width: "100%",
        userSelect: "none",
        WebkitUserSelect: "none",
      }}
      onMouseEnter={() => setCursor("drag")}
      onMouseLeave={resetCursor}
    >
      {/* Film strip top track */}
      <div
        style={{
          height: 24,
          background: "#45302A",
          borderTop: "1px solid rgba(170,146,115,0.1)",
          borderBottom: "1px solid rgba(170,146,115,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 8px",
          overflow: "hidden",
          marginBottom: 2,
        }}
        aria-hidden
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 12,
              border: "1px solid rgba(170,146,115,0.2)",
              borderRadius: 1,
              background: "#111823",
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* Draggable frame track */}
      <animated.div
        {...bind()}
        style={{
          x,
          display: "flex",
          gap: 16,
          padding: "4px 40px",
          touchAction: "pan-y",
          cursor: "none",
        }}
      >
        {ABOUT_FRAMES.map((frame, i) => (
          <FilmFrame
            key={i}
            year={frame.year}
            title={frame.title}
            description={frame.description}
            image={frame.image}
            hasVideo={frame.hasVideo}
            index={i}
          />
        ))}
      </animated.div>

      {/* Film strip bottom track */}
      <div
        style={{
          height: 24,
          background: "#45302A",
          borderTop: "1px solid rgba(170,146,115,0.1)",
          borderBottom: "1px solid rgba(170,146,115,0.1)",
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 8px",
          overflow: "hidden",
          marginTop: 2,
        }}
        aria-hidden
      >
        {Array.from({ length: 40 }).map((_, i) => (
          <div
            key={i}
            style={{
              width: 16,
              height: 12,
              border: "1px solid rgba(170,146,115,0.2)",
              borderRadius: 1,
              background: "#111823",
              flexShrink: 0,
            }}
          />
        ))}
      </div>

      {/* Fade edges */}
      <div
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          bottom: 0,
          width: 60,
          background: "linear-gradient(90deg, #111823, transparent)",
          pointerEvents: "none",
          zIndex: 2,
        }}
        aria-hidden
      />
      <div
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          bottom: 0,
          width: 60,
          background: "linear-gradient(-90deg, #111823, transparent)",
          pointerEvents: "none",
          zIndex: 2,
        }}
        aria-hidden
      />
    </div>
  );
}
