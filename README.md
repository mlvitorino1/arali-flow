# 🪵 Arali Flow

> **Sistema operacional digital interno da Arali Móveis** — orquestra o ciclo de vida completo de cada Projeto através dos ambientes da marcenaria, transformando processos manuais em fluxo digital auditável, com timeline paralela, governança e segurança corporativa.

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]() [![Stack](https://img.shields.io/badge/stack-Next.js%2015%20%7C%20Supabase-black)]() [![Tenant](https://img.shields.io/badge/modelo-Single--Tenant-blue)]() [![Idioma](https://img.shields.io/badge/idioma-PT--BR-green)]() [![License](https://img.shields.io/badge/license-Proprietary-red)]()

---

## 📑 Índice

1. [Proposta de Valor](#-proposta-de-valor)
2. [Decisões Arquiteturais Consolidadas](#-decisões-arquiteturais-consolidadas)
3. [Contrato Comercial](#-contrato-comercial)
4. [Getting Started](#-getting-started)
5. [Pré-requisitos](#-pré-requisitos)
6. [Setup do Ambiente](#-setup-do-ambiente)
7. [Setup Local](#-setup-local)
8. [Comandos Disponíveis](#-comandos-disponíveis)
9. [Arquitetura do Projeto](#-arquitetura-do-projeto)
10. [Modelo de Domínio](#-modelo-de-domínio)
11. [Permissões e Hierarquia](#-permissões-e-hierarquia)
12. [Realtime — Critério Técnico](#-realtime--critério-técnico)
13. [Segurança](#-segurança)
14. [Custos de Infraestrutura](#-custos-de-infraestrutura)
15. [Roadmap](#-roadmap)
16. [Cronograma de 4 Meses](#-cronograma-de-4-meses)
17. [Contribuindo](#-contribuindo)
18. [Padrões de Código](#-padrões-de-código)
19. [Documentação Adicional](#-documentação-adicional)
20. [Suporte](#-suporte)
21. [License](#-license)

---

## 🎯 Proposta de Valor

### O Problema
A **Arali Móveis** — marcenaria de altíssimo padrão atendendo arquitetos como MK27, Bernardes, Jacobsen, Studio Arthur Casas e Isay Weinfeld — opera 26 projetos simultâneos atravessando múltiplas áreas (Comercial, PCP, Engenharia, Suprimentos, Produção, Obra) com:

- Comunicação fragmentada entre times (WhatsApp, planilhas, e-mail)
- **Duas planilhas Excel críticas** carregando milhões de reais em movimento mensal:
  - "Controle de Entrada de Orçamento e Obra Contratada" (pipeline comercial)
  - "01A Recebimento Entrada" (caixa por projeto)
- Confirmações registradas em texto livre tipo "CONFIRMADO VIA WHATSAPP PELA MARIANA DIA 13/02"
- Falta de rastreabilidade do projeto através das etapas (sufixos OS R/E/CD/OP só na cabeça das pessoas)
- Decisões importantes perdidas em conversas informais
- Hierarquia e responsabilidades difusas entre os 60 usuários
- Indicadores operacionais inexistentes ou defasados
- Retrabalho causado por handoffs ruins entre Comercial → PCP → Engenharia → Produção → Obra

### A Solução
**Arali Flow** centraliza toda a operação em um sistema único, onde:

- ✅ Cada **Projeto** tem uma **Pasta do Projeto** com timeline paralela visível para todos os Times envolvidos
- ✅ Cada **Ambiente** possui suas **Ferramentas próprias** (módulos especializados)
- ✅ Cada **Integrante** tem **Tasks atribuídas** dentro da Pasta do Projeto, com hierarquia clara
- ✅ **Feed inteligente** (Time + Geral) com curtidas, encaminhamentos, menções, filtros e check-ins
- ✅ **Posts automáticos** vindos de Tasks concluídas/atualizadas (futuro próximo)
- ✅ **Métricas em tempo real** por Time e Projeto
- ✅ **Permissões granulares** via Row Level Security (RLS)
- ✅ **PWA** — funciona em mobile, com base offline para futura expansão à Obra

### Diferencial Competitivo
| Característica | ERPs Genéricos | Arali Flow |
|---|---|---|
| Vertical Marcenaria Premium | ❌ | ✅ |
| Pasta do Projeto unificada (paralelismo entre Times) | ❌ | ✅ |
| Feed operacional com encaminhamento compartilhado | ❌ | ✅ |
| Ferramentas modulares por Ambiente | Parcial | ✅ |
| RLS nativo (segurança por linha) | ❌ | ✅ |
| Posts automáticos vindos de Tasks | ❌ | ✅ Roadmap |

### Resultado Esperado
- **Eliminação das planilhas Excel desatualizadas**
- **Redução de retrabalho** entre ambientes
- **Visibilidade executiva** em tempo real para Diretoria
- **Aumento da velocidade** de entrega de projetos
- **Auditoria completa** de decisões e movimentações
- **Padronização** da operação independente de pessoas-chave

---

## 🏛️ Decisões Arquiteturais Consolidadas

> Decisões fechadas a partir dos checkpoints iniciais com Marcus Vitorino (Founder) e Arali Móveis (Cliente).

| # | Decisão | Status |
|---|---|---|
| 01 | **Single-tenant** — produto interno exclusivo Arali (sem multi-tenancy) | ✅ Fechado |
| 02 | **Sem módulo Fiscal/Contábil** no MVP — Arali continua usando sistemas antigos | ✅ Fechado |
| 03 | **Stack frontend**: Next.js **15 LTS** (App Router) — *runtime de produção fixo*. Geração inicial de UI sob avaliação de novas abordagens (Claude Suite/Code, Cursor, v0 by Vercel, Antigravity, Bubble) após atrito na migração via Lovable. Prompt mestre versionado em [`docs/ai/PROMPT_FRONTEND_SYSTEM_DESIGN.md`](./docs/ai/PROMPT_FRONTEND_SYSTEM_DESIGN.md) — qualquer ferramenta usada deve gerar código compatível com o runtime fixo. Decisão registrada em [`docs/DECISIONS/ADR-001-stack-frontend.md`](./docs/DECISIONS/ADR-001-stack-frontend.md). | ✅ Fechado |
| 04 | **Stack backend**: Supabase (PostgreSQL + Auth + Storage + Realtime) | ✅ Fechado |
| 05 | **Hosting**: Vercel (frontend) + Supabase (backend) | ✅ Fechado |
| 06 | **MVP escopo**: Diretoria + Comercial + PCP (3 ambientes, não 7) | ✅ Fechado |
| 07 | **Idioma**: 100% PT-BR (sem i18n no MVP) | ✅ Fechado |
| 08 | **Paralelismo na Pasta do Projeto** (sem etapas sequenciais bloqueantes) | ✅ Fechado |
| 09 | **Tasks** como unidade de trabalho dentro da Pasta do Projeto | ✅ Fechado |
| 10 | **Forward de Post** = post compartilhado N:N entre feeds (não duplicado) | ✅ Fechado |
| 11 | **Realtime** apenas em Feed e Timeline da Pasta do Projeto | ✅ Fechado |
| 12 | **PWA** desde o MVP (mobile-friendly, offline em fase futura) | ✅ Fechado |
| 13 | **Cliente final e fornecedores não acessam o sistema** no MVP | ✅ Fechado |
| 14 | **Portal do Arquiteto** = roadmap futuro (documentado, não implementado) | 📌 Roadmap |
| 15 | **Branding inicial**: Luxo discreto (Preto, Madeira, Gold, Alaranjado) | ✅ Fechado |
| 16 | **Time composição**: até 10 Integrantes + 2 Líderes + 2 Gestores | ✅ Fechado |
| 17 | **Teto de infraestrutura**: R$500/mês | ✅ Fechado |
| 18 | **Prazo go-live MVP**: 4 meses | ✅ Fechado |
| 19 | **Escala MVP**: 60 usuários ativos, 26 Projetos simultâneos | ✅ Fechado |
| 20 | **IP do produto**: LIOMA IT (replicável em outras marcenarias premium em Verniz, sempre single-tenant deployment) | ✅ Fechado |

📄 ADRs detalhados: [`docs/DECISIONS/`](./docs/DECISIONS/)

---

## 💼 Contrato Comercial

> **Modelo comercial e dados financeiros do cliente NÃO ficam neste repositório.**
>
> O contrato é tratado como ativo do **departamento Lioma IT** (área comercial), com versionamento próprio. Esta seção existe apenas para deixar explícito que o cronograma técnico (ver [Cronograma](#-cronograma-de-4-meses)) é dependente do marco de assinatura.
>
> - **Modelo de contrato vigente**: `MODELO_CONTRATO_LIOMA_IT.md` (gerido pela área comercial Lioma IT)
> - **Tipo**: Personalizado por cliente, fases de Diagnóstico → MVP → Produção
> - **Vigência padrão**: 6 meses (piloto) + 12 meses (produção) = 18 meses totais
> - **Suporte incluso**: Atendimento direto via WhatsApp com SLA de same-day, tratamento de erro com causa raiz, dúvidas e pequenas alterações
> - **Mudanças de escopo**: Tratadas como projeto separado (proposta em anexo)
>
> Status do cliente atual e detalhes financeiros são acompanhados internamente.

---

## 🚀 Getting Started

```bash
# Clone o repositório
git clone https://github.com/arali/arali-flow.git
cd arali-flow

# Instale dependências
pnpm install

# Configure variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas credenciais Supabase

# Rode em modo desenvolvimento
pnpm dev
```

A aplicação estará disponível em `http://localhost:3000`.

---

## 📋 Pré-requisitos

| Ferramenta | Versão Mínima | Notas |
|---|---|---|
| **Node.js** | 20.x LTS | Requerido pelo Next.js 15 |
| **pnpm** | 9.x | Gerenciador oficial do projeto |
| **Git** | 2.40+ | Controle de versão |
| **Conta Supabase** | — | Plano Free para dev, Pro para produção |
| **Conta Vercel** | — | Hosting + Preview Deploys |
| **Conta GitHub** | — | Repositório + Actions |
| **VS Code** (recomendado) | latest | Com extensões oficiais |

### Extensões VS Code recomendadas
- ESLint, Prettier
- Tailwind CSS IntelliSense
- GitLens, Error Lens
- Pretty TypeScript Errors
- Supabase (extensão oficial)

---

## ⚙️ Setup do Ambiente

### 1. Variáveis de Ambiente

Crie `.env.local` baseado em `.env.example`:

```bash
# ============================================
# SUPABASE
# ============================================
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...     # NUNCA exponha no client

# ============================================
# APLICAÇÃO
# ============================================
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_ENV=development          # development | preview | production

# ============================================
# OBSERVABILIDADE
# ============================================
SENTRY_DSN=
SENTRY_AUTH_TOKEN=

# ============================================
# E-MAIL (Resend)
# ============================================
RESEND_API_KEY=

# ============================================
# FEATURE FLAGS
# ============================================
NEXT_PUBLIC_FEATURE_FEED_ENCAMINHAMENTO=true
NEXT_PUBLIC_FEATURE_PWA=true
NEXT_PUBLIC_FEATURE_TASK_AUTO_POST=false
```

### 2. Configuração do Supabase

```bash
npm install -g supabase
supabase login
supabase link --project-ref <PROJECT_REF>
supabase db push
pnpm types:generate
```

### 3. Estrutura de Branches

```
main           → produção (deploy automático Vercel)
staging        → homologação (preview Vercel)
develop        → integração contínua
feature/*      → desenvolvimento de features
fix/*          → correções
hotfix/*       → correções emergenciais em produção
```

---

## 💻 Setup Local

```bash
# 1. Clone e Node 20
git clone https://github.com/arali/arali-flow.git
cd arali-flow
nvm install 20 && nvm use 20

# 2. pnpm + dependências
npm install -g pnpm
pnpm install

# 3. Variáveis e tipos
cp .env.example .env.local
pnpm types:generate

# 4. Rode
pnpm dev
```

---

## 🛠️ Comandos Disponíveis

| Comando | Descrição |
|---|---|
| `pnpm dev` | Servidor de desenvolvimento |
| `pnpm build` | Build de produção |
| `pnpm start` | Servidor de produção |
| `pnpm lint` / `lint:fix` | ESLint |
| `pnpm typecheck` | Validação TypeScript |
| `pnpm format` | Prettier |
| `pnpm test` | Testes unitários (Vitest) |
| `pnpm test:e2e` | Testes E2E (Playwright) |
| `pnpm test:coverage` | Cobertura |
| `pnpm types:generate` | Gera tipos do Supabase |
| `pnpm db:migrate` | Aplica migrations |
| `pnpm db:reset` | Reseta DB local (⚠️ destrutivo) |
| `pnpm db:seed` | Popula com dados de teste |
| `pnpm health:check` | Valida ambiente local |
| `pnpm analyze` | Analisa bundle size |

---

## 🏗️ Arquitetura do Projeto

### Princípios Arquiteturais

1. **Single-tenant deployment, multi-tenant ready code** — cada cliente Lioma roda em sua própria instância Supabase + Vercel, mas o código é escrito assumindo que `tenant_id` (implícito) existe em toda RLS policy. Replicação para o 2º cliente premium custa apenas provisionamento.
2. **Server-first by default** — Server Components, Server Actions e Edge Functions são a regra. Client Components (`"use client"`) só onde há interatividade real (forms, modais, listas com filtro local, tempo real).
3. **RLS como única fonte de verdade de autorização** — nada de checar permissão duas vezes (no client e no banco). O banco é a verdade. O client confia na resposta filtrada.
4. **Realtime cirúrgico** — Realtime ligado apenas onde colaboração simultânea muda a UX. Resto é refetch ou polling. Custo previsível.
5. **Observabilidade desde o dia 1** — Sentry + audit logs + Supabase logs + Vercel Analytics. Sem deploy sem dashboards.
6. **Domínio em PT-BR, infra em EN** — `pasta_projeto`, `tasks`, `integrantes_times` (PT) coexistem com `lib/supabase/server-client.ts`, `hooks/use-realtime-feed.ts` (EN). Reduz ambiguidade para devs e IA assistida.
7. **Mobile-first** — toda tela é projetada primeiro para 375px, depois desktop. PWA desde o MVP, com base offline preparada para Obra na Etapa 4.

### Visão Macro (C4 — Container)

```
┌──────────────────────────────────────────────────────────────┐
│                     USUÁRIO (60 contas)                       │
│   Mobile (PWA) ── Desktop (PWA) ── Diretoria (Desktop)        │
└──────────────────────────────┬───────────────────────────────┘
                               │  HTTPS + WSS (Realtime)
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                     CLOUDFLARE (Free)                         │
│        DNS + Proxy + WAF básico + DDoS Protection             │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                   VERCEL (Edge + Node)                        │
│  ┌────────────────────────────────────────────────────────┐  │
│  │  Next.js 15 App Router                                  │  │
│  │  ├── React Server Components (default)                  │  │
│  │  ├── Server Actions (mutations)                         │  │
│  │  ├── Route Handlers (webhooks, integrações)             │  │
│  │  └── Client Components (forms, realtime, interatividade)│  │
│  │                                                          │  │
│  │  UI: Tailwind + Shadcn UI + Framer Motion + Lucide      │  │
│  │  Data: TanStack Query (client) + RSC cache (server)     │  │
│  │  Forms: React Hook Form + Zod                            │  │
│  └────────────────────────────────────────────────────────┘  │
└──────────────────────────────┬───────────────────────────────┘
                               ▼
┌──────────────────────────────────────────────────────────────┐
│                       SUPABASE (Pro)                          │
│  ┌────────────┬────────────┬────────────┬─────────────────┐  │
│  │ PostgreSQL │    Auth    │  Storage   │ Edge Functions  │  │
│  │   + RLS    │  (JWT+MFA) │ (signed)   │     (Deno)      │  │
│  ├────────────┴────────────┴────────────┴─────────────────┤  │
│  │  Realtime Channels (Feed, Timeline, Tasks, Notif, RBAC)  │  │
│  ├──────────────────────────────────────────────────────────┤  │
│  │  Materialized Views (KPIs Diretoria, refresh 5min)       │  │
│  │  Triggers (audit log, timeline events, notif fan-out)    │  │
│  │  Helper Functions (is_diretoria, is_lider_de_time, ...)  │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────────────────┬───────────────────────────────────┘
                           ▼
┌──────────────────────────────────────────────────────────────┐
│                  OBSERVABILIDADE & SUPORTE                    │
│   Sentry (errors/perf) ── Vercel Analytics ── Supabase Logs   │
│             Resend (email) ── Slack webhook (alertas crit.)   │
└──────────────────────────────────────────────────────────────┘
```

### Camadas Lógicas

| Camada | Responsabilidade | Tecnologia | Onde mora |
|---|---|---|---|
| **Presentation** | Renderizar UI, capturar input | RSC + Client Components | `app/`, `components/` |
| **Application** | Orquestrar use cases | Server Actions, Route Handlers | `app/api/`, `server/actions/` |
| **Domain** | Regras de negócio puras | TypeScript funcional | `server/services/`, `lib/domain/` |
| **Persistence** | Acesso a dados | Supabase client + Postgres | `lib/supabase/`, `server/queries/` |
| **Authorization** | RLS + RBAC | PostgreSQL policies + helpers | `supabase/policies/`, `lib/permissions/` |
| **Realtime** | Pub/sub cirúrgico | Supabase Channels | `hooks/use-realtime-*.ts` |
| **Observability** | Logs, traces, métricas | Sentry + Supabase logs | `lib/observability/` |

### Fluxo Crítico — "Distribuir Projeto a Time" (exemplo)

```
1. Líder/Gestor clica "Atribuir Time" na Pasta do Projeto
2. Client Component → Server Action distribuirProjetoAoTime(projetoId, timeId)
3. Server Action valida com Zod schema
4. Server Action chama service.distribuirProjeto() (domain)
5. Service consulta permissão via lib/permissions (cache local)
6. Service grava em projetos_times (RLS bloqueia se permissão faltar)
7. Trigger Postgres cria evento na timeline + notificação
8. Realtime Channel publica evento → todos os clients na pasta do projeto recebem
9. Server Action retorna { ok: true } → revalidatePath('/projetos/:id/pasta')
10. Audit log gravado assincronamente (Edge Function)
```

### Domínios do Sistema

```
Arali Flow (MVP)
├── 🏛️  Diretoria        → Visão executiva, KPIs, aprovações
├── 💼 Comercial         → Propostas, contratos, recebimentos por projeto
└── 📐 PCP               → Planejamento, controle, programação

Arali Flow (Roadmap)
├── ⚙️  Engenharia        → Projetos técnicos, detalhamentos
├── 📦 Suprimentos       → Compras, fornecedores, estoque
├── 🔨 Produção          → Fábrica, ordens, execução
└── 🏗️  Obra             → Instalação, montagem, entrega
```

### Estrutura de Pastas

```
arali-flow/
├── app/                              # Next.js App Router
│   ├── (auth)/                      # Autenticação
│   │   ├── login/
│   │   └── magic-link/
│   ├── (app)/                       # Área autenticada
│   │   ├── layout.tsx               # Sidebar + Header (shell)
│   │   ├── home/                    # 🏠 Página inicial (cards + feed)
│   │   ├── projetos/                # 📁 Lista de projetos do time
│   │   │   └── [id]/
│   │   │       └── pasta/           # 📂 Pasta do Projeto (modo operação)
│   │   │           ├── page.tsx
│   │   │           ├── timeline/
│   │   │           ├── tasks/
│   │   │           └── ferramentas/
│   │   │               └── [tool]/
│   │   ├── ambientes/               # 3 ambientes (MVP)
│   │   │   ├── diretoria/
│   │   │   ├── comercial/
│   │   │   │   └── ferramentas/
│   │   │   │       └── recebimentos/   # 1ª ferramenta piloto
│   │   │   └── pcp/
│   │   ├── times/                   # Páginas de time
│   │   │   └── [slug]/
│   │   ├── feed/                    # Feed geral
│   │   └── configuracoes/           # Admin, usuários, permissões
│   ├── api/                         # Route Handlers
│   ├── globals.css
│   └── layout.tsx
│
├── components/
│   ├── ui/                          # Shadcn primitives
│   ├── shell/                       # Sidebar, Header, Navigation
│   ├── ambientes/                   # Componentes por ambiente
│   ├── projeto/                     # Pasta do Projeto, Timeline, Tasks
│   ├── feed/                        # Feed, Post, Comment, Mention
│   ├── times/                       # Cards de time, métricas
│   └── shared/
│
├── lib/
│   ├── supabase/                    # server-client / browser-client / admin-client
│   ├── auth/
│   ├── permissions/                 # RBAC + helpers RLS
│   ├── validations/                 # Schemas Zod
│   ├── utils/
│   └── constants/
│
├── hooks/
│   ├── use-realtime-feed.ts
│   ├── use-realtime-timeline.ts
│   ├── use-projeto.ts
│   └── use-permissions.ts
│
├── server/
│   ├── actions/                     # Server Actions (mutations)
│   ├── queries/                     # Reads
│   └── services/                    # Lógica de negócio
│
├── types/
│   ├── database.ts                  # Auto-gerado Supabase
│   ├── domain.ts                    # Tipos de domínio
│   └── api.ts
│
├── supabase/
│   ├── migrations/                  # SQL versionadas
│   ├── functions/                   # Edge Functions (Deno)
│   ├── policies/                    # RLS policies organizadas
│   ├── seed.sql
│   └── config.toml
│
├── public/
│   ├── icons/                       # PWA icons
│   ├── manifest.json
│   └── sw.js
│
├── tests/
├── docs/                            # Documentação completa
│   ├── ARCHITECTURE.md
│   ├── BRANDING.md                  # 🎨 Identidade visual
│   ├── DOMAIN_MODEL.md
│   ├── DATABASE.md
│   ├── SECURITY.md
│   ├── PERMISSIONS.md
│   ├── REALTIME_STRATEGY.md
│   ├── DEPLOYMENT.md
│   ├── RUNBOOK.md
│   ├── CONTRIBUTING.md
│   ├── STYLE_GUIDE.md
│   ├── CHANGELOG.md
│   ├── DECISIONS/                   # ADRs
│   └── ai/                          # 🤖 Contexto para IA assistida
│       ├── CLAUDE.md
│       ├── CONTEXT.md
│       ├── PATTERNS.md
│       ├── PROMPTS.md
│       └── GLOSSARY.md
│
├── .github/workflows/
├── .env.example
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

### Layout de Navegação (Mobile-First)

A Sidebar é **persistente em desktop** (≥1024px), **drawer deslizante em mobile** (<1024px), com badges de contadores em tempo real (notificações, tasks vencidas, posts não lidos no feed do time).

**Sidebar — Itens (MVP):**

| Ordem | Item | Ícone | Acesso | Conteúdo | Badges |
|---|---|---|---|---|---|
| 1 | **Home** | 🏠 | Todos | Cards pessoais (minhas tasks, meus projetos, KPIs do meu Time) + Feed do Time fixado no topo + atalho rápido para Feed Geral | Tasks vencendo hoje |
| 2 | **Projetos** | 📁 | Todos | Lista de Projetos onde o Integrante atua. Líder/Gestor vê todos do Time + distribuição. Diretoria vê todos. Filtros: Status, Prazo, Time, Cliente. | Projetos com revisão pendente |
| 3 | **Meu Time** | 👥 | Todos | Página do Time: composição (Gestores/Líderes/Integrantes), backlog agregado de tasks, métricas operacionais, **Ferramentas do Time** (Recebimentos, Propostas, etc) | — |
| 4 | **Ambientes** | 🏛️ | Diretoria, Gestor, Admin | Acesso cross-time: Diretoria, Comercial, PCP. Cada Ambiente tem suas Ferramentas próprias e métricas agregadas. | Alertas críticos por ambiente |
| 5 | **Feed Geral** | 📰 | Todos | Timeline social da empresa toda (posts, encaminhamentos, menções, reações). Filtros: ambiente, time, autor, tag, projeto. | Posts não lidos com menção a você |
| 6 | **Notificações** | 🔔 | Todos | Inbox unificada: menções, tasks atribuídas, mudanças de status, distribuição de projeto, alertas de revisão | Não lidas |
| 7 | **Configurações** | ⚙️ | Admin, Gestor, Diretoria | Usuários, Times, Permissões, Ferramentas habilitadas, Audit log, integrações | — |

**Footer da Sidebar (sempre visível):**
- Avatar + nome do usuário
- Toggle dark/light mode (light preparado para Etapa 3)
- Atalho rápido "Reportar problema" → abre formulário direto (vai pra Slack do Marcus)
- Logout

**Comportamento Especial:**
- Diretoria e Gestores veem item adicional **"Visão Cross-Time"** na Home (drill-down por ambiente).
- Líder de Time vê seção **"Distribuir Projetos"** dentro de **Projetos** (toggle no topo).
- Integrante NÃO vê **Ambientes** na sidebar (escopo por design — vê apenas seu Time e Pastas onde atua).

### Pasta do Projeto — Modo Operação

A **Pasta do Projeto** é a unidade central de trabalho do sistema. Quando um Integrante clica em um Projeto, ele entra no **modo operação** dessa pasta — o equivalente digital de "puxar a pasta física do armário e abrir na mesa".

#### Conceito

> Uma Pasta do Projeto é o **container vivo** que reúne todos os artefatos, tasks, comunicações e ferramentas relacionados a um Projeto, organizados em uma **Timeline Paralela** onde múltiplos Times trabalham simultaneamente sem se bloquearem.

#### Anatomia da Pasta

```
┌────────────────────────────────────────────────────────────────┐
│  ← Voltar     PROJETO: Apartamento Vila Nova Conceição          │
│               Cliente: Studio Arthur Casas  •  OS: 2026-0042    │
│               Status: 🟢 Em produção (3 times paralelos)         │
├────────────────────────────────────────────────────────────────┤
│  [Timeline] [Tasks] [Ferramentas] [Documentos] [Feed] [Histórico]│
├────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ▼ HEADER FIXO (sticky)                                          │
│  Times ativos: Comercial • PCP • Engenharia                      │
│  Prazo cliente: 18/08/2026     Saúde do projeto: 🟢 No prazo    │
│  Última atualização: há 12 minutos por Mariana (Comercial)       │
│                                                                  │
│  ▼ TIMELINE PARALELA (cross-Time, atualiza em realtime)          │
│  ┌────────────┬───────────────────────────────────┬────────┐   │
│  │ Comercial  │ ████████░░░░░░░░░░░░░░░░░░  60%   │ 🟢     │   │
│  │ PCP        │ ████░░░░░░░░░░░░░░░░░░░░░░  25%   │ 🟡     │   │
│  │ Engenharia │ ████████████░░░░░░░░░░░░░░  80%   │ 🟢     │   │
│  │ Suprimentos│ ░░░░░░░░░░░░░░░░░░░░░░░░░░   0%   │ ⚫     │   │
│  └────────────┴───────────────────────────────────┴────────┘   │
│  ⚠️ 1 revisão pendente (Comercial → corrigir medida do nicho)   │
│                                                                  │
│  ▼ MINHAS TASKS NESTE PROJETO (3 abertas)                        │
│  🔴 Validar planilha de recebimentos       Venc: 02/05  P0       │
│  🟡 Aprovar proposta revisada               Venc: 30/04  P1       │
│  ✅ Conferir contrato assinado              Concluída em 28/04   │
│                                                                  │
│  ▼ FERRAMENTAS DO MEU TIME (Comercial)                           │
│  [💰 Recebimentos] [📋 Propostas] [📑 Contratos]                │
│                                                                  │
│  ▼ ATIVIDADE RECENTE (últimas 24h)                               │
│  • Carlos (PCP) atualizou status de 'Programar serralheria'      │
│  • Mariana (Comercial) anexou contrato assinado.pdf              │
│  • Engenharia concluiu 3 tasks                                    │
│                                                                  │
└────────────────────────────────────────────────────────────────┘
```

#### Abas da Pasta (todas com Realtime onde aplicável)

| Aba | Conteúdo | Realtime? | Acesso |
|---|---|---|---|
| **Timeline** | Linha do tempo cross-Time com % conclusão e eventos cronológicos | ✅ Sim | Times participantes + Diretoria |
| **Tasks** | Kanban/Lista de Tasks da Pasta filtrável por Time, status, owner, prazo | ✅ Sim | Times participantes |
| **Ferramentas** | Instâncias das Ferramentas dos Times ativos (ex: aba Recebimentos do Comercial) | Por ferramenta | Times participantes |
| **Documentos** | Arquivos do projeto (contratos, PDFs, plantas, fotos) com versionamento | ❌ Refetch | Times participantes |
| **Feed** | Posts vinculados a este Projeto (subset do Feed Geral) | ✅ Sim | Times participantes |
| **Histórico** | Audit log de tudo que aconteceu na Pasta | ❌ Refetch | Líder+, Gestor, Diretoria |

#### Estados da Pasta

```
draft → ativa → em_revisao → ativa → concluida → arquivada
                     ↑__________│
                  (loop possível, sem bloquear paralelismo)
```

- **draft** — Comercial criou mas ainda não distribuiu para outros Times
- **ativa** — pelo menos 1 Time participante com Tasks abertas
- **em_revisao** — existe pelo menos 1 Task tipo `revisao` pendente (alerta visual)
- **concluida** — todos os Times marcaram suas frentes como concluídas + aprovação Gestor/Diretoria
- **arquivada** — projeto fechado, mantido para auditoria (read-only, sai dos filtros padrão)

#### Permissões dentro da Pasta

- Apenas **Times participantes** veem a Pasta (via RLS).
- **Líder do Time** vê todas as Tasks de seu Time naquela Pasta.
- **Integrante** vê apenas Tasks atribuídas a si + Tasks "públicas do Time".
- **Gestor cross-Time** que distribuiu o projeto vê tudo dos Times sob sua coordenação.
- **Diretoria** sempre vê tudo, com filtros de drill-down.

📄 Detalhes em [`docs/DOMAIN_MODEL.md`](./docs/DOMAIN_MODEL.md)

---

## 🧬 Modelo de Domínio

### Entidades Principais

```
Usuario (1) ─── (1) Integrante
                       │
                       ├── (N) Permissoes
                       ├── (N) PostsFeed
                       └── (N) Tasks (atribuídas)

Time (1) ─── (1) Ambiente
   │
   ├── (1..N) Integrantes (até 10 + 2 Líderes + 2 Gestores)
   ├── (N) Ferramentas
   ├── (1) Feed
   └── (N) Projetos (atribuídos)

Projeto (1) ─── (1) PastaProjeto
                      │
                      ├── (N) TimesEnvolvidos      ← paralelismo
                      ├── (N) Tasks
                      ├── (N) Documentos
                      ├── (1) Timeline (eventos)
                      └── (N) FerramentasInstancias (dados das tools)

Feed
├── Post (texto + emojis, autor, time_origem)
│   ├── Curtidas (N)
│   ├── Checks (N)
│   ├── Mencoes (N → Integrante)
│   └── PostFeeds (N:N → Feed)    ← forward = compartilhamento
└── Filtros (tags, ambiente, projeto, autor)
```

### Lógica de Tasks e Paralelismo

> **Princípio fundamental**: Times trabalham em **paralelo** na mesma Pasta do Projeto, sem etapas sequenciais bloqueantes. Cada Time tem sua própria frente de progresso e é responsável por declarar quando sua parte está pronta.

#### Anatomia de uma Task

```
Task {
  id: uuid
  pasta_projeto_id: uuid          ← contexto sempre é uma Pasta
  time_responsavel_id: uuid        ← qual time "dono" da task
  owner_id: uuid | null            ← integrante atribuído (nulo = backlog do time)
  criada_por_id: uuid

  titulo: string
  descricao: text
  tipo: 'normal' | 'revisao' | 'bloqueio_externo' | 'auto_ferramenta'
  
  status: 'pendente' | 'em_andamento' | 'em_revisao' | 'concluida' | 'cancelada' | 'bloqueada'
  prioridade: 'P0' | 'P1' | 'P2' | 'P3'
  
  prazo: timestamptz | null
  iniciada_em: timestamptz | null
  concluida_em: timestamptz | null
  
  task_origem_id: uuid | null       ← se é revisão, aponta para a task original
  ferramenta_origem: string | null  ← ex: 'recebimentos', 'propostas'
  ferramenta_ref_id: uuid | null    ← ID dentro da ferramenta
  
  visibilidade: 'time' | 'pasta'    ← 'time' = só meu time vê, 'pasta' = todos os times da pasta
  
  bloqueada_por_task_id: uuid | null  ← raríssimo, usar com critério
  
  criado_em, atualizado_em
}
```

#### Fluxo de Criação

1. **Origem manual** — Líder ou Integrante cria task direto na Pasta (form curto).
2. **Origem via Ferramenta** — Quando uma ação numa Ferramenta gera trabalho (ex: registrar Recebimento → cria task "Conferir extrato bancário"), a task nasce com `tipo: auto_ferramenta` e link para a entrada original.
3. **Origem via Template** — Cada Time tem templates de tasks que se aplicam quando o Time é adicionado à Pasta (ex: Comercial sempre cria "Validar contrato", "Registrar entrada de orçamento").
4. **Origem via Revisão** — quando outro Time detecta erro (ver abaixo).

#### Máquina de Estados de Task

```
                ┌──────────────────────────────────────────┐
                │                                            │
                ▼                                            │
   ┌────────┐  start   ┌─────────────┐  request_review     │
   │pendente├─────────▶│em_andamento ├────────▶┌─────────┐│
   └────┬───┘          └──┬──┬───────┘         │em_revisao├┘
        │                 │  │                  └────┬─────┘
        │ block           │  │ complete              │ approve
        ▼                 │  ▼                       ▼
   ┌──────────┐           │  ┌──────────┐    ┌──────────┐
   │bloqueada │◀──────────┘  │concluida │    │concluida │
   └──────────┘  block       └──────────┘    └──────────┘
```

- **pendente → em_andamento** quando owner inicia
- **em_andamento → em_revisao** quando owner solicita revisão (Líder ou par)
- **em_revisao → em_andamento** se revisor pedir ajustes
- **em_revisao → concluida** se aprovado
- **qualquer → bloqueada** se dependência externa surgir (com motivo obrigatório)
- **qualquer → cancelada** apenas Líder/Gestor com justificativa

#### Paralelismo entre Times

```
Pasta do Projeto: "Apto Vila Nova Conceição"
├── Comercial   ──▶ [████████░░] 60% (12 tasks: 7 ok, 3 em andamento, 2 pendentes)
├── PCP         ──▶ [████░░░░░░] 25% (8 tasks: 2 ok, 1 em andamento, 5 pendentes)
├── Engenharia  ──▶ [████████░░] 80% (5 tasks: 4 ok, 1 em revisão)
└── Suprimentos ──▶ [░░░░░░░░░░] 0%  (não iniciado, aguardando definição da Engenharia)
```

- **% de progresso** = `tasks_concluidas / total_tasks` daquele Time naquela Pasta.
- **Suprimentos não iniciado** não bloqueia outros Times — cada um trabalha na sua frente.
- **Saúde do projeto** é função de prazos individuais de tasks vs. prazo do cliente, não de média.

#### Tratamento de "Voltar Etapas" — Sistema de Revisão

> Marcus afirmou: "com paralelismo não haverá necessidade de voltar etapas". **Concordo no fluxo feliz**, mas o mundo real exige a modelagem de revisões.

**Cenário inevitável**: Engenharia detecta erro de medida que veio do Comercial na proposta. Hoje, manualmente: o time "volta" etapa.

**Como o Arali Flow resolve sem violar paralelismo:**

```
Engenharia abre Task "Detalhar peça do nicho da sala"
   └─▶ Detecta inconsistência: medida na proposta diferente do projeto
       └─▶ Botão "Solicitar Revisão" cria nova Task:
           {
             tipo: 'revisao',
             time_responsavel_id: <ID Comercial>,
             task_origem_id: <ID task da Engenharia>,
             titulo: 'REVISÃO: Validar medida do nicho da sala (proposta vs projeto)',
             prioridade: 'P0',
             motivo: 'Engenharia detectou divergência entre proposta...'
           }
       └─▶ Pasta do Projeto recebe alerta visual: ⚠️ "1 revisão pendente"
       └─▶ Comercial recebe notificação realtime
       └─▶ Task original da Engenharia entra em status 'bloqueada' (opcional)
           OU continua em andamento se houver outras frentes
```

**Vantagens:**
- Histórico linear, auditável, sem ciclos retroativos
- Métricas de qualidade ficam visíveis (quantas revisões cada Time gera/recebe)
- Sem máquina de estados circular (que causa bugs de UX e database)
- Times continuam paralelos onde possível

**Visualização da Saúde:**
- Pasta com 0 revisões pendentes → 🟢
- Pasta com 1-2 revisões → 🟡
- Pasta com 3+ revisões ou revisão P0 não atendida em 48h → 🔴

#### Backlog e Carga do Time

- **Backlog do Time** = todas as tasks pendentes do Time (em qualquer Pasta) ordenadas por prioridade × prazo.
- **Carga do Integrante** = soma de tasks `em_andamento` ou `pendente` atribuídas a ele em qualquer Pasta.
- **Alertas automáticos**:
  - Integrante com >5 tasks P0+P1 simultâneas → notificação ao Líder
  - Task com prazo vencido sem mudança de status há 24h → notificação ao owner + Líder
  - Time com >30% de tasks atrasadas → alerta no painel do Gestor

#### Posts Automáticos (feature flag, ativada na Etapa 2)

Quando ativado em `NEXT_PUBLIC_FEATURE_TASK_AUTO_POST=true`, mudanças relevantes em Tasks geram Posts automáticos no Feed do Time:

- Task concluída de prioridade P0 ou P1
- Task em revisão criada
- Bloqueio criado/resolvido
- Marco da Pasta atingido (ex: 100% das tasks de um Time naquela Pasta)

Sem ruído: tasks normais (P2/P3) não geram post — só ficam visíveis no histórico.

📄 Detalhes em [`docs/DOMAIN_MODEL.md`](./docs/DOMAIN_MODEL.md)

---

## 🔐 Permissões e Hierarquia

### Composição de Time

```
Time (1)
├── Gestores       (até 2)  — podem acessar múltiplos Times (definido pela Diretoria)
├── Líderes        (até 2)  — acesso apenas ao próprio Time
└── Integrantes    (até 10) — acesso apenas ao próprio Time
```

### Matriz de Roles e Permissões

| Role | Escopo | Visualizar | Criar Task | Atribuir Projeto | Remover Post | KPIs Globais |
|---|---|---|---|---|---|---|
| **Diretoria** | Tudo | ✅ Tudo | ✅ | ✅ Em qualquer Time | ✅ | ✅ |
| **Admin** | Configurações + Usuários | ✅ | ❌ | ❌ | ✅ | ✅ |
| **Gestor** | 1+ Times (definido por Diretoria) | ✅ Times atribuídos | ✅ | ✅ Próprios + Coordenação de outros Times | ✅ | ❌ |
| **Líder de Time** | Apenas seu Time | ✅ Seu Time | ✅ | ✅ Apenas membros do seu Time | ❌ | ❌ |
| **Integrante** | Apenas seu Time | ✅ Seu Time | ✅ Próprias tasks | ❌ | ❌ | ❌ |
| **Viewer** | Leitura | ✅ (limitado) | ❌ | ❌ | ❌ | ❌ |

### Distribuição de Projetos — Regra de Negócio

- **Líder de Time** → distribui Projetos (e Tasks) **somente entre os membros do seu próprio Time**.
- **Gestor** → distribui Projetos para:
  - Membros do seu Time
  - **Coordenação de outro Time** (gera notificação ao Líder daquele Time, que então distribui internamente)
- **Diretoria** → autoridade total, pode atribuir qualquer coisa em qualquer lugar.

### Implementação Técnica
- **PostgreSQL Row Level Security (RLS)** em **todas** as tabelas
- Helper functions SQL: `is_diretoria()`, `is_gestor_de_time(time_id)`, `is_lider_de_time(time_id)`, `is_integrante_de_time(time_id)`
- JWT carrega `user_id` + `role` global (papel mais alto)
- Pertencimento a Times resolvido via tabela `integrantes_times` consultada por RLS

📄 Matriz completa: [`docs/PERMISSIONS.md`](./docs/PERMISSIONS.md)

---

## ⚡ Realtime — Critério Técnico

> **Regra de ouro**: Realtime só onde a colaboração é simultânea. Em todo o resto, **revalidação tática** (refetch on focus, polling de 30-60s, ou Server Components com cache).

### Decisão por Módulo

| Módulo | Realtime? | Estratégia | Motivo |
|---|---|---|---|
| **Feed do Time** | ✅ Sim | Supabase Channels | Colaboração simultânea, like, encaminhar |
| **Feed Geral** | ✅ Sim | Supabase Channels | Idem |
| **Timeline da Pasta do Projeto** | ✅ Sim | Supabase Channels | Múltiplos Times em paralelo |
| **Tasks da Pasta do Projeto** | ✅ Sim | Supabase Channels | Status muda durante o dia |
| **Lista de Projetos** | ❌ Não | Refetch on focus + Server Components | Mudanças não exigem live update |
| **Página do Time (cards)** | ❌ Não | Polling 60s + cache | Métricas agregadas |
| **Home (cards pessoais)** | ❌ Não | Refetch on focus | Idem |
| **Configurações de usuário** | ❌ Não | Manual | Sem colaboração |
| **KPIs da Diretoria** | ❌ Não | Polling 5min + materialized view | Pesado, não precisa instantâneo |
| **Notificações in-app** | ✅ Sim | Supabase Channels | Precisa ser instantânea |
| **Mudança de permissão / role** | ✅ Sim | Supabase Channels | Segurança crítica |

### Custo / Performance
Supabase Free aguenta ~200 conexões simultâneas. Pro aguenta 500+. Para **60 usuários ativos com pico estimado de 25-30 simultâneos**, ficamos folgados no Pro.

📄 Detalhes em [`docs/REALTIME_STRATEGY.md`](./docs/REALTIME_STRATEGY.md)

---

## 🔒 Segurança

### Princípios

> **Secure by design.** Segurança não é etapa final — é decisão arquitetural.

### Camadas

#### 1. Autenticação
- **Supabase Auth** com magic link + email/password
- **MFA recomendado** para Diretoria, Admin e Gestores (TOTP)
- **JWT** com expiração curta + refresh token rotativo
- **Rate limiting** em login (5 tentativas / 15min)

#### 2. Autorização (RBAC + RLS)
- **Row Level Security obrigatório em TODAS as tabelas**
- **Roles globais**: `super_admin`, `admin`, `diretoria`, `gestor`, `lider_time`, `integrante`, `viewer`
- **Pertencimento a Times** resolvido por RLS via `integrantes_times`
- **Permissões granulares** por Ferramenta dentro do Ambiente

#### 3. Dados em Trânsito e Repouso
- **HTTPS obrigatório** (HSTS)
- **TLS 1.3** mínimo
- **Criptografia em repouso** (Supabase, AES-256)
- **Storage** com signed URLs (expiração ≤ 1h)

#### 4. Headers de Segurança (CSP)
```ts
headers: [
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Content-Security-Policy', value: '...' },
]
```

#### 5. Auditoria
- **Audit log** em tabela `audit_logs`
- Eventos rastreados: login, alteração de permissão, mudança de status de Task/Projeto, exclusões, distribuição de Projeto
- Retenção mínima: **24 meses**

#### 6. Gestão de Secrets
- **Nunca** commitar `.env.local`
- **Service Role Key** apenas em Server Actions / Edge Functions
- **Rotação trimestral** de chaves sensíveis

#### 7. OWASP Top 10 — Mitigação
| Risco | Mitigação |
|---|---|
| Injection | Supabase client + parameterized queries |
| Broken Auth | Supabase Auth + MFA + RLS |
| Sensitive Data | TLS + encryption at rest + signed URLs |
| Broken Access Control | RLS obrigatório + RBAC |
| Misconfiguration | CSP + headers + review automatizado |
| XSS | React escape default + CSP strict |
| Deserialization | Zod validation em todo input |
| Vuln. Components | Dependabot + npm audit em CI |
| Insufficient Logging | Audit log + Sentry |

#### 8. LGPD
- **Consentimento explícito** no onboarding
- **Direito ao esquecimento** (soft delete + purge job)
- **Exportação de dados** sob demanda
- DPO designado (a definir com Arali)

📄 Detalhes em [`docs/SECURITY.md`](./docs/SECURITY.md)

---

## 💰 Custos de Infraestrutura

> **Política Lioma IT**: cada cliente tem seu próprio teto de infraestrutura definido no contrato. Os valores específicos NÃO ficam neste repositório — são tratados como ativo do departamento Lioma IT.
>
> **Modelo operacional**: `MODELO_CUSTO_INFRAESTRUTURA_LIOMA_IT.md` (gerido pela área de operações Lioma IT) define:
> - Stack padrão de fornecedores (hosting, database, observabilidade, e-mail, DNS, IA assistida)
> - Tiers por porte de cliente (S/M/L)
> - Gatilhos de upgrade automáticos
> - Alocação de assinaturas de ferramentas de desenvolvimento (Claude, Cursor, etc.)
> - Política de revisão trimestral de custos

### Categorias de Infraestrutura Mapeadas

Todo cliente Arali Flow tem custos rastreados nas seguintes categorias:

| Categoria | Função | Fornecedores típicos |
|---|---|---|
| **Hosting Frontend** | Build + Edge runtime + CDN | Vercel, Cloudflare Pages |
| **Backend-as-a-Service** | DB Postgres + Auth + Storage + Realtime + Edge Functions | Supabase |
| **DNS + WAF** | Resolução de domínio, proxy, proteção DDoS básica | Cloudflare |
| **Observabilidade** | Errors, performance, traces | Sentry |
| **E-mail Transacional** | Magic link, notificações | Resend |
| **Domínio** | Registro .com.br ou outro TLD | Registro.br, Namecheap |
| **Backups Externos** | Buffer e disaster recovery | Supabase + S3-compatible |
| **IA Assistida (Lioma IT)** | Claude Code, Cursor, Anthropic API, etc. | Rateado entre clientes |
| **Comunicação Cliente** | WhatsApp Business API (futuro), Slack interno | A definir |

### Princípios de Custo

1. **Single-tenant**: cada cliente tem stack isolada. Custos não se misturam.
2. **Free tier first**: começamos no plano grátis, sobe quando métrica de uso justifica.
3. **Teto contratual claro**: estouro de teto vira aditivo ao contrato, nunca surpresa.
4. **Revisão trimestral**: custos auditados a cada 3 meses, com relatório ao cliente.

### Gatilhos Genéricos de Upgrade

| Sinal | Ação |
|---|---|
| Usuários simultâneos em pico > 50 | Avaliar Vercel Pro ou equivalente |
| DB > 8GB | Migrar tier Supabase ou adicionar particionamento |
| Anexos > 100GB | Migrar storage para R2/B2 ou upgrade Supabase |
| Erros Sentry > 5k/mês | Upgrade Sentry Team |
| E-mails > 3k/mês | Upgrade Resend Pro |

📄 Detalhes técnicos em [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md). Modelo operacional Lioma IT é mantido pela área de operações.

---

## 🗺️ Roadmap

> Cada etapa carrega o nome de uma operação real da marcenaria. Detalhes completos em [`docs/ROADMAP.md`](./docs/ROADMAP.md) e nos arquivos `docs/PHASE_*.md`.

### 📍 Etapa 0 — RISCA (Mês 1) — Fundação
> *A marcação inicial na madeira: define onde tudo vai começar.*
- Auth + RLS base + Permissões + Shell branded + CI/CD + Higiene de Git
- 📄 [`docs/PHASE_0_RISCA.md`](./docs/PHASE_0_RISCA.md)

### 📍 Etapa 1 — ESQUADRO (Mês 2) — Comercial
> *A ferramenta de aferição de 90°: garante o alinhamento.*
- Pasta do Projeto + Tasks + Distribuição
- **Ferramenta Recebimentos** (substitui planilha 01A)
- Módulo Propostas (substitui planilha Controle de Entrada)
- Feed manual + Forward simplificado
- 📄 [`docs/PHASE_1_ESQUADRO.md`](./docs/PHASE_1_ESQUADRO.md)

### 📍 Etapa 2 — ENCAIXE (Mês 3) — PCP + Realtime
> *Onde duas peças se conectam com precisão.*
- Ambiente PCP (Programação + Apontamentos)
- Timeline Paralela cross-Time
- Realtime em Feed, Timeline, Tasks, Notificações
- Forward de Post N:N + Posts automáticos (feature flag)
- 📄 [`docs/PHASE_2_ENCAIXE.md`](./docs/PHASE_2_ENCAIXE.md)

### 📍 Etapa 3 — LAPIDAÇÃO (Mês 4) — Diretoria + Go-Live
> *Lixa fina e polimento: a entrega visível.*
- Dashboard Diretoria (3 cards principais + drill-down)
- Aprovações + Audit log
- PWA completo + Light Mode preparado
- Testes E2E críticos + Documentação final
- **Go-live oficial com a Arali**
- 📄 [`docs/PHASE_3_LAPIDACAO.md`](./docs/PHASE_3_LAPIDACAO.md)

### 📍 Etapa 4 — VERNIZ (Mês 5+) — Pós-MVP + Replicação Lioma
> *A camada final de proteção e brilho — e a virada para produto Lioma.*
- Ambientes Engenharia + Suprimentos + Produção + Obra
- Modo offline real para Obra
- Portal do Arquiteto
- IA assistida (resumos de Feed, alertas)
- Integrações com sistemas legados
- **Playbook de replicação Lioma** para 2º cliente premium
- 📄 [`docs/PHASE_4_VERNIZ.md`](./docs/PHASE_4_VERNIZ.md)

---

## 🗓️ Cronograma de 4 Meses

```
┌───────────┬───────────────┬─────────────────────────────────────┐
│   MÊS     │   ETAPA       │        ENTREGAS                      │
├───────────┼───────────────┼─────────────────────────────────────┤
│   Mês 1   │   RISCA       │  Auth + RLS + Times + Permissões    │
│           │               │  Shell branded + CI/CD              │
│           │               │  Checkpoints 01 e 02 com Arali      │
├───────────┼───────────────┼─────────────────────────────────────┤
│   Mês 2   │   ESQUADRO    │  Pasta do Projeto + Tasks           │
│           │               │  Ferramenta Recebimentos (✨ killer) │
│           │               │  Módulo Propostas + Feed manual     │
│           │               │  Checkpoints 03 e 04                 │
├───────────┼───────────────┼─────────────────────────────────────┤
│   Mês 3   │   ENCAIXE     │  Ambiente PCP completo              │
│           │               │  Timeline paralela cross-Time        │
│           │               │  Realtime + Notificações in-app      │
│           │               │  Checkpoints 05 e 06                 │
├───────────┼───────────────┼─────────────────────────────────────┤
│   Mês 4   │   LAPIDAÇÃO   │  Dashboard Diretoria + KPIs         │
│           │               │  PWA + Audit log + Testes E2E       │
│           │               │  Treinamento dos 60 usuários        │
│           │               │  Checkpoints 07 e 08 + Go-Live      │
├───────────┼───────────────┼─────────────────────────────────────┤
│   Mês 5+  │   VERNIZ      │  Engenharia + Suprimentos +          │
│           │               │  Produção + Obra + Portal Arquiteto │
│           │               │  IA assistida + Replicação Lioma    │
└───────────┴───────────────┴─────────────────────────────────────┘
```

> ⚠️ Solo dev em 4 meses para 3 ambientes é **viável mas apertado** (480h totais com 6h/dia × 5 dias × 16 semanas). A IA assistida (Claude Code, Codex) é parte da estratégia, não opcional. Ver [`docs/ai/`](./docs/ai/).

---

## 🤝 Contribuindo

### Fluxo
1. Branch a partir de `develop`: `feature/nome-da-feature`
2. Commits semânticos: `feat:`, `fix:`, `refactor:`, `docs:`, `chore:`, `test:`
3. Antes de PR: `pnpm lint && pnpm typecheck && pnpm test && pnpm build`
4. Pull Request com template, CI verde, mínimo 1 aprovação técnica

### Definição de Pronto (DoD)
- ✅ Funcionalidade testada localmente
- ✅ Testes unitários cobrindo lógica crítica
- ✅ Sem warnings TypeScript ou ESLint
- ✅ Documentação atualizada
- ✅ RLS policies criadas e testadas
- ✅ Comportamento validado em mobile
- ✅ PR aprovado + CI verde

📄 Detalhes em [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md)

---

## 🎨 Padrões de Código

### Princípios
- **Legibilidade > Cleverness**
- **Nomes explícitos em PT-BR para domínio, EN para infra técnica**
- **Funções pequenas** (~30 linhas, uma responsabilidade)
- **Sem `any`** — `unknown` + narrowing
- **Server Components by default**

### Convenções

| Elemento | Convenção | Exemplo |
|---|---|---|
| Arquivos componente | kebab-case | `pasta-projeto-card.tsx` |
| Componentes React | PascalCase | `PastaProjetoCard` |
| Hooks | camelCase com `use` | `usePastaProjeto` |
| Funções | camelCase | `distribuirProjeto` |
| Constantes | UPPER_SNAKE_CASE | `MAX_INTEGRANTES_TIME` |
| Tipos / Interfaces | PascalCase | `IntegranteTime` |
| Tabelas DB | snake_case plural PT-BR | `projetos`, `integrantes_times`, `tasks` |
| Colunas DB | snake_case PT-BR | `criado_em`, `prazo_estimado` |

📄 Detalhes em [`docs/STYLE_GUIDE.md`](./docs/STYLE_GUIDE.md)

---

## 📚 Documentação Adicional

Toda documentação técnica em `/docs`. Pensada para ser **consultiva para humanos E para IA assistida**.

### Documentação Técnica
| Arquivo | Propósito |
|---|---|
| [`docs/ROADMAP.md`](./docs/ROADMAP.md) | 🗺️ Visão das 5 etapas (Risca → Esquadro → Encaixe → Lapidação → Verniz) |
| [`docs/PHASE_0_RISCA.md`](./docs/PHASE_0_RISCA.md) | Detalhe Etapa 0 — Fundação |
| [`docs/PHASE_1_ESQUADRO.md`](./docs/PHASE_1_ESQUADRO.md) | Detalhe Etapa 1 — Comercial |
| [`docs/PHASE_2_ENCAIXE.md`](./docs/PHASE_2_ENCAIXE.md) | Detalhe Etapa 2 — PCP + Realtime |
| [`docs/PHASE_3_LAPIDACAO.md`](./docs/PHASE_3_LAPIDACAO.md) | Detalhe Etapa 3 — Diretoria + Go-Live |
| [`docs/PHASE_4_VERNIZ.md`](./docs/PHASE_4_VERNIZ.md) | Detalhe Etapa 4 — Pós-MVP + Replicação Lioma |
| [`docs/ARCHITECTURE.md`](./docs/ARCHITECTURE.md) | Arquitetura detalhada, diagramas C4 |
| [`docs/BRANDING.md`](./docs/BRANDING.md) | 🎨 Identidade visual, cores, tipografia, tom |
| [`docs/DOMAIN_MODEL.md`](./docs/DOMAIN_MODEL.md) | Modelo de domínio: Projeto, Pasta, Task, Time |
| [`docs/DATABASE.md`](./docs/DATABASE.md) | Schema, índices, relacionamentos |
| [`docs/SECURITY.md`](./docs/SECURITY.md) | Políticas de segurança, RLS, threat model |
| [`docs/PERMISSIONS.md`](./docs/PERMISSIONS.md) | Matriz de permissões |
| [`docs/REALTIME_STRATEGY.md`](./docs/REALTIME_STRATEGY.md) | Estratégia de Realtime por módulo |
| [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md) | Pipeline, ambientes, custos |
| [`docs/RUNBOOK.md`](./docs/RUNBOOK.md) | Operação, incidentes |
| [`docs/CONTRIBUTING.md`](./docs/CONTRIBUTING.md) | Fluxo de contribuição |
| [`docs/STYLE_GUIDE.md`](./docs/STYLE_GUIDE.md) | Padrões de código |
| [`docs/CHANGELOG.md`](./docs/CHANGELOG.md) | Histórico de versões |
| [`docs/DECISIONS/`](./docs/DECISIONS/) | ADRs |

### 🤖 Documentação para IA Assistida (`docs/ai/`)

> **Crítico para solo dev**. Esses arquivos são alimentados como contexto em Claude Code, Cursor, Copilot, GPT — fazem a IA entender o projeto e gerar código alinhado.

| Arquivo | Propósito |
|---|---|
| [`docs/ai/CLAUDE.md`](./docs/ai/CLAUDE.md) | **Contexto principal** — projeto, stack, regras, estilo |
| [`docs/ai/CONTEXT.md`](./docs/ai/CONTEXT.md) | Modelo de domínio simplificado |
| [`docs/ai/PATTERNS.md`](./docs/ai/PATTERNS.md) | Padrões e templates recorrentes |
| [`docs/ai/PROMPTS.md`](./docs/ai/PROMPTS.md) | Biblioteca de prompts produtivos |
| [`docs/ai/GLOSSARY.md`](./docs/ai/GLOSSARY.md) | Glossário (marcenaria + sistema) |

> 💡 **Use sempre como anexo no prompt**: "Considere o contexto em `docs/ai/CLAUDE.md` e os padrões em `docs/ai/PATTERNS.md`."

---

## 🆘 Suporte

### Para dúvidas técnicas ou bugs
Abra issue no GitHub com template adequado:
- 🐛 **Bug Report**
- ✨ **Feature Request**
- ❓ **Question**
- 🔒 **Security** *(canal privado em `SECURITY.md`)*

### Para questões estratégicas / produto
- **Marcus Vitorino** — Founder / Tech Lead
- **Cliente: Arali Móveis** — Checkpoints quinzenais (12 daillies em 6 meses)

### Vulnerabilidades de Segurança
**Não abra issue pública.** Reporte conforme protocolo em [`docs/SECURITY.md`](./docs/SECURITY.md).

---

## 📄 License

**Proprietary** — Todos os direitos reservados.

Este software é propriedade exclusiva da LIOMA IT. Qualquer uso, cópia, modificação, distribuição ou engenharia reversa não autorizados são estritamente proibidos.

© 2026 LIOMA IT. All rights reserved.

---

<div align="center">

**Arali Flow** — *Sistema operacional digital para marcenaria de altíssimo padrão.*

Feito com 🪵 + ⚡ + 🤖

</div>
