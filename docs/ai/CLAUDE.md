# 🤖 CLAUDE.md — Contexto para IA Assistida

> **Este arquivo é OBRIGATÓRIO como contexto** em qualquer sessão de código com Claude Code, Cursor, GitHub Copilot Chat, ChatGPT, ou qualquer LLM trabalhando neste repositório. Anexe ou referencie este arquivo no início de cada sessão.

---

## 🎯 O que é este projeto

**Arali Flow** é o **sistema operacional digital interno** da **Arali Móveis** — uma marcenaria de altíssimo padrão. O sistema digitaliza e orquestra o fluxo de Projetos através de Ambientes (departamentos) com Times, Tasks, Ferramentas e Feed.

**Modelo**: Single-tenant (uso exclusivo da Arali, NÃO é SaaS).  
**Idioma**: 100% PT-BR (interface, código de domínio, comentários de domínio).  
**Prazo**: MVP em 4 meses.  
**Time**: Solo dev (Marcus Vitorino) + IA assistida.

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

**TL;DR:**
- Dark-first (modo claro só na fase 2)
- Paleta: Preto profundo (`noir`) + Madeira (`wood`) + Gold (`gold`) + Alaranjado (`amber`) + Neutros
- Tipografia: Inter (UI), Cormorant Garamond (display), JetBrains Mono (códigos/valores)
- Border radius: padrão `rounded-md` (6px) e `rounded-lg` (8px) em cards
- Sombras: escuras + highlight superior 4% para sensação "lapidada"

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

**Versão**: 1.0  
**Última atualização**: 2026-04-29  
**Autor**: Marcus Vitorino + Copiloto IA
