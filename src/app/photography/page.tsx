import type { Metadata } from "next";
import { ViewTransition } from "react";
import PhotographyPage from "./photography-page";

export const metadata: Metadata = {
  title: "The Contact Sheet | Pratham Raje Urs",
  description:
    "Photography by Pratham Raje Urs — film stills, portraits, behind-the-scenes, and street photography from Mysuru to Bengaluru.",
  openGraph: {
    title: "The Contact Sheet | Pratham Raje Urs",
    description: "Between the frames. Before the edit. The raw, uncut moments.",
    siteName: "Infinite Frames",
    type: "website",
  },
};

export default function Page() {
  return (
    <ViewTransition
      enter={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      exit={{ "nav-forward": "nav-forward", "nav-back": "nav-back", default: "none" }}
      default="none"
    >
      <PhotographyPage />
    </ViewTransition>
  );
}
