# 📍 Fase 3 — LAPIDAÇÃO

> *"Lapidação é onde a peça deixa de ser madeira cortada e vira móvel digno de Arali. Lixa fina, polimento, ajuste de detalhe — é o que faz a diferença entre 'funciona' e 'impressiona'. É também o último degrau antes de entregar."*

---

## 🎯 Objetivo da Etapa

Construir o **Ambiente Diretoria** com KPIs reais, finalizar o **PWA**, fechar a **auditoria**, polir todos os fluxos críticos e fazer o **Go-Live oficial** com a Arali Móveis.

Esta é a etapa em que o sistema deixa de ser "MVP em desenvolvimento" e vira **infraestrutura operacional crítica** da Arali.

**Critério de Pronto**: Diretor-Dono Comercial abre o sistema no celular durante uma reunião com construtora e mostra os números do mês ao vivo, sem ligar para o financeiro pedindo planilha.

---

## 📅 Duração

**4 semanas** — Mês 4 do cronograma de 4 meses.

---

## 🧱 Escopo Detalhado

### 1. Ambiente Diretoria — Dashboard Executivo (Semana 1-2)

Migration `0004_diretoria.sql` — apenas views e materialized views, sem novas tabelas:

- `mv_kpi_caixa_mensal` — total de Medição + Entrada por mês
- `mv_kpi_pipeline_comercial` — propostas por status, valor potencial
- `mv_kpi_produtividade_pcp` — OPs no prazo vs atrasadas
- `mv_kpi_carga_times` — backlog por Time

**Refresh**: trigger por mudança em `recebimentos` / `propostas` / `tasks` (debounced) + cron de 5 min como fallback.

**Página `/ambientes/diretoria`**:
- [ ] **3 cards principais** (não mais — Diretor-Dono não tem tempo):
  1. Caixa do Mês (Medição + Entrada, com comparativo MoM)
  2. Pipeline Comercial (valor em propostas enviadas + valor confirmado)
  3. Saúde Operacional (% de Tasks no prazo, alertas vermelhos)
- [ ] Sub-página `/ambientes/diretoria/financeiro` com drill-down
- [ ] Sub-página `/ambientes/diretoria/comercial` com pipeline detalhado
- [ ] Sub-página `/ambientes/diretoria/operacional` com cargas por Time
- [ ] Tudo mobile-first (Diretor abre no celular antes do desktop)

### 2. Aprovações Diretoria (Semana 2)
- [ ] Tabela `aprovacoes` (tipo, recurso_id, solicitante, decisor, status, motivo)
- [ ] Workflow: Líder/Gestor solicita → Diretoria aprova/recusa
- [ ] Casos: descontos >10%, propostas acima de R$ 5M, alteração de status comercial
- [ ] Notificação push (Realtime) ao decisor
- [ ] Histórico auditável

### 3. Audit Log (Semana 2-3)
- [ ] Tabela `audit_logs` (user_id, ação, recurso, antes, depois, ip, user_agent, criado_em)
- [ ] Trigger SQL automático em tabelas críticas: `propostas`, `recebimentos`, `tasks`, `integrantes_times`, `aprovacoes`
- [ ] Página `/configuracoes/auditoria` (admin/diretoria) com filtros
- [ ] Retenção 24 meses + arquivamento automático para Storage frio

### 4. PWA Completo (Semana 3)
- [ ] `public/manifest.json` com ícones 192/512/maskable
- [ ] Service Worker com estratégia de cache
- [ ] Prompt de instalação inteligente (após 3 visitas)
- [ ] Splash screen branded (noir + gradient hero)
- [ ] Push notifications (web push) para notificações críticas — opt-in
- [ ] Offline básico: lista de Projetos atribuídos cacheada para leitura
- [ ] Banner em iOS quando o app pode ser adicionado à Home

### 5. Configurações Avançadas (Semana 3)
- [ ] Página `/configuracoes/usuarios` — CRUD com filtro por Role
- [ ] Página `/configuracoes/times` — composição, limites, gestores
- [ ] Página `/configuracoes/permissoes` — matriz visual de papéis
- [ ] Página `/configuracoes/integracoes` — placeholder para Verniz
- [ ] Página `/configuracoes/perfil` — usuário edita o próprio dado

### 6. Polimento e Performance (Semana 3-4)
- [ ] Auditoria Lighthouse: meta >90 em Performance/Accessibility/Best Practices/SEO
- [ ] Análise de bundle size com `pnpm analyze`
- [ ] Otimização de imagens (next/image em tudo)
- [ ] Code splitting de rotas pesadas
- [ ] Skeleton states em todas as listagens
- [ ] Empty states com microcopy do branding
- [ ] Error boundaries em rotas críticas com Sentry
- [ ] Loading consistente em Server Actions

