"use client";

import React, { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import ProjectCard from "./ProjectCard";
import CinematicModal from "./CinematicModal";
import { PROJECTS } from "@/lib/data";
import type { Project } from "@/types";
import { useCursorContext } from "@/providers/CursorProvider";

const FILTERS = ["All", "Narrative", "Wedding", "Acting"];

export default function TheVault() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
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
        background: "#111823",
        padding: "120px 0 100px",
      }}
      aria-label="The Vault: Works"
    >
      <div style={{ maxWidth: 1400, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 60 }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              marginBottom: 12,
            }}
          >
            <div style={{ width: 40, height: 1, background: "#AA9273", opacity: 0.4 }} />
            <span
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 10,
                letterSpacing: "0.4em",
                color: "rgba(170,146,115,0.5)",
                textTransform: "uppercase",
              }}
            >
              Works
            </span>
          </div>
          
          <h2
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(1.8rem, 4vw, 3rem)",
              fontWeight: 800,
              color: "#F8F4ED",
              letterSpacing: "0.08em",
              marginBottom: 24,
            }}
          >
            The Vault
          </h2>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
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
                  padding: "8px 20px",
                  background: activeFilter === f ? "rgba(170,146,115,0.12)" : "transparent",
                  border: `1px solid ${activeFilter === f ? "rgba(170,146,115,0.4)" : "rgba(170,146,115,0.1)"}`,
                  borderRadius: 2,
                  color: activeFilter === f ? "#AA9273" : "rgba(248,244,237,0.4)",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  cursor: "none",
                  transition: "all 0.3s ease",
                }}
              >
                {f}
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Responsive Grid */}
        <style>{`
          .vault-grid {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
            gap: 56px;
          }
          @media (max-width: 768px) {
            .vault-grid {
              gap: 24px;
            }
          }
        `}</style>
        <motion.div
          layout
          className="vault-grid"
        >
          <AnimatePresence mode="popLayout">
            {filtered.map((project, i) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, y: 50, scale: 0.95, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
                transition={{ duration: 0.6, delay: i * 0.05, ease: [0.22, 1, 0.36, 1] }}
              >
                <ProjectCard
                  project={project}
                  onClick={() => setSelectedProject(project)}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </div>

      <CinematicModal
        project={selectedProject}
        isOpen={!!selectedProject}
        onClose={() => setSelectedProject(null)}
      />
    </section>
  );
}
