"use client";

import React, { createContext, useContext, useRef, useState, useCallback } from "react";

interface SoundContextValue {
  enabled: boolean;
  volume: number;
  toggle: () => void;
  setVolume: (v: number) => void;
  playClap: () => void;
  /** Called by the hero showreel's visibility observer as it scrolls in/out of view */
  setInView: (v: boolean) => void;
  /** Ref to the hero showreel's <video> element so the mute button can control its audio directly */
  videoRef: React.MutableRefObject<HTMLVideoElement | null>;
}

export const SoundContext = createContext<SoundContextValue>({
  enabled: true,
  volume: 0.4,
  toggle: () => {},
  setVolume: () => {},
  playClap: () => {},
  setInView: () => {},
  videoRef: { current: null },
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  // Sticky, user-driven override — once the user mutes, sound stays off
  // regardless of scroll position or route, until they unmute it themselves.
  const [userMuted, setUserMuted] = useState(false);
  // Whether the hero showreel is currently visible on screen.
  const [inView, setInView] = useState(true);
  const [volume, setVolumeState] = useState(0.4);
  // The showreel video is the single source of both picture and sound —
  // no separate audio element, so there's only ever one fetch of the file.
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const clapRef = useRef<HTMLAudioElement | null>(null);

  const enabled = inView && !userMuted;

  const toggle = useCallback(() => {
    // The button reflects intent relative to what's currently audible:
    // sound is on -> user wants it off (sticky); sound is off -> user
    // wants it on (releases the sticky mute, resuming scroll-driven sound).
    setUserMuted(enabled);
  }, [enabled]);

  const setVolume = useCallback((v: number) => {
    setVolumeState(v);
    if (videoRef.current) videoRef.current.volume = v;
  }, []);

  const playClap = useCallback(() => {
    if (enabled && clapRef.current) {
      clapRef.current.currentTime = 0;
      clapRef.current.play().catch(() => {});
    }
  }, [enabled]);

  return (
    <SoundContext.Provider value={{ enabled, volume, toggle, setVolume, playClap, setInView, videoRef }}>
      {children}
    </SoundContext.Provider>
  );
}

export function useSoundContext() {
  return useContext(SoundContext);
}
