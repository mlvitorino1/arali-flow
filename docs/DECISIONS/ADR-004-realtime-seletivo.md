# ADR-004: Realtime Seletivo — apenas em Feed, Timeline, Tasks, Notificações e RBAC

- **Status**: Accepted
- **Data**: 2026-04-30
- **Decisor**: Marcus Vitorino (Founder / Tech Lead)
- **Consultados**: —
- **Informados**: Time de desenvolvimento Lioma IT
- **Etapa do projeto**: Encaixe (Mês 3) — implementação concentrada

---

## Contexto

O Arali Flow tem 60 usuários ativos com pico estimado de 25-30 simultâneos. Realtime via Supabase Channels tem custo concreto:

- Conexões WebSocket abertas consomem recursos do plano Supabase
- Plano Free aguenta ~200 conexões; Pro aguenta 500+
- Cada listener no client adiciona overhead de re-render
- Bugs em Realtime costumam ser difíceis de debugar (estado dessincronizado)

A pergunta: **em quais módulos Realtime adiciona valor real para a UX?** Em quais é overengineering?

## Forças em Tensão

- **UX colaborativa** — Realtime é valioso onde múltiplas pessoas atuam simultaneamente
- **Custo de conexões** — cada channel WebSocket custa
- **Complexidade de código** — Realtime adiciona 1 camada de estado
- **Confiabilidade** — falha em Realtime = UX inconsistente
- **Escalabilidade** — quanto mais channels, mais carga no Supabase
- **Mobile / PWA** — conexões WebSocket são pesadas para mobile com sinal fraco

## Opções Consideradas

### Opção 1: Realtime Total (tudo é live)
- **Como funciona**: cada tela com dados que podem mudar tem listener Supabase
- **Prós**: UX "magia" — tudo atualiza sem refresh
- **Contras**: custo alto, complexidade alta, risco de bugs em todos os lugares
- **Risco**: alto

### Opção 2: Sem Realtime (tudo via refetch / SWR / cache)
- **Como funciona**: usuário faz ação → revalidatePath → refetch on focus
- **Prós**: simples, previsível, barato
- **Contras**: perde valor em colaboração simultânea (Feed, Timeline com vários times)
- **Risco**: médio — perde valor em momentos cruciais

### Opção 3: Realtime Seletivo (apenas onde colaboração simultânea importa)
- **Como funciona**: identificar módulos onde >1 pessoa atua ao mesmo tempo e a UX se beneficia de update instantâneo. Resto = refetch on focus + polling cirúrgico.
- **Prós**: equilíbrio entre UX e custo, código simples na maioria das telas
- **Contras**: precisa de critério claro para decidir caso a caso
- **Risco**: baixo

## Decisão

**Vamos adotar Realtime Seletivo: Realtime ligado apenas em módulos onde colaboração simultânea muda a UX. Resto do sistema usa revalidação tática (refetch on focus, polling 30-60s, ou Server Components com cache).**

### Critério de Decisão

Realtime deve ser ligado quando **TODAS** as condições abaixo são verdadeiras:
1. Múltiplos usuários (≥2) podem atuar no mesmo recurso simultaneamente
2. Atraso de minutos quebraria a UX (ex: feed parecer parado)
3. O recurso muda mais de uma vez por minuto em uso típico
4. O custo de conexão se justifica (não é tela rara)

### Mapa de Realtime por Módulo

| Módulo | Realtime? | Estratégia | Razão |
|---|---|---|---|
| Feed do Time | ✅ Sim | Supabase Channels | Colaboração simultânea, like, encaminhar |
| Feed Geral | ✅ Sim | Supabase Channels | Idem |
| Timeline da Pasta do Projeto | ✅ Sim | Supabase Channels | Times paralelos atualizando ao mesmo tempo |
| Tasks da Pasta do Projeto | ✅ Sim | Supabase Channels | Status muda durante o dia |
| Notificações in-app | ✅ Sim | Supabase Channels | Precisa ser instantânea por design |
| Mudanças de role/permissão | ✅ Sim | Supabase Channels | Segurança crítica — usuário precisa ser deslogado/atualizado imediatamente |
| Lista de Projetos | ❌ Não | Refetch on focus + Server Components | Mudanças não exigem live update |
| Página do Time (cards de métricas) | ❌ Não | Polling 60s + cache | Métricas agregadas, atraso aceitável |
| Home (cards pessoais) | ❌ Não | Refetch on focus | Idem |
| Configurações de usuário | ❌ Não | Manual | Sem colaboração |
| KPIs da Diretoria | ❌ Não | Polling 5min + materialized view | Pesado, refresh planejado |
| Documentos da Pasta | ❌ Não | Refetch on focus | Mudanças de arquivo são raras |
| Histórico/Audit log | ❌ Não | Refetch on demanda | Read-only, consulta pontual |

### Padrão de Implementação

- Hooks de realtime em `hooks/use-realtime-*.ts`, **um hook por canal**
- Cleanup obrigatório (unsubscribe no `useEffect` return)
- Optimistic updates onde a UX se beneficia, mas sempre com reconciliação no evento Realtime
- Em caso de desconexão prolongada (>30s sem evento), fazer refetch full automaticamente

## Consequências

### Positivas
- Custos previsíveis (~25-30 conexões simultâneas em pico, bem dentro do Pro)
- UX viva nos pontos certos (Feed, Timeline) sem custo nos pontos onde não importa
- Código simples na maioria das telas
- Fácil debug — escopo limitado de Realtime

### Negativas / Riscos Aceitos
- Algumas telas terão "pequeno atraso" perceptível (KPIs Diretoria atualizam a cada 5min)
- Se cliente final reclamar de "está demorando", podemos ligar Realtime pontual sem grande custo

### Trade-offs Conscientes
- **Aceitamos** que KPIs da Diretoria não são instantâneos — eles são executivos, ver dado de 5min atrás é ok
- **Aceitamos** que listas de projetos não atualizam ao vivo — usuário aceita botão de refresh

## Métricas de Sucesso

- Pico de conexões simultâneas Supabase em produção ≤ 50 (margem confortável no Pro)
- Latência de evento Realtime (publish → render no client) p95 ≤ 1s
- Zero incidentes de "estado dessincronizado" reportados em 6 meses
- Custo de Supabase dentro do tier Pro

## Plano de Reversão / Plano B

Se Realtime virar custo proibitivo ou fonte de bugs:
- **Plano B1**: substituir por polling agressivo (5s) nas telas críticas — UX "quase live", custo controlado
- **Plano B2**: usar SSE (Server-Sent Events) em vez de WebSocket para casos one-way

Custo de reverter qualquer canal específico ≈ 1-2 dias de trabalho por canal.

## Referências

- README.md — seção "Realtime — Critério Técnico"
- `docs/REALTIME_STRATEGY.md`
- Supabase Realtime docs
- ADR-003 (Paralelismo) — Timeline cross-Time depende de Realtime
