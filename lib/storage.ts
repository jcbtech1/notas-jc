// Tipos y helpers de persistencia para AEGIS_OS
// Supabase + encriptación AES + multi-usuario

import CryptoJS from "crypto-js";
import { supabaseAdmin } from "./supabase-admin";

export interface Tema {
  id: string;
  user_id: string;
  titulo: string;
  descripcion: string;
  contenido: string;
  color: string;
  creadoEn: number;
  actualizadoEn: number;
}

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

// ── CRUD en Supabase (multi-usuario) ──

export async function cargarTemas(userId: string): Promise<Tema[]> {
  try {
    const { data, error } = await supabaseAdmin
      .from("notas")
      .select("*")
      .eq("user_id", userId)
      .order("actualizadoEn", { ascending: false });

    if (error) {
      console.error("CARGAR_TEMAS_ERROR:", error);
      return [];
    }
    return data || [];
  } catch {
    return [];
  }
}

export async function obtenerTema(
  userId: string,
  id: string
): Promise<Tema | null> {
  try {
    const { data, error } = await supabaseAdmin
      .from("notas")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single();

    if (error) return null;
    return data;
  } catch {
    return null;
  }
}

export async function crearTema(
  userId: string,
  titulo: string,
  descripcion: string
): Promise<Tema | null> {
  try {
    const ahora = Date.now();
    const { data, error } = await supabaseAdmin
      .from("notas")
      .insert([
        {
          id: crypto.randomUUID(),
          user_id: userId,
          titulo,
          descripcion,
          contenido: "",
          color: "cyan",
          creadoEn: ahora,
          actualizadoEn: ahora,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error("CREAR_TEMA_ERROR:", error);
      return null;
    }
    return data;
  } catch {
    return null;
  }
}

export async function actualizarTema(
  userId: string,
  id: string,
  cambios: Partial<Tema>
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("notas")
      .update({ ...cambios, actualizadoEn: Date.now() })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("ACTUALIZAR_TEMA_ERROR:", error);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export async function eliminarTema(
  userId: string,
  id: string
): Promise<boolean> {
  try {
    const { error } = await supabaseAdmin
      .from("notas")
      .delete()
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("ELIMINAR_TEMA_ERROR:", error);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

// ── Sincronización + Encriptación ──
export async function sincronizarNube(
  userId: string,
  id: string
): Promise<boolean> {
  try {
    const tema = await obtenerTema(userId, id);
    if (!tema) return false;

    const payload = JSON.stringify({
      id: tema.id,
      titulo: tema.titulo,
      descripcion: tema.descripcion,
      contenido: tema.contenido,
      color: tema.color,
      syncAt: Date.now(),
    });

    const encrypted = encriptarNota(payload);

    const { error } = await supabaseAdmin
      .from("notas")
      .update({ data_encrypted: encrypted })
      .eq("id", id)
      .eq("user_id", userId);

    if (error) {
      console.error("SYNC_ERROR:", error);
      return false;
    }

    return true;
  } catch {
    return false;
  }
}
