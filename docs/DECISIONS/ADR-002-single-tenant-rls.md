# ADR-002: Single-Tenant Deployment com Multi-Tenant Ready Code via RLS

- **Status**: Accepted
- **Data**: 2026-04-30
- **Decisor**: Marcus Vitorino (Founder / Tech Lead)
- **Consultados**: —
- **Informados**: Cliente Arali Móveis (Diretoria), futuros clientes Lioma IT
- **Etapa do projeto**: Risca (Mês 1)

---

## Contexto

O Arali Flow é o produto-piloto da LIOMA IT, sendo entregue à **Arali Móveis** como cliente exclusivo (60 usuários, 26 projetos simultâneos). A estratégia de IP é replicar o produto para **outras marcenarias premium** (ver [ADR-005](./ADR-005-ip-lioma-replicacao.md)).

A pergunta é: como modelar isso tecnicamente?

- **Multi-tenant verdadeiro**: uma única base servindo N clientes, com `tenant_id` em toda tabela e RLS por tenant.
- **Single-tenant deployment**: cada cliente tem sua própria instância (Supabase + Vercel), código rodando isolado.

A escolha define arquitetura de dados, custos, complexidade operacional e velocidade de novo onboarding.

## Forças em Tensão

- **Isolamento de dados** (alto requisito em marcenaria premium — clientes finais como MK27, Bernardes não toleram qualquer risco de cross-tenant leakage)
- **Custo por cliente** (single-tenant tem custo fixo por instância)
- **Velocidade de onboarding de novo cliente** (multi-tenant escala melhor)
- **Customização por cliente** (cada marcenaria tem nuances — ferramentas próprias, integrações)
- **Complexidade de RLS multi-tenant** (`tenant_id` em toda policy é sutil de errar)
- **Compliance / LGPD** (auditoria mais simples em single-tenant)
- **Reuso de código entre clientes** (deve ser alto)

## Opções Consideradas

### Opção 1: Multi-tenant verdadeiro (uma instância, N clientes)
- **Como funciona**: 1 Supabase + 1 Vercel + N tenants. `tenant_id` em toda tabela. RLS valida `tenant_id = auth.tenant_id()`.
- **Prós**: economia de escala, deploy único, métricas centralizadas
- **Contras**: erro em RLS = vazamento entre clientes (catastrófico). Customização complica. Backup/restore de 1 cliente é doloroso.
- **Custo**: 1 stack, ~R$300-500/mês total
- **Risco**: alto — vazamento de dados entre marcenarias premium é fim de empresa

### Opção 2: Single-tenant deployment estrito (N stacks isoladas)
- **Como funciona**: cada cliente tem sua Supabase + Vercel. Código idêntico, dados isolados.
- **Prós**: isolamento garantido por infra, customização fácil, backup/restore simples, compliance trivial, paralisação de 1 cliente não afeta outros
- **Contras**: custo por cliente, manutenção de N stacks, deploy múltiplo
- **Custo**: ~R$200-300/mês por cliente
- **Risco**: baixo — pior caso é stack de 1 cliente quebrar, não derrubar todos

### Opção 3: Híbrido — single-tenant com código multi-tenant ready
- **Como funciona**: cada cliente tem sua stack (single-tenant deployment), mas o código é escrito **como se** `tenant_id` fosse implícito. RLS sempre filtra por contexto, helper functions sempre verificam pertencimento. Onboarding de novo cliente = clonar repo, rodar migrations, configurar env.
- **Prós**: isolamento garantido + código preparado para futura migração para multi-tenant verdadeiro caso a economia de escala compense (provavelmente após 10+ clientes)
- **Contras**: pequena disciplina extra ao escrever código (não é barreira real)
- **Custo**: igual à Opção 2
- **Risco**: muito baixo

## Decisão

**Vamos adotar single-tenant deployment (cada cliente Lioma IT tem sua stack isolada Supabase + Vercel) com código escrito assumindo padrões multi-tenant ready (RLS sempre filtrando por contexto, helper functions modulares).**

Detalhamento:
- Cada cliente tem repositório derivado do core (futuro fork ou submodule), com customizações localizadas em `lib/clients/<cliente>/`.
- **RLS é obrigatório em TODAS as tabelas**. Nenhuma tabela pública sem policies.
- Helper functions SQL: `is_diretoria()`, `is_gestor_de_time(time_id)`, `is_lider_de_time(time_id)`, `is_integrante_de_time(time_id)`. Todas leem do JWT + tabelas de pertencimento.
- Variáveis de ambiente carregam: `NEXT_PUBLIC_TENANT_NAME=arali`, `SUPABASE_PROJECT_REF=<unique>`, etc.
- Código nunca assume "1 cliente só". Padronizamos contexto via `getCurrentTenant()` server-side.

## Consequências

### Positivas
- **Isolamento perfeito** entre clientes — risco de vazamento ≈ 0
- **Customização por cliente** simples (branding, ferramentas opcionais)
- **Compliance LGPD** trivial — dados de cada marcenaria em DB próprio
- **Recuperação de desastre** isolada — incidente em 1 cliente não afeta os demais
- **Onboarding** automatizável via script (provisionar Supabase + Vercel + migrations)
- **Replicação Lioma IT** vira processo de fábrica, não aventura artesanal

### Negativas / Riscos Aceitos
- **Custo por cliente fixo** (~R$200-300/mês) — repassado no contrato
- **Manutenção de N stacks**: PRs precisam de processo de propagação para clientes ativos (mitigado com automação CI/CD — Etapa 4)
- **Sem economia de escala em DB** até termos 10+ clientes

### Trade-offs Conscientes
- **Aceitamos** maior custo unitário em troca de zero risco de vazamento
- **Aceitamos** complexidade extra de gestão de N stacks em troca de paralelismo de incidentes
- **Aceitamos** disciplina extra de escrever multi-tenant ready code mesmo com 1 cliente — investimento estratégico

## Métricas de Sucesso

- Cobertura RLS: 100% das tabelas com policy testada
- Zero incidentes de cross-tenant access em auditoria
- Tempo de onboarding de novo cliente Lioma IT < 1 dia (a partir do 2º cliente)
- Custo de infraestrutura por cliente dentro do teto contratual

## Plano de Reversão / Plano B

Se single-tenant virar custo proibitivo (cenário: 20+ clientes Lioma IT):
- **Migração para multi-tenant verdadeiro** já está parcialmente preparada pelo código
- Estimativa de migração: 1-2 meses de trabalho, com cliente migrado por vez (zero downtime)
- Plano B1: manter clientes premium (high-touch) em single-tenant e mover SMB para multi-tenant compartilhado

## Referências

- `docs/SECURITY.md`
- `docs/PERMISSIONS.md`
- `supabase/policies/`
- ADR-005 (Replicação Lioma)
- README.md (Decisão #01, #20)
