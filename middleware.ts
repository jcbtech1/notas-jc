import { NextRequest, NextResponse } from "next/server";
import { verifyJWT } from "@/lib/jwt";

export function middleware(request: NextRequest) {
  const token = request.cookies.get("auth_token")?.value;
  const pathname = request.nextUrl.pathname;

  // Rutas públicas (no requieren autenticación)
  const publicRoutes = ["/login", "/api/login", "/api/register"];
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Rutas protegidas: validar JWT
  if (!token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  const payload = verifyJWT(token);
  if (!payload) {
    // Token inválido o expirado
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth_token");
    return response;
  }

  // Pasar userId en headers para usar en API routes
  const response = NextResponse.next();
  response.headers.set("X-User-Id", payload.userId);
  response.headers.set("X-Username", payload.username);
  return response;
}

export const config = {
  matcher: [
    /*
     * Aplicar middleware a todas las rutas EXCEPTO:
     * - _next/static
     * - _next/image
     * - favicon.ico
     * - public files
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png|.*\\.jpg).*)",
  ],
};
