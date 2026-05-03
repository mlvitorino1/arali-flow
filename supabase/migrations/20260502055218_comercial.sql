-- ============================================================
-- Arali Flow — Phase 1: Domínio Comercial (ESQUADRO)
-- ============================================================
-- Tabelas: clientes, parceiros, propostas, propostas_revisoes,
--          projetos, projetos_times, recebimentos, notas_fiscais
-- Enums, RLS, índices e seeds de ferramentas incluídos.
-- ============================================================

-- ============================================================
-- ENUMS
-- ============================================================


CREATE TYPE public.status_proposta AS ENUM (
  'em_pausa',
  'enviada',
  'nfp',
  'nova',
  'aprovada',
  'recusada'
);

CREATE TYPE public.status_comercial AS ENUM (
  'iniciando',
  'concorrencia',
  'em_execucao',
  'execucao',
  'em_pausa',
  'sem_status'
);

CREATE TYPE public.tipo_proposta AS ENUM (
  'pm',
  'pn',
  'fr',
  'mob',
  'fch',
  'br',
  'portas',
  'portoes',
  'batentes',
  'forro',
  'manutencao',
  'outro'
);

CREATE TYPE public.tipo_parceiro AS ENUM (
  'arquitetura',
  'construtora',
  'gerenciadora'
);

CREATE TYPE public.status_projeto AS ENUM (
  'rascunho',
  'ativo',
  'em_revisao',
  'concluido',
  'arquivado',
  'cancelado'
);

CREATE TYPE public.saude_projeto AS ENUM (
  'verde',
  'amarelo',
  'vermelho'
);

-- ============================================================
-- CLIENTES
-- ============================================================

CREATE TABLE public.clientes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  nome            text NOT NULL,
  documento       text,                         -- CPF ou CNPJ, sem máscara
  tipo            text NOT NULL DEFAULT 'pf'
                    CHECK (tipo IN ('pf', 'pj')),
  email           text,
  telefone        text,
  observacoes     text,

  ativo           boolean NOT NULL DEFAULT true,
  criado_por_id   uuid NOT NULL REFERENCES public.integrantes(id),
  criado_em       timestamptz NOT NULL DEFAULT now(),
  atualizado_em   timestamptz NOT NULL DEFAULT now(),
  deletado_em     timestamptz,

  CONSTRAINT clientes_nome_not_blank CHECK (length(trim(nome)) > 0)
);

CREATE TRIGGER clientes_set_atualizado_em
  BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

CREATE INDEX idx_clientes_nome       ON public.clientes (lower(nome)) WHERE deletado_em IS NULL;
CREATE INDEX idx_clientes_documento  ON public.clientes (documento)   WHERE deletado_em IS NULL;

-- ============================================================
-- PARCEIROS
-- ============================================================

CREATE TABLE public.parceiros (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  nome            text NOT NULL,
  tipo            public.tipo_parceiro NOT NULL,
  contato_nome    text,
  contato_email   text,
  contato_telefone text,
  observacoes     text,

  ativo           boolean NOT NULL DEFAULT true,
  criado_por_id   uuid NOT NULL REFERENCES public.integrantes(id),
  criado_em       timestamptz NOT NULL DEFAULT now(),
  atualizado_em   timestamptz NOT NULL DEFAULT now(),
  deletado_em     timestamptz,

  CONSTRAINT parceiros_nome_not_blank CHECK (length(trim(nome)) > 0)
);

CREATE TRIGGER parceiros_set_atualizado_em
  BEFORE UPDATE ON public.parceiros
  FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

CREATE INDEX idx_parceiros_tipo ON public.parceiros (tipo) WHERE deletado_em IS NULL;
CREATE INDEX idx_parceiros_nome ON public.parceiros (lower(nome)) WHERE deletado_em IS NULL;

-- ============================================================
-- PROPOSTAS
-- ============================================================

