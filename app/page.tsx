"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/lib/ThemeContext";
import { type Tema } from "@/lib/storage";
import Header from "@/components/Header";
import TemaCard from "@/components/TemaCard";
import EmptyState from "@/components/EmptyState";
import NuevoModuloModal from "@/components/NuevoModuloModal";

export default function Home() {
  const router = useRouter();
  const { colors } = useTheme();

  const [temas, setTemas] = useState<Tema[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  // Cargar temas del servidor
  useEffect(() => {
    const cargarTemas_async = async () => {
      try {
        const res = await fetch("/api/temas");
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        const data = await res.json();
        setTemas(data.temas || []);
      } catch {
        console.error("Error cargando temas");
      } finally {
        setLoading(false);
      }
    };
    cargarTemas_async();
  }, [router]);

  const handleCrear = async (titulo: string, descripcion: string) => {
    try {
      const res = await fetch("/api/temas/crear-eliminar", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ titulo, descripcion }),
      });
      const data = await res.json();
      if (data.tema) {
        setTemas([data.tema, ...temas]);
        setModalOpen(false);
      }
    } catch {
      console.error("Error creando tema");
    }
  };

  const handleEliminar = async (id: string) => {
    try {
      await fetch("/api/temas/crear-eliminar", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setTemas(temas.filter((t) => t.id !== id));
    } catch {
      console.error("Error eliminando tema");
    }
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
