# 🏛️ Architecture Decision Records (ADRs) — Arali Flow

> Toda decisão técnica e arquitetural relevante do Arali Flow é registrada como um ADR neste diretório. ADRs são imutáveis: uma vez aceitas, não são editadas — são **substituídas** ou **deprecadas** por uma nova ADR que referencia a anterior.

---

## Por que ADRs?

1. **Memória de longo prazo**: o "porquê" de cada decisão sobrevive à rotatividade de pessoas e à passagem do tempo.
2. **Onboarding rápido**: novo dev (ou IA assistida) lê os ADRs e entende o contexto sem reuniões.
3. **Evita re-litigar decisões**: discussão fica registrada com prós, contras e contexto.
4. **Facilita auditoria**: cliente, investidor ou auditor consegue rastrear escolhas técnicas.

---

## Status possíveis

| Status | Significado |
|---|---|
| `Proposed` | ADR em discussão, ainda não aceita |
| `Accepted` | Decisão tomada e em vigor |
| `Deprecated` | Decisão antiga, ainda em vigor mas em transição para outra |
| `Superseded by ADR-NNN` | Substituída — referência aponta para a nova decisão |

---

## Índice de ADRs

### Críticas (escritas em detalhe)

| ID | Título | Status | Data | Decisor |
|---|---|---|---|---|
| [ADR-001](./ADR-001-stack-frontend.md) | Stack Frontend: Next.js 15 LTS como runtime fixo, geração inicial sob avaliação | Accepted | 2026-04-30 | Marcus Vitorino |
| [ADR-002](./ADR-002-single-tenant-rls.md) | Single-Tenant Deployment com Multi-Tenant Ready Code via RLS | Accepted | 2026-04-30 | Marcus Vitorino |
| [ADR-003](./ADR-003-paralelismo-pasta-projeto.md) | Paralelismo entre Times com Sistema de Revisão (sem voltar etapas) | Accepted | 2026-04-30 | Marcus Vitorino |
| [ADR-004](./ADR-004-realtime-seletivo.md) | Realtime Seletivo: apenas em Feed, Timeline, Tasks, Notificações e RBAC | Accepted | 2026-04-30 | Marcus Vitorino |
| [ADR-005](./ADR-005-ip-lioma-replicacao.md) | IP do Produto pertence à Lioma IT — Replicação para Marcenarias Premium | Accepted | 2026-04-30 | Marcus Vitorino |

### Pendentes de redação detalhada (ticket aberto)

Decisões já fechadas e listadas no README principal mas ainda sem ADR detalhado. Devem ser convertidas em ADR conforme tempo permitir ou quando alguém as questionar:

| Origem | Tema | Prioridade ADR |
|---|---|---|
| Decisão #02 | Sem módulo Fiscal/Contábil no MVP | Baixa |
| Decisão #04 | Stack backend: Supabase | Média |
| Decisão #05 | Hosting Vercel + Supabase | Baixa |
| Decisão #06 | MVP escopo: 3 ambientes (não 7) | Média |
| Decisão #07 | Idioma 100% PT-BR | Baixa |
| Decisão #09 | Tasks como unidade de trabalho | Média |
| Decisão #10 | Forward de Post N:N (não duplicado) | Alta |
| Decisão #12 | PWA desde o MVP | Baixa |
| Decisão #13 | Cliente final e fornecedores não acessam (MVP) | Média |
| Decisão #14 | Portal do Arquiteto roadmap futuro | Baixa |
| Decisão #15 | Branding Luxo Discreto | Baixa (já em BRANDING.md) |
| Decisão #16 | Time: 10 Integrantes + 2 Líderes + 2 Gestores | Média |
| Decisão #17 | Teto infraestrutura R$500/mês | Baixa (em contrato) |
| Decisão #18 | Prazo go-live MVP: 4 meses | Baixa |
| Decisão #19 | Escala MVP: 60 usuários, 26 projetos | Baixa |

---

## Como criar uma nova ADR

1. Copie [`TEMPLATE.md`](./TEMPLATE.md) para `ADR-NNN-titulo-em-kebab-case.md` (use o próximo número disponível).
2. Preencha todas as seções. Não pule "Consequências".
3. Inicie com status `Proposed`.
4. Discuta no PR até ter consenso.
5. Mude status para `Accepted` no merge.
6. Atualize este README (índice) com a nova ADR.

## Como deprecar / substituir uma ADR

- Para **deprecar**: mude status para `Deprecated` e adicione nota explicando o porquê.
- Para **substituir**: crie nova ADR que referencia a antiga; na ADR antiga, mude status para `Superseded by ADR-NNN` com link.
- **Nunca edite o conteúdo histórico** de uma ADR aceita — preserve o registro.

---

## Convenções

- **Nome do arquivo**: `ADR-NNN-titulo-em-kebab-case.md` (3 dígitos com zeros à esquerda)
- **Numeração**: sequencial, sem reuso de números
- **Formato**: Markdown padrão
- **Idioma**: PT-BR para conteúdo, EN apenas em termos técnicos consagrados (e.g. "single-tenant", "RLS")
- **Tamanho**: 1 a 3 páginas. Se passar disso, provavelmente está misturando 2 decisões — divida.
