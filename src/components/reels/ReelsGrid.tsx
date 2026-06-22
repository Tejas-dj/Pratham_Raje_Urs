"use client";

import React from "react";
import { AnimatePresence } from "framer-motion";
import ReelCard from "./ReelCard";
import type { Reel } from "@/types";

interface ReelsGridProps {
  reels: Reel[];
  onPlay: (reel: Reel) => void;
}

export default function ReelsGrid({ reels, onPlay }: ReelsGridProps) {
  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
      <style>{`
        .reels-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
          gap: 24px;
        }
        @media (max-width: 480px) {
          .reels-grid {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>

      <AnimatePresence mode="popLayout">
        <div className="reels-grid">
          {reels.map((reel, i) => (
            <ReelCard key={reel.id} reel={reel} index={i} onPlay={onPlay} />
          ))}
        </div>
      </AnimatePresence>
    </div>
  );
}
