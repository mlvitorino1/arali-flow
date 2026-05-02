# Fase 0 — RISCA

> Antes de cortar, marca-se a madeira. Risca define onde tudo começa: base visual, autenticação, RLS, DX e uma primeira experiência navegável.

## Objetivo

Estabelecer a fundação técnica e visual para as próximas fases do Arali Flow. Ao final da Risca, o sistema ainda não entrega os módulos de negócio do Comercial/PCP, mas já permite login real, shell autenticado, schema fundacional com RLS, pipeline mínimo e documentação de operação.

**Critério de pronto**: Marcus consegue logar com usuário real, acessar `/home`, ver sidebar/header branded, sair da sessão, e o projeto tem migration, CI e runbook suficientes para outro dev subir a base.

## Status Atual

- [x] Branding aplicado com tokens oficiais em `app/globals.css`.
- [x] Tailwind v4 configurado via `@theme inline`.
- [x] Fontes Montserrat, DM Sans e JetBrains Mono via `next/font/google`.
- [x] `app/layout.tsx` com `lang="pt-BR"`, dark mode default e anti-flash.
- [x] Shell autenticado com sidebar, header, bottom nav mobile e theme toggle.
- [x] Login por senha com Supabase.
- [x] Middleware protegendo rotas privadas.
- [x] Clients Supabase `server`, `browser` e `admin`.
- [x] Migration `0001_fundacao.sql` com `integrantes`, `ambientes`, `times`, `integrantes_times` e RLS inicial.
- [x] Usuário de teste criado para validação local.
- [ ] Supabase CLI disponível no ambiente.
- [ ] Migration aplicada por CLI em ambiente local/homologação.
- [ ] `types/database.ts` gerado a partir do schema real.
- [ ] RLS validado em SQL puro com 3 perfis.
- [ ] Integrações externas Vercel/Sentry/Resend confirmadas com credenciais reais.

## Escopo Para Fechamento

### 1. Auth End-to-End

- [x] Server Action `entrarComSenha`.
- [x] Server Action `entrarComMagicLink`.
- [x] Route Handler `app/auth/callback/route.ts` com `exchangeCodeForSession`.
- [x] Logout via Server Action `sair`.
- [x] Rate limit básico de login/magic link: 5 tentativas por 15 minutos por e-mail/IP em memória.
- [ ] Validar recebimento real de magic link via provedor de e-mail.

### 2. Schema Inicial + RLS

Modelo adotado:

- `auth.users`: identidade Supabase.
- `integrantes`: perfil corporativo do usuário.
- `ambientes`: Diretoria, Comercial e PCP.
- `times`: times por ambiente.
- `integrantes_times`: pertencimento contextual.

Checklist:

- [x] Migration fundacional versionada.
- [x] Seeds de ambientes e times dentro da migration.
- [x] Helpers SQL de role e pertencimento.
- [x] RLS habilitado nas tabelas fundacionais.
- [x] Script `scripts/seed-pilotos.mjs` para criar 5 usuários piloto.
- [ ] Aplicar migration com Supabase CLI.
- [ ] Rodar `npm run types:generate`.
- [ ] Executar testes SQL de RLS com `integrante`, `lider/gestor` e `admin/diretoria`.

### 3. Shell Do App

- [x] `app/(app)/layout.tsx` com shell server-side.
- [x] Sidebar com 5 itens e ícones Lucide.
- [x] Header com role badge, avatar e sino placeholder.
- [x] `/home` com saudação vinda de `integrantes`.
- [x] Mobile bottom nav para telas menores que 768px.
- [ ] Teste visual final em 375px com usuário real.

### 4. CI/CD + DX

- [x] Scripts principais em `package.json`.
- [x] `scripts/ensure-supabase-cli.mjs` para falhar de forma clara sem CLI.
- [x] `.github/workflows/ci.yml` com lint, typecheck e build.
- [x] Husky pre-commit com lint + typecheck.
- [ ] Preview Vercel configurado.
- [ ] Sentry conectado ao projeto.
- [ ] Resend configurado e magic link validado.

### 5. Documentação E Git

- [x] `docs/RUNBOOK.md` em primeira versão.
- [ ] Working tree limpo em PRs pequenos.
- [ ] Branch de fechamento partindo de `develop`.
- [ ] Tag `v0.1.0-risca` após merge final.

## Entregáveis

1. App branded rodando localmente e em homologação.
2. Login por senha e magic link funcionando.
3. Shell autenticado com dados reais de `integrantes`.
4. Migration fundacional aplicada.
5. RLS validado com 3 perfis.
6. CI verde.
7. Runbook suficiente para setup novo.

## Bloqueios Externos

- Supabase CLI precisa estar instalada e linkada para aplicar migrations e gerar tipos.
- Vercel precisa de acesso ao projeto e variáveis por ambiente.
- Resend precisa de chave e domínio/remetente configurado para validar magic link.
- Sentry precisa de DSN/auth token reais para entrar como concluído.

## Definição De Pronto

- [ ] Tag `v0.1.0-risca`.
- [ ] Deploy de produção/homologação ativo.
- [ ] Auth funcional para 5 usuários piloto.
- [ ] RLS validado em SQL puro.
- [ ] CI verde.
- [ ] Checkpoint 02 com Arali concluído.
- [x] `docs/RUNBOOK.md` criado.

**Próxima etapa**: [`PHASE_1_ESQUADRO.md`](./PHASE_1_ESQUADRO.md)
