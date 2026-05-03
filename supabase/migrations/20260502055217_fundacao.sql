-- Arali Flow - Fundacao Risca
-- Identidade corporativa, ambientes, times, pertencimento e RLS inicial.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- ============================================================
-- Helpers gerais
-- ============================================================

CREATE OR REPLACE FUNCTION public.set_atualizado_em()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$;

-- ============================================================
-- Tabelas fundacionais
-- ============================================================

CREATE TABLE public.integrantes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  usuario_id uuid UNIQUE NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  nome_completo text NOT NULL,
  apelido text,
  email text NOT NULL,
  telefone text,
  avatar_url text,
  cargo text,

  role_global text NOT NULL DEFAULT 'integrante'
    CHECK (
      role_global IN (
        'super_admin',
        'admin',
        'diretoria',
        'gestor',
        'lider_time',
        'integrante',
        'viewer'
      )
    ),

  ativo boolean NOT NULL DEFAULT true,
  ultimo_acesso_em timestamptz,

  criado_em timestamptz NOT NULL DEFAULT now(),
  atualizado_em timestamptz NOT NULL DEFAULT now(),
  deletado_em timestamptz
);

CREATE TABLE public.ambientes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  nome text NOT NULL,
  descricao text,
  ativo boolean NOT NULL DEFAULT true,
  ordem integer NOT NULL DEFAULT 0,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  ambiente_id uuid NOT NULL REFERENCES public.ambientes(id),
  slug text UNIQUE NOT NULL,
  nome text NOT NULL,
  descricao text,
  cor_brand text,
  ativo boolean NOT NULL DEFAULT true,
  criado_em timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.integrantes_times (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  integrante_id uuid NOT NULL REFERENCES public.integrantes(id) ON DELETE CASCADE,
  time_id uuid NOT NULL REFERENCES public.times(id) ON DELETE CASCADE,
  papel text NOT NULL CHECK (papel IN ('gestor', 'lider', 'integrante')),
  desde timestamptz NOT NULL DEFAULT now(),
  ate timestamptz,
  criado_em timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.integrantes
  ADD CONSTRAINT integrantes_email_not_blank
  CHECK (length(trim(email)) > 0);

ALTER TABLE public.integrantes
  ADD CONSTRAINT integrantes_nome_completo_not_blank
  CHECK (length(trim(nome_completo)) > 0);

ALTER TABLE public.ambientes
  ADD CONSTRAINT ambientes_slug_not_blank
  CHECK (length(trim(slug)) > 0);

ALTER TABLE public.ambientes
  ADD CONSTRAINT ambientes_nome_not_blank
  CHECK (length(trim(nome)) > 0);

ALTER TABLE public.times
  ADD CONSTRAINT times_slug_not_blank
  CHECK (length(trim(slug)) > 0);

ALTER TABLE public.times
  ADD CONSTRAINT times_nome_not_blank
  CHECK (length(trim(nome)) > 0);

CREATE UNIQUE INDEX integrantes_times_ativo_unique
  ON public.integrantes_times (integrante_id, time_id, papel)
  WHERE ate IS NULL;

CREATE INDEX integrantes_usuario_id_idx
  ON public.integrantes (usuario_id);

CREATE INDEX integrantes_role_global_idx
  ON public.integrantes (role_global);

CREATE INDEX integrantes_ativos_idx
  ON public.integrantes (ativo)
  WHERE deletado_em IS NULL;

CREATE INDEX times_ambiente_id_idx
  ON public.times (ambiente_id);

CREATE INDEX integrantes_times_integrante_id_idx
  ON public.integrantes_times (integrante_id);

CREATE INDEX integrantes_times_time_id_idx
  ON public.integrantes_times (time_id);

CREATE INDEX integrantes_times_ativos_integrante_time_idx
  ON public.integrantes_times (integrante_id, time_id)
  WHERE ate IS NULL;

CREATE TRIGGER integrantes_set_atualizado_em
BEFORE UPDATE ON public.integrantes
FOR EACH ROW
EXECUTE FUNCTION public.set_atualizado_em();

-- ============================================================
-- Seeds sem dependencia de auth.users
-- ============================================================

INSERT INTO public.ambientes (slug, nome, descricao, ordem)
VALUES
  ('diretoria', 'Diretoria', 'Visao executiva e governanca da operacao.', 1),
  ('comercial', 'Comercial', 'Entrada de propostas, clientes e recebimentos.', 2),
  ('pcp', 'PCP', 'Planejamento, controle e programacao da producao.', 3)
ON CONFLICT (slug) DO UPDATE
SET
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  ordem = EXCLUDED.ordem,
  ativo = true;

INSERT INTO public.times (ambiente_id, slug, nome, descricao)
SELECT a.id, seed.slug, seed.nome, seed.descricao
FROM (
  VALUES
    ('diretoria', 'diretoria', 'Diretoria', 'Time executivo da Arali.'),
    ('comercial', 'comercial', 'Comercial', 'Time responsavel por propostas e relacionamento comercial.'),
    ('pcp', 'pcp', 'PCP', 'Time responsavel por planejamento e controle da producao.')
) AS seed(ambiente_slug, slug, nome, descricao)
JOIN public.ambientes a ON a.slug = seed.ambiente_slug
ON CONFLICT (slug) DO UPDATE
SET
  ambiente_id = EXCLUDED.ambiente_id,
  nome = EXCLUDED.nome,
  descricao = EXCLUDED.descricao,
  ativo = true;

-- ============================================================
-- Helper functions para RLS
-- ============================================================

CREATE OR REPLACE FUNCTION public.current_integrante_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT i.id
  FROM public.integrantes i
  WHERE i.usuario_id = auth.uid()
    AND i.ativo = true
    AND i.deletado_em IS NULL
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.current_role_global()
RETURNS text
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT i.role_global
  FROM public.integrantes i
  WHERE i.usuario_id = auth.uid()
    AND i.ativo = true
    AND i.deletado_em IS NULL
  LIMIT 1
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(public.current_role_global() = 'super_admin', false)
$$;

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(public.current_role_global() IN ('super_admin', 'admin'), false)
$$;

CREATE OR REPLACE FUNCTION public.is_diretoria()
RETURNS boolean
LANGUAGE sql
STABLE
AS $$
  SELECT coalesce(public.current_role_global() IN ('super_admin', 'admin', 'diretoria'), false)
$$;

CREATE OR REPLACE FUNCTION public.is_integrante_de_time(p_time_id uuid)
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
    WHERE it.time_id = p_time_id
      AND i.usuario_id = auth.uid()
      AND i.ativo = true
      AND i.deletado_em IS NULL
      AND it.ate IS NULL
  )
