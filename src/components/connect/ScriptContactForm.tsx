"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";

export default function ScriptContactForm() {
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    subject: "",
    message: "",
    email: "",
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    console.log("Contact form submitted:", form);
  }

  return (
    <div className="script-page" style={{ borderRadius: 4, boxShadow: "0 0 60px rgba(0,0,0,0.6)" }}>
      {/* Script header */}
      <div style={{ textAlign: "center", marginBottom: 32 }}>
        <div style={{ fontSize: 9, letterSpacing: "0.5em", color: "#888", marginBottom: 6, fontWeight: 700 }}>
          TALON PRODUCTION HOUSE
        </div>
        <div style={{ fontSize: 9, letterSpacing: "0.5em", color: "#888" }}>
          WRITTEN BY PRATHAM RAJE URS
        </div>
        <div
          style={{
            width: 60,
            height: 1,
            background: "#ccc",
            margin: "16px auto",
          }}
        />
        <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "0.15em" }}>
          "BEGIN A COLLABORATION"
        </div>
      </div>

      {submitted ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          style={{ textAlign: "center", padding: "32px 0" }}
        >
          <div style={{ fontSize: 32, marginBottom: 16 }}>✓</div>
          <div style={{ fontSize: 14, letterSpacing: "0.1em" }}>
            Your message has been received. Pratham will respond within 24 hours.
          </div>
          <div style={{ fontSize: 10, color: "#888", marginTop: 8, letterSpacing: "0.1em" }}>
            (FADE TO BLACK.)
          </div>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {/* Slugline */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: "#888", marginBottom: 4 }}>
              INT. COLLABORATION - DAY
            </div>
            <div
              style={{
                fontSize: 11,
                color: "#555",
                fontStyle: "italic",
                marginBottom: 8,
                lineHeight: 1.6,
              }}
            >
              A filmmaker sits across from a potential collaborator. The light is golden. The coffee is getting cold.
            </div>
          </div>

          {/* Name field */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: "#0a0a0a", marginBottom: 4 }}>
              YOUR NAME:
            </div>
            <input
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="(YOUR NAME — as it will appear in the credits)"
              style={{
                width: "100%",
                padding: "6px 0",
                background: "none",
                border: "none",
                borderBottom: "1px solid #bbb",
                fontFamily: "Courier New, monospace",
                fontSize: 12,
                color: "#0a0a0a",
                outline: "none",
              }}
            />
          </div>

          {/* Subject */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: "#0a0a0a", marginBottom: 4 }}>
              SUBJECT:
            </div>
            <input
              required
              value={form.subject}
              onChange={(e) => setForm({ ...form, subject: e.target.value })}
              placeholder="(What brings you here today?)"
              style={{
                width: "100%",
                padding: "6px 0",
                background: "none",
                border: "none",
                borderBottom: "1px solid #bbb",
                fontFamily: "Courier New, monospace",
                fontSize: 12,
                color: "#0a0a0a",
                outline: "none",
              }}
            />
          </div>

          {/* Message as dialogue */}
          <div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#0a0a0a", marginBottom: 4 }}>
              YOU
            </div>
            <textarea
              required
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="(Your dialogue here. Be honest. Pratham appreciates real feelings.)"
              style={{
                width: "100%",
                padding: "8px 16px",
                background: "none",
                border: "1px solid #ccc",
                fontFamily: "Courier New, monospace",
                fontSize: 12,
                color: "#0a0a0a",
                outline: "none",
                minHeight: 100,
                resize: "vertical",
              }}
            />
          </div>

          {/* Email */}
          <div>
            <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.3em", color: "#0a0a0a", marginBottom: 4 }}>
              EMAIL (HOW WE REACH YOU AFTER FADE OUT):
            </div>
            <input
              required
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="your@email.com"
              style={{
                width: "100%",
                padding: "6px 0",
                background: "none",
                border: "none",
                borderBottom: "1px solid #bbb",
                fontFamily: "Courier New, monospace",
                fontSize: 12,
                color: "#0a0a0a",
                outline: "none",
              }}
            />
          </div>

          {/* Scene direction */}
          <div style={{ fontSize: 11, color: "#555", fontStyle: "italic", lineHeight: 1.6 }}>
            Pratham reads the message, smiles, and picks up the phone. Cut to:
          </div>

          <button
            type="submit"
            style={{
              padding: "12px",
              background: "#0a0a0a",
              color: "#d4af77",
              border: "none",
              fontFamily: "var(--font-cinzel), serif",
              fontSize: 11,
              letterSpacing: "0.35em",
              fontWeight: 700,
              textTransform: "uppercase",
              cursor: "pointer",
              borderRadius: 2,
            }}
          >
            Send the Script
          </button>

          <div style={{ textAlign: "center", fontSize: 9, color: "#888", letterSpacing: "0.2em", marginTop: -8 }}>
            (SMASH CUT TO: COLLABORATION)
          </div>
        </form>
      )}
    </div>
  );
}
