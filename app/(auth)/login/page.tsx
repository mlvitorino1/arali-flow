import type { Metadata } from "next"
import { BadgeCheck, Factory, ShieldCheck } from "lucide-react"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Acesse o sistema operacional da Arali Móveis.",
}

const loginHighlights = [
  {
    icon: ShieldCheck,
    label: "Acesso protegido",
    description: "Sessão validada por Supabase e rotas protegidas por middleware.",
  },
  {
    icon: Factory,
    label: "Operação em foco",
    description: "Um shell limpo para evoluir projetos, times e fluxo comercial.",
  },
  {
    icon: BadgeCheck,
    label: "Branding aplicado",
    description: "Paleta, tipografia e contraste alinhados ao manual Arali.",
  },
]

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-bg">
      <div className="grid min-h-screen lg:grid-cols-[1.05fr_0.95fr]">
        <section className="relative hidden overflow-hidden border-r border-border bg-surface-1 lg:flex">
          <div className="absolute inset-0 bg-[linear-gradient(135deg,var(--surface-1)_0%,var(--surface-2)_48%,var(--vinho)_100%)]" />
          <div className="absolute inset-x-10 top-10 h-px bg-terracota/30" />
          <div className="relative z-10 flex w-full flex-col justify-between p-10">
            <div className="flex items-center gap-3 font-montserrat text-lg font-semibold text-text-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-terracota font-bold text-bg shadow-card">
                A
              </div>
              Arali Flow
            </div>

            <div className="max-w-xl space-y-8">
              <div className="space-y-4">
                <p className="font-montserrat text-xs font-semibold uppercase text-terracota">
                  Engenharia aplicada à madeira
                </p>
                <h1 className="font-montserrat text-5xl font-light leading-tight text-text-1">
                  A operação inteira com a precisão de uma peça bem marcada.
                </h1>
                <p className="max-w-lg text-base leading-7 text-text-2">
                  Uma base visual sóbria para autenticação, navegação e rotina dos
                  primeiros usuários da Risca.
                </p>
              </div>

              <div className="grid gap-3">
                {loginHighlights.map((item) => (
                  <div
                    key={item.label}
                    className="flex gap-3 rounded-lg border border-border bg-surface-2/80 p-4 shadow-card"
                  >
                    <item.icon
                      className="mt-0.5 h-5 w-5 shrink-0 text-terracota"
                      strokeWidth={1.7}
                      aria-hidden="true"
                    />
                    <div>
                      <h2 className="font-montserrat text-sm font-semibold text-text-1">
                        {item.label}
                      </h2>
                      <p className="mt-1 text-sm leading-6 text-text-2">
                        {item.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <blockquote className="max-w-xl border-l-2 border-terracota pl-5 text-sm leading-6 text-text-2">
              <span aria-hidden="true">“</span>A Arali nasce das raízes da
              família, cresce com a técnica e se consolida como legado.
              <span aria-hidden="true">”</span>
            </blockquote>
          </div>
        </section>

        <section className="flex min-h-screen items-center justify-center px-5 py-10 sm:px-8">
          <div className="w-full max-w-[420px]">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-terracota font-montserrat font-bold text-bg shadow-card">
                A
              </div>
              <span className="font-montserrat text-lg font-semibold text-text-1">
                Arali Flow
              </span>
            </div>

            <div className="rounded-lg border border-border bg-surface-1 p-6 shadow-card sm:p-8">
              <div className="mb-8 space-y-2">
                <p className="font-montserrat text-xs font-semibold uppercase text-terracota">
                  Acesso restrito
                </p>
                <h1 className="font-montserrat text-3xl font-semibold tracking-normal text-text-1">
                  Entrar no Arali Flow
                </h1>
                <p className="text-sm leading-6 text-text-2">
                  Use suas credenciais para acessar a área operacional.
                </p>
              </div>
              <LoginForm />
            </div>
          </div>
        </section>
      </div>
    </main>
  )
}
