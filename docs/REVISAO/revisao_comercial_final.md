# 📊 Revisão Comercial — Modelo de Dados (Propostas/Orçamentos)

Planilha Controle de Orçamento — Análise Completa
742 linhas · 20 colunas · 47 projetos multi-etapa · Phase 1 ESQUADRO


## 🔍 Diagnóstico Planilha Controle de Entrada de Orçamento


### 🧠 3 Descobertas que mudam a modelagem

### 🚨 CRÍTICO
FATOR não é número — é o nome de quem aprovou
A coluna FATOR contém BIANCA (228x), LISANDRA (216x), CUCA (29x) — nomes de pessoas, não valores numéricos. O valor numérico do fator/margem fica nos arquivos _SISTEMA.xlsx dentro da pasta do projeto. A planilha de controle registra apenas quem validou. Isso muda o campo: em vez de fator numeric, o correto é validado_por_id uuid nesta entidade, e o fator numérico fica na planilha de orçamento (que será digitalizada depois).

### 🚨 CRÍTICO
Tag é um código estruturado, não texto livre
A coluna Tag segue um padrão preciso: N = novo orçamento do projeto (239x),E[nn] = etapa (192x), R[nn] = revisão (162x),E[nn] R[nn] = etapa + revisão (93x), sufixo CD = crédito/débito (46x). OS12320 tem 19 linhas com tags de E07 até E22 — é um código que o time já opera mentalmente. O modelo precisa decompor isso em campos separados: tipo_tag, numero_etapa, numero_revisao, is_credito_debito.

### ⚠️ IMPORTANTE
Cada linha da planilha = 1 orçamento, não 1 proposta
742 linhas, mas muitas OSs se repetem com tags diferentes. OS12320 = 19 linhas = 19 orçamentos de um mesmo projeto. A relação é: 1 Projeto (OS) → N Orçamentos (linhas). Cada orçamento tem tipo de proposta, valor, status e elaborador próprios. Isso confirma: cada linha não é um "projeto" — é um orçamento/proposta dentro do projeto. A tabela propostas do Arali Flow é essa entidade.


## 📈 Números da Planilha

742
Linhas (orçamentos)

47
Projetos com 4+ etapas

149
Tipos de proposta únicos

615
Status 'Enviada'

4
Elaboradores ativos

9
Status distintos

19
Status Comercial distintos

63
Interesse de negociação = SIM



## 🧩 Mapeamento 20 Colunas da Planilha → Campos do Banco

Data
→
criado_em
timestamptz
Data de entrada do orçamento na planilha

Status
→
status
enum
9 valores: Enviada, Em Pausa, Cancelada, Conferir Fator, NOVA, Elaborando, Nova, Prioridade, NFP. Normalizar para enum.

Tag
→
tag_raw + campos decompostos
text + int + bool
DECOMPOR em: tag_raw, tipo_tag (N|E|R|M), numero_etapa, numero_revisao, is_credito_debito. Ver aba 'Sistema de Tags'.

Nº OS
→
projeto.numero_os
text
FK para projetos. Ex: OS12789. Muitas linhas compartilham a mesma OS.

Nome do Cliente e Obra
→
projeto.nome + projeto.cliente_nome
text
Nome misto: 'CASA MMXX' (obra) + 'CARLOS ALBERTO' (cliente). Separar na importação.

Solicitante
→
solicitante
text
Quem solicitou o orçamento. Geralmente escritório de arquitetura ou construtora. Pode virar FK para parceiros.

Construtora
→
parceiro (tipo=construtora)
FK parceiros
Ex: MFC, SERIPIERRI, NOVOMARCO. Vincular à tabela parceiros.tipo_parceiro='construtora'.

Arquitetura
→
parceiro (tipo=arquitetura)
FK parceiros
Ex: STUDIO MK27, JACOBSEN. Vincular à tabela parceiros.tipo_parceiro='arquitetura'.

