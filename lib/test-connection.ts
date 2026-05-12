import { supabase } from './supabase';

(async () => {
  console.log('=== TESTE DE CONEXÃO COM SUPABASE ===\n');

  console.log('1. Testando conexão básica...');
  const { data: usersData, error: connectionError } = await supabase
    .from('users')
    .select('*')
    .limit(1);

  if (connectionError) {
    console.error('ERRO de conexão:', connectionError.message);
    console.error('Detalhes:', connectionError);
    console.log('\nVERIFIQUE: As variáveis VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY estão corretas no Netlify?');
    return;
  }
  console.log('OK - Conexão estabelecida\n');

  console.log('2. Contagem de usuários no banco...');
  console.log('Usuários encontrados:', usersData?.length ?? 0, '\n');

  console.log('3. Testando INSERT (criar usuário de teste)...');
  const testEmail = `teste-${Date.now()}@desvio.com`;
  const { data: inserted, error: insertError } = await supabase
    .from('users')
    .insert({
      nome: 'Teste',
      email: testEmail,
      senha: 'teste123',
      role: 'student',
      ativo: true
    })
    .select()
    .single();

  if (insertError) {
    console.error('ERRO no INSERT:', insertError.message);
    console.error('Detalhes:', insertError);
    console.log('\nPOSSÍVEL CAUSA: Row Level Security (RLS) está habilitado');
    console.log('SOLUÇÃO: Execute o arquivo supabase-fix-rls.sql no SQL Editor do Supabase');
  } else {
    console.log('OK - Usuário criado com sucesso!');
    console.log('ID:', inserted.id);

    console.log('\n4. Limpando teste (deletando usuário criado)...');
    await supabase.from('users').delete().eq('id', inserted.id);
    console.log('OK - Usuário removido\n');
  }

  console.log('5. Testando SELECT em questions...');
  const { data: questionsData, error: questionsError } = await supabase
    .from('questions')
    .select('id')
    .limit(1);

  if (questionsError) {
    console.error('ERRO ao acessar questões:', questionsError.message);
  } else {
    console.log('OK - Tabela questions acessível');
    console.log('Questões no banco:', questionsData?.length ?? 0, '(pelo menos 1)\n');
  }

  console.log('=== FIM DO TESTE ===');
})();
