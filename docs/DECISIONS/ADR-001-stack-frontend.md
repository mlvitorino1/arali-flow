# ADR-001: Stack Frontend — Next.js 15 LTS como Runtime Fixo, Geração Inicial sob Avaliação

- **Status**: Accepted
- **Data**: 2026-04-30
- **Decisor**: Marcus Vitorino (Founder / Tech Lead)
- **Consultados**: —
- **Informados**: Cliente Arali Móveis (Diretoria), futuros devs Lioma IT
- **Etapa do projeto**: Risca (Mês 1)

---

## Contexto

O Arali Flow é um PWA single-tenant para 60 usuários, com hierarquia de papéis (Diretoria, Gestor, Líder, Integrante), Pasta do Projeto com timeline paralela e Realtime cirúrgico. O cliente é uma marcenaria de altíssimo padrão e o produto será replicado para outras marcenarias premium pela LIOMA IT (ver [ADR-005](./ADR-005-ip-lioma-replicacao.md)).

Tentativa anterior de migração de UI usando **Lovable** apresentou atrito significativo: limitações em customização avançada, dificuldade em integrar Server Components do Next.js, padrões de código gerados que não escalavam para o domínio de marcenaria.

Marcus está avaliando alternativas para a **fase de geração inicial de UI** (scaffold), mantendo o **runtime de produção** estável. As ferramentas em consideração são:

- **Claude Suite / Claude Code** (Anthropic)
- **Cursor** (IDE com agente)
- **v0 by Vercel** (geração de UI baseada em React + shadcn)
- **Antigravity** (Google) — agente de codificação
- **Bubble** (low-code) — descartado para a base, possível para protótipos

A decisão precisa ser tomada agora porque a Etapa 1 (Esquadro) começa logo após a fundação Risca e requer geração massiva de telas (Pasta do Projeto, Tasks, Ferramenta Recebimentos).

## Forças em Tensão

- **Velocidade de scaffold** — solo dev em 4 meses precisa de aceleração via IA
- **Qualidade do código gerado** — código gerado mal estruturado vira dívida técnica em semanas
- **Estabilidade do runtime** — Next.js 15 já está validado tecnicamente, não pode ser reaberto
- **Compatibilidade com Server Components / Server Actions / RSC cache** — qualquer ferramenta deve gerar código compatível
- **Compatibilidade com Tailwind + Shadcn UI + RLS Supabase** — stack completa precisa fluir
- **Custo da assinatura** — múltiplas ferramentas pagas vs. uma escolhida
- **Curva de aprendizado** — Marcus já domina Claude Code e está familiar com Cursor

## Opções Consideradas

### Opção 1: Manter Lovable como gerador, refinar manualmente
- **Como funciona**: usar Lovable para scaffold, devolver pra IDE local pra refinar
- **Prós**: já testado
- **Contras**: atrito documentado em padrões de código, pouca flexibilidade em RSC, custo recorrente
- **Custo**: Lovable Pro
- **Risco**: alto — replica problema já visto

### Opção 2: Claude Code (Anthropic) como gerador principal
- **Como funciona**: Marcus usa Claude Code via terminal, alimentado com contexto de `docs/ai/CLAUDE.md`, `docs/DOMAIN_MODEL.md`, `docs/STYLE_GUIDE.md`. Gera componentes, Server Actions, telas inteiras.
- **Prós**: gera código aderente a padrões customizáveis, lê o repositório inteiro, integra com git, suporta planejamento por agente, Marcus já domina
- **Contras**: requer prompt mestre bem versionado para resultados consistentes
- **Custo**: assinatura Claude Pro/Max + API
- **Risco**: baixo — depende da qualidade do prompt e do contexto fornecido

### Opção 3: v0 by Vercel
- **Como funciona**: gerar telas isoladas (componentes Shadcn) via prompt, importar
- **Prós**: alta qualidade visual, integração nativa com Shadcn UI e Next.js
- **Contras**: gera apenas componentes UI — não Server Actions, não RLS, não lógica de domínio. Boa pra "casca", fraco pra "miolo"
- **Custo**: incluso na conta Vercel
- **Risco**: médio — pode virar muleta visual e mascarar problemas de domínio

### Opção 4: Cursor IDE
- **Como funciona**: IDE com agente integrado, completa enquanto codifica
- **Prós**: ótimo fluxo de edição contínua, autocomplete cross-file
- **Contras**: menos forte em geração de telas inteiras com regras de RLS/RBAC complexas
- **Custo**: Cursor Pro
- **Risco**: baixo — bom complemento, fraco como gerador principal

