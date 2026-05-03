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
  ClienteUpdateSchema,
  type ClienteUpdateInput,
} from "@/lib/validations/clientes"
import type { Tables } from "@/types/database"

type Cliente = Tables<"clientes">

type ClientePatch = {
  nome?: string
  tipo?: "pf" | "pj"
  documento?: string | null
  email?: string | null
  telefone?: string | null
  observacoes?: string | null
}

type ClienteUpdater = {
  from(table: "clientes"): {
    update(values: ClientePatch): {
      eq(
        column: "id",
        value: string,
      ): {
        is(
          column: "deletado_em",
          value: null,
        ): {
          select(columns: string): {
            single(): Promise<{
              data: Cliente | null
              error: { code?: string; message: string } | null
            }>
          }
        }
      }
    }
  }
}

/**
 * Edita um cliente existente. Patch parcial — só envia ao banco os campos
 * presentes no input. RLS é a única autoridade sobre quem pode editar
 * o quê (integrante Comercial, gestor, diretoria).
 */
export async function editarCliente(
  input: ClienteUpdateInput,
): Promise<ActionResult<Cliente>> {
  const parsed = ClienteUpdateSchema.safeParse(input)
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

  const { id, ...rest } = parsed.data

  // Monta o patch sem chaves undefined (não queremos sobrescrever com null
  // por engano em campos que o usuário não tocou).
  const patch: ClientePatch = {}
  if (rest.nome !== undefined) patch.nome = rest.nome
  if (rest.tipo !== undefined) patch.tipo = rest.tipo
  if (rest.documento !== undefined) patch.documento = rest.documento
  if (rest.email !== undefined) patch.email = rest.email
  if (rest.telefone !== undefined) patch.telefone = rest.telefone
  if (rest.observacoes !== undefined) patch.observacoes = rest.observacoes

  if (Object.keys(patch).length === 0) {
    return actionErro("Nada para atualizar.", "validacao")
  }

  const supabase = await createSupabaseServerClient()
  const updater = supabase as unknown as ClienteUpdater
  const { data, error } = await updater
    .from("clientes")
    .update(patch)
    .eq("id", id)
    .is("deletado_em", null)
    .select("*")
    .single()

  if (error) {
    if (error.code === "23505") {
      return actionErro(
        "Já existe um cliente com esse documento.",
        "conflito",
        { documento: ["Documento já cadastrado."] },
      )
    }
    return actionErroDePostgres(error.code)
  }

  if (!data) {
    return actionErro(
      "Cliente não encontrado ou já arquivado.",
      "nao_encontrado",
    )
  }

  revalidatePath("/ambientes/comercial/clientes")
  return actionOk(data)
}
