# 📍 Fase 0 — RISCA

> *"Antes de cortar, marca-se a madeira. Risca define onde tudo vai começar — e não há peça boa nascida de uma marcação ruim."*

---

## 🎯 Objetivo da Etapa

Estabelecer a **fundação técnica e visual** sobre a qual as próximas 12 semanas serão construídas. Ao final da Risca, o sistema **não tem features de negócio**, mas tem:

- Identidade visual aplicada (Luxo Discreto vivo no shell)
- Auth funcional ponta a ponta
- Banco com RLS desde a primeira linha
- Estrutura de Times e Permissões pronta para receber Projetos na próxima etapa
- Pipeline de CI verde com lint + typecheck + build

**Critério de Pronto**: Marcus consegue logar na URL de homologação, vê o sidebar com a paleta noir+gold, e existe uma `home/` placeholder que não é o template Vercel.

---

## 📅 Duração

**4 semanas** — Mês 1 do cronograma de 4 meses.

---

## 🧱 Escopo Detalhado

### 1. Branding Aplicado (Semana 1)
- [ ] Tokens em `app/globals.css` substituídos pelos valores oficiais (`noir`, `wood`, `gold`, `amber`, `neutral`)
- [ ] `tailwind.config.ts` (ou equivalente Tailwind v4) carrega cores semânticas
- [ ] Fontes Inter + Cormorant Garamond + JetBrains Mono via `next/font/google`
- [ ] `app/layout.tsx` com lang `pt-BR`, dark-mode default, body em `bg-noir-900 text-neutral-50`
- [ ] Página `/` neutra com logo placeholder "ARALI ✦ FLOW" em Cormorant

### 2. Estrutura de Pastas (Semana 1)
Criar (vazio com README ou `index.ts` placeholder):

```
components/{ui,shell,ambientes,projeto,feed,times,shared}/
lib/{supabase,auth,permissions,validations,utils,constants}/
hooks/
server/{actions,queries,services}/
types/{database.ts,domain.ts,api.ts}
supabase/{migrations,functions,policies,seed.sql,config.toml}
tests/
```

### 3. Supabase + Clients (Semana 1-2)
- [ ] `lib/supabase/server.ts` — `createServerClient` com cookies
- [ ] `lib/supabase/browser.ts` — `createBrowserClient`
- [ ] `lib/supabase/admin.ts` — Service Role (somente Edge Functions / Server Actions privilegiadas)
- [ ] Tipos auto-gerados via `pnpm types:generate` (script real no `package.json`)

### 4. Auth End-to-End (Semana 2)
- [ ] Server Action `entrarComSenha` (preencher arquivo vazio existente)
- [ ] Server Action `entrarComMagicLink`
- [ ] Route Handler `app/auth/callback/route.ts` (preencher)
- [ ] Página `/login` com form + Zod + React Hook Form + microcopy do branding
- [ ] Middleware `middleware.ts` que protege rotas `/(app)/*`
- [ ] Logout server action
- [ ] Rate limit em login (5 tentativas / 15 min)

### 5. Schema Inicial + RLS (Semana 2-3)
Migration única (`supabase/migrations/0001_fundacao.sql`) com:

**Tabelas**:
- `usuarios` (perfil estendido de `auth.users`)
- `ambientes` (Diretoria, Comercial, PCP — seed)
- `times` (1+ por Ambiente)
- `integrantes` (vínculo `usuario` ↔ `time` com `papel`: gestor/lider/integrante)
- `integrantes_times` (associação N:N para gestores que cobrem múltiplos times)

**Helper functions SQL**:
- `is_diretoria(uid)`
- `is_admin(uid)`
- `is_gestor_de_time(uid, time_id)`
- `is_lider_de_time(uid, time_id)`
- `is_integrante_de_time(uid, time_id)`

**RLS habilitado em todas, com policies básicas**:
- SELECT: integrante vê seu time, gestor vê times atribuídos, diretoria vê tudo
- INSERT/UPDATE/DELETE: admin/diretoria

