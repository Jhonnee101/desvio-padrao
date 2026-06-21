-- ============================================
-- SCHEMA DO SUPABASE - DESVIO PADRÃO
-- Execute este SQL no SQL Editor do Supabase
-- ============================================

-- Habilita pgcrypto para hash de senhas (bcrypt)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================
-- ENUM: user_role
-- ============================================
DO $$ BEGIN
  CREATE TYPE user_role AS ENUM ('admin', 'collaborator', 'student');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

-- ============================================
-- Tabela: usuários
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role user_role NOT NULL DEFAULT 'student',
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Tabela: questões
-- ============================================
CREATE TABLE IF NOT EXISTS questions (
  id TEXT PRIMARY KEY,
  materia TEXT NOT NULL,
  assunto TEXT NOT NULL,
  enunciado TEXT NOT NULL,
  alternativas TEXT[] NOT NULL,
  indice_correto INTEGER NOT NULL,
  explicacao TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Tabela: desempenho (performance)
-- ============================================
CREATE TABLE IF NOT EXISTS performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  materia TEXT NOT NULL,
  assunto TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Tabela: caderno de erros
-- ============================================
CREATE TABLE IF NOT EXISTS error_notebook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- ============================================
-- Tabela: comentários do usuário
-- ============================================
CREATE TABLE IF NOT EXISTS user_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  comment TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- ============================================
-- Tabela: feedback de questões
-- ============================================
CREATE TABLE IF NOT EXISTS question_feedback (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  mensagem TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'pendente',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Tabela: comentários públicos das questões
-- ============================================
CREATE TABLE IF NOT EXISTS question_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  parent_id UUID REFERENCES question_comments(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- Tabela: votos (like/dislike) nos comentários
-- ============================================
CREATE TABLE IF NOT EXISTS comment_votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  comment_id UUID REFERENCES question_comments(id) ON DELETE CASCADE,
  vote_type TEXT NOT NULL CHECK (vote_type IN ('like', 'dislike')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, comment_id)
);

-- ============================================
-- Índices para performance
-- ============================================
CREATE INDEX IF NOT EXISTS idx_performance_user_id ON performance(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_question_id ON performance(question_id);
CREATE INDEX IF NOT EXISTS idx_error_notebook_user_id ON error_notebook(user_id);
CREATE INDEX IF NOT EXISTS idx_user_comments_user_id ON user_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_materia ON questions(materia);
CREATE INDEX IF NOT EXISTS idx_question_feedback_user_id ON question_feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_question_feedback_question_id ON question_feedback(question_id);
CREATE INDEX IF NOT EXISTS idx_question_feedback_status ON question_feedback(status);

CREATE INDEX IF NOT EXISTS idx_question_comments_question_id ON question_comments(question_id);
CREATE INDEX IF NOT EXISTS idx_question_comments_parent_id ON question_comments(parent_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_comment_id ON comment_votes(comment_id);
CREATE INDEX IF NOT EXISTS idx_comment_votes_user_id ON comment_votes(user_id);

-- ============================================
-- Admin padrão (senha: admin123)
-- A senha é hasheada com bcrypt via pgcrypto
-- ============================================
INSERT INTO users (id, nome, email, senha, role, ativo)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Administrador',
  'admin@desvio.com',
  crypt('admin123', gen_salt('bf')),
  'admin'::user_role,
  true
) ON CONFLICT (id) DO NOTHING;

-- ============================================
-- ATENÇÃO: Após executar este SQL, execute também:
-- 1. supabase-rpc-functions.sql (funções de login/registro)
-- 2. supabase-rls-policies.sql (políticas de segurança)
-- ============================================
