# 🤖 CLAUDE.md — Contexto para IA Assistida

> **Este arquivo é OBRIGATÓRIO como contexto** em qualquer sessão de código com Claude Code, Cursor, GitHub Copilot Chat, ChatGPT, ou qualquer LLM trabalhando neste repositório. Anexe ou referencie este arquivo no início de cada sessão.

---

## 🎯 O que é este projeto

**Arali Flow** é o **sistema operacional digital interno** da **Arali Móveis** — uma marcenaria de altíssimo padrão (clientela: MK27, Bernardes, Jacobsen, Studio Arthur Casas, Isay Weinfeld). O sistema digitaliza e orquestra o fluxo de Projetos através de Ambientes (departamentos) com Times, Tasks, Ferramentas e Feed.

**Modelo de produto**: Single-tenant por instância (uso exclusivo da Arali nesta instância). **Propriedade intelectual: LIOMA IT** — o produto pode ser replicado em outras marcenarias premium em Verniz (Fase 4), sempre como deployment single-tenant isolado.
**Idioma**: 100% PT-BR (interface, código de domínio, comentários de domínio).
**Prazo**: MVP em 4 meses (cronograma inicia oficialmente quando o contrato Lioma Growth com a Arali for assinado).
**Time**: Solo dev (Marcus Vitorino) — 6h/dia × 5 dias úteis = 30h/semana = ~480h totais para o MVP.
**Escala MVP**: 60 usuários ativos previstos, 26 Projetos em andamento simultâneos.

### 💰 Contrato Lioma Growth com a Arali
- **Diagnóstico**: R$ 2.500 (abatido do Setup se fechar)
- **Setup**: R$ 17.500 (após abatimento) em 6 parcelas
- **Mensalidade**: R$ 997 × 12 meses, com renovação automática por mais 6 meses
- **Status atual** (2026-04-30): apresentação quente, contrato não assinado ainda

### 🪵 Vocabulário Real da Arali (CRÍTICO — usar em código e UI)

A Arali já tem um vocabulário operacional consolidado em planilhas. **Respeitar literalmente.**

**Estrutura de OS** (Ordem de Serviço):
- `OS{numero}` — sempre 5 dígitos (ex: `OS12513`)
- Sufixos compõem revisões e etapas:
  - `R{nn}` — Revisão (ex: `OS12513 R05` = revisão 5 da OS 12513)
  - `E{nn}` — Etapa/Escopo (ex: `OS12320 E12` = etapa 12)
  - `OP {nn}` — Ordem de Produção (ex: `OS12513 E03 OP 01`)
  - `CD` — Complemento de Detalhamento (ex: `OS12320 E22 CD R01`)
- **No banco**: armazenar `numero_os_raw` como string fiel + parser secundário em view para extrair partes.

**Status de Proposta**: `em_pausa | enviada | nfp | nova | aprovada | recusada`
**Status Comercial**: `iniciando | concorrencia | em_execucao | execucao | em_pausa | sem_status`
**Tipos de Proposta**: `pm | pn | fr | mob | fch | br | portas | portoes | batentes | forro | manutencao | outro` (validar siglas com Cuca/Bianca)

**Stakeholders externos** (modelar como `parceiros` com `tipo`):
- **Arquitetura**: MK27, Bernardes, Jacobsen, Arthur Casas, Isay Weinfeld, Andrade Moretin, Felipe Caboclo, Studio MK27, etc.
- **Construtora**: Alle, MFC, Hauz, Laer, Fairbanks, Frozino, Stewart, etc.
- **Gerenciadora**: Canal, Squaly, Cimenge, Fitplan, MS Torres, Dox, Pentágono, etc.

**Time Comercial real** (validar nomes oficiais com a Arali no Checkpoint 01):
- Propostistas: Suelen, Bianca, Franciele, Lisandra
- Gestor: Cuca

**Notas Fiscais**: NFE (entrada de mercadoria) e NFS (serviço) — frequentemente vêm pareadas no mesmo recebimento; a Ferramenta Recebimentos deve **detectar pareamento, não tratar como duplicata**.

---

## 🧭 Princípios de Engenharia (NÃO NEGOCIÁVEIS)

Quando gerar código, **sempre respeite**:

