"use client";

import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { usePathname } from "next/navigation";
import NavFrame from "./NavFrame";
import { NAV_ITEMS } from "@/lib/data";

export default function FilmStripNav() {
  const [activeSection, setActiveSection] = useState("home");
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/photography") {
      setActiveSection("photography");
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 80);

      const sections = ["hero", "vault", "photography", "about", "connect"];
      for (const id of [...sections].reverse()) {
        const el = document.getElementById(id);
        if (el && window.scrollY >= el.offsetTop - 200) {
          setActiveSection(id === "hero" ? "home" : id);
          break;
        }
      }
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [pathname]);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9990,
        height: 80,
        background: "rgba(17,24,35,0.35)",
        backdropFilter: "blur(18px)",
        borderBottom: "1px solid rgba(170,146,115,0.08)",
        boxShadow: scrolled ? "0 4px 30px rgba(0,0,0,0.5)" : "none",
        transition: "box-shadow 0.3s ease",
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        viewTransitionName: "site-header",
      }}
      aria-label="Main navigation"
    >
      {/* Left perforations */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          padding: "0 8px",
          flexShrink: 0,
        }}
        aria-hidden
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 8,
              border: "1px solid rgba(170,146,115,0.25)",
              borderRadius: 1,
              background: "transparent",
            }}
          />
        ))}
      </div>

      {/* Logo */}
      <div style={{ marginLeft: 8, marginRight: 24, flexShrink: 0 }}>
        <img
          src="/images/talon-logo.svg"
          alt="Talon Production House"
          style={{
            height: 60,
            width: "auto",
            display: "block",
            filter: "drop-shadow(0 0 8px rgba(170,146,115,0.35))",
          }}
        />
      </div>

      {/* Film strip frames */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          flex: 1,
          gap: 0,
        }}
      >
        {[...Array(3)].map((_, i) => (
          <React.Fragment key={`sprocket-l-${i}`}>
            <div
              aria-hidden
              style={{
                width: 12,
                height: 18,
                border: "1px solid rgba(170,146,115,0.15)",
                borderRadius: 1,
                background: "#111823",
                flexShrink: 0,
                margin: "0 3px",
              }}
            />
          </React.Fragment>
        ))}

        {NAV_ITEMS.map((item) => (
          <NavFrame
            key={item.id}
            label={item.label}
            href={item.href}
            clip={item.clip}
            isActive={activeSection === item.id}
          />
        ))}

        {[...Array(3)].map((_, i) => (
          <div
            key={`sprocket-r-${i}`}
            aria-hidden
            style={{
              width: 12,
              height: 18,
              border: "1px solid rgba(170,146,115,0.15)",
              borderRadius: 1,
              background: "transparent",
              flexShrink: 0,
              margin: "0 3px",
            }}
          />
        ))}
      </div>

      {/* Right perforations */}
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 5,
          padding: "0 8px",
          flexShrink: 0,
        }}
        aria-hidden
      >
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 8,
              border: "1px solid rgba(170,146,115,0.25)",
              borderRadius: 1,
              background: "#111823",
            }}
          />
        ))}
      </div>
    </motion.nav>
  );
}
