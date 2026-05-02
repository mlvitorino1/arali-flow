import { NextResponse } from "next/server"
import { createSupabaseServerClient } from "@/lib/supabase/server"

function getSafeRedirectPath(value: string | null) {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return "/home"
  }

  return value
}

export async function GET(request: Request) {
  const url = new URL(request.url)
  const code = url.searchParams.get("code")
  const next = getSafeRedirectPath(url.searchParams.get("next"))

  if (!code) {
    return NextResponse.redirect(new URL("/login?erro=callback", request.url))
  }

  const supabase = await createSupabaseServerClient()
  const { error } = await supabase.auth.exchangeCodeForSession(code)

  if (error) {
    return NextResponse.redirect(new URL("/login?erro=callback", request.url))
  }

  return NextResponse.redirect(new URL(next, request.url))
}
