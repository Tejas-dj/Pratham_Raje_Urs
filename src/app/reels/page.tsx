import type { Metadata } from "next";
import { ViewTransition } from "react";
import ReelsPage from "./reels-page";

export const metadata: Metadata = {
  title: "The Cutting Room | Pratham Raje Urs",
  description:
    "Short-form cinema by Pratham Raje Urs — mood edits, behind-the-scenes, wedding highlights, and experimental cuts.",
  openGraph: {
    title: "The Cutting Room | Pratham Raje Urs",
    description: "Quick cuts. Raw reels. The edit before the edit.",
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
      <ReelsPage />
    </ViewTransition>
  );
}
