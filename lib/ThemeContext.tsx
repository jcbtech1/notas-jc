"use client";

import { createContext, useContext, useEffect, useState } from "react";

export type ThemeName = "AEGIS_DARK" | "LIGHT_MODE";

interface ThemeContextValue {
  theme: ThemeName;
  setTheme: (t: ThemeName) => void;
  colors: ThemeColors;
}

interface ThemeColors {
  bg: string;
  bgHex: string;
  card: string;
  cardHex: string;
  cardHover: string;
  border: string;
  borderAccent: string;
  text: string;
  textMuted: string;
  textAccent: string;
  accent: string;
  glow: string;
  glowSm: string;
  inputBg: string;
  inputBorder: string;
  modalBg: string;
}

const THEMES: Record<ThemeName, ThemeColors> = {
  AEGIS_DARK: {
    bg: "bg-[#0a0a0a]",
    bgHex: "#0a0a0a",
    card: "bg-[#101418]",
    cardHex: "#101418",
    cardHover: "hover:bg-[#1a1e24]",
    border: "border-gray-700",
    borderAccent: "border-cyan-400",
    text: "text-gray-300",
    textMuted: "text-gray-500",
    textAccent: "text-cyan-400",
    accent: "#00ffff",
    glow: "hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]",
    glowSm: "hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]",
    inputBg: "bg-[#0a0a0a]",
    inputBorder: "border-gray-600",
    modalBg: "bg-[#0d1117]",
  },
  LIGHT_MODE: {
    bg: "bg-[#e8e6e1]",
    bgHex: "#e8e6e1",
    card: "bg-[#f5f3ef]",
    cardHex: "#f5f3ef",
    cardHover: "hover:bg-[#ddd9d0]",
    border: "border-[#c2bdb3]",
    borderAccent: "border-[#4a6741]",
    text: "text-[#2c2c2c]",
    textMuted: "text-[#6b6b6b]",
    textAccent: "text-[#4a6741]",
    accent: "#4a6741",
    glow: "hover:shadow-[0_0_15px_rgba(74,103,65,0.3)]",
    glowSm: "hover:shadow-[0_0_10px_rgba(74,103,65,0.3)]",
    inputBg: "bg-white",
    inputBorder: "border-[#c2bdb3]",
    modalBg: "bg-[#f0ede8]",
  },
} as const;

const ThemeContext = createContext<ThemeContextValue>({
  theme: "AEGIS_DARK",
  setTheme: () => {},
  colors: THEMES.AEGIS_DARK,
} as ThemeContextValue);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeName>("AEGIS_DARK");

  useEffect(() => {
    const saved = localStorage.getItem("aegis_theme") as ThemeName | null;
    if (saved && THEMES[saved]) setThemeState(saved);
  }, []);

  const setTheme = (t: ThemeName) => {
    setThemeState(t);
    localStorage.setItem("aegis_theme", t);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, colors: THEMES[theme] }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
