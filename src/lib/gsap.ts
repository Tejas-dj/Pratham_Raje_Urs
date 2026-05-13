"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { Flip } from "gsap/Flip";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, SplitText, Flip, DrawSVGPlugin);
}

export { gsap, ScrollTrigger, SplitText, Flip };

export const EASE_CINEMATIC = "power3.out";
export const EASE_SPRING = "elastic.out(1, 0.5)";
export const EASE_BURN = "expo.inOut";
