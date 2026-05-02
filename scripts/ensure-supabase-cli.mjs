import { existsSync } from "node:fs"
import { join } from "node:path"
import { spawnSync } from "node:child_process"

/**
 * Resolve Supabase CLI shipped with the devDependency `supabase` (bin download via postinstall).
 * Works when `node scripts/ensure-supabase-cli.mjs` runs without pnpm injecting `node_modules/.bin` into PATH.
 */
function resolveLocalSupabaseCli() {
  const root = process.cwd()
  if (process.platform === "win32") {
    const exe = join(root, "node_modules", "supabase", "bin", "supabase.exe")
    if (existsSync(exe)) return exe
  }
  const unixLike = join(root, "node_modules", "supabase", "bin", "supabase")
  if (existsSync(unixLike)) return unixLike
  return null
}

const localCli = resolveLocalSupabaseCli()
const result = localCli
  ? spawnSync(localCli, ["--version"], { stdio: "ignore" })
  : spawnSync("supabase", ["--version"], {
      shell: true,
      stdio: "ignore",
    })

if (result.status !== 0) {
  console.error(
    [
      "Supabase CLI nao encontrada.",
      "Neste repositorio: pnpm add -D supabase (e permita o postinstall do pacote; veja pnpm.onlyBuiltDependencies no package.json).",
      "Windows (CLI global no PATH): scoop bucket add supabase https://github.com/supabase/scoop-bucket.git && scoop install supabase",
      "Nao use: npm install -g supabase (nao suportado pelo pacote npm).",
      "Depois: supabase login && supabase link --project-ref <ref>",
    ].join("\n")
  )
  process.exit(1)
}
