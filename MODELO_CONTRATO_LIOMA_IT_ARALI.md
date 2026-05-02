# MODELO DE CONTRATO — LIOMA IT × ARALI MÓVEIS

> **Documento operacional do departamento Lioma IT — Comercial**
> Modelo personalizado para o cliente Arali Móveis. Após aprovação, migrar para o repositório de contratos da Lioma IT (não versionar dados financeiros e de cliente no repositório técnico do produto).
>
> **Versão**: 1.0
> **Data de elaboração**: 2026-05-01
> **Autor**: Marcus Vitorino (Founder Lioma IT)
> **Status**: Modelo para revisão jurídica antes de envio ao cliente

---

## SUMÁRIO

1. Identificação das Partes
2. Objeto do Contrato
3. Estrutura Comercial em 2 Fases
4. Tabela de Pagamentos
5. Marcos de Entrega e Aprovação
6. Suporte e SLA
7. Mudanças de Escopo
8. Propriedade Intelectual
9. Confidencialidade e Proteção de Dados
10. Vigência, Rescisão e Renovação
11. Reajustes e Multas
12. Foro e Disposições Finais

---

## 1. IDENTIFICAÇÃO DAS PARTES

**CONTRATADA**:
LIOMA IT — software house B2B
[Razão social, CNPJ, endereço — preencher área comercial]
Representada por: Marcus Vitorino (Founder)

**CONTRATANTE**:
ARALI MÓVEIS — marcenaria de altíssimo padrão
[Razão social, CNPJ, endereço — preencher área comercial]
Representada por: [Nome do sócio responsável]

---

## 2. OBJETO DO CONTRATO

A CONTRATADA se compromete a desenvolver, implantar e manter o sistema **Arali Flow** — sistema operacional digital interno da Arali Móveis, conforme escopo detalhado no Anexo I (Especificação Técnica do MVP, baseada no `README.md` e `docs/ROADMAP.md`).

O sistema é entregue em modelo **single-tenant deployment**, com infraestrutura provisionada exclusivamente para a CONTRATANTE, sob coordenação técnica da CONTRATADA.

A propriedade intelectual do produto é da LIOMA IT, conforme cláusula 8 deste contrato. A CONTRATANTE recebe **direito de uso exclusivo** durante a vigência, com prioridade em features e desconto sentimental por ser cliente piloto (ver cláusula 4).

---

## 3. ESTRUTURA COMERCIAL EM 2 FASES

### FASE 1 — PILOTO (6 meses)

**Mês 1**: Diagnóstico aprofundado da operação Arali (Comercial, PCP, Diretoria), levantamento de requisitos, alinhamento de escopo do MVP, ADRs documentadas.

**Meses 2 a 6**: Desenvolvimento e treinamento.
- **Mês 4**: entrega do **MVP funcional** com Comercial + Diretoria + PCP rodando em ambiente de homologação.
- **Mês 6**: produto principal **implantado em produção e treinado com sucesso** com os 60 usuários da CONTRATANTE.

Ao final do **Mês 6**, a CONTRATANTE tem **2 caminhos**:

**(a) APROVAÇÃO** — assinar a continuidade da Fase 2, paga setup de R$ 17.501,00 (vinte mil reais menos os R$ 2.499,00 já abatidos do Diagnóstico), e segue com mensalidades conforme tabela.

**(b) ENCERRAMENTO** — decide não prosseguir, contrato encerra. Valores pagos durante a Fase 1 **NÃO são reembolsáveis**, conforme natureza de serviços prestados (diagnóstico e desenvolvimento já executados).

### FASE 2 — PRODUÇÃO (12 meses)

Mediante aprovação ao final do Mês 6, a CONTRATANTE entra na fase de produção plena com mensalidade ajustada e suporte ativo. Subdividida em:
- **Meses 7 a 12**: mensalidade R$ 997,00 (mantida)
- **Meses 13 a 18**: mensalidade R$ 1.499,00 (reajuste contratual)

---

## 4. TABELA DE PAGAMENTOS

| Mês | Item | Valor (R$) | Descrição |
|---|---|---|---|
| **M1** | Diagnóstico | **2.499,00** | Pagamento à vista no início. Abatido do Setup se cliente aprovar Fase 2. |
| **M2** | Mensalidade Fase 1 | 997,00 | Acompanhamento e desenvolvimento |
| **M3** | Mensalidade Fase 1 | 997,00 | Idem |
| **M4** | Mensalidade Fase 1 | 997,00 | **Marco**: Entrega do MVP funcional |
| **M5** | Mensalidade Fase 1 | 997,00 | Treinamento e refinamento |
| **M6** | Mensalidade Fase 1 | 997,00 | **Marco**: Produto implantado e treinado |
| **— FIM FASE 1 —** | | | **Decisão**: Aprovar Fase 2 ou encerrar |
| **M7** | Setup (à vista ou parcelado) | **17.501,00** | A pagar no Mês 7 — opção à vista ou em até **3 parcelas iguais de R$ 5.833,67** (M7-M9) |
| **M7** | Mensalidade Fase 2 | 997,00 | |
| **M8** | Mensalidade Fase 2 | 997,00 | |
| ... | ... | ... | |
| **M12** | Mensalidade Fase 2 | 997,00 | |
| **M13** | Mensalidade Fase 2 — reajuste | **1.499,00** | |
| **M14** | Mensalidade Fase 2 | 1.499,00 | |
| ... | ... | ... | |
| **M18** | Mensalidade Fase 2 | 1.499,00 | **Fim do contrato base** — opção de renovação |

