"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import type { Service } from "@/types";
import { SERVICES } from "@/lib/data";
import { useCursorContext } from "@/providers/CursorProvider";
import { Heart, Film, Star, Aperture, LucideIcon } from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  heart: Heart,
  film: Film,
  star: Star,
  aperture: Aperture,
};

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [activeService, setActiveService] = useState<string | null>(SERVICES[0].id);
  const { setCursor, resetCursor } = useCursorContext();

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#060608",
        padding: "120px 0 100px",
        overflow: "hidden",
      }}
      aria-label="Director's Lenses — Domains"
    >
      <div style={{ maxWidth: 1000, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 60 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 12 }}>
            <div style={{ width: 40, height: 1, background: "#d4af77", opacity: 0.4 }} />
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 10,
                letterSpacing: "0.4em",
                color: "rgba(212,175,119,0.5)",
                textTransform: "uppercase",
              }}
            >
              What I Create
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#f5f0e8",
              letterSpacing: "0.08em",
              marginBottom: 16,
            }}
          >
            Director&apos;s Lenses
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14,
              color: "rgba(245,240,232,0.4)",
              letterSpacing: "0.05em",
              maxWidth: 500,
              lineHeight: 1.8,
            }}
          >
            The different formats and domains where Pratham crafts his stories. Each lens requires a different perspective, but the core feeling remains the same.
          </p>
        </motion.div>

        {/* Accordion Layout */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {SERVICES.map((service, i) => {
            const isActive = activeService === service.id;
            const IconComponent = ICON_MAP[service.icon] || Heart;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                style={{
                  borderBottom: `1px solid ${isActive ? "rgba(212,175,119,0.3)" : "rgba(212,175,119,0.08)"}`,
                  overflow: "hidden",
                }}
              >
                <button
                  onClick={() => setActiveService(isActive ? null : service.id)}
                  onMouseEnter={() => setCursor("crosshair")}
                  onMouseLeave={resetCursor}
                  style={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    background: "transparent",
                    border: "none",
                    padding: "24px 0",
                    cursor: "none",
                    textAlign: "left",
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
                    <span style={{ display: "flex", alignItems: "center", justifyContent: "center", opacity: isActive ? 1 : 0.4, transition: "opacity 0.3s ease", color: service.color }}>
                      <IconComponent size={28} color={service.color} strokeWidth={1.5} />
                    </span>
                    <h3
                      style={{
                        fontFamily: "var(--font-cinzel), serif",
                        fontSize: "clamp(1.1rem, 2vw, 1.5rem)",
                        fontWeight: 600,
                        color: isActive ? service.color : "rgba(245,240,232,0.6)",
                        letterSpacing: "0.08em",
                        transition: "color 0.3s ease",
                      }}
                    >
                      {service.title}
                    </h3>
                  </div>
                  <motion.div
                    animate={{ rotate: isActive ? 180 : 0 }}
                    transition={{ duration: 0.3 }}
                    style={{ color: "rgba(212,175,119,0.4)" }}
                  >
                    ↓
                  </motion.div>
                </button>

                <AnimatePresence initial={false}>
                  {isActive && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
                    >
                      <div style={{ padding: "0 0 32px 56px", display: "flex", gap: 32, flexDirection: "column" }}>
                        <p
                          style={{
                            fontFamily: "var(--font-inter), sans-serif",
                            fontSize: 14,
                            lineHeight: 1.8,
                            color: "rgba(245,240,232,0.6)",
                            maxWidth: 600,
                          }}
                        >
                          {service.description}
                        </p>
                        
                        {/* Film strip decoration inside accordion */}
                        <div style={{ display: "flex", gap: 8, opacity: 0.5 }}>
                           <div className="film-perforation" style={{ width: 6, height: 6 }} />
                           <div className="film-perforation" style={{ width: 6, height: 6 }} />
                           <div className="film-perforation" style={{ width: 6, height: 6 }} />
                           <div className="film-perforation" style={{ width: 6, height: 6 }} />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
