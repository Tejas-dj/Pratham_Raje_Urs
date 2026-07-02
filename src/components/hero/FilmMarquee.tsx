"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { cloudinaryImage, cloudinaryVideo } from "@/lib/cloudinary";

// Top strip — every preview clip in the Videos library, always playing.
const STRIP_VIDEOS = [
  { src: cloudinaryVideo("DOT._I_KANNADA_SHORT_FILM_swxfw5"), title: "DOT." },
  { src: cloudinaryVideo("Before_The_Coffee_Gets_Cold_fhvaao"), title: "Before The Coffee Gets Cold" },
  { src: cloudinaryVideo("SHE_ASKED_FOR_SUNFLOWERS_id1iwo"), title: "She Asked for Sunflowers" },
  {
    src: cloudinaryVideo(
      "The_Christmas_Guest_A_Short_Film_That_Will_Stay_With_You_-_Talon_Production_House_144p_aqxk6u",
    ),
    title: "The Christmas Guest",
  },
  { src: cloudinaryVideo("Nasheya_Gungale_Music_Video_pihf6d"), title: "Nasheya Gungale" },
  { src: cloudinaryVideo("JEWELLERY_AD_zzdsjb"), title: "Jewellery Ad" },
  { src: cloudinaryVideo("Shazia_Khan_AD_gnr0fo"), title: "Shazia Khan Ad" },
  { src: cloudinaryVideo("Sees_Kaddi-Trailer_awtp8z"), title: "Sees Kaddi" },
];

// Bottom strip — a random slice of landscape stills from the photography library.
const STRIP_IMAGES = [
  { src: cloudinaryImage("BEACH_1-08_w7pjgh"), title: "Karnataka Diaries" },
  { src: cloudinaryImage("IMAGE_-12_ynydq5"), title: "Behind The Frame" },
  { src: cloudinaryImage("BEACH_1-06_x1mk6j"), title: "Karnataka Diaries" },
  { src: cloudinaryImage("DSC00950_g5ai2c"), title: "On Set" },
  { src: cloudinaryImage("BEACH_1-09_kjpjja"), title: "Karnataka Diaries" },
  { src: cloudinaryImage("shradha_team-05_qfbsyd"), title: "Shradha Team" },
  { src: cloudinaryImage("BEACH_1-17_jntr4z"), title: "Karnataka Diaries" },
  { src: cloudinaryImage("DSC01155_b0kmvt"), title: "On Set" },
  { src: cloudinaryImage("shradha_team-01_dal4gm"), title: "Shradha Team" },
  { src: cloudinaryImage("BEACH_1-07_kbziko"), title: "Karnataka Diaries" },
  { src: cloudinaryImage("shradha_team-03_uaswej"), title: "Shradha Team" },
  { src: cloudinaryImage("DSC01329_ir9f96"), title: "On Set" },
  { src: cloudinaryImage("DSC01055_xxbbwd"), title: "Mysuru Streets" },
  { src: cloudinaryImage("IMAGE_-11_b6ofm8"), title: "Behind The Frame" },
  { src: cloudinaryImage("Sees_Kaddi_Landscape_f2y5dm"), title: "Sees Kaddi" },
  { src: cloudinaryImage("BEACH_1-05_cmeemu"), title: "Karnataka Diaries" },
  { src: cloudinaryImage("DSC01262_s8b80e"), title: "On Set" },
  { src: cloudinaryImage("IMAGE_-03_s8espp"), title: "Behind The Frame" },
  { src: cloudinaryImage("shradha_team-07_pgfsgv"), title: "Shradha Team" },
  { src: cloudinaryImage("shradha_team-14_apndxu"), title: "Shradha Team" },
];

function SprocketHoles({ count }: { count: number }) {
  return (
    <div style={{ display: "flex", gap: 6, justifyContent: "center", padding: "0 12px" }}>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          style={{
            width: 10,
            height: 14,
            borderRadius: 2,
            background: "rgba(17,24,35,0.9)",
            border: "1px solid rgba(170,146,115,0.15)",
            flexShrink: 0,
          }}
        />
      ))}
    </div>
  );
}

interface FilmFrameProps {
  src: string;
  title: string;
  index: number;
  isVideo?: boolean;
}