CREATE TABLE public.propostas (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Identidade da OS
  numero_os_raw       text NOT NULL,            -- ex: "2026-0042", "042/26" — string crua
  numero_os_seq       int,                      -- parte sequencial para ordenação, extraída por aplicação
  ano                 int NOT NULL DEFAULT EXTRACT(year FROM now())::int,

  cliente_id          uuid NOT NULL REFERENCES public.clientes(id),
  parceiro_id         uuid REFERENCES public.parceiros(id),   -- arquiteto/construtora/gerenciadora principal
  elaborado_por_id    uuid REFERENCES public.integrantes(id), -- quem fez a proposta

  -- Classificação
  tipo                public.tipo_proposta NOT NULL DEFAULT 'outro',
  fator               numeric(6, 4),            -- ex: 1.3500
  valor               numeric(12, 2),

  -- Status
  status_proposta     public.status_proposta NOT NULL DEFAULT 'nova',
  status_comercial    public.status_comercial NOT NULL DEFAULT 'sem_status',

  -- Datas
  data_envio          date,
  data_retorno        date,                     -- quando recebeu resposta do cliente
  prazo_execucao      date,

  -- Texto livre
  observacoes         text,
  ambiente_obra       text,                     -- descrição do ambiente (metragem, espaço etc.)

  -- Auditoria
  criado_por_id       uuid NOT NULL REFERENCES public.integrantes(id),
  atualizado_por_id   uuid REFERENCES public.integrantes(id),
  criado_em           timestamptz NOT NULL DEFAULT now(),
  atualizado_em       timestamptz NOT NULL DEFAULT now(),
  deletado_em         timestamptz
);

CREATE TRIGGER propostas_set_atualizado_em
  BEFORE UPDATE ON public.propostas
  FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

CREATE INDEX idx_propostas_cliente        ON public.propostas (cliente_id) WHERE deletado_em IS NULL;
CREATE INDEX idx_propostas_status         ON public.propostas (status_proposta, status_comercial) WHERE deletado_em IS NULL;
CREATE INDEX idx_propostas_elaborado_por  ON public.propostas (elaborado_por_id) WHERE deletado_em IS NULL;
CREATE INDEX idx_propostas_ano            ON public.propostas (ano DESC) WHERE deletado_em IS NULL;
CREATE INDEX idx_propostas_data_envio     ON public.propostas (data_envio DESC) WHERE deletado_em IS NULL;

-- ============================================================
-- REVISÕES DE PROPOSTA
-- (sufixos R01..R10, E01 R02 CD etc.)
-- ============================================================

