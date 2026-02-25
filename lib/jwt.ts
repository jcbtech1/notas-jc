import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tu_clave_supersecreta_cambiame_en_produccion";
const JWT_EXPIRY = "7d";

export interface JWTPayload {
  userId: string;
  username: string;
}

export function signJWT(payload: JWTPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRY });
}

export function verifyJWT(token: string): JWTPayload | null {
  try {
    console.log("VERIFY_JWT: Verificando token con secret:", JWT_SECRET?.slice(0, 10) + "...");
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    console.log("VERIFY_JWT: Token válido para usuario:", payload.username);
    return payload;
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    console.error("VERIFY_JWT: Error verificando token:", errorMsg);
    return null;
  }
}
