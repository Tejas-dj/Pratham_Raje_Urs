"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useCursorContext } from "@/providers/CursorProvider";

interface NavFrameProps {
  label: string;
  href: string;
  isActive?: boolean;
}

export default function NavFrame({ label, href, isActive }: NavFrameProps) {
  const [hovered, setHovered] = useState(false);
  const [frameCode, setFrameCode] = useState("42");
  const { setCursor, resetCursor } = useCursorContext();
  const router = useRouter();
  const pathname = usePathname();

  const isRoute = href.startsWith("/");

  useEffect(() => {
    setFrameCode(String(Math.floor(Math.random() * 90) + 10));
  }, []);

  const handleEnter = () => {
    setHovered(true);
    setCursor("crosshair");
  };

  const handleLeave = () => {
    setHovered(false);
    resetCursor();
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isRoute) return; // Let Link handle it
    e.preventDefault();
    const id = href.replace("#", "");
    if (pathname !== "/") {
      router.push("/" + href);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    }
  };

  const content = (
    <>
      {/* Frame border */}
      <div
        style={{
          position: "absolute",
          inset: 2,
          border: isActive
            ? "1px solid rgba(170,146,115,0.7)"
            : "1px solid rgba(170,146,115,0.2)",
          borderRadius: 1,
          transition: "border-color 0.3s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          background: hovered ? "rgba(0,0,0,0.05)" : "rgba(0,0,0,0.12)",
          transition: "background 0.5s ease",
        }}
      />

      <div
        style={{
          position: "absolute",
          top: 5,
          left: 6,
          fontFamily: "Courier New, monospace",
          fontSize: 7,
          color: "rgba(170,146,115,0.3)",
          letterSpacing: "0.05em",
          lineHeight: 1,
        }}
      >
        {frameCode}A
      </div>

      <motion.span
        style={{
          position: "relative",
          fontFamily: "var(--font-cinzel), serif",
          fontSize: 9,
          fontWeight: 600,
          letterSpacing: "0.25em",
          textTransform: "uppercase",
          color: isActive ? "#AA9273" : "rgba(248,244,237,0.7)",
          transition: "color 0.3s ease",
          zIndex: 1,
          textAlign: "center",
        }}
        animate={{ color: hovered ? "#AA9273" : isActive ? "#AA9273" : "rgba(248,244,237,0.7)" }}
      >
        {label}
      </motion.span>

      <motion.div
        initial={{ scaleX: 0 }}
        animate={{ scaleX: isActive || hovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{
          position: "absolute",
          bottom: 6,
          left: "20%",
          right: "20%",
          height: 1,
          background: "#AA9273",
          transformOrigin: "left",
          boxShadow: "0 0 4px rgba(170,146,115,0.6)",
        }}
      />
    </>
  );

  const sharedStyle: React.CSSProperties = {
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    width: "auto",
    minWidth: 80,
    padding: "0 12px",
    height: 52,
    textDecoration: "none",
    overflow: "hidden",
    flexShrink: 0,
  };

  if (isRoute) {
    return (
      <Link
        href={href}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={sharedStyle}
        aria-label={`Navigate to ${label}`}
      >
        {content}
      </Link>
    );
  }

  return (
    <motion.a
      href={href}
      onClick={handleClick}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
      style={sharedStyle}
      aria-label={`Navigate to ${label}`}
    >
      {content}
    </motion.a>
  );
}
