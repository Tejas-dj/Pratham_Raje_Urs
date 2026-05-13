"use client";

import { useState, useEffect, useRef } from "react";

export function useScrollVelocity(): number {
  const [velocity, setVelocity] = useState(0);
  const lastScrollY = useRef(0);
  const lastTime = useRef(Date.now());
  const rafRef = useRef<number>(0);
  const currentVelocity = useRef(0);

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now();
      const dt = Math.max(now - lastTime.current, 1);
      const dy = Math.abs(window.scrollY - lastScrollY.current);
      currentVelocity.current = Math.min(dy / dt * 16, 1); // normalize to 0-1
      lastScrollY.current = window.scrollY;
      lastTime.current = now;
    };

    const loop = () => {
      // Decay velocity smoothly
      currentVelocity.current *= 0.92;
      setVelocity(currentVelocity.current);
      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return velocity;
}
