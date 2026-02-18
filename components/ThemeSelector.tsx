"use client";

import { useState, useRef, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme, type ThemeName } from "@/lib/ThemeContext";

const THEME_OPTIONS: { label: string; value: ThemeName }[] = [
  { label: "AEGIS_DARK", value: "AEGIS_DARK" },
  { label: "LIGHT_MODE", value: "LIGHT_MODE" },
];

export default function ThemeSelector() {
  const { theme, setTheme, colors } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 rounded border ${colors.border} ${colors.textAccent} ${colors.glowSm} transition-all`}
      >
        {theme === "AEGIS_DARK" ? <Moon size={18} /> : <Sun size={18} />}
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-44 ${colors.card} border ${colors.border} rounded-lg shadow-lg z-50 overflow-hidden`}
        >
          {THEME_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => {
                setTheme(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-4 py-2.5 text-sm ${colors.cardHover} transition-colors ${
                theme === opt.value
                  ? colors.textAccent + " font-bold"
                  : colors.text
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
