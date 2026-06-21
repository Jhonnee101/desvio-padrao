-- ============================================
-- FUNÇÕES RPC (Remote Procedure Calls)
-- Execute após o schema SQL
-- ============================================

-- Habilita pgcrypto para hash de senhas
CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA public;

-- ============================================
-- Permissões para a chave anônima (anon key)
-- ============================================
GRANT USAGE ON SCHEMA public TO anon;

-- ============================================
-- login_user (email, senha) -> dados do usuário
-- ============================================
CREATE OR REPLACE FUNCTION login_user(p_email TEXT, p_senha TEXT)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  email TEXT,
  role TEXT,
  ativo BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  SELECT u.id, u.nome, u.email, u.role::TEXT, u.ativo, u.created_at, u.updated_at
  FROM users u
  WHERE u.email = p_email
    AND u.senha = crypt(p_senha, u.senha)
    AND u.ativo = true;
END;
$$;

-- ============================================
-- register_user - cria conta com senha hasheada
-- ============================================
CREATE OR REPLACE FUNCTION register_user(
  p_nome TEXT,
  p_email TEXT,
  p_senha TEXT,
  p_role TEXT DEFAULT 'student',
  p_ativo BOOLEAN DEFAULT false
)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  email TEXT,
  role TEXT,
  ativo BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO users (nome, email, senha, role, ativo)
  VALUES (
    p_nome,
    p_email,
    crypt(p_senha, gen_salt('bf')),
    p_role::user_role,
    p_ativo
  )
  RETURNING users.id, users.nome, users.email, users.role::TEXT, users.ativo, users.created_at, users.updated_at;
END;
$$;

-- ============================================
-- create_user - admin cria usuário com hash
-- ============================================
CREATE OR REPLACE FUNCTION create_user(
  p_nome TEXT,
  p_email TEXT,
  p_senha TEXT,
  p_role TEXT DEFAULT 'student',
  p_ativo BOOLEAN DEFAULT true
)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  email TEXT,
  role TEXT,
  ativo BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  RETURN QUERY
  INSERT INTO users (nome, email, senha, role, ativo)
  VALUES (
    p_nome,
    p_email,
    crypt(p_senha, gen_salt('bf')),
    p_role::user_role,
    p_ativo
  )
  RETURNING users.id, users.nome, users.email, users.role::TEXT, users.ativo, users.created_at, users.updated_at;
END;
$$;

-- ============================================
-- update_user - admin atualiza dados do usuário
-- ============================================
CREATE OR REPLACE FUNCTION update_user(
  p_id UUID,
  p_nome TEXT DEFAULT NULL,
  p_email TEXT DEFAULT NULL,
  p_senha TEXT DEFAULT NULL,
  p_role TEXT DEFAULT NULL,
  p_ativo BOOLEAN DEFAULT NULL
)
RETURNS TABLE (
  id UUID,
  nome TEXT,
  email TEXT,
  role TEXT,
  ativo BOOLEAN,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE
)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  UPDATE users SET
    nome = COALESCE(p_nome, users.nome),
    email = COALESCE(p_email, users.email),
    senha = CASE WHEN p_senha IS NOT NULL THEN crypt(p_senha, gen_salt('bf')) ELSE users.senha END,
    role = COALESCE(p_role::user_role, users.role),
    ativo = COALESCE(p_ativo, users.ativo),
    updated_at = NOW()
  WHERE id = p_id;

  RETURN QUERY
  SELECT u.id, u.nome, u.email, u.role::TEXT, u.ativo, u.created_at, u.updated_at
  FROM users u
  WHERE u.id = p_id;
END;
$$;

-- ============================================
-- delete_user - admin deleta usuário
-- ============================================
CREATE OR REPLACE FUNCTION delete_user(p_id UUID)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, extensions
AS $$
BEGIN
  DELETE FROM performance WHERE user_id = p_id;
  DELETE FROM error_notebook WHERE user_id = p_id;
  DELETE FROM user_comments WHERE user_id = p_id;
  DELETE FROM comment_votes WHERE user_id = p_id;
  DELETE FROM question_comments WHERE user_id = p_id;
  DELETE FROM users WHERE id = p_id;
END;
$$;

-- ============================================
-- Re-hash da senha do admin padrão
-- ============================================
UPDATE users
SET senha = crypt('admin123', gen_salt('bf'))
WHERE email = 'admin@desvio.com';

-- ============================================
-- admin padrão (se não existir)
-- ============================================
INSERT INTO users (id, nome, email, senha, role, ativo)
SELECT
  '00000000-0000-0000-0000-000000000001',
  'Administrador',
  'admin@desvio.com',
  crypt('admin123', gen_salt('bf')),
  'admin'::user_role,
  true
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@desvio.com');

-- ============================================
-- Permissões para executar as funções
-- ============================================
GRANT EXECUTE ON FUNCTION login_user TO anon;
GRANT EXECUTE ON FUNCTION register_user TO anon;
GRANT EXECUTE ON FUNCTION create_user TO anon;
GRANT EXECUTE ON FUNCTION update_user TO anon;
GRANT EXECUTE ON FUNCTION delete_user TO anon;
