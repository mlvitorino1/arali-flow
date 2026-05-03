-- ============================================================
-- Arali Flow — Validação RLS Phase 0 (RISCA)
-- ============================================================
-- Como usar:
--   1. Abra o Supabase Dashboard → SQL Editor
--   2. Execute cada bloco separadamente, trocando os UUIDs
--      pelos IDs reais dos usuários piloto criados via seed.
--   3. Confirme que cada SELECT retorna APENAS os dados esperados
--      conforme o perfil testado.
-- ============================================================

-- ============================================================
-- SETUP: como obter os IDs dos usuários piloto
-- ============================================================
-- Execute primeiro para descobrir os IDs:
SELECT
  i.id           AS integrante_id,
  i.email,
  i.role_global,
  i.nome_completo,
  it.papel       AS papel_no_time,
  t.nome         AS time_nome
FROM public.integrantes i
LEFT JOIN public.integrantes_times it ON it.integrante_id = i.id AND it.ate IS NULL
LEFT JOIN public.times t ON t.id = it.time_id
ORDER BY i.role_global, i.nome_completo;


-- ============================================================
-- PERFIL 1: integrante comum
-- ============================================================
-- Substitua <UUID_INTEGRANTE_COMUM> pelo id de um integrante
-- com role_global = 'integrante'.
-- ============================================================

-- Simula a sessão do integrante
SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims = '{"sub": "<UUID_AUTH_USER_INTEGRANTE_COMUM>"}';

-- ESPERADO: retorna apenas o próprio perfil
SELECT id, nome_completo, email, role_global
FROM public.integrantes;

-- ESPERADO: retorna apenas seus próprios vínculos de time
SELECT it.*, t.nome AS time_nome
FROM public.integrantes_times it
JOIN public.times t ON t.id = it.time_id;

-- ESPERADO: retorna apenas os times dos quais é membro
SELECT t.id, t.nome, t.slug
FROM public.times t;

-- ESPERADO: retorna todos os ambientes ativos (política permite)
SELECT id, slug, nome
FROM public.ambientes;

-- ESPERADO: NÃO deve conseguir inserir outro integrante (deve falhar)
-- INSERT INTO public.integrantes (usuario_id, nome_completo, email)
-- VALUES (gen_random_uuid(), 'Teste Bloqueio', 'bloqueio@teste.com');
-- Descomente a linha acima para confirmar que dá erro de RLS.

RESET role;
RESET "request.jwt.claims";


-- ============================================================
-- PERFIL 2: lider de time
-- ============================================================
-- Substitua <UUID_AUTH_USER_LIDER> pelo auth.uid() do líder.
-- ============================================================

SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims = '{"sub": "<UUID_AUTH_USER_LIDER>"}';

-- ESPERADO: retorna seu próprio perfil
SELECT id, nome_completo, email, role_global
FROM public.integrantes;

-- ESPERADO: retorna vínculos do seu time (além dos próprios)
SELECT it.integrante_id, it.papel, t.nome AS time_nome
FROM public.integrantes_times it
JOIN public.times t ON t.id = it.time_id;

-- ESPERADO: retorna o(s) time(s) do qual é líder/membro
SELECT t.id, t.nome, t.slug
FROM public.times t;

-- ESPERADO: NÃO pode criar novo time (só admin/diretoria)
-- INSERT INTO public.times (ambiente_id, slug, nome)
-- VALUES ((SELECT id FROM public.ambientes WHERE slug = 'comercial'), 'novo-time', 'Novo Time');
-- Descomente para confirmar erro.

RESET role;
RESET "request.jwt.claims";


-- ============================================================
-- PERFIL 3: diretoria / admin
-- ============================================================
-- Substitua <UUID_AUTH_USER_DIRETORIA> pelo auth.uid() da diretoria.
-- ============================================================

SET LOCAL role = authenticated;
SET LOCAL request.jwt.claims = '{"sub": "<UUID_AUTH_USER_DIRETORIA>"}';

-- ESPERADO: retorna TODOS os integrantes (visibilidade total)
SELECT id, nome_completo, email, role_global
FROM public.integrantes
ORDER BY role_global, nome_completo;

-- ESPERADO: retorna TODOS os vínculos de todos os times
SELECT
  i.nome_completo,
  it.papel,
  t.nome AS time_nome,
  a.nome AS ambiente_nome
FROM public.integrantes_times it
JOIN public.integrantes i ON i.id = it.integrante_id
JOIN public.times t ON t.id = it.time_id
JOIN public.ambientes a ON a.id = t.ambiente_id
WHERE it.ate IS NULL
ORDER BY a.nome, t.nome, it.papel;

-- ESPERADO: retorna TODOS os times (inclusive inativos)
SELECT t.id, t.nome, t.slug, t.ativo
FROM public.times t;

-- ESPERADO: retorna TODOS os ambientes (inclusive inativos)
SELECT id, slug, nome, ativo
FROM public.ambientes;

-- ESPERADO: pode inserir novo ambiente (confirma write para diretoria)
-- INSERT INTO public.ambientes (slug, nome, descricao, ordem)
-- VALUES ('engenharia-test', 'Engenharia Teste', 'Ambiente de teste RLS', 99);
-- Descomente para confirmar. Remova depois.

RESET role;
RESET "request.jwt.claims";


-- ============================================================
-- VERIFICAÇÃO DE SANIDADE — sem sessão
-- ============================================================
-- ESPERADO: sem JWT, nenhuma linha deve ser retornada (RLS bloqueia tudo)

SET LOCAL role = anon;

SELECT count(*) AS deve_ser_zero FROM public.integrantes;
SELECT count(*) AS deve_ser_zero FROM public.ambientes;
SELECT count(*) AS deve_ser_zero FROM public.times;
SELECT count(*) AS deve_ser_zero FROM public.integrantes_times;

RESET role;


-- ============================================================
-- HELPERS — consultas de diagnóstico
-- ============================================================

-- Confirma que RLS está habilitado nas 4 tabelas fundacionais
SELECT
  schemaname,
  tablename,
  rowsecurity AS rls_habilitado
FROM pg_tables
WHERE schemaname = 'public'
  AND tablename IN ('integrantes', 'ambientes', 'times', 'integrantes_times')
ORDER BY tablename;

-- Lista todas as policies ativas
SELECT
  schemaname,
  tablename,
  policyname,
  cmd,
  roles
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, cmd;
