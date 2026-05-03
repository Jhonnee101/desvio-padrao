# Desvio Padrão - Concursos Jurídicos

Plataforma de estudos para concursos jurídicos com banco de questões, painel administrativo e acompanhamento de desempenho.

## Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 18 ou superior)

## Rodar Localmente

```bash
# 1. Instalar dependências
npm install

# 2. Iniciar servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:5173/`.

## Funcionalidades

- **Login/Registro** — Usuários com roles: admin, colaborador e estudante
- **Painel Admin** — Gerenciar banco de questões (adição individual ou importação JSON)
- **Gestão de Usuários** — Admin pode criar, editar, ativar/desativar e excluir usuários
- **Dashboard** — Lista de matérias e tópicos jurídicos
- **Resolução de Questões** — Modo estudo ou simulado
- **Caderno de Erros** — Revisão das questões erradas
- **Estatísticas** — Acompanhamento de desempenho por matéria

## Credenciais Padrão

- **Admin:** `admin@desvio.com` / `admin123`

Novos usuários registrados via tela de cadastro recebem role `student` por padrão.

## Scripts Disponíveis

- `npm run dev` — Servidor de desenvolvimento
- `npm run build` — Build de produção
- `npm run preview` — Preview do build local
