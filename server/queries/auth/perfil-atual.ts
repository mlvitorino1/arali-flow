import { cache } from "react"
import type { PapelTime, Role } from "@/types/domain"
import { createSupabaseServerClient } from "@/lib/supabase/server"

type QueryError = {
  message: string
}

type IntegranteRow = {
  id: string
  usuario_id: string
  nome_completo: string
  apelido: string | null
  email: string
  cargo: string | null
  role_global: Role
}

type TimeRow = {
  id: string
  slug: string
  nome: string
}

type IntegranteTimeRow = {
  papel: PapelTime
  time_id: string
  time: TimeRow | null
}

type IntegrantesReader = {
  from(table: "integrantes"): {
    select(columns: string): {
      eq(column: "usuario_id", value: string): {
        maybeSingle(): Promise<{ data: IntegranteRow | null; error: QueryError | null }>
      }
    }
  }
}

type IntegrantesTimesReader = {
  from(table: "integrantes_times"): {
    select(columns: string): {
      eq(column: "integrante_id", value: string): {
        is(
          column: "ate",
          value: null
        ): Promise<{ data: IntegranteTimeRow[] | null; error: QueryError | null }>
      }
    }
  }
}

export type PerfilAtual = {
  id: string | null
  userId: string
  nomeCompleto: string
  apelido: string | null
  email: string
  cargo: string | null
  roleGlobal: Role | "sem_perfil"
  initials: string
  times: Array<{
    id: string
    slug: string
    nome: string
    papel: PapelTime
  }>
}

function getInitials(nome: string, email: string) {
  const parts = nome.trim().split(/\s+/).filter(Boolean)

  if (parts.length >= 2) {
    return `${parts[0]?.[0] ?? ""}${parts[1]?.[0] ?? ""}`.toUpperCase()
  }

  if (parts.length === 1) {
    return parts[0]?.slice(0, 2).toUpperCase() ?? "AF"
  }

  return email.slice(0, 2).toUpperCase()
}

export const getPerfilAtual = cache(async (): Promise<PerfilAtual | null> => {
  const supabase = await createSupabaseServerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return null
  }

  const profileClient = supabase as unknown as IntegrantesReader
  const { data: integrante } = await profileClient
    .from("integrantes")
    .select("id,usuario_id,nome_completo,apelido,email,cargo,role_global")
    .eq("usuario_id", user.id)
    .maybeSingle()

  if (!integrante) {
    const nome =
      typeof user.user_metadata?.nome_completo === "string"
        ? user.user_metadata.nome_completo
        : user.email ?? "Usuário Arali"

    return {
      id: null,
      userId: user.id,
      nomeCompleto: nome,
      apelido: null,
      email: user.email ?? "",
      cargo: "Perfil pendente",
      roleGlobal: "sem_perfil",
      initials: getInitials(nome, user.email ?? ""),
      times: [],
    }
  }

  const membershipClient = supabase as unknown as IntegrantesTimesReader
  const { data: memberships } = await membershipClient
    .from("integrantes_times")
    .select("papel,time_id,time:times(id,slug,nome)")
    .eq("integrante_id", integrante.id)
    .is("ate", null)

  return {
    id: integrante.id,
    userId: user.id,
    nomeCompleto: integrante.nome_completo,
    apelido: integrante.apelido,
    email: integrante.email,
    cargo: integrante.cargo,
    roleGlobal: integrante.role_global,
    initials: getInitials(integrante.nome_completo, integrante.email),
    times: (memberships ?? []).map((membership) => ({
      id: membership.time?.id ?? membership.time_id,
      slug: membership.time?.slug ?? membership.time_id,
      nome: membership.time?.nome ?? "Time",
      papel: membership.papel,
    })),
  }
})
