# MODELO DE CUSTO DE INFRAESTRUTURA — LIOMA IT × ARALI MÓVEIS

> **Documento operacional do departamento Lioma IT — Operações & Finanças**
> Modelo de planilha de custo de infraestrutura por cliente. Após aprovação, migrar para o repositório financeiro/operacional Lioma IT.
>
> **Cliente**: Arali Móveis
> **Produto**: Arali Flow (single-tenant deployment)
> **Versão**: 1.0
> **Data de elaboração**: 2026-05-01
> **Autor**: Marcus Vitorino (Founder Lioma IT)
> **Revisão**: Trimestral

---

## SUMÁRIO

1. [Princípios de Modelagem de Custo](#1-princípios-de-modelagem-de-custo)
2. [Categorias de Custo](#2-categorias-de-custo)
3. [Custos Diretos por Cliente (Arali Móveis)](#3-custos-diretos-por-cliente-arali-móveis)
4. [Custos Lioma IT Rateados (compartilhados entre clientes)](#4-custos-lioma-it-rateados-compartilhados-entre-clientes)
5. [Resumo Financeiro](#5-resumo-financeiro)
6. [Gatilhos de Upgrade](#6-gatilhos-de-upgrade)
7. [Política de Revisão](#7-política-de-revisão)
8. [Apêndices](#8-apêndices)

---

## 1. Princípios de Modelagem de Custo

1. **Custos diretos vs. rateados**: separamos infraestrutura *exclusiva do cliente* (DB, hosting, domínio) de ferramentas *Lioma IT* (Claude, Cursor, IA assistida) que servem todos os clientes.
2. **Free tier first**: começamos sempre nos planos gratuitos quando possível, fazemos upgrade só quando uso justifica.
3. **Teto contratual claro**: estouro de teto vira aditivo, nunca surpresa para cliente.
4. **Câmbio com buffer**: USD convertido com buffer de +5% sobre cotação spot, para absorver oscilações.
5. **Revisão trimestral obrigatória** com relatório enviado ao cliente.
6. **Single-tenant deployment**: stack do Arali não compartilha recursos com nenhum outro cliente. Custos não se misturam.
7. **Transparência**: cliente pode pedir auditoria de faturas a qualquer momento.

---

## 2. Categorias de Custo

| Categoria | Tipo | Função |
|---|---|---|
| **Hosting Frontend** | Direto | Build + Edge runtime + CDN |
| **Backend-as-a-Service (BaaS)** | Direto | DB Postgres + Auth + Storage + Realtime + Edge Functions |
| **DNS + WAF** | Direto | Resolução de domínio, proxy, proteção DDoS básica |
| **Observabilidade** | Direto | Errors, performance, traces |
| **E-mail Transacional** | Direto | Magic link, notificações |
| **Domínio** | Direto | Registro .com.br ou outro TLD |
| **Backups Externos** | Direto | Buffer e disaster recovery |
| **IA Assistida (Lioma IT)** | Rateado | Claude Code, Cursor, Anthropic API, etc. |
| **Comunicação Cliente** | Direto | WhatsApp Business API (futuro) |
| **Operacional Lioma IT** | Rateado | Software de gestão Lioma, IDE, monitoramento interno |

---

## 3. Custos Diretos por Cliente (Arali Móveis)

> Premissa: 60 usuários ativos, 26 projetos simultâneos, pico de 25-30 conexões simultâneas, ~5GB DB no primeiro ano.

### 3.1 Hosting Frontend

| Fornecedor | Plano | Custo USD/mês | Custo R$/mês* | Função | Status |
|---|---|---|---|---|---|
| **Vercel** | Hobby | $0 | R$ 0 | Hosting Next.js + Edge | Inicial |
| Vercel | Pro | $20 | ~R$ 110 | Idem, sem limites comerciais | Upgrade no Mês 5+ |

> *Câmbio considerado: 1 USD = R$ 5,50 (com buffer +5% sobre spot ~R$ 5,20).

### 3.2 Backend-as-a-Service (Supabase)

| Fornecedor | Plano | Custo USD/mês | Custo R$/mês | Inclusões | Status |
|---|---|---|---|---|---|
| **Supabase** | Pro | $25 | ~R$ 138 | 8GB DB, 100GB storage, 250GB bandwidth, 500 conexões realtime, daily backups, branch | **Recomendado desde o piloto** |
| Supabase | Team | $599 | ~R$ 3.295 | 50GB DB, 1TB storage, 2.5TB bandwidth | Só com 3+ clientes Lioma operando |

### 3.3 DNS + WAF

| Fornecedor | Plano | Custo | Função |
|---|---|---|---|
| **Cloudflare** | Free | R$ 0 | DNS, proxy, DDoS básico, WAF entrada |
| Cloudflare | Pro | $20/mês | WAF avançado (só se atacado seriamente) |

### 3.4 Observabilidade

| Fornecedor | Plano | Custo USD/mês | Custo R$/mês | Inclusões |
|---|---|---|---|---|
| **Sentry** | Developer Free | $0 | R$ 0 | 5k events/mês, 1 user |
| Sentry | Team | $26 | ~R$ 143 | 50k events/mês, unlimited users |

### 3.5 E-mail Transacional

| Fornecedor | Plano | Custo USD/mês | Custo R$/mês | Inclusões |
|---|---|---|---|---|
| **Resend** | Free | $0 | R$ 0 | 3k e-mails/mês, 1 domínio |
| Resend | Pro | $20 | ~R$ 110 | 50k e-mails/mês |

### 3.6 Domínio

| Item | Plano | Custo R$/ano | Custo R$/mês |
|---|---|---|---|
| **arali-flow.com.br** | Anual | ~R$ 60 | ~R$ 5 |

### 3.7 Backups Externos

| Item | Plano | Custo R$/mês | Função |
|---|---|---|---|
| **Cloudflare R2** ou **Backblaze B2** | Pay-as-you-go | ~R$ 30 | Backup off-site dos dumps Supabase |

### 3.8 Comunicação com Cliente

| Item | Plano | Custo R$/mês | Função |
|---|---|---|---|
| **WhatsApp pessoal Marcus** | — | R$ 0 | Suporte direto (incluído no contrato) |
| **WhatsApp Business API** (futuro) | Conforme uso | A definir | Integrações automáticas |

### 3.9 Subtotal — Custos Diretos Arali

| Cenário | Total Mensal (R$) |
|---|---|
| **Mês 1-4 (desenvolvimento, baixo uso)** | ~R$ **170** (Supabase Pro + domínio + backup) |
| **Mês 5-12 (Vercel Pro ativado)** | ~R$ **285** |
| **Pós-Mês 12 (Sentry Team se necessário)** | ~R$ **425** |
| **Cenário Worst Case (todos upgrades)** | ~R$ **600** |

**Observação**: o teto contratual de **R$ 500/mês** é mantido em cenário típico. Se ultrapassar, vira aditivo de contrato com cliente.

---

## 4. Custos Lioma IT Rateados (compartilhados entre clientes)

> Estas ferramentas são **investimento da Lioma IT** que serve todos os clientes. Rateio inicial considera 1 cliente (Arali); cada novo cliente reduz o custo unitário.

### 4.1 IA Assistida — Desenvolvimento

| Fornecedor | Plano | Custo USD/mês | Custo R$/mês | Função |
|---|---|---|---|---|
| **Claude (Anthropic)** | Pro | $20 | ~R$ 110 | Chat para análise estratégica |
| **Claude (Anthropic)** | Max ou Teams | $100-$200 | ~R$ 550-1.100 | Volume de uso intensivo Marcus + IA assistida |
| **Anthropic API** | Pay-as-you-go | $50-$200 | ~R$ 275-1.100 | Claude Code + integrações |
| **Cursor** | Pro | $20 | ~R$ 110 | IDE com agente |
| **GitHub Copilot** (opcional) | Individual | $10 | ~R$ 55 | Autocomplete |
| **v0 by Vercel** | Conforme uso | Incluso Vercel Pro | — | Geração UI |

**Subtotal IA Assistida (Lioma IT)**: ~R$ **1.100 - R$ 2.475/mês**

**Rateio com 1 cliente (Arali)**: 100% nessa cliente → R$ 1.100-2.475
**Rateio com 5 clientes**: 20% → ~R$ 220-495 por cliente
**Rateio com 10 clientes**: 10% → ~R$ 110-247 por cliente

### 4.2 Operacional Lioma IT

| Fornecedor | Plano | Custo R$/mês | Função |
|---|---|---|---|
| **GitHub** | Team | $4 USD/user × 2 = $8 | ~R$ 44 | Repos privados |
| **Linear** ou **Notion** | Standard | $10 USD/user | ~R$ 55 | Gestão tickets / docs |
| **Slack** | Free | R$ 0 | Comunicação interna |
| **Figma** | Professional | $15 USD/user | ~R$ 83 | Design |

**Subtotal Operacional (Lioma IT)**: ~R$ **180/mês**

### 4.3 Subtotal Rateado

| Cenário | Custo Total Lioma IT/mês | Por cliente (1 ativo) | Por cliente (5 ativos) |
|---|---|---|---|
| Mínimo | R$ 1.280 | R$ 1.280 | R$ 256 |
| Médio | R$ 1.800 | R$ 1.800 | R$ 360 |
| Máximo | R$ 2.655 | R$ 2.655 | R$ 531 |

**Atenção**: enquanto Arali é o único cliente, esses custos são **investimento de Lioma IT**, NÃO repassados via contrato. A receita de mensalidade absorve. A partir do 2º cliente, diluição reduz pressão sobre margem.

---

## 5. Resumo Financeiro

### 5.1 Custo Total por Mês — Cliente Arali

| Componente | Mês 1-6 (Fase 1) | Mês 7-12 (Fase 2) | Mês 13-18 (Fase 2 final) |
|---|---|---|---|
| Custos diretos (Arali) | R$ 170 | R$ 285 | R$ 285 |
| Custos rateados Lioma IT (100% no Arali) | R$ 1.800 | R$ 1.800 | R$ 1.800 |
| **TOTAL** | **R$ 1.970** | **R$ 2.085** | **R$ 2.085** |

### 5.2 Receita por Mês — Contrato Arali

| Componente | Mês 1 | Mês 2-6 | Mês 7-12 | Mês 13-18 |
|---|---|---|---|---|
| Diagnóstico / Mensalidade | R$ 2.499 | R$ 997 | R$ 997 | R$ 1.499 |
| Setup parcelado (M7-M9, 3x) | — | — | R$ 5.834 (M7-M9) | — |
| **TOTAL Mensal** | **R$ 2.499** | **R$ 997** | **R$ 6.831** (M7-M9) / R$ 997 (M10-M12) | **R$ 1.499** |

### 5.3 Margem (Receita - Custo)

| Período | Receita | Custo | Margem |
|---|---|---|---|
| M1 | R$ 2.499 | R$ 1.970 | **R$ +529** |
| M2-M6 (5 meses) | R$ 4.985 | R$ 9.850 | **R$ -4.865** ❌ |
| M7-M9 (Setup parcelado, 3 meses) | R$ 20.493 | R$ 6.255 | **R$ +14.238** ✅ |
| M10-M12 (3 meses) | R$ 2.991 | R$ 6.255 | **R$ -3.264** |
| M13-M18 (6 meses) | R$ 8.994 | R$ 12.510 | **R$ -3.516** |
| **TOTAL 18 meses** | **R$ 39.962** | **R$ 36.840** | **R$ +3.122** |

> **Nota crítica**: a margem é positiva mas **estreita** com 1 cliente único absorvendo 100% dos custos rateados Lioma IT (~R$ 1.800/mês). Cada novo cliente Lioma reduz custo rateado por cliente e aumenta margem dramaticamente. **Ponto de equilíbrio confortável**: 3 clientes ativos.

### 5.4 Cenário de Rescisão na Fase 1

Se Arali encerrar no final do M6:

| | Receita Acumulada | Custo Acumulado | Margem |
|---|---|---|---|
| M1-M6 | R$ 7.484 | R$ 11.820 | **R$ -4.336** ❌ |

**Risco do modelo piloto**: Lioma IT investe ~R$ 4-5k em desenvolvimento se cliente desistir. Considerado **investimento estratégico** para validar produto, IP e referência. Mitigado por:
- Direito de replicação para outros clientes (preserva IP)
- Caso de sucesso e referência mesmo com cliente piloto
- Aprendizado de domínio (marcenaria) reutilizável

---

## 6. Gatilhos de Upgrade

Lista de gatilhos que disparam revisão de tier de infraestrutura:

| Gatilho | Métrica de Detecção | Ação |
|---|---|---|
| **Pico de usuários simultâneos > 50** | Vercel Analytics | Migrar para Vercel Pro |
| **DB Supabase > 8GB** | Dashboard Supabase | Considerar particionamento ou Team |
| **Anexos (Storage) > 100GB** | Dashboard Supabase | Migrar para R2/B2 ou upgrade Storage |
| **Erros Sentry > 5k/mês** | Dashboard Sentry | Upgrade Sentry Team |
| **E-mails Resend > 3k/mês** | Dashboard Resend | Upgrade Resend Pro |
| **Conexões Realtime > 250 simultâneas em pico** | Dashboard Supabase | Atenção a otimizações; tier Pro suporta 500 |
| **Bandwidth > 200GB/mês** | Vercel + Supabase | Upgrade ou avaliar caching |
| **Detecção DDoS** | Cloudflare alerts | Ativar Cloudflare Pro temporariamente |

**Política**: gatilho atingido → notificação interna Lioma IT em 24h → análise técnica em 48h → comunicação ao cliente em 5 dias com recomendação.

---

## 7. Política de Revisão

### 7.1 Revisão Trimestral

A cada 3 meses, Lioma IT executa:

1. **Auditoria de faturas** de todos os fornecedores
2. **Métricas de uso real** vs. limite do plano (ratio de uso)
3. **Comparação com previsão** do trimestre anterior
4. **Identificação de oportunidades** de otimização
5. **Relatório ao cliente** com:
   - Tabela atualizada de custos
   - Uso real x previsto
   - Gatilhos atingidos
   - Recomendações para próximo trimestre
6. **Ajuste do modelo** se houver desvios > 15%

### 7.2 Revisão Anual

A cada 12 meses, revisão completa:
- Renegociar planos com fornecedores (volume desconto)
- Avaliar troca de fornecedor (ex: Resend → SendGrid se vantajoso)
- Atualizar projeções para próximo ano
- Comunicação institucional ao cliente

### 7.3 Revisão Pontual

Qualquer estouro de gatilho ou alerta crítico aciona revisão imediata.

---

## 8. Apêndices

### 8.1 Apêndice A — Estimativa de Crescimento (3 anos)

| Métrica | Mês 6 | Ano 1 | Ano 2 | Ano 3 |
|---|---|---|---|---|
| Usuários ativos | 60 | 60 | 70 | 90 |
| Pico simultâneos | 25 | 30 | 35 | 50 |
| Tamanho DB (GB) | 2 | 5 | 12 | 25 |
| Storage (GB) | 5 | 20 | 80 | 200 |
| E-mails/mês | 1k | 2k | 4k | 8k |
| Custo direto/mês (R$) | 170 | 285 | 425 | 750 |

### 8.2 Apêndice B — Fórmula de Custo Total

```
Custo Total Mês = Custo Direto Cliente + (Custo Rateado Lioma / N clientes ativos)

Onde:
  N = número de clientes Lioma ativos no mês
  Custo Rateado Lioma = ~R$ 1.800/mês (média)
```

### 8.3 Apêndice C — Lista de Fornecedores e Suporte

| Fornecedor | Suporte | URL Status |
|---|---|---|
| Vercel | Email + Discord | https://www.vercel-status.com |
| Supabase | Email + Discord | https://status.supabase.com |
| Cloudflare | Email + Painel | https://www.cloudflarestatus.com |
| Sentry | Email | https://status.sentry.io |
| Resend | Email | https://status.resend.com |
| Anthropic | Email | https://status.anthropic.com |

### 8.4 Apêndice D — Cláusula de Repasse

Se custo total exceder o teto contratual de R$ 500/mês definido no contrato com Arali, Lioma IT aciona o cliente para aditivo, com 30 dias de antecedência, com transparência total dos números.

---

## NOTAS INTERNAS LIOMA IT (NÃO ENVIAR AO CLIENTE)

### Alertas e Decisões

- **A margem real do contrato Arali é estreita** (R$ +3.122 em 18 meses) por absorver 100% do custo rateado Lioma. **Crítico** garantir 2º cliente até M9 do contrato Arali, idealmente até M6.
- **Custos rateados Lioma IT são o "investimento em IP"** — tendem a crescer pouco mesmo com novos clientes (Claude Pro, Cursor, etc. cabem várias contas).
- **Maior alavanca de margem**: chegar em 5 clientes ativos. A partir daí, custo rateado/cliente cai pra ~R$ 360 e margem por cliente fica em R$ 500+/mês.

### Otimizações Possíveis no Futuro

- Migrar Supabase Pro → Self-hosted Supabase em VPS para clientes M+ (corta US$ 25/cliente)
- Negociar volume com Anthropic API a partir do 3º cliente
- Implementar gestão automática de gatilhos (script que monitora e alerta no Slack interno)

### Próximos Passos

1. Provisionar Vercel + Supabase para Arali (single-tenant)
2. Configurar billing alerts em todos os fornecedores
3. Setup planilha de controle financeiro (Notion ou Sheets)
4. Primeira revisão trimestral em M3 do contrato

---

**FIM DO MODELO DE CUSTO DE INFRAESTRUTURA**

> Próximos passos: aprovar valores com Marcus, configurar billing alerts, implementar planilha de controle automatizada.
