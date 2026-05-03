import { cache } from "react"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import type { Tables } from "@/types/database"

export type ListarClientesParams = {
  busca?: string
  tipo?: "pf" | "pj"
  apenasAtivos?: boolean
}

type Cliente = Tables<"clientes">

type ClienteFilter = {
  is(col: "deletado_em", val: null): ClienteFilter
  order(col: "nome", opts?: { ascending?: boolean }): ClienteFilter
  eq(col: "ativo", val: boolean): ClienteFilter
  eq(col: "tipo", val: "pf" | "pj"): ClienteFilter
  ilike(col: "nome", pattern: string): ClienteFilter
  then<R>(
    onfulfilled: (
      value: { data: Cliente[] | null; error: { message: string } | null },
    ) => R,
  ): Promise<R>
}

type ClienteReader = {
  from(table: "clientes"): {
    select(columns: string): ClienteFilter
  }
}

/**
 * Lista clientes com filtros opcionais. Sempre filtra `deletado_em IS NULL`
 * (clientes arquivados são invisíveis até reativação).
 *
 * Lança erro em falha — Server Component renderizando esta query deve
 * deixar o `error.tsx` do segmento capturar.
 *
 * Cacheado per-request via React `cache()` para evitar re-fetch quando
 * múltiplos slots da mesma página chamam a mesma listagem.
 */
export const listarClientes = cache(
  async (params: ListarClientesParams = {}): Promise<Cliente[]> => {
    const supabase = await createSupabaseServerClient()
    const reader = supabase as unknown as ClienteReader

    let q = reader
      .from("clientes")
      .select("*")
      .is("deletado_em", null)
      .order("nome", { ascending: true })

    if (params.apenasAtivos) q = q.eq("ativo", true)
    if (params.tipo) q = q.eq("tipo", params.tipo)
    if (params.busca && params.busca.trim().length > 0) {
      q = q.ilike("nome", `%${params.busca.trim()}%`)
    }

    const { data, error } = await q
    if (error) {
      throw new Error(`listarClientes falhou: ${error.message}`)
    }
    return data ?? []
  },
)
