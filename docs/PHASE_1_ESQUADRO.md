# 📍 Fase 1 — ESQUADRO

> *"O esquadro é o que garante o ângulo certo. Sem ele, qualquer corte parece bom até a hora de juntar duas peças. Esquadro alinha o Comercial — porta de entrada de tudo."*

**Status**: 🟢 Ativa — Semana 1 em curso (iniciada 2026-05-02).
**Etapa anterior**: [`PHASE_0_RISCA.md`](./PHASE_0_RISCA.md) ✅
**Próxima etapa**: [`PHASE_2_ENCAIXE.md`](./PHASE_2_ENCAIXE.md)

---

## 🎯 Objetivo da Etapa

Construir o **Ambiente Comercial completo**, com Pasta do Projeto operacional e a **Ferramenta Recebimentos por Projeto** — que **substitui imediatamente** a planilha "01A Recebimento Entrada" que a Arali usa hoje.

Esta é a etapa que entrega o **killer demo**: no dia em que o Time Comercial fechar uma rotina de manhã sem abrir o Excel, o sistema venceu o argumento.

**Critério de Pronto**: Suelen, Bianca, Franciele e Lisandra registram propostas e recebimentos diretamente no Arali Flow, e a Diretoria abre o sistema para conferir o caixa do dia em vez de pedir a planilha por WhatsApp.

---

## 📅 Duração

**4 semanas** — Mês 2 do cronograma de 4 meses.

---

## ✅ Pré-Requisitos Já Atendidos (entregues no fim da Risca / dia 0 da Esquadro)

- [x] Migration `0002_comercial.sql` aplicada com **8 tabelas + 6 enums + RLS completo**:
  - Tabelas: `clientes`, `parceiros`, `propostas`, `propostas_revisoes`, `projetos`, `projetos_times`, `recebimentos`, `notas_fiscais`
  - Enums: `status_proposta`, `status_comercial`, `tipo_proposta`, `tipo_parceiro`, `status_projeto`, `saude_projeto`
- [x] `types/database.ts` regenerado refletindo o schema real (1138 linhas, com `Database["public"]["Enums"]`)
- [x] Packages no `package.json`:
  - `react-hook-form` ^7.75 + `@hookform/resolvers` ^5.2
  - `date-fns` ^4.1
  - `zod` ^4.3, `@supabase/ssr` ^0.10, `lucide-react`, `tailwind-merge`, `clsx`
- [x] Componentes UI base operacionais: `button`, `card`, `checkbox`, `input`, `label`
- [x] Estrutura `server/{actions,queries,services}` na raiz já criada (Phase 0 colocou Auth lá)

> **Decisão arquitetural reafirmada**: Server Actions e Queries vivem em `server/<dominio>/` na raiz do repo (não dentro de `app/`). Isso permite reutilização entre Server Components e Route Handlers sem amarrar ao roteamento do Next.

---

## 🧱 Escopo Detalhado por Semana

### Semana 1 — Fundação Comercial: Clientes & Parceiros

**Objetivo**: estabelecer o **padrão arquitetural de CRUD** que será replicado em Propostas, Recebimentos e Pasta. Ao fim da Semana 1, qualquer dev consegue ler um módulo e replicar a estrutura para o próximo.

#### Decisões a fixar nesta semana
- Padrão `ActionResult<T>` em `lib/types/action-result.ts` — discriminated union `{ ok: true; data: T } | { ok: false; erro: string; fieldErrors?: Record<string, string[]> }`.
- Convenção de pastas em `server/`:
  ```
  server/
    actions/
      clientes/{criar,editar,arquivar}.ts
      parceiros/{criar,editar,arquivar}.ts
    queries/
      clientes/{listar,obter}.ts
      parceiros/{listar,obter}.ts
    services/   (lógica de domínio reutilizável)
  ```
- Schemas Zod em `lib/validations/<dominio>.ts`, importando enums de `types/database.ts` (`Database["public"]["Enums"]["tipo_parceiro"]`) — fonte única de verdade.
- Drawer/Sheet de criação-edição como componente reutilizável em `components/shared/drawer.tsx` (a base já existe; refinar).