function FilmFrame({ src, title, index, isVideo }: FilmFrameProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        position: "relative",
        width: 200,
        flexShrink: 0,
        background: "#0a0e14",
        borderRadius: 4,
        overflow: "hidden",
        border: "1px solid rgba(170,146,115,0.12)",
        transition: "transform 0.5s cubic-bezier(0.23, 1, 0.32, 1), box-shadow 0.5s ease",
        transform: isHovered ? "scale(1.05)" : "scale(1)",
        boxShadow: isHovered
          ? "0 0 30px rgba(170,146,115,0.3), 0 0 60px rgba(31,85,96,0.15)"
          : "0 2px 20px rgba(0,0,0,0.4)",
        cursor: "pointer",
      }}
    >
      {/* Sprocket holes top */}
      <div style={{ padding: "6px 0 4px" }}>
        <SprocketHoles count={13} />
      </div>

      {/* Frame */}
      <div
        style={{
          position: "relative",
          width: "100%",
          height: 120,
          overflow: "hidden",
          margin: "0 auto",
          background: src ? undefined : "#1a1e28",
        }}
      >
        {src && isVideo && (
          <video
            src={src}
            autoPlay
            muted
            loop
            playsInline
            style={{
              position: "absolute",
              inset: 0,
              width: "100%",
              height: "100%",
              objectFit: "cover",
              transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1), filter 0.5s ease",
              transform: isHovered ? "scale(1.12)" : "scale(1)",
              filter: isHovered ? "brightness(1.1) saturate(1.2)" : "brightness(0.85) saturate(0.9)",
            }}
          />
        )}
        {src && !isVideo && (
          <Image
            src={src}
            alt={title}
            fill
            sizes="200px"
            style={{
              objectFit: "cover",
              transition: "transform 0.8s cubic-bezier(0.23, 1, 0.32, 1), filter 0.5s ease",
              transform: isHovered ? "scale(1.12)" : "scale(1)",
              filter: isHovered ? "brightness(1.1) saturate(1.2)" : "brightness(0.85) saturate(0.9)",
            }}
          />
        )}

        {/* Film frame counter */}
        <div
          style={{
            position: "absolute",
            bottom: 6,
            right: 8,
            fontFamily: "var(--font-inter), monospace",
            fontSize: 9,
            letterSpacing: "0.15em",
            color: "rgba(170,146,115,0.5)",
            textShadow: "0 1px 3px rgba(0,0,0,0.8)",
          }}
        >
          {String(index + 1).padStart(2, "0")}A
        </div>

        {/* Title overlay on hover */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            padding: "24px 12px 8px",
            background: "linear-gradient(transparent, rgba(10,14,20,0.9))",
            opacity: isHovered ? 1 : 0,
            transform: isHovered ? "translateY(0)" : "translateY(6px)",
            transition: "opacity 0.4s ease, transform 0.4s ease",
          }}
        >
          <div
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 11,
              letterSpacing: "0.2em",
              color: "#AA9273",
              textTransform: "uppercase",
            }}
          >
            {title}
          </div>
        </div>
      </div>

      {/* Sprocket holes bottom */}
      <div style={{ padding: "4px 0 6px" }}>
        <SprocketHoles count={13} />
      </div>
    </div>
  );
}

export default function FilmMarquee() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const gap = isMobile ? 12 : 18;

  return (
    <section
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        background: "#111823",
        padding: isMobile ? "24px 0" : "40px 0",
      }}
    >
      {/* Top strip — scrolls left, all preview clips playing */}
      <div
        style={{
          position: "relative",
          marginBottom: isMobile ? 10 : 16,
          transform: "rotate(-1.5deg)",
          transformOrigin: "center center",
        }}
      >
        {/* Edge fade left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to right, #111823, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Edge fade right */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to left, #111823, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div
          className="marquee-strip"
          style={{
            display: "flex",
            gap,
            width: "max-content",
            animation: `marquee-scroll-left ${isMobile ? 14 : 20}s linear infinite`,
          }}
        >
          {[...STRIP_VIDEOS, ...STRIP_VIDEOS, ...STRIP_VIDEOS, ...STRIP_VIDEOS].map((clip, i) => (
            <FilmFrame key={`top-${i}`} src={clip.src} title={clip.title} index={i % STRIP_VIDEOS.length} isVideo />
          ))}
        </div>
      </div>

      {/* Bottom strip — scrolls right, landscape stills */}
      <div
        style={{
          position: "relative",
          transform: "rotate(1.5deg)",
          transformOrigin: "center center",
        }}
      >
        {/* Edge fade left */}
        <div
          style={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to right, #111823, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />
        {/* Edge fade right */}
        <div
          style={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: 120,
            background: "linear-gradient(to left, #111823, transparent)",
            zIndex: 2,
            pointerEvents: "none",
          }}
        />

        <div
          className="marquee-strip"
          style={{
            display: "flex",
            gap,
            width: "max-content",
            animation: `marquee-scroll-right ${isMobile ? 16 : 24}s linear infinite`,
          }}
        >
          {[...STRIP_IMAGES, ...STRIP_IMAGES].map((img, i) => (
            <FilmFrame key={`bot-${i}`} src={img.src} title={img.title} index={(i % STRIP_IMAGES.length) + 8} />
          ))}
        </div>
      </div>

      {/* Projector light glow */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "60%",
          height: "80%",
          background: "radial-gradient(ellipse, rgba(170,146,115,0.04) 0%, transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
    </section>
  );
}
