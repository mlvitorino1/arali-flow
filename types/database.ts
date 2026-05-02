/**
 * Tipos auto-gerados pelo Supabase CLI.
 *
 * Para regenerar após migrations:
 *   pnpm types:generate
 *
 * NÃO edite este arquivo manualmente — ele será sobrescrito pelo comando acima.
 * A versão abaixo é um stub para a build compilar antes do primeiro `types:generate`.
 */

export type Database = {
  public: {
    Tables: Record<string, never>
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
  }
}

export type Tables<T extends keyof Database['public']['Tables']> =
  Database['public']['Tables'][T]['Row']

export type Enums<T extends keyof Database['public']['Enums']> =
  Database['public']['Enums'][T]
