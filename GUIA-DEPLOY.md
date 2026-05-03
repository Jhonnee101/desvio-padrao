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

### 1.2 Executar o Schema SQL

1. No painel do Supabase, vá em **SQL Editor** (ícone de terminal no menu lateral)
2. Clique em **New query**
3. Copie TODO o conteúdo do arquivo `supabase-schema.sql` deste projeto
4. Cole no editor e clique em **Run** (ou `Ctrl+Enter`)
5. Você verá mensagens de sucesso para cada tabela criada

### 1.3 Desativar RLS temporariamente para importação (OPCIONAL)

Se quiser importar questões em massa, execute no SQL Editor:

```sql
-- Temporariamente desativar RLS para importação
ALTER TABLE questions DISABLE ROW LEVEL SECURITY;

-- Após importar, reativar:
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
```

### 1.4 Importar questões iniciais (OPCIONAL)

Se já tiver questões no `questions.json`, importe pelo **Table Editor**:

1. Vá em **Table Editor** (ícone de tabela no menu lateral)
2. Selecione a tabela `questions`
3. Clique em **Insert > Import data from CSV**
4. Converta o JSON para CSV primeiro (ou use o SQL Editor para inserts diretos)

### 1.5 Pegar as credenciais do Supabase

1. No painel do Supabase, vá em **Project Settings** (ícone de engrenagem)
2. Clique em **API** no menu lateral
3. Copie:
   - **Project URL:** `https://xxxxxxxxxxxxx.supabase.co`
   - **anon public key:** uma chave longa que começa com `eyJ...`

---

## 2. Configurando o Projeto Local

### 2.1 Criar arquivo .env

Na raiz do projeto, crie um arquivo `.env`:

```bash
cp .env.example .env
```

### 2.2 Preencher as variáveis

Edite o `.env` com suas credenciais do Supabase:

```
VITE_SUPABASE_URL=https://sua-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.3 Testar localmente

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

1. Crie um repositório no GitHub (se ainda não tem)
2. No terminal do projeto:

```bash
git add .
git commit -m "Preparando para deploy com Supabase e Netlify"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/SEU-REPO.git
git push -u origin main
```

### 3.2 Conectar ao Netlify

1. Acesse https://app.netlify.com
2. Clique em **Add new site** > **Import an existing project**
3. Faça login com GitHub (se ainda não fez)
4. Selecione **GitHub** e autorize o acesso
5. Selecione seu repositório `desvio-padrao`
6. Na tela de configuração:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
7. Clique em **Deploy site**

### 3.3 Adicionar variáveis de ambiente no Netlify

1. No painel do Netlify, vá em **Site configuration**
2. Clique em **Environment variables** no menu lateral
3. Clique em **Add a variable**
4. Adicione as duas variáveis:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | Sua URL do Supabase |
| `VITE_SUPABASE_ANON_KEY` | Sua anon key do Supabase |

5. Clique em **Save**

### 3.4 Redeploy

1. Vá em **Deploys** no Netlify
2. Clique em **Trigger deploy** > **Clear build cache and deploy site**
3. Aguarde o deploy (~1-2 minutos)

### 3.5 Seu site estará disponível em

```
https://desvio-padrao-xxxxx.netlify.app
```

---

## 4. (Opcional) Domínio Personalizado

Se quiser usar um domínio próprio:

1. No Netlify, vá em **Domain settings**
2. Clique em **Add a domain**
3. Digite seu domínio (ex: `desviopadrao.com.br`)
4. Siga as instruções para configurar os DNS no Registro.br ou seu provedor

---

## 5. (Opcional) Deploy Contínuo

Com a configuração atual, **todo push para a branch `main`** dispara um deploy automático no Netlify.

Se quiser mudar a branch, vá em:
**Site configuration** > **Build & deploy** > **Continuous deployment** > **Branches**

---

## Estrutura de Arquivos Criados/Modificados

| Arquivo | Descrição |
|---------|-----------|
| `supabase-schema.sql` | Schema SQL para criar tabelas no Supabase |
| `lib/supabase.ts` | Cliente Supabase configurado |
| `lib/database.types.ts` | Tipos TypeScript para as tabelas |
| `.env.example` | Modelo de variáveis de ambiente |
| `.env` | **NÃO COMMITAR!** Suas credenciais locais |
| `.gitignore` | Adicionado `.env` para segurança |
| `netlify.toml` | Configuração de deploy do Netlify |
| `App.tsx` | Refatorado para usar Supabase |
| `src-env.d.ts` | Tipos para variáveis do Vite |

---

## Troubleshooting

### Erro: "Missing Supabase environment variables"
Verifique se o `.env` está preenchido corretamente no Netlify (não adianta ter só no local).

### Erro: "relation does not exist"
O schema SQL não foi executado corretamente no Supabase. Execute novamente.

### Questões não aparecem
Verifique no **Table Editor** do Supabase se a tabela `questions` tem dados.

### Login não funciona
Verifique no **Table Editor** se existe o usuário admin com email `admin@desvio.com`.

### Build falha no Netlify
Verifique os logs de deploy no Netlify. Geralmente é variável de ambiente faltando.
