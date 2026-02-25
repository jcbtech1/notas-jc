import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { crearTema, eliminarTema } from "@/lib/storage";

export async function POST(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ error: "NO_AUTH" }, { status: 401 });

  const payload = verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });

  const { titulo, descripcion } = await req.json();
  const tema = await crearTema(payload.userId, titulo, descripcion);

  if (!tema) {
    return NextResponse.json({ error: "ERROR_CREAR" }, { status: 500 });
  }

  return NextResponse.json({ tema }, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  if (!token) return NextResponse.json({ error: "NO_AUTH" }, { status: 401 });

  const payload = verifyJWT(token);
  if (!payload) return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });

  const { id } = await req.json();
  const ok = await eliminarTema(payload.userId, id);

  if (!ok) {
    return NextResponse.json({ error: "ERROR_ELIMINAR" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
