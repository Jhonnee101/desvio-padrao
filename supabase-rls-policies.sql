-- ============================================
-- POLÍTICAS DE SEGURANÇA (RLS)
-- Execute APÓS o schema e as funções RPC
-- ============================================

-- ============================================
-- ATENÇÃO: 
-- Este app NÃO usa Supabase Auth (login customizado).
-- As RLS policies abaixo permitem operações
-- necessárias para o funcionamento do app.
-- A segurança é feita via hash de senhas (bcrypt)
-- e validação no frontend (role-based UI).
-- ============================================

-- Habilita RLS nas tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_notebook ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_comments ENABLE ROW LEVEL SECURITY;

-- Remove políticas antigas se existirem
DROP POLICY IF EXISTS "Todos podem ler questões" ON questions;
DROP POLICY IF EXISTS "Apenas admins podem inserir questões" ON questions;
DROP POLICY IF EXISTS "Apenas admins podem atualizar questões" ON questions;
DROP POLICY IF EXISTS "Apenas admins podem deletar questões" ON questions;
DROP POLICY IF EXISTS "Usuário pode ver seus dados" ON performance;
DROP POLICY IF EXISTS "Usuário pode inserir performance" ON performance;
DROP POLICY IF EXISTS "Usuário pode ver seu caderno" ON error_notebook;
DROP POLICY IF EXISTS "Usuário pode gerenciar caderno" ON error_notebook;
DROP POLICY IF EXISTS "Usuário pode ver seus comentários" ON user_comments;
DROP POLICY IF EXISTS "Usuário pode gerenciar comentários" ON user_comments;
DROP POLICY IF EXISTS "Usuários podem ver outros usuários" ON users;
DROP POLICY IF EXISTS "Apenas admins podem inserir usuários" ON users;
DROP POLICY IF EXISTS "Apenas admins podem atualizar usuários" ON users;
DROP POLICY IF EXISTS "Apenas admins podem deletar usuários" ON users;

-- ============================================
-- POLÍTICAS PARA users
-- ============================================

-- SELECT: permitido para todos (login)
CREATE POLICY "select_users" ON users
  FOR SELECT USING (true);

-- INSERT: permitido via função RPC register_user
-- (a função tem SECURITY DEFINER, então ignora RLS)
CREATE POLICY "insert_users_via_rpc" ON users
  FOR INSERT WITH CHECK (true);

-- UPDATE: permitido via função RPC update_user
CREATE POLICY "update_users_via_rpc" ON users
  FOR UPDATE USING (true) WITH CHECK (true);

-- DELETE: permitido via função RPC delete_user
CREATE POLICY "delete_users_via_rpc" ON users
  FOR DELETE USING (true);

-- ============================================
-- POLÍTICAS PARA questions
-- ============================================

CREATE POLICY "select_questions" ON questions
  FOR SELECT USING (true);

CREATE POLICY "insert_questions" ON questions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "update_questions" ON questions
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "delete_questions" ON questions
  FOR DELETE USING (true);

-- ============================================
-- POLÍTICAS PARA performance
-- ============================================

CREATE POLICY "select_performance" ON performance
  FOR SELECT USING (true);

CREATE POLICY "insert_performance" ON performance
  FOR INSERT WITH CHECK (true);

CREATE POLICY "delete_performance" ON performance
  FOR DELETE USING (true);

-- ============================================
-- POLÍTICAS PARA error_notebook
-- ============================================

CREATE POLICY "select_error_notebook" ON error_notebook
  FOR SELECT USING (true);

CREATE POLICY "insert_error_notebook" ON error_notebook
  FOR INSERT WITH CHECK (true);

CREATE POLICY "delete_error_notebook" ON error_notebook
  FOR DELETE USING (true);

-- ============================================
-- POLÍTICAS PARA user_comments
-- ============================================

CREATE POLICY "select_user_comments" ON user_comments
  FOR SELECT USING (true);

CREATE POLICY "insert_user_comments" ON user_comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "update_user_comments" ON user_comments
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "delete_user_comments" ON user_comments
  FOR DELETE USING (true);
