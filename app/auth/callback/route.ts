import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    // lógica de troca de code por session
  }

  return NextResponse.redirect(new URL('/', request.url))
}
