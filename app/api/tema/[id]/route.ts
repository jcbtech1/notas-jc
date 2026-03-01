import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { obtenerTema, actualizarTema, sincronizarNube } from "@/lib/storage";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ error: "NO_AUTH" }, { status: 401 });

  const payload = verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });

  const { id } = await params;
  const tema = await obtenerTema(payload.userId, id);

  if (!tema) {
    return NextResponse.json({ error: "NOT_FOUND" }, { status: 404 });
  }

  return NextResponse.json({ tema });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ error: "NO_AUTH" }, { status: 401 });

  const payload = verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });

  const { id } = await params;
  const cambios = await req.json();
  const ok = await actualizarTema(payload.userId, id, cambios);
  if (!ok) {
    return NextResponse.json({ error: "ERROR_UPDATE" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ error: "NO_AUTH" }, { status: 401 });

  const payload = verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });

  const { id } = await params;
  const ok = await sincronizarNube(payload.userId, id);

  return NextResponse.json({ ok });
}
