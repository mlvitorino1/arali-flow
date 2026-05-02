import { spawnSync } from "node:child_process"

const result = spawnSync("supabase", ["--version"], {
  shell: true,
  stdio: "ignore",
})

if (result.status !== 0) {
  console.error(
    [
      "Supabase CLI nao encontrada no PATH.",
      "Instale ou autentique a CLI antes de rodar migrations/tipos.",
      "Com npm: npm install -g supabase",
      "Depois rode: supabase login && supabase link --project-ref <ref>",
    ].join("\n")
  )
  process.exit(1)
}
