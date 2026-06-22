"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { NAV_ITEMS } from "@/lib/data";
import { useCursorContext } from "@/providers/CursorProvider";

export default function MobileNavDrawer() {
  const [open, setOpen] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();
  const router = useRouter();
  const pathname = usePathname();

  // Close drawer on route change
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  function handleNavClick(href: string) {
    if (href.startsWith("/")) {
      router.push(href);
      setOpen(false);
      return;
    }
    const id = href.replace("#", "");
    if (pathname !== "/") {
      router.push("/" + href);
      setOpen(false);
      return;
    }
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
    setOpen(false);
  }

  return (
    <>
      {/* Hamburger toggle */}
      <motion.button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        onMouseEnter={() => setCursor("crosshair")}
        onMouseLeave={resetCursor}
        style={{
          position: "fixed",
          top: 14,
          right: 16,
          zIndex: 9995,
          background: "rgba(17,24,35,0.9)",
          border: "1px solid rgba(170,146,115,0.3)",
          borderRadius: 4,
          width: 44,
          height: 44,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          cursor: "none",
          backdropFilter: "blur(8px)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            style={{
              width: 18,
              height: 1.5,
              background: "#AA9273",
              borderRadius: 1,
              transformOrigin: "center",
            }}
            animate={
              open
                ? i === 0
                  ? { rotate: 45, y: 6.5 }
                  : i === 1
                  ? { opacity: 0 }
                  : { rotate: -45, y: -6.5 }
                : { rotate: 0, y: 0, opacity: 1 }
            }
            transition={{ duration: 0.2 }}
          />
        ))}
      </motion.button>

      {/* Drawer */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
              style={{
                position: "fixed",
                inset: 0,
                background: "rgba(0,0,0,0.7)",
                zIndex: 9993,
                backdropFilter: "blur(4px)",
              }}
            />

            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              drag="y"
              dragConstraints={{ top: 0, bottom: 0 }}
              dragElastic={{ top: 0, bottom: 0.2 }}
              onDragEnd={(_, info) => {
                if (info.offset.y > 80) setOpen(false);
              }}
              style={{
                position: "fixed",
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 9994,
                background: "#45302A",
                borderTop: "2px solid rgba(170,146,115,0.2)",
                borderRadius: "16px 16px 0 0",
                padding: "12px 0 40px",
              }}
            >
              {/* Drag handle */}
              <div
                style={{
                  width: 36,
                  height: 4,
                  background: "rgba(170,146,115,0.3)",
                  borderRadius: 2,
                  margin: "0 auto 16px",
                }}
              />

              <div
                style={{
                  textAlign: "center",
                  fontFamily: "var(--font-cinzel), serif",
                  fontSize: 12,
                  letterSpacing: "0.6em",
                  color: "rgba(170,146,115,0.5)",
                  marginBottom: 20,
                  textTransform: "uppercase",
                }}
              >
                INFINITE FRAMES
              </div>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 0,
                  padding: "0 24px",
                }}
              >
                {NAV_ITEMS.map((item, i) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.06 }}
                    onClick={() => handleNavClick(item.href)}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 16,
                      padding: "16px 0",
                      background: "none",
                      border: "none",
                      borderBottom: "1px solid rgba(170,146,115,0.08)",
                      cursor: "none",
                      textAlign: "left",
                      minHeight: 52,
                    }}
                  >
                    <div
                      style={{
                        width: 8,
                        height: 12,
                        border: "1px solid rgba(170,146,115,0.3)",
                        borderRadius: 1,
                        flexShrink: 0,
                      }}
                    />
                    <span
                      style={{
                        fontFamily: "var(--font-cinzel), serif",
                        fontSize: 14,
                        fontWeight: 600,
                        letterSpacing: "0.25em",
                        color: "#F8F4ED",
                        textTransform: "uppercase",
                      }}
                    >
                      {item.label}
                    </span>
                    <div style={{ flex: 1 }} />
                    {item.href.startsWith("/") && (
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" style={{ opacity: 0.3 }}>
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="#AA9273" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                    <span
                      style={{
                        fontFamily: "Courier New, monospace",
                        fontSize: 9,
                        color: "rgba(170,146,115,0.3)",
                      }}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
