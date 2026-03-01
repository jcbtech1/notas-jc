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
    const payload = jwt.verify(token, JWT_SECRET) as JWTPayload;
    return payload;
  } catch (err) {
    return null;
  }
}
