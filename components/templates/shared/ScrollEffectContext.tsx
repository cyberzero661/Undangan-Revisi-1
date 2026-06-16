"use client";

import { createContext, useContext, type ReactNode } from "react";

export type ScrollEffectType = "modern" | "minimalist" | "rustic" | "traditional";

interface ScrollEffectContextValue {
  effectType: ScrollEffectType;
  primaryColor: string;
}

const ScrollEffectContext = createContext<ScrollEffectContextValue>({
  effectType: "modern",
  primaryColor: "#D4AF37",
});

export function ScrollEffectProvider({
  effectType,
  primaryColor,
  children,
}: {
  effectType: ScrollEffectType;
  primaryColor: string;
  children: ReactNode;
}) {
  return (
    <ScrollEffectContext.Provider value={{ effectType, primaryColor }}>
      {children}
    </ScrollEffectContext.Provider>
  );
}

export function useScrollEffect() {
  return useContext(ScrollEffectContext);
}
