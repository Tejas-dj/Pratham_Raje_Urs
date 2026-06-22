"use client";

import React, { useEffect, useRef, useState } from "react";
import styles from "./mini-film-leader.module.css";

interface MiniFilmLeaderProps {
  label?: string;
}

const PERFORATIONS_SIDE = 8;

export default function MiniFilmLeader({ label }: MiniFilmLeaderProps) {
  const [count, setCount] = useState(3);
  const burnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (mq.matches) return;

    let current = 3;
    const interval = setInterval(() => {
      current -= 1;
      setCount(current);
      if (current <= 0) {
        clearInterval(interval);
        setTimeout(() => {
          if (burnRef.current) {
            burnRef.current.style.transition = "opacity 0.4s ease-out";
            burnRef.current.style.opacity = "1";
          }
        }, 150);
      }
    }, 300);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={styles.leader}>
      {/* Side perforations */}
      <div className={styles.perfLeft}>
        {Array.from({ length: PERFORATIONS_SIDE }).map((_, i) => (
          <div key={i} className={styles.perf} />
        ))}
      </div>
      <div className={styles.perfRight}>
        {Array.from({ length: PERFORATIONS_SIDE }).map((_, i) => (
          <div key={i} className={styles.perf} />
        ))}
      </div>

      {/* Film brand label */}
      <div className={styles.filmLabel}>TALON PRODUCTION HOUSE</div>

      {/* Countdown */}
      {count > 0 && (
        <div className={styles.countdownWrap}>
          <div className={styles.crossH} />
          <div className={styles.crossV} />
          <div className={styles.countdownRing} />
          <div className={styles.countdownNumber}>{count}</div>

          {/* Corner marks */}
          {[
            { top: -14, left: -14, borderWidth: "1px 0 0 1px" },
            { top: -14, right: -14, borderWidth: "1px 1px 0 0" },
            { bottom: -14, left: -14, borderWidth: "0 0 1px 1px" },
            { bottom: -14, right: -14, borderWidth: "0 1px 1px 0" },
          ].map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                width: 10,
                height: 10,
                borderColor: "rgba(170,146,115,0.4)",
                borderStyle: "solid",
                ...pos,
              } as React.CSSProperties}
            />
          ))}
        </div>
      )}

      {/* Label */}
      {label && <div className={styles.label}>{label}</div>}

      {/* Burn overlay */}
      <div ref={burnRef} className={styles.burnOverlay} style={{ opacity: 0 }} />
    </div>
  );
}
