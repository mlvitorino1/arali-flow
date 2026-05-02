# ADR-003: Paralelismo entre Times com Sistema de Revisão (sem voltar etapas)

- **Status**: Accepted
- **Data**: 2026-04-30
- **Decisor**: Marcus Vitorino (Founder / Tech Lead)
- **Consultados**: Cliente Arali Móveis (alinhamento operacional)
- **Informados**: Times de Comercial, PCP, Engenharia, Produção, Obra
- **Etapa do projeto**: Risca → Esquadro → Encaixe (transversal)

---

## Contexto

A Arali Móveis opera múltiplos times (Comercial, PCP, Engenharia, Suprimentos, Produção, Obra) que historicamente trabalham em **etapas sequenciais** documentadas com sufixos OS (R, E, CD, OP). Essa sequência é mental, não sistêmica, e gera retrabalho — quando um time descobre erro de etapa anterior, "volta" o fluxo manualmente.

A pergunta fundamental: o sistema deve modelar **etapas sequenciais bloqueantes** ou **frentes paralelas**?

## Forças em Tensão

- **Aderência ao processo real** — times realmente trabalham em frentes sobrepostas (Engenharia detalha enquanto Comercial fecha)
- **Rastreabilidade** — sistema precisa registrar quem fez o quê, quando
- **Velocidade do projeto** — bloquear time A esperando time B termina em zero produtividade
- **Tratamento de erros que vêm de etapas anteriores** — caso real e frequente
- **Complexidade da máquina de estados** — etapas com loops são fonte de bugs
- **UX para o operador** — não pode parecer "uma planilha digital" — precisa ser fluxo humano

## Opções Consideradas

### Opção 1: Etapas Sequenciais Bloqueantes (modelo "tradicional")
- **Como funciona**: Projeto passa por estados `comercial → pcp → engenharia → producao → obra`, cada um bloqueando o próximo. "Voltar" = mudar status do projeto retroativamente.
- **Prós**: simples de visualizar
- **Contras**: não reflete realidade da Arali (times realmente trabalham em paralelo). Loops retroativos geram máquina de estados complicada e cíclica. Bloqueia velocidade.
- **Risco**: alto — sistema descolado da realidade vira shelfware

### Opção 2: Paralelismo Total (sem ordem)
- **Como funciona**: cada Time tem sua frente independente, ordem é cultural não sistêmica
- **Prós**: máxima velocidade, reflete realidade
- **Contras**: não trata o caso "Engenharia detectou erro do Comercial" — não há mecanismo
- **Risco**: médio — abre espaço para erros silenciados

### Opção 3: Paralelismo com Sistema de Revisão Explícita
- **Como funciona**: cada Time tem frente paralela. Quando um Time detecta erro vindo de outro, **cria nova Task tipo `revisao` atribuída ao Time responsável original**, com link para a task que detectou o problema. A Pasta do Projeto sinaliza visualmente "revisão pendente". O fluxo principal não retrocede — apenas registra a revisão como nova task lateral.
- **Prós**: paralelismo mantido, rastreabilidade total, sem máquina de estados cíclica, métrica de qualidade emerge naturalmente (quantas revisões cada Time gera/recebe)
- **Contras**: requer cultura de "criar revisão" em vez de "voltar etapa" — mudança de mindset
- **Risco**: baixo — mudança cultural pequena, ganho enorme em arquitetura

## Decisão

**Vamos adotar paralelismo entre Times na Pasta do Projeto, sem etapas sequenciais bloqueantes. Erros detectados em trabalho de outro Time geram Tasks tipo `revisao` ao Time responsável, mantendo histórico linear e auditável.**

Detalhamento:

1. **Pasta do Projeto** é o container; cada Time participante tem sua **frente** (conjunto de Tasks).
2. **% de progresso por Time** = `tasks_concluidas / tasks_totais` daquele Time naquela Pasta.
3. **Nenhum status do Projeto bloqueia outro Time**. Times podem iniciar quando o Líder/Gestor adicionar o Time à Pasta.
4. **Quando um Time detecta erro de outro**:
   - Botão "Solicitar Revisão" na task em questão
   - Cria task com `tipo: revisao`, `time_responsavel_id: <Time original>`, `task_origem_id: <task que detectou>`, `motivo: <texto>`
   - Pasta do Projeto recebe alerta visual (`em_revisao` flag)
   - Time original recebe notificação realtime
   - Task que detectou pode ficar `bloqueada` ou continuar (a critério do owner)
5. **Visualização da saúde** da Pasta:
   - 🟢 0 revisões pendentes
   - 🟡 1-2 revisões
   - 🔴 3+ ou revisão P0 sem atendimento em 48h
6. **Status da Pasta do Projeto** (não dos times):
   - `draft` → criada, sem times atribuídos
   - `ativa` → ≥ 1 Time com tasks
   - `em_revisao` → tem revisão pendente (visual flag)
   - `concluida` → todos os Times marcaram suas frentes como concluídas + aprovação Gestor/Diretoria
   - `arquivada` → fechada, read-only

## Consequências

### Positivas
- Velocidade real do projeto (paralelismo verdadeiro)
- Histórico linear e auditável
- Métricas de qualidade emergem (revisões por Time = sinal de qualidade do output)
- UX clara — usuário vê sua frente, não se preocupa com fluxo macro
- Diretoria vê macro via Timeline Paralela com % por Time

### Negativas / Riscos Aceitos
- **Mudança cultural**: equipe precisa aprender "Solicitar Revisão" em vez de "voltar"
- **Treinamento necessário** na fase de go-live
- **Possível resistência inicial** de times acostumados ao fluxo sequencial

### Trade-offs Conscientes
- **Aceitamos** mudança cultural em troca de arquitetura simples e correta
- **Aceitamos** que casos extremos (revisão dentro de revisão) precisam de regra clara — definida no Domain Model

## Métricas de Sucesso

- Mês 6 (go-live + 2): ≥ 80% das revisões registradas via sistema (não WhatsApp)
- Mês 6: tempo médio de resolução de revisão ≤ 48h
- Mês 12: redução de 30% em retrabalho não documentado
- Pesquisa de satisfação dos Times ≥ 4/5 sobre clareza do fluxo

## Plano de Reversão / Plano B

Se a equipe rejeitar paralelismo + revisão:
- **Plano B**: introduzir conceito de "Marco do Projeto" — marcos opcionais que Times podem aguardar (ex: "Aguardando aprovação do projeto técnico"). Marcos não bloqueiam tasks, apenas sinalizam.
- Reversão para etapas sequenciais é tecnicamente possível mas indesejável — requer reescrita do modelo de Pasta + Timeline.

## Referências

- README.md (Decisões #08, #09)
- `docs/DOMAIN_MODEL.md` — máquina de estados de Task e Pasta
- `docs/PERMISSIONS.md` — quem pode solicitar revisão
- ADR-004 (Realtime) — eventos da Pasta dependem de paralelismo
