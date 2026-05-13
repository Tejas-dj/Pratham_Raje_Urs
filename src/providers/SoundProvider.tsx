"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

interface SoundContextValue {
  enabled: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (v: number) => void;
  playClap: () => void;
}

export const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  volume: 0.4,
  toggle: () => {},
  setVolume: () => {},
  playClap: () => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolumeState] = useState(0.4);
  const ambientRef = useRef<HTMLAudioElement | null>(null);
  const clapRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    ambientRef.current = new Audio("/audio/projector-hum.mp3");
    ambientRef.current.loop = true;
    ambientRef.current.volume = 0;
    clapRef.current = new Audio("/audio/clap.mp3");
    clapRef.current.volume = 0.7;
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      if (ambientRef.current) {
        if (next) {
          ambientRef.current.volume = volume;
          ambientRef.current.play().catch(() => {});
        } else {
          ambientRef.current.pause();
        }
      }
      return next;
    });
  }, [volume]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (ambientRef.current) ambientRef.current.volume = v;
  }, []);

  const playClap = useCallback(() => {
    if (enabled && clapRef.current) {
      clapRef.current.currentTime = 0;
      clapRef.current.play().catch(() => {});
    }
  }, [enabled]);

  return (
    <SoundContext.Provider value={{ enabled, volume, toggle, setVolume, playClap }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  return useContext(SoundContext);
}
