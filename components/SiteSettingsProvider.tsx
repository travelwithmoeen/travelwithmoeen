"use client";

import { createContext, useContext } from "react";
import type { SiteSettings } from "@/lib/content";

const SiteSettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({
  value,
  children,
}: {
  value: SiteSettings;
  children: React.ReactNode;
}) {
  return <SiteSettingsContext.Provider value={value}>{children}</SiteSettingsContext.Provider>;
}

export function useSiteSettings() {
  const value = useContext(SiteSettingsContext);
  if (!value) {
    throw new Error("Site settings are not loaded.");
  }
  return value;
}
