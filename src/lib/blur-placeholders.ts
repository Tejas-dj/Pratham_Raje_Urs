import { cloudinaryImage } from "./cloudinary";

function colorSwatch(hex: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="8" height="8"><rect width="8" height="8" fill="${hex}"/></svg>`;
  const b64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(svg).toString("base64")
      : btoa(svg);
  return `data:image/svg+xml;base64,${b64}`;
}

export const DEFAULT_BLUR = colorSwatch("#45302A");

const BLUR_MAP: Record<string, string> = {
  "/images/HeadShot_Pratham.jpeg": colorSwatch("#6B4E3D"),
  [cloudinaryImage("She_asked_for_Sunflowers_u8xqju")]: colorSwatch("#8B6914"),
  [cloudinaryImage("The_Christmas_Guest_aqgt7x")]: colorSwatch("#5C3A2E"),
  [cloudinaryImage("Before_The_Coffee_Gets_Cold_y60aty")]: colorSwatch("#3D2B1F"),
  [cloudinaryImage("DOT._tmlaig")]: colorSwatch("#2A2A2A"),
  [cloudinaryImage("sees_kaddi_dp52bc")]: colorSwatch("#4A3728"),
  [cloudinaryImage("Sees_Kaddi_Landscape_f2y5dm")]: colorSwatch("#3E4A3D"),
  [cloudinaryImage("final-1_tuohjh")]: colorSwatch("#2E2218"),
  [cloudinaryImage("DSC01296_rg69c2")]: colorSwatch("#4B5E3C"),
  [cloudinaryImage("DSC01336_ae95n6")]: colorSwatch("#3A4D2E"),
  [cloudinaryImage("DSC01177_p6nv4s")]: colorSwatch("#5A4832"),
  [cloudinaryImage("DSC01047_twths2")]: colorSwatch("#4D6B3A"),
  [cloudinaryImage("DSC01322_ztuwfa")]: colorSwatch("#3B4F2C"),
  [cloudinaryImage("DSC01182_w1mmvq")]: colorSwatch("#4A5D3E"),
  [cloudinaryImage("BEACH_1-11_bdyywp")]: colorSwatch("#6B8A5E"),
  [cloudinaryImage("BEACH_1-03_mc0nra")]: colorSwatch("#5E7A52"),
  [cloudinaryImage("BEACH_1-01_qhvnl0")]: colorSwatch("#7A9068"),
};

export function getBlurDataUrl(src: string): string {
  return BLUR_MAP[src] ?? DEFAULT_BLUR;
}