#### Entregáveis Semana 1
- [ ] `lib/types/action-result.ts` — tipo unificado para retornos de Server Actions
- [ ] `lib/validations/clientes.ts` (Zod) com `ClienteCreateSchema` e `ClienteUpdateSchema`
- [ ] `lib/validations/parceiros.ts` (Zod) usando enum `tipo_parceiro` do banco
- [ ] `server/actions/clientes/{criar,editar,arquivar}.ts` com validação dupla e revalidatePath
- [ ] `server/actions/parceiros/{criar,editar,arquivar}.ts`
- [ ] `server/queries/clientes/{listar,obter}.ts` com filtros (busca, ativo, tipo PF/PJ)
- [ ] `server/queries/parceiros/{listar,obter}.ts` com filtro por `tipo_parceiro`
- [ ] Página `/ambientes/comercial/clientes` — tabela responsiva, busca, paginação básica
- [ ] Página `/ambientes/comercial/parceiros` — tabs por tipo (Arquitetura | Construtora | Gerenciadora)
- [ ] `components/shared/drawer.tsx` consumido nos dois CRUDs
- [ ] Pendência de Phase 0 zerada: remover `app/server/actions/auth/entrar-com-senha.ts` vazio e padronizar imports
- [ ] Branch `feature/esquadro-clientes-parceiros` aberta com PRs pequenos (<400 linhas)

#### Critério de Pronto Semana 1
- [ ] Marcus consegue criar um cliente PJ pelo Drawer e vê-lo na lista em <2s
- [ ] Tentativa de criar parceiro com `tipo` inválido bloqueia no client (Zod) e no server (Zod + RLS)
- [ ] `npm run typecheck` e `npm run lint` verdes
- [ ] RLS testado: integrante de outro Time não enxerga lista no SQL puro
- [ ] Padrão `ActionResult<T>` documentado em `docs/CONTRIBUTING.md`

---

### Semana 2 — Propostas + Killer Demo Recebimentos (parte 1)

#### CRUD de Propostas
- [ ] Página `/ambientes/comercial/propostas` substituindo "Controle de Entrada de Orçamento"
- [ ] Tabela com filtros: Status, Status Comercial, Elaborado, Cliente, Período
- [ ] Coluna calculada: dias desde envio + alerta visual >7 dias sem confirmação
- [ ] Drawer com todos os campos da planilha real (incluindo `observacoes` livre)
- [ ] Versão mobile da tabela em formato de cards
- [ ] Export CSV nativo (emergência durante transição)
- [ ] Auto-complete de Cliente já existente

#### Recebimentos — Killer Demo (início)
- [ ] Página `/ambientes/comercial/ferramentas/recebimentos` substituindo "01A Recebimento Entrada"
- [ ] Tabela com colunas: Data, Cliente, NF/Recibo, Proposta (OS), Medição, Entrada, Arq, Const, Gerenciadora
- [ ] Filtros: Período, Cliente, Construtora, Gerenciadora
- [ ] Drawer com auto-complete de Cliente e Proposta

#### Checkpoint 03 com Arali (fim da Semana 2)
Demo Recebimentos com dados reais. Validar cores, layout, microcopy, totalizadores.

---

### Semana 3 — Recebimentos (parte 2) + Pasta do Projeto

#### Recebimentos — fechamento
- [ ] Totalizadores em tempo real (Medição e Entrada do mês corrente, com `useMemo` + agregação SQL)
- [ ] **Validação**: NFE e NFS de mesmo OS detectadas como pareadas (não duplicadas)
- [ ] Script de ETL importando o CSV histórico da Arali em uma única operação (com log de duplicatas e linhas inválidas)
- [ ] Export CSV mantendo o layout da planilha original

