"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"
import {
  LoginSchema,
  MagicLinkSchema,
  type LoginData,
  type MagicLinkData,
} from "@/lib/validations/auth"
import { createSupabaseServerClient } from "@/lib/supabase/server"
import {
  checkAuthRateLimit,
  clearAuthRateLimit,
  getAuthRateLimitKey,
  recordAuthAttempt,
} from "@/lib/auth/rate-limit"

export type AuthActionResult<TFields extends string = string> =
  | { ok: true; mensagem?: string }
  | {
      ok: false
      erro: string
      fieldErrors?: Partial<Record<TFields, string[]>>
    }

export type EntrarComSenhaResult = AuthActionResult<keyof LoginData & string>
export type EntrarComMagicLinkResult = AuthActionResult<
  keyof MagicLinkData & string
>

async function getClientIp() {
  const headerStore = await headers()
  const forwardedFor = headerStore.get("x-forwarded-for")
  return forwardedFor?.split(",")[0]?.trim() ?? headerStore.get("x-real-ip")
}

function rateLimitMessage(retryAfterSeconds: number) {
  const minutes = Math.max(1, Math.ceil(retryAfterSeconds / 60))
  return `Muitas tentativas. Aguarde ${minutes} min e tente novamente.`
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

  const rateLimitKey = getAuthRateLimitKey(parsed.data.email, await getClientIp())
  const rateLimit = checkAuthRateLimit(rateLimitKey)

  if (!rateLimit.ok) {
    return {
      ok: false,
      erro: rateLimitMessage(rateLimit.retryAfterSeconds),
    }
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  })

  if (error) {
    recordAuthAttempt(rateLimitKey)
    return {
      ok: false,
      erro: "E-mail ou senha inválidos.",
    }
  }

  clearAuthRateLimit(rateLimitKey)
  return { ok: true }
}

export async function entrarComMagicLink(
  input: MagicLinkData
): Promise<EntrarComMagicLinkResult> {
  const parsed = MagicLinkSchema.safeParse(input)

  if (!parsed.success) {
    return {
      ok: false,
      erro: "Informe um e-mail válido.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const rateLimitKey = getAuthRateLimitKey(parsed.data.email, await getClientIp())
  const rateLimit = checkAuthRateLimit(rateLimitKey)

  if (!rateLimit.ok) {
    return {
      ok: false,
      erro: rateLimitMessage(rateLimit.retryAfterSeconds),
    }
  }

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"
  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data.email,
    options: {
      emailRedirectTo: `${appUrl}/auth/callback?next=/home`,
    },
  })

  recordAuthAttempt(rateLimitKey)

  if (error) {
    return {
      ok: false,
      erro: "Não foi possível enviar o link mágico agora.",
    }
  }

  return {
    ok: true,
    mensagem: "Enviamos um link de acesso para o seu e-mail.",
  }
}

export async function sair() {
  const supabase = await createSupabaseServerClient()
  await supabase.auth.signOut()
  redirect("/login")
}
