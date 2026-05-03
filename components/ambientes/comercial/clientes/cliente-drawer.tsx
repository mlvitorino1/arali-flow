"use client"

import * as React from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Loader2, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  ClienteCreateSchema,
  type ClienteCreateInput,
} from "@/lib/validations/clientes"
import { criarCliente } from "@/server/actions/clientes/criar"
import { editarCliente } from "@/server/actions/clientes/editar"
import type { Tables } from "@/types/database"

type Cliente = Tables<"clientes">

type Estado =
  | { aberto: false }
  | { aberto: true; modo: "criar" }
  | { aberto: true; modo: "editar"; cliente: Cliente }

type Props = {
  estado: Estado
  onFechar: () => void
  onSucesso: () => void
}

type FormValues = {
  nome: string
  tipo: "pf" | "pj"
  documento: string
  email: string
  telefone: string
  observacoes: string
}

const valoresVazios: FormValues = {
  nome: "",
  tipo: "pj",
  documento: "",
  email: "",
  telefone: "",
  observacoes: "",
}

export function ClienteDrawer({ estado, onFechar, onSucesso }: Props) {
  const editando = estado.aberto && estado.modo === "editar" ? estado.cliente : null
  const titulo = editando ? "Editar cliente" : "Novo cliente"

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    setError,
    setValue,
    watch,
  } = useForm<FormValues>({
    resolver: zodResolver(ClienteCreateSchema as never),
    defaultValues: valoresVazios,
  })

  const tipo = watch("tipo")
  const [erroGeral, setErroGeral] = React.useState<string | null>(null)

  // Sempre que o drawer abre/troca de modo, reseta o form com os valores certos.
  React.useEffect(() => {
    setErroGeral(null)
    if (!estado.aberto) return
    if (estado.modo === "editar") {
      reset({
        nome: estado.cliente.nome,
        tipo: estado.cliente.tipo as "pf" | "pj",
        documento: estado.cliente.documento ?? "",
        email: estado.cliente.email ?? "",
        telefone: estado.cliente.telefone ?? "",
        observacoes: estado.cliente.observacoes ?? "",
      })
    } else {
      reset(valoresVazios)
    }
  }, [estado, reset])

  // ESC fecha
  React.useEffect(() => {
    if (!estado.aberto) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onFechar()
    }
    document.addEventListener("keydown", onKey)
    return () => document.removeEventListener("keydown", onKey)
  }, [estado.aberto, onFechar])

  if (!estado.aberto) return null

  async function onSubmit(values: FormValues) {
    setErroGeral(null)
    const input: ClienteCreateInput = {
      nome: values.nome,
      tipo: values.tipo,
      documento: values.documento,
      email: values.email,
      telefone: values.telefone,
      observacoes: values.observacoes,
    }

    const result = editando
      ? await editarCliente({ id: editando.id, ...input })
      : await criarCliente(input)

    if (result.ok) {
      onSucesso()
      return
    }

    if (result.fieldErrors) {
      for (const [campo, mensagens] of Object.entries(result.fieldErrors)) {
        const msg = mensagens?.[0]
        if (msg) setError(campo as keyof FormValues, { message: msg })
      }
    }
    setErroGeral(result.erro)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex"
      role="dialog"
      aria-modal="true"
      aria-label={titulo}
    >
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Fechar"
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={onFechar}
      />

      {/* Drawer */}
      <aside className="flex w-full max-w-md flex-col border-l border-border bg-surface-1 shadow-xl">
        <header className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-montserrat text-lg font-semibold text-text-1">
            {titulo}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={onFechar}
            aria-label="Fechar"
          >
            <X className="h-4 w-4" />
          </Button>
        </header>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-1 flex-col overflow-hidden"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-6 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="cliente-nome">Nome *</Label>
              <Input
                id="cliente-nome"
                autoFocus
                {...register("nome")}
                aria-invalid={!!errors.nome}
              />
              {errors.nome && (
                <p className="text-xs text-error">{errors.nome.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label>Tipo *</Label>
              <div className="flex gap-2">
                {(["pj", "pf"] as const).map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setValue("tipo", t, { shouldDirty: true })}
                    className={`flex-1 rounded-md border px-3 py-2 text-sm font-semibold transition-colors ${
                      tipo === t
                        ? "border-terracota bg-terracota text-bg"
                        : "border-border bg-surface-2 text-text-2 hover:text-text-1"
                    }`}
                  >
                    {t === "pj" ? "Pessoa Jurídica" : "Pessoa Física"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cliente-documento">
                {tipo === "pj" ? "CNPJ" : "CPF"}
              </Label>
              <Input
                id="cliente-documento"
                inputMode="numeric"
                placeholder={tipo === "pj" ? "00000000000000" : "00000000000"}
                {...register("documento")}
                aria-invalid={!!errors.documento}
              />
              {errors.documento && (
                <p className="text-xs text-error">{errors.documento.message}</p>
              )}
              <p className="text-xs text-text-3">Apenas números, sem máscara.</p>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cliente-email">E-mail</Label>
              <Input
                id="cliente-email"
                type="email"
                {...register("email")}
                aria-invalid={!!errors.email}
              />
              {errors.email && (
                <p className="text-xs text-error">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cliente-telefone">Telefone</Label>
              <Input
                id="cliente-telefone"
                type="tel"
                {...register("telefone")}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="cliente-observacoes">Observações</Label>
              <textarea
                id="cliente-observacoes"
                rows={3}
                className="flex w-full rounded-md border border-border bg-surface-1 px-3 py-2 text-sm text-text-1 placeholder:text-text-3 focus-visible:border-terracota focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                {...register("observacoes")}
              />
            </div>

            {erroGeral && (
              <div
                role="alert"
                className="rounded-md border border-error/40 bg-error/10 px-3 py-2 text-sm text-error"
              >
                {erroGeral}
              </div>
            )}
          </div>

          <footer className="flex items-center justify-end gap-2 border-t border-border bg-surface-2 px-6 py-4">
            <Button type="button" variant="ghost" onClick={onFechar}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editando ? "Salvar alterações" : "Cadastrar cliente"}
            </Button>
          </footer>
        </form>
      </aside>
    </div>
  )
}
