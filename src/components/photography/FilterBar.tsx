"use client";

import React, { useRef } from "react";
import { motion } from "framer-motion";
import type { PhotoCategory } from "@/types";
import { useCursorContext } from "@/providers/CursorProvider";
import { useIsMobile } from "@/hooks/useIsMobile";

const CATEGORIES: { label: string; value: PhotoCategory | "all" }[] = [
  { label: "ALL", value: "all" },
  { label: "FILM STILLS", value: "film-stills" },
  { label: "PORTRAITS", value: "portraits" },
  { label: "BTS", value: "bts" },
  { label: "STREET", value: "street" },
  { label: "LANDSCAPES", value: "landscapes" },
];

interface FilterBarProps {
  active: PhotoCategory | "all";
  onChange: (cat: PhotoCategory | "all") => void;
}

export default function FilterBar({ active, onChange }: FilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const { setCursor, resetCursor } = useCursorContext();
  const isMobile = useIsMobile();

  return (
    <div
      style={{
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px 40px",
      }}
    >
      <div
        ref={scrollRef}
        style={{
          display: "flex",
          gap: 8,
          overflowX: "auto",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch",
          paddingBottom: 4,
        }}
      >
        {CATEGORIES.map((cat) => {
          const isActive = active === cat.value;
          return (
            <motion.button
              key={cat.value}
              onClick={() => onChange(cat.value)}
              onMouseEnter={() => !isMobile && setCursor("crosshair")}
              onMouseLeave={() => !isMobile && resetCursor()}
              whileTap={{ scale: 0.96 }}
              style={{
                flexShrink: 0,
                minHeight: 44,
                padding: "8px 18px",
                fontFamily: "'Courier New', monospace",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textTransform: "uppercase",
                color: isActive ? "#111823" : "rgba(170,146,115,0.7)",
                background: isActive ? "#AA9273" : "transparent",
                border: `1px solid ${isActive ? "#AA9273" : "rgba(170,146,115,0.2)"}`,
                borderRadius: 2,
                cursor: "none",
                transition: "all 0.3s ease",
                whiteSpace: "nowrap",
              }}
              aria-pressed={isActive}
            >
              {cat.label}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
