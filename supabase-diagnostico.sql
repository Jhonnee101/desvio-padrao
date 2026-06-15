-- ============================================
-- DIAGNÓSTICO - Verificar configuração do banco
-- Execute no SQL Editor do Supabase
-- ============================================

-- 1. Verifica se o admin existe e o tipo da senha
SELECT 
  id, 
  nome, 
  email, 
  role::text,
  ativo,
  -- Verifica se a senha começa com $2a$ (formato bcrypt)
  CASE 
    WHEN senha LIKE '$2a$%' THEN 'BCRYPT (correto)'
    WHEN senha LIKE '$2b$%' THEN 'BCRYPT (correto)'
    ELSE 'TEXTO PURO (precisa atualizar)'
  END as tipo_senha,
  created_at
FROM users 
WHERE email = 'admin@desvio.com';

-- 2. Verifica se a função RPC existe
SELECT 
  p.proname as nome_funcao,
  CASE 
    WHEN p.proname IS NOT NULL THEN 'EXISTE'
    ELSE 'NÃO EXISTE'
  END as status
FROM pg_proc p
WHERE p.proname IN ('login_user', 'register_user', 'create_user', 'update_user', 'delete_user');

-- 3. Testa o login diretamente (deve retornar 1 linha)
SELECT 'TESTE LOGIN' as teste,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM users 
      WHERE email = 'admin@desvio.com' 
      AND senha = crypt('admin123', senha)
      AND ativo = true
    ) THEN 'FUNCIONA'
    ELSE 'FALHA - senha incorreta ou formato errado'
  END as resultado;

-- 4. Se a senha estiver em texto puro, executa a correção:
-- (Descomente e execute se necessário)
-- UPDATE users 
-- SET senha = crypt('admin123', gen_salt('bf'))
-- WHERE email = 'admin@desvio.com';
