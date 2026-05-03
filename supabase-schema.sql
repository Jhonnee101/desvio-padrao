-- ============================================
-- SCHEMA DO SUPABASE - DESVIO PADRÃO
-- Execute este SQL no SQL Editor do Supabase
-- ============================================

-- Tabela: usuários
CREATE TABLE users (
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
CREATE TABLE questions (
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
CREATE TABLE performance (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  materia TEXT NOT NULL,
  assunto TEXT NOT NULL,
  is_correct BOOLEAN NOT NULL,
  answered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela: caderno de erros
CREATE TABLE error_notebook (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Tabela: comentários do usuário
CREATE TABLE user_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  question_id TEXT NOT NULL,
  comment TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, question_id)
);

-- Índices para performance
CREATE INDEX idx_performance_user_id ON performance(user_id);
CREATE INDEX idx_performance_question_id ON performance(question_id);
CREATE INDEX idx_error_notebook_user_id ON error_notebook(user_id);
CREATE INDEX idx_user_comments_user_id ON user_comments(user_id);
CREATE INDEX idx_questions_materia ON questions(materia);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS em todas as tabelas
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE performance ENABLE ROW LEVEL SECURITY;
ALTER TABLE error_notebook ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_comments ENABLE ROW LEVEL SECURITY;

-- Política: questões são públicas para leitura (qualquer usuário logado pode ver)
CREATE POLICY "Todos podem ler questões" ON questions
  FOR SELECT USING (true);

-- Política: apenas admin pode gerenciar questões
CREATE POLICY "Apenas admins podem inserir questões" ON questions
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Apenas admins podem atualizar questões" ON questions
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Apenas admins podem deletar questões" ON questions
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

-- Política: cada usuário pode ver e gerenciar apenas seus dados
CREATE POLICY "Usuário pode ver seus dados" ON performance
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Usuário pode inserir performance" ON performance
  FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Usuário pode ver seu caderno" ON error_notebook
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Usuário pode gerenciar caderno" ON error_notebook
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Usuário pode ver seus comentários" ON user_comments
  FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Usuário pode gerenciar comentários" ON user_comments
  FOR ALL USING (user_id = auth.uid());

-- Política: usuários podem ver dados de outros (para admin gerenciar)
CREATE POLICY "Usuários podem ver outros usuários" ON users
  FOR SELECT USING (true);
CREATE POLICY "Apenas admins podem inserir usuários" ON users
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Apenas admins podem atualizar usuários" ON users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
    OR id = auth.uid()
  );
CREATE POLICY "Apenas admins podem deletar usuários" ON users
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM users WHERE id = auth.uid() AND role = 'admin')
  );

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
