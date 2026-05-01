# 🧬 Modelo de Domínio — Arali Flow

> Documento técnico-conceitual definindo as **entidades**, **relacionamentos**, **regras de negócio** e **eventos** que regem o Arali Flow. É a fonte de verdade para schema do banco, validação Zod, geração de tipos TypeScript e prompts de IA assistida.

---

## Sumário

1. [Princípios de Modelagem](#1-princípios-de-modelagem)
2. [Glossário Resumido](#2-glossário-resumido)
3. [Diagrama Entidade-Relacionamento](#3-diagrama-entidade-relacionamento)
4. [Entidades Principais](#4-entidades-principais)
5. [Pasta do Projeto — Modelo Completo](#5-pasta-do-projeto--modelo-completo)
6. [Tasks — Modelo Completo e Máquina de Estados](#6-tasks--modelo-completo-e-máquina-de-estados)
7. [Sistema de Revisão (Voltar Etapas sem Voltar)](#7-sistema-de-revisão-voltar-etapas-sem-voltar)
8. [Feed e Posts — Forward N:N](#8-feed-e-posts--forward-nn)
9. [Ferramentas de Time](#9-ferramentas-de-time)
10. [Eventos e Audit Log](#10-eventos-e-audit-log)
11. [Invariantes de Negócio](#11-invariantes-de-negócio)
12. [Casos Edge Modelados](#12-casos-edge-modelados)

---

## 1. Princípios de Modelagem

1. **Domínio em PT-BR**: tabelas, colunas e tipos do domínio em português (`projetos`, `pasta_projeto`, `tasks`, `integrantes_times`). Reduz fricção cognitiva para devs e IA assistida.
2. **Tipos discriminados**: usar `tipo` ou `kind` enum em vez de tabelas separadas para variantes (ex: `tasks.tipo = 'normal' | 'revisao' | 'auto_ferramenta'`).
3. **Soft delete por padrão**: `deletado_em` timestamptz em vez de DELETE, exceto onde regulação exige purge real.
4. **Auditoria incorporada**: `criado_em`, `atualizado_em`, `criado_por_id`, `atualizado_por_id` em quase tudo.
5. **RLS é a fonte de verdade de autorização**: nunca reimplementar permissão no client.
6. **Eventos imutáveis**: timeline e audit log são append-only.
7. **IDs são UUID v4**: nunca expor IDs sequenciais; chaves naturais (OS, número de proposta) ficam em colunas próprias.
8. **Datas são timestamptz**: nunca `timestamp` sem timezone. Datas humanas (prazo, data_evento) são `date` quando hora não importa.

---

## 2. Glossário Resumido

| Termo | Significado |
|---|---|
| **Projeto** | Obra contratada pela Arali (ex: "Apartamento Vila Nova Conceição") |
| **Pasta do Projeto** | Container digital com timeline, tasks, ferramentas e documentos do Projeto |
| **Time** | Grupo de Integrantes de um Ambiente (ex: Time Comercial) |
| **Ambiente** | Área operacional (Diretoria, Comercial, PCP, Engenharia, ...) |
| **Integrante** | Pessoa associada a um ou mais Times |
| **Líder** | Integrante com permissão para distribuir Tasks dentro do Time |
| **Gestor** | Pessoa que coordena 1+ Times (definido pela Diretoria) |
| **Diretoria** | Acesso total a todos os Times e Pastas |
| **Task** | Unidade de trabalho dentro de uma Pasta do Projeto |
| **Revisão** | Task tipo `revisao` que aponta erro vindo de outro Time |
| **Ferramenta** | Módulo especializado de um Ambiente (ex: Recebimentos, Propostas) |
| **Feed** | Timeline social de posts de um escopo (Time ou Geral) |
| **Forward** | Compartilhamento N:N de Post entre Feeds (não duplica) |

Glossário completo em [`docs/ai/GLOSSARY.md`](./ai/GLOSSARY.md).

---

## 3. Diagrama Entidade-Relacionamento

```
┌──────────┐
│ Usuário  │ (auth.users do Supabase)
└────┬─────┘
     │ 1:1
┌────▼──────┐
│Integrante │
└────┬──────┘
     │ N:M (via integrantes_times)
┌────▼──────┐         ┌──────────┐
│   Time    ├─────────┤ Ambiente │
└────┬──────┘   N:1   └──────────┘
     │ 1:N
     ├──── Ferramentas (instaladas no Time)
     ├──── Feed (1:1)
     └──── PostsAtribuidos
                                       
┌──────────┐                           
│ Projeto  │ (chave natural: OS + ano) 
└────┬─────┘                           
     │ 1:1                              
┌────▼──────────┐                       
│ PastaProjeto  │                       
└────┬──────────┘                       
     ├── (N) TimesEnvolvidos (via projetos_times) 
     ├── (N) Tasks                      
     ├── (N) Documentos                 
     ├── (N) FerramentasInstancias      
     ├── (1) Timeline (eventos)        
     └── (N) Posts (escopo Pasta)      

┌──────┐         ┌────────┐         ┌──────────┐
│ Feed │─── N:M ─┤  Post  ├── 1:N ──┤  Reações │
└──────┘         └────┬───┘         └──────────┘
                      ├── 1:N — Comentários
                      ├── 1:N — Mencoes (→ Integrante)
                      └── 1:N — Anexos
```

---

## 4. Entidades Principais

### 4.1 Usuario / Integrante

```sql
-- Usuario vem de auth.users (Supabase). Não duplicamos.
-- Integrante é o "perfil corporativo" do Usuario no sistema.

CREATE TABLE integrantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  nome_completo text NOT NULL,
  apelido text,
  email text NOT NULL,
  telefone text,
  avatar_url text,
  cargo text,                              -- ex: "Coordenador Comercial"
  
  role_global text NOT NULL DEFAULT 'integrante'
    CHECK (role_global IN ('super_admin', 'admin', 'diretoria', 'gestor', 'lider_time', 'integrante', 'viewer')),
  
  ativo boolean NOT NULL DEFAULT true,
  ultimo_acesso_em timestamptz,
  
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  deletado_em timestamptz
);
```

### 4.2 Ambiente / Time / Pertencimento

```sql
CREATE TABLE ambientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,                -- ex: 'comercial', 'pcp', 'engenharia'
  nome text NOT NULL,
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  ordem int NOT NULL DEFAULT 0,             -- ordem na sidebar Diretoria
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ambiente_id uuid NOT NULL REFERENCES ambientes(id),
  slug text UNIQUE NOT NULL,
  nome text NOT NULL,
  descricao text,
  cor_brand text,                           -- override do branding por time se necessário
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE integrantes_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integrante_id uuid NOT NULL REFERENCES integrantes(id) ON DELETE CASCADE,
  time_id uuid NOT NULL REFERENCES times(id) ON DELETE CASCADE,
  papel text NOT NULL CHECK (papel IN ('gestor', 'lider', 'integrante')),
  desde timestamptz NOT NULL DEFAULT now(),
  ate timestamptz,                          -- NULL = atual
  criado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (integrante_id, time_id, papel) WHERE (ate IS NULL)
);
```

**Invariantes:**
- Time não pode ter mais de **2 Gestores ativos** (regra de negócio Arali; configurável por cliente)
- Time não pode ter mais de **2 Líderes ativos**
- Time não pode ter mais de **10 Integrantes ativos** (excluindo Líderes/Gestores)
- Um Integrante pode ser Gestor de múltiplos Times, mas Líder de apenas 1
- Mesmo Integrante pode ser Líder no Time A e Integrante no Time B simultaneamente

### 4.3 Projeto

```sql
CREATE TABLE projetos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  -- Identidade do projeto
  numero_os text NOT NULL,                  -- ex: "2026-0042"
  ano int NOT NULL,
  nome text NOT NULL,
  cliente_nome text NOT NULL,
  arquiteto_responsavel text,               -- ex: "Studio Arthur Casas"
  endereco text,
  
  -- Status macro
  status text NOT NULL DEFAULT 'ativo'
    CHECK (status IN ('rascunho', 'ativo', 'em_revisao', 'concluido', 'arquivado', 'cancelado')),
  saude text NOT NULL DEFAULT 'verde'
    CHECK (saude IN ('verde', 'amarelo', 'vermelho')),
  
  -- Datas chave
  data_inicio date,
  prazo_cliente date,
  data_conclusao date,
  
  -- Valor
  valor_orcado numeric(12, 2),
  valor_contrato numeric(12, 2),
  
  -- Auditoria
  criado_por_id uuid NOT NULL REFERENCES integrantes(id),
  atualizado_por_id uuid REFERENCES integrantes(id),
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  arquivado_em timestamptz,
  
  UNIQUE (numero_os, ano)
);
```

---

## 5. Pasta do Projeto — Modelo Completo

A **Pasta do Projeto** é entidade separada do **Projeto** porque tem ciclo de vida e responsabilidades distintas (Projeto = "o que foi vendido"; Pasta = "como vai ser executado").

```sql
CREATE TABLE pastas_projeto (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id uuid NOT NULL UNIQUE REFERENCES projetos(id) ON DELETE CASCADE,
  
  status text NOT NULL DEFAULT 'draft'
    CHECK (status IN ('draft', 'ativa', 'em_revisao', 'concluida', 'arquivada')),
  
  abertura_em timestamptz NOT NULL DEFAULT now(),
  conclusao_em timestamptz,
  arquivamento_em timestamptz,
  
  ultima_atividade_em timestamptz NOT NULL DEFAULT now(),
  
  criado_por_id uuid NOT NULL REFERENCES integrantes(id),
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now()
);

-- Times participantes da pasta (paralelismo)
CREATE TABLE pastas_projeto_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pasta_projeto_id uuid NOT NULL REFERENCES pastas_projeto(id) ON DELETE CASCADE,
  time_id uuid NOT NULL REFERENCES times(id),
  
  status text NOT NULL DEFAULT 'ativo'
    CHECK (status IN ('ativo', 'pausado', 'concluido')),
  
  adicionado_por_id uuid NOT NULL REFERENCES integrantes(id),
  adicionado_em timestamptz NOT NULL DEFAULT now(),
  concluido_em timestamptz,
  
  UNIQUE (pasta_projeto_id, time_id)
);

-- Eventos cronológicos da pasta (timeline)
CREATE TABLE pastas_projeto_eventos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pasta_projeto_id uuid NOT NULL REFERENCES pastas_projeto(id) ON DELETE CASCADE,
  
  tipo text NOT NULL,                       -- ex: 'task_concluida', 'revisao_solicitada', 'time_adicionado', 'documento_anexado'
  payload jsonb NOT NULL,                   -- dados específicos do evento
  
  ator_id uuid REFERENCES integrantes(id),  -- quem disparou
  time_id uuid REFERENCES times(id),        -- contexto
  
  ocorrido_em timestamptz NOT NULL DEFAULT now()
);
```

**Estados da Pasta** (ver ADR-003):

```
                       ┌─── ativa ──────────┐
                       │                     │
draft ─── ativa ───────┤                     ├──── concluida ──── arquivada
                       │                     │
                       └─── em_revisao ──────┘
                            (loop possível)
```

**Cálculo de saúde** (`projetos.saude`, derivado e/ou recalculado por trigger):
- 🟢 **Verde**: 0 revisões pendentes E nenhuma task atrasada > 24h
- 🟡 **Amarelo**: 1-2 revisões pendentes OU 1-3 tasks atrasadas
- 🔴 **Vermelho**: 3+ revisões OU revisão P0 sem atendimento > 48h OU prazo cliente em risco

---

## 6. Tasks — Modelo Completo e Máquina de Estados

```sql
CREATE TABLE tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  pasta_projeto_id uuid NOT NULL REFERENCES pastas_projeto(id) ON DELETE CASCADE,
  time_responsavel_id uuid NOT NULL REFERENCES times(id),
  owner_id uuid REFERENCES integrantes(id),     -- NULL = backlog do time
  criada_por_id uuid NOT NULL REFERENCES integrantes(id),
  
  titulo text NOT NULL,
  descricao text,
  
  tipo text NOT NULL DEFAULT 'normal'
    CHECK (tipo IN ('normal', 'revisao', 'bloqueio_externo', 'auto_ferramenta')),
  
  status text NOT NULL DEFAULT 'pendente'
    CHECK (status IN ('pendente', 'em_andamento', 'em_revisao', 'concluida', 'cancelada', 'bloqueada')),
  
  prioridade text NOT NULL DEFAULT 'P2'
    CHECK (prioridade IN ('P0', 'P1', 'P2', 'P3')),
  
  prazo timestamptz,
  iniciada_em timestamptz,
  concluida_em timestamptz,
  
  -- Para tasks tipo 'revisao'
  task_origem_id uuid REFERENCES tasks(id),
  motivo_revisao text,
  
  -- Para tasks tipo 'auto_ferramenta'
  ferramenta_origem text,                       -- ex: 'recebimentos', 'propostas'
  ferramenta_ref_id uuid,                       -- ID da entrada na ferramenta
  
  -- Visibilidade
  visibilidade text NOT NULL DEFAULT 'time'
    CHECK (visibilidade IN ('time', 'pasta')),
  
  -- Bloqueios (raros)
  bloqueada_por_task_id uuid REFERENCES tasks(id),
  motivo_bloqueio text,
  
  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  deletado_em timestamptz
);

CREATE INDEX idx_tasks_pasta ON tasks (pasta_projeto_id, status) WHERE deletado_em IS NULL;
CREATE INDEX idx_tasks_owner ON tasks (owner_id, status) WHERE deletado_em IS NULL;
CREATE INDEX idx_tasks_time ON tasks (time_responsavel_id, status) WHERE deletado_em IS NULL;
CREATE INDEX idx_tasks_prazo ON tasks (prazo) WHERE status NOT IN ('concluida', 'cancelada');
```

### Máquina de Estados de Task

```
┌────────┐                    ┌─────────────┐
│pendente├───── start ───────▶│em_andamento │
└───┬────┘                    └─────┬───────┘
    │                               │
    │                               │ request_review
    │                               ▼
    │                         ┌─────────────┐
    │                         │ em_revisao  │
    │                         └─────┬───────┘
    │                               │
    │                               │ approve
    │ block                         ▼
    ▼                         ┌──────────┐
┌──────────┐                  │concluida │
│bloqueada │                  └──────────┘
└──────────┘
    
qualquer estado ───── cancel ─────▶ cancelada
```

**Regras de transição:**
- `start` → quem pode: o owner ou Líder do time
- `request_review` → quem pode: o owner; revisor padrão é o Líder do time
- `approve` → quem pode: Líder, Gestor ou Diretoria
- `block` → qualquer um do time, com `motivo_bloqueio` obrigatório
- `cancel` → apenas Líder, Gestor ou Diretoria

**Triggers:**
- Mudança de status → grava evento em `pastas_projeto_eventos`
- Mudança de status para `concluida` em P0/P1 → cria Post automático (se feature flag ativa)
- Atribuição de owner → notificação realtime para o integrante
- Mudança para `bloqueada` → notificação para Líder

---

## 7. Sistema de Revisão (Voltar Etapas sem Voltar)

Detalhado em [ADR-003](./DECISIONS/ADR-003-paralelismo-pasta-projeto.md). Resumo do modelo:

### Quando criar uma Revisão

Qualquer Integrante, ao trabalhar em uma Task, pode acionar **"Solicitar Revisão"** se identificar erro em entregável de outro Time.

### O que acontece tecnicamente

```
INSERT INTO tasks (
  pasta_projeto_id,            -- mesma pasta
  time_responsavel_id,         -- Time que originou o erro (não o detector)
  owner_id,                    -- NULL inicialmente (vai pro backlog do time alvo)
  criada_por_id,               -- detector
  titulo,                      -- "REVISÃO: <descrição>"
  tipo,                        -- 'revisao'
  task_origem_id,              -- a task em que o detector estava
  motivo_revisao,              -- texto obrigatório
  prioridade,                  -- default P0 (revisões são urgentes)
  visibilidade                 -- 'pasta' (todos os times participantes veem)
);
```

E:
- Trigger insere evento em `pastas_projeto_eventos` com `tipo='revisao_solicitada'`
- Trigger atualiza `pastas_projeto.status = 'em_revisao'` se ainda não estiver
- Notificação realtime para Líder do time alvo + atribuído
- Pasta exibe alerta visual ⚠️

### Resolução da Revisão

Quando a Task de revisão é `concluida`:
- Trigger verifica se há outras tasks `tipo='revisao'` pendentes na pasta
- Se não houver, atualiza `pastas_projeto.status` voltando para `ativa`
- Evento `tipo='revisao_resolvida'` registrado

### Métricas que emergem

- **Revisões geradas por Time** (qualidade de detecção)
- **Revisões recebidas por Time** (qualidade do output)
- **Tempo médio de resolução** de revisão por prioridade

---

## 8. Feed e Posts — Forward N:N

```sql
CREATE TABLE feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tipo text NOT NULL CHECK (tipo IN ('time', 'geral', 'pasta_projeto')),
  time_id uuid REFERENCES times(id),                       -- só se tipo='time'
  pasta_projeto_id uuid REFERENCES pastas_projeto(id),     -- só se tipo='pasta_projeto'
  criado_em timestamptz NOT NULL DEFAULT now(),
  
  CHECK (
    (tipo = 'time' AND time_id IS NOT NULL AND pasta_projeto_id IS NULL) OR
    (tipo = 'geral' AND time_id IS NULL AND pasta_projeto_id IS NULL) OR
    (tipo = 'pasta_projeto' AND pasta_projeto_id IS NOT NULL AND time_id IS NULL)
  )
);

CREATE TABLE posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  autor_id uuid NOT NULL REFERENCES integrantes(id),
  time_origem_id uuid REFERENCES times(id),                -- de qual time veio
  
  conteudo text NOT NULL,                                  -- texto + emojis
  tags text[] NOT NULL DEFAULT '{}',
  
  pasta_projeto_id uuid REFERENCES pastas_projeto(id),     -- se vinculado a projeto
  task_id uuid REFERENCES tasks(id),                       -- se gerado por task
  
  origem text NOT NULL DEFAULT 'manual'
    CHECK (origem IN ('manual', 'auto_task', 'auto_ferramenta')),
  
  criado_em timestamptz NOT NULL DEFAULT now(),
  editado_em timestamptz,
  deletado_em timestamptz
);

-- Forward N:N: 1 post pode estar em múltiplos feeds (não duplicação)
CREATE TABLE post_feeds (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  feed_id uuid NOT NULL REFERENCES feeds(id) ON DELETE CASCADE,
  encaminhado_por_id uuid REFERENCES integrantes(id),      -- NULL se origem natural
  encaminhado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, feed_id)
);

-- Reações
CREATE TABLE post_reacoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  integrante_id uuid NOT NULL REFERENCES integrantes(id),
  tipo text NOT NULL CHECK (tipo IN ('curtida', 'check')),
  criado_em timestamptz NOT NULL DEFAULT now(),
  UNIQUE (post_id, integrante_id, tipo)
);

-- Menções
CREATE TABLE post_mencoes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid NOT NULL REFERENCES posts(id) ON DELETE CASCADE,
  integrante_id uuid NOT NULL REFERENCES integrantes(id),
  posicao_inicio int,                                      -- offset no texto
  posicao_fim int
);
```

### Forward — Por que N:N?

> Quando Mariana (Comercial) compartilha um Post para o Feed da PCP, **NÃO criamos um novo post**. Apenas adicionamos uma linha em `post_feeds` ligando o post original ao feed da PCP.

Vantagens:
- Edições do post original aparecem em todos os feeds onde foi encaminhado
- Reações somam de todos os feeds
- Histórico de "quem encaminhou para onde" fica explícito
- Sem inflar tabela `posts` com duplicatas

---

## 9. Ferramentas de Time

Cada Time tem **Ferramentas** (módulos) habilitados. Cada Ferramenta tem schema próprio armazenado em tabelas dedicadas.

```sql
CREATE TABLE ferramentas (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,                               -- ex: 'recebimentos', 'propostas'
  nome text NOT NULL,
  ambiente_id uuid NOT NULL REFERENCES ambientes(id),     -- ferramenta pertence ao Ambiente
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  ordem int NOT NULL DEFAULT 0
);

-- Habilitação de ferramenta por Time
CREATE TABLE ferramentas_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ferramenta_id uuid NOT NULL REFERENCES ferramentas(id),
  time_id uuid NOT NULL REFERENCES times(id),
  habilitada boolean NOT NULL DEFAULT true,
  configuracoes jsonb NOT NULL DEFAULT '{}',
  UNIQUE (ferramenta_id, time_id)
);
```

**Ferramentas do MVP:**

| Slug | Ambiente | Função | Substitui |
|---|---|---|---|
| `recebimentos` | Comercial | Caixa por Projeto | Planilha "01A Recebimento Entrada" |
| `propostas` | Comercial | Pipeline comercial | Planilha "Controle de Entrada de Orçamento" |
| `contratos` | Comercial | Repositório de contratos | Pasta drive |
| `programacao` | PCP | Plano semanal de produção | Planilha PCP |
| `apontamentos` | PCP | Registro de horas/etapas | WhatsApp |
| `dashboard_diretoria` | Diretoria | KPIs agregados | Reuniões |

Cada Ferramenta tem suas próprias tabelas (`recebimentos`, `propostas`, ...) com RLS própria, mas todas se ligam à `pasta_projeto_id` para aparecer dentro da Pasta correspondente.

---

## 10. Eventos e Audit Log

```sql
CREATE TABLE audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  
  ator_id uuid REFERENCES integrantes(id),
  ator_role text,                                          -- snapshot do role no momento
  
  acao text NOT NULL,                                      -- ex: 'criar_task', 'distribuir_projeto', 'remover_post'
  recurso_tipo text NOT NULL,                              -- ex: 'task', 'projeto', 'post'
  recurso_id uuid,
  
  payload_antes jsonb,
  payload_depois jsonb,
  metadata jsonb,                                          -- ip, user_agent, etc
  
  ocorrido_em timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_audit_recurso ON audit_logs (recurso_tipo, recurso_id, ocorrido_em DESC);
CREATE INDEX idx_audit_ator ON audit_logs (ator_id, ocorrido_em DESC);
```

**Retenção mínima**: 24 meses (LGPD + auditoria). Após esse prazo, logs anteriores são particionados em arquivo cold storage.

**Eventos auditados (mínimo):**
- Login / logout / falhas de login
- Mudança de role / permissão
- CRUD de Projeto, Task, Post (não inclui reações/curtidas)
- Distribuição de Projeto a Time
- Mudança de status de Pasta
- Solicitação e resolução de Revisão
- Exportação de dados
- Tentativas de acesso negadas (RLS bloqueando)

---

## 11. Invariantes de Negócio

Estas invariantes devem ser garantidas em **três camadas** (validação Zod no client → Server Action → Constraint no DB / RLS):

1. **Tarefa só pode ser concluída se todas as tarefas tipo `bloqueio_externo` que a bloqueiam estiverem resolvidas**
2. **Pasta do Projeto só passa para `concluida` quando todos os Times participantes estão em status `concluido`**
3. **Líder não pode atribuir Task a Integrante de outro Time** (a menos que seja Gestor cross-Time)
4. **Integrante não pode mudar status de Task de outro Time, exceto via "Solicitar Revisão"**
5. **Diretoria sempre pode tudo** (escapatória explícita auditada)
6. **Post só pode ser deletado pelo autor ou Diretoria**
7. **Forward de Post não cria duplicação** (use `post_feeds`, nunca `INSERT INTO posts`)
8. **Tasks tipo `revisao` herdam visibilidade `pasta`** automaticamente
9. **Time não pode ser removido de Pasta se tiver Tasks abertas** (precisa concluir ou cancelar antes)
10. **Audit log é append-only** (sem DELETE, sem UPDATE em produção)

---

## 12. Casos Edge Modelados

### 12.1 Integrante muda de Time durante Projeto ativo

- Tasks atribuídas mantêm o `owner_id` (pessoa continua dona)
- Notificação ao Líder do Time antigo e novo
- Permissão na Pasta avaliada via `time_id` da Task, não via Time atual do Integrante

### 12.2 Pasta com 0 Times participantes

- Status fica em `draft`
- Apenas Líder/Gestor/Diretoria pode ver
- Sem Tasks possíveis até adicionar Time

### 12.3 Revisão dentro de Revisão

- Permitido — task tipo `revisao` pode gerar outra task tipo `revisao`
- `task_origem_id` aponta para a revisão imediatamente anterior, não para a task original
- Cadeia completa pode ser navegada via consulta recursiva (CTE)

### 12.4 Ferramenta gera Task automática que é Revisão

- Combina `tipo='revisao'` com `ferramenta_origem` preenchido
- Ex: ferramenta Recebimentos detecta divergência de valor com proposta → cria task de revisão para Comercial

### 12.5 Diretoria deleta Post crítico

- Permitido, mas registrado em audit log com `payload_antes`
- Soft delete primeiro (`deletado_em`)
- Purge real apenas via job manual (LGPD)

### 12.6 Cliente sai (cancelamento de contrato Lioma IT)

- Pasta de Projeto: status → `arquivada` em massa
- Integrantes: `ativo = false`
- Backup completo em S3-compatible antes de pause
- Stack Supabase pode ser pausada (não deletada por 90 dias)

---

## Referências

- [README.md](../README.md)
- [ADR-002](./DECISIONS/ADR-002-single-tenant-rls.md) — Single-tenant + RLS
- [ADR-003](./DECISIONS/ADR-003-paralelismo-pasta-projeto.md) — Paralelismo
- [PERMISSIONS.md](./PERMISSIONS.md) — quem pode fazer o quê
- [DATABASE.md](./DATABASE.md) — schema completo + índices
- [docs/ai/CONTEXT.md](./ai/CONTEXT.md) — versão simplificada para IA
