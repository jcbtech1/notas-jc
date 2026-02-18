"use client";

import { Plus } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import ThemeSelector from "./ThemeSelector";
import UserMenu from "./UserMenu";

interface Props {
  onNuevoModulo: () => void;
}

export default function Header({ onNuevoModulo }: Props) {
  const { colors } = useTheme();

  return (
    <header className="flex flex-wrap justify-between items-center gap-4 mb-8">
      <div>
        <h1 className={`text-xl sm:text-2xl font-bold ${colors.textAccent}`}>
          AEGIS_OS: PRINCIPAL
        </h1>
        <p className={`text-xs sm:text-sm ${colors.textMuted}`}>
          COMMAND_CENTRAL // V3.0.0
        </p>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onNuevoModulo}
          className={`flex items-center gap-2 px-3 py-2 rounded border ${colors.borderAccent} ${colors.textAccent} text-sm ${colors.glow} transition-all`}
        >
          <Plus size={16} />
          <span className="hidden sm:inline">NUEVO_MODULO</span>
        </button>

        <ThemeSelector />
        <UserMenu />
      </div>
    </header>
  );
}