Gerenciadora
→
parceiro (tipo=gerenciadora)
FK parceiros
Ex: SQUALY, MS TORRES, FITPLAN. Vincular à tabela parceiros.tipo_parceiro='gerenciadora'.

Status Comercial
→
status_comercial
enum
19 valores com duplicatas/typos. Normalizar: EM_EXECUCAO, CONCORRENCIA, INICIANDO, MANUTENCAO, FINALIZADA, REFORMA, VIABILIDADE, etc.

Cidade/Endereço
→
projeto.endereco + projeto.endereco_rua (indexado)
text
Endereço completo. Extrair rua para busca rápida. Index trigram.

Valor
→
valor
numeric(12,2)
Formato 'R$ 2.349.200,00'. Parser BRL → numeric. Pode estar vazio (em elaboração).

Tipo de Proposta
→
tipo_proposta
text (normalizar)
149 valores únicos! Siglas: PM=Porta de Madeira, PN=Painel, FR=Forro, FCH=Fachada, MOB=Mobiliário, BR=Brise. Normalizar com tabela de lookup ou tags.

Elaborado
→
elaborado_por_id
FK integrantes
4 pessoas ativas: BIANCA, SUELEN, MARIANA, FRANCIELE. Vincular a integrantes.

FATOR
→
validado_por_id
FK integrantes
⚠ NÃO é valor numérico! É quem validou: BIANCA, LISANDRA, CUCA. Renomear para validado_por.

<----OBS
→
observacoes
text
Texto livre. Ex: 'ENVIAR PROPOSTA ATÉ DIA 20/01', 'REPASSAR COM O CUCA'.

Data de Envio
→
enviado_em
timestamptz
Data de envio ao cliente. Permite calcular dias sem resposta.

CONFIRMAÇÃO
→
confirmacao_texto
text
Texto livre: 'CONFIRMADO VIA WHATSAPP PELA MARIANA DIA 20/02/2026'. Decompor em: confirmado_por, canal (whatsapp|email), confirmado_em.

INTERESSE DE NEGOCIAÇÃO
→
interesse_negociacao
boolean
SIM (63x) / NÃO (1x) / vazio. Boolean com default null.

PEDIDO FECHADO
→
pedido_fechado
boolean
FECHADO/SIM (10x total). Boolean. Quando true, trigger muda status da proposta.



## 🏷️ Sistema de Tags Decodificação Completa

Padrão da Tag: [tipo_tag][numero_etapa] [R][numero_revisao] [CD]

N
239x (32%)
Novo — primeiro orçamento do projeto. Sem etapa, sem revisão.

E[nn]
192x (26%)
Etapa pura — novo orçamento de uma etapa específica (E01, E07, E15...)

R[nn]
162x (22%)
Revisão do orçamento base (R01 = 1ª revisão do N). Sem etapa associada.

E[nn] R[nn]
93x (13%)
Revisão de uma etapa específica. Ex: E01 R02 = etapa 1, revisão 2.

* CD
46x (6%)
Sufixo Crédito/Débito. Ajuste financeiro sem novo escopo de trabalho.

M
6x (1%)
Manutenção. Orçamento de serviço pós-obra.

Como decompor no modelo

Campos: tag_raw text (valor original preservado para backwards-compat),tipo_tag enum ('novo','etapa','revisao','etapa_revisao','manutencao'),numero_etapa int (null se N ou R puro),numero_revisao int (null se N ou E puro),is_credito_debito boolean DEFAULT false. Parser no ETL: regex /^(E(\d+))?\s*(R(\d+))?\s*(CD)?$/



## 📌 Exemplo Real OS12320 — 19 orçamentos em 1 projeto

E07 R01
FACHADA
R$ 334.300

E08
MOBILIÁRIO
Em Pausa
E09
MOBILIÁRIO
R$ 93.900

E10
MOBILIÁRIO
R$ 34.400

E11
LÂMINA ESCRIT.
Cancelada
E12
PAINEL
R$ 53.400

E13
FORRO
R$ 61.200

E14
CRÉD/DÉB GERAL
R$ 1.023.500

