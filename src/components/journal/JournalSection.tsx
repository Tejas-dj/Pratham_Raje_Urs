"use client";

import React, { useRef } from "react";
import { motion, useInView } from "framer-motion";
import JournalCard from "./JournalCard";
import { JOURNAL_POSTS } from "@/lib/data";

export default function JournalSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });

  return (
    <section
      id="journal"
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "80vh",
        background: "#0a0a0a",
        padding: "100px 0 80px",
      }}
      aria-label="Journal: Director's Sketchbook"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 48 }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 8 }}>
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
              Writing
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
              fontWeight: 800,
              color: "#f5f0e8",
              letterSpacing: "0.08em",
            }}
          >
            Director&apos;s Sketchbook
          </h2>
        </motion.div>

        {/* Cards grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
            gap: 24,
          }}
        >
          {JOURNAL_POSTS.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: i * 0.1, duration: 0.7 }}
            >
              <JournalCard post={post} />
            </motion.div>
          ))}
        </div>

        {/* Load more hint */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ delay: 0.6 }}
          style={{
            textAlign: "center",
            marginTop: 48,
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 10,
            letterSpacing: "0.3em",
            color: "rgba(212,175,119,0.3)",
            textTransform: "uppercase",
          }}
        >
          More entries loading as the film develops…
        </motion.div>
      </div>
    </section>
  );
}
