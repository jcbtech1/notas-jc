"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Cpu, LogOut, UserCircle } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function UserMenu() {
  const router = useRouter();
  const { colors } = useTheme();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handler(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    router.push("/login");
  };

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className={`p-2 rounded-full border ${colors.border} ${colors.glowSm} transition-all`}
      >
        <UserCircle size={28} className={colors.textAccent} />
      </button>

      {open && (
        <div
          className={`absolute right-0 mt-2 w-56 ${colors.card} border ${colors.border} rounded-lg shadow-lg z-50 overflow-hidden`}
        >
          <button
            onClick={() => setOpen(false)}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm ${colors.textAccent} ${colors.cardHover} transition-colors`}
          >
            <Cpu size={18} />
            <div className="text-left">
              <p className="font-semibold">AEGIS_IA</p>
              <p className={`text-xs ${colors.textMuted}`}>NEURAL_CORE</p>
            </div>
          </button>
          <div className={`border-t ${colors.border}`} />
          <button
            onClick={handleLogout}
            className={`w-full flex items-center gap-3 px-4 py-3 text-sm text-red-500 ${colors.cardHover} transition-colors`}
          >
            <LogOut size={18} />
            <span className="font-semibold">LOGOUT</span>
          </button>
        </div>
      )}
    </div>
  );
}