1. **TypeScript strict** — sem `any`. Use `unknown` + narrowing.
2. **Server Components by default** — `'use client'` apenas quando precisar de interatividade.
3. **Server Actions** para mutations (em vez de API Routes tradicionais).
4. **RLS-First Security** — toda regra de acesso vive no banco. Frontend valida UX, banco valida verdade.
5. **Validação dupla** — Zod no client + constraints + RLS no banco.
6. **Sem mágica oculta** — código deve ser legível para Marcus 6 meses depois sem precisar adivinhar.
7. **Funções pequenas** — ~30 linhas, uma responsabilidade.
8. **Nunca commitar segredos** — `.env.local` no gitignore, secrets só em Vercel Env Vars.
9. **Toda tabela criada → RLS ativada na mesma migration.** Sem exceção.
10. **Mobile-first** — todo componente deve funcionar bem em 375px de largura.

---

## 🛠️ Stack Técnica (FECHADA)

### Frontend
- **Next.js 15 LTS** (App Router) — *Não use Next.js 14 ou anteriores. Não use Pages Router.*
- **TypeScript 5.x** strict
- **Tailwind CSS** (com tokens definidos em `docs/BRANDING.md`)
- **Shadcn UI** (copy-paste, NÃO npm install)
- **Lucide React** (ícones)
- **Framer Motion** (animações pontuais)
- **TanStack Query** (cache + revalidação client-side)
- **Zod** (validação)
- **next-pwa** ou similar (PWA)
- **React Hook Form** (forms)
- - **Montserrat + DM Sans** (Google Fonts via `next/font/google`) — tipografia oficial Arali
- **JetBrains Mono** (Google Fonts via `next/font/google`) — OS, códigos, valores monetários

### Backend (Supabase)
- **PostgreSQL** (com RLS)
- **Supabase Auth** (magic link + email/password)
- **Supabase Storage** (imagens, anexos)
- **Supabase Realtime** (apenas Feed e Timeline)
- **Edge Functions** (Deno) — para tarefas server-side específicas

### DevOps
- **Vercel** — hosting do frontend
- **GitHub Actions** — CI (lint + typecheck + build + tests)
- **Sentry** — observabilidade
- **pnpm** — package manager (NÃO use npm ou yarn)

### Decisões fechadas (NÃO sugerir alternativas sem motivo forte)
- ❌ NÃO sugerir tRPC, GraphQL, Prisma, Drizzle (usamos Supabase client + types gerados)
- ❌ NÃO sugerir Redux, Zustand para estado global (use Server Components + TanStack Query)
- ❌ NÃO sugerir styled-components, emotion (Tailwind é a única forma de estilização)
- ❌ NÃO sugerir Pages Router (App Router only)
- ❌ NÃO sugerir migrar de Supabase

---

## 📂 Estrutura do Projeto

```
arali-flow/
├── app/                  # Next.js App Router
│   ├── (auth)/          # Rotas de autenticação
│   ├── (app)/           # Área autenticada (com shell)
│   └── api/             # Route Handlers
├── components/          # Componentes React
│   ├── ui/              # Shadcn primitives
│   ├── shell/           # Sidebar, Header
│   ├── ambientes/       # Por ambiente
│   ├── projeto/         # Pasta do Projeto, Tasks
│   ├── feed/            # Feed, Post
│   ├── times/           # Cards de time
│   └── shared/
├── lib/
│   ├── supabase/        # server-client / browser-client / admin-client
│   ├── auth/
│   ├── permissions/     # Helpers RBAC
│   ├── validations/     # Schemas Zod
│   ├── utils/
│   └── constants/
├── hooks/               # Custom hooks
├── server/
│   ├── actions/         # Server Actions (mutations)
│   ├── queries/         # Reads
│   └── services/        # Lógica de negócio
├── types/
│   ├── database.ts      # Auto-gerado Supabase
│   ├── domain.ts        # Tipos de domínio
│   └── api.ts
├── supabase/
│   ├── migrations/      # SQL versionadas
│   ├── functions/       # Edge Functions
│   ├── policies/        # RLS organizadas
│   └── seed.sql
├── public/              # Assets + PWA
├── tests/
└── docs/                # Documentação (este arquivo está aqui)
    └── ai/              # Contexto IA
```

---

## 🧬 Modelo de Domínio (resumo)

