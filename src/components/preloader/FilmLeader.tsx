"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./preloader.module.css";

interface FilmLeaderProps {
  onComplete: () => void;
}

const PERFORATIONS_SIDE = 12;
const PERFORATIONS_TOP = 10;

export default function FilmLeader({ onComplete }: FilmLeaderProps) {
  const [count, setCount] = useState(5);
  const [showName, setShowName] = useState(false);
  const [nameText, setNameText] = useState("");
  const [frameNum, setFrameNum] = useState("001");
  const burnRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const FULL_NAME = "PRATHAM RAJE URS";

  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    let nameTimeout: ReturnType<typeof setTimeout>;

    // Count 5 → 1 at ~220ms each
    let current = 5;
    interval = setInterval(() => {
      current -= 1;
      setCount(current);
      setFrameNum(String(6 - current).padStart(3, "0"));
      if (current <= 0) {
        clearInterval(interval);
        // Reveal name via typewriter
        nameTimeout = setTimeout(() => {
          setShowName(true);
          let idx = 0;
          const typeInterval = setInterval(() => {
            idx++;
            setNameText(FULL_NAME.slice(0, idx));
            if (idx >= FULL_NAME.length) {
              clearInterval(typeInterval);
              // After name revealed, trigger burn transition
              setTimeout(() => {
                triggerBurn();
              }, 600);
            }
          }, 55);
        }, 120);
      }
    }, 220);

    return () => {
      clearInterval(interval);
      clearTimeout(nameTimeout);
    };
  }, []);

  function triggerBurn() {
    if (!burnRef.current) return;
    burnRef.current.style.transition = "opacity 0.6s ease-out";
    burnRef.current.style.opacity = "1";
    setTimeout(() => onComplete(), 800);
  }

  // Client-only dust specks — server renders nothing, client fills after mount
  type DustSpeck = { id: number; x: number; y: number; size: number; delay: number; duration: number };
  const [dustSpecks, setDustSpecks] = React.useState<DustSpeck[]>([]);
  useEffect(() => {
    setDustSpecks(
      Array.from({ length: 14 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        delay: Math.random() * 2,
        duration: 1.5 + Math.random() * 1.5,
      }))
    );
  }, []);

  return (
    <div ref={containerRef} className={styles.leader}>
      <div className={styles.leaderBg} />

      {/* Dust specks */}
      {dustSpecks.map((d) => (
        <div
          key={d.id}
          className={styles.dust}
          style={{
            left: `${d.x}%`,
            top: `${d.y}%`,
            width: d.size,
            height: d.size,
            animationDelay: `${d.delay}s`,
            animationDuration: `${d.duration}s`,
          }}
        />
      ))}

      {/* Left perforations */}
      <div className={styles.perfLeft}>
        {Array.from({ length: PERFORATIONS_SIDE }).map((_, i) => (
          <div key={i} className={styles.perf} />
        ))}
      </div>

      {/* Right perforations */}
      <div className={styles.perfRight}>
        {Array.from({ length: PERFORATIONS_SIDE }).map((_, i) => (
          <div key={i} className={styles.perf} />
        ))}
      </div>

      {/* Top perforations */}
      <div className={styles.perfTop}>
        {Array.from({ length: PERFORATIONS_TOP }).map((_, i) => (
          <div key={i} className={styles.perf} style={{ width: 18, height: 10 }} />
        ))}
      </div>

      {/* Bottom perforations */}
      <div className={styles.perfBottom}>
        {Array.from({ length: PERFORATIONS_TOP }).map((_, i) => (
          <div key={i} className={styles.perf} style={{ width: 18, height: 10 }} />
        ))}
      </div>

      {/* Film brand label */}
      <div className={styles.filmLabel}>
        TALON PRODUCTION HOUSE · SUPER 35 · 4K · ASA 500
      </div>

      {/* Frame number */}
      <div className={styles.frameCount}>FRAME {frameNum}</div>

      {/* Countdown */}
      {count > 0 && (
        <div className={styles.countdownWrap}>
          <div className={styles.crossH} />
          <div className={styles.crossV} />
          <div className={styles.countdownRing} />
          <div className={styles.countdownNumber}>{count}</div>

          {/* Corner marks */}
          {[
            { top: -20, left: -20 },
            { top: -20, right: -20 },
            { bottom: -20, left: -20 },
            { bottom: -20, right: -20 },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 12,
                height: 12,
                borderColor: "rgba(212,175,119,0.5)",
                borderStyle: "solid",
                borderWidth:
                  i === 0 ? "1px 0 0 1px"
                  : i === 1 ? "1px 1px 0 0"
                  : i === 2 ? "0 0 1px 1px"
                  : "0 1px 1px 0",
                ...pos,
              }}
            />
          ))}
        </div>
      )}

      {/* Name reveal */}
      {showName && (
        <div className={styles.nameReveal}>
          {nameText}
          <span
            style={{
              display: "inline-block",
              width: 2,
              height: "1em",
              background: "#d4af77",
              marginLeft: 2,
              verticalAlign: "middle",
              animation: "countFlicker 0.5s steps(1) infinite",
            }}
          />
        </div>
      )}

      {/* Talon logo placeholder */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "50%",
          transform: "translateX(-50%)",
          fontFamily: "var(--font-cinzel), serif",
          fontSize: 11,
          letterSpacing: "0.6em",
          color: "rgba(212,175,119,0.3)",
          textTransform: "uppercase",
          fontWeight: 700,
        }}
      >
        TALON
      </div>

      {/* Burn overlay */}
      <div ref={burnRef} className={styles.burnOverlay} style={{ opacity: 0 }} />
    </div>
  );
}
