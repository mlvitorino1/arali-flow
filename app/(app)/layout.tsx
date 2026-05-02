"use client"

import * as React from "react"
import Link from "next/link"
import {
  Bell,
  FolderKanban,
  Home,
  Moon,
  Newspaper,
  Settings,
  Sun,
  Users,
} from "lucide-react"
import { useTheme } from "@/hooks/use-theme"
import { cn } from "@/lib/utils"

const navItems = [
  { label: "Home", href: "/home", icon: Home, active: true, badge: "3" },
  { label: "Projetos", href: null, icon: FolderKanban, active: false, badge: null },
  { label: "Meu Time", href: null, icon: Users, active: false, badge: null },
  { label: "Feed Geral", href: null, icon: Newspaper, active: false, badge: null },
  { label: "Configurações", href: null, icon: Settings, active: false, badge: null },
] as const

function BrandMark() {
  return (
    <div className="flex items-center gap-3 font-montserrat text-lg font-semibold text-text-1">
      <div className="flex h-9 w-9 items-center justify-center rounded-md bg-terracota font-bold text-bg shadow-card">
        A
      </div>
      <div className="leading-tight">
        <span>Arali Flow</span>
        <p className="text-[10px] font-semibold uppercase text-text-3">
          Risca
        </p>
      </div>
    </div>
  )
}

function ThemeToggle() {
  const { isDark, toggleTheme } = useTheme()
  const Icon = isDark ? Sun : Moon

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className="inline-flex h-9 w-9 items-center justify-center rounded-md text-text-2 hover:bg-surface-2 hover:text-text-1"
      aria-label={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
      title={isDark ? "Ativar tema claro" : "Ativar tema escuro"}
    >
      <Icon className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
    </button>
  )
}

function NavItem({ item, compact = false }: { item: (typeof navItems)[number]; compact?: boolean }) {
  const Icon = item.icon
  const content = (
    <>
      <Icon className="h-4 w-4 shrink-0" strokeWidth={1.7} aria-hidden="true" />
      <span className={cn("truncate", compact && "text-[11px]")}>{item.label}</span>
      {item.badge ? (
        <span className="ml-auto rounded-full border border-terracota/30 bg-terracota/10 px-1.5 py-0.5 font-mono text-[10px] text-terracota">
          {item.badge}
        </span>
      ) : null}
    </>
  )

  if (item.href) {
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-3 rounded-md px-3 py-2.5 text-sm font-medium",
          item.active
            ? "border-l-2 border-vinho bg-surface-2 text-text-1"
            : "text-text-2 hover:bg-surface-3 hover:text-text-1",
          compact && "min-h-12 flex-col justify-center gap-1 px-2 py-1.5"
        )}
      >
        {content}
      </Link>
    )
  }

  return (
    <button
      type="button"
      disabled
      className={cn(
        "flex items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-text-3 opacity-75",
        compact && "min-h-12 flex-col justify-center gap-1 px-2 py-1.5"
      )}
      title="Disponível nas próximas etapas"
    >
      {content}
    </button>
  )
}

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-bg text-text-1">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-72 flex-col border-r border-border bg-surface-1 md:flex">
        <div className="p-6">
          <BrandMark />
        </div>

        <nav className="flex-1 space-y-1 px-4" aria-label="Navegação principal">
          {navItems.map((item) => (
            <NavItem key={item.label} item={item} />
          ))}
        </nav>

        <div className="border-t border-border p-4">
          <div className="rounded-lg border border-border bg-surface-2 p-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full border border-terracota bg-surface-1">
                <span className="font-montserrat text-xs font-semibold text-terracota">
                  MV
                </span>
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-text-1">
                  Marcus Vitorino
                </p>
                <p className="text-xs text-text-3">Admin · LIOMA IT</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      <div className="flex min-h-screen flex-col md:pl-72">
        <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-surface-1/95 px-4 backdrop-blur md:px-6">
          <div className="flex items-center gap-3">
            <div className="md:hidden">
              <BrandMark />
            </div>
            <div className="hidden md:block">
              <p className="font-montserrat text-sm font-semibold uppercase text-text-3">
                Dashboard
              </p>
              <h1 className="font-montserrat text-lg font-semibold text-text-1">
                Página inicial
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="relative inline-flex h-9 w-9 items-center justify-center rounded-md text-text-2 hover:bg-surface-2 hover:text-text-1"
              aria-label="Notificações"
              title="Notificações"
            >
              <Bell className="h-4 w-4" strokeWidth={1.7} aria-hidden="true" />
              <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-terracota" />
            </button>
            <ThemeToggle />
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-terracota bg-surface-2">
              <span className="font-montserrat text-xs font-semibold text-terracota">
                MV
              </span>
            </div>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 pb-24 md:px-6 md:pb-8 lg:px-8">
          {children}
        </main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-4 gap-1 border-t border-border bg-surface-1 p-2 shadow-card md:hidden"
        aria-label="Navegação mobile"
      >
        {navItems.slice(0, 4).map((item) => (
          <NavItem key={item.label} item={item} compact />
        ))}
      </nav>
    </div>
  )
}
