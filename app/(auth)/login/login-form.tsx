"use client"

import * as React from "react"
import { AlertCircle, Loader2, LogIn } from "lucide-react"
import { useRouter } from "next/navigation"
import { entrarComSenha } from "@/server/actions/auth/entrar-com-senha"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type FormErrors = {
  email?: string[]
  password?: string[]
  rememberMe?: string[]
}

export function LoginForm() {
  const router = useRouter()
  const [isLoading, setIsLoading] = React.useState(false)
  const [formError, setFormError] = React.useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = React.useState<FormErrors>({})

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setIsLoading(true)
    setFormError(null)
    setFieldErrors({})

    const formData = new FormData(event.currentTarget)
    const result = await entrarComSenha({
      email: String(formData.get("email") ?? ""),
      password: String(formData.get("password") ?? ""),
      rememberMe: formData.get("rememberMe") === "on",
    })

    if (!result.ok) {
      setIsLoading(false)
      setFormError(result.erro)
      setFieldErrors(result.fieldErrors ?? {})
      return
    }

    router.replace("/home")
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-5" noValidate>
      {formError ? (
        <div
          role="alert"
          className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 p-3 text-sm text-danger"
        >
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
          <p>{formError}</p>
        </div>
      ) : null}

      <div className="grid gap-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          name="email"
          placeholder="exemplo@aralimoveis.com.br"
          type="email"
          autoCapitalize="none"
          autoComplete="email"
          autoCorrect="off"
          aria-invalid={Boolean(fieldErrors.email)}
          aria-describedby={fieldErrors.email ? "email-error" : undefined}
          disabled={isLoading}
          required
        />
        {fieldErrors.email ? (
          <p id="email-error" className="text-sm text-danger">
            {fieldErrors.email[0]}
          </p>
        ) : null}
      </div>

      <div className="grid gap-2">
        <div className="flex items-center justify-between gap-4">
          <Label htmlFor="password">Senha</Label>
          <span className="text-xs font-medium text-text-3">
            Recuperação via admin
          </span>
        </div>
        <Input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          aria-invalid={Boolean(fieldErrors.password)}
          aria-describedby={fieldErrors.password ? "password-error" : undefined}
          disabled={isLoading}
          required
        />
        {fieldErrors.password ? (
          <p id="password-error" className="text-sm text-danger">
            {fieldErrors.password[0]}
          </p>
        ) : null}
      </div>

      <div className="flex items-center gap-3 pt-1">
        <Checkbox id="rememberMe" name="rememberMe" disabled={isLoading} />
        <label
          htmlFor="rememberMe"
          className="cursor-pointer select-none text-sm font-medium leading-none text-text-2 peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Manter este dispositivo reconhecido
        </label>
      </div>

      <Button disabled={isLoading} className="mt-2 h-11 w-full gap-2 text-base shadow-md">
        {isLoading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Verificando acesso
          </>
        ) : (
          <>
            <LogIn className="h-4 w-4" aria-hidden="true" />
            Entrar no sistema
          </>
        )}
      </Button>
    </form>
  )
}
