# 🤖 Prompt Mestre — System Design & Instruction (Frontend Arali Flow)

> **Documento ativo, versionado.** Este é o **Prompt Mestre** usado em qualquer ferramenta de IA assistida (Claude Code, Cursor, v0 by Vercel, Antigravity, etc.) para gerar UI e código frontend do Arali Flow com padrão consistente, alinhado ao domínio e à stack fixa.
>
> **Como usar**: copie o bloco "PROMPT" no início de cada nova conversação com IA. Anexe o arquivo da feature específica que está sendo construída. Rode.
>
> **Versão**: 1.0 — 2026-05-01
> **Mantenedor**: Marcus Vitorino (Lioma IT)
> **Atualização**: cada vez que padrão se mostrar inadequado, revisar e versionar.

---

## 📋 ÍNDICE

1. [Quando Usar Este Prompt](#1-quando-usar-este-prompt)
2. [Estrutura do Prompt — 3 Camadas](#2-estrutura-do-prompt--3-camadas)
3. [PROMPT — Camada 1: Contexto de Negócio](#3-prompt--camada-1-contexto-de-negócio)
4. [PROMPT — Camada 2: System Design Técnico](#4-prompt--camada-2-system-design-técnico)
5. [PROMPT — Camada 3: Instructions Operacionais](#5-prompt--camada-3-instructions-operacionais)
6. [Como Combinar com Especificação de Feature](#6-como-combinar-com-especificação-de-feature)
7. [Adaptações por Ferramenta](#7-adaptações-por-ferramenta)
8. [Anti-Patterns (a IA NÃO deve gerar)](#8-anti-patterns-a-ia-não-deve-gerar)
9. [Exemplo Prático](#9-exemplo-prático)

---

## 1. Quando Usar Este Prompt

Sempre que for gerar:
- Páginas (Next.js App Router) — `app/(app)/.../page.tsx`
- Componentes de UI (Server ou Client) — `components/...`
- Server Actions — `server/actions/...`
- Queries — `server/queries/...`
- Hooks de Realtime ou Data — `hooks/...`
- Schemas Zod — `lib/validations/...`

NÃO usar para:
- Schema SQL (use prompts específicos do PostgreSQL/Supabase)
- Decisões arquiteturais (use ADR template)
- Documentação de produto (use docs específicos)

---

## 2. Estrutura do Prompt — 3 Camadas

O prompt mestre é montado em 3 camadas. Você pode usar todas juntas ou apenas as relevantes:

```
┌─────────────────────────────────────────┐
│ CAMADA 1: Contexto de Negócio           │  ← O que é o Arali Flow, quem usa, por que
├─────────────────────────────────────────┤
│ CAMADA 2: System Design Técnico         │  ← Stack, arquitetura, padrões de código
├─────────────────────────────────────────┤
│ CAMADA 3: Instructions Operacionais     │  ← Como gerar, validar, entregar
└─────────────────────────────────────────┘
                  +
┌─────────────────────────────────────────┐
│ ESPEC. DA FEATURE (anexo, por sessão)   │  ← O que vai ser construído agora
└─────────────────────────────────────────┘
```

---

## 3. PROMPT — Camada 1: Contexto de Negócio

```markdown
# CONTEXTO DO PRODUTO — ARALI FLOW

Você está gerando código para o **Arali Flow** — sistema operacional digital interno
da **Arali Móveis**, marcenaria de altíssimo padrão atendendo arquitetos como
MK27, Bernardes, Jacobsen, Studio Arthur Casas e Isay Weinfeld. O sistema é
desenvolvido pela **LIOMA IT** (software house B2B fundada por Marcus Vitorino)
em modelo single-tenant deployment, com IP da LIOMA IT, replicável para outras
marcenarias premium.

## OPERAÇÃO QUE O ARALI FLOW DIGITALIZA

A Arali opera **26 projetos simultâneos** atravessando múltiplos Times:
- **Diretoria** — visão executiva, KPIs, aprovações
- **Comercial** — propostas, contratos, recebimentos
- **PCP** — planejamento, controle, programação de produção
- **Engenharia** — projetos técnicos (futuro)
- **Suprimentos** — compras, fornecedores (futuro)
- **Produção** — fábrica, ordens, execução (futuro)
- **Obra** — instalação, montagem (futuro)

**No MVP (4 meses)**: apenas Diretoria + Comercial + PCP.

A operação atual tem dores claras:
- Comunicação fragmentada (WhatsApp, planilhas, e-mail)
- 2 planilhas Excel críticas com milhões de R$/mês em movimento
- Confirmações em texto livre ("CONFIRMADO VIA WHATSAPP PELA MARIANA DIA 13/02")
- Falta de rastreabilidade
- Hierarquia difusa entre 60 usuários
- Indicadores defasados ou inexistentes

## CONCEITOS CENTRAIS DO DOMÍNIO

- **Projeto** — obra contratada (ex: "Apto Vila Nova Conceição")
- **Pasta do Projeto** — container digital com timeline, tasks, ferramentas, documentos
- **Time** — grupo de Integrantes de um Ambiente (ex: Time Comercial)
- **Ambiente** — área operacional (Comercial, PCP, etc.)
- **Integrante** — pessoa associada a um ou mais Times
- **Líder** (até 2 por Time) — distribui tasks dentro do Time
- **Gestor** (até 2 por Time) — coordena 1+ Times, definido pela Diretoria
- **Diretoria** — acesso total
- **Task** — unidade de trabalho dentro de uma Pasta
- **Revisão** — task tipo `revisao` apontando erro vindo de outro Time
- **Ferramenta** — módulo especializado (Recebimentos, Propostas, etc.)
- **Feed** — timeline social de posts (Time, Geral, Pasta)
- **Forward de Post** — compartilhamento N:N (não duplica)

## PRINCÍPIOS DE NEGÓCIO

1. **Paralelismo entre Times** — Times trabalham simultaneamente na mesma Pasta,
   sem etapas sequenciais bloqueantes. Erros viram Tasks de Revisão.
2. **RLS é a fonte de verdade de autorização** — nunca checar permissão duas vezes.
3. **Realtime cirúrgico** — apenas Feed, Timeline, Tasks, Notificações, Mudança de Role.
4. **Mobile-first PWA** — toda tela projetada para 375px primeiro.
5. **Branding luxo discreto** — Preto, Madeira, Gold, Alaranjado.
6. **PT-BR no domínio, EN na infra técnica**.

## REFERÊNCIAS COMPLETAS

- README.md raiz
- docs/DOMAIN_MODEL.md
- docs/PERMISSIONS.md
- docs/STYLE_GUIDE.md
- docs/BRANDING.md
- docs/DECISIONS/ADR-001 a ADR-005
```

---

## 4. PROMPT — Camada 2: System Design Técnico

```markdown
# SYSTEM DESIGN TÉCNICO — ARALI FLOW

## STACK FIXA (NÃO MUDAR)

- **Frontend runtime**: Next.js 15 LTS (App Router) — fixo, decisão imutável
- **UI**: Tailwind CSS + Shadcn UI + Framer Motion + Lucide icons
- **Estado client**: TanStack Query
- **Forms**: React Hook Form + Zod
- **Backend**: Supabase (Postgres + Auth + Storage + Realtime + Edge Functions)
- **Hosting**: Vercel (frontend) + Supabase (backend)
- **Linguagem**: TypeScript strict, sem `any`, com `noUncheckedIndexedAccess`
- **Idioma**: PT-BR no domínio (`pasta_projeto`, `tasks`), EN na infra (`use-realtime-feed`)

## ARQUITETURA EM CAMADAS

| Camada | Responsabilidade | Onde mora |
|---|---|---|
| Presentation | UI, captura de input | `app/`, `components/` |
| Application | Use cases | `app/api/`, `server/actions/` |
| Domain | Regras de negócio puras | `server/services/`, `lib/domain/` |
| Persistence | Acesso a dados | `lib/supabase/`, `server/queries/` |
| Authorization | RLS + RBAC | `supabase/policies/`, `lib/permissions/` |
| Realtime | Pub/sub cirúrgico | `hooks/use-realtime-*.ts` |
| Observability | Logs, traces | `lib/observability/` |

## PADRÕES DE CÓDIGO OBRIGATÓRIOS

### Server Components por padrão
```tsx
// ✅ Correto
import { listarTasksDaPasta } from '@/server/queries/tasks'

export default async function TasksPage({ params }: { params: { id: string } }) {
  const tasks = await listarTasksDaPasta(params.id)
  return <TasksList tasks={tasks} />
}
```

### Client Components apenas quando necessário
Use `"use client"` somente para: forms, modais, hooks de browser, realtime, animações.

### Server Actions com retorno padrão
```ts
"use server"

import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server-client'

const InputSchema = z.object({ ... })

export async function nomeDaAcao(
  input: z.infer<typeof InputSchema>
): Promise<ServerActionResult<{ ... }>> {
  const parsed = InputSchema.safeParse(input)
  if (!parsed.success) return { ok: false, erro: 'Dados inválidos' }
  
  const supabase = await getSupabaseServerClient()
  const { data, error } = await supabase.from('...').insert({ ... }).select().single()
  
  if (error) return { ok: false, erro: 'Erro ao processar' }
  
  revalidatePath('/...')
  return { ok: true, data }
}
```

### Tipo padrão de retorno
```ts
type ServerActionResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; erro: string; detalhes?: unknown }
```

### Validação Zod sempre
- Toda entrada de Server Action validada com Zod
- Schemas em `lib/validations/<dominio>.ts`
- Tipos derivados via `z.infer<typeof Schema>`

### TanStack Query para client
```ts
"use client"
export function useTasksPasta(pastaId: string) {
  return useQuery({
    queryKey: ['tasks', 'pasta', pastaId],
    queryFn: async () => { ... },
    staleTime: 30_000,
  })
}
```

### Realtime com cleanup obrigatório
```ts
"use client"
export function useRealtimeFeed(feedId: string) {
  useEffect(() => {
    const channel = supabase.channel(`feed:${feedId}`)
      .on('postgres_changes', { ... }, () => { ... })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [feedId])
}
```

## NAMING CONVENTIONS

| Elemento | Convenção | Exemplo |
|---|---|---|
| Arquivo componente | kebab-case | `pasta-projeto-card.tsx` |
| Componente React | PascalCase | `PastaProjetoCard` |
| Hook | camelCase com `use` | `usePastaProjeto` |
| Função | camelCase | `distribuirProjeto` |
| Constante | UPPER_SNAKE_CASE | `MAX_INTEGRANTES_TIME` |
| Tipo / Interface | PascalCase | `IntegranteTime` |
| Tabela DB | snake_case plural PT-BR | `pastas_projeto`, `tasks` |
| Coluna DB | snake_case PT-BR | `criado_em`, `time_responsavel_id` |
| Server Action | verbo imperativo PT-BR | `distribuirProjeto`, `solicitarRevisao` |
| Schema Zod | substantivo + Schema | `TaskSchema`, `PastaProjetoSchema` |

## PERMISSÕES — REGRAS GERAIS

- **RLS protege no banco** — não reimplementar no client
- **Helper functions SQL**: `is_diretoria()`, `is_lider_de_time(id)`, etc.
- **JWT carrega `user_id` + `role`** — pertencimento a Times via tabela
- Diretoria > Admin > Gestor > Líder > Integrante > Viewer
- Líder distribui apenas dentro do seu Time
- Gestor pode "convidar" outro Time à Pasta (notifica Líder daquele Time)

## REALTIME — REGRAS

Apenas estes módulos têm realtime:
- Feed do Time
- Feed Geral
- Timeline da Pasta do Projeto
- Tasks da Pasta
- Notificações in-app
- Mudança de role/permissão

Tudo o mais usa: refetch on focus, polling 30-60s, ou cache RSC.

## BRANDING (luxo discreto)

```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 8%;          /* preto profundo */
  --primary: 26 65% 35%;          /* madeira escura */
  --accent: 38 70% 55%;           /* gold suave */
  --warning: 22 90% 55%;          /* alaranjado */
}
```

Tipografia: ver `docs/BRANDING.md`. Tom: profissional, premium, sem "fofura".

## ACESSIBILIDADE

- Semantic HTML: `<button>`, `<a>`, `<nav>`, `<main>`
- ARIA quando semantic não cobre
- Focus visible (`focus-visible:ring`)
- Contraste WCAG AA mínimo
- Tudo navegável por teclado
```

---

## 5. PROMPT — Camada 3: Instructions Operacionais

```markdown
# INSTRUCTIONS — COMO GERAR

## Fluxo de Geração

1. **Analise a especificação** da feature (arquivo anexo)
2. **Identifique impactos** em: schema (migrations), RLS, validação Zod, UI, Server Action, query
3. **Gere arquivos completos** com path absoluto, não snippets soltos
4. **Use os padrões da Camada 2** sem desvio
5. **Comente apenas o "porquê"**, não o "quê"
6. **Nunca use `any`** — use `unknown` + narrowing
7. **Sempre Server Component primeiro** — só vire Client Component se justificável
8. **Toda Server Action retorna `ServerActionResult`** — nunca lança exceção pro client
9. **Valide com Zod antes de tudo**
10. **Inclua `revalidatePath` ou `revalidateTag`** após mutation

## Estrutura da Resposta

Para cada arquivo gerado:

````
### `<path absoluto>`

```ts
// código completo
```

**Por que assim**: 1-2 linhas explicando trade-off importante (se houver)
````

## Checklist Antes de Entregar

- [ ] TypeScript strict-clean (sem `any`, sem warning)
- [ ] Server Component se possível, Client Component se necessário
- [ ] Zod schema para validação de input
- [ ] RLS em mente — nunca confiar em valor do client para autorização
- [ ] PT-BR no domínio, EN na infra
- [ ] Naming conforme tabela
- [ ] Cleanup em hooks (Realtime, listeners)
- [ ] Tratamento de erro retornando `ServerActionResult`
- [ ] revalidatePath / revalidateTag após mutations
- [ ] Acessibilidade básica (semantic HTML, focus visible)
- [ ] Mobile-first (testar mentalmente em 375px)
- [ ] Sem inline styles — só Tailwind

## O Que NÃO Fazer

- ❌ NÃO inventar dependências fora da stack fixa
- ❌ NÃO usar `useState` em Server Component
- ❌ NÃO chamar Supabase direto em Client Component sem TanStack Query
- ❌ NÃO usar service role key em código que vai rodar no browser
- ❌ NÃO criar tabela sem RLS habilitada
- ❌ NÃO fazer fetch em useEffect sem AbortController ou TanStack Query
- ❌ NÃO usar `any` ou `as` para escapar de tipo
- ❌ NÃO duplicar lógica de permissão entre client e server
- ❌ NÃO gerar componente sem ser mobile-friendly
- ❌ NÃO inserir comentário `// TODO` sem issue

## Quando Pedir Clarificação

Pergunte (não chute) quando:
- Especificação é ambígua sobre permissão/escopo
- Há múltiplas formas válidas com trade-offs claros
- Domínio não está claro no contexto fornecido
- Risco de gerar algo que viola RLS
```

---

## 6. Como Combinar com Especificação de Feature

Para cada nova feature, criar um arquivo curto em `docs/specs/<feature>.md`:

```markdown
# Feature: Distribuir Projeto a Time

## Objetivo
Líder ou Gestor distribuir Projeto a Time(s), populando a Pasta do Projeto.

## Persona
- Quem usa: Líder, Gestor, Diretoria
- Frequência: 1-3 vezes por dia em pico

## Comportamento
1. Botão "Adicionar Time" na Pasta do Projeto
2. Modal com lista de Times disponíveis (filtros: meu time, times sob coordenação, todos)
3. Selecionar Time → confirma → cria registro em `pastas_projeto_times`
4. Notificação realtime ao Líder do Time alvo
5. Pasta atualiza visualmente com novo Time

## Regras
- Líder de Time pode adicionar APENAS seu próprio Time
- Gestor pode adicionar Times sob sua coordenação + outros Times (gera notificação ao Líder daquele Time)
- Diretoria pode adicionar qualquer Time

## Aceite
- [ ] RLS valida permissão (testes E2E com cada role)
- [ ] Notificação realtime aparece em ≤ 2s
- [ ] UI responsiva mobile + desktop
- [ ] Reverter Time (remover) também funciona
```

E **anexar este spec** ao prompt da Camada 1+2+3 quando rodar a IA.

---

## 7. Adaptações por Ferramenta

### Claude Code (Anthropic)

```bash
# CLI
claude code

# No primeiro prompt da sessão:
# Cole as 3 camadas + anexo da feature
# Claude lê o repositório, gera arquivos com paths corretos, executa testes
```

### Cursor IDE

- Use Cursor Pro
- Configure `.cursor/rules/arali-flow.md` com as 3 camadas
- Em cada conversação, anexe a spec da feature
- Use `@codebase` para Cursor entender contexto

### v0 by Vercel

- Útil para gerar **componentes UI isolados** (formulários complexos, modais, animações)
- NÃO usar para gerar Server Actions ou lógica de domínio
- Cole apenas a Camada 2 (técnica) + spec específica da UI

### Antigravity / Outros

- Adaptar conforme manual da ferramenta
- Sempre versionar adaptação no repo (`docs/ai/PROMPT_<FERRAMENTA>.md`)

---

## 8. Anti-Patterns (a IA NÃO deve gerar)

```ts
// ❌ ERRADO — any
function processarTask(task: any) { ... }

// ✅ CERTO — tipo derivado
import { Task } from '@/lib/validations/task'
function processarTask(task: Task) { ... }

// ❌ ERRADO — checagem de permissão no client
if (user.role === 'lider_time') { renderizarBotaoDistribuir() }

// ✅ CERTO — RLS no banco + componente confia
{podeDistribuir && <BotaoDistribuir />}  // podeDistribuir vem de Server Component

// ❌ ERRADO — fetch direto em Client Component
useEffect(() => {
  fetch('/api/tasks').then(r => r.json()).then(setTasks)
}, [])

// ✅ CERTO — TanStack Query
const { data: tasks } = useTasksPasta(pastaId)

// ❌ ERRADO — Server Action joga exceção
export async function distribuirProjeto(input) {
  if (!input.timeId) throw new Error('timeId obrigatório')
  // ...
}

// ✅ CERTO — Server Action retorna ServerActionResult
export async function distribuirProjeto(input): Promise<ServerActionResult<...>> {
  const parsed = Schema.safeParse(input)
  if (!parsed.success) return { ok: false, erro: 'Dados inválidos' }
  // ...
}

// ❌ ERRADO — inline style
<div style={{ padding: 16, color: '#000' }}>...</div>

// ✅ CERTO — Tailwind
<div className="p-4 text-foreground">...</div>

// ❌ ERRADO — "voltar etapa" no fluxo
async function voltarEtapaProjeto(projetoId) { ... }

// ✅ CERTO — Sistema de Revisão
async function solicitarRevisao(taskOrigemId, motivo, timeAlvoId) {
  // cria nova task tipo 'revisao'
}
```

---

## 9. Exemplo Prático

### Sessão de geração da Feature "Solicitar Revisão"

**Input para a IA**:
```
[Camada 1 — Contexto de Negócio]
[Camada 2 — System Design Técnico]
[Camada 3 — Instructions Operacionais]

# Feature: Solicitar Revisão de Task

## Objetivo
Permitir que um Integrante, ao trabalhar numa Task, solicite revisão a outro Time
quando detectar erro vindo daquele Time.

## Comportamento
1. Botão "Solicitar Revisão" na visualização de Task
2. Modal pergunta:
   - Time alvo (dropdown filtrado por Times participantes da Pasta)
   - Motivo (textarea, obrigatório, min 20 caracteres)
   - Prioridade (P0 default, editável)
3. Confirmar cria nova task tipo 'revisao' com link à task original
4. Pasta entra em status `em_revisao`
5. Notificação realtime ao Líder do Time alvo

## Regras
- Qualquer Integrante exceto viewer pode solicitar
- Não pode solicitar ao próprio Time
- Motivo é obrigatório

## Arquivos a gerar
- Server Action: server/actions/solicitar-revisao.ts
- Schema Zod: lib/validations/revisao.ts
- Componente: components/tasks/solicitar-revisao-modal.tsx
- Hook (se necessário): hooks/use-times-da-pasta.ts
```

**Output esperado** (resumido):

```ts
// lib/validations/revisao.ts
import { z } from 'zod'

export const SolicitarRevisaoSchema = z.object({
  taskOrigemId: z.string().uuid(),
  timeAlvoId: z.string().uuid(),
  motivo: z.string().min(20).max(2000),
  prioridade: z.enum(['P0', 'P1', 'P2', 'P3']).default('P0'),
})

export type SolicitarRevisaoInput = z.infer<typeof SolicitarRevisaoSchema>
```

```ts
// server/actions/solicitar-revisao.ts
"use server"

import { revalidatePath } from 'next/cache'
import { getSupabaseServerClient } from '@/lib/supabase/server-client'
import { SolicitarRevisaoSchema, type SolicitarRevisaoInput } from '@/lib/validations/revisao'
import type { ServerActionResult } from '@/types/api'

export async function solicitarRevisao(
  input: SolicitarRevisaoInput
): Promise<ServerActionResult<{ revisaoId: string }>> {
  const parsed = SolicitarRevisaoSchema.safeParse(input)
  if (!parsed.success) {
    return { ok: false, erro: 'Dados inválidos', detalhes: parsed.error.flatten() }
  }

  const supabase = await getSupabaseServerClient()

  // Busca task origem para obter pasta_projeto_id e validar não-mesmo-time
  const { data: taskOrigem, error: errOrigem } = await supabase
    .from('tasks')
    .select('id, pasta_projeto_id, time_responsavel_id')
    .eq('id', parsed.data.taskOrigemId)
    .single()

  if (errOrigem || !taskOrigem) return { ok: false, erro: 'Task origem não encontrada' }

  if (taskOrigem.time_responsavel_id === parsed.data.timeAlvoId) {
    return { ok: false, erro: 'Não pode solicitar revisão ao próprio Time' }
  }

  const { data, error } = await supabase
    .from('tasks')
    .insert({
      pasta_projeto_id: taskOrigem.pasta_projeto_id,
      time_responsavel_id: parsed.data.timeAlvoId,
      tipo: 'revisao',
      task_origem_id: parsed.data.taskOrigemId,
      titulo: `REVISÃO: ${parsed.data.motivo.slice(0, 80)}`,
      motivo_revisao: parsed.data.motivo,
      prioridade: parsed.data.prioridade,
      visibilidade: 'pasta',
      status: 'pendente',
    })
    .select('id')
    .single()

  if (error) return { ok: false, erro: 'Erro ao criar revisão' }

  revalidatePath(`/projetos/${taskOrigem.pasta_projeto_id}/pasta`)
  return { ok: true, data: { revisaoId: data.id } }
}
```

```tsx
// components/tasks/solicitar-revisao-modal.tsx
"use client"

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { SolicitarRevisaoSchema, type SolicitarRevisaoInput } from '@/lib/validations/revisao'
import { solicitarRevisao } from '@/server/actions/solicitar-revisao'

type Time = { id: string; nome: string }

type Props = {
  taskOrigemId: string
  timesDisponiveis: Time[]    // filtrado pra excluir o próprio time
  open: boolean
  onClose: () => void
}

export function SolicitarRevisaoModal({ taskOrigemId, timesDisponiveis, open, onClose }: Props) {
  const [enviando, setEnviando] = useState(false)
  const form = useForm<SolicitarRevisaoInput>({
    resolver: zodResolver(SolicitarRevisaoSchema),
    defaultValues: { taskOrigemId, prioridade: 'P0' },
  })

  async function onSubmit(data: SolicitarRevisaoInput) {
    setEnviando(true)
    const resultado = await solicitarRevisao(data)
    setEnviando(false)
    if (resultado.ok) {
      onClose()
    } else {
      form.setError('root', { message: resultado.erro })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Solicitar Revisão</DialogTitle>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* Time alvo */}
          <div>
            <label className="text-sm font-medium">Time responsável pela revisão</label>
            <Select onValueChange={v => form.setValue('timeAlvoId', v)}>
              <SelectTrigger><SelectValue placeholder="Escolher Time..." /></SelectTrigger>
              <SelectContent>
                {timesDisponiveis.map(t => (
                  <SelectItem key={t.id} value={t.id}>{t.nome}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Motivo */}
          <div>
            <label className="text-sm font-medium">Motivo (mínimo 20 caracteres)</label>
            <Textarea
              {...form.register('motivo')}
              rows={4}
              placeholder="Descreva o que precisa ser revisto..."
            />
            {form.formState.errors.motivo && (
              <p className="text-sm text-destructive">{form.formState.errors.motivo.message}</p>
            )}
          </div>

          {/* Prioridade */}
          <div>
            <label className="text-sm font-medium">Prioridade</label>
            <Select defaultValue="P0" onValueChange={v => form.setValue('prioridade', v as 'P0')}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="P0">P0 — Urgente</SelectItem>
                <SelectItem value="P1">P1 — Alta</SelectItem>
                <SelectItem value="P2">P2 — Média</SelectItem>
                <SelectItem value="P3">P3 — Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {form.formState.errors.root && (
            <p className="text-sm text-destructive">{form.formState.errors.root.message}</p>
          )}

          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={onClose}>Cancelar</Button>
            <Button type="submit" disabled={enviando}>
              {enviando ? 'Enviando...' : 'Solicitar Revisão'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
```

---

## CONCLUSÃO

Este Prompt Mestre é **ativo crítico** da Lioma IT. É o que garante que toda IA assistida produza código consistente, alinhado e production-ready para o Arali Flow (e, no futuro, para outros clientes do core replicado).

Versionar como código. Revisar a cada 2 sprints. Tratar como infraestrutura.

---

## 📚 Anexos & Referências

- [README.md](../../README.md)
- [docs/DOMAIN_MODEL.md](../DOMAIN_MODEL.md)
- [docs/PERMISSIONS.md](../PERMISSIONS.md)
- [docs/STYLE_GUIDE.md](../STYLE_GUIDE.md)
- [docs/BRANDING.md](../BRANDING.md)
- [docs/DECISIONS/ADR-001-stack-frontend.md](../DECISIONS/ADR-001-stack-frontend.md)
- [docs/ai/CLAUDE.md](./CLAUDE.md)
