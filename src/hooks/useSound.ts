"use client";

import { useContext } from "react";
import { SoundContext } from "@/providers/SoundProvider";

export function useSound() {
  return useContext(SoundContext);
}
