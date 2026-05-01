import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import type { Database } from '@/types/database'

/**
 * Cliente Supabase para uso em Server Components, Server Actions e Route Handlers.
 * Lê e escreve cookies automaticamente para manter a sessão do usuário.
 *
 * Uso (Server Component):
 *   const supabase = await createSupabaseServerClient()
 *   const { data: { user } } = await supabase.auth.getUser()
 *
 * Uso (Server Action / Route Handler — read-only):
 *   const supabase = await createSupabaseServerClient()
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies()

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options)
            })
          } catch {
            // setAll é chamado de Server Component — cookies não podem ser
            // setados nesse contexto. O middleware garante a renovação.
          }
        },
      },
    },
  )
}
