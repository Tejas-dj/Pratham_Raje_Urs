"use client";

import { useContext } from "react";
import { LenisContext } from "@/providers/LenisProvider";

export function useLenis() {
  return useContext(LenisContext);
}
