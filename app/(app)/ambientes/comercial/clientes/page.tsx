import type { Metadata } from "next"
import { listarClientes } from "@/server/queries/clientes/listar"
import { ClientesListClient } from "@/components/ambientes/comercial/clientes/clientes-list-client"

export const metadata: Metadata = {
  title: "Clientes — Comercial",
  description: "Cadastro de clientes do Arali Flow",
}

type SearchParams = Promise<{
  busca?: string
  tipo?: "pf" | "pj"
}>

export default async function ClientesPage({
  searchParams,
}: {
  searchParams: SearchParams
}) {
  const sp = await searchParams
  const clientes = await listarClientes({
    busca: sp.busca,
    tipo: sp.tipo,
    apenasAtivos: true,
  })

  return (
    <section className="space-y-6">
      <header className="flex flex-col gap-1">
        <p className="text-xs uppercase tracking-wider text-text-3">
          Ambiente Comercial
        </p>
        <h1 className="font-montserrat text-2xl font-semibold text-text-1">
          Clientes
        </h1>
        <p className="text-sm text-text-2">
          Cadastro de pessoas físicas e jurídicas que contratam a Arali.
        </p>
      </header>

      <ClientesListClient
        clientes={clientes}
        buscaInicial={sp.busca ?? ""}
        tipoInicial={sp.tipo ?? null}
      />
    </section>
  )
}
