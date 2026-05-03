/**
 * Resultado padronizado de Server Actions.
 *
 * Toda Server Action do Arali Flow retorna `ActionResult<T>`. Quem consome
 * (Client Components) trata o caminho feliz (`ok: true`) e o caminho de erro
 * (`ok: false`) como branches distintas — sem optional chaining espalhado.
 *
 * Convenções:
 * - `erro` é sempre uma mensagem em PT-BR pronta para exibir ao humano (toast/banner).
 * - `fieldErrors` só é preenchido em falhas de validação Zod e bate 1:1 com `setError` do RHF.
 * - `codigo` permite UI condicional (ex.: `nao_autenticado` → `router.push('/login')`).
 *
 * Queries (read-only) NÃO usam ActionResult — elas lançam erro e o `error.tsx`
 * do segmento captura. Essa separação é intencional: actions = mutate + UX,
 * queries = leitura + Suspense/error boundary.
 */

export type FieldErrors = Record<string, string[] | undefined>

/**
 * Categorias canônicas de erro. Cada Server Action sempre devolve um código
 * (mesmo nos casos genéricos) para que o cliente possa tomar decisões de UX
 * sem string-match na mensagem.
 */
export type ErroCodigo =
  | "validacao" // Zod falhou (acompanha `fieldErrors`)
  | "nao_autenticado" // sem sessão Supabase
  | "nao_autorizado" // RLS negou ou regra de papel barrou
  | "nao_encontrado" // recurso não existe (ou foi soft-deleted)
  | "conflito" // duplicata, FK violada, unique constraint
  | "banco" // erro inesperado de DB que não cai nas categorias acima
  | "desconhecido" // fallback — registrar e investigar

export type ActionFailure = {
  ok: false
  erro: string
  codigo: ErroCodigo
  fieldErrors?: FieldErrors
}

export type ActionSuccess<T> = {
  ok: true
  data: T
}

export type ActionResult<T = void> = ActionSuccess<T> | ActionFailure

/* ── Helpers para construir resultados ─────────────────────────────── */

export function actionOk<T>(data: T): ActionSuccess<T> {
  return { ok: true, data }
}

export function actionErro(
  erro: string,
  codigo: ErroCodigo,
  fieldErrors?: FieldErrors,
): ActionFailure {
  return { ok: false, erro, codigo, fieldErrors }
}

/**
 * Mapeia códigos de erro do Postgres (vindos de `error.code` do Supabase)
 * para a taxonomia interna. Mensagens são genéricas — cada Action pode
 * substituir por mensagens específicas do domínio (ex.: "Já existe um cliente
 * com esse documento").
 */
export function actionErroDePostgres(code: string | undefined): ActionFailure {
  switch (code) {
    case "23505":
      return actionErro("Esse registro já existe.", "conflito")
    case "23503":
      return actionErro(
        "Não foi possível salvar — referência inválida.",
        "conflito",
      )
    case "42501":
      return actionErro("Você não tem permissão para esta ação.", "nao_autorizado")
    case "PGRST116":
      return actionErro("Registro não encontrado.", "nao_encontrado")
    default:
      return actionErro("Erro ao salvar. Tente novamente.", "banco")
  }
}