### 7. Testes E2E Críticos (Semana 4)
- [ ] Login com magic link
- [ ] Criar Proposta → Promover Projeto → Distribuir Tasks
- [ ] Registrar Recebimento → Verificar Caixa do Mês na Diretoria
- [ ] Encaminhar Post entre Feeds
- [ ] Tentar acessar dado de outro Time (deve falhar via RLS)

### 8. Documentação Final (Semana 4)
- [ ] `docs/RUNBOOK.md` completo (operação, incidentes, contatos)
- [ ] `docs/CHANGELOG.md` v1.0.0
- [ ] Vídeo de onboarding (3-5 min) para cada papel
- [ ] FAQ embarcado no app (`/ajuda`)

### 9. Go-Live (Semana 4)
- [ ] Domínio comprado (`arali.flow.com.br` ou similar — discutir com Marcus)
- [ ] DNS configurado no Cloudflare
- [ ] Certificado SSL automático Vercel
- [ ] Backup automatizado Supabase ativado
- [ ] Sentry alertas configurados (Slack/email para Marcus)
- [ ] Plano de rollback documentado
- [ ] Treinamento ao vivo com 60 usuários (3 turmas: Líderes/Gestores, Time Comercial, Time PCP)
- [ ] Suporte ativo nas 2 primeiras semanas via WhatsApp dedicado
- [ ] Migração final de dados (importar últimas atualizações das planilhas)
- [ ] Comunicado oficial: planilhas arquivadas, sistema é a fonte de verdade

---

## 🔑 Entregáveis Tangíveis ao Fim da Lapidação

1. URL de produção `https://arali.flow.com.br` viva e estável
2. 60 usuários da Arali ativos no sistema
3. Diretor-Dono Comercial usando Dashboard pelo celular semanalmente
4. Audit log com 30+ dias de eventos rastreados
5. PWA instalado em pelo menos 20 celulares de Integrantes
6. Documentação operacional completa
7. Plano de evolução pós-MVP (Verniz) acordado com Arali

---

## 🎯 Checkpoints com Arali (Mês 4)

| # | Quando | Pauta |
|---|---|---|
| 07 | Fim da Semana 2 | Demo Diretoria. Diretor-Dono valida cards e drill-down. |
| 08 | Fim da Semana 4 | **Go-Live oficial**. Treinamento + ativação de produção. |

---

## ⚠️ Riscos da Etapa

| Risco | Mitigação |
|---|---|
| KPIs lentos com volume de dados real | Materialized views + refresh inteligente; query plan revisado |
| Treinamento de 60 usuários gera fila de suporte | 3 turmas + canal WhatsApp dedicado nas 2 semanas pós go-live + FAQ embarcado |
| Diretor não usa o Dashboard porque não está intuitivo | Validar UI ANTES no Checkpoint 07; iterar 1 vez antes do go-live |
| Bug crítico no go-live | Plano de rollback + dual-run de 1 semana (sistema + planilhas) antes de oficializar arquivamento |
| LGPD: termo de consentimento ausente | Onboarding com aceite obrigatório; texto revisado com advogado da LIOMA |

---

## 📌 Definição de Pronto da Etapa

- [ ] Tag `v1.0.0` no `main` 🎉
- [ ] Domínio próprio em produção
- [ ] 60 usuários cadastrados, com pelo menos 40 ativos na primeira semana
- [ ] Lighthouse score >90 em todas as 4 dimensões nas 5 páginas mais usadas
- [ ] Audit log capturando 100% das ações sensíveis
- [ ] PWA instalável em iOS e Android
- [ ] Cliente confirma por escrito: "Arali Flow é a nova fonte de verdade"
- [ ] Contrato Lioma Growth de manutenção mensal (R$ 997/mês) ativo
- [ ] Checkpoints 07 e 08 concluídos

---

## 💰 Marco Comercial

Ao fim desta etapa, o contrato com a Arali entra na **fase de mensalidade** (R$ 997/mês), e o **Setup foi quitado integralmente** (R$ 17.500 em 6 parcelas).

A próxima conversa com o Diretor-Dono é sobre **renovação automática** (mais 6 meses) e os primeiros itens do **Verniz** (Engenharia, Suprimentos, Produção, Obra).

---

**Versão**: 1.0
**Última atualização**: 2026-04-29
**Etapa anterior**: [`PHASE_2_ENCAIXE.md`](./PHASE_2_ENCAIXE.md)
**Próxima etapa**: [`PHASE_4_VERNIZ.md`](./PHASE_4_VERNIZ.md)
