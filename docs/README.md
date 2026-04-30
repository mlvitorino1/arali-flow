# 🪵 Arali Flow

> **Sistema operacional digital interno da Arali Móveis** — orquestra o ciclo de vida completo de cada Projeto através dos ambientes da marcenaria, transformando processos manuais em fluxo digital auditável, com timeline paralela, governança e segurança corporativa.

[![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)]() [![Stack](https://img.shields.io/badge/stack-Next.js%2015%20%7C%20Supabase-black)]() [![Tenant](https://img.shields.io/badge/modelo-Single--Tenant-blue)]() [![Idioma](https://img.shields.io/badge/idioma-PT--BR-green)]() [![License](https://img.shields.io/badge/license-Proprietary-red)]()

---

## 📑 Índice

1. [Proposta de Valor](#-proposta-de-valor)
2. [Decisões Arquiteturais Consolidadas](#-decisões-arquiteturais-consolidadas)
3. [Getting Started](#-getting-started)
4. [Pré-requisitos](#-pré-requisitos)
5. [Setup do Ambiente](#-setup-do-ambiente)
6. [Setup Local](#-setup-local)
7. [Comandos Disponíveis](#-comandos-disponíveis)
8. [Arquitetura do Projeto](#-arquitetura-do-projeto)
9. [Modelo de Domínio](#-modelo-de-domínio)
10. [Permissões e Hierarquia](#-permissões-e-hierarquia)
11. [Realtime — Critério Técnico](#-realtime--critério-técnico)
12. [Segurança](#-segurança)
13. [Custos de Infraestrutura](#-custos-de-infraestrutura)
14. [Roadmap](#-roadmap)
15. [Cronograma de 4 Meses](#-cronograma-de-4-meses)
16. [Contribuindo](#-contribuindo)
17. [Padrões de Código](#-padrões-de-código)
18. [Documentação Adicional](#-documentação-adicional)
19. [Suporte](#-suporte)
20. [License](#-license)

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
| 03 | **Stack frontend**: Next.js **15 LTS** (App Router) — *recomendação técnica* | ✅ Fechado |
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

## 💼 Contrato Comercial (Lioma Growth)

| Item | Valor |
|---|---|
| Diagnóstico | R$ 2.500 (abatido do Setup se fechar contrato) |
| Setup (após abatimento) | R$ 17.500 em 6 parcelas |
| Mensalidade | R$ 997/mês |
| Vigência inicial | 6 meses + renovação automática por mais 6 |
| LTV mínimo (12 meses) | R$ 17.500 + R$ 11.964 = **R$ 29.464** |
| LTV com renovação (24 meses) | R$ 17.500 + R$ 23.928 = **R$ 41.428** |

> Status (2026-04-30): apresentação quente, contrato em fase final de negociação. Cronograma das 4 fases inicia oficialmente após assinatura.

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

### Visão Macro

```
┌─────────────────────────────────────────────────────────┐
│                      CLIENTE (PWA)                       │
│   Next.js 15 (App Router) + React Server Components      │
│   Tailwind + Shadcn UI + Framer Motion + TanStack Query  │
└──────────────────────────┬──────────────────────────────┘
                           │
                           │ HTTPS / WebSocket (Realtime)
┌──────────────────────────▼──────────────────────────────┐
│                      VERCEL EDGE                         │
│        Next.js Server Actions + Route Handlers           │
└──────────────────────────┬──────────────────────────────┘
                           │
┌──────────────────────────▼──────────────────────────────┐
│                       SUPABASE                           │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐ │
│  │PostgreSQL│ │   Auth   │ │ Storage  │ │   Edge     │ │
│  │  + RLS   │ │          │ │          │ │ Functions  │ │
│  └──────────┘ └──────────┘ └──────────┘ └────────────┘ │
│         Realtime (apenas Feed e Timeline)                │
└─────────────────────────────────────────────────────────┘
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

**Sidebar — Itens (MVP):**
- 🏠 **Home** — Cards de métricas pessoais + Feed do Time + Feed Geral
- 📁 **Projetos** — Lista de projetos atribuídos ao Time *(Líderes/Gestores podem distribuir)*
- 👥 **Time** — Página do Time com cards de métricas
- 📰 **Feed Geral** — Todos os posts da empresa
- ⚙️ **Configurações** — *(somente Admins/Gestores/Diretoria)*

### Pasta do Projeto — Modo Operação

Quando um Integrante clica num Projeto, abre a **Pasta do Projeto em modo operação**:

```
┌──────────────────────────────────────────────────────────┐
│  ← Voltar    PROJETO: Apartamento Vila Nova Conceição     │
├──────────────────────────────────────────────────────────┤
│  [Timeline] [Tasks] [Ferramentas] [Documentos] [Histórico]│
├──────────────────────────────────────────────────────────┤
│  Cliente: ...     Status: Em produção (Paralelo)          │
│  Times ativos: Comercial • PCP • Engenharia               │
│                                                            │
│  ▼ TIMELINE PARALELA                                       │
│  ┌─────────────┬────────────────────────────────────┐    │
│  │ Comercial   │ ████████░░░░░░░░░░ 60%             │    │
│  │ PCP         │ ████░░░░░░░░░░░░░░ 25%             │    │
│  │ Engenharia  │ ████████████░░░░░░ 80%             │    │
│  └─────────────┴────────────────────────────────────┘    │
│                                                            │
│  ▼ MINHAS TASKS NESTE PROJETO (3)                          │
│  □ Validar planilha de recebimentos    Vence: 02/05       │
│  □ Aprovar proposta revisada           Vence: 30/04       │
│  ☑ Conferir contrato assinado          Concluída          │
│                                                            │
│  ▼ FERRAMENTAS DO MEU TIME                                 │
│  [💰 Recebimentos] [📋 Propostas] [📑 Contratos]          │
└──────────────────────────────────────────────────────────┘
```

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

> **Princípio**: Times trabalham em **paralelo** na mesma Pasta do Projeto. Não há etapas sequenciais bloqueantes.

**Como funciona:**
1. Quando um Projeto é criado, o Líder/Gestor define **quais Times participam** da Pasta do Projeto.
2. Cada Time gera suas **Tasks** dentro da Pasta (manualmente ou via templates de Ferramenta).
3. Cada Task tem: `owner` (Integrante), `status` (`pendente` | `em_andamento` | `concluida` | `bloqueada`), `prazo`, `prioridade`.
4. A **Timeline da Pasta do Projeto** mostra o progresso paralelo de cada Time (% de Tasks concluídas).
5. Quando uma Task muda de status → atualiza Timeline + (opcionalmente) cria Post automático no Feed do Time.
6. **Backlog do Time** = soma de Tasks pendentes do Time em todas as Pastas de Projeto ativas.

### Ressalva Técnica — "Voltar Etapas"

> Você disse: "com paralelismo não haverá necessidade de voltar etapas".  
> **Concordo no fluxo padrão**, mas precisamos modelar o caso real:

**Cenário inevitável**: Engenharia detecta erro de medida que veio do Comercial (na proposta). Hoje: o time "volta" a etapa anterior.

**Solução proposta** *(sem violar paralelismo)*:
- Em vez de "voltar etapa", o Time afetado **cria uma nova Task de Revisão** atribuída ao Time responsável original.
- A Task de Revisão é vinculada ao motivo (`tipo: revisao`, `task_origem_id`, `motivo`).
- Mantém histórico completo, sem ciclos no fluxo, sem dependência circular.
- A Pasta do Projeto fica visualmente sinalizada com **alerta de revisão pendente**.

✅ **Vantagem**: rastreabilidade total + sem complexidade de máquina de estados retroativa.

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

> **Teto definido**: R$500/mês

### Estimativa Operacional (Produção)

| Serviço | Plano | Custo (USD) | Custo (R$) | Função |
|---|---|---|---|---|
| **Supabase** | Pro | $25 | ~R$130 | DB, Auth, Storage (100GB), Realtime |
| **Vercel** | Hobby* | $0 | R$0 | Hosting (suficiente para 25 usuários) |
| **Sentry** | Free Dev | $0 | R$0 | Observabilidade (5k events/mês) |
| **Resend** | Free | $0 | R$0 | E-mail (3k/mês) |
| **Cloudflare** | Free | $0 | R$0 | DNS + Proxy + WAF básico |
| **Domínio** | .com.br | — | ~R$5/mês | Anual ~R$60 |
| **Backups extras** | — | — | ~R$30 | Buffer |
| **TOTAL ESTIMADO** | | | **~R$165/mês** | ✅ Cabe folgado |

> \* Vercel Hobby tem limites para projetos comerciais. **Recomendação**: começar Hobby, migrar para Pro ($20 = ~R$104) se necessário. Mesmo com Pro: ~R$269/mês ✅

### Quando Reavaliar
- **>50 usuários simultâneos em pico** → considerar Vercel Pro (cenário possível com os 60 da Arali em horários de fechamento de proposta)
- DB >8GB → Supabase Team ($599 — só com receita do contrato + 2º cliente Lioma)
- Anexos >100GB → upgrade Supabase Storage ou migrar para R2/B2 (provável a partir do Verniz com upload de DWG/PDF da Engenharia)

📄 Detalhes em [`docs/DEPLOYMENT.md`](./docs/DEPLOYMENT.md)

---

# 🗺️ Arali Flow — Roadmap

> Plano de execução do MVP em 4 meses + visão pós-go-live. Cada etapa carrega o nome de uma operação real da marcenaria — porque é assim que se faz uma peça: marca, alinha, encaixa, lapida, envernizа.

---

## 📑 Resumo das 5 Etapas

| # | Etapa | Metáfora | Foco | Prazo | Doc Detalhado |
|---|---|---|---|---|---|
| 0 | **RISCA** | A marcação inicial na madeira — define todo corte | Fundação técnica + branding aplicado | Mês 1 | [`docs/PHASE_0_RISCA.md`](./PHASE_0_RISCA.md) |
| 1 | **ESQUADRO** | Ferramenta de aferição de 90° — garante o alinhamento | Ambiente Comercial + Ferramenta Recebimentos | Mês 2 | [`docs/PHASE_1_ESQUADRO.md`](./PHASE_1_ESQUADRO.md) |
| 2 | **ENCAIXE** | Onde duas peças se conectam com precisão | Ambiente PCP + Timeline paralela + Realtime | Mês 3 | [`docs/PHASE_2_ENCAIXE.md`](./PHASE_2_ENCAIXE.md) |
| 3 | **LAPIDAÇÃO** | Lixa fina e polimento — entrega visível | Diretoria + KPIs + PWA + Go-Live | Mês 4 | [`docs/PHASE_3_LAPIDACAO.md`](./PHASE_3_LAPIDACAO.md) |
| 4 | **VERNIZ** | Camada final de proteção e brilho | Engenharia + Suprimentos + Produção + Obra + Portal Arquiteto | Pós-MVP (Mês 5+) | [`docs/PHASE_4_VERNIZ.md`](./PHASE_4_VERNIZ.md) |

---

## 🎯 Princípios de Execução

1. **Cada etapa entrega valor verificável**: não há "fundação invisível" — Risca já termina com uma tela de login viva e um shell navegável.
2. **Ferramenta Recebimentos é o killer demo**: ela está em Esquadro (Mês 2) e substitui a planilha hoje no centro da operação Comercial. É o gatilho psicológico para o cliente sentir o sistema "valer o investimento".
3. **Pasta do Projeto vive antes de Realtime**: em Esquadro a Pasta funciona com refetch tático. Realtime entra em Encaixe quando há colaboração simultânea de verdade.
4. **Diretoria fecha o MVP**: KPIs e PWA são as últimas peças porque dependem de dados reais já fluindo nas outras etapas.
5. **Verniz não compete com prazo**: tudo que não é vital para o go-live vai para a fase pós-MVP, sem culpa.

---

## ⏳ Cronograma Macro (16 semanas)

```
SEMANA   01  02  03  04  05  06  07  08  09  10  11  12  13  14  15  16
         ─────────────────────────────────────────────────────────────────
RISCA    ████████████████
ESQUADRO                 ████████████████
ENCAIXE                                  ████████████████
LAPIDAÇÃO                                                ████████████████
                                                                       ↑
                                                                    GO-LIVE
```

> **Convenção**: cada etapa tem 4 semanas de execução, com checkpoint quinzenal com a Arali (8 checkpoints no total).

---

## 📊 Métricas de Sucesso por Etapa

| Etapa | Métrica de Pronto | Como Medir |
|---|---|---|
| Risca | Auth funcional + RLS base + Shell branded | Login → Home → menu lateral renderizado em <2s, em mobile real |
| Esquadro | Ferramenta Recebimentos substitui Excel real | Time Comercial faz 1 dia inteiro sem abrir planilha |
| Encaixe | Timeline paralela viva entre 3 Times | Diretoria abre Pasta e vê 3 barras de progresso atualizando em tempo real |
| Lapidação | Dashboard executivo com 3 KPIs reais | Dono Comercial recebe link e abre 3x na primeira semana sem precisar de explicação |
| Verniz | Pelo menos 1 ambiente novo em produção | Engenharia ou Produção começa a usar sem migração de dados manual |

---

## 🚦 Critérios de Decisão de Corte

Se em qualquer etapa o tempo apertar, **corta na seguinte ordem** (do menos crítico para o mais crítico):

1. ❌ Posts automáticos vindos de Tasks → empurra para Verniz
2. ❌ Forward de Post N:N → simplifica para "compartilhar como cópia" no MVP
3. ❌ Audit log completo → reduzir para 5 eventos críticos
4. ❌ KPIs avançados Diretoria → reduzir para 3 cards
5. ❌ PWA offline → manter só PWA install, offline vai para Verniz
6. ✅ **Nunca cortar**: Auth, RLS, Pasta do Projeto, Tasks, Ferramenta Recebimentos

---

## 📍 Próximos Passos Imediatos (Semana 01 da Risca)

1. Aplicar tokens de branding em `globals.css` e `tailwind.config`
2. Substituir `app/page.tsx` placeholder pelo shell real
3. Implementar clients Supabase (`server`, `browser`, `admin`)
4. Migration inicial: `usuarios`, `integrantes`, `times`, `ambientes`, `integrantes_times` + RLS habilitado
5. Auth funcional (login senha + magic link + callback)
6. Reescrever scripts em `package.json` (typecheck, format, types:generate, db:migrate)
7. Limpar working tree, conventional commits, push em branch `feature/risca`

---

**Versão**: 1.0
**Última atualização**: 2026-04-29
**Autor**: Marcus Vitorino + Copiloto IA
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
| [`d
