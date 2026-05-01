# ADR-005: IP do Produto pertence à LIOMA IT — Replicação para Marcenarias Premium

- **Status**: Accepted
- **Data**: 2026-04-30
- **Decisor**: Marcus Vitorino (Founder / CEO LIOMA IT)
- **Consultados**: Cliente Arali Móveis (alinhamento contratual)
- **Informados**: Diretoria Arali, área comercial Lioma, futuros clientes Lioma IT
- **Etapa do projeto**: Risca (Mês 1) — fundamental antes de qualquer linha de código

---

## Contexto

O Arali Flow nasce como produto-piloto entregue à **Arali Móveis** sob contrato com a **LIOMA IT** (Marcus Vitorino — Founder). A pergunta crítica antes de escrever qualquer linha de código é:

> **Quem é dono do código, do produto, da propriedade intelectual?**

A resposta define:
- Como o produto é arquitetado (single-tenant replicável vs. customizado-para-Arali)
- O que vai no contrato com a Arali
- Como precificar futuros clientes Lioma IT
- Estratégia de longo prazo da LIOMA IT (consultoria → produto)

## Forças em Tensão

- **Cliente paga pelo desenvolvimento** — natural ele esperar exclusividade
- **Marcenarias premium são poucas** (mercado restrito) — exclusividade limita escala
- **Custo do produto** — alto demais para um único cliente amortizar
- **Modelo de negócio LIOMA IT** — visa ser produto, não consultoria de uma agência
- **Aderência ao mercado** — outras marcenarias premium têm dores semelhantes (validado em conversas)
- **Risco competitivo** — se Arali não tiver vantagem, perde valor pra ela

## Opções Consideradas

### Opção 1: Cliente é dono do código, exclusividade total
- **Como funciona**: Arali compra o software, código é dela
- **Prós**: Arali fica feliz, percepção premium do contrato
- **Contras**: LIOMA IT não pode replicar, escalabilidade do negócio = zero, custo alto não amortiza
- **Risco**: alto — modelo de consultoria, não de produto

### Opção 2: Cliente paga uso, código é da LIOMA IT
- **Como funciona**: Arali assina contrato de uso (tipo SaaS) com setup inicial. Código + IP é da LIOMA. LIOMA pode replicar para outros clientes.
- **Prós**: modelo de produto verdadeiro, escalabilidade, custo amortiza, LIOMA cresce como ativo
- **Contras**: precisa explicar à Arali (mas é prática padrão de SaaS, não é estranho)
- **Risco**: baixo — se contratualmente claro, Arali entende

### Opção 3: Modelo híbrido com exclusividade vertical (Arali tem exclusividade na sua nicho específico)
- **Como funciona**: Arali tem exclusividade em "marcenaria premium em São Paulo capital atendendo arquitetos de renome", LIOMA pode atender outras geografias/perfis
- **Prós**: Arali sente exclusividade
- **Contras**: definir o nicho com precisão é complexo e gera disputa
- **Risco**: médio

## Decisão

**O IP completo do Arali Flow pertence à LIOMA IT. O contrato com a Arali Móveis é um contrato de uso (SaaS-like) com setup inicial e mensalidade. A LIOMA IT pode replicar o produto para outras marcenarias premium em modelo single-tenant deployment, sempre customizando branding e ferramentas conforme cliente.**

Detalhamento:

1. **Repositório principal** (`arali-flow`) é o **core** mantido pela LIOMA IT.
2. **Cada cliente** tem sua própria stack (single-tenant, ver [ADR-002](./ADR-002-single-tenant-rls.md)) com customização localizada em `lib/clients/<cliente>/`.
3. **Arali Móveis** é o **cliente piloto** — recebe atendimento premium e vantagem de ser primeiro (preço de entrada, prioridade em features novas, desconto sentimental no setup).
4. **Contrato** com Arali é claro: "uso, não posse". Detalhado em `MODELO_CONTRATO_LIOMA_IT.md`.
5. **Branding `Arali Flow`** é específico da Arali. Outros clientes terão branding próprio gerado a partir do mesmo core (`<Cliente> Flow`).
6. **Replicação** (Etapa 4 — Verniz e adiante) é processo de fábrica: clonar core, customizar branding e ferramentas opcionais, provisionar stack, treinar.

## Consequências

### Positivas
- **LIOMA IT vira produto**, não agência — modelo escalável
- **Custo do desenvolvimento amortiza** ao longo de N clientes
- **Replicação rápida** após o 2º cliente (processo, não aventura)
- **Vantagem competitiva no mercado de marcenaria premium** — LIOMA vira fornecedora padrão
- **IP cresce com cada cliente** (biblioteca de Ferramentas, prompts, padrões)

### Negativas / Riscos Aceitos
- **Conversa com Arali** precisa deixar isso claro contratualmente (já incluído no modelo)
- **Risco de Arali resistir** se entender exclusividade — mitigado por preço de entrada justo, prioridade em features e relacionamento direto

### Trade-offs Conscientes
- **Aceitamos** explicar ao cliente o modelo SaaS-like em vez de "agência criando software para você"
- **Aceitamos** que cada cliente novo precisará customização — investimento em automação de provisioning desde o MVP

## Métricas de Sucesso

- Mês 12: contrato Arali firmado e em vigor com cláusulas de IP claras
- Mês 18: ≥ 1 cliente Lioma IT adicional contratado
- Mês 24: ≥ 3 clientes Lioma IT em operação simultânea
- Tempo de onboarding de novo cliente após o 2º ≤ 7 dias úteis
- Receita recorrente Lioma IT > custo de manutenção de N stacks

## Plano de Reversão / Plano B

Se o modelo de produto não decolar (cenário improvável):
- **Plano B**: vender IP para a Arali Móveis (preço alto pelo retrabalho de exclusividade) e LIOMA IT pivota para outro produto
- Custo de reverter ≈ negociar com Arali para comprar IP (alta esquina)

## Referências

- README.md (Decisão #20)
- `MODELO_CONTRATO_LIOMA_IT.md` (área comercial Lioma)
- ADR-002 (Single-tenant + RLS) — base técnica para replicação
- LIOMA IT business model
