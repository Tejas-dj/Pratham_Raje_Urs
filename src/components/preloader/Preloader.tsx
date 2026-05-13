"use client";

import React, { useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FilmLeader from "./FilmLeader";
import { useSoundContext } from "@/providers/SoundProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  const { playClap } = useSoundContext();
  const reduced = useReducedMotion();

  useEffect(() => {
    if (reduced) {
      // Skip animation entirely for accessibility
      const t = setTimeout(() => {
        setVisible(false);
        onComplete();
      }, 400);
      return () => clearTimeout(t);
    }
  }, [reduced, onComplete]);

  function handleLeaderComplete() {
    playClap();
    setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 100);
  }

  if (reduced) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          key="preloader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
          style={{ position: "fixed", inset: 0, zIndex: 99999 }}
        >
          <FilmLeader onComplete={handleLeaderComplete} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
