import { cache } from "react"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/database"

type Cliente = Tables<"clientes">

type ClienteReader = {
  from(table: "clientes"): {
    select(columns: string): {
      eq(
        column: "id",
        value: string,
      ): {
        is(
          column: "deletado_em",
          value: null,
        ): {
          maybeSingle(): Promise<{
            data: Cliente | null
            error: { message: string } | null
          }>
        }
      }
    }
  }
}

/**
 * Busca um cliente pelo ID. Retorna `null` se não existe ou está arquivado.
 * Cacheado per-request — útil quando uma página puxa o mesmo cliente em
 * múltiplos slots (header da Pasta + sidebar + header).
 */
export const obterCliente = cache(
  async (id: string): Promise<Cliente | null> => {
    const supabase = await createSupabaseServerClient()
    const reader = supabase as unknown as ClienteReader
    const { data, error } = await reader
      .from("clientes")
      .select("*")
      .eq("id", id)
      .is("deletado_em", null)
      .maybeSingle()

    if (error) throw new Error(`obterCliente falhou: ${error.message}`)
    return data
  },
)
