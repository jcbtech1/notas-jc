"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

interface Props {
  onClose: () => void;
  onCrear: (titulo: string, descripcion: string) => void;
}

export default function NuevoModuloModal({ onClose, onCrear }: Props) {
  const { theme, colors } = useTheme();
  const [titulo, setTitulo] = useState("");
  const [desc, setDesc] = useState("");

  const handleSubmit = () => {
    if (!titulo.trim()) return;
    onCrear(titulo.trim(), desc.trim());
  };

  const inputColor = theme === "AEGIS_DARK" ? "#e5e5e5" : "#2c2c2c";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div
        className={`relative w-full max-w-md ${colors.modalBg} border ${colors.borderAccent} rounded-lg p-6 glow-border scanline overflow-hidden`}
      >
        {/* Decoración esquinas */}
        {["top-0 left-0 border-t-2 border-l-2 rounded-tl-lg",
          "top-0 right-0 border-t-2 border-r-2 rounded-tr-lg",
          "bottom-0 left-0 border-b-2 border-l-2 rounded-bl-lg",
          "bottom-0 right-0 border-b-2 border-r-2 rounded-br-lg",
        ].map((cls, i) => (
          <div
            key={i}
            className={`absolute w-8 h-8 ${cls}`}
            style={{ borderColor: colors.accent }}
          />
        ))}

        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500 transition-colors z-10"
        >
          <X size={20} />
        </button>

        <h2 className={`text-lg font-bold ${colors.textAccent} mb-1`}>
          NUEVO_MODULO
        </h2>
        <p className={`text-xs ${colors.textMuted} mb-6`}>
          REGISTRO_DE_DATOS // CLASIFICADO
        </p>

        <div className="space-y-4">
          <div>
            <label className={`block text-xs ${colors.textMuted} mb-1 uppercase tracking-wider`}>
              Titulo_ID
            </label>
            <input
              type="text"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ej: MISSION_ALPHA"
              className={`w-full ${colors.inputBg} border ${colors.inputBorder} rounded px-3 py-2 text-sm font-mono focus:outline-none transition-colors`}
              style={{ color: inputColor }}
              autoFocus
              onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            />
          </div>

          <div>
            <label className={`block text-xs ${colors.textMuted} mb-1 uppercase tracking-wider`}>
              Descripcion_Brief
            </label>
            <textarea
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              placeholder="Descripción del módulo..."
              rows={3}
              className={`w-full ${colors.inputBg} border ${colors.inputBorder} rounded px-3 py-2 text-sm font-mono focus:outline-none resize-none transition-colors`}
              style={{ color: inputColor }}
            />
          </div>

          <button
            onClick={handleSubmit}
            disabled={!titulo.trim()}
            className="w-full py-2.5 rounded font-bold text-sm uppercase tracking-wider transition-all disabled:opacity-30 disabled:cursor-not-allowed"
            style={{
              backgroundColor: colors.accent,
              color: theme === "AEGIS_DARK" ? "#000" : "#fff",
            }}
          >
            DEPLOY_MODULO
          </button>
        </div>
      </div>
    </div>
  );
}
