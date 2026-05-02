# 🎨 Style Guide — Arali Flow

> Padrões de código, naming, arquitetura de pastas, validação, testes e Git para o projeto Arali Flow. **Documento normativo**: divergências exigem PR + justificativa técnica.

---

## Sumário

1. [Princípios Gerais](#1-princípios-gerais)
2. [TypeScript](#2-typescript)
3. [Naming Conventions](#3-naming-conventions)
4. [Estrutura de Pastas](#4-estrutura-de-pastas)
5. [React / Next.js 15](#5-react--nextjs-15)
6. [Server Actions e Mutations](#6-server-actions-e-mutations)
7. [Data Fetching](#7-data-fetching)
8. [Validação com Zod](#8-validação-com-zod)
9. [Tailwind + Shadcn UI](#9-tailwind--shadcn-ui)
10. [Acessibilidade (a11y)](#10-acessibilidade-a11y)
11. [Tratamento de Erros](#11-tratamento-de-erros)
12. [Testes](#12-testes)
13. [Git e Commits](#13-git-e-commits)
14. [Observabilidade](#14-observabilidade)
15. [Performance](#15-performance)
16. [Anti-Patterns Banidos](#16-anti-patterns-banidos)

---

## 1. Princípios Gerais

1. **Legibilidade > Cleverness** — código que pessoas (e IA) entendem rápido vence código "esperto"
2. **Servidor por padrão** — Server Components, Server Actions, RSC cache. `"use client"` é exceção, não regra
3. **PT-BR no domínio, EN na infra** — `pasta_projeto`, `tasks`, `integrantes_times` (PT) coexistem com `lib/supabase/server-client.ts`, `hooks/use-realtime-feed.ts` (EN)
4. **Funções pequenas** — alvo de ~30 linhas, uma responsabilidade. Acima de 50 linhas exige justificativa
5. **Sem `any`** — `unknown` + narrowing. `any` é code smell que falha CI
6. **Imports absolutos** — sempre via `@/` (configurado em `tsconfig.json`)
7. **Feature-folder quando possível** — features autocontidas em `app/(app)/<feature>/`
8. **Comentários explicam "porquê", não "o quê"** — código bom já diz o quê

---

## 2. TypeScript

### Configuração obrigatória

`tsconfig.json` deve ter:

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "noFallthroughCasesInSwitch": true,
    "exactOptionalPropertyTypes": true
  }
}
```

### Regras

- **Sem `any`**: violação falha CI. Use `unknown` + type guards
- **Tipos são derivados quando possível**:
  ```ts
  // ✅ Bom — deriva da fonte
  type Task = Database['public']['Tables']['tasks']['Row']
  
  // ❌ Ruim — duplicação
  interface Task { id: string; titulo: string; ... }
  ```
- **Use `type` para uniões/aliases, `interface` para extensões**:
  ```ts
  type Status = 'pendente' | 'em_andamento' | 'concluida'
  interface Task { ... }
  interface RevisaoTask extends Task { tipo: 'revisao' }
  ```
- **Funções genéricas com constraints explícitas**:
  ```ts
  function pegarPrimeiro<T extends { id: string }>(items: T[]): T | undefined {
    return items[0]
  }
  ```
- **Discriminated unions** para variantes de domínio:
  ```ts
  type TaskEvento =
    | { tipo: 'criada'; criadaPor: string }
    | { tipo: 'concluida'; concluidaPor: string; tempoGasto: number }
    | { tipo: 'revisao_solicitada'; motivo: string; timeAlvo: string }
  ```

---

## 3. Naming Conventions

| Elemento | Convenção | Exemplo |
|---|---|---|
| **Arquivos componente** | kebab-case | `pasta-projeto-card.tsx` |
| **Componentes React** | PascalCase | `PastaProjetoCard` |
| **Hooks** | camelCase com `use` | `usePastaProjeto`, `useRealtimeFeed` |
| **Funções** | camelCase | `distribuirProjeto`, `criarTaskRevisao` |
| **Constantes** | UPPER_SNAKE_CASE | `MAX_INTEGRANTES_TIME`, `RLS_CACHE_TTL` |
| **Tipos / Interfaces** | PascalCase | `IntegranteTime`, `PastaProjeto` |
| **Enums (preferir tipos)** | PascalCase + valores em snake_case | só onde TS enum justifica |
| **Tabelas DB** | snake_case plural PT-BR | `projetos`, `integrantes_times`, `tasks` |
| **Colunas DB** | snake_case PT-BR | `criado_em`, `prazo_estimado`, `time_responsavel_id` |
| **Variáveis** | camelCase | `pastaProjeto`, `tasksAtrasadas` |
| **Booleanos** | prefixo `is/has/can/should` | `isLider`, `hasRevisaoPendente`, `canDistribuir` |
| **Server Actions** | verbo imperativo PT-BR | `distribuirProjeto`, `solicitarRevisao` |
| **Schemas Zod** | substantivo + Schema | `TaskSchema`, `PastaProjetoSchema` |
| **Tipos Zod inferidos** | substantivo | `Task = z.infer<typeof TaskSchema>` |
| **Eventos / Tipos custom Postgres** | snake_case PT-BR | `task_concluida`, `revisao_solicitada` |
| **Pastas Server Actions** | snake_case | `server/actions/distribuir_projeto.ts` |

### Regras Adicionais

- **Não abreviar** termos de domínio. Use `pastaProjeto`, não `pp` ou `pasta`
- **Plural só quando coleção**: `tasks` (array), `task` (item)
- **IDs**: `<entidade>Id` ou `<entidade>_id` em DB. Nunca `id` solto em props (a menos que seja óbvio)
- **Dates**: sufixo `Em` ou `_em` para timestamps (`criadoEm`, `criado_em`); sufixo `Em` para campos data (`prazoCliente`, `dataInicio`)

---

## 4. Estrutura de Pastas

Arquitetura organizada por camada + feature, conforme `README.md` raiz. Regras:

### Regra 1: Routing (`app/`)

- `app/(auth)/` — fluxo de autenticação (sem sidebar)
- `app/(app)/` — área autenticada (com shell)
- `app/api/` — Route Handlers (webhooks, integrações externas)
- `[id]/` é dinâmico do Next.js — usar quando o segmento é variável

### Regra 2: Componentes (`components/`)

- `components/ui/` — primitives Shadcn (não tocar a menos que seja necessário)
- `components/shell/` — Sidebar, Header, Navigation (chrome do app)
- `components/<dominio>/` — agrupamento por domínio (`projeto/`, `tasks/`, `feed/`, `times/`)
- `components/shared/` — componentes utilitários cross-domain (Avatar, Badge customizado, etc.)

**Regra de proximidade**: se um componente é usado em **uma única tela**, fica colocalizado:

```
app/(app)/projetos/[id]/pasta/
├── page.tsx
├── timeline/
│   ├── timeline-paralela.tsx
│   └── linha-do-tempo-times.tsx
└── tasks/
    └── lista-tasks.tsx
```

Se virar **reutilizável em ≥2 lugares**, promove para `components/projeto/`.

### Regra 3: Lib (`lib/`)

- `lib/supabase/` — clients (server, browser, admin) — **NUNCA expor service role no browser**
- `lib/auth/` — helpers de auth
- `lib/permissions/` — helpers de RBAC (espelho do RLS)
- `lib/validations/` — schemas Zod
- `lib/utils/` — utilitários puros (formatação de data, slugify, etc.)
- `lib/constants/` — constantes de aplicação
- `lib/observability/` — Sentry, logger, audit helper

### Regra 4: Server (`server/`)

- `server/actions/` — Server Actions (mutations) — funções com `"use server"` no topo do arquivo
- `server/queries/` — funções de leitura (chamadas de RSC)
- `server/services/` — lógica de negócio pura, testável sem mock de DB

---

## 5. React / Next.js 15

### Server Components por padrão

```tsx
// ✅ Bom — Server Component (default)
import { listarPastasDoTime } from '@/server/queries/pasta-projeto'

export default async function ListaPastas({ params }: { params: { timeSlug: string } }) {
  const pastas = await listarPastasDoTime(params.timeSlug)
  return <PastasGrid pastas={pastas} />
}
```

### Client Components: apenas quando necessário

Use `"use client"` somente para:
- Interatividade (forms, modais, dropdowns)
- Hooks de estado (`useState`, `useReducer`)
- Hooks de browser API (`useEffect`, `useRef`)
- Realtime subscriptions
- Animações Framer Motion

```tsx
"use client"

import { useState } from 'react'

export function NovaTaskForm() {
  const [titulo, setTitulo] = useState('')
  // ...
}
```

### Composição: Server Component contendo Client Component

```tsx
// page.tsx (Server)
import { TaskForm } from './task-form'    // client
import { listarTasks } from '@/server/queries/tasks'  // server

export default async function Page() {
  const tasks = await listarTasks()
  return (
    <div>
      <TaskList tasks={tasks} />     {/* server */}
      <TaskForm />                    {/* client */}
    </div>
  )
}
```

### Loading e Error UI

Toda rota não-trivial tem `loading.tsx` e `error.tsx`:

```
app/(app)/projetos/[id]/pasta/
├── page.tsx
├── loading.tsx       ← Skeleton específico
└── error.tsx         ← Fallback amigável
```

`error.tsx` deve ser Client Component (recebe `error` e `reset`):

```tsx
"use client"

export default function ErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div>
      <h2>Algo deu errado nesta pasta</h2>
      <p>{error.message}</p>
      <button onClick={reset}>Tentar novamente</button>
    </div>
  )
}
```

---

## 6. Server Actions e Mutations

### Estrutura padrão

```ts
// server/actions/distribuir-projeto.ts
"use server"

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server-client'
import { distribuirProjetoSchema } from '@/lib/validations/projeto'
import { ServerActionResult } from '@/types/api'

export async function distribuirProjeto(
  input: z.infer<typeof distribuirProjetoSchema>
): Promise<ServerActionResult<{ id: string }>> {
  // 1. Validação Zod
  const parsed = distribuirProjetoSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, erro: 'Dados inválidos', detalhes: parsed.error.flatten() }
  }

  // 2. Cliente Supabase com auth do usuário (RLS aplicada)
  const supabase = await getSupabaseServerClient()

  // 3. Execução da mutation (RLS protege)
  const { data, error } = await supabase
    .from('pastas_projeto_times')
    .insert({
      pasta_projeto_id: parsed.data.pastaProjetoId,
      time_id: parsed.data.timeId,
    })
    .select('id')
    .single()

  if (error) {
    return { ok: false, erro: 'Erro ao distribuir projeto' }
  }

  // 4. Revalidação de cache
  revalidatePath(`/projetos/${parsed.data.projetoId}/pasta`)

  return { ok: true, data: { id: data.id } }
}
```

### Tipo padrão de retorno

```ts
// types/api.ts
export type ServerActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; erro: string; detalhes?: unknown }
```

### Regras

- Toda Server Action **valida com Zod** antes de qualquer operação
- Toda Server Action **retorna `ServerActionResult<T>`**, nunca lança exceção para o client
- Toda Server Action **chama `revalidatePath`** ou `revalidateTag` após mutation
- **Nunca expor service role key**: Server Action usa o cliente normal (RLS protege)
- Operações administrativas que precisam bypass de RLS usam cliente admin **explicitamente** em `lib/supabase/admin-client.ts`

---

## 7. Data Fetching

### RSC (Server Components)

```ts
// server/queries/pasta-projeto.ts
import { getSupabaseServerClient } from '@/lib/supabase/server-client'
import { cache } from 'react'

export const buscarPasta = cache(async (id: string) => {
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase
    .from('pastas_projeto')
    .select('*, projeto:projetos(*), times:pastas_projeto_times(time:times(*))')
    .eq('id', id)
    .maybeSingle()
  
  if (error) throw error
  return data
})
```

### Client Components com TanStack Query

```ts
// hooks/use-tasks-pasta.ts
"use client"

import { useQuery } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client'

export function useTasksPasta(pastaId: string) {
  const supabase = getSupabaseBrowserClient()
  return useQuery({
    queryKey: ['tasks', 'pasta', pastaId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('pasta_projeto_id', pastaId)
      if (error) throw error
      return data
    },
    staleTime: 30_000,
  })
}
```

### Realtime

```ts
// hooks/use-realtime-feed.ts
"use client"

import { useEffect } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { getSupabaseBrowserClient } from '@/lib/supabase/browser-client'

export function useRealtimeFeed(feedId: string) {
  const queryClient = useQueryClient()
  const supabase = getSupabaseBrowserClient()
  
  useEffect(() => {
    const channel = supabase
      .channel(`feed:${feedId}`)
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'post_feeds', filter: `feed_id=eq.${feedId}` },
        () => queryClient.invalidateQueries({ queryKey: ['feed', feedId] })
      )
      .subscribe()
    
    return () => { supabase.removeChannel(channel) }
  }, [feedId, queryClient, supabase])
}
```

### Regras

- **Server Components** usam `cache()` da React quando há reuso na mesma request
- **Client Components** usam TanStack Query com `staleTime` apropriado
- **Realtime** sempre faz cleanup (`removeChannel` no return)
- **Nunca** consultar Supabase diretamente em Client Component sem TanStack Query (cache desorganizado)

---

## 8. Validação com Zod

### Convenção

```ts
// lib/validations/task.ts
import { z } from 'zod'

export const TaskStatusSchema = z.enum([
  'pendente', 'em_andamento', 'em_revisao', 'concluida', 'cancelada', 'bloqueada'
])

export const TaskSchema = z.object({
  id: z.string().uuid(),
  pastaProjetoId: z.string().uuid(),
  timeResponsavelId: z.string().uuid(),
  ownerId: z.string().uuid().nullable(),
  titulo: z.string().min(3).max(200),
  descricao: z.string().max(5000).nullable(),
  tipo: z.enum(['normal', 'revisao', 'bloqueio_externo', 'auto_ferramenta']),
  status: TaskStatusSchema,
  prioridade: z.enum(['P0', 'P1', 'P2', 'P3']),
  prazo: z.coerce.date().nullable(),
})

export type Task = z.infer<typeof TaskSchema>

// Schema para criação (sem id, sem timestamps)
export const CriarTaskSchema = TaskSchema.omit({ id: true }).extend({
  // ...
})
```

### Regras

- **Toda Server Action valida input** com Zod antes de tudo
- **Toda fronteira externa** (webhook, API externa, dados de planilha) valida com Zod
- **Tipos do domínio** preferencialmente derivados de schemas Zod
- **Mensagens de erro em PT-BR**: usar `z.string({ required_error: 'Título é obrigatório' })`

---

## 9. Tailwind + Shadcn UI

### Cores do Branding

Variáveis CSS em `app/globals.css` seguindo a paleta luxo discreto da Arali (ver `docs/BRANDING.md`):

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 0 0% 8%;          /* preto profundo */
    --primary: 26 65% 35%;          /* madeira escura */
    --accent: 38 70% 55%;           /* gold suave */
    --warning: 22 90% 55%;          /* alaranjado */
    /* ... */
  }
}
```

### Tailwind Classes

- Mobile-first: classes sem prefixo são mobile, `md:` `lg:` adicionam para telas maiores
- Espaçamento consistente: `gap-4`, `p-6`, `space-y-3`
- **Não inline-styles**: tudo via Tailwind
- Customizações específicas em `tailwind.config.ts`, não em `style={...}`

### Shadcn UI

- Primitives ficam em `components/ui/` — não modifique para mudanças globais; estenda
- Customizações via `cn()` (utility de combinação de classes):
  ```tsx
  import { cn } from '@/lib/utils'
  
  <Button className={cn('bg-accent', isActive && 'ring-2')}>...</Button>
  ```

---

## 10. Acessibilidade (a11y)

- **Semantic HTML**: `<button>` para clicáveis, `<a>` para links, `<nav>` para navegação
- **Imagens com `alt`** sempre. Decorativas: `alt=""`
- **Forms com labels**: cada `<input>` tem `<label htmlFor>` ou está dentro de `<label>`
- **Focus visible**: usar `focus-visible:ring` no Tailwind
- **ARIA**: usar quando semantic HTML não cobre (`aria-label`, `aria-expanded`, etc.)
- **Contraste**: WCAG AA mínimo (4.5:1 para texto normal)
- **Teclado**: tudo navegável por Tab + Enter/Space
- Testes Playwright incluem checagem com `@axe-core/playwright`

---

## 11. Tratamento de Erros

### Camadas

1. **Validação (Zod)**: erros previsíveis viram retorno `{ ok: false, erro: '...' }`
2. **Negócio (Service)**: erros conhecidos viram `BusinessError` customizado
3. **Inesperados**: capturados por error boundary + Sentry

### Padrão de erro de negócio

```ts
// lib/errors.ts
export class BusinessError extends Error {
  constructor(public code: string, message: string, public meta?: Record<string, unknown>) {
    super(message)
    this.name = 'BusinessError'
  }
}

// uso
throw new BusinessError('TASK_DEPENDENCY_BLOCKED', 'Task bloqueada por dependência', { taskId })
```

### Logs

- **Nunca console.log em produção** — usar `logger` (em `lib/observability/logger.ts`)
- **Sentry captura tudo unhandled** — config em `sentry.server.config.ts` e `sentry.client.config.ts`
- **PII fora do log**: nunca logar senha, token, ou dado pessoal sensível

---

## 12. Testes

### Vitest (unit + integration)

```ts
// server/services/distribuir-projeto.test.ts
import { describe, it, expect, vi } from 'vitest'
import { distribuirProjetoService } from './distribuir-projeto'

describe('distribuirProjetoService', () => {
  it('rejeita se Líder tenta atribuir a Integrante de outro Time', async () => {
    const resultado = await distribuirProjetoService({
      lider: { id: 'l1', timesIds: ['time-a'] },
      integranteAlvoId: 'int-b',
      integranteTimeId: 'time-b',
    })
    expect(resultado.ok).toBe(false)
    expect(resultado.erro).toContain('cross-team')
  })
})
```

### Playwright (E2E)

- Cobertura mínima:
  - Login + logout
  - Distribuição de projeto
  - Criação de Task + mudança de status
  - Solicitação de Revisão
  - RLS: usuário vê apenas seu escopo
- Tests rodam em `tests/e2e/` com fixtures de seed

### Cobertura

- Domain services: ≥ 80%
- Server Actions: ≥ 70%
- Componentes UI: smoke tests (renderiza sem erro) + interações críticas
- E2E: fluxos críticos sempre cobertos

---

## 13. Git e Commits

### Conventional Commits

```
<tipo>(<escopo>): <descrição em PT-BR no imperativo>

[corpo opcional]

[footer opcional]
```

Tipos:
- `feat` — nova feature
- `fix` — correção de bug
- `refactor` — sem mudança funcional
- `docs` — apenas documentação
- `chore` — build, deps, infra
- `test` — testes
- `perf` — performance
- `style` — formatação (raro com Prettier)

Exemplos:
```
feat(pasta-projeto): adicionar timeline paralela com filtro por time
fix(rls): permitir Diretoria visualizar tasks deletadas
docs(adr): registrar ADR-006 sobre forward N:N de posts
```

### Branches

```
main         → produção
staging      → homologação
develop      → integração
feature/*    → novas features
fix/*        → correções
hotfix/*     → emergências em produção
```

### Pull Request

Template em `.github/PULL_REQUEST_TEMPLATE.md` deve incluir:
- Descrição do problema e solução
- Checklist (testes, docs, RLS, mobile)
- Screenshots/Loom se UI
- Issue relacionada

**Definição de Pronto (DoD)** ver README.

---

## 14. Observabilidade

### Logger

```ts
// lib/observability/logger.ts
import { logger } from 'pino'  // ou similar

export const log = logger({
  level: process.env.LOG_LEVEL || 'info',
  redact: ['email', 'telefone', 'password', '*.token'],
})
```

### Sentry

- Configurado para Server, Edge e Browser
- Source maps enviados em build
- PII scrubbing ativo
- Alertas configurados para Diretoria team

### Audit Log

- Helper: `logAudit({ acao, recursoTipo, recursoId, payloadAntes, payloadDepois })`
- Chamado no final de Server Actions sensíveis
- Nunca falha a Server Action se audit falhar (best effort + alerta)

---

## 15. Performance

### Rules of thumb

- **Bundle inicial < 200KB gzip** (alvo)
- **TTFB < 600ms** em 95% das requests
- **LCP < 2.5s** em mobile 4G
- **Imagens otimizadas** via `next/image` sempre
- **Code splitting** automático do Next.js — não usar `dynamic` sem motivo
- **`React.memo`** apenas com profiling justificando (premature optimization causa bugs)

### Database

- **Índices** em foreign keys e colunas usadas em filtros frequentes
- **EXPLAIN ANALYZE** em queries que envolvem joins de >3 tabelas
- **Materialized views** para KPIs Diretoria (refresh 5min)

---

## 16. Anti-Patterns Banidos

- ❌ `any` em qualquer lugar do código (use `unknown` + narrowing)
- ❌ `console.log` em produção (use `logger`)
- ❌ Service role key no client
- ❌ Checar permissão duas vezes (no client e no server) — RLS é a verdade
- ❌ `useEffect` com fetch sem `AbortController` ou TanStack Query
- ❌ Mudança de estado em listener Realtime sem cleanup
- ❌ Comentário `// TODO` sem issue vinculado
- ❌ Magic numbers — extraia para constante nomeada
- ❌ Inline `style={{}}` (use Tailwind)
- ❌ Mutação de array/objeto em React state (use spread/imutável)
- ❌ Strings duplicadas para domain (use enum/union derivado de Zod)
- ❌ Server Action que lança exceção (sempre retornar `ServerActionResult`)
- ❌ "Voltar etapa" no fluxo (use Sistema de Revisão — ver ADR-003)

---

## Referências

- [README.md](../README.md)
- [DOMAIN_MODEL.md](./DOMAIN_MODEL.md)
- [PERMISSIONS.md](./PERMISSIONS.md)
- [BRANDING.md](./BRANDING.md)
- [DECISIONS/](./DECISIONS/)
- [docs/ai/PATTERNS.md](./ai/PATTERNS.md)