E14 R01
CRÉD/DÉB GERAL
R$ 809.600

E14 R02
CRÉD/DÉB GERAL
R$ 644.200

E15
MOBILIÁRIO
R$ 585.500

E16
ELEVADOR
R$ 28.300

E17
REF. PAINÉIS
R$ 49.500

E18
FERRAGEM
R$ 27.800

E19
PM/PN/MOB/PERG
R$ 3.780.300

E20 CD
MOBILIÁRIO
R$ 32.400

E21
MOBILIÁRIO
R$ 73.200

E22 CD
MOBILIÁRIO
R$ -

E22 CD R01
MOBILIÁRIO
R$ 147.200


Um único projeto pode ter etapas de E01 até E22+ com revisões e CDs intercalados. O tipo de proposta varia wildly: de Mobiliário a Elevador a Ferragem. Isso confirma que etapa ≠ escopo fixo — é qualquer pedido de orçamento sequencial.





## ⚙️ Máquina de Status Proposta/Orçamento

Status na planilha → Status no Arali Flow

NOVA / Nova(6x)
→
rascunho
Orçamento recém-registrado. Sem elaborador atribuído ainda.

Prioridade(2x)
→
priorizada
Marcada como prioridade na fila de elaboração. Posição destaque.

Elaborando(3x)
→
em_elaboracao
Elaborador atribuído e trabalhando no orçamento.

Conferir Fator(6x)
→
aguardando_validacao
Orçamento pronto, aguardando Lisandra/Cuca/Bianca validar e assinar.

Enviada(615x)
→
enviada
Proposta validada e enviada ao cliente. 83% das linhas estão aqui.

Em Pausa(56x)
→
pausada
Orçamento pausado — geralmente aguardando info do cliente ou decisão interna.

Cancelada(53x)
→
cancelada
Orçamento cancelado. Não será mais trabalhado.

NFP(1x)
→
nfp
Significado exato a confirmar com Lisandra. Possivelmente 'Não Foi Possível'.



## 🔄 Fluxo pós-envio (colunas da direita da planilha)

Enviada
→
CONFIRMAÇÃO (texto livre com quem/canal/data)
→
INTERESSE DE NEGOCIAÇÃO (SIM/NÃO)
→
PEDIDO FECHADO (FECHADO/SIM)
Modelagem do pós-envio

Esses 3 campos são o pipeline pós-proposta. No Arali Flow, mapear como: confirmacao → decompor em: confirmado_por text, canal_confirmacao enum (whatsapp|email), confirmado_em date. interesse_negociacao → boolean DEFAULT null. pedido_fechado → boolean DEFAULT false. Quando true, trigger executa distribuição ao PCP.


## 🏗️ Status Comercial do PROJETO (não do orçamento)

A coluna "Status Comercial" indica a fase da obra do cliente, não do orçamento. É um atributo do Projeto, não da Proposta. 19 valores com typos — normalizar para enum.

CONCORRÊNCIA
90x
Arali disputando com outros fornecedores

EM EXECUÇÃO
146x
Obra em andamento, Arali contratada

INICIANDO
36x
Obra começando, primeiros orçamentos

MANUTENÇÃO
9x
Pós-obra, serviços pontuais

FINALIZADA
7x
Obra concluída

REFORMA
7x
Projeto de reforma, não obra nova


## 🧱 Modelo de Dados (SQL) (= cada linha da planilha)

