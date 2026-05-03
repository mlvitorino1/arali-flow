"use server"

import { revalidatePath } from "next/cache"
import {
  actionErro,
  actionErroDePostgres,
  actionOk,
  type ActionResult,
} from "@/lib/types/action-result"
import { getIntegranteAtual } from "@/lib/auth/integrante-atual"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  ClienteCreateSchema,
  type ClienteCreateInput,
} from "@/lib/validations/clientes"
import type { Tables } from "@/types/database"

type Cliente = Tables<"clientes">

type ClienteWriter = {
  from(table: "clientes"): {
    insert(values: {
      nome: string
      tipo: "pf" | "pj"
      documento: string | null
      email: string | null
      telefone: string | null
      observacoes: string | null
      criado_por_id: string
    }): {
      select(columns: string): {
        single(): Promise<{
          data: Cliente | null
          error: { code?: string; message: string } | null
        }>
      }
    }
  }
}

/**
 * Cria um novo cliente.
 *
 * Ordem de guards: Zod → auth → integrante → DB. Sai no primeiro fail.
 * `criado_por_id` é resolvido **no servidor** a partir do user logado —
 * nunca aceita ID vindo do client.
 */
export async function criarCliente(
  input: ClienteCreateInput,
): Promise<ActionResult<Cliente>> {
  const parsed = ClienteCreateSchema.safeParse(input)
  if (!parsed.success) {
    return actionErro(
      "Revise os campos destacados.",
      "validacao",
      parsed.error.flatten().fieldErrors,
    )
  }

  const integrante = await getIntegranteAtual()
  if (!integrante) {
    return actionErro("Você precisa estar logado.", "nao_autenticado")
  }

  const supabase = await createSupabaseServerClient()
  const writer = supabase as unknown as ClienteWriter
  const { data, error } = await writer
    .from("clientes")
    .insert({
      nome: parsed.data.nome,
      tipo: parsed.data.tipo,
      documento: parsed.data.documento ?? null,
      email: parsed.data.email ?? null,
      telefone: parsed.data.telefone ?? null,
      observacoes: parsed.data.observacoes ?? null,
      criado_por_id: integrante.id,
    })
    .select("*")
    .single()

  if (error || !data) {
    if (error?.code === "23505") {
      return actionErro(
        "Já existe um cliente com esse documento.",
        "conflito",
        { documento: ["Documento já cadastrado."] },
      )
    }
    return actionErroDePostgres(error?.code)
  }

  revalidatePath("/ambientes/comercial/clientes")
  return actionOk(data)
}
