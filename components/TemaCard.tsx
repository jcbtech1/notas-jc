"use client";

import { FileText, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";
import type { Tema } from "@/lib/storage";

interface Props {
  tema: Tema;
  onEliminar: (id: string) => void;
}

export default function TemaCard({ tema, onEliminar }: Props) {
  const router = useRouter();
  const { colors } = useTheme();

  return (
    <div
      onClick={() => router.push(`/tema/${tema.id}`)}
      className={`group relative cursor-pointer ${colors.card} border ${colors.border} rounded-lg p-5 flex flex-col items-center justify-center text-center transition-all duration-300 ${colors.glow}`}
    >
      <button
        onClick={(e) => {
          e.stopPropagation();
          onEliminar(tema.id);
        }}
        className="absolute top-2 right-2 p-1 rounded opacity-0 group-hover:opacity-100 text-red-500 hover:bg-red-500/10 transition-all"
      >
        <Trash2 size={14} />
      </button>

      <div className="mb-3">
        <FileText size={40} className={colors.textAccent} />
      </div>
      <h3 className={`text-sm font-bold ${colors.textAccent} uppercase tracking-wider`}>
        {tema.titulo}
      </h3>
      <p className={`text-xs ${colors.textMuted} mt-1 line-clamp-2`}>
        {tema.descripcion || "SIN_DESCRIPCION"}
      </p>
      <p className={`text-[10px] ${colors.textMuted} mt-2`}>
        {new Date(tema.actualizadoEn).toLocaleDateString("es-ES")}
      </p>
    </div>
  );
}
