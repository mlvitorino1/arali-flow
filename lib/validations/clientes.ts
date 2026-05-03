import { z } from "zod"

/**
 * Schemas Zod para a entidade `clientes`.
 *
 * Decisões:
 * - `tipo` segue o CHECK do banco: `'pf' | 'pj'`. Mantemos como literal Zod
 *   (não um enum gerado por TS) porque ainda é um string column com check
 *   constraint, não um enum Postgres.
 * - `documento` aceita CPF/CNPJ apenas com dígitos (sem máscara) — a UI faz
 *   o stripping antes de enviar. Validação dura de algoritmo CPF/CNPJ fica
 *   pra Phase 1 Semana 2 quando integrarmos com a base histórica.
 * - Campos opcionais aceitam string vazia como `null` (UX de form: usuário
 *   apaga o campo, queremos null no banco, não "").
 */

const documentoApenasDigitos = z
  .string()
  .trim()
  .transform((v) => v.replace(/\D/g, ""))
  .refine(
    (v) => v.length === 0 || v.length === 11 || v.length === 14,
    {
      message: "Documento deve ter 11 dígitos (CPF) ou 14 (CNPJ).",
    },
  )

const stringOpcional = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable()

const emailOpcional = z
  .string()
  .trim()
  .transform((v) => (v.length === 0 ? null : v))
  .nullable()
  .refine(
    (v) => v === null || z.string().email().safeParse(v).success,
    { message: "E-mail inválido." },
  )

export const ClienteCreateSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "Nome deve ter pelo menos 2 caracteres.")
    .max(180, "Nome muito longo."),
  tipo: z.enum(["pf", "pj"], {
    message: "Tipo deve ser PF ou PJ.",
  }),
  documento: documentoApenasDigitos.optional().nullable(),
  email: emailOpcional.optional(),
  telefone: stringOpcional.optional(),
  observacoes: stringOpcional.optional(),
})

export type ClienteCreateInput = z.infer<typeof ClienteCreateSchema>

/**
 * Update reutiliza o create + exige `id`. Todos os campos viram opcionais
 * para permitir patch parcial (UX: edita só o telefone, não precisa
 * re-enviar nome).
 */
export const ClienteUpdateSchema = z.object({
  id: z.string().uuid("ID inválido."),
  nome: ClienteCreateSchema.shape.nome.optional(),
  tipo: ClienteCreateSchema.shape.tipo.optional(),
  documento: ClienteCreateSchema.shape.documento,
  email: ClienteCreateSchema.shape.email,
  telefone: ClienteCreateSchema.shape.telefone,
  observacoes: ClienteCreateSchema.shape.observacoes,
})

export type ClienteUpdateInput = z.infer<typeof ClienteUpdateSchema>

export const ClienteArquivarSchema = z.object({
  id: z.string().uuid("ID inválido."),
})

export type ClienteArquivarInput = z.infer<typeof ClienteArquivarSchema>
