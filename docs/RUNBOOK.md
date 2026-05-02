# RUNBOOK — Arali Flow

Este runbook cobre a operação mínima da Fase 0 — Risca: setup local, auth, migrations, tipos, usuários piloto e troubleshooting.

## Setup Local

1. Instale Node.js 20+.
2. Instale dependências:

```bash
npm install
```

3. Copie `.env.example` para `.env.local` e preencha:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. Rode o servidor:

```bash
npm run dev
```

5. Abra `http://localhost:3000/login`.

## Supabase

A Supabase CLI é necessária para migrations e geração de tipos.

```bash
npm install -g supabase
supabase login
supabase link --project-ref <project-ref>
```

Aplicar migration:

```bash
npm run db:migrate
```

Gerar tipos:

```bash
npm run types:generate
```

Enquanto a CLI não estiver disponível, `types/database.ts` continua como stub e algumas queries usam tipos locais até a geração real.

## Usuários Piloto

Após aplicar `0001_fundacao.sql`, crie os usuários piloto:

```bash
npm run db:pilots
```

Conta de teste já usada na Risca:

```text
E-mail: teste@aralimoveis.com.br
Senha: Arali@123456
```

O script usa `SUPABASE_SERVICE_ROLE_KEY`; nunca exponha essa chave no browser.

## Auth

Fluxos suportados na Risca:

- Login por senha em `/login`.
- Magic link com callback em `/auth/callback`.
- Logout pelo shell autenticado.

Se magic link falhar, valide:

- `NEXT_PUBLIC_APP_URL` aponta para a URL correta.
- A URL `/auth/callback` está liberada no Supabase Auth.
- Resend/domínio de e-mail está configurado no projeto Supabase.

## RLS

Valide pelo menos estes perfis:

- `integrante`: lê seu próprio perfil e seus vínculos.
- `lider/gestor`: lê vínculos do próprio time.
- `admin/diretoria`: lê e escreve tabelas fundacionais.

Tabelas da Risca:

- `integrantes`
- `ambientes`
- `times`
- `integrantes_times`

## Troubleshooting

CSS não carrega e página abre como HTML cru:

```bash
Stop-Process -Name node -Force
Remove-Item .next -Recurse -Force
npm run dev
```

Supabase CLI ausente:

```bash
npm install -g supabase
```

Login por senha falha:

- Confirme que o usuário existe em Supabase Auth.
- Confirme que existe perfil em `integrantes` com `usuario_id` igual ao Auth user id.
- Confirme que o e-mail está confirmado.

Build local:

```bash
npm run lint
npm run typecheck
npm run build
```

## Deploy

Para Vercel, configure as variáveis em Development, Preview e Production:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`
- `SENTRY_DSN`, quando Sentry estiver ativo
- `RESEND_API_KEY`, quando Resend estiver ativo

Preview Vercel, Sentry e Resend só entram como concluídos quando houver acesso real ao projeto e credenciais válidas.
