"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";
import { cargarTemas, guardarTemas, crearTema, eliminarTema, type Tema } from "@/lib/storage";
import Header from "@/components/Header";
import TemaCard from "@/components/TemaCard";
import EmptyState from "@/components/EmptyState";
import NuevoModuloModal from "@/components/NuevoModuloModal";

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();

  const [temas, setTemas] = useState<Tema[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") !== "true") {
      router.push("/login");
      return;
    }
    setTemas(cargarTemas());
  }, [router]);

  const handleCrear = (titulo: string, descripcion: string) => {
    const nuevo = crearTema(titulo, descripcion);
    const actualizado = [...temas, nuevo];
    guardarTemas(actualizado);
    setTemas(actualizado);
    setModalOpen(false);
  };

  const handleEliminar = (id: string) => {
    eliminarTema(id);
    setTemas(cargarTemas());
  };

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.text} font-mono p-4 sm:p-8 transition-colors duration-300`}>
      <Header onNuevoModulo={() => setModalOpen(true)} />

      <main>
        {temas.length === 0 ? (
          <EmptyState onAbrir={() => setModalOpen(true)} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {temas.map((tema) => (
              <TemaCard key={tema.id} tema={tema} onEliminar={handleEliminar} />
            ))}
          </div>
        )}
      </main>

      <footer className={`text-center text-xs ${colors.textMuted} mt-8`}>
        SYSTEM_UPTIME: 342:55:12:09 | NODE_STABILITY: 99.9% | MODULES: {temas.length}
      </footer>

      {modalOpen && (
        <NuevoModuloModal
          onClose={() => setModalOpen(false)}
          onCrear={handleCrear}
        />
      )}
    </div>
  );
}
