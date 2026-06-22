"use client";

import React, { useRef, useState, useEffect, useCallback } from "react";
import { motion, useInView } from "framer-motion";
import InteractivePortrait from "./InteractivePortrait";

function CountUp({ target, suffix, trigger, delay }: { target: number; suffix: string; trigger: boolean; delay: number }) {
  const [count, setCount] = useState(0);
  const hasRun = useRef(false);

  useEffect(() => {
    if (!trigger || hasRun.current) return;
    hasRun.current = true;

    const timeout = setTimeout(() => {
      const duration = 1800;
      const steps = 60;
      const increment = target / steps;
      let current = 0;
      let step = 0;

      const interval = setInterval(() => {
        step++;
        const progress = step / steps;
        const eased = 1 - Math.pow(1 - progress, 3);
        current = Math.round(eased * target);
        setCount(Math.min(current, target));

        if (step >= steps) {
          setCount(target);
          clearInterval(interval);
        }
      }, duration / steps);
    }, delay * 1000);

    return () => clearTimeout(timeout);
  }, [trigger, target, delay]);

  return <>{count}{suffix}</>;
}

export default function AboutSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-100px" });

  // Client-only rain streaks — server renders nothing to avoid hydration mismatch
  const [rainHeights, setRainHeights] = useState<number[]>([]);
  useEffect(() => {
    setRainHeights(Array.from({ length: 30 }, () => 60 + Math.random() * 40));
  }, []);

  return (
    <section
      id="about"
      ref={sectionRef}
      style={{
        position: "relative",
        minHeight: "100vh",
        background: "#111823",
        padding: "clamp(80px, 10vw, 140px) 0 clamp(60px, 8vw, 120px)",
        overflow: "hidden",
      }}
      aria-label="About Pratham Raje Urs"
    >
      {/* Rain animation background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
          opacity: 0.06,
        }}
        aria-hidden
      >
        {rainHeights.map((h, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: "-10%",
              left: `${(i * 3.4) % 100}%`,
              width: "1px",
              height: `${h}px`,
              backgroundImage: "linear-gradient(to bottom, transparent, rgba(170,146,115,0.4), transparent)",
              animationName: "fall",
              animationDuration: `${1.8 + (i % 5) * 0.4}s`,
              animationTimingFunction: "linear",
              animationDelay: `${(i * 0.18) % 2}s`,
              animationIterationCount: "infinite",
            }}
          />
        ))}
      </div>

      {/* Flicker overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          animation: "film-flicker 4s steps(2) infinite",
          background: "rgba(255,255,255,0.008)",
        }}
        aria-hidden
      />

      <div
        style={{
          maxWidth: "min(90vw, 1400px)",
          margin: "0 auto",
          padding: "0 clamp(24px, 4vw, 64px)",
        }}
      >
        {/* Opening quote */}
        <motion.blockquote
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          style={{
            textAlign: "center",
            marginBottom: "clamp(48px, 6vw, 96px)",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(1.2rem, 3.5vw, 2.4rem)",
              fontWeight: 400,
              color: "#AA9273",
              fontStyle: "italic",
              lineHeight: 1.5,
              textShadow: "0 0 40px rgba(170,146,115,0.2)",
              marginBottom: 16,
            }}
          >
            &ldquo;I was never just chasing a camera angle.
            <br />
            I was chasing a feeling.&rdquo;
          </p>
          <footer
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 11,
              letterSpacing: "0.3em",
              color: "rgba(170,146,115,0.4)",
              textTransform: "uppercase",
            }}
          >
            Pratham Raje Urs
          </footer>
        </motion.blockquote>

        {/* Portrait + bio row */}
        <div
          style={{
            display: "flex",
            gap: "clamp(32px, 5vw, 72px)",
            alignItems: "flex-start",
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, x: -40, filter: "blur(10px)", scale: 0.95 }}
            animate={inView ? { opacity: 1, x: 0, filter: "blur(0px)", scale: 1 } : {}}
            transition={{ duration: 0.9, delay: 0.5 }}
          >
            <InteractivePortrait />
          </motion.div>

          {/* Bio text */}
          <motion.div
            initial={{ opacity: 0, y: 30, filter: "blur(8px)" }}
            animate={inView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
            transition={{ duration: 0.9, delay: 0.6 }}
            style={{ flex: 1, minWidth: 280, maxWidth: 700 }}
          >
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(15px, 1.1vw, 18px)",
                lineHeight: 1.9,
                color: "rgba(248,244,237,0.7)",
                marginBottom: 20,
              }}
            >
              With 6 years of filmmaking experience, Pratham Raje Urs has been crafting stories with nothing but
              raw vision and a feeling too heavy to keep inside. Born into Mysuru&apos;s royal Urs heritage, raised on
              Karnataka&apos;s golden-hour light, he found that cinema was the only language big enough for what he
              wanted to say.
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(15px, 1.1vw, 18px)",
                lineHeight: 1.9,
                color: "rgba(248,244,237,0.7)",
                marginBottom: 20,
              }}
            >
              He founded{" "}
              <span style={{ color: "#AA9273", fontWeight: 600 }}>Talon Production House</span>, a home for
              Kannada stories that dare to feel something. His short films have earned a Dada Saheb Phalke
              Festival selection, and he&apos;s even stepped in front of the lens as an actor in{" "}
              <span style={{ color: "#7EADA9", fontStyle: "italic" }}>Sees Kaddi</span>.
            </p>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: "clamp(15px, 1.1vw, 18px)",
                lineHeight: 1.9,
                color: "rgba(248,244,237,0.7)",
              }}
            >
              At 19, Pratham is just getting started. Every frame is still a chase. Every film is still a feeling.
            </p>

            {/* Stats row */}
            <div
              style={{
                marginTop: "clamp(36px, 4vw, 56px)",
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
              }}
            >
              {[
                { target: 6, suffix: "+", label: "Years of work experience" },
                { target: 4, suffix: "+", label: "Short films directed" },
                { target: 2, suffix: "", label: "Feature films" },
                { target: 100, suffix: "+", label: "Satisfied customers" },
              ].map((stat, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={inView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ delay: 0.7 + i * 0.1, type: "spring" }}
                  style={{ textAlign: "center" }}
                >
                  <div
                    style={{
                      fontFamily: "var(--font-cinzel), serif",
                      fontSize: "clamp(28px, 3vw, 40px)",
                      fontWeight: 900,
                      color: "#AA9273",
                      textShadow: "0 0 20px rgba(170,146,115,0.3)",
                    }}
                  >
                    <CountUp target={stat.target} suffix={stat.suffix} trigger={inView} delay={0.7 + i * 0.1} />
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "clamp(10px, 0.8vw, 13px)",
                      letterSpacing: "0.2em",
                      color: "rgba(248,244,237,0.4)",
                      textTransform: "uppercase",
                      marginTop: 2,
                    }}
                  >
                    {stat.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fall {
          from { transform: translateY(-120px); }
          to { transform: translateY(110vh); }
        }
      `}</style>
    </section>
  );
}