-- Cada linha da planilha = 1 proposta/orçamento
```sql
CREATE TABLE propostas (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  projeto_id      uuid NOT NULL REFERENCES projetos(id),
  pasta_projeto_id uuid REFERENCES pastas_projeto(id),

  -- TAG decomposta
  tag_raw         text NOT NULL,           -- "E01 R02 CD" preservado
  tipo_tag        text NOT NULL DEFAULT 'novo'
    CHECK (tipo_tag IN ('novo','etapa','revisao',
                        'etapa_revisao','manutencao')),
  numero_etapa    int,                     -- NULL se N ou R puro
  numero_revisao  int,                     -- NULL se N ou E puro
  is_credito_debito boolean NOT NULL DEFAULT false,

  -- Identificação
  tipo_proposta   text NOT NULL,           -- "PM/PN/FR", "MOBILIÁRIO"
  solicitante     text,
  construtora_id  uuid REFERENCES parceiros(id),
  arquitetura_id  uuid REFERENCES parceiros(id),
  gerenciadora_id uuid REFERENCES parceiros(id),
  status_comercial text,                   -- enum do projeto

  -- Valores
  valor           numeric(12,2),           -- pode ser NULL (em elab.)
  endereco        text,

  -- Status da proposta
  status          text NOT NULL DEFAULT 'rascunho'
    CHECK (status IN (
      'rascunho','priorizada','em_elaboracao',
      'aguardando_validacao','enviada',
      'pausada','cancelada','nfp'
    )),

  -- Pessoas
  elaborado_por_id  uuid REFERENCES integrantes(id),
  validado_por_id   uuid REFERENCES integrantes(id),  -- ← ERA "FATOR"
  observacoes       text,

  -- Timeline
  data_entrada      date NOT NULL,         -- coluna "Data"
  enviado_em        date,                  -- "Data de Envio"

  -- Pós-envio
  confirmado_por    text,
  canal_confirmacao text CHECK (canal_confirmacao IN
                    ('whatsapp','email','presencial')),
  confirmado_em     date,
  interesse_negociacao boolean,
  pedido_fechado    boolean NOT NULL DEFAULT false,

  -- Auditoria
  criado_por_id     uuid NOT NULL REFERENCES integrantes(id),
  criado_em         timestamptz NOT NULL DEFAULT now(),
  atualizado_em     timestamptz NOT NULL DEFAULT now(),
  deletado_em       timestamptz
);
```



## 🧠 Decisões Arquiteturais

propostas_etapas como tabela filha separada?

NÃO. A planilha mostra que cada etapa é uma LINHA independente, com status, valor e elaborador próprios. Não há hierarquia pai-filho — cada orçamento é atômico. A decomposição da tag em campos (numero_etapa, numero_revisao) já permite agrupar por projeto.

Tipo de Proposta como enum?

NÃO. São 149 valores únicos, muitos com combinações livres de siglas (PM/PN/FR/FCH/MOB/BR...). Manter como text livre com busca full-text. Fase futura: tabela de lookup com siglas normalizadas e tags múltiplas.

Fator numérico onde fica?

NÃO está nesta planilha. Fica nos arquivos _SISTEMA.xlsx dentro da pasta do projeto. Na Phase 1, o campo validado_por_id é suficiente. O fator numérico entra quando a ferramenta de orçamento for digitalizada (Phase 3+).

Status Comercial é do projeto ou da proposta?

DO PROJETO. Os valores (EM EXECUÇÃO, CONCORRÊNCIA, etc.) descrevem a fase da obra, não do orçamento. Mas a planilha repete o valor em cada linha. Manter como campo na proposta para backwards-compat, mas a fonte de verdade é projetos.status_comercial.



## 🚀 Alterações na Migration 0002_comercial.sql já aplicada

1.
Adicionar campos: tag_raw, tipo_tag, numero_etapa, numero_revisao, is_credito_debito

2.
Renomear conceito 'fator' → validado_por_id (FK integrantes). NÃO é numeric.

3.
Adicionar campos pós-envio: confirmado_por, canal_confirmacao, confirmado_em, interesse_negociacao, pedido_fechado

4.
Adicionar campo solicitante text (diferente de construtora/arquitetura/gerenciadora)

5.
Adicionar status: priorizada, aguardando_validacao, nfp ao enum status_proposta

6.
Remover tabela propostas_revisoes (se existir) — revisão é uma LINHA com tag R[nn], não entidade filha

7.
Criar migration incremental 0002b_propostas_ajustes.sql para não quebrar o que já rodou






























