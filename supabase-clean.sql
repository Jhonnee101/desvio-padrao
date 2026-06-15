-- ============================================
-- LIMPAR TABELA DE QUESTÕES
-- Executar no SQL Editor do Supabase
-- ============================================

-- Remove todas as questões (e reseta o auto-increment se houver)
DELETE FROM questions;

-- Opcional: limpar também desempenho e caderno de erros
-- (descomente as linhas abaixo se quiser apagar esses dados também)
-- DELETE FROM performance;
-- DELETE FROM error_notebook;
-- DELETE FROM user_comments;

-- Verificar se a tabela ficou vazia
SELECT COUNT(*) AS total_questoes FROM questions;
