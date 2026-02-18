import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  const validUser = process.env.AUTH_USER || "test";
  const validPass = process.env.AUTH_PASS || "password";

  if (username === validUser && password === validPass) {
    return NextResponse.json({ ok: true });
  }

  return NextResponse.json(
    { ok: false, error: "ACCESO_DENEGADO: Credenciales inválidas" },
    { status: 401 }
  );
}
