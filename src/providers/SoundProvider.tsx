"use client";

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from "react";

interface SoundContextValue {
  enabled: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (v: number) => void;
  playClap: () => void;
  /** Ref to the showreel audio element so HeroShowreel can sync it */
  showreelAudioRef: React.MutableRefObject<HTMLAudioElement | null>;
}

export const SoundContext = createContext<SoundContextValue>({
  enabled: false,
  volume: 0.4,
  toggle: () => {},
  setVolume: () => {},
  playClap: () => {},
  showreelAudioRef: { current: null },
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false);
  const [volume, setVolumeState] = useState(0.4);
  // Plays the showreel's audio track site-wide (loops, starts muted until user enables)
  const showreelAudioRef = useRef<HTMLAudioElement | null>(null);
  const clapRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    // Use the showreel webm as the ambient audio source
    showreelAudioRef.current = new Audio("/videos/website showreel_compressed.webm");
    showreelAudioRef.current.loop = true;
    showreelAudioRef.current.volume = 0;
    clapRef.current = new Audio("/audio/clap.mp3");
    clapRef.current.volume = 0.7;
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      if (showreelAudioRef.current) {
        if (next) {
          showreelAudioRef.current.volume = volume;
          showreelAudioRef.current.play().catch(() => {});
        } else {
          showreelAudioRef.current.pause();
        }
      }
      return next;
    });
  }, [volume]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (showreelAudioRef.current) showreelAudioRef.current.volume = v;
  }, []);

  const playClap = useCallback(() => {
    if (enabled && clapRef.current) {
      clapRef.current.currentTime = 0;
      clapRef.current.play().catch(() => {});
    }
  }, [enabled]);

  return (
    <SoundContext.Provider value={{ enabled, volume, toggle, setVolume, playClap, showreelAudioRef }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  return useContext(SoundContext);
}
