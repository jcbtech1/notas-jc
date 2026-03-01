import { NextRequest, NextResponse } from "next/server";
import CryptoJS from "crypto-js";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "AEGIS_NEURAL_CORE_2025";
const ADMIN_SECRET = process.env.MIGRATION_SECRET || process.env.JWT_SECRET || "migrate_secret";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, ids } = body as { secret?: string; ids?: string[] };

    if (!secret || secret !== ADMIN_SECRET) {
      return NextResponse.json({ ok: false, error: "INVALID_SECRET" }, { status: 401 });
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ ok: false, error: "NO_IDS" }, { status: 400 });
    }

    const results: Record<string, { ok: boolean; error?: string }> = {};

    for (const id of ids) {
      try {
        const { data: row, error: fetchErr } = await supabaseAdmin
          .from("notas")
          .select("id, data_encrypted")
          .eq("id", id)
          .single();

        if (fetchErr || !row) {
          results[id] = { ok: false, error: fetchErr?.message || "NOT_FOUND" };
          continue;
        }

        const encrypted = row.data_encrypted as string;
        if (!encrypted) {
          results[id] = { ok: false, error: "NO_ENCRYPTED_DATA" };
          continue;
        }

        const bytes = CryptoJS.AES.decrypt(encrypted, ENCRYPTION_KEY);
        const plaintext = bytes.toString(CryptoJS.enc.Utf8);

        if (!plaintext) {
          results[id] = { ok: false, error: "DECRYPT_FAILED" };
          continue;
        }

        const { error: updateErr } = await supabaseAdmin
          .from("notas")
          .update({ contenido: plaintext })
          .eq("id", id);

        if (updateErr) {
          results[id] = { ok: false, error: updateErr.message };
          continue;
        }

        results[id] = { ok: true };
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        results[id] = { ok: false, error: msg };
      }
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
