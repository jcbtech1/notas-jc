import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";
import { cargarTemas } from "@/lib/storage";

export async function GET(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;

  if (!token) {
    return NextResponse.json({ error: "NO_AUTH" }, { status: 401 });
  }

  const payload = verifyJWT(token);
  if (!payload) {
    return NextResponse.json({ error: "INVALID_TOKEN" }, { status: 401 });
  }

  const temas = await cargarTemas(payload.userId);
  return NextResponse.json({ temas });
}
