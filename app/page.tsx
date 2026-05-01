import { redirect } from 'next/navigation'

/**
 * Rota raiz — redireciona para o app autenticado.
 * O middleware captura usuários não autenticados e redireciona para /login.
 */
export default function RootPage() {
  redirect('/home')
}
