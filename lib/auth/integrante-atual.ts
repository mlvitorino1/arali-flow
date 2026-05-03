import { cache } from "react"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Role } from "@/types/domain"

/**
 * Versão "fina" do integrante logado, suficiente para Server Actions
 * que precisam apenas resolver `criado_por_id` ou validar papel global.
 *
 * Para o shell/UI usar dados ricos (memberships, initials, etc.), mantém-se
 * `getPerfilAtual` em `server/queries/auth/perfil-atual.ts`.
 *
 * **Memoização per-request** via React `cache()`: a mesma chamada em
 * múltiplos lugares do mesmo render/Server Action consulta o banco apenas
 * uma vez. Não cruza requests.
 */

export type IntegranteAtual = {
  id: string
  usuarioId: string
  email: string
  nomeCompleto: string
  roleGlobal: Role
}

type IntegranteRow = {
  id: string
  usuario_id: string
  email: string
  nome_completo: string
  role_global: Role
}

type IntegranteReader = {
  from(table: "integrantes"): {
    select(columns: string): {
      eq(
        column: "usuario_id",
        value: string,
      ): {
        is(
          column: "deletado_em",
          value: null,
        ): {
          maybeSingle(): Promise<{
            data: IntegranteRow | null
            error: { message: string } | null
          }>
        }
      }
    }
  }
}

/**
 * Retorna o integrante logado ou `null` se não há sessão / o usuário
 * autenticado ainda não tem `integrantes` associado.
 *
 * Uso típico em Server Action:
 *
 * ```ts
 * const integrante = await getIntegranteAtual()
 * if (!integrante) {
 *   return actionErro("Você precisa estar logado.", "nao_autenticado")
 * }
 * ```
 */
export const getIntegranteAtual = cache(
  async (): Promise<IntegranteAtual | null> => {
    const supabase = await createSupabaseServerClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const reader = supabase as unknown as IntegranteReader
    const { data } = await reader
      .from("integrantes")
      .select("id,usuario_id,email,nome_completo,role_global")
      .eq("usuario_id", user.id)
      .is("deletado_em", null)
      .maybeSingle()

    if (!data) return null

    return {
      id: data.id,
      usuarioId: data.usuario_id,
      email: data.email,
      nomeCompleto: data.nome_completo,
      roleGlobal: data.role_global,
    }
  },
)