```
Usuario (1) ─── (1) Integrante
                       │
                       ├── (N) Permissoes
                       └── (N) Tasks (atribuídas)

Time (1) ─── (1) Ambiente
   │
   ├── (1..14) Integrantes (até 10 + 2 Líderes + 2 Gestores)
   ├── (N) Ferramentas
   ├── (1) Feed
   └── (N) Projetos atribuídos

Projeto (1) ─── (1) PastaProjeto
                      │
                      ├── (N) TimesEnvolvidos      ← paralelismo
                      ├── (N) Tasks
                      ├── (N) Documentos
                      ├── (1) Timeline (eventos)
                      └── (N) FerramentasInstancias

Feed
├── Post (texto + emojis, autor, time_origem)
│   ├── Curtidas (N)
│   ├── Checks (N)
│   ├── Mencoes (N → Integrante)
│   └── PostFeeds (N:N → Feed)    ← forward = compartilhamento
```

### Conceitos-chave
- **Pasta do Projeto**: o "workspace" de um Projeto. Vários Times trabalham em paralelo dentro dela.
- **Task**: unidade de trabalho de um Integrante dentro de uma Pasta.
- **Ambiente**: departamento (Comercial, PCP, Diretoria, etc.). MVP tem 3, full tem 7.
- **Time**: grupo de Integrantes ligado a um Ambiente. Composição: até 10 Integrantes + 2 Líderes + 2 Gestores.
- **Ferramenta**: módulo funcional dentro de um Ambiente (ex: "Recebimentos por Projeto" no Comercial).
- **Feed**: cada Time tem o seu, mais o Feed Geral.
- **Forward de Post**: post compartilhado em N feeds (N:N), atualização reflete em todos.

📄 Detalhes completos em [`docs/DOMAIN_MODEL.md`](../DOMAIN_MODEL.md) e [`docs/ai/CONTEXT.md`](./CONTEXT.md).

---

## 🔐 Sistema de Permissões

### Roles (do mais alto ao mais baixo)
1. `super_admin` — acesso total + alterar schema (raro)
2. `admin` — gestão de usuários e configurações
3. `diretoria` — visão completa + KPIs + aprovações
4. `gestor` — pode acessar múltiplos Times (definidos pela Diretoria)
5. `lider_time` — apenas seu próprio Time
6. `integrante` — apenas seu próprio Time
7. `viewer` — somente leitura

### Regras críticas de distribuição de Projetos
- **Líder de Time**: distribui só dentro do seu Time
- **Gestor**: distribui no seu Time + envia para Coordenação de outros Times
- **Diretoria**: tudo

📄 Matriz completa em [`docs/PERMISSIONS.md`](../PERMISSIONS.md).

---

## ⚡ Realtime

> **Use Realtime APENAS** em:
> - Feed (do Time e Geral)
> - Timeline da Pasta do Projeto
> - Tasks da Pasta do Projeto
> - Notificações in-app
> - Mudança de role/permissão

Tudo o resto: **Server Components com revalidação tática** ou **TanStack Query com refetchOnFocus**.

---

## 🎨 Design System

> **SEMPRE** consulte [`docs/BRANDING.md`](../BRANDING.md) antes de criar componentes visuais.
> Fonte oficial: Brand Book Arali Móveis (Fev/2026)

**TL;DR:**
- Dark-first (modo claro só na fase 2)
- **Paleta oficial (4 cores do Brand Book):**
  - `creme`     `#F5ECE6` — texto principal, cor de papel
  - `terracota` `#C77549` — acento quente, CTAs, chips de OS
  - `vinho`     `#683637` — primário, navegação ativa, autoridade técnica
  - `marrom`    `#412F2D` — base para os darks do sistema
- **Tipografia oficial:**
  - Montserrat (títulos, labels uppercase) — geométrica, solidez, precisão
  - DM Sans (corpo, sub-títulos) — fluidez, clareza, contemporânea
  - JetBrains Mono (OS/códigos/valores) — não está no brand book, mas é funcional
- Border radius: `rounded-md` (6px) inputs/badges, `rounded-lg` (8px) cards
- Sombras: escuras + highlight superior 4% creme (`rgba(245,236,230,0.04)`)
- ❌ **Não usar**: Inter, Cormorant Garamond, gold `#C9A84C`, noir puro `#0C0B09`

---

## 🌐 Idioma

