"use client";

import { useEffect } from "react";
import { getCldImageUrl } from "next-cloudinary";
import { extractPublicId } from "@/lib/cloudinary";
import type { Photo } from "@/types";

function isCloudinarySrc(src: string): boolean {
  return !!src && !src.startsWith("/") && !src.startsWith("data:");
}

function requestIdle(callback: () => void) {
  if (typeof window === "undefined") return;
  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(callback, { timeout: 4000 });
  } else {
    setTimeout(callback, 200);
  }
}

interface LightboxPreloaderProps {
  photos: Photo[];
}

/**
 * Warms the browser's image cache for full-res lightbox versions during idle
 * time, one photo per idle slice, so opening any frame feels instant instead
 * of showing a cold blur-up.
 */
export default function LightboxPreloader({ photos }: LightboxPreloaderProps) {
  useEffect(() => {
    let cancelled = false;
    let index = 0;

    function preloadNext() {
      if (cancelled) return;
      if (index >= photos.length) return;
      const photo = photos[index];
      index += 1;
      if (photo?.src && isCloudinarySrc(photo.src)) {
        const url = getCldImageUrl({
          src: extractPublicId(photo.src),
          width: 1600,
          format: "auto",
          quality: "auto",
        });
        const img = new window.Image();
        img.src = url;
      }
      requestIdle(preloadNext);
    }

    requestIdle(preloadNext);
    return () => {
      cancelled = true;
    };
  }, [photos]);

  return null;
}