### Resumo Financeiro

**Cenário A — Cliente encerra ao final da Fase 1:**
- Total pago: R$ 2.499 + 5 × R$ 997 = **R$ 7.484,00**
- Tempo de relacionamento: 6 meses
- Valores não reembolsáveis (serviços prestados)

**Cenário B — Cliente aprova e completa 18 meses:**
- Total pago: R$ 7.484 (Fase 1) + R$ 17.501 (Setup) + 6 × R$ 997 (M7-M12) + 6 × R$ 1.499 (M13-M18) = **R$ 7.484 + R$ 17.501 + R$ 5.982 + R$ 8.994 = R$ 39.961,00**
- Tempo de relacionamento: 18 meses
- LTV mínimo do contrato: **R$ 39.961**
- Eventual renovação após M18 segue tabela vigente Lioma IT à época

### Forma de Pagamento

- **Diagnóstico (M1)**: à vista, no início da prestação de serviços, via PIX, transferência ou boleto.
- **Mensalidades**: cobradas no dia 5 de cada mês, via boleto bancário ou PIX, com vencimento no dia 10.
- **Setup (M7)**: à escolha da CONTRATANTE, à vista ou em até 3 parcelas iguais (M7, M8 e M9), boletada junto com a mensalidade.
- **Atraso**: incidência de multa de 2% + juros de 1% ao mês sobre valor em atraso.

---

## 5. MARCOS DE ENTREGA E APROVAÇÃO

| Marco | Mês | Critério de Aceite | Forma |
|---|---|---|---|
| **M0 — Diagnóstico Aprovado** | M1 | Documento de Diagnóstico entregue, ADRs e roadmap alinhados, cliente confirma escopo do MVP | E-mail formal + assinatura digital |
| **M1 — Auth + Permissões + Shell** | M1.5 | Usuários conseguem fazer login, ver shell branded, hierarquia de permissões aplicada | Demonstração ao vivo |
| **M2 — Pasta do Projeto + Comercial** | M2 | Pasta do Projeto operacional, Ferramenta Recebimentos substituindo planilha 01A | Cliente pilota com 5 projetos reais |
| **M3 — PCP + Realtime** | M3 | Ambiente PCP integrado, Timeline cross-Time funcionando, Realtime ativo | Demonstração + cliente pilota |
| **M4 — MVP funcional (homologação)** | M4 | Comercial + PCP + Diretoria rodando em homolog. Bugs P0/P1 = zero. | Aceite formal por escrito |
| **M5 — Treinamento dos 60 usuários** | M5 | ≥ 80% dos usuários treinados e logados. Documentação de uso entregue. | Lista de presença + acessos |
| **M6 — Produção plena (Go-Live)** | M6 | Sistema em produção. Adesão > 80%. Planilhas Excel substituídas. | **Decisão Fase 2 aqui** |

**Aceite formal de cada marco** é prerrogativa da CONTRATANTE. Em caso de divergência, há período de 5 dias úteis para CONTRATADA endereçar ajustes apontados no aceite.

---

## 6. SUPORTE E SLA

A CONTRATADA presta suporte direto ao longo de todo o contrato, conforme termos:

### 6.1 Canal Único — WhatsApp Direto com Marcus Vitorino

- Atendimento via WhatsApp pessoal de Marcus Vitorino (Founder Lioma IT) ao(s) ponto(s) focal(is) da CONTRATANTE.
- **SLA de resposta**: same-day (resposta no mesmo dia da solicitação durante dias úteis, das 09h às 19h).

### 6.2 Tipos de Atendimento Inclusos

- **Tratamento de erros (bugs)** com investigação até causa-raiz e correção
- **Dúvidas operacionais** sobre uso do sistema
- **Pequenas alterações** em textos, labels, ordenação de campos, ajustes finos de UX
- **Acompanhamento de incidentes** críticos com comunicação ativa

### 6.3 Severidade e Tempo de Resolução

