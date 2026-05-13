"use client";

import React, { useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { useCursorContext } from "@/providers/CursorProvider";

const CONTACT_ITEMS = [
  {
    label: "Email",
    value: "hello@prathamrajeurs.com",
    href: "mailto:hello@prathamrajeurs.com",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af77" strokeWidth="1.5">
        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
        <polyline points="22,6 12,13 2,6" />
      </svg>
    ),
  },
  {
    label: "Phone",
    value: "+91 XXXXX XXXXX",
    href: "tel:+91XXXXXXXXXX",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af77" strokeWidth="1.5">
        <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8 19.79 19.79 0 01.01 2.18 2 2 0 012 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
      </svg>
    ),
  },
  {
    label: "Instagram",
    value: "@prathamrajeurs",
    href: "https://instagram.com/prathamrajeurs",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#d4af77" strokeWidth="1.5">
        <rect x="2" y="2" width="20" height="20" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="1" fill="#d4af77" stroke="none" />
      </svg>
    ),
  },
];

export default function ConnectSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { once: true, margin: "-80px" });
  const [eggClicks, setEggClicks] = useState(0);
  const [vaultOpen, setVaultOpen] = useState(false);
  const { setCursor, resetCursor } = useCursorContext();

  function handleNameClick() {
    const next = eggClicks + 1;
    setEggClicks(next);
    if (next >= 7) {
      setVaultOpen(true);
      setEggClicks(0);
    }
  }

  return (
    <section
      id="connect"
      ref={sectionRef}
      style={{
        position: "relative",
        background: "#080808",
        padding: "100px 0 0",
        overflow: "hidden",
      }}
      aria-label="Connect with Pratham"
    >
      <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 24px 100px" }}>
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          style={{ marginBottom: 64, textAlign: "center" }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 16,
              marginBottom: 8,
            }}
          >
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
              Get In Touch
            </span>
            <div style={{ width: 40, height: 1, background: "#d4af77", opacity: 0.4 }} />
          </div>
          <h2
            style={{
              fontFamily: "var(--font-cinzel), serif",
              fontSize: "clamp(1.4rem, 4vw, 2.8rem)",
              fontWeight: 800,
              color: "#f5f0e8",
              letterSpacing: "0.08em",
              marginBottom: 12,
            }}
          >
            Let&apos;s Make Something Real
          </h2>
          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: 14,
              color: "rgba(245,240,232,0.4)",
              lineHeight: 1.8,
              maxWidth: 480,
              margin: "0 auto",
            }}
          >
            Whether it&apos;s a wedding, a short film, a brand story, or just a feeling you need to put on screen —
            reach out. Pratham answers everything personally.
          </p>
        </motion.div>

        {/* Contact items */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: "flex",
            justifyContent: "center",
            gap: 20,
            flexWrap: "wrap",
          }}
        >
          {CONTACT_ITEMS.map((item, i) => (
            <motion.a
              key={item.label}
              href={item.href}
              target={item.label === "Instagram" ? "_blank" : undefined}
              rel={item.label === "Instagram" ? "noopener noreferrer" : undefined}
              initial={{ opacity: 0, y: 16 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.12 }}
              whileHover={{ y: -4 }}
              onMouseEnter={() => setCursor("crosshair")}
              onMouseLeave={resetCursor}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 14,
                padding: "32px 36px",
                background: "rgba(212,175,119,0.03)",
                border: "1px solid rgba(212,175,119,0.12)",
                borderRadius: 4,
                textDecoration: "none",
                cursor: "none",
                minWidth: 200,
                flex: "1 1 200px",
                maxWidth: 260,
                transition: "border-color 0.3s ease, background 0.3s ease",
              }}
            >
              <div
                style={{
                  width: 52,
                  height: 52,
                  border: "1px solid rgba(212,175,119,0.2)",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  background: "rgba(212,175,119,0.05)",
                }}
              >
                {item.icon}
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontFamily: "var(--font-inter), sans-serif",
                    fontSize: 9,
                    letterSpacing: "0.35em",
                    color: "rgba(212,175,119,0.45)",
                    textTransform: "uppercase",
                    marginBottom: 6,
                  }}
                >
                  {item.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-cinzel), serif",
                    fontSize: 13,
                    color: "#f5f0e8",
                    letterSpacing: "0.04em",
                    fontWeight: 500,
                  }}
                >
                  {item.value}
                </div>
              </div>
            </motion.a>
          ))}
        </motion.div>
      </div>

      {/* Footer */}
      <footer
        style={{
          borderTop: "1px solid rgba(212,175,119,0.1)",
          padding: "32px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 16,
          background: "#050505",
        }}
      >
        {/* Easter egg name */}
        <button
          onClick={handleNameClick}
          onMouseEnter={() => setCursor("crosshair")}
          onMouseLeave={resetCursor}
          style={{
            background: "none",
            border: "none",
            cursor: "none",
            fontFamily: "var(--font-cinzel), serif",
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: "0.4em",
            color: "rgba(212,175,119,0.4)",
            textTransform: "uppercase",
          }}
          aria-label="Pratham Raje Urs"
        >
          PRATHAM RAJE URS
          {eggClicks > 0 && eggClicks < 7 && (
            <span
              style={{
                marginLeft: 8,
                fontFamily: "Courier New, monospace",
                fontSize: 8,
                color: "rgba(212,175,119,0.2)",
              }}
            >
              ({7 - eggClicks})
            </span>
          )}
        </button>

        <div style={{ opacity: 0.3 }}>
          <img
            src="/images/talon-logo.svg"
            alt="Talon Production House"
            style={{ height: 28, width: "auto", display: "block" }}
          />
        </div>

        <div
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontSize: 10,
            color: "rgba(245,240,232,0.2)",
            letterSpacing: "0.1em",
          }}
        >
          © 2025 Talon Production House · Made with every feeling
        </div>
      </footer>

      {/* Inline vault modal */}
      {vaultOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 99990,
            background: "rgba(0,0,0,0.97)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={() => setVaultOpen(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              width: "min(90vw, 500px)",
              background: "#0d0d0d",
              border: "1px solid rgba(212,175,119,0.2)",
              borderRadius: 4,
              padding: "36px 32px",
            }}
          >
            <div
              style={{
                fontFamily: "Courier New, monospace",
                fontSize: 9,
                color: "#ff5e5e",
                letterSpacing: "0.3em",
                marginBottom: 16,
              }}
            >
              ● REC · RAW VAULT · RESTRICTED
            </div>
            <h3
              style={{
                fontFamily: "var(--font-cinzel), serif",
                fontSize: 18,
                color: "#d4af77",
                marginBottom: 16,
              }}
            >
              The Raw Vault
            </h3>
            <p
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                fontSize: 12,
                color: "rgba(245,240,232,0.5)",
                lineHeight: 1.7,
                marginBottom: 20,
              }}
            >
              You found it. These are the frames no one was supposed to see —
              age 10, a Nokia, a sunlit lane in Mysuru, and the first moment
              Pratham realized cinema was the only language big enough for what
              he felt.
            </p>
            <div
              style={{
                padding: "16px",
                background: "#111",
                border: "1px solid rgba(212,175,119,0.08)",
                borderRadius: 2,
                fontFamily: "Courier New, monospace",
                fontSize: 9,
                color: "rgba(212,175,119,0.25)",
                letterSpacing: "0.15em",
                textAlign: "center",
              }}
            >
              [ RAW CLIPS STORED ON MYSURU HARD DRIVE · COMING SOON ]
            </div>
            <button
              onClick={() => setVaultOpen(false)}
              style={{
                marginTop: 20,
                width: "100%",
                padding: "10px",
                background: "rgba(212,175,119,0.08)",
                border: "1px solid rgba(212,175,119,0.2)",
                borderRadius: 2,
                color: "#d4af77",
                fontFamily: "var(--font-cinzel), serif",
                fontSize: 10,
                letterSpacing: "0.3em",
                cursor: "pointer",
              }}
            >
              Close the Vault
            </button>
          </div>
        </div>
      )}
    </section>
  );
}
