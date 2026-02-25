"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Shield } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

export default function RegisterPage() {
  const router = useRouter();
  const { theme, colors } = useTheme();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden");
      return;
    }

    if (password.length < 6) {
      setError("Contraseña mínimo 6 caracteres");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, email }),
      });
      const data = await res.json();
      if (data.ok) {
        router.push("/login?msg=Usuario creado exitosamente");
      } else {
        setError(data.error || "Error al registrar");
      }
    } catch {
      setError("ERROR_CONEXION: No se pudo contactar al servidor");
    } finally {
      setLoading(false);
    }
  };

  const inputColor = theme === "AEGIS_DARK" ? "#e5e5e5" : "#2c2c2c";

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.text} font-mono flex items-center justify-center p-4 transition-colors`}>
      <div className={`${colors.card} border ${colors.borderAccent} rounded-lg p-8 max-w-sm w-full glow-border scanline overflow-hidden relative`}>
        {["top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
          "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
          "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
          "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
        ].map((cls, i) => (
          <div key={i} className={`absolute w-6 h-6 ${cls}`} style={{ borderColor: colors.accent }} />
        ))}

        <div className="flex flex-col items-center mb-6">
          <Shield size={48} className={colors.textAccent} />
          <h1 className={`text-xl font-bold ${colors.textAccent} mt-3`}>REGISTRO</h1>
          <p className={`text-xs ${colors.textMuted}`}>Crear nueva cuenta</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div>
            <label className={`block text-xs ${colors.textMuted} mb-1 uppercase`}>
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className={`w-full ${colors.inputBg} border ${colors.inputBorder} rounded px-3 py-2 text-sm font-mono focus:outline-none`}
              style={{ color: inputColor }}
              autoFocus
              required
            />
          </div>

          <div>
            <label className={`block text-xs ${colors.textMuted} mb-1 uppercase`}>
              Email (opcional)
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full ${colors.inputBg} border ${colors.inputBorder} rounded px-3 py-2 text-sm font-mono focus:outline-none`}
              style={{ color: inputColor }}
            />
          </div>

          <div>
            <label className={`block text-xs ${colors.textMuted} mb-1 uppercase`}>
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={`w-full ${colors.inputBg} border ${colors.inputBorder} rounded px-3 py-2 text-sm font-mono focus:outline-none`}
              style={{ color: inputColor }}
              required
            />
          </div>

          <div>
            <label className={`block text-xs ${colors.textMuted} mb-1 uppercase`}>
              Confirmar Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className={`w-full ${colors.inputBg} border ${colors.inputBorder} rounded px-3 py-2 text-sm font-mono focus:outline-none`}
              style={{ color: inputColor }}
              required
            />
          </div>

          {error && (
            <p className="text-red-500 text-xs font-bold">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 rounded font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-50"
            style={{
              backgroundColor: colors.accent,
              color: theme === "AEGIS_DARK" ? "#000" : "#fff",
            }}
          >
            {loading ? "CREANDO..." : "REGISTRARSE"}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={() => router.push("/login")}
              className={`text-xs ${colors.textAccent} hover:underline`}
            >
              ¿Ya tienes cuenta? Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
