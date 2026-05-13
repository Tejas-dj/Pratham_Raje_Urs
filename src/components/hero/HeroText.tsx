"use client";

import React, { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";
import { useReducedMotion } from "@/hooks/useReducedMotion";

interface HeroTextProps {
  ready: boolean;
}

export default function HeroText({ ready }: HeroTextProps) {
  const titleRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const badgesRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ready) return;
    if (reduced) {
      // Instant reveal for accessibility
      [titleRef, taglineRef, sublineRef, badgesRef].forEach((r) => {
        if (r.current) {
          r.current.style.opacity = "1";
          r.current.style.transform = "none";
        }
      });
      return;
    }

    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    // Title — chars stagger up from below
    if (titleRef.current) {
      const chars = titleRef.current.querySelectorAll(".char");
      tl.fromTo(
        chars,
        { y: 80, opacity: 0, filter: "blur(4px)" },
        {
          y: 0,
          opacity: 1,
          filter: "blur(0px)",
          stagger: 0.04,
          duration: 1.0,
          ease: "power3.out",
        },
        0
      );
    }

    // Tagline — typewriter (clip-path reveal)
    if (taglineRef.current) {
      tl.fromTo(
        taglineRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8 },
        1.2
      );
    }

    // Sub-headline fade
    if (sublineRef.current) {
      tl.fromTo(
        sublineRef.current,
        { opacity: 0, y: -15 },
        { opacity: 1, y: 0, duration: 0.7 },
        2.0
      );
    }

    // Badges scale spring
    if (badgesRef.current) {
      const badges = badgesRef.current.querySelectorAll(".badge");
      tl.fromTo(
        badges,
        { scale: 0, opacity: 0, rotation: -8 },
        {
          scale: 1,
          opacity: 1,
          rotation: 0,
          stagger: 0.1,
          duration: 0.5,
          ease: "elastic.out(1, 0.5)",
        },
        2.6
      );
    }

    return () => {
      tl.kill();
    };
  }, [ready, reduced]);

  const titleChars = "PRATHAM RAJE URS".split("").map((char, i) =>
    char === " " ? (
      <span key={i} className="char" style={{ display: "inline-block", width: "0.35em" }}>
        &nbsp;
      </span>
    ) : (
      <span key={i} className="char" style={{ display: "inline-block", opacity: 0 }}>
        {char}
      </span>
    )
  );

  const BADGES = [
    "LV Prasad Cinematography",
    "Dada Saheb Phalke Selected",
    "Mysuru → Bengaluru",
    "Filmmaking Since Age 10",
  ];

  return (
    <div
      style={{
        position: "relative",
        zIndex: 10,
        textAlign: "center",
        padding: "0 24px",
        maxWidth: 1000,
        margin: "0 auto",
        pointerEvents: "none",
      }}
    >
      {/* Main title */}
      <h1
        ref={titleRef}
        style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "clamp(2.8rem, 9vw, 8rem)",
          fontWeight: 900,
          letterSpacing: "0.12em",
          color: "#d4af77",
          lineHeight: 1.0,
          margin: "0 0 24px",
          textShadow: `
            0 0 20px rgba(212,175,119,0.5),
            0 0 40px rgba(212,175,119,0.25),
            0 0 80px rgba(212,175,119,0.12)
          `,
          overflow: "hidden",
        }}
      >
        {titleChars}
      </h1>

      {/* Tagline */}
      <p
        ref={taglineRef}
        style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: "clamp(0.9rem, 2vw, 1.3rem)",
          fontWeight: 400,
          letterSpacing: "0.3em",
          color: "#f5f0e8",
          margin: "0 0 16px",
          opacity: 0,
        }}
      >
        Chasing Feelings. Framing Kannada Stories.
      </p>

      {/* Sub-headline */}
      <p
        ref={sublineRef}
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontSize: "clamp(0.7rem, 1.3vw, 0.9rem)",
          fontWeight: 400,
          letterSpacing: "0.2em",
          color: "rgba(245,240,232,0.55)",
          margin: "0 0 36px",
          opacity: 0,
        }}
      >
        Director&nbsp;·&nbsp;Cinematographer&nbsp;·&nbsp;Editor&nbsp;·&nbsp;
        <span style={{ color: "#7ed4d4" }}>Actor (Sees Kaddi)</span>&nbsp;·&nbsp;
        <span style={{ color: "#d4af77" }}>Founder @ Talon Production House</span>
      </p>

      {/* Badge stamps */}
      <div
        ref={badgesRef}
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 10,
          justifyContent: "center",
          pointerEvents: "all",
        }}
      >
        {BADGES.map((badge, i) => (
          <div
            key={i}
            className="badge"
            style={{
              padding: "5px 14px",
              border: "1px solid rgba(212,175,119,0.4)",
              borderRadius: 2,
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "clamp(0.55rem, 1vw, 0.7rem)",
              fontWeight: 600,
              letterSpacing: "0.2em",
              color: "rgba(212,175,119,0.8)",
              textTransform: "uppercase",
              background: "rgba(212,175,119,0.06)",
              opacity: 0,
              backdropFilter: "blur(4px)",
              transition: "all 0.3s ease",
            }}
          >
            {badge}
          </div>
        ))}
      </div>
    </div>
  );
}
