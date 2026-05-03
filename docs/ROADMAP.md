# 🗺️ Arali Flow — Roadmap

> Plano de execução do MVP em 4 meses + visão pós-go-live. Cada etapa carrega o nome de uma operação real da marcenaria — porque é assim que se faz uma peça: marca, alinha, encaixa, lapida, enverniza.

---

## 📑 Resumo das 5 Etapas

| # | Etapa | Metáfora | Foco | Prazo | Status | Doc Detalhado |
|---|---|---|---|---|---|---|
| 0 | **RISCA** | A marcação inicial na madeira — define todo corte | Fundação técnica + branding aplicado | Mês 1 | ✅ Concluída (2026-05-02) | [`docs/PHASE_0_RISCA.md`](./PHASE_0_RISCA.md) |
| 1 | **ESQUADRO** | Ferramenta de aferição de 90° — garante o alinhamento | Ambiente Comercial + Ferramenta Recebimentos | Mês 2 | 🟢 Ativa (Semana 1) | [`docs/PHASE_1_ESQUADRO.md`](./PHASE_1_ESQUADRO.md) |
| 2 | **ENCAIXE** | Onde duas peças se conectam com precisão | Ambiente PCP + Timeline paralela + Realtime | Mês 3 | ⏳ Pendente | [`docs/PHASE_2_ENCAIXE.md`](./PHASE_2_ENCAIXE.md) |
| 3 | **LAPIDAÇÃO** | Lixa fina e polimento — entrega visível | Diretoria + KPIs + PWA + Go-Live | Mês 4 | ⏳ Pendente | [`docs/PHASE_3_LAPIDACAO.md`](./PHASE_3_LAPIDACAO.md) |
| 4 | **VERNIZ** | Camada final de proteção e brilho | Engenharia + Suprimentos + Produção + Obra + Portal Arquiteto | Pós-MVP (Mês 5+) | ⏳ Pendente | [`docs/PHASE_4_VERNIZ.md`](./PHASE_4_VERNIZ.md) |

---

## 🎯 Princípios de Execução

1. **Cada etapa entrega valor verificável**: não há "fundação invisível" — Risca já termina com login vivo, shell branded e RLS validado.
2. **Ferramenta Recebimentos é o killer demo**: ela está em Esquadro (Mês 2) e substitui a planilha hoje no centro da operação Comercial. É o gatilho psicológico para o cliente sentir o sistema "valer o investimento".
3. **Pasta do Projeto vive antes de Realtime**: em Esquadro a Pasta funciona com refetch tático. Realtime entra em Encaixe quando há colaboração simultânea de verdade.
4. **Diretoria fecha o MVP**: KPIs e PWA são as últimas peças porque dependem de dados reais já fluindo nas outras etapas.
5. **Verniz não compete com prazo**: tudo que não é vital para o go-live vai para a fase pós-MVP, sem culpa.

---

## ⏳ Cronograma Macro (16 semanas)

```
SEMANA   01  02  03  04  05  06  07  08  09  10  11  12  13  14  15  16
         ─────────────────────────────────────────────────────────────────
RISCA    ████████████████  ✅
ESQUADRO                 ▓▓▓░░░░░░░░░░░░░  ◀ você está aqui (Sem. 1)
ENCAIXE                                  ████████████████
LAPIDAÇÃO                                                ████████████████
                                                                       ↑
                                                                    GO-LIVE
```

> **Convenção**: cada etapa tem 4 semanas de execução, com checkpoint quinzenal com a Arali (8 checkpoints no total).

---

## 📊 Métricas de Sucesso por Etapa

| Etapa | Métrica de Pronto | Como Medir |
|---|---|---|
| Risca | Auth funcional + RLS base + Shell branded | Login → Home → menu lateral renderizado em <2s, em mobile real |
| Esquadro | Ferramenta Recebimentos substitui Excel real | Time Comercial faz 1 dia inteiro sem abrir planilha |
| Encaixe | Timeline paralela viva entre 3 Times | Diretoria abre Pasta e vê 3 barras de progresso atualizando em tempo real |
| Lapidação | Dashboard executivo com 3 KPIs reais | Dono Comercial recebe link e abre 3x na primeira semana sem precisar de explicação |
| Verniz | Pelo menos 1 ambiente novo em produção | Engenharia ou Produção começa a usar sem migração de dados manual |

---

## 🚦 Critérios de Decisão de Corte

Se em qualquer etapa o tempo apertar, **corta na seguinte ordem** (do menos crítico para o mais crítico):

1. ❌ Posts automáticos vindos de Tasks → empurra para Verniz
2. ❌ Forward de Post N:N → simplifica para "compartilhar como cópia" no MVP
3. ❌ Audit log completo → reduzir para 5 eventos críticos
4. ❌ KPIs avançados Diretoria → reduzir para 3 cards
5. ❌ PWA offline → manter só PWA install, offline vai para Verniz
6. ✅ **Nunca cortar**: Auth, RLS, Pasta do Projeto, Tasks, Ferramenta Recebimentos

---

## 📍 Próximos Passos Imediatos (Semana 01 da ESQUADRO — em curso)

**Pré-requisitos já satisfeitos**:
- ✅ Migration `0002_comercial.sql` aplicada (8 tabelas, 6 enums, RLS completo)
- ✅ `types/database.ts` regenerado a partir do schema real
- ✅ Packages `react-hook-form` + `@hookform/resolvers` + `date-fns` já instalados
- ✅ Componentes UI base (`button`, `card`, `input`, `label`, `checkbox`) operacionais

**Foco da Semana 1**: padrão arquitetural de Server Actions + telas de Clientes e Parceiros (entidades-padrão do Comercial, base para Propostas e Recebimentos).

1. Normalizar caminho de Server Actions em `server/actions/<dominio>/` (corrigir resíduo `app/server/actions/auth/entrar-com-senha.ts` vazio)
2. Criar `lib/validations/clientes.ts` e `lib/validations/parceiros.ts` (Zod schemas com tipagem do banco)
3. Implementar `server/actions/clientes/{criar,editar,arquivar}.ts` + `server/queries/clientes/listar.ts`
4. Implementar `server/actions/parceiros/{criar,editar,arquivar}.ts` + `server/queries/parceiros/listar.ts`
5. Página `/ambientes/comercial/clientes` com tabela + busca + Drawer RHF
6. Página `/ambientes/comercial/parceiros` com tabs por `tipo_parceiro` + Drawer RHF
7. Padrão `ActionResult<T>` documentado em `lib/types/action-result.ts` e `docs/CONTRIBUTING.md`
8. Push em branch `feature/esquadro-clientes-parceiros`

> O detalhamento por dia, arquivos e critérios de pronto está em [`PHASE_1_ESQUADRO.md`](./PHASE_1_ESQUADRO.md).

---

**Versão**: 1.1
**Última atualização**: 2026-05-02
**Autor**: Marcus Vitorino + Copiloto IA