CREATE TABLE public.propostas_revisoes (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  proposta_id     uuid NOT NULL REFERENCES public.propostas(id) ON DELETE CASCADE,

  -- Sufixo como string crua — não tentar normalizar
  sufixo_raw      text NOT NULL,               -- ex: "R01", "E01 R02 CD", "R03"
  descricao       text,
  valor           numeric(12, 2),              -- pode diferir da proposta original

  criado_por_id   uuid NOT NULL REFERENCES public.integrantes(id),
  criado_em       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_propostas_revisoes_proposta ON public.propostas_revisoes (proposta_id);

-- ============================================================
-- PROJETOS
-- (promovido a partir de proposta aprovada/fechada)
-- ============================================================

CREATE TABLE public.projetos (
  id                    uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Vínculo com proposta de origem
  proposta_id           uuid UNIQUE REFERENCES public.propostas(id),

  -- Identidade
  numero_os_raw         text NOT NULL,
  ano                   int NOT NULL,
  nome                  text NOT NULL,

  -- Partes envolvidas
  cliente_id            uuid NOT NULL REFERENCES public.clientes(id),
  arquiteto_id          uuid REFERENCES public.parceiros(id),   -- tipo = 'arquitetura'
  construtora_id        uuid REFERENCES public.parceiros(id),   -- tipo = 'construtora'
  gerenciadora_id       uuid REFERENCES public.parceiros(id),   -- tipo = 'gerenciadora'
  endereco              text,

  -- Status
  status                public.status_projeto NOT NULL DEFAULT 'ativo',
  saude                 public.saude_projeto  NOT NULL DEFAULT 'verde',

  -- Datas
  data_inicio           date,
  prazo_cliente         date,
  data_conclusao        date,

  -- Valores
  valor_orcado          numeric(12, 2),
  valor_contrato        numeric(12, 2),

  -- Auditoria
  criado_por_id         uuid NOT NULL REFERENCES public.integrantes(id),
  atualizado_por_id     uuid REFERENCES public.integrantes(id),
  criado_em             timestamptz NOT NULL DEFAULT now(),
  atualizado_em         timestamptz NOT NULL DEFAULT now(),
  arquivado_em          timestamptz,

  UNIQUE (numero_os_raw, ano)
);

CREATE TRIGGER projetos_set_atualizado_em
  BEFORE UPDATE ON public.projetos
  FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

CREATE INDEX idx_projetos_cliente   ON public.projetos (cliente_id);
CREATE INDEX idx_projetos_status    ON public.projetos (status);
CREATE INDEX idx_projetos_ano       ON public.projetos (ano DESC);
CREATE INDEX idx_projetos_saude     ON public.projetos (saude) WHERE status = 'ativo';

-- ============================================================
-- PROJETOS × TIMES
-- (quais times participam de cada projeto)
-- ============================================================

CREATE TABLE public.projetos_times (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  projeto_id        uuid NOT NULL REFERENCES public.projetos(id) ON DELETE CASCADE,
  time_id           uuid NOT NULL REFERENCES public.times(id),

  adicionado_por_id uuid NOT NULL REFERENCES public.integrantes(id),
  adicionado_em     timestamptz NOT NULL DEFAULT now(),
  removido_em       timestamptz,

  UNIQUE (projeto_id, time_id)
);

CREATE INDEX idx_projetos_times_projeto ON public.projetos_times (projeto_id);
CREATE INDEX idx_projetos_times_time    ON public.projetos_times (time_id);

-- ============================================================
-- NOTAS FISCAIS
-- ============================================================

CREATE TABLE public.notas_fiscais (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  projeto_id      uuid REFERENCES public.projetos(id),
  proposta_id     uuid REFERENCES public.propostas(id),

  numero          text NOT NULL,
  tipo            text NOT NULL CHECK (tipo IN ('nfe', 'nfs')),  -- NFe entrada / NFS serviço
  data_emissao    date,
  valor           numeric(12, 2),
  observacoes     text,

  criado_por_id   uuid NOT NULL REFERENCES public.integrantes(id),
  criado_em       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_notas_fiscais_projeto   ON public.notas_fiscais (projeto_id);
CREATE INDEX idx_notas_fiscais_proposta  ON public.notas_fiscais (proposta_id);
CREATE INDEX idx_notas_fiscais_numero    ON public.notas_fiscais (numero);

-- ============================================================
-- RECEBIMENTOS
-- (substitui planilha "01A Recebimento Entrada")
-- ============================================================

CREATE TABLE public.recebimentos (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  -- Vínculos principais
  projeto_id          uuid REFERENCES public.projetos(id),
  proposta_id         uuid REFERENCES public.propostas(id),
  cliente_id          uuid NOT NULL REFERENCES public.clientes(id),
  nota_fiscal_id      uuid REFERENCES public.notas_fiscais(id),

  -- Parceiros envolvidos no recebimento
  arquiteto_id        uuid REFERENCES public.parceiros(id),
  construtora_id      uuid REFERENCES public.parceiros(id),
  gerenciadora_id     uuid REFERENCES public.parceiros(id),

  -- Dados financeiros
  data_recebimento    date NOT NULL,
  valor_medicao       numeric(12, 2),     -- coluna "Medição" da planilha
  valor_entrada       numeric(12, 2),     -- coluna "Entrada" da planilha

  -- Identificação
  nf_recibo           text,               -- número do NF ou recibo (texto livre)
  descricao_medicao   text,               -- ex: "1ª medição", "medição final"
  observacoes         text,

  -- Auditoria
  criado_por_id       uuid NOT NULL REFERENCES public.integrantes(id),
  atualizado_por_id   uuid REFERENCES public.integrantes(id),
  criado_em           timestamptz NOT NULL DEFAULT now(),
  atualizado_em       timestamptz NOT NULL DEFAULT now(),
  deletado_em         timestamptz
);

CREATE TRIGGER recebimentos_set_atualizado_em
  BEFORE UPDATE ON public.recebimentos
  FOR EACH ROW EXECUTE FUNCTION public.set_atualizado_em();

CREATE INDEX idx_recebimentos_projeto          ON public.recebimentos (projeto_id) WHERE deletado_em IS NULL;
CREATE INDEX idx_recebimentos_cliente          ON public.recebimentos (cliente_id) WHERE deletado_em IS NULL;
CREATE INDEX idx_recebimentos_data             ON public.recebimentos (data_recebimento DESC) WHERE deletado_em IS NULL;
CREATE INDEX idx_recebimentos_construtora      ON public.recebimentos (construtora_id) WHERE deletado_em IS NULL;
CREATE INDEX idx_recebimentos_arquiteto        ON public.recebimentos (arquiteto_id) WHERE deletado_em IS NULL;
CREATE INDEX idx_recebimentos_mes_ano          ON public.recebimentos (
  (EXTRACT(year FROM data_recebimento)::int),
  (EXTRACT(month FROM data_recebimento)::int)
) WHERE deletado_em IS NULL;

-- ============================================================
-- HELPERS PARA RLS — ambiente Comercial
-- ============================================================

CREATE OR REPLACE FUNCTION public.is_integrante_comercial()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT public.is_diretoria() OR EXISTS (
    SELECT 1
    FROM public.integrantes_times it
    JOIN public.integrantes i ON i.id = it.integrante_id
    JOIN public.times t ON t.id = it.time_id
    JOIN public.ambientes a ON a.id = t.ambiente_id
    WHERE a.slug = 'comercial'
      AND i.usuario_id = auth.uid()
      AND i.ativo = true
      AND i.deletado_em IS NULL
      AND it.ate IS NULL
  )
$$;

-- ============================================================
-- RLS — habilitar e criar policies
-- ============================================================

ALTER TABLE public.clientes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.parceiros        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propostas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.propostas_revisoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projetos_times   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notas_fiscais    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recebimentos     ENABLE ROW LEVEL SECURITY;

-- CLIENTES
CREATE POLICY clientes_select ON public.clientes
  FOR SELECT TO authenticated USING (public.is_integrante_comercial());

CREATE POLICY clientes_insert ON public.clientes
  FOR INSERT TO authenticated WITH CHECK (public.is_integrante_comercial());

CREATE POLICY clientes_update ON public.clientes
  FOR UPDATE TO authenticated
  USING (public.is_integrante_comercial())
  WITH CHECK (public.is_integrante_comercial());

CREATE POLICY clientes_delete ON public.clientes
  FOR DELETE TO authenticated USING (public.is_diretoria());

-- PARCEIROS
CREATE POLICY parceiros_select ON public.parceiros
  FOR SELECT TO authenticated USING (public.is_integrante_comercial());

CREATE POLICY parceiros_insert ON public.parceiros
  FOR INSERT TO authenticated WITH CHECK (public.is_integrante_comercial());

CREATE POLICY parceiros_update ON public.parceiros
  FOR UPDATE TO authenticated
  USING (public.is_integrante_comercial())
  WITH CHECK (public.is_integrante_comercial());

CREATE POLICY parceiros_delete ON public.parceiros
  FOR DELETE TO authenticated USING (public.is_diretoria());

-- PROPOSTAS
CREATE POLICY propostas_select ON public.propostas
  FOR SELECT TO authenticated USING (public.is_integrante_comercial());

CREATE POLICY propostas_insert ON public.propostas
  FOR INSERT TO authenticated WITH CHECK (public.is_integrante_comercial());

CREATE POLICY propostas_update ON public.propostas
  FOR UPDATE TO authenticated
  USING (public.is_integrante_comercial())
  WITH CHECK (public.is_integrante_comercial());

CREATE POLICY propostas_delete ON public.propostas
  FOR DELETE TO authenticated USING (public.is_diretoria());

-- PROPOSTAS REVISOES
CREATE POLICY propostas_revisoes_select ON public.propostas_revisoes
  FOR SELECT TO authenticated USING (public.is_integrante_comercial());

CREATE POLICY propostas_revisoes_insert ON public.propostas_revisoes
  FOR INSERT TO authenticated WITH CHECK (public.is_integrante_comercial());

CREATE POLICY propostas_revisoes_delete ON public.propostas_revisoes
  FOR DELETE TO authenticated USING (public.is_diretoria());

-- PROJETOS
CREATE POLICY projetos_select ON public.projetos
  FOR SELECT TO authenticated
  USING (
    public.is_diretoria()
    OR public.is_integrante_comercial()
    OR EXISTS (
      SELECT 1 FROM public.projetos_times pt
      WHERE pt.projeto_id = projetos.id
        AND public.is_integrante_de_time(pt.time_id)
        AND pt.removido_em IS NULL
    )
  );

CREATE POLICY projetos_insert ON public.projetos
  FOR INSERT TO authenticated WITH CHECK (public.is_integrante_comercial());

CREATE POLICY projetos_update ON public.projetos
  FOR UPDATE TO authenticated
  USING (public.is_integrante_comercial() OR public.is_diretoria())
  WITH CHECK (public.is_integrante_comercial() OR public.is_diretoria());

CREATE POLICY projetos_delete ON public.projetos
  FOR DELETE TO authenticated USING (public.is_diretoria());

-- PROJETOS TIMES
CREATE POLICY projetos_times_select ON public.projetos_times
  FOR SELECT TO authenticated
  USING (
    public.is_diretoria()
    OR public.is_integrante_de_time(time_id)
  );

CREATE POLICY projetos_times_insert ON public.projetos_times
  FOR INSERT TO authenticated
  WITH CHECK (
    public.is_diretoria()
    OR public.is_lider_de_time(time_id)
  );

CREATE POLICY projetos_times_delete ON public.projetos_times
  FOR DELETE TO authenticated USING (public.is_diretoria());

-- NOTAS FISCAIS
CREATE POLICY notas_fiscais_select ON public.notas_fiscais
  FOR SELECT TO authenticated USING (public.is_integrante_comercial());

CREATE POLICY notas_fiscais_insert ON public.notas_fiscais
  FOR INSERT TO authenticated WITH CHECK (public.is_integrante_comercial());

CREATE POLICY notas_fiscais_delete ON public.notas_fiscais
  FOR DELETE TO authenticated USING (public.is_diretoria());

-- RECEBIMENTOS
CREATE POLICY recebimentos_select ON public.recebimentos
  FOR SELECT TO authenticated USING (public.is_integrante_comercial());

CREATE POLICY recebimentos_insert ON public.recebimentos
  FOR INSERT TO authenticated WITH CHECK (public.is_integrante_comercial());

CREATE POLICY recebimentos_update ON public.recebimentos
  FOR UPDATE TO authenticated
  USING (public.is_integrante_comercial())
  WITH CHECK (public.is_integrante_comercial());

CREATE POLICY recebimentos_delete ON public.recebimentos
  FOR DELETE TO authenticated USING (public.is_diretoria());

-- ============================================================
-- FERRAMENTAS — seeds para Comercial
-- ============================================================

CREATE TABLE IF NOT EXISTS public.ferramentas (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug        text UNIQUE NOT NULL,
  nome        text NOT NULL,
  ambiente_id uuid NOT NULL REFERENCES public.ambientes(id),
  descricao   text,
  ativo       boolean NOT NULL DEFAULT true,
  ordem       int NOT NULL DEFAULT 0
);

CREATE TABLE IF NOT EXISTS public.ferramentas_times (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ferramenta_id   uuid NOT NULL REFERENCES public.ferramentas(id),
  time_id         uuid NOT NULL REFERENCES public.times(id),
  habilitada      boolean NOT NULL DEFAULT true,
  configuracoes   jsonb NOT NULL DEFAULT '{}',
  UNIQUE (ferramenta_id, time_id)
);

ALTER TABLE public.ferramentas       ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ferramentas_times ENABLE ROW LEVEL SECURITY;

CREATE POLICY ferramentas_select ON public.ferramentas
  FOR SELECT TO authenticated USING (true);

CREATE POLICY ferramentas_times_select ON public.ferramentas_times
  FOR SELECT TO authenticated
  USING (public.is_integrante_de_time(time_id));

INSERT INTO public.ferramentas (slug, nome, ambiente_id, descricao, ordem)
SELECT seed.slug, seed.nome, a.id, seed.descricao, seed.ordem
FROM (
  VALUES
    ('recebimentos', 'Recebimentos', 'comercial', 'Registro de medições e entradas por projeto. Substitui a planilha 01A.', 1),
    ('propostas',    'Propostas',    'comercial', 'Pipeline comercial. Substitui a planilha Controle de Entrada de Orçamento.', 2)
) AS seed(slug, nome, ambiente_slug, descricao, ordem)
JOIN public.ambientes a ON a.slug = seed.ambiente_slug
ON CONFLICT (slug) DO UPDATE
  SET nome = EXCLUDED.nome,
      descricao = EXCLUDED.descricao,
      ordem = EXCLUDED.ordem,
      ativo = true;

-- Habilitar as ferramentas no time Comercial
INSERT INTO public.ferramentas_times (ferramenta_id, time_id)
SELECT f.id, t.id
FROM public.ferramentas f
CROSS JOIN public.times t
WHERE f.slug IN ('recebimentos', 'propostas')
  AND t.slug = 'comercial'
ON CONFLICT (ferramenta_id, time_id) DO NOTHING;
