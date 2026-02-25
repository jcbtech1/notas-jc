-- AEGIS_OS: Setup SQL para Supabase
-- Ejecuta esto en Supabase → SQL Editor

-- 1. Crear tabla de usuarios
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- 2. Crear tabla de notas con referencia a usuarios
CREATE TABLE notas (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  titulo TEXT NOT NULL,
  descripcion TEXT,
  contenido TEXT DEFAULT '',
  color TEXT DEFAULT 'cyan',
  data_encrypted TEXT,
  creadoEn BIGINT NOT NULL,
  actualizadoEn BIGINT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Habilitar Row Level Security (RLS)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE notas ENABLE ROW LEVEL SECURITY;

-- 4. Políticas RLS para usuarios (opcional, ya que no autenticamos con Supabase Auth)
-- Para este proyecto, usamos JWT manual

-- 5. Índices para mejor rendimiento
CREATE INDEX notas_user_id_idx ON notas(user_id);
CREATE INDEX notas_updated_at_idx ON notas(actualizadoEn DESC);
CREATE INDEX users_username_idx ON users(username);

-- 6. OPCIONALMENTE: Insertar usuario de prueba (bcrypt hash de "password123")
-- El hash fue generado con: bcrypt.hash("password123", 10)
INSERT INTO users (id, username, password_hash, email, is_active)
VALUES (
  gen_random_uuid(),
  'test',
  '$2a$10$M9YRxzr6.kN6pFoZK8mAze9iD2xzUmxvB3k.JLrA9hOc9Z.3Cw0G6',
  'test@example.com',
  true
);
-- Credenciales: username="test", password="password123"

-- 7. Para tu usuario personal, usa el endpoint /api/register desde la app
-- POST /api/register con { username, password, email }
