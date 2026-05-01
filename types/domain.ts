/**
 * Tipos de domínio Arali Flow.
 * Estes tipos refletem o vocabulário real da Arali — use os nomes PT-BR.
 *
 * Populated conforme as migrations e Server Actions evoluem nas fases do Roadmap.
 */

/* ── Roles ── */
export type Role =
  | 'super_admin'
  | 'admin'
  | 'diretoria'
  | 'gestor'
  | 'lider_time'
  | 'integrante'
  | 'viewer'

/* ── Status de Proposta ── */
export type StatusProposta =
  | 'em_pausa'
  | 'enviada'
  | 'nfp'
  | 'nova'
  | 'aprovada'
  | 'recusada'

/* ── Status Comercial ── */
export type StatusComercial =
  | 'iniciando'
  | 'concorrencia'
  | 'em_execucao'
  | 'execucao'
  | 'em_pausa'
  | 'sem_status'

/* ── Tipos de Proposta ── */
export type TipoProposta =
  | 'pm'
  | 'pn'
  | 'fr'
  | 'mob'
  | 'fch'
  | 'br'
  | 'portas'
  | 'portoes'
  | 'batentes'
  | 'forro'
  | 'manutencao'
  | 'outro'

/* ── Tipos de Parceiros Externos ── */
export type TipoParceiro = 'arquitetura' | 'construtora' | 'gerenciadora' | 'outro'

/* ── Papel em um Time ── */
export type PapelTime = 'gestor' | 'lider' | 'integrante'

/* ── Tipos adicionais serão adicionados conforme as fases avançam ── */
