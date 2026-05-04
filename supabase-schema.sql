-- ============================================
-- SCHEMA DO SUPABASE - DESVIO PADRÃO
-- Execute este SQL no SQL Editor do Supabase
-- ============================================

-- Tabela: usuários
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  senha TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'student' CHECK (role IN ('admin', 'collaborator', 'student')),
  ativo BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: questões
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

-- Tabela: desempenho (performance)
CREATE TABLE IF NOT EXISTS performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  question_id TEXT NOT NULL,
  materia TEXT NOT NULL,
  assunto TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: caderno de erros
CREATE TABLE IF NOT EXISTS error_notebook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  question_id TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: comentários do usuário
CREATE TABLE IF NOT EXISTS user_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID,
  question_id TEXT NOT NULL,
  comment TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_performance_user_id ON performance(user_id);
CREATE INDEX IF NOT EXISTS idx_performance_question_id ON performance(question_id);
CREATE INDEX IF NOT EXISTS idx_error_notebook_user_id ON error_notebook(user_id);
CREATE INDEX IF NOT EXISTS idx_user_comments_user_id ON user_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_questions_materia ON questions(materia);

-- ============================================
-- ADMIN PADRÃO (senha: admin123)
-- ============================================
INSERT INTO users (id, nome, email, senha, role, ativo)
VALUES (
  '00000000-0000-0000-0000-000000000001',
  'Administrador',
  'admin@desvio.com',
  'admin123',
  'admin',
  true
) ON CONFLICT (id) DO NOTHING;
