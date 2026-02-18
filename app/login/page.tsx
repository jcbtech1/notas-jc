"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function LoginPage() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (username === "test" && password === "password") {
      localStorage.setItem("isLoggedIn", "true");
      router.push("/");
    } else {
      setError("ACCESO_DENEGADO: Credenciales inválidas");
    }
  };

  const inputColor = theme === "AEGIS_DARK" ? "#e5e5e5" : "#2c2c2c";

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.text} font-mono flex items-center justify-center p-4 transition-colors`}>
      <div className={`${colors.card} border ${colors.borderAccent} rounded-lg p-8 max-w-sm w-full glow-border scanline overflow-hidden relative`}>
        {/* Esquinas decorativas */}
        {["top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
          "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
          "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
          "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-6 h-6 ${cls}`} style={{ borderColor: colors.accent }} />
        ))}

        <div className="flex flex-col items-center mb-6">
          <Shield size={48} className={colors.textAccent} />
          <h1 className={`text-2xl font-bold ${colors.textAccent} mt-3`}>AEGIS_OS</h1>
          <p className={`text-xs ${colors.textMuted}`}>AUTH_GATEWAY // V3.0.0</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className={`block text-xs ${colors.textMuted} mb-1 uppercase tracking-wider`}>
              Operator_ID
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full ${colors.inputBg} border ${colors.inputBorder} rounded px-3 py-2 text-sm font-mono focus:outline-none transition-colors`}
              style={{ color: inputColor }}
              placeholder="username"
              autoFocus
            />
          </div>

          <div>
            <label className={`block text-xs ${colors.textMuted} mb-1 uppercase tracking-wider`}>
              Access_Key
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full ${colors.inputBg} border ${colors.inputBorder} rounded px-3 py-2 text-sm font-mono focus:outline-none transition-colors`}
              style={{ color: inputColor }}
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold tracking-wider">{error}</p>
          )}

          <button
            type="submit"
            className="w-full py-2.5 rounded font-bold text-sm uppercase tracking-wider transition-all"
            style={{
              backgroundColor: colors.accent,
              color: theme === "AEGIS_DARK" ? "#000" : "#fff",
            }}
          >
            AUTHENTICATE
          </button>
        </form>
      </div>
    </div>
  );
}