- **Interface**: 100% PT-BR
- **Domínio (DB, types, business logic)**: PT-BR (`projetos`, `integrantes`, `tasks`, `criar_projeto`)
- **Infra técnica (libs, hooks utilitários, types genéricos)**: EN (`useDebounce`, `formatCurrency`, `LoaderProps`)
- **Comentários**: PT-BR para domínio, EN para algoritmos genéricos

### Exemplo
```ts
// ✅ Bom — domínio em PT-BR
export async function distribuirProjeto(projetoId: string, integranteId: string) { /* ... */ }

// ✅ Bom — utilitário em EN
export function formatCurrency(value: number): string { /* ... */ }

// ❌ Ruim — domínio em EN
export async function distributeProject(projectId: string, memberId: string) { /* ... */ }

// ❌ Ruim — mistura confusa
export async function distribute_projeto(projeto_id: string) { /* ... */ }
```

---

## 📐 Convenções de Código

### Nomenclatura

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

### Imports
- Use **imports absolutos** com `@/` (configurado em `tsconfig.json`)
- Ordem: react/next → libs externas → `@/` interno → relativos → tipos

```ts
// ✅ Ordem correta
import { Suspense } from 'react'
import { redirect } from 'next/navigation'

import { z } from 'zod'

import { createServerClient } from '@/lib/supabase/server'
import { Card } from '@/components/ui/card'

import { ProjetoCard } from './projeto-card'

import type { Projeto } from '@/types/domain'
```

---

## 🧱 Templates Recorrentes

### 1. Server Action de Mutation

```ts
// server/actions/projeto/distribuir-projeto.ts
'use server'

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { createServerClient } from '@/lib/supabase/server'
import { requireRole } from '@/lib/permissions'

const distribuirProjetoSchema = z.object({
  projetoId: z.string().uuid(),
  integranteId: z.string().uuid(),
  papel: z.enum(['responsavel', 'apoio']).default('responsavel'),
})

export async function distribuirProjeto(input: z.infer<typeof distribuirProjetoSchema>) {
  // 1. Validação
  const data = distribuirProjetoSchema.parse(input)

  // 2. Permissão (líder do time ou gestor ou diretoria)
  await requireRole(['lider_time', 'gestor', 'diretoria'])

  // 3. Conexão (RLS garantirá a regra fina)
  const supabase = await createServerClient()

  // 4. Mutation
  const { data: result, error } = await supabase
    .from('projetos_integrantes')
    .insert({
      projeto_id: data.projetoId,
      integrante_id: data.integranteId,
      papel: data.papel,
    })
    .select()
    .single()

  if (error) {
    throw new Error(`Falha ao distribuir projeto: ${error.message}`)
  }

  // 5. Revalidação
  revalidatePath('/projetos')
  revalidatePath(`/projetos/${data.projetoId}/pasta`)

  return result
}
```

### 2. Server Component de Listagem

```tsx
// app/(app)/projetos/page.tsx
import { Suspense } from 'react'
import { listarProjetosDoTime } from '@/server/queries/projeto'
import { ProjetoCard } from '@/components/projeto/projeto-card'
import { ProjetoListSkeleton } from '@/components/projeto/projeto-list-skeleton'

export default async function ProjetosPage() {
  return (
    <main className="container mx-auto py-6">
      <h1 className="font-display text-3xl mb-6">Meus Projetos</h1>
      <Suspense fallback={<ProjetoListSkeleton />}>
        <ListaProjetos />
      </Suspense>
    </main>
  )
}

async function ListaProjetos() {
  const projetos = await listarProjetosDoTime()

  if (projetos.length === 0) {
    return (
      <p className="text-neutral-400">
        Nenhum projeto atribuído ao seu Time ainda.
      </p>
    )
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {projetos.map((projeto) => (
        <ProjetoCard key={projeto.id} projeto={projeto} />
      ))}
    </div>
  )
}
```

### 3. Client Component com Form + Server Action

