"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Archive, Pencil, Plus, Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ClienteDrawer } from "@/components/ambientes/comercial/clientes/cliente-drawer"
import { arquivarCliente } from "@/server/actions/clientes/arquivar"
import type { Tables } from "@/types/database"

type Cliente = Tables<"clientes">

type Props = {
  clientes: Cliente[]
  buscaInicial: string
  tipoInicial: "pf" | "pj" | null
}

export function ClientesListClient({
  clientes,
  buscaInicial,
  tipoInicial,
}: Props) {
  const router = useRouter()
  const [busca, setBusca] = React.useState(buscaInicial)
  const [tipo, setTipo] = React.useState<"pf" | "pj" | null>(tipoInicial)
  const [drawer, setDrawer] = React.useState<
    | { aberto: false }
    | { aberto: true; modo: "criar" }
    | { aberto: true; modo: "editar"; cliente: Cliente }
  >({ aberto: false })
  const [arquivando, setArquivando] = React.useState<string | null>(null)

  // Aplica filtros via URL search params (Server Component re-renderiza).
  function aplicarFiltros(novoBusca: string, novoTipo: "pf" | "pj" | null) {
    const params = new URLSearchParams()
    if (novoBusca.trim()) params.set("busca", novoBusca.trim())
    if (novoTipo) params.set("tipo", novoTipo)
    const qs = params.toString()
    router.push(`/ambientes/comercial/clientes${qs ? `?${qs}` : ""}`)
  }

  function onSubmitBusca(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    aplicarFiltros(busca, tipo)
  }

  async function onArquivar(cliente: Cliente) {
    if (
      !window.confirm(
        `Arquivar ${cliente.nome}? O cadastro fica oculto, mas os projetos vinculados continuam.`,
      )
    ) {
      return
    }
    setArquivando(cliente.id)
    const result = await arquivarCliente({ id: cliente.id })
    setArquivando(null)
    if (!result.ok) {
      window.alert(result.erro)
      return
    }
    router.refresh()
  }

  return (
    <div className="space-y-4">
      {/* Toolbar: busca + tipo + novo */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <form onSubmit={onSubmitBusca} className="flex flex-1 gap-2">
          <div className="relative flex-1">
            <Search
              className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-text-3"
              aria-hidden
            />
            <Input
              type="search"
              placeholder="Buscar por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9"
            />
          </div>
          <div className="flex gap-1 rounded-md border border-border bg-surface-1 p-1">
            {([null, "pf", "pj"] as const).map((opcao) => (
              <button
                key={opcao ?? "todos"}
                type="button"
                onClick={() => {
                  setTipo(opcao)
                  aplicarFiltros(busca, opcao)
                }}
                className={`rounded px-3 py-1 text-xs font-semibold transition-colors ${
                  tipo === opcao
                    ? "bg-terracota text-bg"
                    : "text-text-2 hover:text-text-1"
                }`}
              >
                {opcao === null ? "Todos" : opcao.toUpperCase()}
              </button>
            ))}
          </div>
        </form>

        <Button onClick={() => setDrawer({ aberto: true, modo: "criar" })}>
          <Plus className="mr-2 h-4 w-4" />
          Novo cliente
        </Button>
      </div>

      {/* Tabela desktop / cards mobile */}
      <div className="overflow-hidden rounded-lg border border-border bg-surface-2">
        {clientes.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-sm text-text-2">
              {buscaInicial || tipoInicial
                ? "Nenhum cliente encontrado para esses filtros."
                : "Nenhum cliente cadastrado ainda."}
            </p>
            {!buscaInicial && !tipoInicial && (
              <Button
                variant="link"
                onClick={() => setDrawer({ aberto: true, modo: "criar" })}
                className="mt-2"
              >
                Cadastrar o primeiro
              </Button>
            )}
          </div>
        ) : (
          <>
            {/* Desktop */}
            <table className="hidden w-full md:table">
              <thead className="border-b border-border bg-surface-1 text-xs uppercase tracking-wider text-text-3">
                <tr>
                  <th className="px-4 py-3 text-left font-semibold">Nome</th>
                  <th className="px-4 py-3 text-left font-semibold">Tipo</th>
                  <th className="px-4 py-3 text-left font-semibold">
                    Documento
                  </th>
                  <th className="px-4 py-3 text-left font-semibold">Contato</th>
                  <th className="px-4 py-3 text-right font-semibold">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {clientes.map((cliente) => (
                  <tr key={cliente.id} className="hover:bg-surface-3">
                    <td className="px-4 py-3 text-sm text-text-1">
                      {cliente.nome}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-2">
                      {cliente.tipo.toUpperCase()}
                    </td>
                    <td className="px-4 py-3 font-jetbrains text-xs text-text-2">
                      {formatarDocumento(cliente.documento, cliente.tipo)}
                    </td>
                    <td className="px-4 py-3 text-sm text-text-2">
                      {cliente.email ?? cliente.telefone ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Editar"
                          onClick={() =>
                            setDrawer({
                              aberto: true,
                              modo: "editar",
                              cliente,
                            })
                          }
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          aria-label="Arquivar"
                          disabled={arquivando === cliente.id}
                          onClick={() => onArquivar(cliente)}
                        >
                          <Archive className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Mobile cards */}
            <ul className="divide-y divide-border md:hidden">
              {clientes.map((cliente) => (
                <li key={cliente.id} className="flex flex-col gap-2 p-4">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-text-1">
                        {cliente.nome}
                      </p>
                      <p className="text-xs text-text-3">
                        {cliente.tipo.toUpperCase()} ·{" "}
                        {formatarDocumento(cliente.documento, cliente.tipo)}
                      </p>
                    </div>
                    <div className="flex shrink-0 gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Editar"
                        onClick={() =>
                          setDrawer({
                            aberto: true,
                            modo: "editar",
                            cliente,
                          })
                        }
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label="Arquivar"
                        disabled={arquivando === cliente.id}
                        onClick={() => onArquivar(cliente)}
                      >
                        <Archive className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  {(cliente.email || cliente.telefone) && (
                    <p className="text-xs text-text-2">
                      {[cliente.email, cliente.telefone]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                </li>
              ))}
            </ul>
          </>
        )}
      </div>

      <ClienteDrawer
        estado={drawer}
        onFechar={() => setDrawer({ aberto: false })}
        onSucesso={() => {
          setDrawer({ aberto: false })
          router.refresh()
        }}
      />
    </div>
  )
}

function formatarDocumento(doc: string | null, tipo: string): string {
  if (!doc) return "—"
  if (tipo === "pf" && doc.length === 11) {
    return `${doc.slice(0, 3)}.${doc.slice(3, 6)}.${doc.slice(6, 9)}-${doc.slice(9)}`
  }
  if (tipo === "pj" && doc.length === 14) {
    return `${doc.slice(0, 2)}.${doc.slice(2, 5)}.${doc.slice(5, 8)}/${doc.slice(8, 12)}-${doc.slice(12)}`
  }
  return doc
}
