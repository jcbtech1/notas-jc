"use client";

import { Plus } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";

interface Props {
  onAbrir: () => void;
}

export default function EmptyState({ onAbrir }: Props) {
  const { colors } = useTheme();

  return (
    <div className="flex flex-col items-center justify-center py-32 gap-4">
      <div className={`text-6xl ${colors.textMuted} opacity-30`}>⬡</div>
      <p className={`text-lg ${colors.textMuted} tracking-widest`}>
        SISTEMA_VACIO: ESPERANDO_DATOS
      </p>
      <button
        onClick={onAbrir}
        className={`mt-4 flex items-center gap-2 px-5 py-2.5 rounded border ${colors.borderAccent} ${colors.textAccent} ${colors.glow} transition-all`}
      >
        <Plus size={18} />
        INICIAR_MODULO
      </button>
    </div>
  );
}
