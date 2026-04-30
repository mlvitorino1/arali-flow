# 📍 Fase 2 — ENCAIXE

> *"Encaixe é onde duas peças se conectam — a junta que parece simples mas decide se o móvel é digno de Arali. É o momento em que Comercial e PCP precisam casar perfeitamente, em paralelo, sem retrabalho."*

---

## 🎯 Objetivo da Etapa

Construir o **Ambiente PCP completo** e ativar a **Timeline Paralela** + **Realtime** — transformando o sistema de "ferramenta isolada do Comercial" em "infraestrutura de orquestração entre Times".

Esta é a etapa em que o sistema **prova o paralelismo**: dois Times mexem na mesma Pasta do Projeto ao mesmo tempo, e ambos veem as alterações do outro sem precisar trocar mensagem no WhatsApp.

**Critério de Pronto**: Comercial atualiza um recebimento em SP, PCP em Indaiatuba vê o status mudar na timeline em <2 segundos, e a Diretoria abre a Pasta do Projeto e enxerga as duas barras de progresso atualizando ao vivo.

---

## 📅 Duração

**4 semanas** — Mês 3 do cronograma de 4 meses.

---

## 🧱 Escopo Detalhado

### 1. Ambiente PCP — Estrutura Base (Semana 1)

Migration `0003_pcp.sql`:

- `ferramentas_pcp` — espaço para módulos do PCP
- `ordens_producao` — vínculo OS → OP (a Arali já usa esse vocabulário: "OS 12513 E03 OP 01")
- `programacao` — janela de produção semanal
- `apontamentos` — registro de execução pelo time

**Roles**: PCP terá Líder + Integrantes; Gestor pode ser compartilhado com Comercial.

### 2. Ferramenta Programação — PCP (Semana 1-2)
- [ ] Página `/ambientes/pcp/ferramentas/programacao`
- [ ] Calendário semanal com OPs alocadas
- [ ] Drag & drop para mover OP entre dias (com permissão)
- [ ] Filtros por Time interno, prioridade, projeto
- [ ] Capacidade visual: barra de saturação por dia (alerta visual >100%)

### 3. Ferramenta Apontamentos — PCP (Semana 2)
- [ ] Página `/ambientes/pcp/ferramentas/apontamentos`
- [ ] Timer simples: iniciar/pausar/concluir
- [ ] Histórico por OP, Integrante, Período
- [ ] Export CSV

### 4. Timeline Paralela na Pasta do Projeto (Semana 2-3)
- [ ] Componente `<TimelineParalela />` com barra horizontal por Time envolvido
- [ ] Cálculo de % por Time = `tasks_concluidas / tasks_totais` daquele Time naquele Projeto
- [ ] Marco visual quando há revisão pendente (criação de Task de Revisão como decidido no Domain Model)
- [ ] Filtros: ver só seu Time / ver todos
- [ ] Polling de fallback caso WebSocket caia

### 5. Realtime Ativado (Semana 3) — **decisão técnica crítica**

**Onde habilitar**:
- ✅ Feed do Time (canal `feed:time:{id}`)
- ✅ Feed Geral (canal `feed:geral`)
- ✅ Timeline da Pasta (canal `timeline:projeto:{id}`)
- ✅ Tasks da Pasta (canal `tasks:projeto:{id}`)
- ✅ Notificações in-app por usuário (canal `notificacoes:{user_id}`)
- ✅ Mudança de role/permissão (canal `permissoes:{user_id}`)

**Onde NÃO habilitar** (usar refetch on focus + cache):
- Lista de Projetos
- Página do Time
- Home cards
- Configurações

**Implementação**:
- [ ] `hooks/use-realtime-feed.ts`
- [ ] `hooks/use-realtime-timeline.ts`
- [ ] `hooks/use-realtime-tasks.ts`
- [ ] `hooks/use-realtime-notificacoes.ts`
- [ ] Reconexão automática + fallback de polling de 60s

### 6. Forward de Posts N:N (Semana 3-4)
- [ ] Tabela `posts_feeds` (N:N entre `posts` e `feeds`)
- [ ] UI: botão "Encaminhar" com seletor de Feeds destino
- [ ] Validação: não duplica post, apenas vincula
- [ ] Atualizações no post original refletem em todos os feeds

### 7. Posts Automáticos vindos de Tasks (Semana 4) — **feature flag**
- [ ] Trigger SQL ou Edge Function: ao status de Task mudar, criar Post no Feed do Time de origem
- [ ] Flag `NEXT_PUBLIC_FEATURE_TASK_AUTO_POST` para ativar/desativar
- [ ] Microcopy: "Suelen concluiu a Task: Validar OS 12513 E03"
- [ ] Permitir desabilitar por usuário (ruído mental)

### 8. Filtros e Busca no Feed (Semana 4)
- [ ] Busca full-text em posts
- [ ] Filtros: Time, Projeto, Autor, Data, Tipo (manual / automático)
- [ ] URL com query params para deep-link

### 9. Notificações In-App (Semana 4)
- [ ] Tabela `notificacoes` (user_id, tipo, payload, lida_em)
- [ ] Sino no Header com badge de não lidas
- [ ] Drawer com listagem agrupada por tipo
- [ ] Click → deep-link para o recurso (Task, Pasta, Post)

---

## 🔑 Entregáveis Tangíveis ao Fim do Encaixe

1. PCP em produção, com Líder + 4 Integrantes ativos
2. Timeline Paralela renderizando 2+ Times por Projeto
3. Realtime ativo nos 6 canais críticos
4. Forward de Posts entre 3+ Feeds
5. Posts automáticos de Tasks (atrás de feature flag)
6. Notificações in-app entregando em <2s

---

## 🎯 Checkpoints com Arali (Mês 3)

| # | Quando | Pauta |
|---|---|---|
| 05 | Fim da Semana 2 | Demo PCP + Timeline. Líder do PCP valida fluxo de programação semanal. |
| 06 | Fim da Semana 4 | Demo Realtime. Comercial e PCP simultâneos validam que enxergam um ao outro. |

---

## ⚠️ Riscos da Etapa

| Risco | Mitigação |
|---|---|
| Realtime instável em mobile (rede lenta) | Fallback de polling 60s + indicador visual de "modo offline" |
| Posts automáticos viram ruído | Feature flag por usuário + tipos filtráveis no Feed |
| Timeline com cálculo de % pesado para muitas Tasks | Materialized view atualizada por trigger; fallback para query simples se <50 tasks |
| Overhead de canais Realtime | Limitar a 1 canal por contexto + cleanup correto no useEffect |
| PCP sem ferramenta clara como Recebimentos foi pra Comercial | Conversar com Líder do PCP cedo na Semana 1; Programação é hipótese — pode trocar |

---

## 📌 Definição de Pronto da Etapa

- [ ] Tag `v0.3.0-encaixe` no `main`
- [ ] PCP com Programação e Apontamentos em uso real
- [ ] Timeline Paralela validada em 5 Projetos com Times diferentes
- [ ] Realtime entregando notificações de Task em <2s p95
- [ ] Forward de Post em uso pelo menos 1 vez ao dia
- [ ] Checkpoints 05 e 06 concluídos
- [ ] Sentry sem erros recorrentes nos últimos 7 dias

---

**Versão**: 1.0
**Última atualização**: 2026-04-29
**Etapa anterior**: [`PHASE_1_ESQUADRO.md`](./PHASE_1_ESQUADRO.md)
**Próxima etapa**: [`PHASE_3_LAPIDACAO.md`](./PHASE_3_LAPIDACAO.md)
