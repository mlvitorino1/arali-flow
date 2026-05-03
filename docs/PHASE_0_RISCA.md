# Fase 0 — RISCA ✅

> Antes de cortar, marca-se a madeira. Risca define onde tudo começa: base visual, autenticação, RLS, DX e uma primeira experiência navegável.

**Status**: Concluída em 2026-05-02. Próxima etapa: [`PHASE_1_ESQUADRO.md`](./PHASE_1_ESQUADRO.md).

## Objetivo

Estabelecer a fundação técnica e visual para as próximas fases do Arali Flow. Ao final da Risca, o sistema ainda não entrega os módulos de negócio do Comercial/PCP, mas já permite login real, shell autenticado, schema fundacional com RLS, pipeline mínimo e documentação de operação.

**Critério de pronto (atendido)**: Marcus consegue logar com usuário real, acessar `/home`, ver sidebar/header branded, sair da sessão, e o projeto tem migration, CI e runbook suficientes para outro dev subir a base.

## Resultado Real

- [x] Branding aplicado com tokens oficiais em `app/globals.css`.
- [x] Tailwind v4 configurado via `@theme inline`.
- [x] Fontes Montserrat, DM Sans e JetBrains Mono via `next/font/google`.
- [x] `app/layout.tsx` com `lang="pt-BR"`, dark mode default e anti-flash.
- [x] Shell autenticado com sidebar, header, bottom nav mobile e theme toggle.
- [x] Login por senha com Supabase.
- [x] Middleware protegendo rotas privadas.
- [x] Clients Supabase `server`, `browser` e `admin`.
- [x] Migration `0001_fundacao.sql` aplicada com `integrantes`, `ambientes`, `times`, `integrantes_times` e RLS inicial.
- [x] Migration aplicada via Supabase CLI no ambiente linkado (`clnqvzcrnuxnktnpktib`).
- [x] `types/database.ts` gerado a partir do schema real.
- [x] Resend configurado e magic link validado.
- [x] Usuário de teste criado para validação local.

## Escopo Entregue

### 1. Auth End-to-End

- [x] Server Action `entrarComSenha`.
- [x] Server Action `entrarComMagicLink`.
- [x] Route Handler `app/auth/callback/route.ts` com `exchangeCodeForSession`.
- [x] Logout via Server Action `sair`.
- [x] Rate limit básico de login/magic link: 5 tentativas por 15 minutos por e-mail/IP em memória.
- [x] Recebimento real de magic link validado via Resend.

### 2. Schema Inicial + RLS

Modelo entregue:

- `auth.users`: identidade Supabase.
- `integrantes`: perfil corporativo do usuário.
- `ambientes`: Diretoria, Comercial e PCP.
- `times`: times por ambiente.
- `integrantes_times`: pertencimento contextual.

Checklist:

- [x] Migration fundacional versionada (`0001_fundacao.sql`).
- [x] Seeds de ambientes e times dentro da migration.
- [x] Helpers SQL de role e pertencimento.
- [x] RLS habilitado nas tabelas fundacionais.
- [x] Script `scripts/seed-pilotos.mjs` para criar 5 usuários piloto.
- [x] Migration aplicada com Supabase CLI.
- [x] `npm run types:generate` rodado e commitado.

### 3. Shell Do App

- [x] `app/(app)/layout.tsx` com shell server-side.
- [x] Sidebar com 5 itens e ícones Lucide.
- [x] Header com role badge, avatar e sino placeholder.
- [x] `/home` com saudação vinda de `integrantes`.
- [x] Mobile bottom nav para telas menores que 768px.

### 4. CI/CD + DX

- [x] Scripts principais em `package.json`.
- [x] `scripts/ensure-supabase-cli.mjs` para falhar de forma clara sem CLI.
- [x] `.github/workflows/ci.yml` com lint, typecheck e build.
- [x] Husky pre-commit com lint + typecheck.

### 5. Documentação E Git

- [x] `docs/RUNBOOK.md` em primeira versão.
- [x] Branch de fechamento partindo de `develop`.

## Pendências de Limpeza Carregadas para Esquadro

Itens pequenos que não bloqueiam Phase 1 mas precisam ser resolvidos junto com o primeiro PR de Esquadro:

- [ ] Arquivo `app/server/actions/auth/entrar-com-senha.ts` está vazio (0 bytes) — código real vive em `server/actions/auth/`. Padronizar em **`server/actions/<dominio>/`** (raiz, não dentro de `app/`) e remover o resíduo.
- [ ] Tag `v0.1.0-risca` no `main` (após primeiro deploy de homologação).
- [ ] Teste visual final em 375px com usuário real (validar com Marcus em mobile).
- [ ] Checkpoint 02 com Arali (Diretoria valida login + shell).
- [ ] Preview Vercel formalmente associado ao projeto.
- [ ] Sentry conectado com DSN/auth token.

## Entregáveis Confirmados

1. App branded rodando localmente. ✅
2. Login por senha e magic link funcionando. ✅
3. Shell autenticado com dados reais de `integrantes`. ✅
4. Migration fundacional aplicada e tipos gerados. ✅
5. RLS habilitado nas tabelas fundacionais. ✅
6. CI verde nos commits de fechamento. ✅
7. Runbook suficiente para setup novo. ✅

## Definição De Pronto — Status

- [ ] Tag `v0.1.0-risca` (a fechar com primeiro deploy)
- [ ] Deploy de produção/homologação ativo (Vercel)
- [x] Auth funcional para 5 usuários piloto
- [x] RLS habilitado e auditável em SQL puro
- [x] CI verde
- [ ] Checkpoint 02 com Arali
- [x] `docs/RUNBOOK.md` criado

> Os 4 itens pendentes não bloqueiam o início da Esquadro — são tarefas de empacotamento/cliente que rodam em paralelo com o primeiro PR de Phase 1.

**Próxima etapa**: [`PHASE_1_ESQUADRO.md`](./PHASE_1_ESQUADRO.md)
