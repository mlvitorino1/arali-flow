# 🔐 Matriz de Permissões — Arali Flow

> Documento normativo de permissões. Toda decisão de acesso no sistema **deve** estar listada aqui. Mudanças requerem PR + aprovação técnica.

---

## Sumário

1. [Princípios](#1-princípios)
2. [Roles Globais](#2-roles-globais)
3. [Pertencimento a Times](#3-pertencimento-a-times)
4. [Matriz Macro: Role × Recurso × Ação](#4-matriz-macro-role--recurso--ação)
5. [Permissões Granulares por Recurso](#5-permissões-granulares-por-recurso)
6. [Helper Functions SQL](#6-helper-functions-sql)
7. [Padrões de RLS Policy](#7-padrões-de-rls-policy)
8. [Cenários Edge](#8-cenários-edge)
9. [Checklist de Auditoria](#9-checklist-de-auditoria)

---

## 1. Princípios

1. **RLS é a única fonte de verdade** — autorização vive no banco, não no client.
2. **Default deny** — toda tabela tem RLS habilitada e ZERO policies = acesso zero.
3. **Roles são globais, pertencimento é contextual** — `role_global` define "o que pode fazer no sistema", `integrantes_times` define "em qual escopo".
4. **Diretoria é escapatória explícita** — sempre pode tudo, sempre auditado.
5. **Princípio do menor privilégio** — quando em dúvida, negar. Permissão é granted, não inherited.
6. **Helper functions versionadas** — `is_diretoria()`, `is_lider_de_time()`, etc. Mudanças via migration.
7. **Audit log é obrigatório** em ações sensíveis (mudança de role, distribuição de projeto, exclusões, exportação).

---

## 2. Roles Globais

| Role | Escopo | Quem é (típico) | Cardinalidade |
|---|---|---|---|
| `super_admin` | Sistema todo + infraestrutura | Marcus (LIOMA IT) | 1-2 contas |
| `admin` | Configurações + Usuários do cliente | Admin TI da Arali | 1-2 contas |
| `diretoria` | Todos os ambientes/times/projetos | Sócios Arali | 2-4 contas |
| `gestor` | 1+ Times (definido pela Diretoria) | Coordenadores | 4-8 contas |
| `lider_time` | Apenas seu Time | Líderes operacionais | 4-12 contas |
| `integrante` | Apenas seu Time | Operadores | 30-45 contas |
| `viewer` | Leitura limitada | Auditores, parceiros | 0-2 contas |

**Regras:**
- Um Integrante tem **um único `role_global`** (papel mais alto entre os Times).
- `super_admin` é o nível LIOMA IT (suporte). Não confundir com `admin` (cliente).
- Mudança de role é registrada em `audit_logs` com `payload_antes` e `payload_depois`.
- Mudança de role gera evento Realtime → todos os clients do usuário afetado fazem refresh do JWT.

---

## 3. Pertencimento a Times

Pertencimento vive em `integrantes_times` (ver Domain Model):

```sql
integrantes_times {
  integrante_id, time_id, papel: 'gestor' | 'lider' | 'integrante', desde, ate
}
```

**Regras de Pertencimento:**
- Mesmo Integrante pode ser **Gestor de múltiplos Times** simultaneamente
- Mesmo Integrante pode ser **Líder de no máximo 1 Time** simultaneamente
- Mesmo Integrante pode ser **Integrante em múltiplos Times** (ex: alguém com chapéus em PCP e Engenharia)
- Pertencimento é histórico: `ate` NOT NULL = pertencimento encerrado
- RLS sempre filtra por `ate IS NULL` para considerar apenas pertencimento atual

**Hierarquia efetiva** (do menos para o mais permissivo):
```
viewer < integrante < lider_time < gestor < diretoria < admin < super_admin
```

---

## 4. Matriz Macro: Role × Recurso × Ação

Legenda: ✅ Pode | ❌ Não pode | ⚠️ Restrito por escopo | ★ Auditado obrigatoriamente

### Recursos do Domínio

| Ação | Diretoria | Admin | Gestor | Líder Time | Integrante | Viewer |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Projeto** |
| Criar | ✅ | ❌ | ⚠️ Times sob coord | ❌ | ❌ | ❌ |
| Visualizar | ✅ | ✅ | ⚠️ Times sob coord | ⚠️ Onde Time participa | ⚠️ Onde Time participa | ⚠️ Limitado |
| Editar | ✅★ | ❌ | ⚠️ Times sob coord | ❌ | ❌ | ❌ |
| Arquivar / Cancelar | ✅★ | ❌ | ⚠️★ | ❌ | ❌ | ❌ |
| Distribuir a Time | ✅★ | ❌ | ⚠️★ | ⚠️ Apenas seu Time | ❌ | ❌ |
| **Pasta do Projeto** |
| Adicionar Time | ✅★ | ❌ | ⚠️ Times sob coord | ❌ | ❌ | ❌ |
| Remover Time | ✅★ | ❌ | ⚠️★ | ❌ | ❌ | ❌ |
| Mudar status (concluir) | ✅★ | ❌ | ⚠️★ | ⚠️★ | ❌ | ❌ |
| **Task** |
| Criar (próprio Time) | ✅ | ❌ | ✅ | ✅ | ✅ Próprias | ❌ |
| Atribuir owner | ✅ | ❌ | ✅ | ⚠️ Apenas seu Time | ⚠️ Só pra si próprio | ❌ |
| Mudar status | ✅ | ❌ | ✅ | ✅ | ⚠️ Tasks com `owner_id = self` | ❌ |
| Solicitar Revisão | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Cancelar Task | ✅★ | ❌ | ⚠️★ | ⚠️★ | ❌ | ❌ |
| **Feed** |
| Postar no Feed do Time | ✅ | ❌ | ⚠️ Times sob coord | ✅ Seu Time | ✅ Seu Time | ❌ |
| Postar no Feed Geral | ✅ | ❌ | ✅ | ❌ | ❌ | ❌ |
| Postar no Feed da Pasta | ✅ | ❌ | ⚠️ Pastas onde Time atua | ⚠️ Onde Time participa | ⚠️ Onde Time participa | ❌ |
| Encaminhar Post | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Reagir / Comentar | ✅ | ❌ | ✅ | ✅ | ✅ | ❌ |
| Editar Post | ✅★ | ❌ | ⚠️ Próprio | ⚠️ Próprio | ⚠️ Próprio | ❌ |
| Remover Post | ✅★ | ✅★ | ⚠️ Próprio★ | ⚠️ Próprio★ | ⚠️ Próprio★ | ❌ |
| **Documentos** |
| Anexar a Pasta | ✅ | ❌ | ⚠️ Pastas onde Time atua | ⚠️ Onde Time participa | ⚠️ Onde Time participa | ❌ |
| Baixar | ✅ | ❌ | ⚠️ | ⚠️ | ⚠️ | ❌ |
| Deletar | ✅★ | ❌ | ⚠️★ | ⚠★ | ❌ | ❌ |
| **Ferramentas** |
| Habilitar/Desabilitar para Time | ✅★ | ✅★ | ❌ | ❌ | ❌ | ❌ |
| Usar (CRUD entradas) | ✅ | ❌ | ⚠️ Times sob coord | ✅ Seu Time | ✅ Seu Time | ❌ |
| Exportar dados | ✅★ | ✅★ | ⚠️★ | ❌ | ❌ | ❌ |
| **KPIs e Relatórios** |
| Ver KPIs Globais (Diretoria) | ✅ | ❌ | ❌ | ❌ | ❌ | ❌ |
| Ver KPIs do Time | ✅ | ❌ | ⚠️ Times sob coord | ✅ Seu Time | ⚠️ Subset (próprios) | ❌ |
| Ver Audit Log | ✅ | ✅ | ⚠️ Recursos sob coord | ❌ | ❌ | ❌ |

### Recursos do Sistema

| Ação | Diretoria | Admin | Gestor | Líder Time | Integrante | Viewer |
|---|:-:|:-:|:-:|:-:|:-:|:-:|
| **Usuários** |
| Criar Integrante | ❌ | ✅★ | ❌ | ❌ | ❌ | ❌ |
| Mudar role global | ❌ | ✅★ | ❌ | ❌ | ❌ | ❌ |
| Desativar Integrante | ✅★ | ✅★ | ❌ | ❌ | ❌ | ❌ |
| Resetar senha (admin) | ❌ | ✅★ | ❌ | ❌ | ❌ | ❌ |
| **Times** |
| Criar Time | ❌ | ✅★ | ❌ | ❌ | ❌ | ❌ |
| Adicionar Integrante a Time | ✅★ | ✅★ | ⚠️★ | ❌ | ❌ | ❌ |
| Remover Integrante de Time | ✅★ | ✅★ | ⚠️★ | ❌ | ❌ | ❌ |
| **Configurações** |
| Mudar branding/cliente | ❌ | ✅★ | ❌ | ❌ | ❌ | ❌ |
| Mudar feature flags | ✅★ | ✅★ | ❌ | ❌ | ❌ | ❌ |
| Acessar audit log completo | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ |

---

## 5. Permissões Granulares por Recurso

### 5.1 Distribuição de Projeto

> Maior fonte de bugs em RBAC: quem distribui o quê para quem?

**Regras:**

| Quem distribui | Para qual Time | Para qual Integrante |
|---|---|---|
| **Diretoria** | Qualquer Time | Qualquer Integrante (de qualquer Time) |
| **Gestor de Time(s)** | Times sob sua coordenação | Integrantes dos Times sob coordenação |
| **Gestor (cross-Time coordination)** | Pode "convidar" outros Times à Pasta — gera notificação ao Líder daquele Time | NÃO pode atribuir Integrantes específicos de outro Time |
| **Líder de Time** | Apenas seu próprio Time (adicionar à Pasta) | Apenas Integrantes do seu Time |
| **Integrante** | ❌ | ❌ |

**Fluxo "Gestor convida outro Time":**

```
1. Gestor (Comercial) está na Pasta do Projeto X
2. Clica "Adicionar Time" → seleciona "Engenharia"
3. Sistema cria registro em pastas_projeto_times com status='ativo'
4. Sistema gera notificação ao Líder de Engenharia
5. Sistema cria evento na timeline da Pasta
6. Líder de Engenharia abre a Pasta e distribui Tasks aos seus Integrantes
```

### 5.2 Solicitar Revisão (cross-Time)

**Quem pode**: qualquer Integrante (a partir de uma task em que está envolvido) — todas as roles exceto `viewer`.

**Limitação**: a revisão é criada **na pasta atual**, atribuída ao **Time alvo**, não ao Integrante específico (esse fica como NULL no `owner_id`, indo para backlog do time).

**Auditoria**: toda solicitação de revisão é gravada em `audit_logs` com motivo.

### 5.3 Edição de Post

- Autor pode editar até 30min após publicação (sem trace de edição)
- Após 30min, edição mostra "(editado)" e mantém histórico em `posts_edicoes`
- Diretoria/Admin podem editar a qualquer momento (sempre auditado)

### 5.4 Visibilidade de Task

A coluna `tasks.visibilidade` controla quem vê dentro da Pasta:

- `time` (default): apenas membros do `time_responsavel_id` veem
- `pasta`: todos os Times participantes da Pasta veem (usado em revisões e tasks transversais)

**Independente da visibilidade**, Diretoria sempre vê tudo.

### 5.5 Notificações

- Notificação é gerada para **donos diretos** (owner de task, autor de post mencionado, líder de time alvo de revisão)
- Diretoria recebe **digest diário** opcional (via configuração pessoal), não notificações por evento — evita ruído
- Notificações realtime via Supabase Channels (canal `notif:<user_id>`)

---

## 6. Helper Functions SQL

Funções centrais que **toda RLS policy** deve usar para evitar lógica duplicada.

```sql
-- ===========================================================
-- HELPERS DE PERFIL
-- ===========================================================

CREATE OR REPLACE FUNCTION public.current_integrante_id()
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT id FROM integrantes WHERE usuario_id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.current_role_global()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER
AS $$
  SELECT role_global FROM integrantes WHERE usuario_id = auth.uid() LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql STABLE
AS $$ SELECT public.current_role_global() = 'super_admin' $$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql STABLE
AS $$ SELECT public.current_role_global() IN ('super_admin', 'admin') $$;

CREATE OR REPLACE FUNCTION public.is_diretoria()
RETURNS boolean
LANGUAGE sql STABLE
AS $$ SELECT public.current_role_global() IN ('super_admin', 'admin', 'diretoria') $$;

-- ===========================================================
-- HELPERS DE PERTENCIMENTO A TIME
-- ===========================================================

CREATE OR REPLACE FUNCTION public.is_gestor_de_time(p_time_id uuid)
RETURNS boolean
LANGUAGE sql STABLE
AS $$
  SELECT public.is_diretoria() OR EXISTS (
    SELECT 1 FROM integrantes_times it
    WHERE it.integrante_id = public.current_integrante_id()
      AND it.time_id = p_time_id
      AND it.papel = 'gestor'
      AND it.ate IS NULL
  )
$$;

CREATE OR REPLACE FUNCTION public.is_lider_de_time(p_time_id uuid)
RETURNS boolean
LANGUAGE sql STABLE
AS $$
  SELECT public.is_diretoria() OR EXISTS (
    SELECT 1 FROM integrantes_times it
    WHERE it.integrante_id = public.current_integrante_id()
      AND it.time_id = p_time_id
      AND it.papel IN ('lider', 'gestor')
      AND it.ate IS NULL
  )
$$;

CREATE OR REPLACE FUNCTION public.is_integrante_de_time(p_time_id uuid)
RETURNS boolean
LANGUAGE sql STABLE
AS $$
  SELECT public.is_diretoria() OR EXISTS (
    SELECT 1 FROM integrantes_times it
    WHERE it.integrante_id = public.current_integrante_id()
      AND it.time_id = p_time_id
      AND it.ate IS NULL
  )
$$;

-- ===========================================================
-- HELPERS DE PASTA DO PROJETO
-- ===========================================================

CREATE OR REPLACE FUNCTION public.atua_em_pasta(p_pasta_projeto_id uuid)
RETURNS boolean
LANGUAGE sql STABLE
AS $$
  SELECT public.is_diretoria() OR EXISTS (
    SELECT 1
    FROM pastas_projeto_times ppt
    JOIN integrantes_times it ON it.time_id = ppt.time_id
    WHERE ppt.pasta_projeto_id = p_pasta_projeto_id
      AND it.integrante_id = public.current_integrante_id()
      AND it.ate IS NULL
      AND ppt.status = 'ativo'
  )
$$;
```

---

## 7. Padrões de RLS Policy

Toda policy segue o template:

```sql
-- ====================================================
-- TABELA: <nome>
-- ====================================================
ALTER TABLE <nome> ENABLE ROW LEVEL SECURITY;

-- SELECT
CREATE POLICY "<nome>_select" ON <nome>
  FOR SELECT TO authenticated
  USING (<expressão usando helpers>);

-- INSERT
CREATE POLICY "<nome>_insert" ON <nome>
  FOR INSERT TO authenticated
  WITH CHECK (<expressão usando helpers>);

-- UPDATE
CREATE POLICY "<nome>_update" ON <nome>
  FOR UPDATE TO authenticated
  USING (<expressão de leitura>)
  WITH CHECK (<expressão de escrita>);

-- DELETE
CREATE POLICY "<nome>_delete" ON <nome>
  FOR DELETE TO authenticated
  USING (<expressão usando helpers>);
```

### Exemplo: Policies para `tasks`

```sql
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

-- Pode ler quem atua na pasta E (visibilidade=pasta OU é do time responsável)
CREATE POLICY "tasks_select" ON tasks
  FOR SELECT TO authenticated
  USING (
    public.atua_em_pasta(pasta_projeto_id) AND (
      visibilidade = 'pasta'
      OR public.is_integrante_de_time(time_responsavel_id)
      OR public.is_diretoria()
    )
  );

-- Pode criar quem é do time responsável OU é gestor coordenando
CREATE POLICY "tasks_insert" ON tasks
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_integrante_de_time(time_responsavel_id)
    OR public.is_gestor_de_time(time_responsavel_id)
    OR public.is_diretoria()
  );

-- Pode editar dependendo do contexto:
-- - Owner pode mudar status próprio
-- - Líder/Gestor do time pode tudo no escopo
-- - Diretoria pode tudo
CREATE POLICY "tasks_update" ON tasks
  FOR UPDATE TO authenticated
  USING (
    public.atua_em_pasta(pasta_projeto_id)
  )
  WITH CHECK (
    public.is_integrante_de_time(time_responsavel_id)
    OR owner_id = public.current_integrante_id()
    OR public.is_diretoria()
  );

-- Soft delete: ninguém pode DELETE direto (só Diretoria/Admin via API admin)
-- Ver coluna deletado_em para soft delete
CREATE POLICY "tasks_delete" ON tasks
  FOR DELETE TO authenticated
  USING (public.is_diretoria());
```

### Exemplo: Policies para `posts` (Feed Geral, Time, Pasta)

```sql
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Visualização: através da tabela post_feeds (cada post tem feeds onde aparece)
-- Aqui posts é "ler todos os posts que estão em feeds que eu acesso"
CREATE POLICY "posts_select" ON posts
  FOR SELECT TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM post_feeds pf
      JOIN feeds f ON f.id = pf.feed_id
      WHERE pf.post_id = posts.id
        AND (
          f.tipo = 'geral'
          OR (f.tipo = 'time' AND public.is_integrante_de_time(f.time_id))
          OR (f.tipo = 'pasta_projeto' AND public.atua_em_pasta(f.pasta_projeto_id))
          OR public.is_diretoria()
        )
    )
  );

-- Inserção: autor é o usuário atual
CREATE POLICY "posts_insert" ON posts
  FOR INSERT TO authenticated
  WITH CHECK (
    autor_id = public.current_integrante_id()
  );

-- Edição: apenas o autor (até 30min — checagem em service layer também)
CREATE POLICY "posts_update" ON posts
  FOR UPDATE TO authenticated
  USING (autor_id = public.current_integrante_id() OR public.is_diretoria())
  WITH CHECK (autor_id = public.current_integrante_id() OR public.is_diretoria());

-- Soft delete via campo deletado_em (não DELETE real)
```

---

## 8. Cenários Edge

### 8.1 Gestor cross-Time recebe tarefa

**Cenário**: Gestor coordena Comercial e PCP. Líder do Comercial atribui task ao Gestor.

**Como tratar**: Gestor é um Integrante normal. Aparece como `owner_id` válido. Não tem privilégio de execução automática — precisa marcar concluída como qualquer um.

### 8.2 Integrante perdeu pertencimento ao Time durante Pasta ativa

**Cenário**: João era do PCP. Foi movido para Engenharia em 15/06. Tinha 5 tasks no PCP em pastas ativas.

**Como tratar**:
- `integrantes_times` registra `ate=2026-06-15` no pertencimento PCP
- Tasks de João continuam em seu nome (`owner_id` mantido)
- João pode continuar **lendo** tasks via `atua_em_pasta()` se a Pasta tem o Time PCP — mas a função `is_integrante_de_time(time_pcp)` retorna `false` agora
- **Solução**: criar helper `pode_ver_task_via_owner(p_task_id)` que aceita `owner_id = current_integrante_id()` mesmo sem pertencer ao time atual
- Líder do PCP é notificado para reatribuir as 5 tasks a outro Integrante

### 8.3 Diretoria deleta Post crítico

- Permitido (`posts_update` com soft delete)
- Audit log registra `payload_antes` completo
- Post permanece em DB com `deletado_em` setado por 30 dias
- Após 30 dias, hard delete via job manual com nova auditoria

### 8.4 Líder tenta atribuir Task a Integrante de outro Time

- RLS bloqueia: `tasks_update WITH CHECK` exige `is_integrante_de_time(time_responsavel_id)`
- API retorna 403 com mensagem amigável
- Tentativa registrada em `audit_logs` com `acao='attempt_invalid_assignment'`

### 8.5 Mudança de role durante sessão ativa

- Mudança grava evento Realtime no canal `permissions:<user_id>`
- Client recebe → faz refresh do JWT (Supabase auth.refreshSession())
- Em 5s o usuário tem novo escopo aplicado

---

## 9. Checklist de Auditoria

Para **toda nova tabela** que entra em produção:

- [ ] `ALTER TABLE <nome> ENABLE ROW LEVEL SECURITY;` aplicado
- [ ] Policies para SELECT, INSERT, UPDATE, DELETE explicitamente criadas (ou explicitamente bloqueadas)
- [ ] Uso de helper functions (não SQL repetido em policies)
- [ ] Teste E2E com user de cada role (super_admin, admin, diretoria, gestor, lider, integrante, viewer)
- [ ] Teste negativo: usuário fora do escopo NÃO consegue ler/escrever
- [ ] Auditoria configurada (trigger ou log explícito) em ações sensíveis
- [ ] Documentado neste arquivo (PERMISSIONS.md) com matriz atualizada
- [ ] Code review com ≥1 aprovação técnica antes de merge

---

## Referências

- [README.md](../README.md) — visão executiva
- [DOMAIN_MODEL.md](./DOMAIN_MODEL.md) — entidades
- [SECURITY.md](./SECURITY.md) — segurança ampla
- [ADR-002](./DECISIONS/ADR-002-single-tenant-rls.md) — decisão de RLS
- `supabase/policies/` — implementação real
