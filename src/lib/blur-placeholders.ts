// Generates a tiny 1-colour SVG as a base64 data URL for next/image placeholder="blur".
// The CSS blur filter Next.js applies makes the exact size irrelevant — only the hue matters.
function colorSwatch(hex: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${hex}"/></svg>`;
  const b64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(svg).toString("base64")
      : btoa(svg);
  return `data:image/svg+xml;base64,${b64}`;
}

// Dark warm-brown — matches card/frame backgrounds
export const DEFAULT_BLUR = colorSwatch("#45302A");

// Dominant-colour estimate per known image path
const BLUR_MAP: Record<string, string> = {
  "/images/HeadShot_Pratham.jpeg":             colorSwatch("#6B4E3D"),
  "/images/image_tester_1.png":                colorSwatch("#45302A"),
  "/images/Sees_Kaddi_Landscape.jpg":          colorSwatch("#3D4A2E"),
  "/images/Talon_productions_logo.png":        colorSwatch("#111823"),
  "/images/She asked for Sunflowers.jpeg":     colorSwatch("#8B6B35"),
  "/images/The Christmas Guest.jpeg":          colorSwatch("#5C3020"),
  "/images/Before The Coffee Gets Cold.jpeg":  colorSwatch("#4A3525"),
  "/images/DOT..jpeg":                         colorSwatch("#1A1A2E"),
  "/images/sees_kaddi.png":                    colorSwatch("#2A3545"),
  "/images/V_motionblur.webp":                 colorSwatch("#6B5530"),
  "/images/Model_Team.webp":                   colorSwatch("#55443A"),
  "/images/still_christmas.png":               colorSwatch("#4A2018"),
  "/images/Two_women.webp":                    colorSwatch("#3A3545"),
  "/images/Beach_Couple.webp":                 colorSwatch("#7A6040"),
  "/images/still_dot.png":                     colorSwatch("#1A1828"),
  "/images/still_bts.webp":                    colorSwatch("#253040"),
  "/images/Beach_Scenic.webp":                 colorSwatch("#3A5040"),
  "/images/still_sees_kaddi.png":              colorSwatch("#2A2838"),
};

export function getBlurDataUrl(src: string): string {
  return BLUR_MAP[src] ?? DEFAULT_BLUR;
}
