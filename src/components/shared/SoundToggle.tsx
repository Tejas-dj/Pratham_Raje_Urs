"use client";

import React from "react";
import { useSoundContext } from "@/providers/SoundProvider";
import { motion } from "framer-motion";

export default function SoundToggle() {
  const { enabled, toggle } = useSoundContext();

  return (
    <motion.button
      onClick={toggle}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 2 }}
      aria-label={enabled ? "Mute showreel audio" : "Unmute showreel audio"}
      style={{
        position: "fixed",
        bottom: 24,
        right: 24,
        zIndex: 9997,
        background: "rgba(17,24,35,0.8)",
        border: "1px solid rgba(170,146,115,0.3)",
        borderRadius: "50%",
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backdropFilter: "blur(8px)",
        cursor: "none",
      }}
      whileHover={{ scale: 1.1, borderColor: "rgba(170,146,115,0.7)" }}
      whileTap={{ scale: 0.95 }}
    >
      <SoundIcon enabled={enabled} />
    </motion.button>
  );
}

function SoundIcon({ enabled }: { enabled: boolean }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M11 5L6 9H2v6h4l5 4V5z"
        stroke="#AA9273"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {enabled ? (
        <>
          <path d="M19.07 4.93a10 10 0 010 14.14" stroke="#AA9273" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M15.54 8.46a5 5 0 010 7.07" stroke="#AA9273" strokeWidth="1.5" strokeLinecap="round" />
        </>
      ) : (
        <>
          <line x1="23" y1="9" x2="17" y2="15" stroke="#AA9273" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="17" y1="9" x2="23" y2="15" stroke="#AA9273" strokeWidth="1.5" strokeLinecap="round" />
        </>
      )}
    </svg>
  );
}
