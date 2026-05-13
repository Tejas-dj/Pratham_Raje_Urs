"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import type { MousePosition } from "@/types";

export function useMousePosition(): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
  });

  const rafRef = useRef<number>(0);
  const rawRef = useRef({ x: 0, y: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    rawRef.current = { x: e.clientX, y: e.clientY };
  }, []);

  useEffect(() => {
    const loop = () => {
      const { x, y } = rawRef.current;
      const nx = (x / window.innerWidth) * 2 - 1;
      const ny = -((y / window.innerHeight) * 2 - 1);
      setPosition({ x, y, normalizedX: nx, normalizedY: ny });
      rafRef.current = requestAnimationFrame(loop);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, [handleMouseMove]);

  return position;
}
