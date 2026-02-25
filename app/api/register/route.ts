import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function POST(req: NextRequest) {
  const { username, password, email } = await req.json();

  if (!username || !password) {
    return NextResponse.json(
      { ok: false, error: "VALIDACIÓN: username y password requeridos" },
      { status: 400 }
    );
  }

  if (password.length < 6) {
    return NextResponse.json(
      { ok: false, error: "VALIDACIÓN: contraseña mínimo 6 caracteres" },
      { status: 400 }
    );
  }

  try {
    console.log("REGISTER: Iniciando registro para", username);
    
    // Hashear contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    console.log("REGISTER: Hash generado");

    // Crear usuario en BD
    console.log("REGISTER: Insertando en Supabase...", {
      url: process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasKey: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    });

    const { data: user, error } = await supabaseAdmin
      .from("users")
      .insert([
        {
          username,
          password_hash: passwordHash,
          email,
          is_active: true,
        },
      ])
      .select("id, username, email")
      .single();

    console.log("REGISTER: Respuesta de Supabase", { user, error });

    if (error) {
      console.error("REGISTER: Error de Supabase", error);
      if (error.code === "23505") {
        return NextResponse.json(
          { ok: false, error: "USUARIO_EXISTE: El username ya está registrado" },
          { status: 409 }
        );
      }
      return NextResponse.json(
        {
          ok: false,
          error: `ERROR_BD: ${error.message || JSON.stringify(error)}`,
        },
        { status: 500 }
      );
    }

    console.log("REGISTER: Usuario creado exitosamente", user.id);

    return NextResponse.json(
      {
        ok: true,
        message: "Usuario creado exitosamente",
        user: { id: user.id, username: user.username, email: user.email },
      },
      { status: 201 }
    );
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("REGISTER_EXCEPTION:", errorMsg, err);
    return NextResponse.json(
      { ok: false, error: `ERROR_SERVIDOR: ${errorMsg}` },
      { status: 500 }
    );
  }
}