| Severidade | Definição | Resposta inicial | Resolução alvo |
|---|---|---|---|
| **P0 — Crítico** | Sistema indisponível ou perda de dados | ≤ 1h em horário comercial | ≤ 24h |
| **P1 — Alto** | Funcionalidade crítica quebrada (ex: não consegue criar Pasta) | ≤ 4h | ≤ 48h |
| **P2 — Médio** | Bug em funcionalidade não-crítica | ≤ 1 dia útil | ≤ 5 dias úteis |
| **P3 — Baixo** | Pedido de pequena alteração / dúvida | ≤ 1 dia útil | conforme planejamento |

### 6.4 O que NÃO está incluso no Suporte

- Desenvolvimento de novas funcionalidades não previstas no escopo
- Adição/remoção/alteração de módulos, ferramentas ou processos do sistema
- Treinamentos adicionais além dos do M5
- Customizações específicas para usuários ou times além do escopo MVP

Itens acima são tratados como **mudança de escopo** (cláusula 7).

---

## 7. MUDANÇAS DE ESCOPO

Caso a CONTRATANTE deseje **adicionar, remover ou alterar** qualquer:
- Funcionalidade
- Módulo (Ambiente)
- Ferramenta de um Time
- Processo significativo do sistema

Tal mudança será tratada como **projeto separado**, com:

1. Solicitação formal por escrito (e-mail ou ferramenta de tickets)
2. **Proposta técnica e comercial** elaborada pela CONTRATADA em até 5 dias úteis, em **anexo** ao contrato vigente
3. Proposta inclui: escopo, esforço estimado, prazo, valor, marcos de entrega
4. Aprovação por escrito da CONTRATANTE antes de início da execução
5. Pagamento conforme termos da proposta (geralmente: 50% início, 50% entrega)

A CONTRATADA não inicia trabalho sem proposta aprovada.

---

## 8. PROPRIEDADE INTELECTUAL

### 8.1 Titularidade do Software

O **Arali Flow** (código-fonte, arquitetura, prompts de IA, biblioteca de Ferramentas, padrões de implementação) é **propriedade exclusiva da LIOMA IT**.

A CONTRATANTE recebe **direito de uso** sobre a instância single-tenant provisionada exclusivamente para si, durante a vigência do contrato.

### 8.2 Dados da CONTRATANTE

Todos os **dados operacionais** inseridos no sistema (informações de projetos, clientes, recebimentos, comunicações, documentos) são de **propriedade exclusiva da CONTRATANTE**. A CONTRATADA atua apenas como operadora desses dados.

Em caso de encerramento do contrato:
- A CONTRATADA fornece **export completo dos dados** em formato estruturado (JSON + CSV) em até 30 dias
- Dados são mantidos em backup por 90 dias adicionais
- Após esse período, dados são definitivamente removidos da infraestrutura da CONTRATADA

### 8.3 Direito de Replicação

A CONTRATADA pode **replicar a tecnologia base** (Arali Flow core) para outros clientes do segmento (marcenarias premium ou afins), sob a marca/branding adequado a cada cliente, **sem qualquer obrigação financeira ou de exclusividade** para com a CONTRATANTE.

A CONTRATANTE, em contrapartida, recebe:
- **Status de cliente piloto** (reconhecimento institucional, se desejar)
- **Desconto sentimental** no Setup (R$ 2.499 abatidos)
- **Prioridade** na implementação de novas features e melhorias

---

## 9. CONFIDENCIALIDADE E PROTEÇÃO DE DADOS

### 9.1 Confidencialidade Mútua

Ambas as partes se comprometem a manter sigilo sobre:
- Informações comerciais, técnicas, operacionais
- Lista de clientes finais da CONTRATANTE (arquitetos, projetos confidenciais)
- Estratégias de negócio
- Termos deste contrato

Obrigação válida por todo o período do contrato e por **3 anos** após seu encerramento.

### 9.2 LGPD (Lei Geral de Proteção de Dados)

A CONTRATADA atua como **operadora** dos dados; a CONTRATANTE é a **controladora**.

- Dados pessoais armazenados (nomes, e-mails, telefones, fotos de perfil) são tratados conforme finalidade explícita: **operação do sistema interno Arali**
- Há **consentimento explícito** no onboarding de cada Integrante
- A CONTRATANTE tem direito de exigir **exportação ou eliminação** de dados pessoais a qualquer momento
- Em caso de incidente de segurança, a CONTRATADA notifica a CONTRATANTE em até **24h** após detecção

### 9.3 Segurança Mínima

A CONTRATADA mantém:
- Criptografia em trânsito (TLS 1.3+) e em repouso (AES-256)
- Autenticação com MFA disponível para Diretoria e Admins
- Backups testados e auditoria de acessos (`audit_logs`)
- Conformidade com OWASP Top 10
- Conforme detalhado em `docs/SECURITY.md` do produto

---

## 10. VIGÊNCIA, RESCISÃO E RENOVAÇÃO