```tsx
// components/projeto/distribuir-projeto-form.tsx
'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { distribuirProjeto } from '@/server/actions/projeto/distribuir-projeto'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

const formSchema = z.object({
  integranteId: z.string().uuid({ message: 'Selecione um integrante.' }),
})

interface DistribuirProjetoFormProps {
  projetoId: string
  integrantes: Array<{ id: string; nome: string }>
}

export function DistribuirProjetoForm({ projetoId, integrantes }: DistribuirProjetoFormProps) {
  const [isPending, startTransition] = useTransition()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  })

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    startTransition(async () => {
      try {
        await distribuirProjeto({ projetoId, integranteId: values.integranteId })
        toast.success('Projeto distribuído.')
        form.reset()
      } catch (error) {
        toast.error('Não foi possível distribuir o projeto.')
      }
    })
  }

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {/* select integrantes */}
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Distribuindo...' : 'Distribuir'}
      </Button>
    </form>
  )
}
```

### 4. Hook Realtime (Feed)

```ts
// hooks/use-realtime-feed.ts
'use client'

import { useEffect, useState } from 'react'
import { createBrowserClient } from '@/lib/supabase/browser'
import type { Post } from '@/types/domain'

export function useRealtimeFeed(timeId: string, initialPosts: Post[]) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)

  useEffect(() => {
    const supabase = createBrowserClient()

    const channel = supabase
      .channel(`feed:time:${timeId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'posts', filter: `time_id=eq.${timeId}` },
        (payload) => {
          setPosts((prev) => [payload.new as Post, ...prev])
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [timeId])

  return posts
}
```

### 5. RLS Policy (template)

```sql
-- supabase/migrations/<timestamp>_projetos_rls.sql

ALTER TABLE projetos ENABLE ROW LEVEL SECURITY;

-- Diretoria vê tudo
CREATE POLICY "diretoria_select_all_projetos"
ON projetos FOR SELECT
USING ( is_diretoria() );

-- Integrante vê projetos do seu time
CREATE POLICY "integrante_select_projetos_do_time"
ON projetos FOR SELECT
USING (
  EXISTS (
    SELECT 1
    FROM projetos_times pt
    JOIN integrantes_times it ON it.time_id = pt.time_id
    WHERE pt.projeto_id = projetos.id
      AND it.integrante_id = auth.uid()
  )
);

