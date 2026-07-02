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
  const reduced = useReducedMotion();

  useEffect(() => {
    if (!ready) return;

    const FADE_DELAY = 1500;

    if (reduced) {
      const t = setTimeout(() => {
        [titleRef, taglineRef].forEach((r) => {
          if (r.current) {
            r.current.style.opacity = "1";
            r.current.style.transform = "none";
          }
        });
      }, FADE_DELAY);
      return () => clearTimeout(t);
    }

    let tl: gsap.core.Timeline;
    const t = setTimeout(() => {
      tl = gsap.timeline({ defaults: { ease: "power2.out" } });

      if (titleRef.current) {
        const chars = titleRef.current.querySelectorAll(".char");
        tl.fromTo(
          chars,
          { y: 40, opacity: 0, filter: "blur(6px)" },
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            stagger: 0.06,
            duration: 1.8,
            ease: "power2.out",
          },
          0
        );
      }

      if (taglineRef.current) {
        tl.fromTo(
          taglineRef.current,
          { opacity: 0, y: 16 },
          { opacity: 1, y: 0, duration: 1.4, ease: "power2.out" },
          1.8
        );
      }
    }, FADE_DELAY);

    return () => {
      clearTimeout(t);
      if (tl) tl.kill();
    };
  }, [ready, reduced]);

  const words = " PRATHAM RAJE URS".split(" ");
  const titleChars = words.map((word, wIdx) => (
    <span key={`word-${wIdx}`} style={{ display: "inline-block", whiteSpace: "nowrap", marginRight: wIdx !== words.length - 1 ? "0.45em" : 0 }}>
      {word.split("").map((char, cIdx) => (
        <span key={`char-${wIdx}-${cIdx}`} className="char" style={{ display: "inline-block", opacity: 0 }}>
          {char}
        </span>
      ))}
    </span>
  ));

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
          fontSize: "clamp(2.5rem, 9vw, 8rem)",
          fontWeight: 900,
          letterSpacing: "0.15em",
          color: "#AA9273",
          lineHeight: 1.0,
          margin: "0 -0.15em 24px 0",
          textShadow: `
            0 0 20px rgba(170,146,115,0.5),
            0 0 40px rgba(170,146,115,0.25),
            0 0 80px rgba(170,146,115,0.12)
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
          color: "#F8F4ED",
          margin: 0,
          opacity: 0,
        }}
      >
        Chasing Feelings. Framing Stories.
      </p>
    </div>
  );
}