### 10.1 Vigência

Contrato válido por **18 meses** contados a partir da assinatura, divididos em:
- Fase 1: 6 meses (piloto)
- Fase 2: 12 meses (produção, condicional à aprovação no M6)

### 10.2 Rescisão Antecipada — Pela CONTRATANTE

- **Ao final do M6** (Fase 1): direito de não prosseguir, sem multa, sem reembolso de valores pagos.
- **Durante Fase 2** (M7 em diante): rescisão por escolha da CONTRATANTE implica em multa equivalente a **3 mensalidades** restantes do contrato (limite máximo).

### 10.3 Rescisão Antecipada — Pela CONTRATADA

A CONTRATADA pode rescindir em caso de:
- Inadimplência superior a 60 dias após vencimento (notificação prévia obrigatória)
- Uso indevido do sistema (extração não autorizada de código, tentativas de cópia)
- Desrespeito grave a cláusula de confidencialidade

### 10.4 Renovação Automática

Ao final dos 18 meses, contrato é **renovado automaticamente por mais 12 meses**, salvo manifestação contrária por escrito de qualquer das partes com **60 dias de antecedência**.

Mensalidade da renovação segue tabela Lioma IT vigente, com **direito de reajuste** anual conforme IPCA.

---

## 11. REAJUSTES E MULTAS

### 11.1 Reajuste Anual

Mensalidades sofrem reajuste anual aplicado **a cada 12 meses do início do contrato**, baseado em **IPCA acumulado dos últimos 12 meses**.

O reajuste pré-contratado de R$ 997 → R$ 1.499 entre M12 e M13 já está previsto e **não constitui reajuste IPCA** — é parte da estrutura comercial inicial.

### 11.2 Multa por Atraso

- **Multa**: 2% sobre o valor em atraso
- **Juros de mora**: 1% ao mês (pro rata die)
- **Após 30 dias**: suspensão dos serviços (sistema continua acessível em modo somente leitura por 7 dias adicionais antes de bloqueio total)

---

## 12. FORO E DISPOSIÇÕES FINAIS

### 12.1 Foro

Fica eleito o foro da Comarca de **São Paulo / SP** para dirimir quaisquer dúvidas oriundas deste contrato.

### 12.2 Disposições Finais

- Alterações somente por aditivo escrito assinado por ambas as partes
- Comunicações formais via e-mail registrado para os endereços indicados na cláusula 1
- Anexos integram este contrato:
  - Anexo I: Especificação Técnica do MVP (baseada em `README.md`)
  - Anexo II: Cronograma detalhado das 4 etapas (Risca, Esquadro, Encaixe, Lapidação)
  - Anexo III: Política de Suporte e SLA detalhado
  - Anexo IV: Termo de Confidencialidade e LGPD

---

## ASSINATURAS

___________________________________________
**LIOMA IT** — Marcus Vitorino
[CPF / Cargo / Data]

___________________________________________
**ARALI MÓVEIS** — [Nome do representante]
[CPF / Cargo / Data]

___________________________________________
**Testemunha 1** — [Nome / CPF]

___________________________________________
**Testemunha 2** — [Nome / CPF]

---

## NOTAS INTERNAS LIOMA IT (NÃO ENVIAR AO CLIENTE)

### Por que o "desconto sentimental" do Diagnóstico (R$ 2.499 abatidos)?

- Reduz fricção emocional no fechamento
- Cria sensação de "ganhei algo" na decisão de seguir para Fase 2
- Não compromete o LTV total (R$ 17.501 já é "Setup pós-desconto")
- É uma das alavancas comerciais mais eficazes em deals premium

### Política de Negociação

- **Limite mínimo de mensalidade Fase 2 (M7-M12)**: R$ 850 (já estamos próximo do limite por ser piloto)
- **Limite mínimo de Setup**: R$ 14.000 (negociar mais que isso só com aprovação direta de Marcus)
- **Parcelamento Setup**: até 6x sem juros se cliente travar a negociação no à vista. Ideal: 3x.
- **Período de teste estendido**: NÃO oferecer. O M1-M6 já é o "período de teste" precificado.

### Métricas de Sucesso do Contrato

- Adesão diária no produto > 80% dos 60 usuários
- Substituição efetiva das planilhas Excel até M6
- NPS > 8 medido em M6 e M12
- Renovação ao final dos 18 meses

### Próximo Passo Pós-Assinatura

1. Provisionar stack Supabase + Vercel para Arali (single-tenant)
2. Setup repositório `arali-flow` específico do cliente
3. Kickoff com Diretoria Arali em até 5 dias úteis
4. Iniciar Etapa 0 — RISCA

---

**FIM DO MODELO DE CONTRATO**

> Próximo passo: revisão jurídica antes do envio ao cliente. Recomendado: advogado especializado em contratos de tecnologia.
