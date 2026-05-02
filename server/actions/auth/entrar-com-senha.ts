"use server"

import { LoginSchema, type LoginData } from "@/lib/validations/auth"
import { createSupabaseServerClient } from "@/lib/supabase/server"

export type EntrarComSenhaResult =
  | { ok: true }
  | {
      ok: false
      erro: string
      fieldErrors?: Partial<Record<keyof LoginData, string[]>>
    }

export async function entrarComSenha(
  input: LoginData
): Promise<EntrarComSenhaResult> {
  const parsed = LoginSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      erro: "Revise os campos destacados.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    return {
      ok: false,
      erro: "E-mail ou senha inválidos.",
    }
  }

  return { ok: true }
}
