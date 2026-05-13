"use client";

import React, { useState, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import ProjectCard from "./ProjectCard";
import CinematicModal from "./CinematicModal";
import { PROJECTS } from "@/lib/data";
import type { Project } from "@/types";
import { useCursorContext } from "@/providers/CursorProvider";

const Theater3D = dynamic(() => import("./Theater3D"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        width: "100%",
        height: "70vh",
        background: "#080808",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "var(--font-cinzel), serif",
        fontSize: 12,
        letterSpacing: "0.3em",
        color: "rgba(212,175,119,0.3)",
        animation: "film-flicker 2s infinite alternate",
      }}
    >
      LOADING THEATER…
    </div>
  ),
});

const FILTERS = ["All", "Narrative", "Wedding", "Acting"];

export default function TheVault() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [view, setView] = useState<"theater" | "grid">("theater");
  const [activeFilter, setActiveFilter] = useState("All");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const { setCursor, resetCursor } = useCursorContext();

  const filtered = PROJECTS.filter((p) => {
    if (activeFilter === "All") return true;
    return p.category.toLowerCase() === activeFilter.toLowerCase();
  });

  return (
    <section
      id="vault"
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#080808",
        padding: "100px 0 80px",
        overflow: "hidden",
      }}
      aria-label="The Vault — Works"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 40 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 8,
            }}
          >
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
              Works
            </span>
          </div>
          <div
            style={{
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: 16,
            }}
          >
            <h2
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
                fontWeight: 800,
                color: "#f5f0e8",
                letterSpacing: "0.08em",
              }}
            >
              The Vault
            </h2>

            {/* View toggle */}
            <div style={{ display: "flex", gap: 0 }}>
              {(["theater", "grid"] as const).map((v) => (
                <motion.button
                  key={v}
                  onClick={() => setView(v)}
                  onMouseEnter={() => setCursor("crosshair")}
                  onMouseLeave={resetCursor}
                  style={{
                    padding: "8px 18px",
                    background: view === v ? "rgba(212,175,119,0.12)" : "transparent",
                    border: "1px solid rgba(212,175,119,0.2)",
                    borderRadius: v === "theater" ? "2px 0 0 2px" : "0 2px 2px 0",
                    marginLeft: v === "grid" ? -1 : 0,
                    color: view === v ? "#d4af77" : "rgba(245,240,232,0.4)",
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: 10,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "none",
                    transition: "all 0.25s ease",
                  }}
                >
                  {v === "theater" ? "🎬 Theater" : "⊞ Grid"}
                </motion.button>
              ))}
            </div>
          </div>
        </motion.div>

        {/* 3D Theater / 2D Grid */}
        <AnimatePresence mode="wait">
          {view === "theater" ? (
            <motion.div
              key="theater"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Theater3D
                projects={PROJECTS}
                onProjectClick={(p) => setSelectedProject(p)}
              />
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Filter tabs */}
              <div
                style={{
                  display: "flex",
                  gap: 8,
                  marginBottom: 28,
                  flexWrap: "wrap",
                }}
              >
                {FILTERS.map((f) => (
                  <motion.button
                    key={f}
                    onClick={() => setActiveFilter(f)}
                    onMouseEnter={() => setCursor("crosshair")}
                    onMouseLeave={resetCursor}
                    whileTap={{ scale: 0.97 }}
                    style={{
                      padding: "6px 16px",
                      background: activeFilter === f ? "rgba(212,175,119,0.1)" : "transparent",
                      border: `1px solid ${activeFilter === f ? "rgba(212,175,119,0.5)" : "rgba(212,175,119,0.15)"}`,
                      borderRadius: 2,
                      color: activeFilter === f ? "#d4af77" : "rgba(245,240,232,0.4)",
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: 10,
                      fontWeight: 600,
                      letterSpacing: "0.2em",
                      textTransform: "uppercase",
                      cursor: "none",
                      transition: "all 0.2s ease",
                    }}
                  >
                    {f}
                  </motion.button>
                ))}
              </div>

              {/* Grid */}
              <motion.div
                layout
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                  gap: 16,
                }}
              >
                <AnimatePresence>
                  {filtered.map((project, i) => (
                    <motion.div
                      key={project.id}
                      layout
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <ProjectCard
                        project={project}
                        onClick={() => setSelectedProject(project)}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Cinematic modal */}
      <CinematicModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
