# 📍 Fase 4 — VERNIZ

> *"Verniz é a camada final — a que protege a peça do mundo e dá brilho que dura. Não é onde se conserta erro, é onde se eleva o padrão. É também o momento de transformar o produto em ativo replicável da LIOMA IT."*

---

## 🎯 Objetivo da Etapa

Transformar o Arali Flow de **MVP funcional** em **plataforma vertical madura** — adicionando os 4 ambientes restantes (Engenharia, Suprimentos, Produção, Obra), preparando a base para **replicação como produto** em outras marcenarias premium do mesmo nicho, e implementando o **Portal do Arquiteto** como primeiro toque com o ecossistema externo.

Esta é a etapa em que o Arali Flow deixa de ser "sistema da Arali" e vira **produto Lioma vertical para marcenarias de alto padrão**, mantendo cada cliente em deployment single-tenant isolado.

**Critério de Pronto**: A Arali está com os 7 ambientes em uso real, e a LIOMA IT tem um pacote replicável documentado para ofertar a um segundo cliente do nicho (mantendo single-tenant deployment).

---

## 📅 Duração

**Aberta** — Mês 5 em diante. Não há prazo único. Cada submódulo tem seu próprio mini-roadmap.

---

## 🧱 Escopo Detalhado por Submódulo

### V1. Ambiente ENGENHARIA
- Detalhamentos técnicos por OS
- Vínculo com revisões (E01, E02, R01, R02…) usando o vocabulário real da Arali
- Upload e versionamento de PDFs/DWGs no Supabase Storage
- Aprovação de detalhamento por Diretoria (workflow já existe da Lapidação)
- Tasks de revisão automáticas quando Comercial detecta erro

### V2. Ambiente SUPRIMENTOS
- Cadastro de fornecedores (com renovação anual de cadastro)
- Pedidos de compra vinculados a OS
- Status de chegada de matéria-prima
- Alerta de ruptura de estoque
- Integração read-only com sistema legado de estoque (se houver)

### V3. Ambiente PRODUÇÃO
- Ordens de Produção detalhadas (já parcialmente em Encaixe)
- Apontamento por máquina/setor (CNC, marcenaria fina, montagem, acabamento)
- Controle de qualidade com checklists fotográficos
- Foto-status: cada peça produzida tira foto antes de embalar

### V4. Ambiente OBRA
- Checklist de instalação no local
- Foto antes/depois por ambiente da casa
- Aceite digital do cliente (assinatura mobile)
- **Modo offline real** (PWA com sync) — instaladores em obra sem 4G estável
- Geolocalização opcional no aceite

### V5. Portal do Arquiteto
- Login externo separado (escritório de arquitetura)
- Acesso somente-leitura ao status dos seus projetos
- Comentários em pontos específicos da Pasta
- Notificação por email + WhatsApp (Resend + Twilio)
- Sem acesso a valores comerciais, apenas operacional

### V6. IA Assistida
- Resumo automático do Feed do dia para Diretoria (Claude Haiku via API)
- Detecção de Tasks paradas (>5 dias sem update) com alerta
- Sugestão de redistribuição quando Time saturado
- Classificação automática de Posts em categorias

### V7. Integrações com Sistemas Legados Arali
- API read-only com sistema fiscal (NFS/NFE)
- Sincronização de Cliente (CRM da casa)
- Webhooks para eventos críticos (recebimento alto, OS revisada >3 vezes)

### V8. Relatórios e Exportações Avançadas
- Geração de PDF executivo mensal (auto-disparado dia 1 às 8h)
- Export Excel formatado mantendo layout esperado pelo Financeiro
- Dashboards customizáveis por usuário (escolher 3 cards prediletos)

### V9. Light Mode
- Já preparado pela arquitetura de CSS Variables desde a Risca
- Inversão da paleta mantendo Gold/Wood como acentos
- Toggle por usuário em `/configuracoes/perfil`

### V10. Replicação como Produto Lioma
- Documentar o **playbook de onboarding** de uma nova marcenaria
- Template de migração de planilha → Arali Flow
- Configurações por tenant (nome, paleta secundária, ambientes ativados)
- Pricing model documentado (Setup + Mensalidade)
- Material comercial: deck, one-pager, cases (Arali = caso 1)

---

## 🔑 Entregáveis Tangíveis ao Fim do Verniz

1. Arali com 7 ambientes em uso real (ou pelo menos 5 se algum não fizer sentido)
2. Portal do Arquiteto com 3+ escritórios externos ativos
3. Modo offline da Obra validado em 5+ instalações reais
4. Pelo menos 1 funcionalidade IA assistida em produção (resumo de Feed para Diretoria)
5. **Playbook Lioma documentado** para replicar para 2º cliente
6. **Lead de 2º cliente** identificado e abordado (idealmente por indicação da Arali)

---

## ⚠️ Riscos da Etapa

| Risco | Mitigação |
|---|---|
| Escopo cresce indefinidamente | Manter cada submódulo em mini-roadmap próprio com 2-4 semanas; não deixar nada em "grande projeto" |
| Cliente novo da LIOMA quebra o produto pensado para Arali | Toda nova feature deve ser configurável por flag tenant-specific |
| Distração: começar 2º cliente antes da Arali estar 100% sólida | Regra: Arali precisa ter 90 dias de uso estável antes de pitching ativo para 2º cliente |
| Fase Verniz vira "manutenção" e não evolução | Trimestralmente, escolher 1 grande movimento (não 5 pequenos) |

---

## 📌 Marcos Importantes

- **Mês 6 (após go-live)**: renovação automática do contrato Arali (mais 6 meses, R$ 997 × 12 meses confirmados)
- **Mês 7-8**: Engenharia + Suprimentos completos
- **Mês 9-10**: Produção + Obra com modo offline
- **Mês 12**: Portal do Arquiteto e IA assistida básica
- **Mês 12-18**: Lioma documenta produto + abre conversa com 2º cliente

---

## 💼 Estratégia de Replicação Lioma (Visão CEO)

O Arali Flow é **single-tenant por instância**, mas **multi-cliente em ownership Lioma IT**. Isso significa:

- Cada marcenaria contratante tem deploy isolado (Supabase project + Vercel project próprios)
- Lioma mantém o repositório-base como produto, não bifurcação
- Customizações por cliente vivem em flags + config — não em forks
- Onboarding de novo cliente: provisionamento em <1 dia
- Pricing replicável: Diagnóstico R$ 2.500 (abatido) + Setup R$ 17.500 (6x) + Mensalidade R$ 997

**Hipótese de TAM** (a validar com pesquisa em Verniz): marcenarias premium no Brasil que faturam acima de R$ 5M/ano e têm time de >20 pessoas — estimativa preliminar: 80-150 alvos viáveis no eixo Rio-SP-MG.

**Cenário de receita Lioma com 10 clientes do nicho ativos**:
- Setup: 10 × R$ 17.500 = R$ 175.000 (faturamento de implantação)
- Recorrência: 10 × R$ 997 × 12 = R$ 119.640/ano
- Custo de infra (Supabase Pro + Vercel) por cliente: ~R$ 200/mês = R$ 24.000/ano para 10 clientes
- **Margem bruta recorrente: ~80%**

> **Premissa**: a Arali precisa ser case validado e referência ativa antes de qualquer pitch de 2º cliente.

---

**Versão**: 1.0
**Última atualização**: 2026-04-29
**Etapa anterior**: [`PHASE_3_LAPIDACAO.md`](./PHASE_3_LAPIDACAO.md)
**Próxima etapa**: — (etapa contínua / pós-MVP)
