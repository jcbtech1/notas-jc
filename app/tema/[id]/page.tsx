"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Pencil, Eye, Save, AlertTriangle } from "lucide-react";
import { useTheme } from "@/lib/ThemeContext";
import { type Tema } from "@/lib/storage";
import ThemeSelector from "@/components/ThemeSelector";
import TiptapEditor from "@/components/editor/TiptapEditor";

const DRAFT_PREFIX = "aegis_draft_";
const AUTO_SAVE_INTERVAL = 5000;

export default function TemaDetalle() {
  const params = useParams();
  const router = useRouter();
  const { colors } = useTheme();

  const [tema, setTema] = useState<Tema | null>(null);
  const [editando, setEditando] = useState(false);
  const [contenido, setContenido] = useState("");
  const [guardado, setGuardado] = useState(true);
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState("");
  const [showUnsavedWarning, setShowUnsavedWarning] = useState(false);

  const contenidoRef = useRef(contenido);
  const guardadoRef = useRef(true);
  const id = params.id as string;

  // ── Load tema + recover draft ──
  useEffect(() => {
    const cargarTema_async = async () => {
      try {
        const res = await fetch(`/api/tema/${id}`);
        if (res.status === 401) {
          router.push("/login");
          return;
        }
        if (res.status === 404) {
          router.push("/");
          return;
        }
        const data = await res.json();
        const t = data.tema as Tema;

        // Check for emergency draft
        const draft = localStorage.getItem(DRAFT_PREFIX + id);
        if (draft && draft !== t.contenido) {
          setContenido(draft);
          setGuardado(false);
          guardadoRef.current = false;
        } else {
          setContenido(t.contenido);
        }
        setTema(t);
      } catch {
        router.push("/");
      }
    };
    cargarTema_async();
  }, [id, router]);

  // ── Auto-save emergency draft every 5s ──
  useEffect(() => {
    const interval = setInterval(() => {
      if (!guardadoRef.current && tema) {
        localStorage.setItem(DRAFT_PREFIX + id, contenidoRef.current);
        // Guardar en servidor
        fetch(`/api/tema/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ contenido: contenidoRef.current }),
        }).catch(() => {});
        setTema((prev) =>
          prev ? { ...prev, contenido: contenidoRef.current, actualizadoEn: Date.now() } : prev
        );
        setGuardado(true);
        guardadoRef.current = true;
      }
    }, AUTO_SAVE_INTERVAL);

    return () => clearInterval(interval);
  }, [id, tema]);

  // ── Warn on page close if unsaved ──
  useEffect(() => {
    const handler = (e: BeforeUnloadEvent) => {
      if (!guardadoRef.current) {
        localStorage.setItem(DRAFT_PREFIX + id, contenidoRef.current);
        e.preventDefault();
      }
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [id]);

  const handleContentChange = useCallback((html: string) => {
    setContenido(html);
    contenidoRef.current = html;
    setGuardado(false);
    guardadoRef.current = false;
  }, []);

  const handleVolver = () => {
    if (!guardadoRef.current) {
      setShowUnsavedWarning(true);
      return;
    }
    localStorage.removeItem(DRAFT_PREFIX + id);
    router.push("/");
  };

  const handleForceSaveAndLeave = async () => {
    await fetch(`/api/tema/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contenido: contenidoRef.current }),
    });
    localStorage.removeItem(DRAFT_PREFIX + id);
    router.push("/");
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg("");
    try {
      // Guardar contenido primero
      await fetch(`/api/tema/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contenido: contenidoRef.current }),
      });
      localStorage.removeItem(DRAFT_PREFIX + id);
      setGuardado(true);
      guardadoRef.current = true;

      // Sincronizar con encriptación
      const res = await fetch(`/api/tema/${id}`, {
        method: "POST",
      });
      const data = await res.json();
      setSyncMsg(data.ok ? "SYNC_OK: Datos encriptados y listos" : "SYNC_FAIL");
    } catch {
      setSyncMsg("ERROR: Fallo en sincronización");
    } finally {
      setSyncing(false);
      setTimeout(() => setSyncMsg(""), 4000);
    }
  };

  if (!tema) return null;

  return (
    <div className={`min-h-screen ${colors.bg} ${colors.text} font-mono p-4 sm:p-8 transition-colors duration-300`}>
      {/* ── HEADER ── */}
      <header className="flex flex-wrap justify-between items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={handleVolver}
            className={`p-2 rounded border ${colors.border} ${colors.textAccent} ${colors.glowSm} transition-all`}
            title="VOLVER_AL_PANEL"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className={`text-lg sm:text-xl font-bold ${colors.textAccent} uppercase`}>
              {tema.titulo}
            </h1>
            <p className={`text-xs ${colors.textMuted}`}>
              {tema.descripcion || "SIN_DESCRIPCION"} //{" "}
              {new Date(tema.actualizadoEn).toLocaleString("es-ES")}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5">
            <div
              className={`w-2 h-2 rounded-full ${
                guardado ? "bg-green-500" : "bg-yellow-400 animate-pulse"
              }`}
            />
            <span className={`text-[10px] ${colors.textMuted} hidden sm:inline`}>
              {guardado ? "SAVED" : "UNSAVED"}
            </span>
          </div>

          <button
            onClick={handleSync}
            disabled={syncing}
            className={`flex items-center gap-2 px-3 py-2 rounded border text-xs transition-all ${
              syncing
                ? "border-yellow-500 text-yellow-400 opacity-60"
                : "border-cyan-500 text-cyan-400 hover:shadow-[0_0_10px_rgba(0,255,255,0.3)]"
            }`}
          >
            <Save size={14} className={syncing ? "animate-spin" : ""} />
            <span className="hidden sm:inline">
              {syncing ? "SYNCING..." : "SINCRONIZAR_NÚCLEO"}
            </span>
          </button>

          <button
            onClick={() => setEditando(!editando)}
            className={`flex items-center gap-2 px-3 py-2 rounded border text-sm transition-all ${
              editando
                ? "border-green-500 text-green-500 hover:shadow-[0_0_10px_rgba(0,255,0,0.3)]"
                : `${colors.borderAccent} ${colors.textAccent} ${colors.glowSm}`
            }`}
          >
            {editando ? <Eye size={16} /> : <Pencil size={16} />}
            <span className="hidden sm:inline">
              {editando ? "LECTURA" : "EDITAR"}
            </span>
          </button>

          <ThemeSelector />
        </div>
      </header>

      {syncMsg && (
        <div
          className={`mb-4 px-4 py-2 rounded text-xs font-mono border ${
            syncMsg.includes("OK")
              ? "border-green-500/30 text-green-400 bg-green-500/5"
              : "border-red-500/30 text-red-400 bg-red-500/5"
          }`}
        >
          {syncMsg}
        </div>
      )}

      {/* ── EDITOR ── */}
      <main>
        {editando && (
          <div className="flex items-center justify-between mb-2 px-1">
            <p className={`text-xs ${colors.textMuted} uppercase tracking-wider`}>
              MODO_EDICION — auto-guardado cada {AUTO_SAVE_INTERVAL / 1000}s
            </p>
          </div>
        )}
        <TiptapEditor contenido={contenido} onChange={handleContentChange} editable={editando} />
      </main>

      <footer className={`text-center text-xs ${colors.textMuted} mt-6`}>
        MODULE_ID: {tema.id.slice(0, 8)}... | LAST_SYNC:{" "}
        {new Date(tema.actualizadoEn).toLocaleTimeString("es-ES")}
      </footer>

      {/* ── UNSAVED WARNING ── */}
      {showUnsavedWarning && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className={`w-full max-w-sm ${colors.modalBg} border border-red-500 rounded-lg p-6`}>
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle size={24} className="text-red-500" />
              <h3 className="text-red-500 font-bold">DATOS_NO_GUARDADOS</h3>
            </div>
            <p className={`text-sm ${colors.textMuted} mb-6`}>
              Hay cambios sin guardar. ¿Deseas guardar antes de salir?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleForceSaveAndLeave}
                className="flex-1 py-2 rounded bg-cyan-500 text-black font-bold text-sm hover:bg-cyan-400 transition-colors"
              >
                GUARDAR_Y_SALIR
              </button>
              <button
                onClick={() => {
                  localStorage.removeItem(DRAFT_PREFIX + id);
                  router.push("/");
                }}
                className="flex-1 py-2 rounded border border-red-500 text-red-500 font-bold text-sm hover:bg-red-500/10 transition-colors"
              >
                DESCARTAR
              </button>
              <button
                onClick={() => setShowUnsavedWarning(false)}
                className={`flex-1 py-2 rounded border ${colors.border} ${colors.textMuted} font-bold text-sm transition-colors`}
              >
                CANCELAR
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
