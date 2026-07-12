"use client";

import React, { useState, useEffect, useLayoutEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FilmLeader from "./FilmLeader";
import { useSoundContext } from "@/providers/SoundProvider";
import { useReducedMotion } from "@/hooks/useReducedMotion";

const SESSION_KEY = "infinite-frames-preloader-shown";

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const [visible, setVisible] = useState(true);
  // Starts false to match the server-rendered markup exactly (SSR has no way
  // to know about sessionStorage); flipped to true synchronously before
  // paint if we're skipping, so the component below never even mounts
  // FilmLeader — unlike toggling `visible` off, which AnimatePresence would
  // keep alive for its exit transition, letting its countdown run anyway.
  const [skipIntro, setSkipIntro] = useState(false);
  const { playClap } = useSoundContext();
  const reduced = useReducedMotion();

  // Skip entirely on repeat visits within the same browser session (e.g.
  // navigating home from /photography remounts this component) — this runs
  // before paint so there's no flash of the intro reappearing.
  useLayoutEffect(() => {
    if (sessionStorage.getItem(SESSION_KEY)) {
      setSkipIntro(true);
      onComplete();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (skipIntro) return;
    if (reduced) {
      // Skip animation entirely for accessibility
      const t = setTimeout(() => {
        setVisible(false);
        sessionStorage.setItem(SESSION_KEY, "1");
        onComplete();
      }, 400);
      return () => clearTimeout(t);
    }
  }, [reduced, onComplete, skipIntro]);

  function handleLeaderComplete() {
    playClap();
    setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem(SESSION_KEY, "1");
      onComplete();
    }, 100);
  }

  if (skipIntro) return null;
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