#### Pasta do Projeto — Versão Comercial
- [ ] Página `/projetos/[id]/pasta`
- [ ] Header com cliente, OS, status proposta, status comercial, times ativos
- [ ] Tabs: Timeline (placeholder), Tasks, Ferramentas, Documentos (placeholder), Histórico
- [ ] Sub-rota `/projetos/[id]/pasta/ferramentas/recebimentos` filtrada por projeto
- [ ] Promote de Proposta → Projeto via Server Action (valida fechamento)

---

### Semana 4 — Tasks + Distribuição + Feed manual

#### Tasks Básicas
- [ ] Migration `0003_tasks.sql` com tabela `tasks` (owner, status, prioridade, prazo, projeto_id, time_id, tipo)
- [ ] Sub-rota `/projetos/[id]/pasta/tasks` com Kanban simples (4 colunas)
- [ ] Drawer de criação/edição
- [ ] Atribuição respeitando regra de Líder/Gestor
- [ ] Sem realtime ainda — refetch on focus

#### Distribuição de Projetos
- [ ] Server Action `distribuirProjeto` com validação de papel
- [ ] UI: botão "Distribuir" na lista de Projetos conforme papel
- [ ] Notificação in-app gerada (placeholder — entrega real em Encaixe)

#### Feed do Time + Geral — Versão Manual
- [ ] Migration `0004_feed.sql`: `posts`, `curtidas`, `checks`, `mencoes`
- [ ] Página `/feed` com toggle Time / Geral
- [ ] Composer simples (texto + emoji)
- [ ] Refetch on focus (sem realtime)
- [ ] Forward simplificado para "compartilhar como cópia"

#### Checkpoint 04 com Arali (fim da Semana 4)
Onboarding do Time Comercial completo + Diretoria valida o Painel de Caixa do Mês.

---

## 🔑 Entregáveis Tangíveis ao Fim do Esquadro

1. Time Comercial inteiro logado e usando o sistema diariamente
2. Planilha "01A Recebimento Entrada" oficialmente arquivada (read-only)
3. Planilha "Controle de Entrada de Orçamento" substituída pelo módulo Propostas
4. Pasta do Projeto navegável com Tasks
5. 26 Projetos ativos da Arali registrados no sistema (importados via ETL)
6. Diretoria abre o sistema e vê total de Medição e Entrada do mês ao vivo

---

## 🎯 Checkpoints com Arali (Mês 2)

| # | Quando | Pauta |
|---|---|---|
| 03 | Fim da Semana 2 | Demo Recebimentos com dados reais. Validar cores, layout, microcopy, totalizadores. |
| 04 | Fim da Semana 4 | Onboarding do Time Comercial completo + Diretoria valida o Painel de Caixa do Mês |

---

## ⚠️ Riscos da Etapa

| Risco | Mitigação |
|---|---|
| Time Comercial resiste a abandonar Excel | Co-criar UI com Suelen/Bianca em sessão de validação na Semana 2; treinamento ao vivo |
| Dados históricos inconsistentes (encoding Windows-1252, duplicatas, nulls como R$ 0,00) | Script ETL com relatório de saneamento + revisão manual com Cuca antes do import oficial |
| Modelo de OS com sufixos R/E/CD complexo demais | Manter `numero_os_raw` como string crua + parser secundário em view; `propostas_revisoes` com `sufixo_raw` |
| Pasta do Projeto fica sem Documentos no MVP | Documentos entram em Encaixe; deixar tab placeholder com mensagem clara |
| Sobrecarga arquitetural cedo demais | Semana 1 estabelece o padrão; Semana 2-4 só replica — não inventar abstração nova até Encaixe |

---

## 📌 Definição de Pronto da Etapa

- [ ] Tag `v0.2.0-esquadro` no `main`
- [ ] 26 Projetos ativos importados e validados
- [ ] Time Comercial faz 5 dias úteis seguidos sem abrir Excel
- [ ] Cuca (Gestor Comercial) valida totalizadores ao vivo na frente do Marcus
- [ ] Pasta do Projeto navegável em mobile
- [ ] Checkpoints 03 e 04 concluídos
- [ ] Tasks distribuídas para 8+ Integrantes diferentes

---

**Versão**: 1.1
**Última atualização**: 2026-05-02
