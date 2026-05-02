import { createBrowserClient } from '@supabase/ssr'
import type { Database } from '@/types/database'

/**
 * Cliente Supabase para uso em Client Components ('use client').
 * Lê as credenciais das variáveis públicas (NEXT_PUBLIC_*).
 *
 * Uso:
 *   const supabase = createSupabaseBrowserClient()
 *   const { data } = await supabase.from('projetos').select()
 */
export function createSupabaseBrowserClient() {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