$$;

CREATE OR REPLACE FUNCTION public.is_gestor_de_time(p_time_id uuid)
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
    WHERE it.time_id = p_time_id
      AND i.usuario_id = auth.uid()
      AND i.ativo = true
      AND i.deletado_em IS NULL
      AND it.papel = 'gestor'
      AND it.ate IS NULL
  )
$$;

CREATE OR REPLACE FUNCTION public.is_lider_de_time(p_time_id uuid)
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
    WHERE it.time_id = p_time_id
      AND i.usuario_id = auth.uid()
      AND i.ativo = true
      AND i.deletado_em IS NULL
      AND it.papel IN ('lider', 'gestor')
      AND it.ate IS NULL
  )
$$;

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE public.integrantes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ambientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.times ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrantes_times ENABLE ROW LEVEL SECURITY;

CREATE POLICY integrantes_select ON public.integrantes
  FOR SELECT TO authenticated
  USING (
    usuario_id = auth.uid()
    OR public.is_diretoria()
  );

CREATE POLICY integrantes_insert ON public.integrantes
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.is_diretoria());

CREATE POLICY integrantes_update ON public.integrantes
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.is_diretoria())
  WITH CHECK (public.is_admin() OR public.is_diretoria());

CREATE POLICY integrantes_delete ON public.integrantes
  FOR DELETE TO authenticated
  USING (public.is_admin() OR public.is_diretoria());

CREATE POLICY ambientes_select ON public.ambientes
  FOR SELECT TO authenticated
  USING (ativo = true OR public.is_diretoria());

CREATE POLICY ambientes_insert ON public.ambientes
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.is_diretoria());

CREATE POLICY ambientes_update ON public.ambientes
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.is_diretoria())
  WITH CHECK (public.is_admin() OR public.is_diretoria());

CREATE POLICY ambientes_delete ON public.ambientes
  FOR DELETE TO authenticated
  USING (public.is_admin() OR public.is_diretoria());

CREATE POLICY times_select ON public.times
  FOR SELECT TO authenticated
  USING (
    public.is_diretoria()
    OR public.is_integrante_de_time(id)
  );

CREATE POLICY times_insert ON public.times
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.is_diretoria());

CREATE POLICY times_update ON public.times
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.is_diretoria())
  WITH CHECK (public.is_admin() OR public.is_diretoria());

CREATE POLICY times_delete ON public.times
  FOR DELETE TO authenticated
  USING (public.is_admin() OR public.is_diretoria());

CREATE POLICY integrantes_times_select ON public.integrantes_times
  FOR SELECT TO authenticated
  USING (
    public.is_diretoria()
    OR integrante_id = public.current_integrante_id()
    OR public.is_lider_de_time(time_id)
  );

CREATE POLICY integrantes_times_insert ON public.integrantes_times
  FOR INSERT TO authenticated
  WITH CHECK (public.is_admin() OR public.is_diretoria());

CREATE POLICY integrantes_times_update ON public.integrantes_times
  FOR UPDATE TO authenticated
  USING (public.is_admin() OR public.is_diretoria())
  WITH CHECK (public.is_admin() OR public.is_diretoria());

CREATE POLICY integrantes_times_delete ON public.integrantes_times
  FOR DELETE TO authenticated
  USING (public.is_admin() OR public.is_diretoria());