-- Líder de Time pode atribuir projetos do seu time
CREATE POLICY "lider_insert_projetos_integrantes"
ON projetos_integrantes FOR INSERT
WITH CHECK (
  is_lider_de_time((
    SELECT time_id FROM projetos_times WHERE projeto_id = projetos_integrantes.projeto_id LIMIT 1
  ))
);
```

📄 Mais templates: [`docs/ai/PATTERNS.md`](./PATTERNS.md)

---

## 🚫 Anti-Padrões a EVITAR

Quando gerar código, **NUNCA**:

1. ❌ Fazer fetch direto no componente sem Server Component ou Server Action
2. ❌ Misturar inglês e português em nomes do mesmo domínio
3. ❌ Usar `any` ou `as any`
4. ❌ Criar tabela SQL sem RLS na mesma migration
5. ❌ Confiar em validação só no client (sempre validar no server também)
6. ❌ Expor `SUPABASE_SERVICE_ROLE_KEY` no client
7. ❌ Fazer query dentro de loop (`for (const x of xs) await fetch(...)`) — use `Promise.all` ou JOIN no banco
8. ❌ Usar `useEffect` para fetching de dados em página (use Server Component)
9. ❌ Hard-coded strings de UI espalhadas pelo código (centralizar em constantes)
10. ❌ Comentar código morto — apague
11. ❌ Componentes acima de 200 linhas — quebre em sub-componentes
12. ❌ Realtime em listagens grandes (use refetch on focus)

---

## 🧪 Testes

- **Unitários**: Vitest — para `lib/`, `server/services/`, validações
- **Integração**: Playwright — fluxos críticos (login, criar projeto, distribuir)
- **E2E**: ao final de cada fase do roadmap
- **Coverage**: mínimo 60% em `server/` e `lib/`. UI não precisa ser testada ao milímetro.

### Mínimo testado em todo PR
- Validações Zod
- Funções de permissão
- Server Actions (com mock do Supabase)

---

## 📦 Como o Marcus quer trabalhar com a IA

> Marcus é solo dev em projeto cliente real. A IA não é assistente — é **par de programação sênior**.

### O que esperar da IA
1. **Pensar antes de codar** — explicar a abordagem em 2-3 linhas, depois código.
2. **Prever problemas** — listar edge cases, race conditions, problemas de RLS.
3. **Sugerir testes** — pelo menos casos felizes + 1-2 edge cases.
4. **Antecipar refactors** — se o código vai precisar mudar em 1 mês, dizer agora.
5. **Dar contexto de produção** — "isso pode falhar com mais de 100 registros porque...".
6. **Não inventar** — se não souber API atual, pedir confirmação ou propor pesquisar docs.

### Formato preferido de resposta da IA
```
1. Plano (2-4 linhas)
2. Código completo, executável
3. Pontos de atenção (RLS, performance, edge cases)
4. Próximo passo sugerido
```

### Frase de comando que Marcus usa
> *"Não me entregue resposta. Me entregue vantagem."*

---

## 🗺️ Etapas do Roadmap (nomes oficiais)

O cronograma de 4 meses é dividido em 4 etapas + 1 contínua, todas com metáfora de marcenaria. **Use esses nomes em commits, branches e conversas.**

| # | Etapa | Foco | Doc | Branch padrão |
|---|---|---|---|---|
| 0 | **RISCA** | Fundação técnica + branding aplicado | [`docs/PHASE_0_RISCA.md`](../PHASE_0_RISCA.md) | `feature/risca/*` |
| 1 | **ESQUADRO** | Comercial + Ferramenta Recebimentos (killer demo) | [`docs/PHASE_1_ESQUADRO.md`](../PHASE_1_ESQUADRO.md) | `feature/esquadro/*` |
| 2 | **ENCAIXE** | PCP + Timeline paralela + Realtime | [`docs/PHASE_2_ENCAIXE.md`](../PHASE_2_ENCAIXE.md) | `feature/encaixe/*` |
| 3 | **LAPIDAÇÃO** | Diretoria + KPIs + PWA + Go-Live | [`docs/PHASE_3_LAPIDACAO.md`](../PHASE_3_LAPIDACAO.md) | `feature/lapidacao/*` |
| 4 | **VERNIZ** | Engenharia + Suprimentos + Produção + Obra + Portal Arquiteto + IA + Replicação Lioma | [`docs/PHASE_4_VERNIZ.md`](../PHASE_4_VERNIZ.md) | `feature/verniz/*` |

📄 Visão geral: [`docs/ROADMAP.md`](../ROADMAP.md)

---

## 🔗 Documentação Relacionada

| Onde buscar | Para quê |
|---|---|
| [`README.md`](../../README.md) | Visão geral, setup, comandos |
| [`docs/ARCHITECTURE.md`](../ARCHITECTURE.md) | Arquitetura detalhada |
| [`docs/BRANDING.md`](../BRANDING.md) | Identidade visual e tokens |
| [`docs/DOMAIN_MODEL.md`](../DOMAIN_MODEL.md) | Modelo de domínio completo |
| [`docs/DATABASE.md`](../DATABASE.md) | Schema, índices, RLS |
| [`docs/PERMISSIONS.md`](../PERMISSIONS.md) | Matriz de permissões |
| [`docs/SECURITY.md`](../SECURITY.md) | Políticas e threat model |
| [`docs/REALTIME_STRATEGY.md`](../REALTIME_STRATEGY.md) | O que é realtime e o que não é |
| [`docs/STYLE_GUIDE.md`](../STYLE_GUIDE.md) | Padrões de código |
| [`docs/ai/CONTEXT.md`](./CONTEXT.md) | Domínio simplificado |
| [`docs/ai/PATTERNS.md`](./PATTERNS.md) | Templates de código |
| [`docs/ai/PROMPTS.md`](./PROMPTS.md) | Biblioteca de prompts produtivos |
| [`docs/ai/GLOSSARY.md`](./GLOSSARY.md) | Glossário marcenaria + sistema |

---

## 🎯 Frase-Guia da IA

> **"Como tornar este código mais simples, seguro, rápido e alinhado ao domínio Arali?"**

Sempre que sugerir algo, perguntar internamente se isso:
- ✅ Reduz a complexidade
- ✅ Melhora a segurança (RLS, validação)
- ✅ Está alinhado ao domínio em PT-BR
- ✅ É manutenível por solo dev
- ✅ Cabe no orçamento de R$500/mês de infra

Se a resposta for "não" em qualquer um, **repensar antes de propor**.

---

**Versão**: 1.1
**Última atualização**: 2026-04-30
**Autor**: Marcus Vitorino + Copiloto IA