### Opção 5: Antigravity (Google)
- **Como funciona**: agente de codificação multi-passo
- **Prós**: emergente, possivelmente forte
- **Contras**: ferramenta nova, ecossistema menor, integração com Next.js menos madura
- **Custo**: a definir
- **Risco**: alto — apostar em ferramenta verde para projeto crítico

### Opção 6: Bubble (low-code)
- **Como funciona**: aplicação inteira em low-code
- **Prós**: rápido para protótipos
- **Contras**: incompatível com runtime fixo Next.js + Supabase RLS. Não faz Server Components. Vendor lock-in pesado.
- **Custo**: caro a longo prazo
- **Risco**: muito alto — descartado

## Decisão

**Vamos manter Next.js 15 LTS como runtime fixo de produção (decisão imutável até a Etapa 4) e adotar Claude Code como gerador principal de UI e código, complementado por v0 por Vercel para geração visual de componentes Shadcn isolados quando útil. Cursor pode ser usado como editor pessoal de Marcus, mas não é mandatório.**

Em prosa: o stack de produção não muda. O processo de geração assistida por IA passa a ser:

1. **Claude Code** lê o repositório inteiro alimentado com:
   - `docs/ai/CLAUDE.md` (contexto principal)
   - `docs/DOMAIN_MODEL.md`
   - `docs/PERMISSIONS.md`
   - `docs/STYLE_GUIDE.md`
   - `docs/ai/PROMPT_FRONTEND_SYSTEM_DESIGN.md` (prompt mestre)
2. Gera **telas completas** com Server Components, Server Actions, validação Zod, integração Supabase, RLS-aware.
3. **v0 by Vercel** é usado pontualmente para gerar componentes UI isolados (modais elaborados, animações Framer Motion complexas) que depois são integrados manualmente.
4. **Code review** humano (Marcus) é obrigatório antes de merge — IA acelera, não substitui.

Detalhamento:
- O **Prompt Mestre** vive em `docs/ai/PROMPT_FRONTEND_SYSTEM_DESIGN.md` e é versionado.
- Toda nova feature começa com um documento curto (`docs/specs/<feature>.md`) que vira anexo no prompt.
- Padrões de código gerados são auditados via revisão e ajustes ao prompt mestre, não corrigidos manualmente todo PR.

## Consequências

### Positivas
- Velocidade de geração 5-10x maior que codar manual
- Padrões consistentes garantidos pelo Prompt Mestre
- Cliente recebe MVP em 4 meses como prometido
- IP da Lioma IT cresce com biblioteca de prompts reutilizável

### Negativas / Riscos Aceitos
- Dependência de assinaturas Claude/v0 (custo operacional contínuo)
- Curva inicial: 1-2 semanas para tunar o Prompt Mestre
- Risco de gerar código que parece bom mas viola sutilmente RLS — mitigado por testes E2E críticos

### Trade-offs Conscientes
- **Aceitamos** maior custo de assinaturas IA em troca de velocidade e qualidade
- **Aceitamos** que ainda haverá refino manual em ~20% do código gerado
- **Aceitamos** que o Prompt Mestre é um ativo crítico (versionar, revisar como código)

## Métricas de Sucesso

- Mês 1 (Risca): scaffolding inicial com auth + shell em ≤ 2 semanas
- Mês 2 (Esquadro): Pasta do Projeto + Tasks + Ferramenta Recebimentos em ≤ 4 semanas
- Mês 3 (Encaixe): Realtime + PCP em ≤ 4 semanas
- % de PRs aprovados sem reescrita pesada > 80%
- Cobertura de testes E2E em fluxos críticos (auth, RLS, distribuição) ≥ 80%

## Plano de Reversão / Plano B

Se Claude Code falhar como gerador principal:
- **Plano B1**: voltar para geração 100% manual (perde velocidade, mantém qualidade)
- **Plano B2**: testar Cursor como gerador principal (médio risco)
- **Plano B3**: se Bubble/low-code virar realista (improvável), seria reescrita completa — só após Verniz

Custo de reverter para B1 estimado em +30% no cronograma. Custo de reverter para B3 = projeto reiniciado.

## Referências

- README.md raiz (item 03 da tabela de Decisões Arquiteturais)
- `docs/ai/PROMPT_FRONTEND_SYSTEM_DESIGN.md`
- `docs/STYLE_GUIDE.md`
- ADR-002 (RLS) — código gerado precisa respeitar policies
- ADR-005 (IP Lioma) — Prompt Mestre é ativo Lioma replicável
