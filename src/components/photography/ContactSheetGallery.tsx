"use client";

import React, { useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import ContactSheetCard from "./ContactSheetCard";
import type { Photo } from "@/types";

interface ContactSheetGalleryProps {
  photos: Photo[];
  onOpen: (index: number) => void;
  onLoadMore: () => void;
  hasMore: boolean;
}

export default function ContactSheetGallery({
  photos,
  onOpen,
  onLoadMore,
  hasMore,
}: ContactSheetGalleryProps) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const inView = useInView(sectionRef, { once: false, margin: "-10%" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "center center"],
  });
  const scale = useTransform(scrollYProgress, [0, 1], [0.96, 1.0]);
  const opacity = useTransform(scrollYProgress, [0, 0.2], [0, 1]);

  const handleIntersection = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      if (entries[0]?.isIntersecting && hasMore) {
        onLoadMore();
      }
    },
    [hasMore, onLoadMore]
  );

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(handleIntersection, {
      rootMargin: "200px",
    });
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleIntersection]);

  return (
    <motion.div
      ref={sectionRef}
      style={{
        scale,
        opacity,
        transformOrigin: "top center",
        maxWidth: 1200,
        margin: "0 auto",
        padding: "0 24px",
      }}
    >
      <style>{`
        .contact-sheet-masonry {
          columns: 4 240px;
          column-gap: 12px;
        }
        @media (max-width: 1024px) {
          .contact-sheet-masonry {
            columns: 3 220px;
            column-gap: 12px;
          }
        }
        @media (max-width: 780px) {
          .contact-sheet-masonry {
            columns: 2 160px;
            column-gap: 10px;
          }
        }
        @media (max-width: 480px) {
          .contact-sheet-masonry {
            columns: 2 150px;
            column-gap: 8px;
          }
        }
      `}</style>

      <div className="contact-sheet-masonry">
        {photos.map((photo, i) => (
          <ContactSheetCard
            key={photo.id}
            photo={photo}
            index={i}
            onOpen={onOpen}
          />
        ))}
      </div>

      {/* Infinite scroll sentinel */}
      {hasMore && (
        <div
          ref={sentinelRef}
          style={{
            height: 1,
            marginTop: 40,
          }}
        />
      )}

      {/* Hint */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={inView ? { opacity: 1 } : {}}
        transition={{ delay: 0.8, duration: 0.6 }}
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: 10,
          color: "rgba(170,146,115,0.25)",
          letterSpacing: "0.3em",
          textAlign: "center",
          marginTop: 40,
          textTransform: "uppercase",
        }}
      >
        Click any frame to enter the still
      </motion.p>
    </motion.div>
  );
}
