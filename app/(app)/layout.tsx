import * as React from "react"
import { redirect } from "next/navigation"
import { AppShell } from "@/components/shell/app-shell"
import { getPerfilAtual } from "@/server/queries/auth/perfil-atual"

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const perfil = await getPerfilAtual()

  if (!perfil) {
    redirect("/login")
  }

  return <AppShell perfil={perfil}>{children}</AppShell>
}
