"use client";

import React, { useState, useCallback } from "react";
import dynamic from "next/dynamic";
import Preloader from "@/components/preloader/Preloader";
import FilmStripNav from "@/components/navigation/FilmStripNav";
import MobileNavDrawer from "@/components/navigation/MobileNavDrawer";
import Hero from "@/components/hero/Hero";
import FilmMarquee from "@/components/hero/FilmMarquee";
import AboutSection from "@/components/about/AboutSection";
import ConnectSection from "@/components/connect/ConnectSection";
import { useIsMobile } from "@/hooks/useIsMobile";

const TheVault = dynamic(() => import("@/components/vault/TheVault"), {
  ssr: false,
  loading: () => (
    <section
      id="vault"
      style={{
        minHeight: "100vh",
        background: "#111823",
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
          color: "rgba(170,146,115,0.3)",
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
      style={{ minHeight: "100vh", background: "#111823" }}
    />
  ),
});

const PhotographyTeaser = dynamic(() => import("@/components/photography/PhotographyTeaser"), {
  ssr: false,
  loading: () => (
    <section
      id="photography"
      style={{
        minHeight: "60vh",
        background: "#111823",
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
          color: "rgba(170,146,115,0.3)",
          textTransform: "uppercase",
          animation: "film-flicker 2s infinite alternate",
        }}
      >
        Developing stills…
      </div>
    </section>
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
      {/* Preload the hero showreel so the browser fetches it before React boots.
          Scoped to the home page only — other routes shouldn't pay this cost. */}
      <link
        rel="preload"
        href="/videos/website showreel_compressed.webm"
        as="video"
        type="video/webm"
      />
      <Preloader onComplete={handlePreloaderComplete} />
      {isMobile ? <MobileNavDrawer /> : <FilmStripNav />}

      <main>
        <Hero preloaderDone={preloaderDone} />
        <FilmMarquee />
        <TheVault />
        <PhotographyTeaser />
        <AboutSection />
        <ServicesSection />
        <ConnectSection />
      </main>
    </>
  );
}
