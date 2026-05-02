import * as React from "react"

export default function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-bg">
      {/* Sidebar Simples */}
      <aside className="w-full md:w-64 border-b md:border-b-0 md:border-r border-border bg-surface-1 hidden md:flex flex-col">
        <div className="p-6">
          <div className="flex items-center text-lg font-medium font-montserrat text-text-1">
            <div className="w-8 h-8 mr-3 bg-terracota rounded-md flex items-center justify-center font-bold text-white shadow-md">
              A
            </div>
            Arali Flow
          </div>
        </div>
        <nav className="flex-1 px-4 space-y-2 mt-4">
          <a href="/home" className="flex items-center px-4 py-3 text-sm font-medium rounded-md bg-surface-2 text-text-1 border-l-2 border-vinho">
            Página Inicial
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-text-2 hover:bg-surface-3 hover:text-text-1 transition-colors">
            Projetos
          </a>
          <a href="#" className="flex items-center px-4 py-3 text-sm font-medium rounded-md text-text-2 hover:bg-surface-3 hover:text-text-1 transition-colors">
            Equipe
          </a>
        </nav>
      </aside>

      {/* Área Principal */}
      <main className="flex-1 flex flex-col">
        {/* Header Simples */}
        <header className="h-16 border-b border-border bg-surface-1 flex items-center justify-between px-6">
          <div className="font-montserrat font-semibold text-text-1">Dashboard</div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-surface-2 border border-terracota rounded-full flex items-center justify-center">
              <span className="font-montserrat font-semibold text-terracota text-xs">MV</span>
            </div>
          </div>
        </header>
        
        <div className="flex-1 p-6 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  )
}
