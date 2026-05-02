import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Middleware de autenticação — protege todas as rotas de (app).
 *
 * Fluxo:
 *  1. Renova a sessão do usuário via cookies (Supabase SSR).
 *  2. Se a rota for protegida e não houver sessão → redireciona para /login.
 *  3. Se já estiver logado e acessar /login → redireciona para /home.
 */
export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
    },
  )

  // Renova a sessão — NÃO use getSession() aqui (não é seguro no middleware).
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const { pathname } = request.nextUrl

  const isPublicRoute = pathname.startsWith('/login') || pathname.startsWith('/auth')

  // Rota protegida sem sessão → login
  if (!isPublicRoute && !user) {
    const loginUrl = request.nextUrl.clone()
    loginUrl.pathname = '/login'
    return NextResponse.redirect(loginUrl)
  }

  // Já logado tentando acessar /login → home
  if (isPublicRoute && user && pathname === '/login') {
    const homeUrl = request.nextUrl.clone()
    homeUrl.pathname = '/home'
    return NextResponse.redirect(homeUrl)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Aplica o middleware em todas as rotas EXCETO:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico, sitemap.xml, robots.txt
     * - Arquivos com extensão (png, svg, etc.)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
