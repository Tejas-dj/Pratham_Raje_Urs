"use client";

import React, { useRef, useState, Suspense } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import dynamic from "next/dynamic";
import type { Service } from "@/types";
import { SERVICES } from "@/lib/data";
import { useCursorContext } from "@/providers/CursorProvider";

const LensOrb = dynamic(() => import("./LensOrb"), { ssr: false });

function OrbScene({ onSelect }: { onSelect: (s: Service) => void }) {
  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 65 }}
      gl={{ antialias: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
    >
      <Suspense fallback={null}>
        <ambientLight intensity={0.1} />
        {SERVICES.map((service, i) => (
          <LensOrb
            key={service.id}
            service={service}
            orbitRadius={2.2}
            orbitSpeed={0.2}
            orbitOffset={(i * Math.PI * 2) / SERVICES.length}
            onSelect={onSelect}
          />
        ))}
        <Environment preset="night" />
      </Suspense>
    </Canvas>
  );
}

function ScriptMeetingModal({
  service,
  onClose,
}: {
  service: Service | null;
  onClose: () => void;
}) {
  const [step, setStep] = useState(0);
  const [progress, setProgress] = useState(0);
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const STEPS = [
    "What&apos;s your name?",
    "Tell me your vision for this project:",
    "What&apos;s your timeline?",
    "How do we reach you?",
  ];

  function handleNext() {
    if (step < STEPS.length - 1) {
      setStep((s) => s + 1);
      setProgress(((step + 1) / (STEPS.length - 1)) * 100);
      setMessage("");
    } else {
      setSubmitted(true);
    }
  }

  if (!service) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 99990,
          background: "rgba(0,0,0,0.95)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(12px)",
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(90vw, 560px)",
            background: "#0d0d0d",
            border: `1px solid ${service.color}30`,
            borderRadius: 4,
            padding: "40px 36px",
            position: "relative",
          }}
        >
          {/* Film reel progress bar */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: "rgba(212,175,119,0.1)",
              borderRadius: "4px 4px 0 0",
              overflow: "hidden",
            }}
          >
            <motion.div
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
              style={{
                height: "100%",
                background: service.color,
                boxShadow: `0 0 8px ${service.color}`,
              }}
            />
          </div>

          {/* Step counter */}
          <div
            style={{
              fontFamily: "Courier New, monospace",
              fontSize: 9,
              color: `${service.color}60`,
              letterSpacing: "0.3em",
              marginBottom: 12,
            }}
          >
            SCENE {step + 1} OF {STEPS.length}
          </div>

          {/* Service title */}
          <h3
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 18,
              fontWeight: 700,
              color: service.color,
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            {service.title}
          </h3>

          {submitted ? (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              style={{ textAlign: "center", padding: "24px 0" }}
            >
              <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
              <p
                style={{
                  fontFamily: "var(--font-cinzel), serif",
                  fontSize: 14,
                  color: "#d4af77",
                  letterSpacing: "0.1em",
                }}
              >
                Script received. Pratham will be in touch.
              </p>
            </motion.div>
          ) : (
            <>
              {/* Question (typewriter) */}
              <AnimatePresence mode="wait">
                <motion.p
                  key={step}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 14,
                    color: "rgba(245,240,232,0.7)",
                    lineHeight: 1.7,
                    marginBottom: 20,
                    marginTop: 16,
                  }}
                  dangerouslySetInnerHTML={{ __html: STEPS[step] }}
                />
              </AnimatePresence>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type here…"
                style={{
                  width: "100%",
                  minHeight: 80,
                  background: "rgba(212,175,119,0.04)",
                  border: `1px solid ${service.color}25`,
                  borderRadius: 2,
                  padding: "10px 12px",
                  fontFamily: "var(--font-inter), sans-serif",
                  fontSize: 13,
                  color: "#f5f0e8",
                  resize: "vertical",
                  outline: "none",
                  marginBottom: 16,
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && e.metaKey) handleNext();
                }}
              />

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <motion.button
                  onClick={handleNext}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  style={{
                    padding: "10px 24px",
                    background: service.color,
                    border: "none",
                    borderRadius: 2,
                    color: "#0a0a0a",
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    cursor: "none",
                  }}
                >
                  {step < STEPS.length - 1 ? "Next Scene →" : "Send Script"}
                </motion.button>
              </div>
            </>
          )}

          <button
            onClick={onClose}
            style={{
              position: "absolute",
              top: 16,
              right: 16,
              background: "none",
              border: "none",
              color: "rgba(245,240,232,0.3)",
              fontSize: 20,
              cursor: "none",
            }}
            aria-label="Close"
          >
            ×
          </button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function ServicesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
  }, []);

  return (
    <section
      id="services"
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#060608",
        padding: "100px 0 80px",
        overflow: "hidden",
      }}
      aria-label="Services"
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 40 }}
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
              What I Create
            </span>
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(1.4rem, 3.5vw, 2.4rem)",
              fontWeight: 800,
              color: "#f5f0e8",
              letterSpacing: "0.08em",
              marginBottom: 8,
            }}
          >
            Director&apos;s Lenses
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 13,
              color: "rgba(245,240,232,0.4)",
              letterSpacing: "0.05em",
            }}
          >
            {isMobile ? "Tap a service to open a script meeting." : "Hover an orb to explore · Click to open a script meeting."}
          </p>
        </motion.div>

        {/* 3D Orb Canvas (desktop) / Card grid (mobile) */}
        {!isMobile ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.3 }}
            style={{ height: "50vh", marginBottom: 0 }}
          >
            <OrbScene onSelect={setSelectedService} />
          </motion.div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 12,
              marginBottom: 32,
            }}
          >
            {SERVICES.map((service, i) => (
              <motion.button
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: i * 0.1 }}
                onClick={() => setSelectedService(service)}
                onMouseEnter={() => setCursor("crosshair")}
                onMouseLeave={resetCursor}
                style={{
                  padding: "20px 16px",
                  background: "rgba(212,175,119,0.04)",
                  border: `1px solid ${service.color}25`,
                  borderRadius: 4,
                  textAlign: "left",
                  cursor: "none",
                }}
              >
                <div style={{ fontSize: 20, marginBottom: 8 }}>{service.icon}</div>
                <h3
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: 11,
                    fontWeight: 700,
                    color: service.color,
                    letterSpacing: "0.1em",
                    marginBottom: 6,
                  }}
                >
                  {service.title}
                </h3>
                <p
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 11,
                    color: "rgba(245,240,232,0.5)",
                    lineHeight: 1.5,
                  }}
                >
                  {service.description.slice(0, 80)}…
                </p>
              </motion.button>
            ))}
          </div>
        )}
      </div>

      {selectedService && (
        <ScriptMeetingModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </section>
  );
}
