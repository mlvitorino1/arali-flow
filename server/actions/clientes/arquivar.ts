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
  ClienteArquivarSchema,
  type ClienteArquivarInput,
} from "@/lib/validations/clientes"

type SoftDeletePatch = {
  deletado_em: string
  ativo: boolean
}

type ClienteSoftDeleter = {
  from(table: "clientes"): {
    update(values: SoftDeletePatch): {
      eq(
        column: "id",
        value: string,
      ): {
        is(
          column: "deletado_em",
          value: null,
        ): {
          select(columns: string): {
            maybeSingle(): Promise<{
              data: { id: string } | null
              error: { code?: string; message: string } | null
            }>
          }
        }
      }
    }
  }
}

/**
 * Arquiva (soft-delete) um cliente. Marca `deletado_em = now()` e
 * `ativo = false`. Toda query subsequente filtra por `deletado_em IS NULL`,
 * então o cliente desaparece da UI mas o histórico de propostas/projetos
 * permanece com FK válida.
 *
 * Reverter o arquivamento será feito numa Server Action separada
 * (`reativarCliente`) quando precisarmos — por ora, soft-delete one-way.
 */
export async function arquivarCliente(
  input: ClienteArquivarInput,
): Promise<ActionResult<{ id: string }>> {
  const parsed = ClienteArquivarSchema.safeParse(input)
  if (!parsed.success) {
    return actionErro(
      "ID de cliente inválido.",
      "validacao",
      parsed.error.flatten().fieldErrors,
    )
  }

  const integrante = await getIntegranteAtual()
  if (!integrante) {
    return actionErro("Você precisa estar logado.", "nao_autenticado")
  }

  const supabase = await createSupabaseServerClient()
  const deleter = supabase as unknown as ClienteSoftDeleter
  const { data, error } = await deleter
    .from("clientes")
    .update({
      deletado_em: new Date().toISOString(),
      ativo: false,
    })
    .eq("id", parsed.data.id)
    .is("deletado_em", null)
    .select("id")
    .maybeSingle()

  if (error) return actionErroDePostgres(error.code)

  if (!data) {
    return actionErro(
      "Cliente não encontrado ou já arquivado.",
      "nao_encontrado",
    )
  }

  revalidatePath("/ambientes/comercial/clientes")
  return actionOk({ id: data.id })
}
