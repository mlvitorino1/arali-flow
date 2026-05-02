import fs from "node:fs"
import path from "node:path"
import { createClient } from "@supabase/supabase-js"

const pilotos = [
  {
    email: "teste@aralimoveis.com.br",
    password: "Arali@123456",
    nomeCompleto: "Usuario Teste Arali",
    apelido: "Teste",
    cargo: "Conta de teste",
    roleGlobal: "admin",
    timeSlug: "diretoria",
    papel: "gestor",
  },
  {
    email: "suelen.piloto@aralimoveis.com.br",
    password: "Arali@123456",
    nomeCompleto: "Suelen Piloto",
    apelido: "Suelen",
    cargo: "Gestora Comercial",
    roleGlobal: "gestor",
    timeSlug: "comercial",
    papel: "gestor",
  },
  {
    email: "bianca.piloto@aralimoveis.com.br",
    password: "Arali@123456",
    nomeCompleto: "Bianca Piloto",
    apelido: "Bianca",
    cargo: "Lider Comercial",
    roleGlobal: "lider_time",
    timeSlug: "comercial",
    papel: "lider",
  },
  {
    email: "franciele.piloto@aralimoveis.com.br",
    password: "Arali@123456",
    nomeCompleto: "Franciele Piloto",
    apelido: "Franciele",
    cargo: "Integrante Comercial",
    roleGlobal: "integrante",
    timeSlug: "comercial",
    papel: "integrante",
  },
  {
    email: "pcp.piloto@aralimoveis.com.br",
    password: "Arali@123456",
    nomeCompleto: "PCP Piloto",
    apelido: "PCP",
    cargo: "Integrante PCP",
    roleGlobal: "integrante",
    timeSlug: "pcp",
    papel: "integrante",
  },
]

function readEnvFile(filePath) {
  if (!fs.existsSync(filePath)) {
    return {}
  }

  return Object.fromEntries(
    fs
      .readFileSync(filePath, "utf8")
      .split(/\r?\n/)
      .filter((line) => line && !line.trim().startsWith("#") && line.includes("="))
      .map((line) => {
        const index = line.indexOf("=")
        return [
          line.slice(0, index),
          line.slice(index + 1).replace(/^['"]|['"]$/g, ""),
        ]
      })
  )
}

const env = {
  ...readEnvFile(path.join(process.cwd(), ".env.local")),
  ...process.env,
}

const url = env.NEXT_PUBLIC_SUPABASE_URL
const serviceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY

if (!url || !serviceRoleKey) {
  throw new Error(
    "Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY antes do seed."
  )
}

const supabase = createClient(url, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

async function findUserByEmail(email) {
  let page = 1

  while (page < 20) {
    const { data, error } = await supabase.auth.admin.listUsers({
      page,
      perPage: 100,
    })

    if (error) throw error

    const found = data.users.find(
      (user) => user.email?.toLowerCase() === email.toLowerCase()
    )

    if (found || data.users.length < 100) {
      return found ?? null
    }

    page += 1
  }

  return null
}

async function ensureAuthUser(piloto) {
  const existing = await findUserByEmail(piloto.email)

  if (existing) {
    const { data, error } = await supabase.auth.admin.updateUserById(
      existing.id,
      {
        password: piloto.password,
        email_confirm: true,
        user_metadata: {
          nome_completo: piloto.nomeCompleto,
          origem: "seed_pilotos_risca",
        },
      }
    )

    if (error) throw error
    return data.user
  }

  const { data, error } = await supabase.auth.admin.createUser({
    email: piloto.email,
    password: piloto.password,
    email_confirm: true,
    user_metadata: {
      nome_completo: piloto.nomeCompleto,
      origem: "seed_pilotos_risca",
    },
  })

  if (error) throw error
  return data.user
}

async function ensurePerfil(piloto, userId) {
  const { data: integrante, error } = await supabase
    .from("integrantes")
    .upsert(
      {
        usuario_id: userId,
        nome_completo: piloto.nomeCompleto,
        apelido: piloto.apelido,
        email: piloto.email,
        cargo: piloto.cargo,
        role_global: piloto.roleGlobal,
        ativo: true,
      },
      { onConflict: "usuario_id" }
    )
    .select("id")
    .single()

  if (error) throw error
  return integrante
}

async function ensurePertencimento(piloto, integranteId) {
  const { data: time, error: timeError } = await supabase
    .from("times")
    .select("id")
    .eq("slug", piloto.timeSlug)
    .single()

  if (timeError) throw timeError

  const { data: existing, error: existingError } = await supabase
    .from("integrantes_times")
    .select("id")
    .eq("integrante_id", integranteId)
    .eq("time_id", time.id)
    .eq("papel", piloto.papel)
    .is("ate", null)
    .maybeSingle()

  if (existingError) throw existingError

  if (existing) {
    return
  }

  const { error } = await supabase.from("integrantes_times").insert({
    integrante_id: integranteId,
    time_id: time.id,
    papel: piloto.papel,
    ate: null,
  })

  if (error) throw error
}

for (const piloto of pilotos) {
  const user = await ensureAuthUser(piloto)
  const integrante = await ensurePerfil(piloto, user.id)
  await ensurePertencimento(piloto, integrante.id)
  console.log(`Seed ok: ${piloto.email}`)
}
