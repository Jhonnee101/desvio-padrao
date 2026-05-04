-- ============================================
-- CORREÇÃO: Desabilitar RLS nas tabelas
-- Execute este SQL no SQL Editor do Supabase
-- para corrigir o problema de registro/questões
-- ============================================

-- Desabilita Row Level Security em todas as tabelas
-- (Não usamos Supabase Auth, então RLS bloqueia tudo)

ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;
ALTER TABLE performance DISABLE ROW LEVEL SECURITY;
ALTER TABLE error_notebook DISABLE ROW LEVEL SECURITY;
ALTER TABLE user_comments DISABLE ROW LEVEL SECURITY;

-- Se existirem políticas criadas, dropamos elas
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
