import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { signJWT } from "@/lib/jwt";

export async function POST(req: NextRequest) {
  const { username, password } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { ok: false, error: "VALIDACIÓN: username y password requeridos" },
      { status: 400 }
    );
  }

  try {
    // buscar usuario en BD
    // Buscar usuario en BD
    const { data: user, error } = await supabaseAdmin
      .from("users")
      .select("id, username, password_hash, is_active")
      .eq("username", username)
      .single();

    if (error || !user) {
      return NextResponse.json(
        { ok: false, error: "ACCESO_DENEGADO: Credenciales inválidas" },
        { status: 401 }
      );
    }

    if (!user.is_active) {
      console.warn("LOGIN: Cuenta desactivada para", username);
      return NextResponse.json(
        { ok: false, error: "CUENTA_DESACTIVADA" },
        { status: 403 }
      );
    }

    // Comparar contraseña con bcrypt
    const passwordMatch = await bcrypt.compare(password, user.password_hash);
    if (!passwordMatch) {
      return NextResponse.json(
        { ok: false, error: "ACCESO_DENEGADO: Credenciales inválidas" },
        { status: 401 }
      );
    }
    // contraseña correcta: generar JWT
    // Generar JWT
    const token = signJWT({
      userId: user.id,
      username: user.username,
    });

    // Guardar en cookie httpOnly
    const response = NextResponse.json({ ok: true });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 días
      path: "/",
    });

    console.log("LOGIN: Login exitoso para", username);
    return response;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("LOGIN_EXCEPTION:", errorMsg, err);
    return NextResponse.json(
      { ok: false, error: `ERROR_SERVIDOR: ${errorMsg}` },
      { status: 500 }
    );
  }
}