### 6. Shell do App (Semana 3)
- [ ] `app/(app)/layout.tsx` com Sidebar + Header + outlet
- [ ] Sidebar com 5 itens (Home, Projetos, Time, Feed Geral, Configurações) com ícones Lucide
- [ ] Header com avatar do usuário + role badge + sino de notificações (placeholder)
- [ ] `app/(app)/home/page.tsx` placeholder com saudação personalizada (`Bem-vindo, {nome}`)
- [ ] Mobile: bottom nav 4 ícones em telas <768px
- [ ] Layout testado em 375px de largura (mobile-first)

### 7. CI/CD + DX (Semana 3-4)
- [ ] `.github/workflows/ci.yml` com lint + typecheck + build em PR
- [ ] `.github/workflows/preview.yml` integrado ao Vercel
- [ ] Scripts no `package.json`: `dev`, `build`, `start`, `lint`, `lint:fix`, `typecheck`, `format`, `test`, `types:generate`, `db:migrate`, `db:reset`, `db:seed`, `health:check`
- [ ] Vitest configurado (mesmo sem testes ainda)
- [ ] Prettier configurado
- [ ] Husky pre-commit (lint + typecheck)
- [ ] Sentry conectado ao Vercel project
- [ ] Resend conectado e e-mail de boas-vindas testado
- [ ] Vercel: variáveis de ambiente das envs `Development`, `Preview`, `Production`

### 8. Higiene de Git (transversal)
- [ ] Limpar working tree atual (8 arquivos modificados sem commit)
- [ ] Commits conventional: `feat:`, `fix:`, `chore:`, `docs:`, `refactor:`
- [ ] Branch `feature/risca` partindo de `develop`
- [ ] PRs pequenos (1 PR por sub-escopo acima)
- [ ] Tag `v0.1.0-risca` ao fechar a etapa

---

## 🔑 Entregáveis Tangíveis ao Fim da Risca

1. URL de homologação `https://arali-flow-staging.vercel.app` viva
2. Login com magic link funcionando para 1 usuário-piloto (você)
3. Sidebar branded carregando em <2s em mobile real
4. Migration `0001_fundacao.sql` aplicada em Prod e HML
5. CI verde no `develop` e no `staging`
6. README com instruções de setup que **funcionam** quando alguém novo clona

---

## 🎯 Checkpoints com Arali (Mês 1)

| # | Quando | Pauta |
|---|---|---|
| 01 | Início da Semana 2 | Validar paleta visual + microcopy + nomenclatura (Pasta, Ambiente, Time, Integrante) |
| 02 | Fim da Semana 4 | Demo do shell + onboarding inicial dos primeiros 5 usuários (Gestor + 4 Líderes) |

---

## ⚠️ Riscos da Etapa

| Risco | Mitigação |
|---|---|
| Perfeccionismo no branding atrasa Auth | Aplica tokens uma vez, valida visual rápido, segue para Auth |
| RLS quebrado deixa rotas vazias | Testar cada policy com 3 perfis diferentes (integrante, líder, diretoria) na seed |
| Magic link não chega via Resend | Ter fallback de senha desde o dia 1 + log Sentry em falhas de envio |
| Working tree atual com 8 arquivos não commitados gerar conflitos | Commit ou stash limpo antes de iniciar `feature/risca` |

---

## 📌 Definição de Pronto da Etapa

- [ ] Tag `v0.1.0-risca` no `main`
- [ ] Vercel Production deployando o app branded
- [ ] Auth funcional para 5 usuários reais cadastrados na Arali
- [ ] RLS testado com 3 perfis em SQL puro
- [ ] CI/CD verde nos últimos 5 PRs
- [ ] Checkpoint 02 com Arali concluído
- [ ] Documentação `docs/RUNBOOK.md` em primeira versão (como subir o app, como rodar migration)

---

**Versão**: 1.0
**Última atualização**: 2026-04-29
**Etapa anterior**: — (primeira etapa)
**Próxima etapa**: [`PHASE_1_ESQUADRO.md`](./PHASE_1_ESQUADRO.md)
