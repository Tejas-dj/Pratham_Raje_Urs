"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import type { CursorVariant } from "@/types";

interface CursorContextValue {
  variant: CursorVariant;
  label: string;
  setCursor: (variant: CursorVariant, label?: string) => void;
  resetCursor: () => void;
}

export const CursorContext = createContext<CursorContextValue>({
  variant: "default",
  label: "",
  setCursor: () => {},
  resetCursor: () => {},
});

export function CursorProvider({ children }: { children: React.ReactNode }) {
  const [variant, setVariant] = useState<CursorVariant>("default");
  const [label, setLabel] = useState("");

  const setCursor = useCallback((v: CursorVariant, l = "") => {
    setVariant(v);
    setLabel(l);
  }, []);

  const resetCursor = useCallback(() => {
    setVariant("default");
    setLabel("");
  }, []);

  return (
    <CursorContext.Provider value={{ variant, label, setCursor, resetCursor }}>
      {children}
    </CursorContext.Provider>
  );
}

export function useCursorContext() {
  return useContext(CursorContext);
}
