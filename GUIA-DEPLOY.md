# Guia de Deploy - Desvio Padrão

## Resumo do Projeto

- **Frontend:** React + TypeScript + Vite
- **Hospedagem:** Netlify (gratuita)
- **Banco de Dados:** Supabase (PostgreSQL, gratuito)

---

## 1. Configurando o Supabase (Banco de Dados)

### 1.1 Criar projeto no Supabase

1. Acesse https://supabase.com
2. Clique em **Start your project**
3. Faça login com GitHub, Google ou email
4. Clique em **New Project**
5. Preencha:
   - **Organization:** crie uma ou selecione existente
   - **Project name:** `desvio-padrao`
   - **Database Password:** gere uma senha forte (salve em local seguro)
   - **Region:** escolha a mais próxima (ex: `South America (Brazil)`)
6. Clique em **Create new project**
7. Aguarde ~2 minutos enquanto o banco é criado

### 1.2 Executar os SQLs (ORDEM CORRETA)

Execute os arquivos SQL na ordem abaixo no **SQL Editor** do Supabase:

#### PASSO 1: `supabase-schema.sql`
Cria as tabelas (users, questions, performance, error_notebook, user_comments), habilita pgcrypto e insere o admin padrão.

#### PASSO 2: `supabase-rpc-functions.sql`
Cria as funções RPC para operações seguras:
- `login_user` — login com verificação de senha hasheada (bcrypt)
- `register_user` — registro com hash automático da senha
- `create_user` — admin cria usuário com hash
- `update_user` — admin atualiza dados (senha opcional, hash se fornecida)
- `delete_user` — deleta usuário e dados relacionados

#### PASSO 3: `supabase-rls-policies.sql`
Habilita RLS nas tabelas com políticas que permitem as operações necessárias.

### 1.3 Pegar as credenciais do Supabase

1. No painel do Supabase, vá em **Project Settings** (ícone de engrenagem)
2. Clique em **API** no menu lateral
3. Copie:
   - **Project URL:** a URL base (ex: `https://SEU-PROJETO.supabase.co`)
   - **anon public key:** a chave anônima

---

## 2. Configurando o Projeto Local

### 2.1 Criar arquivo .env

Na raiz do projeto, crie ou edite o arquivo `.env`:

```
VITE_SUPABASE_URL=https://SEU-PROJETO.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIs...
```

**A URL NÃO deve conter `/rest/v1/`** no final. O cliente Supabase adiciona isso automaticamente.

### 2.2 Testar localmente

```bash
npm install
npm run dev
```

O app estará em `http://localhost:5173/`. Teste o login com:
- **Email:** `admin@desvio.com`
- **Senha:** `admin123`

---

## 3. Fazendo Deploy no Netlify

### 3.1 Preparar o repositório no GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

### 3.2 Conectar ao Netlify

1. Acesse https://app.netlify.com
2. Clique em **Add new site** > **Import an existing project**
3. Faça login com GitHub
4. Selecione seu repositório
5. Configurações:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. Clique em **Deploy site**

### 3.3 Adicionar variáveis de ambiente no Netlify

1. No painel do Netlify, vá em **Site configuration**
2. Clique em **Environment variables**
3. Adicione:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | URL do Supabase (sem /rest/v1/) |
| `VITE_SUPABASE_ANON_KEY` | Anon key do Supabase |

4. Clique em **Save**

### 3.4 Redeploy

1. Vá em **Deploys** no Netlify
2. Clique em **Trigger deploy** > **Clear build cache and deploy site**

### 3.5 Seu site estará disponível em

```
https://desvio-padrao-xxxxx.netlify.app
```

---

## 4. Estrutura de Arquivos

| Arquivo | Descrição |
|---------|-----------|
| `supabase-schema.sql` | Schema das tabelas + pgcrypto + admin padrão |
| `supabase-rpc-functions.sql` | Funções RPC para login/registro/CRUD com hash |
| `supabase-rls-policies.sql` | Políticas de segurança RLS |
| `lib/supabase.ts` | Cliente Supabase configurado |
| `lib/database.types.ts` | Tipos TypeScript para as tabelas |
| `.env` | Variáveis de ambiente (NÃO COMMITAR) |
| `netlify.toml` | Configuração de deploy do Netlify |

---

## Troubleshooting

### "Missing Supabase environment variables"
Verifique se as variáveis estão no Netlify (não adianta ter só no `.env` local).

### "relation does not exist"
Os SQLs não foram executados ou foram pulados passos.

### "function login_user does not exist"
O `supabase-rpc-functions.sql` não foi executado.

### Login não funciona
Verifique se o `supabase-schema.sql` foi executado (cria o admin) e o `supabase-rpc-functions.sql` também (cria a função de login).

### Questões não aparecem
Verifique no **Table Editor** do Supabase se a tabela `questions` tem dados.

### Build falha no Netlify
Verifique os logs de deploy. Provavelmente variável de ambiente faltando.
