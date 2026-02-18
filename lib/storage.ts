// Tipos y helpers de persistencia para AEGIS_OS
// Local-first + Supabase sync con encriptación AES

import CryptoJS from "crypto-js";
import { supabase } from "./supabase";

export interface Tema {
  id: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  color: string;
  creadoEn: number;
  actualizadoEn: number;
}

const STORAGE_KEY = "aegis_temas";
const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "AEGIS_NEURAL_CORE_2025";

// ── Encriptación AES-256 ──
export function encriptarNota(texto: string): string {
  return CryptoJS.AES.encrypt(texto, ENCRYPTION_KEY).toString();
}

export function desencriptarNota(cifrado: string): string {
  const bytes = CryptoJS.AES.decrypt(cifrado, ENCRYPTION_KEY);
  return bytes.toString(CryptoJS.enc.Utf8);
}

// ── Sincronización real con Supabase ──
export async function sincronizarNube(id: string): Promise<boolean> {
  try {
    const tema = obtenerTema(id);
    if (!tema) return false;

    const payload = JSON.stringify({
      id: tema.id,
      titulo: tema.titulo,
      descripcion: tema.descripcion,
      contenido: tema.contenido,
      color: tema.color,
      creadoEn: tema.creadoEn,
      actualizadoEn: tema.actualizadoEn,
    });

    const encrypted = encriptarNota(payload);

    const { error } = await supabase.from("notas").upsert(
      {
        id: tema.id,
        titulo: tema.titulo,
        data_encrypted: encrypted,
        updated_at: new Date(tema.actualizadoEn).toISOString(),
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error("SYNC_ERROR:", error.message);
      return false;
    }

    // Marcar sync exitoso en localStorage
    localStorage.setItem(`aegis_sync_${id}`, String(Date.now()));
    return true;
  } catch (err) {
    console.error("SYNC_EXCEPTION:", err);
    return false;
  }
}

// ── Descargar desde Supabase y descifrar ──
export async function descargarDesdeNube(id: string): Promise<Tema | null> {
  try {
    const { data, error } = await supabase
      .from("notas")
      .select("data_encrypted")
      .eq("id", id)
      .single();

    if (error || !data?.data_encrypted) return null;

    const json = desencriptarNota(data.data_encrypted);
    return JSON.parse(json) as Tema;
  } catch {
    return null;
  }
}

// ── Descargar todos los temas desde Supabase ──
export async function descargarTodosDesdeNube(): Promise<Tema[]> {
  try {
    const { data, error } = await supabase
      .from("notas")
      .select("data_encrypted")
      .order("updated_at", { ascending: false });

    if (error || !data) return [];

    return data
      .map((row) => {
        try {
          const json = desencriptarNota(row.data_encrypted);
          return JSON.parse(json) as Tema;
        } catch {
          return null;
        }
      })
      .filter((t): t is Tema => t !== null);
  } catch {
    return [];
  }
}

// ── Eliminar de Supabase ──
export async function eliminarDeNube(id: string): Promise<boolean> {
  try {
    const { error } = await supabase.from("notas").delete().eq("id", id);
    return !error;
  } catch {
    return false;
  }
}

export function cargarTemas(): Tema[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function guardarTemas(temas: Tema[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(temas));
}

export function crearTema(titulo: string, descripcion: string): Tema {
  return {
    id: crypto.randomUUID(),
    titulo,
    descripcion,
    contenido: "",
    color: "cyan",
    creadoEn: Date.now(),
    actualizadoEn: Date.now(),
  };
}

export function obtenerTema(id: string): Tema | undefined {
  return cargarTemas().find((t) => t.id === id);
}

export function actualizarTema(id: string, cambios: Partial<Tema>): void {
  const temas = cargarTemas().map((t) =>
    t.id === id ? { ...t, ...cambios, actualizadoEn: Date.now() } : t
  );
  guardarTemas(temas);
}

export function eliminarTema(id: string): void {
  guardarTemas(cargarTemas().filter((t) => t.id !== id));
}
