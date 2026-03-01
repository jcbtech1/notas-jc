import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

const ADMIN_SECRET = process.env.MIGRATION_SECRET || process.env.JWT_SECRET || "migrate_secret";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { secret, ids, destination } = body as {
      secret?: string;
      ids?: string[];
      destination?: string;
    };

    if (!secret || secret !== ADMIN_SECRET) {
      return NextResponse.json({ ok: false, error: "INVALID_SECRET" }, { status: 401 });
    }

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json({ ok: false, error: "NO_IDS" }, { status: 400 });
    }

    if (!destination) {
      return NextResponse.json({ ok: false, error: "NO_DESTINATION" }, { status: 400 });
    }

    // Update all specified ids to the destination user_id
    const { error } = await supabaseAdmin
      .from("notas")
      .update({ user_id: destination })
      .in("id", ids as string[]);

    if (error) {
      return NextResponse.json({ ok: false, error: error.message }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
