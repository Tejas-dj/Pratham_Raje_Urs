"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Preloader from "@/components/preloader/Preloader";
import FilmStripNav from "@/components/navigation/FilmStripNav";
import MobileNavDrawer from "@/components/navigation/MobileNavDrawer";
import Hero from "@/components/hero/Hero";
import AboutSection from "@/components/about/AboutSection";
import JournalSection from "@/components/journal/JournalSection";
import ConnectSection from "@/components/connect/ConnectSection";
import PhotographySection from "@/components/photography/PhotographySection";
import { useIsMobile } from "@/hooks/useIsMobile";

// Heavy 3D sections deferred for performance
const TheVault = dynamic(() => import("@/components/vault/TheVault"), {
  ssr: false,
  loading: () => (
    <section
      id="vault"
      style={{
        minHeight: "100vh",
        background: "#080808",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          fontFamily: "var(--font-cinzel), serif",
          fontSize: 12,
          letterSpacing: "0.4em",
          color: "rgba(212,175,119,0.3)",
          textTransform: "uppercase",
          animation: "film-flicker 2s infinite alternate",
        }}
      >
        Loading The Vault…
      </div>
    </section>
  ),
});

const ServicesSection = dynamic(() => import("@/components/services/ServicesSection"), {
  ssr: false,
  loading: () => (
    <section
      id="services"
      style={{ minHeight: "100vh", background: "#060608" }}
    />
  ),
});

export default function HomePage() {
  const [preloaderDone, setPreloaderDone] = useState(false);
  const isMobile = useIsMobile();

  const handlePreloaderComplete = useCallback(() => {
    setPreloaderDone(true);
  }, []);

  return (
    <>
      {/* Preloader */}
      <Preloader onComplete={handlePreloaderComplete} />

      {/* Navigation — desktop strip vs mobile drawer */}
      {isMobile ? <MobileNavDrawer /> : <FilmStripNav />}

      {/* Main content */}
      <main>
        <Hero preloaderDone={preloaderDone} />
        <AboutSection />
        <TheVault />
        <ServicesSection />
        <PhotographySection />
        <JournalSection />
        <ConnectSection />
      </main>
    </>
  );
}
