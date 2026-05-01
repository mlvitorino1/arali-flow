import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

/**
 * Cliente Supabase com Service Role — bypassa RLS completamente.
 *
 * ⚠️  ATENÇÃO:
 *   - NUNCA importe este client em Client Components ou código de browser.
 *   - Use APENAS em Edge Functions, Server Actions privilegiadas ou scripts de seed.
 *   - A variável SUPABASE_SERVICE_ROLE_KEY nunca deve ter prefixo NEXT_PUBLIC_.
 *
 * Uso (Edge Function / Server Action privilegiada):
 *   import { createSupabaseAdminClient } from '@/lib/supabase/admin'
 *   const supabase = createSupabaseAdminClient()
 *   await supabase.from('usuarios').update({ role: 'admin' }).eq('id', userId)
 */
export function createSupabaseAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!url || !serviceRoleKey) {
    throw new Error(
      '[createSupabaseAdminClient] Variáveis NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas.',
    )
  }

  return createClient<Database>(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
