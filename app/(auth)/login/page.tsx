import { Metadata } from "next"
import { LoginForm } from "./login-form"

export const metadata: Metadata = {
  title: "Login",
  description: "Acesse o sistema operacional da Arali Móveis.",
}

export default function LoginPage() {
  return (
    <div className="container relative min-h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className="relative hidden h-full flex-col bg-surface-2 p-10 text-white lg:flex border-r border-border">
        <div className="absolute inset-0 bg-vinho" />
        <div className="relative z-20 flex items-center text-lg font-medium font-montserrat text-bg">
          {/* Símbolo genérico por enquanto */}
          <div className="w-8 h-8 mr-3 bg-terracota rounded-md flex items-center justify-center font-bold text-white shadow-md">
            A
          </div>
          Arali Flow
        </div>
        <div className="relative z-20 mt-auto text-bg">
          <blockquote className="space-y-2">
            <p className="text-lg font-medium font-montserrat">
              "A Arali nasce das raízes da família, cresce com a técnica e se consolida como legado."
            </p>
            <footer className="text-sm opacity-80 mt-2">— Engenharia Aplicada à Madeira</footer>
          </blockquote>
        </div>
      </div>
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[380px]">
          <div className="flex flex-col space-y-2 text-center lg:text-left">
            <h1 className="text-3xl font-semibold tracking-tight font-montserrat text-text-1">
              Acesso Restrito
            </h1>
            <p className="text-sm text-text-2">
              Insira suas credenciais para entrar no sistema.
            </p>
          </div>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}
