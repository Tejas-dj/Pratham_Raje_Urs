import type { Metadata, Viewport } from "next";
import "./globals.css";
import { cinzel, inter } from "./fonts";
import { LenisProvider } from "@/providers/LenisProvider";
import { SoundProvider } from "@/providers/SoundProvider";
import { CursorProvider } from "@/providers/CursorProvider";
import CustomCursor from "@/components/shared/CustomCursor";
import FilmGrainOverlay from "@/components/shared/FilmGrainOverlay";
import ScrollProgress from "@/components/shared/ScrollProgress";
import SoundToggle from "@/components/shared/SoundToggle";

export const metadata: Metadata = {
  metadataBase: new URL("https://prathamrajeurs.com"),
  title: "Pratham Raje Urs — Infinite Frames",
  description:
    "Pratham Raje Urs is a 19-year-old filmmaker, cinematographer, and founder of Talon Production House, Bengaluru. Chasing feelings. Framing Kannada stories. LV Prasad alumnus. Dada Saheb Phalke Festival selected.",
  keywords: [
    "Pratham Raje Urs",
    "filmmaker",
    "cinematographer",
    "Kannada films",
    "Mysuru",
    "Bengaluru",
    "Talon Production House",
    "wedding cinematography",
    "She Asked for Sunflowers",
    "The Christmas Guest",
    "Dada Saheb Phalke",
    "LV Prasad",
    "portfolio",
  ],
  authors: [{ name: "Pratham Raje Urs" }],
  creator: "Pratham Raje Urs",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: "https://prathamrajeurs.com",
    title: "Pratham Raje Urs — Infinite Frames",
    description: "Chasing Feelings. Framing Kannada Stories. From Mysuru Sunflowers to Bengaluru Golden Hours.",
    siteName: "Infinite Frames",
    images: [
      {
        url: "/images/image_tester_1.png",
        width: 1200,
        height: 630,
        alt: "Pratham Raje Urs — Infinite Frames",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pratham Raje Urs — Infinite Frames",
    description: "Chasing Feelings. Framing Kannada Stories.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${cinzel.variable} ${inter.variable}`}
      style={{ background: "#0a0a0a" }}
    >
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </head>
      <body>
        <CursorProvider>
          <SoundProvider>
            <LenisProvider>
              {/* Global overlays */}
              <FilmGrainOverlay />
              <CustomCursor />
              <ScrollProgress />
              <SoundToggle />

              {/* Page content */}
              {children}
            </LenisProvider>
          </SoundProvider>
        </CursorProvider>
      </body>
    </html>
  );
}
