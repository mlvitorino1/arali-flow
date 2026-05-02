import { z } from "zod"

export const LoginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
  rememberMe: z.boolean().optional(),
})

export type LoginData = z.infer<typeof LoginSchema>

export const MagicLinkSchema = z.object({
  email: z.string().email("E-mail inválido"),
})

export type MagicLinkData = z.infer<typeof MagicLinkSchema>
