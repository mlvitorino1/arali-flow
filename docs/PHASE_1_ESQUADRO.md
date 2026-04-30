# 📍 Fase 1 — ESQUADRO

> *"O esquadro é o que garante o ângulo certo. Sem ele, qualquer corte parece bom até a hora de juntar duas peças. Esquadro alinha o Comercial — porta de entrada de tudo."*

---

## 🎯 Objetivo da Etapa

Construir o **Ambiente Comercial completo**, com Pasta do Projeto operacional e a **Ferramenta Recebimentos por Projeto** — que **substitui imediatamente** a planilha "01A Recebimento Entrada" que a Arali usa hoje.

Esta é a etapa que entrega o **killer demo**: no dia em que o Time Comercial fechar uma rotina de manhã sem abrir o Excel, o sistema venceu o argumento.

**Critério de Pronto**: Suelen, Bianca, Franciele e Lisandra registram propostas e recebimentos diretamente no Arali Flow, e a Diretoria abre o sistema para conferir o caixa do dia em vez de pedir a planilha por WhatsApp.

---

## 📅 Duração

**4 semanas** — Mês 2 do cronograma de 4 meses.

---

## 🧱 Escopo Detalhado

### 1. Modelagem do Domínio Comercial (Semana 1)

Tabelas adicionais ao schema (`supabase/migrations/0002_comercial.sql`):

**Entidades de pipeline**:
- `clientes` — pessoa física ou jurídica que contrata
- `parceiros` — Arquitetura, Construtora, Gerenciadora (com tipo enum)
- `propostas` — N° OS, status de proposta, status comercial, valor, tipo, fator, elaborado por
- `propostas_revisoes` — sufixos `R01..R10`, `E01 R02 CD` (etapa + revisão + complemento de detalhamento)
- `projetos` — promovido a partir de proposta confirmada/fechada
- `projetos_times` — quais Times atuam na Pasta do Projeto

**Entidades de recebimento**:
- `recebimentos` — Data, Cliente, NF/Recibo, Proposta(OS), Medição, Entrada, vínculos com Arquitetura/Construtora/Gerenciadora
- `notas_fiscais` — NFE/NFS com número e tipo (entrada/serviço)

**Enums**:
- `status_proposta`: `em_pausa | enviada | nfp | nova | aprovada | recusada`
- `status_comercial`: `iniciando | concorrencia | em_execucao | execucao | em_pausa | sem_status`
- `tipo_proposta`: `pm | pn | fr | mob | fch | br | portas | portoes | batentes | forro | manutencao | outro`
- `tipo_parceiro`: `arquitetura | construtora | gerenciadora`

**RLS** em todas: integrante do Time Comercial lê e escreve nos seus dados; gestor/diretoria leem tudo do ambiente.

### 2. CRUD de Clientes e Parceiros (Semana 1)
- [ ] Página `/ambientes/comercial/clientes` — listagem com busca e filtros
- [ ] Drawer de criação/edição com Zod + RHF
- [ ] Página `/ambientes/comercial/parceiros` com aba para cada tipo
- [ ] Server Actions de criação/edição com validação dupla

### 3. CRUD de Propostas (Semana 2)
- [ ] Página `/ambientes/comercial/propostas` substituindo a primeira planilha (Controle de Entrada)
- [ ] Tabela com filtros: Status, Status Comercial, Elaborado, Cliente, Período
- [ ] Coluna calculada: dias desde envio, alerta visual >7 dias sem confirmação
- [ ] Drawer de proposta com todos os campos da planilha real (incluindo OBS livre)
- [ ] Versão mobile da tabela em formato de cards
- [ ] Export CSV nativo (para emergência durante transição)

### 4. CRUD de Recebimentos — **Killer Demo** (Semana 2-3)
- [ ] Página `/ambientes/comercial/ferramentas/recebimentos` substituindo a segunda planilha
- [ ] Tabela com colunas: Data, Cliente, NF/Recibo, Proposta (OS), Medição, Entrada, Arq, Const, Gerenciadora
- [ ] Totalizadores em tempo real (soma de Medição e Entrada do mês corrente)
- [ ] Filtros: Período, Cliente, Construtora, Gerenciadora
- [ ] Drawer com auto-complete de Cliente e Proposta (puxando da base já existente)
- [ ] **Validação**: NFE e NFS de mesmo OS devem ser detectadas como pareadas (não duplicadas)
- [ ] Script de ETL que importa o CSV histórico da Arali em uma única operação (com log de duplicatas e linhas inválidas)
- [ ] Export para CSV mantendo o layout da planilha original (caso ainda alguém peça)

### 5. Pasta do Projeto — Versão Comercial (Semana 3)
- [ ] Página `/projetos/[id]/pasta`
- [ ] Header com cliente, OS, status proposta, status comercial, times ativos
- [ ] Tabs: Timeline (placeholder), Tasks, Ferramentas, Documentos (placeholder), Histórico
- [ ] Sub-rota `/projetos/[id]/pasta/ferramentas/recebimentos` com a Ferramenta filtrada por aquele projeto
- [ ] Promote de Proposta → Projeto via Server Action (valida se houve fechamento)

### 6. Tasks Básicas (Semana 3-4)
- [ ] Tabela `tasks` (owner, status, prioridade, prazo, projeto_id, time_id, tipo)
- [ ] Sub-rota `/projetos/[id]/pasta/tasks` com Kanban simples (4 colunas)
- [ ] Drawer de criação/edição
- [ ] Atribuição respeitando regra de Líder/Gestor (Líder atribui só do próprio Time)
- [ ] **Sem realtime ainda** — usa refetch on focus; realtime entra em Encaixe

### 7. Distribuição de Projetos (Semana 4)
- [ ] Server Action `distribuirProjeto` com validação de papel (Líder do Time Comercial / Gestor / Diretoria)
- [ ] UI: na lista de Projetos, botão "Distribuir" disponível conforme papel
- [ ] Notificação in-app gerada (placeholder — entrega real em Encaixe)

### 8. Feed do Time + Feed Geral — Versão Manual (Semana 4)
- [ ] Tabelas: `posts`, `curtidas`, `checks`, `mencoes`
- [ ] Página `/feed` com toggle Time / Geral
- [ ] Composer simples (texto + emoji)
- [ ] Feed manual sem realtime — refetch on focus
- [ ] Forward de Post **simplificado para "compartilhar como cópia"** (forward N:N entra em Encaixe se o tempo permitir)

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
| Time Comercial resiste a abandonar Excel | Co-criar UI com Suelen/Bianca em sessão de validação na Semana 2; fazer treinamento ao vivo |
| Dados históricos inconsistentes (encoding, duplicatas, nulls como R$ 0,00) | Script ETL com relatório de saneamento + revisão manual com Cuca antes do import oficial |
| Modelo de OS com sufixos R/E/CD complexo demais | Tratar `numero_os_raw` como string crua + parser secundário em view; não tentar normalizar tudo |
| Pasta do Projeto fica sem Documentos no MVP | Documentos entram em Encaixe; deixar tab placeholder com mensagem clara |

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

**Versão**: 1.0
**Última atualização**: 2026-04-29
**Etapa anterior**: [`PHASE_0_RISCA.md`](./PHASE_0_RISCA.md)
**Próxima etapa**: [`PHASE_2_ENCAIXE.md`](./PHASE_2_ENCAIXE.md)
